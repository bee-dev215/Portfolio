import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Project } from "@/data/projects";
import { useProjects } from "@/hooks/use-projects";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import ProjectCard from "./ProjectCard";

/** "Our work" section for the solution, service and industry pages: up to three projects that `match`. Renders nothing without any. */
export default function ProjectStrip({ match, title, lead, band = false }: { match: (p: Project) => boolean; title: ReactNode; lead?: ReactNode; band?: boolean }) {
  const { projects } = useProjects();
  const list = projects.filter(match);
  if (list.length === 0) return null;
  return (
    <section className={`px-5 py-20 sm:px-8 lg:py-28 ${band ? "band" : ""}`}>
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading label="Our work" title={title}>
            {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{lead}</p>}
          </SectionHeading>
          <Reveal delay={100}>
            <Link to="/projects" className="btn btn-secondary shrink-0 px-6 py-3 text-sm">
              All {projects.length} projects
            </Link>
          </Reveal>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.slice(0, 3).map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 80} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
