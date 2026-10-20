import { skillGroups } from "@/data/portfolio";
import Reveal, { SectionHeading } from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" className="bay relative overflow-hidden border-y border-line px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="bay-glow pointer-events-none absolute inset-0" />
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="hazard pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-50" />
      <div className="relative mx-auto max-w-[1320px]">
        <SectionHeading
          index="02"
          label="Skills"
          title={
            <>
              The toolkit, <span className="glow-text text-signal">organised.</span>
            </>
          }
        />

        <div className="mt-14 grid border-l border-t border-line md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 70} className="border-b border-r border-line">
              <div className="spotlight group h-full p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-code text-[10px] uppercase tracking-[0.2em] text-muted2">Module {String(gi + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1.5 font-display text-xl font-semibold uppercase tracking-wide transition-colors duration-300 group-hover:text-signal">{g.title}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 pt-0.5">
                    <span className="gauge" aria-hidden="true">
                      {Array.from({ length: 8 }, (_, i) => (
                        <i key={i} className={i < g.items.length ? "on" : ""} />
                      ))}
                    </span>
                    <span className="font-code text-[10px] text-signal">{String(g.items.length).padStart(2, "0")} units</span>
                  </div>
                </div>
                <ul className="stagger mt-6 flex flex-wrap gap-2">
                  {g.items.map((item, i) => (
                    <li
                      key={item}
                      style={{ ["--i" as string]: i }}
                      className="cut-sm border border-line bg-paper/60 px-3.5 py-2 font-code text-[13px] text-ink/90 transition duration-200 hover:-translate-y-0.5 hover:border-signal hover:bg-signal hover:text-paper"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
