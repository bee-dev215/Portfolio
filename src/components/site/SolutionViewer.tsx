import { CSSProperties, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Solution, solutionPath, startEnquiry } from "@/data/company";
import { supportsViewTransitions } from "@/hooks/use-motion";

/** view-transition-name shared by the viewer photo and the panel photo it opens from (see index.css) */
export const PHOTO_VT = "solution-photo";
const SWIPE_PX = 50;

/** The panel photo frame for a solution, if it is on screen (the viewer morphs out of it and back into it). */
export function panelPhoto(id: Solution["id"]) {
  const el = document.querySelector<HTMLElement>(`[data-solution-photo="${id}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight ? el : null;
}

type Dir = "next" | "prev";

/** Full-screen split view: the photo fills one side, the details scroll on the other. */
export default function SolutionViewer({
  list,
  index,
  onClose,
  onGo,
}: {
  list: Solution[];
  index: number;
  onClose: (morph?: boolean) => void;
  onGo: (i: number, dir: Dir) => void;
}) {
  const solution = list[index];
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const many = list.length > 1;
  const upNext = list[(index + 1) % list.length];
  const pad = (n: number) => String(n).padStart(2, "0");

  const go = (d: Dir) => many && onGo((index + (d === "next" ? 1 : -1) + list.length) % list.length, d);

  useEffect(() => {
    closeBtn.current?.focus({ preventScroll: true });
    // keep the page from shifting when its scrollbar goes away
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = gap ? `${gap}px` : "";
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go("prev");
      if (e.key === "ArrowRight") go("next");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const enquire = () => {
    onClose(false);
    // wait a frame so the page scroll lock is released before scrolling to the form
    requestAnimationFrame(() => startEnquiry(solution.title));
  };

  const rise = (d: number) => ({ "--d": `${d}ms` }) as CSSProperties;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-canvas lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:overflow-hidden ${
        supportsViewTransitions() ? "" : "modal-in"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="solution-viewer-title"
    >
      <button
        ref={closeBtn}
        onClick={() => onClose()}
        className="glass fixed right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-transform duration-300 hover:rotate-90 sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Photo: swipe sideways to move between solutions */}
      <div
        className="relative h-[48svh] min-h-[300px] p-3 sm:p-4 lg:h-auto lg:min-h-0 lg:pr-0"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? "next" : "prev");
        }}
      >
        <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-raised" style={{ viewTransitionName: PHOTO_VT }}>
          {solution.image && <img key={solution.id} src={solution.image} alt="" className="kenburns h-full w-full object-cover" />}
          <div className="photo-fade absolute inset-0" />
        </div>
        <div className="pointer-events-none absolute inset-x-8 bottom-8 flex items-end justify-between gap-4 text-white sm:inset-x-10 sm:bottom-10">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{solution.category}</span>
          <span className="font-display font-bold tabular-nums">
            <span className="text-4xl sm:text-5xl">{pad(index + 1)}</span>
            <span className="text-white/60"> / {pad(list.length)}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:min-h-0">
        {/* Progress: one segment per solution, click to jump */}
        <div className="flex items-center gap-4 px-6 pt-6 sm:px-10 lg:px-14 lg:pr-24 lg:pt-8">
          <div className="flex flex-1 gap-1.5">
            {list.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i !== index && onGo(i, i > index ? "next" : "prev")}
                aria-label={s.title}
                aria-current={i === index ? "true" : undefined}
                className="group flex-1 py-2.5"
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-500 ${
                    i === index ? "bg-grad" : i < index ? "bg-brand/35 group-hover:bg-brand/60" : "bg-line group-hover:bg-brand/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div key={solution.id} className="flex-1 px-6 pb-10 pt-6 sm:px-10 lg:overflow-y-auto lg:px-14 lg:pt-8">
          <div className="viewer-rise" style={rise(140)}>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-text">{solution.domain}</p>
            <h3 id="solution-viewer-title" className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ "--i": 1 } as CSSProperties}>
              {solution.title}
            </h3>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-2" style={{ "--i": 2 } as CSSProperties}>
              {solution.description}
            </p>
          </div>

          {solution.capabilities.length > 0 && (
            <div className="viewer-rise mt-10" style={rise(320)}>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Capabilities</p>
              <ol className="mt-3 divide-y divide-line border-y border-line" style={{ "--i": 1 } as CSSProperties}>
                {solution.capabilities.map((c, i) => (
                  <li key={c} className="flex gap-5 py-4">
                    <span className="gradient-text font-display text-sm font-bold tabular-nums">{pad(i + 1)}</span>
                    <span className="text-ink">{c}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="viewer-rise mt-10 grid gap-8 sm:grid-cols-2" style={rise(440)}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Tech stack</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {solution.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ "--i": 1 } as CSSProperties}>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">You receive</p>
              <ul className="mt-3 space-y-2 text-sm">
                {solution.deliverables.map((d) => (
                  <li key={d} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="viewer-rise mt-10 flex flex-wrap gap-3" style={rise(540)}>
            <button onClick={enquire} className="btn btn-primary px-6 py-3.5 text-sm">
              Discuss this solution <ArrowUpRight className="h-4 w-4" />
            </button>
            {/* Leaving the page unmounts the viewer, which releases the scroll lock */}
            <Link to={solutionPath(solution)} className="btn btn-secondary px-6 py-3.5 text-sm" style={{ "--i": 1 } as CSSProperties}>
              Read the full page <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {many && (
          <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-canvas/85 px-4 py-3 backdrop-blur sm:px-8 lg:static lg:px-12">
            <button
              onClick={() => go("prev")}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-brand/40 hover:text-brand-text"
              aria-label="Previous solution"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={() => go("next")} className="group flex min-w-0 flex-1 items-center gap-4 rounded-2xl p-2 text-left transition-colors hover:bg-raised">
              <span className="h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-raised">
                {upNext.image && <img src={upNext.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-wider text-subtle">Next</span>
                <span className="block truncate font-display font-bold">{upNext.title}</span>
              </span>
              <span className="bg-grad grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
