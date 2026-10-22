import { ArrowUpRight, Bot, Cable, GraduationCap, LucideIcon, Rocket } from "lucide-react";
import { company, ServiceKey, services, startEnquiry, stats } from "@/data/company";
import CountUp from "./CountUp";
import Reveal, { SectionHeading } from "./Reveal";

const icons: Record<ServiceKey, LucideIcon> = { build: Rocket, llm: Bot, platform: Cable, academy: GraduationCap };

export default function Services() {
  return (
    <section id="services" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            label="Services"
            title={
              <>
                Everything you need to <span className="gradient-text">ship AI for learning.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{company.intro}</p>
          </SectionHeading>
          <Reveal delay={100}>
            <button onClick={() => startEnquiry()} className="btn btn-secondary shrink-0 px-6 py-3 text-sm">
              Talk to an engineer <ArrowUpRight className="h-4 w-4" />
            </button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map((s, i) => {
            const Icon = icons[s.key];
            return (
              <Reveal key={s.key} delay={i * 80} className="h-full">
                <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-7 sm:p-9">
                  <div className="bg-grad pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />
                  <span className="icon-tile h-12 w-12">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-ink-2">{s.desc}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-7">
                    {s.includes.map((it) => (
                      <li key={it} className="chip">
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Stats */}
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
