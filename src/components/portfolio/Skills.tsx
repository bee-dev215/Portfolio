import { skillGroups } from "@/data/portfolio";
import Reveal, { SectionHeading } from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" className="site-dark relative overflow-hidden bg-ink px-5 py-24 text-paper sm:px-10 lg:px-14 lg:py-32">
      <div className="ink-glow pointer-events-none absolute inset-0" />
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="relative">
        <SectionHeading
          dark
          index="02"
          label="Skills"
          title={
            <>
              The toolkit, <span className="text-signal">organised.</span>
            </>
          }
        />

        <div className="mt-14 grid border-l border-t border-white/20 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 70} className="border-b border-r border-white/20">
              <div className="spotlight group h-full p-6 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-semibold uppercase tracking-wide transition-colors duration-300 group-hover:text-signal">{g.title}</h3>
                  <span className="font-code text-xs text-signal">{String(g.items.length).padStart(2, "0")}</span>
                </div>
                <ul className="stagger mt-6 flex flex-wrap gap-2">
                  {g.items.map((item, i) => (
                    <li
                      key={item}
                      style={{ ["--i" as string]: i }}
                      className="cut-sm border border-white/25 px-3.5 py-2 font-code text-[13px] text-paper/90 transition duration-200 hover:-translate-y-0.5 hover:border-signal hover:bg-signal hover:text-ink"
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
