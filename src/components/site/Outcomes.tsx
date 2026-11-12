import { useState } from "react";
import { BookOpen, Check, Gift, Headset, Hourglass, LucideIcon, Receipt, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { bookCall, offer, servicePath, services, type ServiceKey, solutionPath, solutions } from "@/data/company";
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
  week: string; // the card's heading
  intro: string;
  links: { label: string; to: string }[]; // the solutions and services that fix it
  before: Moment[];
  after: Moment[];
}

const solution = (title: string) => {
  const s = solutions.find((x) => x.title === title)!;
  return { label: s.title, to: solutionPath(s) };
};
const service = (key: ServiceKey) => {
  const s = services.find((x) => x.key === key)!;
  return { label: s.title, to: servicePath(s) };
};

// Illustrative, qualitative scenarios — no figures, so nothing here reads as a measured result
const roles: Role[] = [
  {
    key: "finance",
    label: "Finance & ops",
    icon: Receipt,
    week: "A week in the back office",
    intro: "Keeps the back office of a growing company running — suppliers, invoices and the accounting system.",
    links: [solution("Document AI"), service("automation")],
    before: [
      { when: "Monday", text: "Supplier invoices pile up in the inbox. Each one is opened, read and re-typed into the accounting system." },
      { when: "Midweek", text: "A total doesn't match the purchase order, so it's back to the inbox to chase the supplier." },
      { when: "Month end", text: "Late evenings reconciling spreadsheets before the books can close." },
    ],
    after: [
      { when: "Monday", text: "Invoices are read as they arrive and checked against purchase orders. Clean ones are ready to approve and post." },
      { when: "Midweek", text: "Only the mismatches land in a review queue, with the problem highlighted on the page." },
      { when: "Month end", text: "The numbers are already in the system, so closing the books is a check, not a scramble." },
    ],
  },
  {
    key: "support",
    label: "Customer support",
    icon: Headset,
    week: "A week on the front line",
    intro: "Answers the phones and the inbox for a busy service business with more customers every month.",
    links: [solution("AI Voice Agent"), service("ai")],
    before: [
      { when: "Opening time", text: "Every line is ringing, and the same five questions take up most of the morning." },
      { when: "Lunch", text: "Calls go to voicemail, and the afternoon starts with a list of call-backs." },
      { when: "After hours", text: "New customers who can't get through try the next business on the list." },
    ],
    after: [
      { when: "Opening time", text: "Routine questions, bookings and changes are answered straight away, so the team can focus on the tricky ones." },
      { when: "Lunch", text: "Calls are still answered. Anything sensitive goes to a person, with a written summary instead of a voicemail." },
      { when: "After hours", text: "Appointments are booked and new inquiries qualified, ready for the team in the morning." },
    ],
  },
  {
    key: "team-lead",
    label: "Team lead",
    icon: BookOpen,
    week: "A week of the same questions",
    intro: "Leads a growing team whose know-how lives in handbooks, shared drives and a few people's heads.",
    links: [solution("Knowledge Assistant"), service("ai")],
    before: [
      { when: "Every day", text: "Where's that document? What's the process for this? The same questions land in the same few inboxes." },
      { when: "Onboarding", text: "New starters wait for someone senior to be free before they can get on with the work." },
      { when: "Policy change", text: "An updated procedure goes out by email, and half the team keeps using the old one." },
    ],
    after: [
      { when: "Every day", text: "The team asks an assistant in Slack or Teams that answers from the company's own documents, with a link to the source." },
      { when: "Onboarding", text: "New starters find answers on their own, and senior people get their afternoons back." },
      { when: "Policy change", text: "The assistant answers from the current version the moment it's published, and says so when it doesn't know." },
    ],
  },
  {
    key: "product",
    label: "Product team",
    icon: Rocket,
    week: "A week on the roadmap",
    intro: "Runs a SaaS product whose customers keep asking for AI, with a team already stretched by the roadmap.",
    links: [service("software"), service("ai")],
    before: [
      { when: "Planning", text: "“AI assistant” has sat on the roadmap for two quarters. Nobody has the time to build it properly." },
      { when: "Midweek", text: "A hackathon prototype works in the demo, then gives confident wrong answers on real customer data." },
      { when: "Release day", text: "Nobody knows what each AI call costs, or how to tell if quality has slipped." },
    ],
    after: [
      { when: "Planning", text: "A two-week prototype of the feature, inside the product, on a sample of real customer data." },
      { when: "Midweek", text: "Answers are tested against real cases on every change, and the feature hands off when it isn't sure." },
      { when: "Release day", text: "Cost, speed and quality are monitored from day one, and your engineers own the code." },
    ],
  },
];

/** Home-page "busywork" section: a role's week before and after, then the free-prototype offer and a call to book. */
export default function Outcomes() {
  const [roleKey, setRoleKey] = useState(roles[0].key);
  const [mode, setMode] = useState<Mode>("before");
  const role = roles.find((r) => r.key === roleKey) ?? roles[0];
  const Icon = role.icon;
  const after = mode === "after";

  return (
    <section id="busywork" className="relative overflow-hidden px-5 py-24 sm:px-8 lg:py-32">
      <div className="mesh pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1240px]">
        <SectionHeading
          label="The busywork"
          title={
            <>
              What's eating <span className="gradient-text">your week?</span>
            </>
          }
        >
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            Every team has a task like this — the re-typing, chasing and copy-paste that quietly fills the week. Pick a role, then switch between before and after.
          </p>
        </SectionHeading>

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
            <div className="relative grid w-full shrink-0 grid-cols-2 rounded-full border border-line bg-raised p-1 sm:w-auto" role="group" aria-label="Show the week before or after">
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
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">{role.week}</h3>
                  <p className="mt-3 leading-relaxed text-ink-2">{role.intro}</p>

                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-subtle">See how</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {role.links.map((l) => (
                        <li key={l.to}>
                          <Link
                            to={l.to}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand-text"
                          >
                            {l.label}
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
                      See the same week after
                    </button>
                  </li>
                )}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* The offer, and the call to book */}
        <Reveal delay={160} className="mt-6">
          <div className="foot-cta cta-flow relative overflow-hidden rounded-3xl p-7 text-white sm:p-10">
            <div className="foot-cta-glow pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Gift className="h-3.5 w-3.5" /> {offer.badge}
                </span>
                <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{offer.title}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-white/85">{offer.desc}</p>
              </div>
              <div className="flex flex-col items-start gap-4 lg:items-end">
                <button
                  onClick={() => bookCall()}
                  className="btn magnetic group bg-volt px-6 py-3.5 font-semibold text-[#0b1020] shadow-[0_14px_30px_-12px_rgb(0_0_0/.45)] hover:bg-white"
                >
                  Tell us yours — book a 15-minute call
                </button>
                <Link to="/approach" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition-colors hover:text-white">
                  How the prototype works
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
