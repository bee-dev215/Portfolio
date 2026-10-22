import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Loader2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { company, ENQUIRE_EVENT, nextSteps, socials } from "@/data/company";
import SocialIcon from "./SocialIcon";
import Reveal, { SectionHeading } from "./Reveal";

const CRM_URL = "https://famous.ai/api/crm/6ad5d2059d9fe46e4e2f09d9/subscribe";

const SUBJECTS = ["New robotics project", "Integration or retrofit", "Simulation / digital twin", "Support & operations", "Partnership", "Something else"];
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
      setForm((f) =>
        f.message.trim() ? f : { ...f, subject: SUBJECTS[0], message: `We'd like to discuss ${topic} for our operation. ` }
      );
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
          message: form.company.trim() ? `Company: ${form.company.trim()}\n\n${form.message.trim()}` : form.message.trim(),
          source: "contact-form",
          tags: ["website-contact", form.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")],
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
      setForm(EMPTY);
      setSmsOptIn(false);
      toast.success("Message sent!", { description: `Thanks for contacting ${company.name} — an engineer will reply within ${company.responseTime}.` });
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

  const field =
    "w-full border bg-paper/60 px-4 py-3 text-ink field-well placeholder:text-ink/30 outline-none transition-colors focus:border-signal focus:bg-paper";
  const label = "mb-2 block font-code text-[11px] uppercase tracking-[0.18em] text-muted2";

  return (
    <section id="contact" className="bay relative overflow-hidden border-t border-line px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="bay-glow pointer-events-none absolute inset-0" />
      <div className="hazard pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-50" />
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      <div className="relative mx-auto max-w-[1320px]">
        <SectionHeading
          index="08"
          label="Contact"
          title={
            <>
              Tell us about <span className="glow-text text-beam">your robot.</span>
            </>
          }
        >
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted2">
            Automating a new cell, scaling a fleet or rescuing a stalled robotics project? Send us the details and an engineer — not a salesperson — will reply within {company.responseTime}.
          </p>
        </SectionHeading>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="space-y-4">
            {socials.map((s, i) => (
              <Reveal key={s.key} delay={i * 80} variant="left">
                <div className="spotlight plate hud group relative flex items-center gap-5 border border-line bg-paper/50 p-5 transition-colors hover:border-signal/50">
                  <span className="bevel cut-sm grid h-12 w-12 shrink-0 place-items-center bg-signal text-on-signal transition-colors group-hover:bg-signal-hi">
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
                    className="grid h-9 w-9 place-items-center text-muted2 transition-colors hover:bg-paper-3 hover:text-beam"
                    aria-label={`Copy ${s.label}`}
                  >
                    {copied === s.key ? <Check className="h-4 w-4 text-beam" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <a href={s.href} className="grid h-9 w-9 place-items-center text-muted2 transition-colors hover:bg-paper-3 hover:text-beam" aria-label={`Open ${s.label}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            ))}

            <Reveal delay={socials.length * 80} variant="left">
              <div className="plate border border-line bg-paper/50">
                <div className="border-b border-line px-5 py-2.5 font-code text-[11px] uppercase tracking-[0.2em] text-muted2">What happens next</div>
                <ol>
                  {nextSteps.map((step, i) => (
                    <li key={step.title} className="flex gap-4 border-b border-line px-5 py-4 last:border-b-0">
                      <span className="pt-0.5 font-code text-xs text-beam">0{i + 1}</span>
                      <div>
                        <p className="font-display font-semibold uppercase tracking-wide">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted2">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} variant="right">
            <form onSubmit={submit} noValidate className="spotlight plate hud border border-line bg-paper-2/70 p-6 sm:p-8">
              <div className="-mx-6 -mt-6 mb-6 flex items-center justify-between border-b border-line px-6 py-2.5 font-code text-[10px] uppercase tracking-[0.2em] text-muted2 sm:-mx-8 sm:-mt-8 sm:px-8">
                <span>
                  <span className="text-beam">TX</span> // Open channel
                </span>
                <span className="flex items-center gap-2 text-ink">
                  <span className="led" /> Ready
                </span>
              </div>
              {sent ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="bevel cut-sm grid h-16 w-16 place-items-center bg-signal text-on-signal">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-bold uppercase">Message received</h3>
                  <p className="mt-3 max-w-sm text-muted2">Thanks for contacting {company.legalName}. An engineer will review your project and reply within {company.responseTime}.</p>
                  <button type="button" onClick={() => setSent(false)} className="u-link mt-6 font-display text-sm font-medium uppercase tracking-wide text-beam">
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
                      <label htmlFor="c-company" className={label}>Company (optional)</label>
                      <input id="c-company" value={form.company} onChange={set("company")} placeholder="Acme Manufacturing" autoComplete="organization" className={`${field} border-line`} />
                    </div>
                    <div>
                      <label htmlFor="c-phone" className={label}>Phone (optional)</label>
                      <input id="c-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" className={`${field} border-line`} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-subject" className={label}>Enquiry type</label>
                    <select id="c-subject" value={form.subject} onChange={set("subject")} className={`${field} border-line [&>option]:bg-paper-2`}>
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
                      placeholder="The task, the robots or hardware involved, your site and timeline..."
                      className={`${field} resize-none ${errors.message ? "border-red-400" : "border-line"}`}
                    />
                    {errors.message && <p className="mt-1.5 text-xs text-red-300">{errors.message}</p>}
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted2">
                    <input type="checkbox" checked={smsOptIn} onChange={(e) => setSmsOptIn(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-signal" />
                    <span>
                      Text me updates about my enquiry. Msg frequency varies; msg & data rates may apply. Reply STOP to unsubscribe, HELP for help. See our{" "}
                      <Link to="/terms#sms" className="text-ink/90 underline decoration-line underline-offset-2 hover:text-beam">
                        terms
                      </Link>
                      .
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-signal press cut-sm flex w-full items-center justify-center gap-2 bg-signal py-4 font-display text-sm font-semibold uppercase tracking-wide text-on-signal transition-colors hover:bg-signal-hi disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? "Sending..." : "Send message"}
                  </button>
                  <p className="text-center text-xs text-muted2">
                    We use your details to respond to your enquiry, as set out in our{" "}
                    <Link to="/privacy" className="text-ink/90 underline decoration-line underline-offset-2 hover:text-beam">
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
