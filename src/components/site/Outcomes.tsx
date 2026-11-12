import { useState } from "react";
import { ArrowDown, ArrowRight, BookOpen, Check, Gift, Headset, Hourglass, LucideIcon, Receipt, Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { bookCall, offer, servicePath, services, type ServiceKey, solutionPath, solutions } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";
import "./Outcomes.css";

interface Moment {
  when: string;
  text: string;
}

interface Role {
  key: string;
  label: string;
  icon: LucideIcon;
  week: string; // the comparison's heading
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

/** Home-page "busywork" section: a role's week, before and after side by side, then the free-prototype offer and a call to book. */
export default function Outcomes() {
  const [roleKey, setRoleKey] = useState(roles[0].key);
  const role = roles.find((r) => r.key === roleKey) ?? roles[0];

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
            Every team has a task like this — the re-typing, chasing and copy-paste that quietly fills the week. Pick a role to see the same week before and after.
          </p>
        </SectionHeading>

        {/* Roles, as underlined tabs */}
        <Reveal delay={80}>
          <div className="-mx-5 mt-12 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max min-w-full gap-7 border-b border-line" role="group" aria-label="Choose a role">
              {roles.map((r) => {
                const RIcon = r.icon;
                const on = r.key === roleKey;
                return (
                  <button
                    key={r.key}
                    onClick={() => setRoleKey(r.key)}
                    aria-pressed={on}
                    className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap pb-3.5 text-[15px] font-semibold transition-colors ${on ? "text-ink" : "text-subtle hover:text-ink"}`}
                  >
                    <RIcon className={`h-4 w-4 ${on ? "text-brand-text" : ""}`} /> {r.label}
                    <span className={`outcome-tab-bar bg-grad absolute inset-x-0 -bottom-px h-[3px] rounded-full ${on ? "scale-x-100" : "scale-x-0"}`} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div key={role.key} className="mt-10" aria-live="polite">
            {/* Whose week, and what fixes it */}
            <div className="outcome-swap flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{role.week}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{role.intro}</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-subtle">See how</span>
                {role.links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="inline-flex items-center rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand-text"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* The week, before and after, moment by moment */}
            <div className="mt-8 hidden grid-cols-[8.5rem_1fr_2.5rem_1fr] items-center gap-x-4 pb-3 md:grid" aria-hidden="true">
              <span />
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                <Hourglass className="h-4 w-4" /> Before
              </span>
              <span />
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-text">
                <Sparkles className="h-4 w-4" /> With AI doing the busywork
              </span>
            </div>
            <ol className="outcome-swap mt-6 border-b border-line md:mt-0">
              {role.before.map((b, i) => {
                const a = role.after[i];
                return (
                  <li
                    key={b.when}
                    className="grid gap-3 border-t border-line py-6 md:grid-cols-[8.5rem_1fr_2.5rem_1fr] md:items-center md:gap-x-4"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <p className="font-display text-sm font-bold uppercase tracking-[.12em] text-ink">{b.when}</p>
                    <p className="leading-relaxed text-ink-2">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-subtle md:hidden">Before</span>
                      {b.text}
                    </p>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand-text" aria-hidden="true">
                      <ArrowDown className="h-4 w-4 md:hidden" />
                      <ArrowRight className="hidden h-4 w-4 md:block" />
                    </span>
                    <div className="flex gap-3 rounded-2xl border border-brand/20 bg-surface p-4 shadow-[var(--shadow-card)]">
                      <span className="icon-tile mt-0.5 h-7 w-7 shrink-0 rounded-full" aria-hidden="true">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <p className="leading-relaxed text-ink">
                        <span className="sr-only">After: </span>
                        {a.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-xs text-subtle">Illustrative scenarios, not measured results.</p>
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
