import { CSSProperties, useEffect, useRef } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { Solution } from "@/data/company";

const HOVER_INTENT_MS = 90; // sweeping the mouse across the row shouldn't open every panel on the way

/**
 * One photo panel in the Solutions gallery. Collapsed it is a numbered spine; active it opens wide (tall on phones) and
 * tells the story. Hover, keyboard focus or a tap makes it active; clicking the active panel opens the viewer.
 */
export default function SolutionPanel({
  solution,
  index,
  active,
  onActivate,
  onOpen,
}: {
  solution: Solution;
  index: number;
  active: boolean;
  onActivate: () => void;
  onOpen: () => void;
}) {
  const timer = useRef<number>();
  const num = String(index + 1).padStart(2, "0");

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <article
      className={`sol-panel relative overflow-hidden rounded-3xl bg-raised ${active ? "is-active" : ""}`}
      style={{ "--n": index } as CSSProperties}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !active) timer.current = window.setTimeout(onActivate, HOVER_INTENT_MS);
      }}
      onPointerLeave={() => window.clearTimeout(timer.current)}
    >
      {/* The viewer's photo morphs out of this frame and back into it */}
      <div data-solution-photo={solution.id} className="absolute inset-0 overflow-hidden rounded-[inherit]">
        {solution.image && <img src={solution.image} alt="" loading="lazy" width={736} height={460} className="sol-panel-img h-full w-full object-cover" />}
      </div>
      <div className="photo-fade absolute inset-0" />
      <div className="sol-panel-tint absolute inset-0" />

      {/* Collapsed: number and title on a spine (vertical on desktop, a row on phones) */}
      <div className="sol-panel-spine absolute inset-0 flex items-center gap-4 px-5 text-white lg:flex-col lg:justify-between lg:px-0 lg:py-7" aria-hidden="true">
        <span className="font-display text-sm font-bold tabular-nums text-white/70">{num}</span>
        <span className="min-w-0 flex-1 truncate font-display text-lg font-bold tracking-tight lg:flex-none lg:rotate-180 lg:[writing-mode:vertical-rl]">{solution.title}</span>
        <Plus className="h-5 w-5 shrink-0 text-white/70 lg:hidden" />
      </div>

      {/* Active: fixed width so the text doesn't reflow while the panel grows */}
      <div className="sol-panel-body absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:right-auto lg:w-[34rem] lg:p-10" aria-hidden={!active}>
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur" style={{ "--i": 0 } as CSSProperties}>
          {num} · {solution.category}
        </span>
        <h3 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ "--i": 1 } as CSSProperties}>
          {solution.title}
        </h3>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/70" style={{ "--i": 2 } as CSSProperties}>
          {solution.domain}
        </p>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/85" style={{ "--i": 3 } as CSSProperties}>
          {solution.summary}
        </p>
        <div className="mt-6 flex items-center gap-4" style={{ "--i": 4 } as CSSProperties}>
          <span className="sol-panel-cta btn bg-white px-5 py-2.5 text-sm text-[#1e1b4b]">
            Explore solution <ArrowUpRight className="h-4 w-4" />
          </span>
          <span className="hidden truncate text-xs font-medium text-white/60 sm:block">{solution.tech.slice(0, 3).join(" · ")}</span>
        </div>
      </div>

      <button
        data-solution-trigger={solution.id}
        onClick={() => (active ? onOpen() : onActivate())}
        // keyboard focus opens the panel; a pointer press waits for the click so the first tap on a phone only expands it
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && onActivate()}
        aria-label={`View ${solution.title} details`}
        className="absolute inset-0 z-[2] rounded-[inherit] focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
      />
    </article>
  );
}
