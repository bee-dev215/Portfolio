import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import { Project } from "@/data/portfolio";

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
}: {
  project: Project | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose, onPrev, onNext]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="absolute inset-0 animate-fade-in bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="cut deploy relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden border border-line bg-paper-2">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center bg-signal text-ink transition-colors hover:bg-signal-hi"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Keyed by project so the entrance replays when navigating with prev / next */}
        <div key={project.id} className="overflow-y-auto">
          {project.image && (
            <div className="relative aspect-[16/7] overflow-hidden border-b border-line">
              <img src={project.image} alt={project.title} className="modal-img h-full w-full object-cover" />
            </div>
          )}

          <div className="modal-in p-6 sm:p-10">
            <div className="flex flex-wrap gap-2 font-code text-xs uppercase tracking-wider">
              <span className="bevel bg-signal px-3 py-1 text-ink">{project.category}</span>
              <span className="border border-line px-3 py-1 text-muted2">{project.year}</span>
            </div>
            <h3 className="extrude-sm mt-5 font-display text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl">{project.title}</h3>

            <div className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
              <div>
                <p className="font-code text-xs uppercase tracking-[0.2em] text-copper">// Overview</p>
                <p className="mt-3 leading-relaxed text-muted2">{project.description}</p>

                {project.highlights.length > 0 && (
                  <>
                    <p className="mt-8 font-code text-xs uppercase tracking-[0.2em] text-copper">// Key outcomes</p>
                    <ul className="mt-3 space-y-3">
                      {project.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-signal" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="space-y-6 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div>
                  <p className="font-code text-xs uppercase tracking-[0.2em] text-muted2">Role</p>
                  <p className="mt-1 font-medium">{project.role}</p>
                </div>
                <div>
                  <p className="font-code text-xs uppercase tracking-[0.2em] text-muted2">Tech stack</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="border border-line bg-paper/50 px-2 py-1 font-code text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {(project.liveUrl || project.repoUrl) && (
                  <div className="flex flex-col gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-signal press cut-sm flex items-center justify-center gap-2 bg-signal py-3 font-display text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-signal-hi"
                      >
                        <ExternalLink className="h-4 w-4" /> Live preview
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border border-line py-3 font-display text-sm font-semibold uppercase tracking-wide transition-colors hover:border-signal hover:text-copper"
                      >
                        Source code
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <button onClick={onPrev} className="flex items-center gap-2 font-display text-sm font-medium uppercase tracking-wide text-muted2 transition-colors hover:text-copper">
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          <span className="hidden font-code text-[11px] uppercase tracking-wider text-muted2 sm:block">Esc to close · ← → to navigate</span>
          <button onClick={onNext} className="flex items-center gap-2 font-display text-sm font-medium uppercase tracking-wide text-muted2 transition-colors hover:text-copper">
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
