import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Loader2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { company, ENQUIRE_EVENT, nextSteps, socials } from "@/data/company";
import SocialIcon from "./SocialIcon";
import Reveal, { SectionHeading } from "./Reveal";

const CRM_URL = "https://famous.ai/api/crm/6ad5d2059d9fe46e4e2f09d9/subscribe";

const SUBJECTS = ["New AI product", "AI tutor or assistant", "Learning analytics", "LMS integration", "AI training for our team", "Partnership", "Something else"];
const EMPTY = { name: "", email: "", company: "", phone: "", subject: SUBJECTS[0], message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  // SMS consent must be an explicit opt-in, so this starts unchecked
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // "Start a project" / "Discuss this solution" buttons elsewhere on the page open a fresh form, pre-filled for that solution
  useEffect(() => {
    const onEnquire = (e: Event) => {
      const topic = (e as CustomEvent<string | undefined>).detail;
      setSent(false);
      if (!topic) return;
      setForm((f) => (f.message.trim() ? f : { ...f, subject: SUBJECTS[0], message: `We'd like to discuss ${topic} for our organisation. ` }));
    };
    window.addEventListener(ENQUIRE_EVENT, onEnquire);
    return () => window.removeEventListener(ENQUIRE_EVENT, onEnquire);
  }, []);

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
          message: form.company.trim() ? `Organisation: ${form.company.trim()}\n\n${form.message.trim()}` : form.message.trim(),
          source: "contact-form",
          tags: ["website-contact", form.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")],
        }),
      });
      if (!res.ok) throw new Error("Request failed");
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
    <section id="contact" className="relative overflow-hidden px-5 py-24 sm:px-8 lg:py-32">
      <div className="mesh pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1240px]">
        <SectionHeading
          label="Contact"
          title={
            <>
              Let's build something <span className="gradient-text">learners love.</span>
            </>
          }
        >
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            Planning an AI tutor, modernising a platform or training your team? Tell us about it — an engineer, not a salesperson, will reply within {company.responseTime}.
          </p>
        </SectionHeading>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
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
                  <p className="mt-3 max-w-sm text-ink-2">Thanks for contacting {company.legalName}. We'll review your project and reply within {company.responseTime}.</p>
                  <button type="button" onClick={() => setSent(false)} className="u-link mt-6 text-sm font-semibold text-brand-text">
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold">Tell us about your project</h3>
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
                      <input id="c-email" type="email" value={form.email} onChange={set("email")} placeholder="jane@school.edu" autoComplete="email" className={`field ${errors.email ? err : ""}`} />
                      {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-company" className={label}>Organisation <span className="font-normal text-subtle">(optional)</span></label>
                      <input id="c-company" value={form.company} onChange={set("company")} placeholder="Riverside University" autoComplete="organization" className="field" />
                    </div>
                    <div>
                      <label htmlFor="c-phone" className={label}>Phone <span className="font-normal text-subtle">(optional)</span></label>
                      <input id="c-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" autoComplete="tel" className="field" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-subject" className={label}>What can we help with?</label>
                    <select id="c-subject" value={form.subject} onChange={set("subject")} className="field">
                      {SUBJECTS.map((s) => (
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
                      placeholder="Your learners, the problem you want to solve, your platform and timeline…"
                      className={`field resize-none ${errors.message ? err : ""}`}
                    />
                    {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
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
