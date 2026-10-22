import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { handoverChecklist } from "@/data/company-pages";

/** The handover list as a checklist the visitor can tick through (kept only for this page view). */
export default function HandoverChecklist() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const count = done.size;
  const total = handoverChecklist.length;

  const toggle = (i: number) =>
    setDone((d) => {
      const next = new Set(d);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="card shadow-soft rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg font-bold">Handover checklist</p>
          <p className="mt-0.5 text-sm text-subtle">Tick through what you receive at the end of a build.</p>
        </div>
        <button
          onClick={() => setDone(new Set())}
          disabled={count === 0}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-raised hover:text-brand-text disabled:opacity-40"
          aria-label="Clear the checklist"
          title="Clear"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3" aria-hidden="true">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-raised">
          <div className="bg-grad h-full rounded-full transition-[width] duration-500" style={{ width: `${(count / total) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-ink-2">
          {count}/{total}
        </span>
      </div>

      <ul className="mt-5 space-y-1.5">
        {handoverChecklist.map((item, i) => {
          const on = done.has(i);
          return (
            <li key={item}>
              <label className={`flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${on ? "bg-brand-soft" : "hover:bg-raised"}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(i)} className="peer sr-only" />
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-brand ${
                    on ? "border-transparent bg-grad text-white" : "border-line bg-surface"
                  }`}
                >
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className={`text-[15px] transition-colors ${on ? "font-medium text-brand-text" : "text-ink"}`}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-sm text-subtle" aria-live="polite">
        {count === total ? "That's everything — your team can run it without us." : "Everything on this list is yours to keep."}
      </p>
    </div>
  );
}
