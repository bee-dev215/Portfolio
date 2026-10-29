import { useMemo, useState } from "react";
import { ArrowRight, Check, Minus, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import SolutionCard from "@/components/solutions/SolutionCard";
import { bookCall, industries, industryPath, solutionPath, solutions } from "@/data/company";
import { usePhotos } from "@/hooks/use-photos";

// "All" is the "no filter" value
const categories = ["All", ...Array.from(new Set(solutions.map((s) => s.category).filter(Boolean)))];

// Lower-cased text each solution is searched by
const haystack = (s: (typeof solutions)[number]) =>
  [s.title, s.category, s.domain, s.summary, s.description, ...s.capabilities, ...s.tech, ...s.deliverables].join(" ").toLowerCase();

export default function SolutionsIndex() {
  const photos = usePhotos();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return solutions.filter((s) => (filter === "All" || s.category === filter) && words.every((w) => haystack(s).includes(w)));
  }, [filter, query]);

  const reset = () => {
    setFilter("All");
    setQuery("");
  };

  return (
    <PageShell
      title="Solutions"
      description="Six working starting points for taking busywork off your team — Document AI, Knowledge Assistant, AI Voice Agent, Field Operations App, Reporting Autopilot and Client Portal — adapted to your systems and data."
    >
      <PageHero
        crumbs={[{ label: "Solutions" }]}
        eyebrow={`${solutions.length} solutions`}
        title={
          <>
            Start from software <span className="gradient-text">that already runs.</span>
          </>
        }
        lead="Each solution is a working starting point for a common kind of busywork. We adapt it to your systems, your data and your rules, so your two-week prototype begins from running software, not a blank page."
        actions={
          <>
            <button onClick={() => bookCall()} className="btn btn-primary px-7 py-3.5">
              Book a call
            </button>
            <a href="#fit" className="btn btn-secondary px-7 py-3.5">
              Which solution fits?
            </a>
          </>
        }
      />

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-[1240px]">
          {/* Filter and search */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              <div className="inline-flex gap-1 rounded-full border border-line bg-surface p-1" role="group" aria-label="Filter solutions by where they work">
                {categories.map((c) => (
                  <button
                    key={c}
                    aria-pressed={filter === c}
                    onClick={() => setFilter(c)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      filter === c ? "bg-grad text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]" : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <label className="relative block lg:w-80">
              <span className="sr-only">Search solutions</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search — e.g. invoices, scheduling, offline"
                className="field rounded-full py-2.5 pl-11 pr-10"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-subtle hover:bg-raised hover:text-ink"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>

          <p className="mt-6 text-sm text-subtle" aria-live="polite">
            Showing {list.length} of {solutions.length} solutions
            {filter !== "All" && ` for ${filter.toLowerCase()}`}
            {query && ` matching “${query}”`}
          </p>

          {list.length > 0 ? (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s, i) => (
                <li key={s.slug}>
                  <Reveal delay={(i % 3) * 80} className="h-full">
                    <SolutionCard solution={s} />
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card mt-6 flex flex-col items-center px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand-text">
                <Search className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold">No solution matches that yet</h2>
              <p className="mt-2 max-w-md text-ink-2">
                Try a broader word, or tell us about the task. Plenty of projects start from something that isn't on this list.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={reset} className="btn btn-secondary px-5 py-2.5 text-sm">
                  Clear filters
                </button>
                <button onClick={() => bookCall(query || undefined)} className="btn btn-primary px-5 py-2.5 text-sm">
                  Book a call
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Which solution fits? solutions × industries */}
      <section id="fit" className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Which solution fits?"
            title={
              <>
                Where each solution <span className="gradient-text">usually starts.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              The industries where each solution fits most naturally. Any of them can be adapted to other businesses; this is just a good place to start looking.
            </p>
          </SectionHeading>

          <Reveal delay={100}>
            <div className="card relative mt-12 overflow-x-auto rounded-3xl">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <caption className="sr-only">Solutions and the industries they suit</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-subtle sm:px-6">
                      Solution
                    </th>
                    {industries.map((ind) => (
                      <th key={ind.key} scope="col" className="px-3 py-4 text-center">
                        <Link to={industryPath(ind)} className="inline-flex flex-col items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-brand-text">
                          <img src={photos.src(ind.image)} alt="" loading="lazy" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                          {ind.title}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {solutions.map((s) => (
                    <tr key={s.slug} className="group border-b border-line last:border-0 hover:bg-raised/50">
                      <th scope="row" className="px-5 py-4 sm:px-6">
                        <Link to={solutionPath(s)} className="flex items-center gap-3">
                          {s.image && <img src={photos.src(s.image)} alt="" loading="lazy" width={48} height={36} className="h-9 w-12 shrink-0 rounded-lg object-cover" />}
                          <span>
                            <span className="block font-display font-bold transition-colors group-hover:text-brand-text">{s.title}</span>
                            <span className="block text-xs font-normal text-subtle">{s.domain}</span>
                          </span>
                        </Link>
                      </th>
                      {industries.map((ind) => {
                        const fits = ind.solutions.includes(s.title);
                        return (
                          <td key={ind.key} className="px-3 py-4 text-center">
                            {fits ? (
                              <span className="inline-grid h-8 w-8 place-items-center rounded-full bg-grad text-white">
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Good fit</span>
                              </span>
                            ) : (
                              <span className="inline-grid h-8 w-8 place-items-center rounded-full text-subtle/60">
                                <Minus className="h-4 w-4" />
                                <span className="sr-only">Adaptable</span>
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-4 flex items-center gap-2 text-sm text-subtle sm:hidden">
            <ArrowRight className="h-4 w-4" /> Scroll the table sideways to see every industry.
          </p>
        </div>
      </section>

      <CtaBand
        kicker="Not on the list? Every project starts with a call."
        title="Tell us the task. We'll tell you if software can take it."
        primaryLabel="Book a call"
        secondary={{ label: "How we work", to: "/approach" }}
      />
    </PageShell>
  );
}
