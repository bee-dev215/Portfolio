import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { phases } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";

function Activity({ text }: { text: string }) {
  const i = text.indexOf(": ");
  if (i === -1) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold text-ink">{text.slice(0, i)}</strong>
      <span className="text-muted2"> — {text.slice(i + 2)}</span>
    </>
  );
}

/** Fills a vertical rail as the list scrolls past the middle of the screen and lights up each phase's node. */
function useScrollRail() {
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.55 - r.top) / r.height));
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      el.querySelectorAll<HTMLElement>("[data-node]").forEach((node) => {
        // node.offsetTop is relative to its <li>, so add the <li>'s offset within the list
        const top = (node.parentElement?.offsetTop ?? 0) + node.offsetTop;
        node.dataset.active = String(top / r.height <= p);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { list, fill };
}

export default function Process() {
  const [open, setOpen] = useState<number | null>(0);
  const { list, fill } = useScrollRail();

  return (
    <section id="process" className="px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          index="04"
          label="Process"
          title={
            <>
              From first survey to <span className="glow-text text-beam">full production.</span>
            </>
          }
        >
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted2">
            Every engagement moves through {phases.length} phases, each with clear outputs and an acceptance gate — so you always know what is done, what is next and what you will receive.
          </p>
        </SectionHeading>

        <ol ref={list} className="relative mt-14 border-t border-line pl-7 sm:pl-10">
          {/* progress rail */}
          <span className="absolute bottom-0 left-[7px] top-0 w-px bg-ink/15 sm:left-[11px]" aria-hidden="true" />
          <span
            ref={fill}
            className="absolute bottom-0 left-[6px] top-0 w-[3px] origin-top bg-signal glow-line transition-transform duration-200 ease-out sm:left-[10px]"
            style={{ transform: "scaleY(0)" }}
            aria-hidden="true"
          />

          {phases.map((phase, i) => {
            const isOpen = open === i;
            return (
              <li key={phase.id} className="relative border-b border-line">
                <span data-node className="rail-node absolute -left-7 top-9 sm:-left-9 sm:top-11" aria-hidden="true" />
                <Reveal delay={i * 80} variant="left">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group grid w-full grid-cols-[1fr_auto] items-start gap-4 py-7 text-left sm:grid-cols-[11rem_1fr_auto] sm:gap-8 sm:py-9"
                  >
                    <div className="col-span-2 font-code text-sm uppercase tracking-[0.18em] sm:col-span-1 sm:pt-2">
                      <span className={isOpen ? "text-beam" : "text-muted2"}>Phase {String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="col-start-1 sm:col-start-2">
                      <h3 className="font-display text-2xl font-semibold uppercase leading-tight tracking-wide transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
                        {phase.name}
                      </h3>
                      <p className="mt-1.5 font-medium text-ink/85">{phase.title}</p>
                    </div>
                    <span
                      className={`key-dark grid h-10 w-10 shrink-0 place-items-center border transition-all duration-300 ${
                        isOpen ? "rotate-45 border-signal bg-signal text-on-signal" : "border-line group-hover:border-signal group-hover:text-beam"
                      }`}
                    >
                      <Plus className="h-5 w-5" />
                    </span>
                  </button>

                  <div className={`grid transition-all duration-500 ease-out ${isOpen ? "exp-open grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="pb-10 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-8">
                        <div className="hidden sm:block" />
                        <div>
                          <p className="max-w-2xl text-lg leading-relaxed">{phase.summary}</p>
                          <ul className="mt-6 space-y-3.5">
                            {phase.activities.map((a, ai) => (
                              <li key={a} className="exp-item flex gap-3 leading-relaxed" style={{ ["--i" as string]: ai }}>
                                <span className="mt-2.5 h-2 w-2 shrink-0 rotate-45 bg-signal" />
                                <span>
                                  <Activity text={a} />
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-7 flex flex-wrap items-center gap-2">
                            <span className="exp-item mr-1 font-code text-[11px] uppercase tracking-[0.18em] text-muted2" style={{ ["--i" as string]: phase.activities.length }}>
                              Outputs
                            </span>
                            {phase.outputs.map((t, ti) => (
                              <span
                                key={t}
                                className="exp-item key-dark cut-sm border border-line bg-paper px-3 py-1.5 font-code text-xs text-ink/90"
                                style={{ ["--i" as string]: phase.activities.length + ti * 0.5 }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
