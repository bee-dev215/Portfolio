// ============================================================
//  send-reply: emails an admin's reply to someone who wrote in through the contact form, from the company's
//  Gmail, and records it in message_replies. The admin page calls it from the Reply box under a message.
//  Deploy it once, with two secrets (SMTP_USER, SMTP_PASSWORD): see "Replying from the admin" in supabase/README.md.
// ============================================================

import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// The project's public key, so the function can call the database as the signed-in admin
function publicKey(req: Request) {
  const legacy = Deno.env.get("SUPABASE_ANON_KEY");
  if (legacy) return legacy;
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}");
    if (keys.default) return keys.default as string;
  } catch {
    // Not set on this project; fall back to the key the admin page sent
  }
  return req.headers.get("apikey") ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);

  const smtpUser = Deno.env.get("SMTP_USER");
  const smtpPassword = Deno.env.get("SMTP_PASSWORD")?.replace(/\s+/g, ""); // Google shows app passwords in groups of four
  if (!smtpUser || !smtpPassword) {
    return json({ error: "Sending replies isn't set up yet: add the SMTP_USER and SMTP_PASSWORD secrets in Supabase (see supabase/README.md)." }, 501);
  }

  // Everything below runs as the signed-in admin, so the database's own rules decide what they may read and record
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const db = createClient(Deno.env.get("SUPABASE_URL")!, publicKey(req), {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [{ data: admin }, { data: me }] = await Promise.all([db.rpc("is_admin"), db.auth.getUser(token)]);
  if (!admin || !me.user) return json({ error: "Only admins can send replies. Sign in again and retry." }, 403);

  let input: { messageId?: unknown; subject?: unknown; body?: unknown; fromName?: unknown };
  try {
    input = await req.json();
  } catch {
    return json({ error: "The request wasn't valid JSON." }, 400);
  }
  const subject = String(input.subject ?? "").trim();
  const body = String(input.body ?? "").trim();
  const fromName = String(input.fromName ?? "").replace(/["\r\n]/g, "").trim().slice(0, 100);
  if (!Number.isInteger(input.messageId) || !subject || !body) return json({ error: "A reply needs a subject and some text." }, 400);
  if (subject.length > 200 || body.length > 20000) return json({ error: "That reply is too long." }, 400);

  // A reply only ever goes to the address the message came from
  const { data: msg, error: findError } = await db.from("messages").select("id, name, email, message, created_at").eq("id", input.messageId).maybeSingle();
  if (findError) return json({ error: `Couldn't read the message: ${findError.message}` }, 500);
  if (!msg) return json({ error: "That message no longer exists." }, 404);

  const quoted = msg.message
    .split(/\r?\n/)
    .map((line: string) => `> ${line}`)
    .join("\n");
  const text = `${body}\n\n\nOn ${new Date(msg.created_at).toUTCString()}, ${msg.name} wrote:\n${quoted}\n`;

  const port = Number(Deno.env.get("SMTP_PORT") ?? 465); // Supabase blocks outgoing ports 25 and 587
  const mailer = nodemailer.createTransport({
    host: Deno.env.get("SMTP_HOST") ?? "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: smtpUser, pass: smtpPassword },
  });
  try {
    await mailer.sendMail({
      from: fromName ? { name: fromName, address: smtpUser } : smtpUser,
      to: { name: msg.name, address: msg.email },
      subject,
      text,
    });
  } catch (e) {
    const reason = (e as Error).message;
    const hint = /535|Username and Password not accepted|Invalid login/i.test(reason) ? " Check SMTP_USER and SMTP_PASSWORD (a Google app password, not the Gmail password)." : "";
    return json({ error: `The email server didn't accept the reply.${hint} (${reason})` }, 502);
  }

  // The email has gone either way, so failing to record it is a warning, not a failed send
  const { data: reply, error: saveError } = await db
    .from("message_replies")
    .insert({ message_id: msg.id, subject, body, sent_by: me.user.email ?? smtpUser })
    .select()
    .single();
  return json({ reply: reply ?? undefined, warning: saveError ? `It was sent, but couldn't be saved to the conversation: ${saveError.message}` : undefined });
});
