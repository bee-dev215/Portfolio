import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "@/data/company";
import { audienceTitle, Project, projectPath } from "@/data/projects";
import { serviceIcons } from "@/components/site/icons";

/** Photo card linking to a project's page — used on the projects index and in "related projects" strips. */
export default function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <Link to={projectPath(project)} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-raised">
        <img src={project.image} alt="" loading="lazy" width={640} height={400} className="img-zoom h-full w-full object-cover" />
        <div className="photo-fade absolute inset-0" aria-hidden="true" />
        <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{audienceTitle(project)}</span>
        <span className="absolute right-4 top-4 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur">{project.year}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text">{project.client}</p>
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight">{project.title}</h3>
        {!compact && <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{project.summary}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <ul className="flex -space-x-1.5" aria-label="Services">
            {project.services.map((key) => {
              const Icon = serviceIcons[key];
              const title = services.find((s) => s.key === key)?.title;
              return (
                <li key={key} title={title} className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-brand-soft text-brand-text">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">{title}</span>
                </li>
              );
            })}
          </ul>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-text transition-colors group-hover:bg-grad group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
