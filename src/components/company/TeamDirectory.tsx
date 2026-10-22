import { useMemo, useState } from "react";
import { Discipline, disciplines, disciplinesOf } from "@/data/company-pages";
import { useTeam } from "@/hooks/use-team";
import { TeamCard } from "../site/Team";
import Reveal from "../site/Reveal";

type Filter = "Everyone" | Discipline;

/** The whole team, filterable by discipline (read from each person's role). */
export default function TeamDirectory() {
  const { team, ready } = useTeam();
  const [filter, setFilter] = useState<Filter>("Everyone");

  // Only offer disciplines someone actually belongs to
  const options = useMemo<Filter[]>(() => ["Everyone", ...disciplines.filter((d) => team.some((m) => disciplinesOf(m).includes(d)))], [team]);
  const count = (f: Filter) => (f === "Everyone" ? team.length : team.filter((m) => disciplinesOf(m).includes(f)).length);
  const list = filter === "Everyone" ? team : team.filter((m) => disciplinesOf(m).includes(filter));

  if (!ready) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="status">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="card aspect-[4/5] animate-pulse bg-raised" />
        ))}
        <span className="sr-only">Loading the team…</span>
      </div>
    );
  }

  return (
    <>
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div role="group" aria-label="Filter the team by discipline" className="inline-flex gap-1 rounded-full border border-line bg-surface p-1">
          {options.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={on}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  on ? "bg-grad text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]" : "text-ink-2 hover:text-ink"
                }`}
              >
                {f}
                <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${on ? "bg-white/20" : "bg-raised text-subtle"}`}>{count(f)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {list.length} {list.length === 1 ? "person" : "people"}
      </p>

      {/* Keyed by filter so the cards replay their entrance */}
      <div key={filter} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((m, i) => (
          <Reveal key={m.name} delay={(i % 4) * 70} className="h-full">
            <TeamCard member={m} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
