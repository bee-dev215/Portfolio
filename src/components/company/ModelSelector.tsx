import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Info, Minus } from "lucide-react";
import { bookCall } from "@/data/company";
import { approachPriority, ModelApproachKey, modelApproaches, selectorQuestions } from "@/data/company-pages";

/**
 * "How we choose a model": the visitor answers three questions and sees the approach we'd start the
 * conversation from, with the reasons. Each answer adds to the approaches it favors; ties follow approachPriority.
 */
export default function ModelSelector() {
  const [answers, setAnswers] = useState<number[]>(selectorQuestions.map(() => 0));

  const { pick, ranked } = useMemo(() => {
    const totals = approachPriority.map((k) => ({
      key: k,
      score: selectorQuestions.reduce((n, q, qi) => n + q.options[answers[qi]].scores[k], 0),
    }));
    const sorted = [...totals].sort((a, b) => b.score - a.score || approachPriority.indexOf(a.key) - approachPriority.indexOf(b.key));
    return { pick: sorted[0].key as ModelApproachKey, ranked: sorted };
  }, [answers]);

  const best = modelApproaches[pick];
  const max = ranked[0].score || 1;

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      {/* Questions */}
      <div className="card p-6 sm:p-8">
        {selectorQuestions.map((q, qi) => (
          <div key={q.key} className={qi ? "mt-7 border-t border-line pt-7" : ""}>
            <fieldset>
              <legend className="font-display text-lg font-bold">
                <span className="mr-2 text-brand-text">{qi + 1}.</span>
                {q.question}
              </legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {q.options.map((o, oi) => {
                  const on = answers[qi] === oi;
                  return (
                    <label
                      key={o.label}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${
                        on
                          ? "border-transparent bg-grad text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]"
                          : "border-line bg-surface text-ink-2 hover:border-brand/40 hover:text-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`selector-${q.key}`}
                        checked={on}
                        onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                        className="sr-only"
                      />
                      {o.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>
        ))}
      </div>

      {/* Result */}
      <div className="grad-border rounded-3xl bg-surface" aria-live="polite">
        <div key={pick} className="mega-swap p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            <Info className="h-3.5 w-3.5" /> Where we'd start the conversation
          </p>
          <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
            <span className="gradient-text">{best.name}</span>
          </h3>
          <p className="mt-3 leading-relaxed text-ink-2">{best.summary}</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Strengths</p>
              <ul className="mt-3 space-y-2 text-sm">
                {best.strengths.map((s) => (
                  <li key={s} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Trade-offs</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-2">
                {best.tradeoffs.map((s) => (
                  <li key={s} className="flex gap-2.5">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-subtle" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-raised/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Why</p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-2">
              {selectorQuestions.map((q, qi) => (
                <li key={q.key}>{q.options[answers[qi]].note}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 space-y-2" aria-label="How the approaches compare for these answers">
            {ranked.map((r) => (
              <div key={r.key} className="flex items-center gap-3 text-sm">
                <span className={`w-40 shrink-0 truncate sm:w-48 ${r.key === pick ? "font-semibold text-ink" : "text-subtle"}`}>{modelApproaches[r.key].name}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
                  <span
                    className={`block h-full rounded-full transition-[width] duration-500 ${r.key === pick ? "bg-grad" : "bg-subtle/40"}`}
                    style={{ width: `${Math.max(6, (r.score / max) * 100)}%` }}
                  />
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-subtle">
            A starting point for discussion, not a recommendation. The final choice is made with you, and proven in the prototype on your own data.
          </p>
          <button onClick={() => bookCall(`Model choice (${best.name.toLowerCase()})`)} className="btn btn-secondary mt-5 px-5 py-2.5 text-sm">
            Talk it through with an engineer <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
