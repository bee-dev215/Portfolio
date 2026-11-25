import { CSSProperties, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Pencil, Send, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { company, roleBySlug, rolePath, roles, steps } from "@/data/company";
import { roleIcons } from "@/components/site/icons";
import { emailInbox, sendToCrm, tag } from "@/lib/leads";
import { saveMessage } from "@/lib/messagesApi";

// ------------------------------------------------------------
//  Options
// ------------------------------------------------------------

export const OPEN_ROLE = "open"; // an open application, for a role that isn't listed

const EXPERIENCE = ["Less than 1 year", "1–2 years", "3–5 years", "More than 5 years"];
const AVAILABILITY = ["Full-time", "Part-time", "Either"];
const ENGLISH = ["Conversational", "Professional", "Native or bilingual"];
const START = ["Right away", "Within 2 weeks", "Within a month", "Later than that"];

const EMPTY = {
  role: "",
  name: "",
  email: "",
  country: "",
  phone: "",
  link: "",
  experience: "",
  availability: "",
  english: "",
  start: "",
  about: "",
};
type Form = typeof EMPTY;
type Field = keyof Form;

const STEPS = [
  { key: "role", label: "Role" },
  { key: "you", label: "About you" },
  { key: "experience", label: "Experience" },
  { key: "review", label: "Review" },
] as const;

const DRAFT_KEY = "jovano-application";
const MIN_ABOUT = 60;

// A draft is kept on this device only, so a reload or a closed tab doesn't lose the visitor's answers
const loadDraft = (): Partial<Form> => {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}");
  } catch {
    return {};
  }
};
const saveDraft = (f: Form) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(f));
  } catch {
    /* storage unavailable */
  }
};
const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
};

const roleTitle = (slug: string) => (slug === OPEN_ROLE ? "Open application" : roleBySlug(slug)?.title ?? "");
const timeZone = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
})();
const isUrl = (s: string) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+\S*$/i.test(s.trim());

// ------------------------------------------------------------
//  Small pieces
// ------------------------------------------------------------

const labelCls = "mb-1.5 block text-sm font-semibold text-ink";
const errCls = "border-red-400 focus:border-red-400";

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1.5 text-xs text-red-500">{msg}</p> : null;
}

/** A row of pill options that behaves as a radio group. */
function Choice({ name, options, value, onChange, error }: { name: string; options: string[]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <>
      <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                on ? "bg-grad border-transparent text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]" : `border-line bg-surface text-ink-2 hover:border-brand/40 hover:text-ink ${error ? "border-red-400" : ""}`
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
      <Err msg={error} />
    </>
  );
}

function Confetti() {
  const colors = ["#2563eb", "#7c3aed", "#06b6d4", "#bef264", "#f59e0b"];
  return (
    <span className="confetti" aria-hidden="true">
      {Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const r = 90 + (i % 4) * 26;
        return (
          <i
            key={i}
            style={
              {
                background: colors[i % colors.length],
                "--x": `${Math.cos(a) * r}px`,
                "--y": `${Math.sin(a) * r}px`,
                "--r": `${(i % 2 ? 1 : -1) * (180 + i * 20)}deg`,
                "--d": `${(i % 5) * 40}ms`,
              } as CSSProperties
            }
          />
        );
      })}
    </span>
  );
}

// ------------------------------------------------------------
//  Form
// ------------------------------------------------------------

export default function ApplyForm() {
  const [params] = useSearchParams();
  const [form, setForm] = useState<Form>(() => ({ ...EMPTY, ...loadDraft() }));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<Field | "consent", string>>>({});
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<null | { name: string; role: string }>(null);
  const [trap, setTrap] = useState(""); // honeypot
  const top = useRef<HTMLDivElement>(null);

  // Arriving as /apply?role=…&email=…: choose the role and fill the email, then start at the first step still to do
  const roleParam = params.get("role");
  const emailParam = params.get("email");
  useEffect(() => {
    const valid = roleParam === OPEN_ROLE || !!roleBySlug(roleParam ?? undefined);
    setForm((f) => ({ ...f, ...(valid ? { role: roleParam! } : {}), ...(emailParam ? { email: emailParam } : {}) }));
    if (valid) setStep(1);
  }, [roleParam, emailParam]);

  useEffect(() => {
    if (!sent) saveDraft(form);
  }, [form, sent]);

  const set = (k: Field) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const input = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k)(e.target.value);

  const validate = (s: number) => {
    const e: typeof errors = {};
    if (s === 0 && !form.role) e.role = "Choose the role you'd like to apply for";
    if (s === 1) {
      if (form.name.trim().length < 2) e.name = "Please enter your full name";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Please enter a valid email address";
      if (!form.country.trim()) e.country = "Where are you based?";
      if (form.link.trim() && !isUrl(form.link)) e.link = "That doesn't look like a link";
    }
    if (s === 2) {
      if (!form.experience) e.experience = "Pick one";
      if (!form.availability) e.availability = "Pick one";
      if (!form.english) e.english = "Pick one";
      if (!form.start) e.start = "Pick one";
      if (form.about.trim().length < MIN_ABOUT) e.about = `A few more words, please — at least ${MIN_ABOUT} characters`;
    }
    if (s === 3 && !consent) e.consent = "Please confirm to send your application";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const go = (s: number) => {
    setStep(s);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const next = () => validate(step) && go(step + 1);

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (step < 3) return next();
    // Check every step again, in case an earlier one was skipped
    for (let s = 0; s <= 3; s++) {
      if (!validate(s)) return go(s);
    }
    const role = roleTitle(form.role);
    const name = form.name.trim();
    if (trap) {
      setSent({ name, role });
      return;
    }
    setLoading(true);
    const email = form.email.trim();
    const phone = form.phone.trim() || undefined;
    const details = {
      role,
      country: form.country.trim(),
      time_zone: timeZone,
      link: form.link.trim() || undefined,
      experience: form.experience,
      availability: form.availability,
      english: form.english,
      can_start: form.start,
    };
    const message = [
      `Role: ${role}`,
      `Based in: ${details.country}${timeZone ? ` (${timeZone})` : ""}`,
      details.link ? `CV / portfolio: ${details.link}` : "",
      `Experience: ${details.experience}`,
      `Availability: ${details.availability}`,
      `English: ${details.english}`,
      `Can start: ${details.can_start}`,
      "",
      form.about.trim(),
    ]
      .filter((l, i) => l !== "" || i === 7)
      .join("\n");

    try {
      // The database keeps it for /admin, the email reaches the inbox and the CRM keeps the contact. Any one counts as sent.
      const results = await Promise.allSettled([
        saveMessage({ name, email, organisation: details.country, phone: phone ?? null, topic: `Application — ${role}`, message, sms_opt_in: false }),
        emailInbox(`New application: ${role} — ${name}`, { name, email, phone, ...details, about: form.about.trim() }),
        sendToCrm({ name, email, phone, sms_opt_in: false, subject: `Application — ${role}`, message, source: "apply-form", tags: ["website-application", tag(role)] }),
      ]);
      if (results.every((r) => r.status === "rejected")) throw new Error("Request failed");
      clearDraft();
      setSent({ name, role });
      setForm(EMPTY);
      setConsent(false);
      top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      toast.error("We couldn't send your application", { description: `Please try again in a moment, or email us at ${company.email}.` });
    } finally {
      setLoading(false);
    }
  };

  // ---------- Sent ----------
  if (sent) {
    return (
      <div ref={top} className="card shadow-soft scroll-mt-28 rounded-3xl p-7 text-center sm:p-12">
        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          <Confetti />
          <span className="pop-in icon-tile relative h-20 w-20 rounded-full">
            <Check className="h-9 w-9" />
          </span>
        </div>
        <h2 className="mt-7 font-display text-3xl font-medium tracking-[-0.015em] sm:text-4xl">Application received!</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-2">
          Thank you, {sent.name.split(" ")[0]}. Your application for <strong className="text-ink">{sent.role}</strong> is with our team. A real person will read it and get back to you within {company.reviewTime}.
        </p>
        <ol className="mx-auto mt-9 max-w-md space-y-3 text-left">
          {steps.map((s, i) => (
            <li key={s.id} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${i === 0 ? "border-brand/30 bg-brand-soft/50" : "border-line"}`}>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${i === 0 ? "bg-grad text-white" : "bg-raised text-subtle"}`}>
                {i === 0 ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-display font-bold">{s.name}</span>
                <span className="block text-xs text-subtle">{i === 0 ? "Done — nicely" : s.time}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/how-it-works" className="btn btn-primary px-6 py-3 text-sm">
            What happens next <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/faq" className="btn btn-secondary px-6 py-3 text-sm">
            Read the FAQ
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Steps ----------
  const role = roleBySlug(form.role);
  const summary: { label: string; value: ReactNode; step: number }[] = [
    { label: "Role", value: roleTitle(form.role), step: 0 },
    { label: "Name", value: form.name, step: 1 },
    { label: "Email", value: form.email, step: 1 },
    { label: "Based in", value: `${form.country}${timeZone ? ` · ${timeZone}` : ""}`, step: 1 },
    { label: "Phone", value: form.phone || "—", step: 1 },
    { label: "CV / portfolio", value: form.link || "—", step: 1 },
    { label: "Experience", value: form.experience, step: 2 },
    { label: "Availability", value: `${form.availability} · can start ${form.start.toLowerCase()}`, step: 2 },
    { label: "English", value: form.english, step: 2 },
  ];

  return (
    <div ref={top} className="scroll-mt-28">
    <form onSubmit={submit} noValidate className="card shadow-soft overflow-hidden rounded-3xl">
      {/* Progress */}
      <div className="border-b border-line bg-surface px-6 pb-5 pt-6 sm:px-9">
        <ol className="flex items-center gap-2" aria-label="Application progress">
          {STEPS.map((s, i) => {
            const state = i < step ? "done" : i === step ? "now" : "next";
            return (
              <li key={s.key} className="flex flex-1 items-center gap-2" aria-current={state === "now" ? "step" : undefined}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => go(i)}
                  className="flex min-w-0 items-center gap-2 disabled:cursor-default"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-all duration-300 ${
                      state === "now" ? "bg-grad text-white shadow-[0_0_0_5px_rgb(var(--brand-rgb)/.14)]" : state === "done" ? "bg-brand-soft text-brand-text" : "border border-line text-subtle"
                    }`}
                  >
                    {state === "done" ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={`hidden truncate text-sm font-semibold md:block ${state === "next" ? "text-subtle" : "text-ink"}`}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-raised">
                    <span className="bg-grad block h-full transition-transform duration-500 ease-out" style={{ transform: `scaleX(${i < step ? 1 : 0})`, transformOrigin: "left" }} />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div key={step} className="mega-swap p-6 sm:p-9">
        {step === 0 && (
          <fieldset>
            <legend className="font-display text-2xl font-medium tracking-[-0.015em]">Which role would you like?</legend>
            <p className="mt-1.5 text-sm text-ink-2">Choose the one that fits you best — you can mention a second role later.</p>
            <div role="radiogroup" aria-label="Role" className="mt-6 grid gap-3 sm:grid-cols-2">
              {roles.map((r) => {
                const Icon = roleIcons[r.key];
                const on = form.role === r.slug;
                return (
                  <button
                    key={r.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set("role")(r.slug)}
                    className={`book-type flex items-start gap-3 rounded-2xl border p-4 text-left ${on ? "is-on border-brand/50 bg-brand-soft/50" : "border-line bg-surface hover:border-brand/30"}`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${on ? "bg-grad text-white" : "bg-brand-soft text-brand-text"}`}>
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-bold leading-snug">{r.title}</span>
                      <span className="mt-0.5 block text-xs text-subtle">{r.category}</span>
                    </span>
                    <span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${on ? "bg-grad border-transparent text-white" : "border-line-strong"}`}>
                      {on && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                role="radio"
                aria-checked={form.role === OPEN_ROLE}
                onClick={() => set("role")(OPEN_ROLE)}
                className={`book-type flex items-center gap-3 rounded-2xl border border-dashed p-4 text-left sm:col-span-2 ${form.role === OPEN_ROLE ? "is-on border-brand/50 bg-brand-soft/50" : "border-line-strong hover:border-brand/30"}`}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${form.role === OPEN_ROLE ? "bg-grad text-white" : "bg-raised text-ink-2"}`}>
                  <Sparkles className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold">Open application</span>
                  <span className="block text-xs text-subtle">Your role isn't listed? Tell us what you're great at.</span>
                </span>
              </button>
            </div>
            <Err msg={errors.role} />
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-5">
            <div>
              <legend className="font-display text-2xl font-medium tracking-[-0.015em]">Tell us about you</legend>
              <p className="mt-1.5 text-sm text-ink-2">We'll use these details to contact you about your application — nothing else.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="a-name" className={labelCls}>Full name</label>
                <input id="a-name" value={form.name} onChange={input("name")} placeholder="Maria Santos" autoComplete="name" className={`field ${errors.name ? errCls : ""}`} />
                <Err msg={errors.name} />
              </div>
              <div>
                <label htmlFor="a-email" className={labelCls}>Email</label>
                <input id="a-email" type="email" value={form.email} onChange={input("email")} placeholder="maria@email.com" autoComplete="email" className={`field ${errors.email ? errCls : ""}`} />
                <Err msg={errors.email} />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="a-country" className={labelCls}>Country you're based in</label>
                <input id="a-country" value={form.country} onChange={input("country")} placeholder="Philippines" autoComplete="country-name" className={`field ${errors.country ? errCls : ""}`} />
                <Err msg={errors.country} />
                {timeZone && <p className="mt-1.5 text-xs text-subtle">Time zone detected: {timeZone}</p>}
              </div>
              <div>
                <label htmlFor="a-phone" className={labelCls}>
                  Phone or WhatsApp <span className="font-normal text-subtle">(optional)</span>
                </label>
                <input id="a-phone" type="tel" value={form.phone} onChange={input("phone")} placeholder="+63 900 000 0000" autoComplete="tel" className="field" />
              </div>
            </div>
            <div>
              <label htmlFor="a-link" className={labelCls}>
                CV, LinkedIn or portfolio link <span className="font-normal text-subtle">(recommended)</span>
              </label>
              <input id="a-link" type="url" inputMode="url" value={form.link} onChange={input("link")} placeholder="linkedin.com/in/your-name" className={`field ${errors.link ? errCls : ""}`} />
              <Err msg={errors.link} />
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-6">
            <div>
              <legend className="font-display text-2xl font-medium tracking-[-0.015em]">Your experience</legend>
              <p className="mt-1.5 text-sm text-ink-2">
                No wrong answers — this helps us match you{role ? ` as a ${role.title}` : ""} to the right team.
              </p>
            </div>
            <div>
              <p className={labelCls}>Experience in this kind of work</p>
              <Choice name="Experience" options={EXPERIENCE} value={form.experience} onChange={set("experience")} error={errors.experience} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className={labelCls}>You're looking for</p>
                <Choice name="Availability" options={AVAILABILITY} value={form.availability} onChange={set("availability")} error={errors.availability} />
              </div>
              <div>
                <p className={labelCls}>You could start</p>
                <Choice name="Start" options={START} value={form.start} onChange={set("start")} error={errors.start} />
              </div>
            </div>
            <div>
              <p className={labelCls}>Your English</p>
              <Choice name="English" options={ENGLISH} value={form.english} onChange={set("english")} error={errors.english} />
            </div>
            <div>
              <label htmlFor="a-about" className={labelCls}>Tell us about yourself</label>
              <textarea
                id="a-about"
                rows={5}
                value={form.about}
                onChange={input("about")}
                placeholder="What you've done, what you're great at, and why this role? A few honest sentences beat a perfect essay."
                className={`field resize-none ${errors.about ? errCls : ""}`}
              />
              <div className="mt-1.5 flex justify-between gap-3">
                <Err msg={errors.about} />
                <span className={`ml-auto text-xs tabular-nums ${form.about.trim().length >= MIN_ABOUT ? "text-emerald-500" : "text-subtle"}`}>
                  {form.about.trim().length}/{MIN_ABOUT}+
                </span>
              </div>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-2xl font-medium tracking-[-0.015em]">Check and send</h2>
            <p className="mt-1.5 text-sm text-ink-2">Make sure everything looks right. You can edit any section.</p>
            <dl className="mt-6 divide-y divide-line rounded-2xl border border-line">
              {summary.map((r) => (
                <div key={r.label} className="flex items-start gap-4 px-4 py-3 sm:px-5">
                  <dt className="w-32 shrink-0 text-sm text-subtle">{r.label}</dt>
                  <dd className="min-w-0 flex-1 break-words text-sm font-medium">{r.value}</dd>
                  <button type="button" onClick={() => go(r.step)} className="text-subtle transition-colors hover:text-brand-text" aria-label={`Edit ${r.label}`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <div className="px-4 py-3 sm:px-5">
                <dt className="text-sm text-subtle">About you</dt>
                <dd className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-2">{form.about}</dd>
              </div>
            </dl>
            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  setErrors((er) => ({ ...er, consent: undefined }));
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded accent-brand"
              />
              <span>
                The details above are accurate, and I agree that {company.name} can use them to review my application, as set out in the{" "}
                <Link to="/privacy" className="font-medium text-ink underline underline-offset-2 hover:text-brand-text">
                  privacy policy
                </Link>
                .
              </span>
            </label>
            <Err msg={errors.consent} />
          </div>
        )}

        {/* Honeypot — off-screen and skipped by keyboard and screen readers */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="a-website">Website</label>
          <input id="a-website" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </div>

        {/* Actions */}
        <div className="mt-9 flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="btn btn-secondary px-5 py-3 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span className="text-xs text-subtle">Your answers are saved on this device as you go.</span>
          )}
          {step < 3 ? (
            <button type="submit" className="btn btn-primary px-7 py-3.5 text-sm">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn btn-primary px-7 py-3.5 text-sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "Sending…" : "Send application"}
            </button>
          )}
        </div>
        {role && step > 0 && (
          <p className="mt-4 text-center text-xs text-subtle">
            Applying as <Link to={rolePath(role)} className="font-semibold text-ink-2 hover:text-brand-text">{role.title}</Link>
          </p>
        )}
      </div>
    </form>
    </div>
  );
}
