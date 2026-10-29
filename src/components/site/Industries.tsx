import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { industries, industryPath, openSolution } from "@/data/company";
import { usePhotos } from "@/hooks/use-photos";
import Reveal, { SectionHeading } from "./Reveal";

export default function Industries() {
  const photos = usePhotos();

  return (
    <section id="industries" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            label="Industries"
            title={
              <>
                Different industries, <span className="gradient-text">the same busywork.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              Re-typing, chasing, answering the same questions and stitching reports together. We build around the systems and rules each industry already runs on.
            </p>
          </SectionHeading>
          <Reveal delay={100}>
            <Link to="/industries" className="btn btn-secondary shrink-0 px-6 py-3 text-sm">
              All {industries.length} industries <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.key} delay={(i % 3) * 90} className="h-full">
              <article id={`audience-${ind.key}`} className="card card-hover group flex h-full scroll-mt-24 flex-col overflow-hidden">
                {/* The 4:5 photos are cropped to 4:3 so three cards sit side by side */}
                <div className="unveil sheen relative aspect-[4/3] overflow-hidden bg-raised">
                  <img src={photos.src(ind.image)} alt={photos.alt(ind.image, ind.imageAlt)} loading="lazy" width={392} height={490} className="h-full w-full object-cover" />
                  <div className="photo-fade absolute inset-0" aria-hidden="true" />
                  {/* The whole photo opens the industry page (the title link is the keyboard route) */}
                  <Link to={industryPath(ind)} tabIndex={-1} aria-hidden="true" className="absolute inset-0" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-display text-2xl font-bold leading-tight tracking-tight">
                      <Link to={industryPath(ind)} className="pointer-events-auto">
                        {ind.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs font-medium text-white/80">{ind.focus}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-[15px] leading-relaxed text-ink-2">{ind.desc}</p>
                  <ul className="mt-5 space-y-2.5">
                    {ind.work.map((w) => (
                      <li key={w} className="flex items-center gap-2.5 text-sm text-ink">
                        <Check className="h-4 w-4 shrink-0 text-brand-text" />
                        {w}
                      </li>
                    ))}
                  </ul>
                  <Link to={industryPath(ind)} className="u-link mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-text">
                    Use cases & examples<span className="sr-only"> in {ind.title}</span> <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="mt-auto pt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">Related solutions</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {ind.solutions.map((t) => (
                        <button
                          key={t}
                          onClick={() => openSolution(t)}
                          className="chip transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-text"
                        >
                          {t} <ArrowUpRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
