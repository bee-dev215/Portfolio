import { CSSProperties, KeyboardEvent, useEffect, useRef, useState } from "react";
import { BadgeCheck, Check, FileText, MessageCircle, Wallet } from "lucide-react";
import { principles, PrincipleKey } from "@/data/company";
import { prefersReducedMotion, useInView } from "@/hooks/use-motion";
import Reveal, { SectionHeading } from "./Reveal";

const CYCLE = 6000; // ms each principle stays on before the next one

/** The small UI card that floats over each principle's photo and shows the idea in practice. Sample data. */
function Proof({ k }: { k: PrincipleKey }) {
  if (k === "remote")
    return (
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
          <FileText className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-ink">Hand-over note · 18:00</p>
          <p className="mt-0.5 text-xs leading-snug text-ink-2">3 tickets open, refund for #482 approved — over to Manila.</p>
          <p className="mt-2 flex gap-1.5 text-[11px] text-subtle">
            <span className="rounded-full bg-raised px-2 py-0.5">Async</span>
            <span className="rounded-full bg-raised px-2 py-0.5">Read by 4</span>
          </p>
        </div>
      </div>
    );
  if (k === "transparent")
    return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <Wallet className="h-4 w-4 text-brand-text" /> Payslip · 1–15 Nov
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            <BadgeCheck className="h-3 w-3" /> On time
          </span>
        </div>
        <ul className="mt-2.5 space-y-1 text-xs text-ink-2">
          <li className="flex justify-between"><span>Base pay · 80 h</span><span className="font-mono tabular-nums">$960.00</span></li>
          <li className="flex justify-between"><span>Quality bonus</span><span className="font-mono tabular-nums">$75.00</span></li>
        </ul>
      </div>
    );
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-iris/15 text-iris">
        <MessageCircle className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-ink">
          Your lead <span className="font-normal text-subtle">· 2 min ago</span>
        </p>
        <p className="mt-0.5 text-xs leading-snug text-ink-2">No worries — let's fix it together. Jumping on a call now.</p>
        <span className="typing mt-2 inline-flex gap-1 text-subtle" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}

/**
 * How we work: the three principles as selectable rows on the left (the active one turns into a dark card and opens),
 * a photo stage on the right that cross-fades to match, with a floating card showing the idea in practice.
 * It advances on its own while in view, pauses on hover, and stops once the reader picks one.
 */
export default function HowWeWork() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const running = auto && inView && !paused && !prefersReducedMotion();

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % principles.length), CYCLE);
    return () => window.clearTimeout(id);
  }, [running, active]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  // Arrow keys move between the rows, as in any tab list
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + principles.length) % principles.length;
    pick(next);
    tabs.current[next]?.focus();
  };

  const p = principles[active];

  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          split
          label="How we work"
          title={
            <>
              Built for people who work <span className="gradient-text">from anywhere.</span>
            </>
          }
        >
          <p className="text-lg leading-relaxed text-ink-2">Three principles shape every role, every team and every day at Jovano — wherever in the world you log in from.</p>
        </SectionHeading>

        <div
          ref={ref}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:gap-16"
        >
          {/* Principles */}
          <Reveal variant="left">
            <div role="tablist" aria-label="Our principles" aria-orientation="vertical" className="relative space-y-3">
              {principles.map((x, i) => {
                const on = i === active;
                return (
                  <button
                    key={x.key}
                    ref={(el) => (tabs.current[i] = el)}
                    role="tab"
                    id={`principle-${x.key}`}
                    aria-selected={on}
                    aria-controls="principle-stage"
                    tabIndex={on ? 0 : -1}
                    onClick={() => pick(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={`principle group relative block w-full overflow-hidden rounded-[1.5rem] border p-6 text-left transition-[background-color,border-color,box-shadow,transform] duration-500 sm:p-7 ${
                      on ? "is-on border-transparent bg-ink text-canvas shadow-[0_24px_50px_-24px_rgb(15_31_61/.7)]" : "border-line bg-surface hover:-translate-y-0.5 hover:border-line-strong"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-mono text-sm font-bold transition-colors duration-500 ${
                          on ? "bg-volt text-[#0b1020]" : "bg-brand-soft text-brand-text"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`font-display text-[1.45rem] font-medium leading-tight transition-colors ${on ? "text-canvas" : "text-ink"}`}>{x.title}</span>
                    </span>
                    {/* Opens on the active row */}
                    <span className="principle-body grid">
                      <span className="overflow-hidden">
                        <span className="block pl-[3.75rem] pt-4">
                          <span className="block leading-relaxed text-canvas/80">{x.desc}</span>
                          <span className="mt-4 flex flex-wrap gap-2">
                            {x.points.map((pt) => (
                              <span key={pt} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-canvas/90">
                                <Check className="h-3 w-3 text-volt" /> {pt}
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                    </span>
                    {/* Time until the next principle */}
                    {on && (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10" aria-hidden="true">
                        <span
                          key={`${active}-${running}`}
                          className={`principle-timer block h-full bg-volt ${running ? "is-running" : ""}`}
                          style={{ "--cycle": `${CYCLE}ms` } as CSSProperties}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Photo stage */}
          <Reveal variant="right" delay={100}>
            <div id="principle-stage" role="tabpanel" aria-labelledby={`principle-${p.key}`} className="relative px-2 pb-10 pt-4 sm:px-6">
              <div className="tilt-back absolute inset-x-0 bottom-4 top-0 rounded-[2.25rem]" aria-hidden="true" />
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] border border-line bg-raised shadow-[0_40px_80px_-40px_rgb(15_31_61/.55)]">
                {principles.map((x, i) => (
                  <img
                    key={x.key}
                    src={x.image}
                    alt=""
                    loading="lazy"
                    width={1280}
                    height={800}
                    style={{ objectPosition: x.focus }}
                    className={`stage-photo absolute inset-0 h-full w-full object-cover ${i === active ? "is-on" : ""}`}
                  />
                ))}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgb(15_31_61/.55)] via-transparent to-transparent" />
                <p key={`label-${active}`} className="stage-in absolute left-5 top-5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#0f1f3d] shadow-sm backdrop-blur">
                  {String(active + 1).padStart(2, "0")} · {p.title}
                </p>
              </div>
              {/* The idea in practice */}
              <div key={`proof-${active}`} className="stage-card absolute -bottom-2 left-0 right-6 rounded-2xl border border-line bg-surface p-4 shadow-[0_24px_50px_-20px_rgb(15_31_61/.45)] sm:left-auto sm:right-0 sm:w-[330px]">
                <Proof k={p.key} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Dots, for a quick jump on small screens */}
        <div className="mt-8 flex justify-center gap-2 lg:hidden">
          {principles.map((x, i) => (
            <button
              key={x.key}
              onClick={() => pick(i)}
              aria-label={`Show ${x.title}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-7 bg-brand" : "w-2 bg-line-strong"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
