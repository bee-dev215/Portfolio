import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { company, servicePath, services, solutionPath, solutionsFor, stats } from "@/data/company";
import { serviceIcons } from "./icons";
import CountUp from "./CountUp";
import Reveal, { SectionHeading } from "./Reveal";

/** Home-page services: the three things we do, then the promises behind them. */
export default function Services() {
  return (
    <section id="services" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          label="Services"
          center
          title={
            <>
              Three things, <span className="gradient-text">done properly.</span>
            </>
          }
        >
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{company.intro}</p>
        </SectionHeading>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = serviceIcons[s.key];
            const linked = solutionsFor(s.key);
            return (
              <Reveal key={s.key} delay={i * 90} className="h-full">
                <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-7 sm:p-8">
                  <div className="bg-grad absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
                  <div className="flex items-start justify-between">
                    <span className="icon-tile h-14 w-14 rounded-2xl">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-5xl font-extrabold leading-none text-line-strong" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 font-display text-2xl font-bold tracking-tight">
                    {/* The title link covers the card */}
                    <Link to={servicePath(s)} className="after:absolute after:inset-0">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-2">{s.desc}</p>
                  <ul className="mt-6 space-y-2.5">
                    {s.includes.map((it) => (
                      <li key={it} className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-text">
                          <Check className="h-3 w-3" />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <div className="flex min-h-[4.5rem] flex-wrap content-start items-center gap-2 border-t border-line pt-5">
                    {linked.length > 0 ? (
                      <>
                        <span className="w-full text-xs font-semibold uppercase tracking-wider text-subtle">Starts from</span>
                        {linked.map((sol) => (
                          // Above the card's covering link, so each chip opens its own page
                          <Link key={sol.slug} to={solutionPath(sol)} className="chip relative z-[1] transition-colors hover:border-brand/40 hover:text-brand-text">
                            {sol.title}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                        Explore the service <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* The promises behind every service */}
        <Reveal delay={100}>
          <div className="grad-border mt-16 grid grid-cols-2 overflow-hidden rounded-3xl bg-surface lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`p-7 sm:p-9 ${i > 0 ? "border-line lg:border-l" : ""} ${i % 2 === 1 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}>
                <div className="gradient-text font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
                  <CountUp value={s.value} />
                </div>
                <div className="mt-2 text-sm font-medium text-ink-2">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
