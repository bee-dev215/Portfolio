import { useState } from "react";
import { Check } from "lucide-react";
import { phases } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";

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

export default function Process() {
  const [active, setActive] = useState(0);
  const phase = phases[active];

  return (
    <section id="process" className="band px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          label="Process"
          title={
            <>
              From first idea to <span className="gradient-text">measurable impact.</span>
            </>
          }
        >
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            Every engagement moves through {phases.length} phases, each with clear outputs and a decision point — so you always know what is done, what is next and what you will receive.
          </p>
        </SectionHeading>

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
          <Reveal variant="left">
            <ol className="relative space-y-2" role="tablist" aria-label="Delivery phases" aria-orientation="vertical">
              {/* progress rail */}
              <span className="absolute bottom-8 left-[27px] top-8 w-px bg-line" aria-hidden="true" />
              <span
                className="bg-grad absolute left-[26px] top-8 w-[3px] rounded-full transition-all duration-500"
                style={{ height: `calc(${(active / (phases.length - 1)) * 100}% - ${(active / (phases.length - 1)) * 64}px)` }}
                aria-hidden="true"
              />
              {phases.map((p, i) => {
                const isActive = i === active;
                const done = i < active;
                return (
                  <li key={p.id}>
                    <button
                      role="tab"
                      id={`phase-tab-${i}`}
                      aria-selected={isActive}
                      aria-controls="phase-panel"
                      onClick={() => setActive(i)}
                      className={`relative flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-all duration-300 ${
                        isActive ? "card" : "hover:bg-surface/70"
                      }`}
                    >
                      <span
                        className={`relative z-[1] grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-sm font-bold transition-colors ${
                          isActive ? "bg-grad text-white shadow-[0_8px_18px_-8px_rgb(var(--brand-rgb)/.8)]" : done ? "bg-brand-soft text-brand-text" : "border border-line bg-surface text-subtle"
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      <span>
                        <span className={`block font-display text-lg font-bold ${isActive ? "text-ink" : "text-ink-2"}`}>{p.name}</span>
                        <span className="block text-sm text-subtle">{p.title}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal variant="right" delay={100}>
            <div id="phase-panel" role="tabpanel" aria-labelledby={`phase-tab-${active}`} className="card relative h-full overflow-hidden p-7 sm:p-10">
              <div className="bg-grad pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[.12] blur-3xl" />
              <div key={phase.id} className="msg-in relative">
                <p className="text-sm font-semibold text-brand-text">
                  Phase {String(active + 1).padStart(2, "0")} of {String(phases.length).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{phase.name}</h3>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{phase.summary}</p>
                <ul className="mt-7 space-y-4">
                  {phase.activities.map((a) => (
                    <li key={a} className="flex gap-3 leading-relaxed">
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
                  {phase.outputs.map((t) => (
                    <span key={t} className="chip border-brand/20 bg-brand-soft text-brand-text">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
