import { db, supabase } from "@/lib/supabase";
import { company } from "@/data/company";

export const MESSAGES_TABLE = "messages";
export const REPLIES_TABLE = "message_replies";
export const MESSAGES_KEY = ["messages"] as const;

export type MessageStatus = "new" | "read" | "archived";

/** A reply sent from the admin, by email, to the person who wrote the message. */
export interface ReplyRow {
  id: number;
  message_id: number;
  subject: string;
  body: string;
  sent_by: string;
  created_at: string;
}

/** A message sent through the contact form. */
export interface MessageRow {
  id: number;
  name: string;
  email: string;
  organisation: string | null;
  phone: string | null;
  topic: string | null;
  message: string;
  sms_opt_in: boolean;
  status: MessageStatus;
  created_at: string;
  replies: ReplyRow[]; // oldest first; not a column, joined in by fetchMessages
}

export type MessageInput = Omit<MessageRow, "id" | "status" | "created_at" | "replies">;

// ---------- Public site ----------

/** Keeps a contact-form message for the admin's inbox. Visitors can add messages but never read them back. */
export async function saveMessage(values: MessageInput) {
  if (!supabase) throw new Error("The database isn't connected yet.");
  const { error } = await supabase.from(MESSAGES_TABLE).insert(values);
  if (error) throw error;
}

// ---------- Admin ----------

export async function fetchMessages(): Promise<MessageRow[]> {
  const [messages, replies] = await Promise.all([
    db().from(MESSAGES_TABLE).select("*").order("created_at", { ascending: false }),
    db().from(REPLIES_TABLE).select("*").order("created_at"),
  ]);
  if (messages.error) throw messages.error;
  // Replies are an extra: if their table isn't there yet (setup.sql not run again), the inbox still works
  if (replies.error) console.warn("Replies could not be loaded:", replies.error.message);
  const byMessage = new Map<number, ReplyRow[]>();
  for (const r of (replies.data ?? []) as ReplyRow[]) byMessage.set(r.message_id, [...(byMessage.get(r.message_id) ?? []), r]);
  return (messages.data as Omit<MessageRow, "replies">[]).map((m) => ({ ...m, replies: byMessage.get(m.id) ?? [] }));
}

export async function setMessageStatus(id: number, status: MessageStatus) {
  const { error } = await db().from(MESSAGES_TABLE).update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteMessage(id: number) {
  const { error } = await db().from(MESSAGES_TABLE).delete().eq("id", id);
  if (error) throw error;
}

const SET_UP = "see “Replying from the admin” in supabase/README.md";

/** Emails a reply to whoever sent the message, from the company's Gmail (the send-reply function), and returns it as recorded. */
export async function sendReply(messageId: number, subject: string, body: string): Promise<{ reply?: ReplyRow; warning?: string }> {
  const { data, error } = await db().functions.invoke("send-reply", { body: { messageId, subject, body, fromName: company.name } });
  if (!error) return data;
  const res = (error as { context?: unknown }).context;
  if (res instanceof Response) {
    if (res.status === 404 && !(await res.clone().json().catch(() => null))?.error) throw new Error(`Sending replies isn't set up yet — ${SET_UP}.`);
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error ?? `The reply service answered with an error (${res.status}).`);
  }
  // No answer at all: the function isn't deployed yet, or the connection dropped
  throw new Error(`Couldn't reach the reply service. If it isn't set up yet, ${SET_UP}.`);
}
