import { CSSProperties } from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { bookCall } from "@/data/company";
import { mainService, projectPath, projects } from "@/data/projects";
import Reveal, { SectionHeading } from "./Reveal";

// Featured projects lead
const shown = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 4);

// Wide and narrow tiles alternate row by row: 3 + 2, then 2 + 3 (of five columns)
const spans = ["lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3"];

/** Home-page selection of projects as photo tiles. */
export default function Projects() {
  return (
    <section id="projects" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            label="Our work"
            title={
              <>
                From a first call <span className="gradient-text">to AI in daily use.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              Document AI, a voice agent, a contract-review assistant and a SaaS rescue — each one started with a call and a two-week prototype. Client names stay private; the engineering doesn't.
            </p>
          </SectionHeading>
          <Reveal delay={100} className="flex shrink-0 flex-wrap gap-3">
            <button onClick={() => bookCall()} className="btn btn-primary px-6 py-3 text-sm">
              Book a call
            </button>
            <Link to="/projects" className="btn btn-secondary px-6 py-3 text-sm">
              All {projects.length} projects
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-[repeat(2,22rem)]">
          {shown.map((p, i) => {
            const wide = spans[i] === "lg:col-span-3";
            return (
              <li key={p.slug} className={spans[i]}>
                <Reveal delay={i * 80} variant={wide ? "scale" : "up"} className="h-full">
                  <Link to={projectPath(p)} className="proj-tile shadow-soft group relative block aspect-[4/3] h-full overflow-hidden rounded-3xl bg-raised lg:aspect-auto">
                    <div className="unveil sheen absolute inset-0" style={{ "--unveil-delay": `${80 + i * 80}ms` } as CSSProperties}>
                      <img src={p.image} alt="" loading="lazy" width={wide ? 1280 : 640} height={wide ? 800 : 400} className="h-full w-full object-cover" />
                    </div>
                    <div className="proj-tile-shade absolute inset-0" aria-hidden="true" />
                    <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur sm:left-5 sm:top-5">
                      {mainService(p).title} · {p.year}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                      <p className="text-xs font-medium text-white/75">{p.client}</p>
                      <h3 className={`mt-1.5 font-display font-bold leading-tight tracking-tight ${wide ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{p.title}</h3>
                      <p className="proj-tile-more max-w-xl text-sm leading-relaxed text-white/85">
                        <span className="line-clamp-3 pt-2">{p.summary}</span>
                      </p>
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
