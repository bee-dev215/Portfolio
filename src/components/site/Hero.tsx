import { CalendarDays, Gift, GitBranch, ShieldCheck, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { company, offer, servicePath, services, stackGroups } from "@/data/company";
import { serviceIcons } from "./icons";
import AgentConsole from "./AgentConsole";

const badges = [
  { icon: GitBranch, label: "Senior engineers only", tint: "text-iris" },
  { icon: ShieldCheck, label: "You own the code", tint: "text-emerald-500" },
  { icon: Timer, label: "Working software in two weeks", tint: "text-sky2" },
];

// Every tool in the stack, for the strip under the hero
const tools = stackGroups.flatMap((g) => g.items);

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="clouds pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-14">
        {/* message */}
        <div>
          <Link
            to="/book"
            className="fade-up group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pl-1 pr-3.5 text-[13px] font-semibold shadow-sm transition-colors hover:border-brand/40"
            style={{ animationDelay: ".05s" }}
          >
            <span className="bg-grad inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <Gift className="h-3.5 w-3.5" /> Free
            </span>
            {offer.title}
          </Link>

          <h1
            className="fade-up mt-7 font-display text-[clamp(2.5rem,5.2vw,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.035em]"
            style={{ animationDelay: ".12s" }}
          >
            <span className="block">AI agents that</span>
            <span className="block">give your team</span>
            <span className="gradient-text">its week back.</span>
          </h1>

          <p className="fade-up mt-6 max-w-[580px] text-lg leading-relaxed text-ink-2" style={{ animationDelay: ".2s" }}>
            {company.tagline}
          </p>

          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: ".28s" }}>
            <Link to="/book" className="btn btn-primary px-7 py-3.5">
              Book a free call <CalendarDays className="h-4 w-4" />
            </Link>
            <Link to="/projects" className="btn btn-secondary px-7 py-3.5">
              See our work
            </Link>
          </div>

          <ul className="fade-up mt-7 flex flex-wrap gap-x-5 gap-y-2" style={{ animationDelay: ".34s" }}>
            {badges.map(({ icon: Icon, label, tint }) => (
              <li key={label} className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-2">
                <Icon className={`h-4 w-4 ${tint}`} /> {label}
              </li>
            ))}
          </ul>

          {/* The three services, as quick links */}
          <nav aria-label="Services" className="fade-up mt-10 hidden gap-2 sm:grid sm:grid-cols-3" style={{ animationDelay: ".4s" }}>
            {services.map((s) => {
              const Icon = serviceIcons[s.key];
              return (
                <Link
                  key={s.key}
                  to={servicePath(s)}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-surface/70 p-3 backdrop-blur transition-colors hover:border-brand/40 hover:bg-surface"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text transition-colors group-hover:bg-grad group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[13px] font-semibold leading-tight">{s.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* the agent at work */}
        <div className="fade-up relative" style={{ animationDelay: ".24s" }}>
          <div className="bg-grad pointer-events-none absolute -inset-6 -z-10 rounded-[40px] opacity-20 blur-3xl" aria-hidden="true" />
          <AgentConsole />
        </div>
      </div>

      {/* The tools we build with */}
      <div className="marquee-host relative mt-20 border-y border-line bg-surface/60 py-5 backdrop-blur lg:mt-24">
        <p className="mx-auto mb-4 max-w-[1240px] px-5 text-center text-[11px] font-bold uppercase tracking-[.18em] text-subtle sm:px-8">
          Built with the models and tools you'd pick yourself
        </p>
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <ul className="marquee flex w-max gap-3" aria-label="Tools we build with">
            {[...tools, ...tools].map((t, i) => (
              <li
                key={`${t}-${i}`}
                aria-hidden={i >= tools.length || undefined}
                className="whitespace-nowrap rounded-full border border-line bg-surface px-4 py-1.5 font-display text-sm font-semibold text-ink-2"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
