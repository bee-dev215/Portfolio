import { evalPipeline } from "@/data/company-pages";
import Reveal from "../site/Reveal";

/** Evaluation pipeline: numbered steps joined by a gradient rail (horizontal on wide screens, vertical on phones). */
export default function EvalPipeline() {
  return (
    <ol className="relative mt-12 grid gap-4 lg:grid-cols-5 lg:gap-5">
      <span className="bg-grad absolute bottom-6 left-[23px] top-6 w-[2px] opacity-40 lg:bottom-auto lg:left-6 lg:right-6 lg:top-[23px] lg:h-[2px] lg:w-auto" aria-hidden="true" />
      {evalPipeline.map((s, i) => (
        <li key={s.title} className="relative">
          <Reveal delay={i * 90} className="h-full">
            <div className="flex h-full gap-4 lg:flex-col">
              <span className="icon-tile relative z-[1] h-12 w-12 shrink-0 rounded-full font-display text-base font-extrabold">{i + 1}</span>
              <div className="card flex-1 p-5">
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{s.desc}</p>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
