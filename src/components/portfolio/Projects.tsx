import { useMemo, useState } from "react";
import { Project, ProjectCategory, projects } from "@/data/portfolio";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import Reveal, { SectionHeading } from "./Reveal";

const categories: ProjectCategory[] = ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

export default function Projects() {
  const [filter, setFilter] = useState<ProjectCategory>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const list = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.category === filter)), [filter]);

  const modalProject = openIndex !== null ? list[openIndex] ?? null : null;
  const openProject = (p: Project) => setOpenIndex(list.findIndex((x) => x.id === p.id));

  return (
    <section id="work" className="px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          index="03"
          label="Selected work"
          title={
            <>
              Featured <span className="glow-text text-signal">projects.</span>
            </>
          }
        />

        <Reveal delay={80}>
          <div className="mt-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter projects">
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={filter === c}
                  onClick={() => setFilter(c)}
                  className={`cut-sm relative shrink-0 overflow-hidden whitespace-nowrap border px-4 py-2 font-display text-sm font-medium uppercase tracking-wide transition-colors duration-300 ${
                    filter === c ? "border-signal text-paper" : "border-line text-muted2 hover:border-signal/60 hover:text-ink"
                  }`}
                >
                  <span
                    className={`absolute inset-0 origin-left bg-signal transition-transform duration-300 ease-out ${filter === c ? "scale-x-100" : "scale-x-0"}`}
                    aria-hidden="true"
                  />
                  <span className="relative">{c}</span>
                </button>
              ))}
            </div>
            <span className="flex items-center gap-2 font-code text-xs uppercase tracking-wider text-muted2">
              <span className="led" />
              {String(list.length).padStart(2, "0")} {list.length === 1 ? "project" : "projects"} loaded
            </span>
          </div>
        </Reveal>

        {/* Keyed by filter so the cards replay their entrance when the filter changes */}
        <div key={filter} className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 110} variant="scale" className="h-full">
              <ProjectCard project={p} index={i} onOpen={openProject} />
            </Reveal>
          ))}
        </div>

        <ProjectModal
          project={modalProject}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => (i === null ? null : (i - 1 + list.length) % list.length))}
          onNext={() => setOpenIndex((i) => (i === null ? null : (i + 1) % list.length))}
        />
      </div>
    </section>
  );
}
