import { useState } from "react";
import { Archive, ChevronLeft, ChevronRight, Cog, Database, LucideIcon, Inbox, Trash2 } from "lucide-react";
import { dataLifecycle } from "@/data/company-pages";

// One icon per stage, in the same order as dataLifecycle
const icons: LucideIcon[] = [Inbox, Cog, Database, Archive, Trash2];

/** Data lifecycle as a stepper: pick a stage (or step through) to see what happens to data there. */
export default function DataLifecycle() {
  const [step, setStep] = useState(0);
  const s = dataLifecycle[step];
  const Icon = icons[step % icons.length];
  const last = dataLifecycle.length - 1;

  return (
    <div className="card shadow-soft mt-12 overflow-hidden rounded-3xl">
      <ol className="grid grid-cols-5 border-b border-line" role="tablist" aria-label="Stages of the data lifecycle">
        {dataLifecycle.map((d, i) => {
          const StepIcon = icons[i % icons.length];
          const on = i === step;
          return (
            <li key={d.title} role="presentation" className="relative">
              <button
                role="tab"
                id={`life-tab-${i}`}
                aria-selected={on}
                aria-controls="life-panel"
                onClick={() => setStep(i)}
                className={`flex w-full flex-col items-center gap-2 px-1 py-4 text-xs font-semibold transition-colors sm:text-sm ${on ? "text-brand-text" : i < step ? "text-ink-2" : "text-subtle hover:text-ink"}`}
              >
                <span className={`grid h-10 w-10 place-items-center rounded-full transition-all ${on ? "bg-grad text-white shadow-[0_0_0_6px_rgb(var(--brand-rgb)/.14)]" : i < step ? "bg-brand-soft text-brand-text" : "bg-raised"}`}>
                  <StepIcon className="h-[18px] w-[18px]" />
                </span>
                {d.title}
              </button>
              <span className={`bg-grad absolute inset-x-0 bottom-[-1px] h-[2px] origin-left transition-transform duration-500 ${i <= step ? "scale-x-100" : "scale-x-0"}`} aria-hidden="true" />
            </li>
          );
        })}
      </ol>

      <div id="life-panel" role="tabpanel" aria-labelledby={`life-tab-${step}`} className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-9">
        <div key={step} className="mega-swap flex flex-1 gap-5">
          <span className="icon-tile h-14 w-14 shrink-0">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-text">
              Stage {step + 1} of {dataLifecycle.length}
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold">{s.title}</h3>
            <p className="mt-2 max-w-2xl leading-relaxed text-ink-2">{s.desc}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2 self-end sm:self-center">
          <button
            onClick={() => setStep((n) => Math.max(0, n - 1))}
            disabled={step === 0}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface transition-colors hover:border-brand/40 hover:text-brand-text disabled:opacity-40"
            aria-label="Previous stage"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setStep((n) => Math.min(last, n + 1))}
            disabled={step === last}
            className="btn btn-primary h-11 w-11 p-0 disabled:opacity-40"
            aria-label="Next stage"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
