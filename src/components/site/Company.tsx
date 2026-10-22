import { CSSProperties } from "react";
import { Compass, FlaskConical, HeartHandshake, ShieldCheck, LucideIcon } from "lucide-react";
import { company, companyFile, principles } from "@/data/company";
import { useScrollProgress } from "@/hooks/use-motion";
import Reveal, { SectionHeading } from "./Reveal";

const principleIcons: LucideIcon[] = [HeartHandshake, ShieldCheck, FlaskConical, Compass];

export default function Company() {
  // Drives the collage parallax: the inset photo and the facts card drift against the main photo
  const ref = useScrollProgress<HTMLElement>();

  return (
    <section ref={ref} id="company" className="band px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] items-start gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Collage */}
        <Reveal variant="left" className="relative order-2 lg:sticky lg:top-28 lg:order-1">
          <div className="relative pb-16 pr-6 sm:pr-16">
            <div className="unveil shadow-soft overflow-hidden rounded-[2rem]">
              <img src="/images/company-team.webp" alt="A product team mapping ideas on a whiteboard with sticky notes" loading="lazy" width={740} height={555} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="drift absolute bottom-0 right-0 w-[52%]" style={{ "--drift": "-90px" } as CSSProperties}>
              <div className="unveil shadow-soft overflow-hidden rounded-3xl border-4 border-canvas" style={{ "--unveil-delay": "420ms" } as CSSProperties}>
              <img src="/images/company-learning.webp" alt="A student joining a live online class with their teacher on screen" loading="lazy" width={480} height={360} className="aspect-[4/3] w-full object-cover" />
              </div>
            </div>
            <div className="drift glass shadow-soft absolute -left-2 bottom-8 hidden rounded-2xl border border-line p-4 sm:block" style={{ "--drift": "50px" } as CSSProperties}>
              <dl className="space-y-2.5">
                {companyFile.slice(0, 3).map((row) => (
                  <div key={row.k}>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-subtle">{row.k}</dt>
                    <dd className="text-sm font-semibold">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            label="Company"
            title={
              <>
                One mission: <span className="gradient-text">better learning.</span>
              </>
            }
          />
          <Reveal delay={80}>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-2">
              {company.about.slice(0, 2).map((p, i) => (
                <p key={i} className={i === 0 ? "text-ink" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {principles.map((f, i) => {
              const Icon = principleIcons[i % principleIcons.length];
              return (
                <Reveal key={f.title} delay={i * 70} className="h-full">
                  <div className="card h-full p-5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-text">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-bold">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
