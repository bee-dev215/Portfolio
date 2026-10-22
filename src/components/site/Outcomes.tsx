import { useState } from "react";
import { ArrowRight, BarChart3, BookOpen, Briefcase, Check, Hourglass, LucideIcon, PencilLine } from "lucide-react";
import { Link } from "react-router-dom";
import { solutionPath, solutions } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";
import "./Outcomes.css";

type Mode = "before" | "after";

interface Moment {
  when: string;
  text: string;
}

interface Role {
  key: string;
  label: string;
  icon: LucideIcon;
  intro: string;
  solutions: string[]; // solution titles, linked to their pages
  before: Moment[];
  after: Moment[];
}

// Illustrative, qualitative scenarios — no figures, so nothing here reads as a measured result
const roles: Role[] = [
  {
    key: "teacher",
    label: "Teacher",
    icon: PencilLine,
    intro: "A secondary teacher with five classes and a pile of marking.",
    solutions: ["Assessment Assistant", "AI Tutor"],
    before: [
      { when: "Sunday evening", text: "A stack of essays to mark before Monday. Feedback gets shorter as the night goes on." },
      { when: "Planning", text: "Practice questions written from scratch, again, for next week's lesson." },
      { when: "In class", text: "The same misconceptions surface — but only once the test has been marked." },
    ],
    after: [
      { when: "Sunday evening", text: "Rubric-aligned feedback drafts are ready. The teacher reviews, edits and releases them." },
      { when: "Planning", text: "A question bank mapped to the learning objectives is waiting to be checked." },
      { when: "In class", text: "Topic insights show where the class is stuck before the lesson starts." },
    ],
  },
  {
    key: "learner",
    label: "Learner",
    icon: BookOpen,
    intro: "A first-year student working through problem sets on their own.",
    solutions: ["AI Tutor"],
    before: [
      { when: "Late at night", text: "Stuck on homework with no one to ask — so the answer gets copied just to move on." },
      { when: "Before the exam", text: "Office hours are full, and the same question goes unanswered." },
      { when: "After handing in", text: "Feedback arrives after the class has moved on to the next topic." },
    ],
    after: [
      { when: "Late at night", text: "A tutor grounded in the course gives a hint and asks a question — not the answer." },
      { when: "Before the exam", text: "Help is there whenever they study, with sources from the course material." },
      { when: "After handing in", text: "Feedback lands while the work is still fresh enough to act on." },
    ],
  },
  {
    key: "programme",
    label: "Programme lead",
    icon: BarChart3,
    intro: "A programme lead responsible for hundreds of learners across many courses.",
    solutions: ["Learning Analytics"],
    before: [
      { when: "Start of term", text: "Activity, grades and attendance sit in separate systems and spreadsheets." },
      { when: "Mid-term", text: "Reports are stitched together by hand, so nobody looks until something goes wrong." },
      { when: "End of term", text: "Learners at risk show up in the final results — too late to help." },
    ],
    after: [
      { when: "Start of term", text: "One learning record brings LMS, SIS and app data together." },
      { when: "Mid-term", text: "Early-warning signals flag learners who are falling behind, each with the evidence behind it." },
      { when: "End of term", text: "Advisers have already stepped in, and the dashboards show which interventions helped." },
    ],
  },
  {
    key: "ld",
    label: "L&D manager",
    icon: Briefcase,
    intro: "A learning & development manager onboarding new staff across several teams.",
    solutions: ["Knowledge Assistant", "AI Academy"],
    before: [
      { when: "Onboarding", text: "New starters ask the same questions in chat, and experts answer them again and again." },
      { when: "Everyday work", text: "Policies live in a dozen folders, and nobody is sure which version is current." },
      { when: "Upskilling", text: "AI tools arrive before anyone has shown people how to use them well." },
    ],
    after: [
      { when: "Onboarding", text: "New starters get cited answers from the handbook, at any time of day." },
      { when: "Everyday work", text: "Content owners see which questions are being asked, and fill the gaps." },
      { when: "Upskilling", text: "Hands-on sessions give each team the skills — and the guardrails — to use AI well." },
    ],
  },
];

export default function Outcomes() {
  const [roleKey, setRoleKey] = useState(roles[0].key);
  const [mode, setMode] = useState<Mode>("before");
  const role = roles.find((r) => r.key === roleKey) ?? roles[0];
  const Icon = role.icon;
  const after = mode === "after";
  const linked = role.solutions.map((t) => solutions.find((s) => s.title === t)).filter((s): s is (typeof solutions)[number] => !!s);

  return (
    <section id="outcomes" className="relative overflow-hidden px-5 py-24 sm:px-8 lg:py-32">
      <div className="mesh pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            label="Outcomes"
            title={
              <>
                What changes when AI <span className="gradient-text">takes the busywork.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              The point isn't the model — it's the week of the people using it. Pick a role and switch between before and after.
            </p>
          </SectionHeading>
        </div>

        <Reveal delay={80}>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-1 rounded-full border border-line bg-surface p-1" role="group" aria-label="Choose a role">
                {roles.map((r) => {
                  const RIcon = r.icon;
                  const on = r.key === roleKey;
                  return (
                    <button
                      key={r.key}
                      onClick={() => setRoleKey(r.key)}
                      aria-pressed={on}
                      className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        on ? "bg-grad text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]" : "text-ink-2 hover:text-ink"
                      }`}
                    >
                      <RIcon className="h-4 w-4" /> {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Before / after switch */}
            <div className="relative grid w-full grid-cols-2 rounded-full border border-line bg-raised p-1 sm:w-auto" role="group" aria-label="Show the week before or after">
              <span
                className={`outcome-thumb absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-sm ${after ? "translate-x-full bg-grad" : "bg-surface"}`}
                aria-hidden="true"
              />
              {(["before", "after"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`relative z-10 px-6 py-2 text-sm font-semibold capitalize transition-colors ${mode === m ? (m === "after" ? "text-white" : "text-ink") : "text-subtle hover:text-ink"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-6">
          <div className={`card overflow-hidden rounded-3xl transition-colors duration-500 ${after ? "grad-border" : ""}`}>
            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
              {/* Who */}
              <div className="relative overflow-hidden border-b border-line p-7 sm:p-9 lg:border-b-0 lg:border-r">
                <div className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${after ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
                  <div className="mesh absolute inset-0" />
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl transition-colors duration-500 ${after ? "icon-tile" : "bg-raised text-ink-2"}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="chip text-[11px] uppercase tracking-wider">Illustrative</span>
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-subtle">{after ? "With AI doing the busywork" : "Today"}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">A week as a {role.label.toLowerCase()}</h3>
                  <p className="mt-3 leading-relaxed text-ink-2">{role.intro}</p>

                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-subtle">See how</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {linked.map((s) => (
                        <li key={s.slug}>
                          <Link
                            to={solutionPath(s)}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand-text"
                          >
                            {s.title} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* The week */}
              <ol key={`${role.key}-${mode}`} className="outcome-swap relative space-y-1 p-5 sm:p-7" aria-live="polite">
                {role[mode].map((m, i) => (
                  <li key={m.when} className="flex gap-4 rounded-2xl p-3 sm:p-4" style={{ animationDelay: `${i * 70}ms` }}>
                    <span
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${after ? "bg-brand-soft text-brand-text" : "bg-raised text-subtle"}`}
                      aria-hidden="true"
                    >
                      {after ? <Check className="h-4 w-4" /> : <Hourglass className="h-4 w-4" />}
                    </span>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${after ? "text-brand-text" : "text-subtle"}`}>{m.when}</p>
                      <p className={`mt-1 text-[15px] leading-relaxed sm:text-base ${after ? "text-ink" : "text-ink-2"}`}>{m.text}</p>
                    </div>
                  </li>
                ))}
                {!after && (
                  <li className="px-3 pt-2 sm:px-4">
                    <button onClick={() => setMode("after")} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                      See the same week after <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </li>
                )}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
