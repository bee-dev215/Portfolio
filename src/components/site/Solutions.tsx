import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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

  // Industry cards open a solution by title: clear the filter so it is in the list, then open it
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
    <section id="solutions" className="bay relative overflow-hidden border-y border-line px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="bay-glow pointer-events-none absolute inset-0" />
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="hazard pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-50" />
      <div className="relative mx-auto max-w-[1320px]">
        <SectionHeading
          index="03"
          label="Solutions"
          title={
            <>
              Solution blueprints, <span className="glow-text text-beam">adapted to you.</span>
            </>
          }
        >
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted2">
            Starting points we tailor to your hardware, process and site — so your project begins from working software, not a blank page.
          </p>
        </SectionHeading>

        <Reveal delay={80}>
          <div className="mt-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter solutions by industry">
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={filter === c}
                  onClick={() => setFilter(c)}
                  className={`cut-sm relative shrink-0 overflow-hidden whitespace-nowrap border px-4 py-2 font-display text-sm font-medium uppercase tracking-wide transition-colors duration-300 ${
                    filter === c ? "border-signal text-on-signal" : "border-line text-muted2 hover:border-signal/60 hover:text-ink"
                  }`}
                >
                  <span
                    className={`absolute inset-0 origin-left bg-signal transition-transform duration-300 ease-out ${filter === c ? "scale-x-100" : "scale-x-0"}`}
                    aria-hidden="true"
                  />
                  <span className="relative">{c}</span>
                </button>
              ))}
            </div>
            <span className="flex items-center gap-2 font-code text-xs uppercase tracking-wider text-muted2">
              <span className="led" />
              {String(list.length).padStart(2, "0")} {list.length === 1 ? "blueprint" : "blueprints"} loaded
            </span>
          </div>
        </Reveal>

        {/* Keyed by filter so the cards replay their entrance when the filter changes */}
        <div key={filter} className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 110} variant="scale" className="h-full">
              <SolutionCard solution={s} code={`SOL-${String(s.id).padStart(2, "0")}`} onOpen={openSolution} />
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
          <div className="on-dark bevel cut photo-cast relative mt-24 overflow-hidden border border-line bg-paper-3 p-8 text-ink sm:p-12 lg:py-16">
            <img src="/images/cta-backdrop.webp" alt="" loading="lazy" width={1920} height={1080} className="photo absolute inset-0 h-full w-full object-cover" />
            {/* shade the text side so the copy reads over the photo */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/80 to-paper/40 lg:bg-gradient-to-r lg:from-paper lg:via-paper/85 lg:to-paper/20" />
            <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-40" />
            <div className="hazard pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-60" />
            <div className="relative z-[2] flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="font-code text-xs uppercase tracking-[0.22em] text-beam">Not on the list? · Every engagement starts with discovery</p>
                <h3 className="extrude-sm mt-4 max-w-2xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
                  Have a machine that needs better software?
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => startEnquiry()}
                  className="press btn-signal cut-sm group inline-flex items-center gap-2 bg-signal px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-on-signal hover:bg-signal-hi"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => scrollToId("process")}
                  className="press key-dark group inline-flex items-center gap-2 border border-line bg-paper/60 px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide hover:border-signal hover:text-beam"
                >
                  How we work
                  <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
