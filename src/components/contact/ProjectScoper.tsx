import { ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ClipboardList, RotateCcw } from "lucide-react";
import { company, industries, services, solutions } from "@/data/company";
import { ContactSubject, prefillContact } from "./form";
import "./ProjectScoper.css";

const NOT_SURE = "Not sure yet";

const stages = [
  { value: "Exploring ideas", desc: "We want to understand what AI could do for us." },
  { value: "A pilot in mind", desc: "We know the problem and want to test a solution." },
  { value: "Ready to build", desc: "We have the go-ahead and want a delivery partner." },
  { value: "Training for our team", desc: "We want our people to build or use AI well." },
];

const timelines = [
  { value: "No rush", desc: "We're planning ahead." },
  { value: "Next term or quarter", desc: "We'd like to start soon." },
  { value: "As soon as possible", desc: "There's a deadline we're working to." },
];

interface Answers {
  building: string[];
  audience: string[];
  stage: string;
  timeline: string;
}

const EMPTY: Answers = { building: [], audience: [], stage: "", timeline: "" };

const STEPS = [
  { key: "building", title: "What are you building?", hint: "Pick any that apply." },
  { key: "audience", title: "Who is it for?", hint: "Pick any that apply." },
  { key: "stage", title: "Where are you now?", hint: "Pick the closest." },
  { key: "timeline", title: "When would you like to start?", hint: "Pick the closest." },
] as const;

/** Chooses the contact-form subject that best matches the answers. */
function subjectFor(a: Answers): ContactSubject {
  const has = (...titles: string[]) => titles.some((t) => a.building.includes(t));
  if (a.stage === "Training for our team" || has("AI Academy", "AI training & upskilling")) return "AI training for our team";
  if (has("AI Tutor", "Assessment Assistant", "Knowledge Assistant")) return "AI tutor or assistant";
  if (has("Learning Analytics", "Learning analytics & data engineering")) return "Learning analytics";
  if (has("Learning platform integration")) return "LMS integration";
  return "New AI product";
}

const list = (items: string[]) => (items.length ? items.join(", ") : NOT_SURE);

function compose(a: Answers) {
  return [
    `Hello ${company.shortName} team,`,
    "",
    `What we're building: ${list(a.building)}`,
    `Who it's for: ${list(a.audience)}`,
    `Where we are: ${a.stage || NOT_SURE}`,
    `Timeline: ${a.timeline || NOT_SURE}`,
    "",
    "A little more about our learners and the problem we want to solve: ",
  ].join("\n");
}

/** A chip-style checkbox: a real input (so it is keyboard and screen-reader friendly) under a styled pill. */
function Chip({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-2 transition-colors hover:border-brand/40 hover:text-ink peer-checked:border-transparent peer-checked:bg-grad peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface">
        {checked && <Check className="h-3.5 w-3.5" />}
        {label}
      </span>
    </label>
  );
}

/** A card-style radio button with a short description. */
function Option({ name, value, desc, checked, onChange }: { name: string; value: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="block h-full cursor-pointer">
      <input type="radio" name={name} value={value} className="peer sr-only" checked={checked} onChange={onChange} />
      <span className="flex h-full items-start gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand/40 peer-checked:border-brand/60 peer-checked:bg-brand-soft peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface">
        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${checked ? "border-brand bg-brand" : "border-line"}`}>
          {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
        </span>
        <span>
          <span className={`block font-semibold ${checked ? "text-brand-text" : "text-ink"}`}>{value}</span>
          <span className="mt-0.5 block text-sm text-ink-2">{desc}</span>
        </span>
      </span>
    </label>
  );
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-wider text-subtle">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/**
 * "Plan your project": four quick questions, then a summary that writes a brief into the contact form below.
 */
export default function ProjectScoper() {
  const [step, setStep] = useState(0); // 0–3 questions, 4 summary
  const [a, setA] = useState<Answers>(EMPTY);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Move focus to the new step's heading, so keyboard and screen-reader users land on the question
  useEffect(() => {
    if (moved.current) heading.current?.focus({ preventScroll: true });
  }, [step]);

  const goTo = (n: number) => {
    moved.current = true;
    setStep(n);
  };

  // "Not sure yet" and specific picks exclude each other
  const toggle = (key: "building" | "audience", value: string) =>
    setA((prev) => {
      const cur = prev[key];
      if (value === NOT_SURE) return { ...prev, [key]: cur.includes(NOT_SURE) ? [] : [NOT_SURE] };
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur.filter((v) => v !== NOT_SURE), value];
      return { ...prev, [key]: next };
    });

  const answered = [a.building.length > 0, a.audience.length > 0, !!a.stage, !!a.timeline];
  const summary = step === STEPS.length;
  const clean = (items: string[]) => items.filter((v) => v !== NOT_SURE);

  const sendBrief = () => {
    const answers = { ...a, building: clean(a.building), audience: clean(a.audience) };
    prefillContact({ subject: subjectFor(answers), message: compose(answers) });
  };

  const restart = () => {
    setA(EMPTY);
    goTo(0);
  };

  return (
    <section aria-labelledby="scoper-title" className="px-5 sm:px-8">
      <div className="card shadow-soft mx-auto max-w-[1240px] overflow-hidden rounded-3xl">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          {/* Intro and progress */}
          <div className="relative overflow-hidden border-b border-line bg-raised/50 p-6 sm:p-9 lg:border-b-0 lg:border-r">
            <div className="mesh pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
            <div className="relative">
              <span className="icon-tile h-12 w-12">
                <ClipboardList className="h-6 w-6" />
              </span>
              <h2 id="scoper-title" className="mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Plan your project
              </h2>
              <p className="mt-3 max-w-sm leading-relaxed text-ink-2">Four quick questions. We'll turn your answers into a brief in the form below — you can edit it before sending.</p>

              <ol className="mt-8 hidden space-y-1 lg:block" aria-label="Steps">
                {[...STEPS.map((s) => s.title), "Your brief"].map((title, i) => {
                  const done = i < STEPS.length ? answered[i] && i !== step : false;
                  const current = i === step;
                  const reachable = i <= step || answered.slice(0, i).every(Boolean);
                  return (
                    <li key={title}>
                      <button
                        type="button"
                        onClick={() => reachable && goTo(i)}
                        disabled={!reachable}
                        aria-current={current ? "step" : undefined}
                        className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition-colors enabled:hover:bg-surface/70 disabled:cursor-default ${current ? "font-semibold text-ink" : "text-ink-2"}`}
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                            current ? "bg-grad text-white" : done ? "bg-brand-soft text-brand-text" : "border border-line bg-surface text-subtle"
                          }`}
                        >
                          {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                        </span>
                        {title}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Current step */}
          <div className="flex min-h-[420px] flex-col p-6 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle" aria-live="polite">
                {summary ? "Your brief" : `Step ${step + 1} of ${STEPS.length}`}
              </p>
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-raised" aria-hidden="true">
                <div className="bg-grad h-full rounded-full transition-[width] duration-500" style={{ width: `${(Math.min(step, STEPS.length) / STEPS.length) * 100}%` }} />
              </div>
            </div>

            <div key={step} className="scoper-step mt-5 flex-1">
              {!summary && (
                <>
                  <h3 ref={heading} tabIndex={-1} className="font-display text-2xl font-bold tracking-tight outline-none">
                    {STEPS[step].title}
                  </h3>
                  <p className="mt-1 text-sm text-subtle">{STEPS[step].hint}</p>
                </>
              )}

              {step === 0 && (
                <div className="mt-6 space-y-6">
                  <Group legend="Solutions">
                    {solutions.map((s) => (
                      <Chip key={s.slug} label={s.title} checked={a.building.includes(s.title)} onChange={() => toggle("building", s.title)} />
                    ))}
                  </Group>
                  <Group legend="Services">
                    {services.map((s) => (
                      <Chip key={s.slug} label={s.title} checked={a.building.includes(s.title)} onChange={() => toggle("building", s.title)} />
                    ))}
                    <Chip label={NOT_SURE} checked={a.building.includes(NOT_SURE)} onChange={() => toggle("building", NOT_SURE)} />
                  </Group>
                </div>
              )}

              {step === 1 && (
                <div className="mt-6">
                  <Group legend="Audiences">
                    {industries.map((ind) => (
                      <Chip key={ind.key} label={ind.title} checked={a.audience.includes(ind.title)} onChange={() => toggle("audience", ind.title)} />
                    ))}
                    <Chip label="Someone else" checked={a.audience.includes("Someone else")} onChange={() => toggle("audience", "Someone else")} />
                    <Chip label={NOT_SURE} checked={a.audience.includes(NOT_SURE)} onChange={() => toggle("audience", NOT_SURE)} />
                  </Group>
                </div>
              )}

              {step === 2 && (
                <fieldset className="mt-6">
                  <legend className="sr-only">{STEPS[2].title}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {stages.map((o) => (
                      <Option key={o.value} name="scoper-stage" {...o} checked={a.stage === o.value} onChange={() => setA((p) => ({ ...p, stage: o.value }))} />
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <fieldset className="mt-6">
                  <legend className="sr-only">{STEPS[3].title}</legend>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {timelines.map((o) => (
                      <Option key={o.value} name="scoper-timeline" {...o} checked={a.timeline === o.value} onChange={() => setA((p) => ({ ...p, timeline: o.value }))} />
                    ))}
                  </div>
                </fieldset>
              )}

              {summary && (
                <div>
                  <h3 ref={heading} tabIndex={-1} className="font-display text-2xl font-bold tracking-tight outline-none">
                    Here's your brief
                  </h3>
                  <p className="mt-1 text-sm text-subtle">
                    It goes in the form as <span className="font-semibold text-ink">{subjectFor({ ...a, building: clean(a.building) })}</span>. Add a few lines about your learners, then send.
                  </p>
                  <pre className="mt-5 whitespace-pre-wrap break-words rounded-2xl border border-line bg-raised/60 p-5 font-sans text-sm leading-relaxed text-ink-2">
                    {compose({ ...a, building: clean(a.building), audience: clean(a.audience) })}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              {step > 0 ? (
                <button type="button" onClick={() => goTo(step - 1)} className="btn btn-secondary px-5 py-2.5 text-sm">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <span />
              )}
              <div className="flex flex-wrap items-center gap-3">
                {(step > 0 || answered.some(Boolean)) && (
                  <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 px-2 text-sm font-semibold text-subtle transition-colors hover:text-ink">
                    <RotateCcw className="h-3.5 w-3.5" /> Start over
                  </button>
                )}
                {summary ? (
                  <button type="button" onClick={sendBrief} className="btn btn-primary px-6 py-3 text-sm">
                    Use this brief <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="button" onClick={() => goTo(step + 1)} disabled={!answered[step]} className="btn btn-primary px-6 py-3 text-sm disabled:pointer-events-none disabled:opacity-50">
                    {step === STEPS.length - 1 ? "See my brief" : "Next"} <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
