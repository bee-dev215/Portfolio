import { BrainCircuit, Cloud, Code2, Database, GraduationCap, Layers, LucideIcon } from "lucide-react";
import { stackGroups } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";

// One icon per stack group, in the same order as stackGroups
const icons: LucideIcon[] = [BrainCircuit, Layers, Database, Code2, GraduationCap, Cloud];

export default function Technology() {
  return (
    <section id="technology" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          label="Technology"
          center
          title={
            <>
              The right model for the job, <span className="gradient-text">no lock-in.</span>
            </>
          }
        >
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            We build on open, well-supported tools and education standards, so your system can be maintained, extended and audited — by us or by your own engineers.
          </p>
        </SectionHeading>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {stackGroups.map((g, gi) => {
            const Icon = icons[gi % icons.length];
            return (
              <Reveal key={g.title} delay={(gi % 3) * 80} className="h-full">
                <div className="card card-hover h-full p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-text">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-lg font-bold">{g.title}</h3>
                    <span className="ml-auto text-xs font-medium text-subtle">{g.items.length} tools</span>
                  </div>
                  <ul className="stagger mt-6 flex flex-wrap gap-2">
                    {g.items.map((item, i) => (
                      <li key={item} style={{ ["--i" as string]: i }} className="chip px-3 py-1.5 text-[13px] transition-colors hover:border-brand/40 hover:text-brand-text">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
