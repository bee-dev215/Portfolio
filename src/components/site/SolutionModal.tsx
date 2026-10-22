import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
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
      <div className="absolute inset-0 animate-fade-in bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="cut deploy relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden border border-line bg-paper-2">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center bg-signal text-on-signal transition-colors hover:bg-signal-hi"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Keyed by solution so the entrance replays when navigating with prev / next */}
        <div key={solution.id} className="overflow-y-auto">
          {solution.image && (
            <div className="photo-cast relative aspect-[16/7] overflow-hidden border-b border-line bg-paper-3">
              <img src={solution.image} alt="" className="modal-img photo h-full w-full object-cover" />
            </div>
          )}

          <div className="modal-in p-6 sm:p-10">
            <div className="flex flex-wrap gap-2 font-code text-xs uppercase tracking-wider">
              <span className="bevel bg-signal px-3 py-1 text-on-signal">{solution.category}</span>
              <span className="border border-line px-3 py-1 text-muted2">SOL-{String(solution.id).padStart(2, "0")}</span>
            </div>
            <h3 className="extrude-sm mt-5 font-display text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl">{solution.title}</h3>

            <div className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
              <div>
                <p className="font-code text-xs uppercase tracking-[0.2em] text-beam">// Overview</p>
                <p className="mt-3 leading-relaxed text-muted2">{solution.description}</p>

                {solution.capabilities.length > 0 && (
                  <>
                    <p className="mt-8 font-code text-xs uppercase tracking-[0.2em] text-beam">// Capabilities</p>
                    <ul className="mt-3 space-y-3">
                      {solution.capabilities.map((c) => (
                        <li key={c} className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-signal" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="space-y-6 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div>
                  <p className="font-code text-xs uppercase tracking-[0.2em] text-muted2">Domain</p>
                  <p className="mt-1 font-medium">{solution.domain}</p>
                </div>
                <div>
                  <p className="font-code text-xs uppercase tracking-[0.2em] text-muted2">Tech stack</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {solution.tech.map((t) => (
                      <span key={t} className="border border-line bg-paper/50 px-2 py-1 font-code text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-code text-xs uppercase tracking-[0.2em] text-muted2">Deliverables</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {solution.deliverables.map((d, i) => (
                      <li key={d} className="flex gap-3">
                        <span className="font-code text-xs text-beam">0{i + 1}</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={enquire}
                  className="btn-signal press cut-sm group flex w-full items-center justify-center gap-2 bg-signal py-3 font-display text-sm font-semibold uppercase tracking-wide text-on-signal transition-colors hover:bg-signal-hi"
                >
                  Discuss this solution
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <button onClick={onPrev} className="flex items-center gap-2 font-display text-sm font-medium uppercase tracking-wide text-muted2 transition-colors hover:text-beam">
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          <span className="hidden font-code text-[11px] uppercase tracking-wider text-muted2 sm:block">Esc to close · ← → to navigate</span>
          <button onClick={onNext} className="flex items-center gap-2 font-display text-sm font-medium uppercase tracking-wide text-muted2 transition-colors hover:text-beam">
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
