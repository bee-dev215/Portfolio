import { CSSProperties } from "react";
import { ArrowRight, BrainCircuit, Cloud, Code2, Database, Layers, LucideIcon, MonitorSmartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { stackGroups } from "@/data/company";
import { usePhotos } from "@/hooks/use-photos";
import Reveal, { SectionHeading } from "./Reveal";

// One icon per stack group, in the same order as stackGroups
const icons: LucideIcon[] = [BrainCircuit, Layers, Code2, MonitorSmartphone, Database, Cloud];

// What the stack means for a client, in pictures
const pillars = [
  { image: "/images/tech-ai-abstract.webp", icon: BrainCircuit, title: "Models chosen per task", desc: "Proven on your own evaluation set — not on a leaderboard." },
  { image: "/images/tech-code.webp", icon: Code2, title: "Code you own", desc: "Readable, tested and documented, in your repositories." },
  { image: "/images/tech-datacenter.webp", icon: Cloud, title: "Your cloud, your accounts", desc: "Everything runs in cloud accounts you own — open models included." },
];

/** The stack, by group. `more` adds a link to the technology page (off on that page itself). */
export default function Technology({ more = true }: { more?: boolean }) {
  const photos = usePhotos();

  return (
    <section id="technology" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          label="Technology"
          center
          title={
            <>
              The right tools for the job, <span className="gradient-text">no lock-in.</span>
            </>
          }
        >
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            We build on open, well-supported tools and standards, so your software can be maintained, extended and audited — by us or by your own engineers.
          </p>
        </SectionHeading>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map(({ image, icon: Icon, title, desc }, i) => (
            <li key={title}>
              <Reveal delay={i * 90} className="h-full">
                <div className="shadow-soft group relative aspect-[16/11] overflow-hidden rounded-3xl bg-raised md:aspect-[4/5] lg:aspect-[16/12]">
                  <div className="unveil sheen absolute inset-0" style={{ "--unveil-delay": `${120 + i * 110}ms` } as CSSProperties}>
                    <img src={photos.src(image)} alt="" loading="lazy" width={640} height={400} className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(10_16_32/.88)] via-[rgb(10_16_32/.25)] via-45% to-transparent" aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-5 text-white">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold leading-tight">{title}</h3>
                      <p className="mt-0.5 text-sm leading-snug text-white/80">{desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

        {more && (
          <Reveal delay={100} className="mt-12 flex justify-center">
            <Link to="/technology" className="btn btn-secondary px-6 py-3 text-sm">
              How we choose models and evaluate them <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
