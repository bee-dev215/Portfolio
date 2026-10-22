import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { Solution, startEnquiry } from "@/data/company";

export default function SolutionModal({
  solution,
  onClose,
  onPrev,
  onNext,
}: {
  solution: Solution | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    if (!solution) return;
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
  }, [solution, onClose, onPrev, onNext]);

  if (!solution) return null;

  const enquire = () => {
    onClose();
    // wait a frame so the page scroll lock is released before scrolling to the form
    requestAnimationFrame(() => startEnquiry(solution.title));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={solution.title}>
      <div className="absolute inset-0 animate-fade-in bg-[#080b18]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="card modal-in relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl">
        <button
          onClick={onClose}
          className="glass absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:text-brand-text"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Keyed by solution so the entrance replays when navigating with prev / next */}
        <div key={solution.id} className="overflow-y-auto">
          {solution.image && (
            <div className="relative aspect-[16/7] overflow-hidden bg-raised">
              <img src={solution.image} alt="" className="h-full w-full object-cover" />
              <div className="photo-fade absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{solution.category}</span>
                <h3 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{solution.title}</h3>
              </div>
            </div>
          )}

          <div className="grid gap-10 p-6 sm:p-10 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-text">Overview</p>
              <p className="mt-3 leading-relaxed text-ink-2">{solution.description}</p>

              {solution.capabilities.length > 0 && (
                <>
                  <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-brand-text">Capabilities</p>
                  <ul className="mt-4 space-y-3">
                    {solution.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-3">
                        <span className="bg-grad mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-ink">{c}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="space-y-6 rounded-2xl bg-raised/70 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Focus</p>
                <p className="mt-1 font-medium">{solution.domain}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Tech stack</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {solution.tech.map((t) => (
                    <span key={t} className="chip bg-surface">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-subtle">You receive</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {solution.deliverables.map((d) => (
                    <li key={d} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={enquire} className="btn btn-primary w-full py-3 text-sm">
                Discuss this solution <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <button onClick={onPrev} className="flex items-center gap-2 text-sm font-semibold text-ink-2 transition-colors hover:text-brand-text">
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          <span className="hidden text-xs text-subtle sm:block">Esc to close · ← → to navigate</span>
          <button onClick={onNext} className="flex items-center gap-2 text-sm font-semibold text-ink-2 transition-colors hover:text-brand-text">
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
