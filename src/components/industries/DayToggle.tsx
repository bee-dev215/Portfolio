import { CSSProperties, useState } from "react";
import { Info, Sparkles, Timer } from "lucide-react";
import { IndustryDetail } from "@/data/industry-details";
import "./day-toggle.css";

type View = "before" | "after";

const views: { key: View; label: string; icon: typeof Timer }[] = [
  { key: "before", label: "Today", icon: Timer },
  { key: "after", label: "With AI support", icon: Sparkles },
];

/** An illustrative day for one role, switchable between today and with AI support. */
export default function DayToggle({ day }: { day: IndustryDetail["day"] }) {
  const [view, setView] = useState<View>("before");
  const after = view === "after";

  return (
    <div className="card shadow-soft overflow-hidden rounded-3xl">
      <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-subtle">A day in the life</p>
          <p className="mt-1 font-display text-lg font-bold">{day.role}</p>
        </div>
        <div className="flex w-full gap-1 rounded-full border border-line bg-raised p-1 sm:w-auto" role="group" aria-label="Show the day">
          {views.map((v) => (
            <button
              key={v.key}
              aria-pressed={view === v.key}
              onClick={() => setView(v.key)}
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 sm:flex-none ${
                view === v.key ? "bg-grad text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]" : "text-ink-2 hover:text-ink"
              }`}
            >
              <v.icon className="h-4 w-4" /> {v.label}
            </button>
          ))}
        </div>
      </div>

      <ol className="relative p-5 sm:p-6" aria-live="polite">
        <span className={`absolute bottom-10 left-[2.15rem] top-10 w-px sm:left-[2.4rem] ${after ? "bg-grad" : "bg-line"}`} aria-hidden="true" />
        {day.moments.map((m, i) => (
          <li key={m.time} className="relative flex gap-4 py-3 sm:gap-5">
            <span
              className={`relative z-[1] mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-[11px] font-bold transition-colors duration-300 ${
                after ? "border-transparent bg-grad text-white" : "border-line bg-surface text-subtle"
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">{m.time}</p>
              <p key={view} className={`day-swap mt-1 leading-relaxed ${after ? "text-ink" : "text-ink-2"}`} style={{ "--i": i } as CSSProperties}>
                {after ? m.after : m.before}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="flex items-center gap-2 border-t border-line bg-raised/50 px-5 py-3 text-xs text-subtle sm:px-6">
        <Info className="h-3.5 w-3.5 shrink-0" /> Illustrative example of how the work could change — not a description of a specific client.
      </p>
    </div>
  );
}
