import { FormEvent, useState } from "react";
import { ArrowUpRight, Check, Copy, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { profile, socials } from "@/data/portfolio";
import SocialIcon from "./SocialIcon";
import Reveal, { SectionHeading } from "./Reveal";

const CRM_URL = "https://famous.ai/api/crm/6ad5d2059d9fe46e4e2f09d9/subscribe";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Project inquiry", message: "" });
  // SMS consent must be an explicit opt-in, so this starts unchecked
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (form.message.trim().length < 10) e.message = "Message should be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(CRM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          name: form.name.trim() || undefined,
          phone: form.phone.trim() || undefined,
          sms_opt_in: smsOptIn === true,
          subject: form.subject,
          message: form.message.trim(),
          source: "contact-form",
          tags: ["portfolio-contact", form.subject.toLowerCase().replace(/\s+/g, "-")],
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "Project inquiry", message: "" });
      setSmsOptIn(false);
      toast.success("Message sent!", { description: "Thanks for reaching out — I'll reply within 24 hours." });
    } catch {
      toast.error("Something went wrong", { description: "Please try again or reach me by email or phone." });
    } finally {
      setLoading(false);
    }
  };

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      toast.success(`Copied ${value}`);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const field =
    "w-full border bg-paper/60 px-4 py-3 text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-signal focus:bg-paper focus:shadow-[0_0_0_3px_rgba(255,107,26,.15)]";
  const label = "mb-2 block font-code text-[11px] uppercase tracking-[0.18em] text-muted2";

  return (
    <section id="contact" className="bay relative overflow-hidden border-t border-line px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="bay-glow pointer-events-none absolute inset-0" />
      <div className="hazard pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-50" />
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      <div className="relative mx-auto max-w-[1320px]">
        <SectionHeading
          index="06"
          label="Contact"
          title={
            <>
              Let's build something <span className="glow-text text-signal">great.</span>
            </>
          }
        >
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted2">
            Have a project, role or idea in mind? Reach out directly or send a message below — I usually reply within a day.
          </p>
        </SectionHeading>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="space-y-4">
            {socials.map((s, i) => (
              <Reveal key={s.key} delay={i * 80} variant="left">
                <div className="spotlight hud group relative flex items-center gap-5 border border-line bg-paper/50 p-5 transition-colors hover:border-signal/50">
                  <span className="cut-sm grid h-12 w-12 shrink-0 place-items-center bg-signal text-paper transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                    <SocialIcon name={s.key} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-code text-[11px] uppercase tracking-[0.18em] text-muted2">{s.label}</div>
                    <a href={s.href} className="u-link mt-1 block truncate font-display text-lg font-medium tracking-wide">
                      {s.handle}
                    </a>
                  </div>
                  <button
                    onClick={() => copy(s.key, s.handle)}
                    className="grid h-9 w-9 place-items-center text-muted2 transition-colors hover:bg-paper-3 hover:text-signal"
                    aria-label={`Copy ${s.label}`}
                  >
                    {copied === s.key ? <Check className="h-4 w-4 text-signal" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <a href={s.href} className="grid h-9 w-9 place-items-center text-muted2 transition-colors hover:bg-paper-3 hover:text-signal" aria-label={`Open ${s.label}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150} variant="right">
            <form onSubmit={submit} noValidate className="spotlight hud border border-line bg-paper-2/70 p-6 sm:p-8">
              <div className="-mx-6 -mt-6 mb-6 flex items-center justify-between border-b border-line px-6 py-2.5 font-code text-[10px] uppercase tracking-[0.2em] text-muted2 sm:-mx-8 sm:-mt-8 sm:px-8">
                <span>
                  <span className="text-signal">TX</span> // Open channel
                </span>
                <span className="flex items-center gap-2 text-ink">
                  <span className="led" /> Ready
                </span>
              </div>
              {sent ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="cut-sm grid h-16 w-16 place-items-center bg-signal text-paper">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-bold uppercase">Message received</h3>
                  <p className="mt-3 max-w-sm text-muted2">Thanks for reaching out to {profile.firstName}. I'll get back to you shortly.</p>
                  <button type="button" onClick={() => setSent(false)} className="u-link mt-6 font-display text-sm font-medium uppercase tracking-wide text-signal">
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className={label}>Name</label>
                      <input id="c-name" value={form.name} onChange={set("name")} placeholder="Jane Doe" className={`${field} ${errors.name ? "border-red-400" : "border-line"}`} />
                      {errors.name && <p className="mt-1.5 text-xs text-red-300">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-email" className={label}>Email</label>
                      <input id="c-email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" className={`${field} ${errors.email ? "border-red-400" : "border-line"}`} />
                      {errors.email && <p className="mt-1.5 text-xs text-red-300">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-phone" className={label}>Phone (optional)</label>
                      <input id="c-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" className={`${field} border-line`} />
                    </div>
                    <div>
                      <label htmlFor="c-subject" className={label}>Subject</label>
                      <select id="c-subject" value={form.subject} onChange={set("subject")} className={`${field} border-line [&>option]:bg-paper-2`}>
                        <option>Project inquiry</option>
                        <option>Full-time role</option>
                        <option>Contract work</option>
                        <option>Consulting</option>
                        <option>Just saying hi</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-message" className={label}>Message</label>
                    <textarea
                      id="c-message"
                      rows={5}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Tell me about your project, timeline and goals..."
                      className={`${field} resize-none ${errors.message ? "border-red-400" : "border-line"}`}
                    />
                    {errors.message && <p className="mt-1.5 text-xs text-red-300">{errors.message}</p>}
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted2">
                    <input type="checkbox" checked={smsOptIn} onChange={(e) => setSmsOptIn(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#ff6b1a]" />
                    Text me updates. Msg & data rates may apply. Reply STOP to unsubscribe.
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-signal cut-sm flex w-full items-center justify-center gap-2 bg-signal py-4 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-signal-hi disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? "Sending..." : "Send message"}
                  </button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
