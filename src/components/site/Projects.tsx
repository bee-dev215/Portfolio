import { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { industries } from "@/data/company";
import { audienceTitle, projectPath } from "@/data/projects";
import { useProjects } from "@/hooks/use-projects";
import Reveal, { SectionHeading } from "./Reveal";

/** Home-page selection of projects as a photo bento: one large tile and four smaller ones. */
export default function Projects() {
  const { projects, ready } = useProjects();
  // Featured projects lead; the first takes the large tile
  const shown = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 5);
  const audiencesCovered = industries.filter((i) => projects.some((p) => p.audience === i.key)).length;

  return (
    <section id="projects" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            label="Projects"
            title={
              <>
                AI for learning, <span className="gradient-text">already at work.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              Tutors, feedback, analytics, voice and training{ready && <> — {projects.length} projects across {audiencesCovered} kinds of learning organisation</>}. Client names stay private; the engineering doesn't.
            </p>
          </SectionHeading>
          <Reveal delay={100}>
            <Link to="/projects" className="btn btn-primary shrink-0 px-6 py-3 text-sm">
              All {ready && `${projects.length} `}projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,18rem)]">
          {/* Placeholder tiles hold the layout while the projects load */}
          {!ready &&
            Array.from({ length: 5 }, (_, i) => (
              <li key={i} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""} aria-hidden="true">
                <div className={`h-full animate-pulse rounded-3xl bg-raised ${i === 0 ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto" : "aspect-[4/3] lg:aspect-auto"}`} />
              </li>
            ))}
          {shown.map((p, i) => {
            const big = i === 0;
            return (
              <li key={p.slug} className={big ? "sm:col-span-2 lg:row-span-2" : ""}>
                <Reveal delay={big ? 0 : 60 + i * 70} variant={big ? "scale" : "up"} className="h-full">
                  <Link
                    to={projectPath(p)}
                    className={`proj-tile shadow-soft group relative block h-full overflow-hidden rounded-3xl bg-raised ${big ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto" : "aspect-[4/3] lg:aspect-auto"}`}
                  >
                    <div className="unveil absolute inset-0" style={{ "--unveil-delay": `${big ? 80 : 160 + i * 70}ms` } as CSSProperties}>
                      <img src={p.image} alt="" loading="lazy" width={big ? 1280 : 640} height={big ? 800 : 400} className="img-zoom h-full w-full object-cover" />
                    </div>
                    <div className="proj-tile-shade absolute inset-0" aria-hidden="true" />
                    <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur sm:left-5 sm:top-5">
                      {audienceTitle(p)} · {p.year}
                    </span>
                    <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors group-hover:bg-white group-hover:text-[#3730a3] sm:right-5 sm:top-5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    <div className={`absolute inset-x-0 bottom-0 text-white ${big ? "p-6 sm:p-8" : "p-5"}`}>
                      <p className="text-xs font-medium text-white/75">{p.client}</p>
                      <h3 className={`mt-1.5 font-display font-bold leading-tight tracking-tight ${big ? "text-2xl sm:text-4xl" : "text-xl"}`}>{p.title}</h3>
                      {big ? (
                        <>
                          <p className="mt-3 hidden max-w-xl leading-relaxed text-white/85 sm:block">{p.summary}</p>
                          <ul className="mt-5 hidden flex-wrap gap-2 sm:flex">
                            {p.stack.slice(0, 4).map((t) => (
                              <li key={t} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p className="proj-tile-more text-sm leading-relaxed text-white/85">
                          <span className="line-clamp-3 pt-2">{p.summary}</span>
                        </p>
                      )}
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal delay={80}>
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-subtle">
            <Lock className="h-3.5 w-3.5 shrink-0" /> Clients are described, not named.{" "}
            <Link to="/about#confidentiality" className="u-link font-semibold text-ink">
              Why
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
