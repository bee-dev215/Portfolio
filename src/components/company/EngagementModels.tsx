import { useState } from "react";
import { ArrowUpRight, Briefcase, Check, GraduationCap, LucideIcon, Repeat, Users } from "lucide-react";
import { startEnquiry } from "@/data/company";
import { EngagementModel, engagementModels } from "@/data/company-pages";

const icons: Record<EngagementModel["key"], LucideIcon> = { project: Briefcase, retainer: Repeat, training: GraduationCap };

/** Three ways to engage: tabs pick one; the card compares what it's for, how it's priced and what you get. */
export default function EngagementModels() {
  const [active, setActive] = useState(0);
  const m = engagementModels[active];
  const Icon = icons[m.key];

  return (
    <div className="mt-12">
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Ways to engage" className="inline-flex gap-1 rounded-full border border-line bg-surface p-1">
          {engagementModels.map((e, i) => {
            const TabIcon = icons[e.key];
            const on = i === active;
            return (
              <button
                key={e.key}
                role="tab"
                id={`engage-tab-${e.key}`}
                aria-selected={on}
                aria-controls="engage-panel"
                onClick={() => setActive(i)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  on ? "bg-grad text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]" : "text-ink-2 hover:text-ink"
                }`}
              >
                <TabIcon className="h-4 w-4" /> {e.name}
              </button>
            );
          })}
        </div>
      </div>

      <div id="engage-panel" role="tabpanel" aria-labelledby={`engage-tab-${m.key}`} className="card shadow-soft mt-6 overflow-hidden rounded-3xl">
        <div key={m.key} className="mega-swap grid lg:grid-cols-[1fr_1.1fr]">
          <div className="relative border-b border-line p-7 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="bg-grad pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full opacity-[.12] blur-3xl" />
            <span className="icon-tile relative h-12 w-12">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="relative mt-6 font-display text-3xl font-extrabold tracking-tight">{m.name}</h3>
            <p className="relative mt-3 text-lg leading-relaxed text-ink-2">{m.tagline}</p>
            <dl className="relative mt-8 space-y-5">
              {[
                ["Best for", m.bestFor],
                ["How it's priced", m.pricing],
                ["How it runs", m.shape],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-subtle">{k}</dt>
                  <dd className="mt-1 leading-relaxed text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <button onClick={() => startEnquiry(`a ${m.name.toLowerCase()}`)} className="btn btn-primary relative mt-9 px-6 py-3 text-sm">
              Discuss a {m.name.toLowerCase()} <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-8 p-7 sm:grid-cols-2 sm:p-10 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">What you get</p>
              <ul className="mt-4 space-y-3">
                {m.youGet.map((g) => (
                  <li key={g} className="flex gap-3 leading-relaxed">
                    <span className="bg-grad mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Typical team</p>
              <ul className="mt-4 space-y-3">
                {m.team.map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
                      <Users className="h-4 w-4" />
                    </span>
                    <span className="text-ink-2">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
