import { CSSProperties, useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { phases } from "@/data/company";
import { prefersReducedMotion } from "@/hooks/use-motion";
import Reveal, { SectionHeading } from "./Reveal";

// Cards pin below the navbar, each a little lower than the last so the stack shows its edges
const STICKY_TOP = 104;
const STACK_STEP = 18;

function Activity({ text }: { text: string }) {
  const i = text.indexOf(": ");
  if (i === -1) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold text-ink">{text.slice(0, i)}</strong>
      <span className="text-ink-2"> — {text.slice(i + 2)}</span>
    </>
  );
}

/**
 * Scroll-driven stack: each phase card pins in place and the next one slides up over it.
 * Writes --cover (0–1, how far the next card has covered this one) on every card and
 * reports the phase currently on top, so nothing here needs a click.
 */
function useCardStack(count: number) {
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let raf = 0;
    const update = () => {
      raf = 0;
      let top = 0;
      let total = 0;
      cards.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const pin = STICKY_TOP + i * STACK_STEP;
        if (r.top <= pin + 40) top = i;
        const next = cards.current[i + 1];
        let cover = 0;
        if (next && !reduced) {
          const nr = next.getBoundingClientRect();
          cover = Math.min(1, Math.max(0, (r.bottom - nr.top) / Math.max(1, r.height)));
        }
        total += cover;
        // light up a card's checklist once it is well into view, rather than only once it pins
        el.classList.toggle("is-reached", r.top < window.innerHeight * 0.6);
        el.style.setProperty("--cover", cover.toFixed(4));
      });
      setActive(top);
      // Continuous 0–1 across the whole stack: the sum of how far each card has been covered
      setProgress(reduced ? top / Math.max(1, count - 1) : total / Math.max(1, count - 1));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count]);

  return { cards, active, progress };
}

/** The five delivery phases. `more` adds a link to the full approach page (off on that page itself). */
export default function Process({ more = true }: { more?: boolean }) {
  const { cards, active, progress } = useCardStack(phases.length);

  return (
    <section id="process" className="band px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-16">
        {/* Left: heading and a live progress map that follows the stack */}
        <div className="lg:sticky lg:top-[104px] lg:self-start">
          <SectionHeading
            label="Process"
            title={
              <>
                From first idea to <span className="gradient-text">measurable impact.</span>
              </>
            }
          >
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
              Every engagement moves through {phases.length} phases, each with clear outputs and a decision point — so you always know what is done, what is next and what you will receive.
            </p>
            {more && (
              <Link to="/approach" className="btn btn-secondary mt-8 px-6 py-3 text-sm">
                How we engage <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </SectionHeading>

          <Reveal delay={120} className="hidden lg:block">
            <ol className="relative mt-10 space-y-1" aria-label="Delivery phases">
              <span className="absolute bottom-5 left-[17px] top-5 w-px bg-line" aria-hidden="true" />
              <span
                className="bg-grad absolute left-[16px] top-5 w-[3px] origin-top rounded-full"
                style={{ height: "calc(100% - 40px)", transform: `scaleY(${progress})` }}
                aria-hidden="true"
              />
              {phases.map((p, i) => {
                const state = i === active ? "now" : i < active ? "done" : "next";
                return (
                  <li key={p.id} className="relative flex items-center gap-4 py-2" aria-current={state === "now" ? "step" : undefined}>
                    <span
                      className={`stack-node relative z-[1] grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-sm font-bold ${
                        state === "now"
                          ? "is-now bg-grad text-white"
                          : state === "done"
                            ? "bg-brand-soft text-brand-text"
                            : "border border-line bg-surface text-subtle"
                      }`}
                    >
                      {state === "done" ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span className={`transition-all duration-500 ${state === "now" ? "translate-x-1" : "opacity-60"}`}>
                      <span className="block font-display text-lg font-bold text-ink">{p.name}</span>
                      <span className="block text-sm text-subtle">{p.title}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>

        {/* Right: the stack */}
        <ol className="relative" aria-label="What happens in each phase">
          {phases.map((p, i) => (
            <li
              key={p.id}
              ref={(el) => (cards.current[i] = el)}
              className="stack-card mb-6 last:mb-0 lg:sticky lg:mb-10"
              style={{ top: STICKY_TOP + i * STACK_STEP, zIndex: i + 1 } as CSSProperties}
            >
              <article className="stack-inner card relative overflow-hidden p-7 sm:p-10">
                <div className="bg-grad pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[.14] blur-3xl" />
                <span className="stack-num pointer-events-none absolute -right-2 -top-6 select-none font-display text-[9rem] font-extrabold leading-none sm:text-[11rem]" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <p className="text-sm font-semibold text-brand-text">
                    Phase {String(i + 1).padStart(2, "0")} of {String(phases.length).padStart(2, "0")} · {p.title}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{p.name}</h3>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{p.summary}</p>
                  <ul className="mt-7 space-y-4">
                    {p.activities.map((a, k) => (
                      <li key={a} className="stack-item flex gap-3 leading-relaxed" style={{ "--i": k } as CSSProperties}>
                        <span className="bg-grad mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>
                          <Activity text={a} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                    <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-subtle">You receive</span>
                    {p.outputs.map((t) => (
                      <span key={t} className="chip border-brand/20 bg-brand-soft text-brand-text">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Shade that deepens as the next card slides over */}
                <div className="stack-shade pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
