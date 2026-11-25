import { steps } from "@/data/company";
import Reveal from "./Reveal";

/** Splits "Label: detail" so the label can be set in bold. */
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

/** Each step in detail, as alternating rows: the text with a circle-numbered list, and a photo on a tilted backdrop. */
export default function StepDetails() {
  return (
    <section className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1200px] space-y-24 lg:space-y-32">
        {steps.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={s.id} id={`step-${s.id}`} className="grid scroll-mt-28 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <Reveal variant={flip ? "right" : "left"} className={flip ? "lg:order-2" : ""}>
                <p className="eyebrow">
                  Step {String(i + 1).padStart(2, "0")} · {s.time}
                </p>
                <h3 className="mt-4 font-display text-[clamp(2rem,3.6vw,2.9rem)] font-normal leading-[1.08] tracking-[-0.02em] text-ink">{s.name}</h3>
                <p className="mt-5 text-lg leading-relaxed text-ink-2">{s.summary}</p>
                <ol className="mt-8 space-y-5">
                  {s.activities.map((a, k) => (
                    <li key={a} className="flex gap-4 leading-relaxed">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-text">{k + 1}</span>
                      <span className="pt-0.5">
                        <Activity text={a} />
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-subtle">You'll need</span>
                  {s.needs.map((n) => (
                    <span key={n} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink-2">
                      {n}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal variant={flip ? "left" : "right"} delay={100} className={flip ? "lg:order-1" : ""}>
                <div className="relative px-3 py-3 sm:px-6 sm:py-6">
                  <div className={`tilt-back absolute inset-0 rounded-[2rem] ${flip ? "is-flip" : ""}`} aria-hidden="true" />
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-line bg-surface p-2 shadow-[0_30px_60px_-30px_rgb(15_31_61/.4)]">
                    <img src={s.image} alt="" loading="lazy" width={1280} height={800} style={{ objectPosition: s.focus }} className="aspect-[16/11] w-full rounded-[1.1rem] object-cover" />
                  </div>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
