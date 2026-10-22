import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { OPEN_SOLUTION_EVENT, Solution, scrollToId, solutions, startEnquiry } from "@/data/company";
import SolutionCard from "./SolutionCard";
import SolutionModal from "./SolutionModal";
import Reveal, { SectionHeading } from "./Reveal";

// "All" is the "no filter" value
const categories = ["All", ...Array.from(new Set(solutions.map((s) => s.category).filter(Boolean)))];

export default function Solutions() {
  const [filter, setFilter] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const list = useMemo(() => (filter === "All" ? solutions : solutions.filter((s) => s.category === filter)), [filter]);

  // Audience cards and the footer open a solution by title: clear the filter so it is in the list, then open it
  useEffect(() => {
    const onOpen = (e: Event) => {
      const i = solutions.findIndex((s) => s.title === (e as CustomEvent<string>).detail);
      if (i === -1) return;
      setFilter("All");
      setOpenIndex(i);
    };
    window.addEventListener(OPEN_SOLUTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SOLUTION_EVENT, onOpen);
  }, []);

  const modalSolution = openIndex !== null ? list[openIndex] ?? null : null;
  const openSolution = (s: Solution) => setOpenIndex(list.findIndex((x) => x.id === s.id));

  return (
    <section id="solutions" className="band relative px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          label="Solutions"
          center
          title={
            <>
              Proven blueprints, <span className="gradient-text">tailored to you.</span>
            </>
          }
        >
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            Starting points we adapt to your learners, your content and your platform — so your project begins from working software, not a blank page.
          </p>
        </SectionHeading>

        <Reveal delay={80}>
          <div className="mt-10 flex justify-center">
            <div className="-mx-5 flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 px-1 sm:mx-0" role="tablist" aria-label="Filter solutions by audience">
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={filter === c}
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
        </Reveal>

        {/* Keyed by filter so the cards replay their entrance when the filter changes */}
        <div key={filter} className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 90} className="h-full">
              <SolutionCard solution={s} onOpen={openSolution} />
            </Reveal>
          ))}
        </div>

        <SolutionModal
          solution={modalSolution}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => (i === null ? null : (i - 1 + list.length) % list.length))}
          onNext={() => setOpenIndex((i) => (i === null ? null : (i + 1) % list.length))}
        />

        {/* Call-to-action band */}
        <Reveal delay={100} variant="scale">
          <div className="relative mt-20 overflow-hidden rounded-[2rem] bg-grad p-8 text-white sm:p-12 lg:p-14">
            <img src="/images/cta-backdrop.webp" alt="" loading="lazy" width={740} height={416} className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#312e81]/80 via-[#5b21b6]/50 to-transparent" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-semibold text-white/80">Not on the list? Every engagement starts with discovery.</p>
                <h3 className="mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">Have a learning problem AI could solve?</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => startEnquiry()} className="btn bg-white px-6 py-3.5 text-[#3730a3] shadow-lg hover:-translate-y-px">
                  Start a project <ArrowUpRight className="h-4 w-4" />
                </button>
                <button onClick={() => scrollToId("process")} className="btn border border-white/40 px-6 py-3.5 text-white hover:bg-white/10">
                  How we work <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
