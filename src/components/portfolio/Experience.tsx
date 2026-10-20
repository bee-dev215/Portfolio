import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { experience } from "@/data/portfolio";
import Reveal, { SectionHeading } from "./Reveal";

function Achievement({ text }: { text: string }) {
  const i = text.indexOf(": ");
  if (i === -1) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold text-ink">{text.slice(0, i)}</strong>
      <span className="text-muted2"> — {text.slice(i + 2)}</span>
    </>
  );
}

/** Fills a vertical rail as the list scrolls past the middle of the screen and lights up each job's node. */
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

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0);
  const { list, fill } = useScrollRail();

  return (
    <section id="experience" className="border-y border-line bg-paper-2/60 px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          index="04"
          label="Experience"
          title={
            <>
              Employment <span className="glow-text text-signal">history.</span>
            </>
          }
        >
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted2">
            From Angular developer to senior full-stack developer — over eight years of shipping, now building education software in Switzerland.
          </p>
        </SectionHeading>

        <ol ref={list} className="relative mt-14 border-t border-line pl-7 sm:pl-10">
          {/* progress rail */}
          <span className="absolute bottom-0 left-[7px] top-0 w-px bg-ink/15 sm:left-[11px]" aria-hidden="true" />
          <span
            ref={fill}
            className="absolute bottom-0 left-[6px] top-0 w-[3px] origin-top bg-signal shadow-[0_0_10px_rgba(255,107,26,.7)] transition-transform duration-200 ease-out sm:left-[10px]"
            style={{ transform: "scaleY(0)" }}
            aria-hidden="true"
          />

          {experience.map((job, i) => {
            const isOpen = open === i;
            const isCurrent = job.end === "Present";
            return (
              <li key={job.id} className="relative border-b border-line">
                <span data-node className="rail-node absolute -left-7 top-9 sm:-left-9 sm:top-11" aria-hidden="true" />
                <Reveal delay={i * 80} variant="left">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group grid w-full grid-cols-[1fr_auto] items-start gap-4 py-7 text-left sm:grid-cols-[11rem_1fr_auto] sm:gap-8 sm:py-9"
                  >
                    <div className="col-span-2 flex flex-wrap items-center gap-3 font-code text-sm sm:col-span-1 sm:block">
                      <span className={isOpen ? "text-signal" : "text-muted2"}>
                        {job.start} — {job.end}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1.5 border border-signal/40 bg-signal/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-signal sm:mt-2 sm:flex sm:w-fit">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-signal" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                          </span>
                          Now
                        </span>
                      )}
                    </div>
                    <div className="col-start-1 sm:col-start-2">
                      <h3 className="font-display text-2xl font-semibold uppercase leading-tight tracking-wide transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
                        {job.role}
                      </h3>
                      <p className="mt-1.5 text-muted2">
                        <span className="font-medium text-ink">{job.company}</span>
                        {job.type && ` · ${job.type}`}
                        {job.location && ` · ${job.location}`}
                      </p>
                    </div>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center border transition-all duration-300 ${
                        isOpen ? "rotate-45 border-signal bg-signal text-paper" : "border-line group-hover:border-signal group-hover:text-signal"
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
                          <p className="max-w-2xl text-lg leading-relaxed">{job.summary}</p>
                          <ul className="mt-6 space-y-3.5">
                            {job.achievements.map((a, ai) => (
                              <li key={a} className="exp-item flex gap-3 leading-relaxed" style={{ ["--i" as string]: ai }}>
                                <span className="mt-2.5 h-2 w-2 shrink-0 rotate-45 bg-signal" />
                                <span>
                                  <Achievement text={a} />
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-7 flex flex-wrap gap-2">
                            {job.tech.map((t, ti) => (
                              <span
                                key={t}
                                className="exp-item cut-sm border border-line bg-paper px-3 py-1.5 font-code text-xs text-ink/90"
                                style={{ ["--i" as string]: job.achievements.length + ti * 0.5 }}
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
