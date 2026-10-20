import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/portfolio";
import { useTilt } from "@/hooks/use-motion";

export default function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  const tilt = useTilt<HTMLButtonElement>(6);

  return (
    <button
      ref={tilt}
      onClick={() => onOpen(project)}
      data-cursor="view"
      className="tilt group relative flex h-full w-full flex-col border border-ink bg-paper text-left hover:shadow-[0_30px_60px_-30px_rgba(18,20,26,0.55)]"
    >
      <div className="img-wipe relative aspect-[16/10] overflow-hidden border-b border-ink bg-paper-2">
        {project.image && (
          <div className="img-zoom h-full w-full">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
            />
          </div>
        )}
        <span className="tilt-glare absolute inset-0" />
        <span className="absolute left-0 top-0 bg-ink px-3 py-1.5 font-code text-xs text-paper">{String(index + 1).padStart(2, "0")}</span>
        <span className="absolute bottom-0 right-0 bg-signal px-3 py-1.5 font-code text-[11px] uppercase tracking-wider text-ink">{project.category}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold uppercase leading-tight tracking-wide">{project.title}</h3>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal-deep" />
        </div>
        <p className="mt-1 font-code text-xs uppercase tracking-wider text-muted2">
          {project.role} · {project.year}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted2">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {project.tech.map((t) => (
            <span key={t} className="border border-line px-2 py-1 font-code text-[11px] text-ink/80 transition-colors duration-300 group-hover:border-ink/40">
              {t}
            </span>
          ))}
        </div>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
    </button>
  );
}
