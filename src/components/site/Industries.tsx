import { ArrowUpRight } from "lucide-react";
import { industries, openSolution } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";

export default function Industries() {
  return (
    <section id="industries" className="px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          index="02"
          label="Industries"
          title={
            <>
              Where robots <span className="glow-text text-beam">do real work.</span>
            </>
          }
        >
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted2">
            Production lines, busy warehouses, open fields and live plants — the places where a robot has to perform every shift, not just in the demo.
          </p>
        </SectionHeading>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {industries.map((ind, i) => (
            <Reveal key={ind.key} delay={i * 90} className="h-full">
              <article className="plate hud group relative flex h-full flex-col border border-line bg-paper-2/80 hover:border-signal/50">
                <div className="on-dark img-wipe photo-cast relative aspect-[4/3] overflow-hidden border-b border-line bg-paper-3 xl:aspect-[4/5]">
                  <div className="img-zoom h-full w-full">
                    <img src={ind.image} alt={ind.imageAlt} loading="lazy" width={900} height={1125} className="photo h-full w-full object-cover" />
                  </div>
                  <span className="photo-fade absolute inset-0" aria-hidden="true" />
                  <span className="img-scan absolute inset-0" aria-hidden="true" />
                  <span className="absolute left-0 top-0 z-[2] border-b border-r border-line bg-paper/85 px-3 py-1.5 font-code text-xs text-beam backdrop-blur">
                    IND-{String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 z-[2] p-5">
                    <h3 className="extrude-sm font-display text-2xl font-semibold uppercase leading-tight tracking-wide">{ind.title}</h3>
                    <p className="mt-1 font-code text-[11px] uppercase tracking-wider text-ink/75">{ind.focus}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-[15px] leading-relaxed text-muted2">{ind.desc}</p>
                  <ul className="mt-5 space-y-2.5">
                    {ind.work.map((w) => (
                      <li key={w} className="flex items-center gap-3 text-sm text-ink/90">
                        <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-signal" />
                        {w}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <p className="font-code text-[10px] uppercase tracking-[0.2em] text-muted2">Related solutions</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {ind.solutions.map((t) => (
                        <button
                          key={t}
                          onClick={() => openSolution(t)}
                          className="press key-dark group/sol inline-flex items-center gap-1 border border-line bg-paper/60 px-2.5 py-1.5 font-code text-[11px] text-ink/85 hover:border-signal hover:text-beam"
                        >
                          {t}
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover/sol:-translate-y-px group-hover/sol:translate-x-px" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="glow-line absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-signal transition-transform duration-300 [transition-timing-function:var(--ease-servo)] group-hover:scale-x-100" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
