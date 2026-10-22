import { Activity, Boxes, Cable, Cpu, LucideIcon } from "lucide-react";
import { company, ServiceKey, services, stats } from "@/data/company";
import CountUp from "./CountUp";
import Reveal, { SectionHeading } from "./Reveal";

const icons: Record<ServiceKey, LucideIcon> = { build: Cpu, integrate: Cable, simulate: Boxes, operate: Activity };

export default function Services() {
  return (
    <section id="services" className="px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          index="01"
          label="Services"
          title={
            <>
              Robotics software, <span className="glow-text text-beam">end to end.</span>
            </>
          }
        >
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted2">{company.intro}</p>
        </SectionHeading>

        <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2">
          {services.map((s, i) => {
            const Icon = icons[s.key];
            return (
              <Reveal key={s.key} delay={i * 70} className="bg-paper">
                <div className="spotlight bevel-cell group relative flex h-full flex-col p-7 transition-colors duration-300 hover:bg-paper-2 sm:p-9">
                  <div className="flex items-start justify-between gap-6">
                    <span className="font-code text-xs text-beam">0{i + 1} /</span>
                    <span className="key-dark cut-sm grid h-12 w-12 shrink-0 place-items-center border border-line text-beam transition-colors duration-300 group-hover:border-signal">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide transition-transform duration-300 group-hover:translate-x-1">{s.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-muted2">{s.desc}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-7">
                    {s.includes.map((it) => (
                      <li key={it} className="key-dark cut-sm border border-line bg-paper/60 px-3 py-1.5 font-code text-xs text-ink/90">
                        {it}
                      </li>
                    ))}
                  </ul>
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-signal glow-line transition-all duration-500 group-hover:w-full" />
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} variant="clip" className="border-b border-r border-line">
              <div className="bevel-cell group relative h-full p-6 transition-colors duration-300 hover:bg-paper-2 sm:p-8">
                <span className="absolute right-4 top-4 font-code text-[10px] uppercase tracking-[0.2em] text-muted2/70">M-{String(i + 1).padStart(2, "0")}</span>
                <div className="extrude-sm font-display text-5xl font-bold tracking-tight transition-colors duration-300 group-hover:text-beam sm:text-6xl">
                  <CountUp value={s.value} />
                </div>
                <div className="mt-3 text-sm text-muted2">{s.label}</div>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-signal transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
