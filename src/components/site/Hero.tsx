import { CSSProperties } from "react";
import { ArrowRight, CalendarDays, Gift, GitBranch, LockKeyhole, ShieldCheck, Timer, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { company, offer, servicePath, services, stackGroups } from "@/data/company";
import { serviceIcons } from "./icons";
import AgentConsole from "./AgentConsole";
import NetworkMap from "./NetworkMap";
import RotatingWords from "./RotatingWords";

const badges = [
  { icon: GitBranch, label: "Senior engineers only", tint: "text-iris" },
  { icon: ShieldCheck, label: "You own the code", tint: "text-emerald-500" },
  { icon: Timer, label: "Working software in two weeks", tint: "text-sky2" },
];

// What the team gets back, cycled through the headline's highlighted phrase
const gains = ["its week back.", "its evenings back.", "its focus back.", "its Mondays back."];

// Every tool in the stack, for the strip under the hero
const tools = stackGroups.flatMap((g) => g.items);

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="clouds pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="orb left-[-8%] top-[8%] h-[34vw] w-[34vw] bg-iris/40" aria-hidden="true" />
      <div className="orb right-[-6%] top-[30%] h-[28vw] w-[28vw] bg-sky2/35" style={{ animationDelay: "-7s" }} aria-hidden="true" />
      <NetworkMap />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-14">
        {/* message */}
        <div>
          <Link
            to="/book"
            className="fade-up group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pl-1 pr-3.5 text-[13px] font-semibold shadow-sm transition-colors hover:border-brand/40"
            style={{ animationDelay: ".05s" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-volt px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0b1020]">
              <Gift className="h-3.5 w-3.5" /> Free
            </span>
            {offer.title}
          </Link>

          <h1
            className="hero-title fade-up mt-7 font-display text-[clamp(2.5rem,5.8vw,5rem)] font-extrabold leading-[.95] tracking-[-0.045em]"
            style={{ animationDelay: ".12s" }}
          >
            <span className="block">AI agents that</span>
            <span className="block">give your team</span>
            <RotatingWords words={gains} className="mark" itemClassName="gradient-text" />
          </h1>

          <p className="fade-up mt-7 max-w-[580px] text-lg leading-relaxed text-ink-2 sm:text-xl" style={{ animationDelay: ".2s" }}>
            {company.tagline}
          </p>

          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: ".28s" }}>
            <Link to="/book" className="btn btn-primary px-8 py-4 text-base">
              Book a free call <CalendarDays className="h-4 w-4" />
            </Link>
            <Link to="/projects" className="btn btn-secondary px-8 py-4 text-base">
              See our work <ArrowRight className="h-4 w-4" />
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
          <div className="bg-grad pointer-events-none absolute -inset-8 -z-10 rounded-[48px] opacity-25 blur-3xl" aria-hidden="true" />
          <div className="glow-ring rounded-[29.5px] p-[1.5px]">
            <AgentConsole />
          </div>

          {/* Floating proof points, on wide screens */}
          <div className="float-y glass shadow-soft absolute -left-10 -top-11 hidden items-center gap-2.5 rounded-2xl border border-line px-3.5 py-2.5 xl:flex" aria-hidden="true">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-sun/15 text-sun">
              <UserCheck className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[12px] font-bold">Human in the loop</span>
              <span className="block text-[11px] text-subtle">You approve what matters</span>
            </span>
          </div>
          <div
            className="float-y glass shadow-soft absolute -bottom-11 -right-8 hidden items-center gap-2.5 rounded-2xl border border-line px-3.5 py-2.5 xl:flex"
            style={{ "--float-delay": "-3s" } as CSSProperties}
            aria-hidden="true"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
              <LockKeyhole className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[12px] font-bold">Runs in your cloud</span>
              <span className="block text-[11px] text-subtle">Never trains on your data</span>
            </span>
          </div>
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
