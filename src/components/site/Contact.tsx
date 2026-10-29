import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Check, Copy, Loader2, Send } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { booking, company, ENQUIRE_EVENT, nextSteps, socials } from "@/data/company";
import { CONTACT_SUBJECTS, ContactPrefill, PREFILL_EVENT } from "@/components/contact/form";
import { useAvailability } from "@/hooks/use-availability";
import { dayParts, localZone, timeLabel } from "@/lib/booking-time";
import { emailInbox, sendToCrm, tag } from "@/lib/leads";
import { saveMessage } from "@/lib/messagesApi";
import SocialIcon from "./SocialIcon";
import Reveal, { SectionHeading } from "./Reveal";

const EMPTY = { name: "", email: "", company: "", phone: "", subject: CONTACT_SUBJECTS[0] as string, message: "" };
type Form = typeof EMPTY;

// Pre-fills the message for a topic, unless the visitor has already started writing
const forTopic = (topic: string) => (f: Form) =>
  f.message.trim() ? f : { ...f, subject: CONTACT_SUBJECTS[0], message: `We'd like to talk about ${topic} for our business. ` };

/** "Prefer to talk?": the next few open call times, each opening the booking page at that time. */
function NextTimes() {
  const { slots, loading } = useAvailability();
  const zone = localZone();
  const next = slots.slice(0, 3);
  const shortest = Math.min(...booking.callTypes.map((t) => t.minutes));

  return (
    <div className="card p-6">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
        <CalendarDays className="h-4 w-4 text-brand-text" /> Prefer to talk?
      </p>
      <p className="mt-3 font-display text-lg font-bold">Book a free {shortest}-minute call</p>
      {loading ? (
        <div className="mt-4 flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-14 flex-1 animate-pulse rounded-xl bg-raised" />
          ))}
        </div>
      ) : (
        next.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-2" aria-label="Next open times">
            {next.map((s) => {
              const p = dayParts(s, zone);
              return (
                <li key={s.getTime()}>
                  <Link
                    to={`/book?slot=${encodeURIComponent(s.toISOString())}`}
                    className="flex flex-col items-center rounded-xl border border-line bg-surface py-2 text-center transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand-text"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
                      {p.weekday} {p.day}
                    </span>
                    <span className="text-sm font-bold tabular-nums">{timeLabel(s, zone)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )
      )}
      <Link to="/book" className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
        See all times
      </Link>
    </div>
  );
}

/** The enquiry form with direct contact details. On /contact the page hero introduces it, so it can drop its own heading. */
export default function Contact({ showHeading = true }: { showHeading?: boolean }) {
  const [form, setForm] = useState(EMPTY);
  // SMS consent must be an explicit opt-in, so this starts unchecked
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  // Honeypot: hidden from people, so anything typed here came from a bot
  const [trap, setTrap] = useState("");
  const [params] = useSearchParams();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // "Start a project" / "Discuss this solution" buttons elsewhere on the page open a fresh form, pre-filled for that solution.
  // preventDefault tells them the form is here, so they scroll to it instead of opening /contact.
  useEffect(() => {
    const onEnquire = (e: Event) => {
      e.preventDefault();
      const topic = (e as CustomEvent<string | undefined>).detail;
      setSent(false);
      if (topic) setForm(forTopic(topic));
    };
    window.addEventListener(ENQUIRE_EVENT, onEnquire);
    return () => window.removeEventListener(ENQUIRE_EVENT, onEnquire);
  }, []);

  // The project planner on /contact writes a complete brief, so it replaces the subject and message
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const { subject, message } = (e as CustomEvent<ContactPrefill>).detail;
      setSent(false);
      setForm((f) => ({ ...f, subject, message }));
      setErrors((er) => ({ ...er, message: "" }));
      // Hand focus to the first field still empty, once the scroll has started
      window.setTimeout(() => {
        const empty = ["c-name", "c-email"].map((id) => document.getElementById(id) as HTMLInputElement | null).find((el) => el && !el.value);
        (empty ?? document.getElementById("c-message"))?.focus({ preventScroll: true });
      }, 50);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  // Arriving from another page as /contact?topic=…
  const topicParam = params.get("topic");
  useEffect(() => {
    if (topicParam) setForm(forTopic(topicParam));
  }, [topicParam]);

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
    if (trap) {
      // A bot filled the hidden field: show the usual confirmation, send nothing
      setSent(true);
      setForm(EMPTY);
      return;
    }
    setLoading(true);
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim() || undefined;
    const organisation = form.company.trim() || undefined;
    const message = form.message.trim();
    try {
      // The CRM keeps the lead and the SMS consent, the email reaches the inbox, and the database keeps it for /admin → Messages.
      // Any one getting through counts as sent.
      const results = await Promise.allSettled([
        saveMessage({ name, email, organisation: organisation ?? null, phone: phone ?? null, topic: form.subject, message, sms_opt_in: smsOptIn }),
        sendToCrm({
          email,
          name,
          phone,
          sms_opt_in: smsOptIn === true,
          subject: form.subject,
          message: organisation ? `Organization: ${organisation}\n\n${message}` : message,
          source: "contact-form",
          tags: ["website-contact", tag(form.subject)],
        }),
        emailInbox(`New enquiry: ${form.subject} — ${name}`, {
          name,
          email,
          organisation,
          phone,
          topic: form.subject,
          message,
          sms_updates: smsOptIn ? "Yes" : "No",
        }),
      ]);
      if (results.every((r) => r.status === "rejected")) throw new Error("Request failed");
      setSent(true);
      setForm(EMPTY);
      setSmsOptIn(false);
      toast.success("Message sent!", { description: `Thanks for contacting ${company.name} — we'll reply within ${company.responseTime}.` });
    } catch {
      toast.error("Something went wrong", { description: "Please try again or reach us by email or phone." });
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

  const label = "mb-1.5 block text-sm font-semibold text-ink";
  const err = "border-red-400 focus:border-red-400";

  return (
    <section id="contact" className={`relative overflow-hidden px-5 sm:px-8 ${showHeading ? "py-24 lg:py-32" : "py-16 lg:py-24"}`}>
      <div className="mesh pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1240px]">
        {showHeading && (
          <SectionHeading
            label="Contact"
            title={
              <>
                Let's take something <span className="gradient-text">off your plate.</span>
              </>
            }
          >
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
              Describe the task your team keeps doing by hand, or the software you need built. A senior engineer, not a salesperson, replies within {company.responseTime}.
            </p>
          </SectionHeading>
        )}

        <div className={`grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 ${showHeading ? "mt-14" : ""}`}>
          <div className="space-y-4">
            {socials.map((s, i) => (
              <Reveal key={s.key} delay={i * 80} variant="left">
                <div className="card card-hover flex items-center gap-4 p-5">
                  <span className="icon-tile h-12 w-12 shrink-0">
                    <SocialIcon name={s.key} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-subtle">{s.label}</div>
                    <a href={s.href} className="u-link mt-0.5 block truncate font-display text-lg font-bold">
                      {s.handle}
                    </a>
                  </div>
                  <button onClick={() => copy(s.key, s.handle)} className="grid h-9 w-9 place-items-center rounded-full text-subtle transition-colors hover:bg-raised hover:text-brand-text" aria-label={`Copy ${s.label}`}>
                    {copied === s.key ? <Check className="h-4 w-4 text-brand-text" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <a href={s.href} className="grid h-9 w-9 place-items-center rounded-full text-subtle transition-colors hover:bg-raised hover:text-brand-text" aria-label={`Open ${s.label}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            ))}

            <Reveal delay={socials.length * 80} variant="left">
              <NextTimes />
            </Reveal>

            <Reveal delay={(socials.length + 1) * 80} variant="left">
              <div className="card p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-subtle">What happens next</p>
                <ol className="mt-4 space-y-5">
                  {nextSteps.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-text">{i + 1}</span>
                      <div>
                        <p className="font-display font-bold">{step.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} variant="right">
            <form onSubmit={submit} noValidate className="card shadow-soft rounded-3xl p-6 sm:p-9">
              {sent ? (
                <div className="flex min-h-[460px] flex-col items-center justify-center text-center">
                  <div className="icon-tile h-16 w-16">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-extrabold">Message received</h3>
                  <p className="mt-3 max-w-sm text-ink-2">Thanks for contacting {company.name}. We'll read it carefully and reply within {company.responseTime}.</p>
                  <button type="button" onClick={() => setSent(false)} className="u-link mt-6 text-sm font-semibold text-brand-text">
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold">Tell us what you need</h3>
                    <span className="flex items-center gap-2 text-xs font-medium text-subtle">
                      <span className="live-dot" /> Usually replies in a day
                    </span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className={label}>Name</label>
                      <input id="c-name" value={form.name} onChange={set("name")} placeholder="Jane Doe" autoComplete="name" className={`field ${errors.name ? err : ""}`} />
                      {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-email" className={label}>Work email</label>
                      <input id="c-email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" autoComplete="email" className={`field ${errors.email ? err : ""}`} />
                      {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-company" className={label}>Company <span className="font-normal text-subtle">(optional)</span></label>
                      <input id="c-company" value={form.company} onChange={set("company")} placeholder="Acme Property Group" autoComplete="organization" className="field" />
                    </div>
                    <div>
                      <label htmlFor="c-phone" className={label}>Phone <span className="font-normal text-subtle">(optional)</span></label>
                      <input id="c-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" autoComplete="tel" className="field" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-subject" className={label}>What can we help with?</label>
                    <select id="c-subject" value={form.subject} onChange={set("subject")} className="field">
                      {CONTACT_SUBJECTS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="c-message" className={label}>Message</label>
                    <textarea
                      id="c-message"
                      rows={5}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="The task your team does by hand today, the tools involved, and your timeline…"
                      className={`field resize-none ${errors.message ? err : ""}`}
                    />
                    {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
                  </div>
                  {/* Honeypot — off-screen and skipped by keyboard and screen readers */}
                  <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="c-website">Website</label>
                    <input id="c-website" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-subtle">
                    <input type="checkbox" checked={smsOptIn} onChange={(e) => setSmsOptIn(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded accent-brand" />
                    <span>
                      Text me updates about my enquiry. Msg frequency varies; msg & data rates may apply. Reply STOP to unsubscribe, HELP for help. See our{" "}
                      <Link to="/terms#sms" className="font-medium text-ink-2 underline underline-offset-2 hover:text-brand-text">
                        terms
                      </Link>
                      .
                    </span>
                  </label>
                  <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 disabled:opacity-60">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? "Sending..." : "Send message"}
                  </button>
                  <p className="text-center text-xs text-subtle">
                    We use your details to respond to your enquiry, as set out in our{" "}
                    <Link to="/privacy" className="font-medium text-ink-2 underline underline-offset-2 hover:text-brand-text">
                      privacy policy
                    </Link>
                    .
                  </p>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
