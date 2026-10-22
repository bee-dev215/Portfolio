import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { Project } from "@/data/portfolio";

export default function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  return (
    <div
      className="plate plate-lift hud group relative flex h-full w-full flex-col border border-line bg-paper-2/80 text-left hover:border-signal/50"
    >
      {/* Stretched button opens the details modal; the project links sit above it */}
      <button
        onClick={() => onOpen(project)}
        data-cursor="view"
        aria-label={`View ${project.title} details`}
        className="absolute inset-0 z-[1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      />

      <div className="img-wipe relative aspect-[16/10] overflow-hidden border-b border-line bg-paper-3">
        {project.image && (
          <div className="img-zoom h-full w-full">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover opacity-85 saturate-[.85] transition duration-300 group-hover:opacity-100 group-hover:saturate-100"
            />
          </div>
        )}
        <span className="img-scan absolute inset-0" aria-hidden="true" />
        <span className="absolute left-0 top-0 border-b border-r border-line bg-paper/85 px-3 py-1.5 font-code text-xs text-copper backdrop-blur">P-{String(index + 1).padStart(2, "0")}</span>
        <span className="absolute bottom-0 right-0 bg-signal px-3 py-1.5 font-code text-[11px] font-medium uppercase tracking-wider text-ink">{project.category}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold uppercase leading-tight tracking-wide">{project.title}</h3>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-copper" />
        </div>
        <p className="mt-1 font-code text-xs uppercase tracking-wider text-muted2">
          {project.role} · {project.year}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted2">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {project.tech.map((t) => (
            <span key={t} className="border border-line bg-paper/50 px-2 py-1 font-code text-[11px] text-ink/80 transition-colors duration-300 group-hover:border-signal/40">
              {t}
            </span>
          ))}
        </div>

        {(project.liveUrl || project.repoUrl) && (
          <div className="relative z-[2] mt-5 flex gap-2 border-t border-line pt-5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-signal press cut-sm flex items-center gap-2 bg-signal px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-ink hover:bg-signal-hi"
              >
                <ExternalLink className="h-4 w-4" /> Live site
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="key-dark press flex items-center gap-2 border border-line px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide hover:border-signal hover:text-copper"
              >
                <Code2 className="h-4 w-4" /> Code
              </a>
            )}
          </div>
        )}
      </div>
      <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-signal shadow-[0_0_12px_rgba(168,68,15,.8)] transition-transform duration-300 [transition-timing-function:var(--ease-servo)] group-hover:scale-x-100" />
    </div>
  );
}
