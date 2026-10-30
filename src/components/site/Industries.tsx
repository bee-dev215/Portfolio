import { Link } from "react-router-dom";
import { industries, industryPath } from "@/data/company";
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
              All {industries.length} industries
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.key} delay={(i % 3) * 90} className="h-full">
              <article id={`audience-${ind.key}`} className="card card-hover group relative flex h-full scroll-mt-24 flex-col overflow-hidden">
                {/* The whole card opens the industry page (the title link is the keyboard route) */}
                <Link to={industryPath(ind)} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[1]" />
                {/* The 4:5 photos are cropped to 3:2 so three cards sit side by side */}
                <div className="unveil sheen relative aspect-[3/2] overflow-hidden bg-raised">
                  <img src={photos.src(ind.image)} alt={photos.alt(ind.image, ind.imageAlt)} loading="lazy" width={392} height={261} style={{ objectPosition: ind.imageFocus }} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                    <Link to={industryPath(ind)}>{ind.title}</Link>
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{ind.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
