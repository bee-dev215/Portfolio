import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { OPEN_SOLUTION_EVENT, scrollToId, solutions, startEnquiry } from "@/data/company";
import SolutionPanel from "./SolutionPanel";
import SolutionViewer, { PHOTO_VT, panelPhoto } from "./SolutionViewer";
import { useScrollProgress, viewTransition } from "@/hooks/use-motion";
import Reveal, { SectionHeading } from "./Reveal";

// "All" is the "no filter" value
const categories = ["All", ...Array.from(new Set(solutions.map((s) => s.category).filter(Boolean)))];

export default function Solutions() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(0); // the expanded panel, and the one the viewer shows
  const [open, setOpen] = useState(false);
  const ctaRef = useScrollProgress<HTMLDivElement>();

  const list = useMemo(() => (filter === "All" ? solutions : solutions.filter((s) => s.category === filter)), [filter]);

  // Audience cards and the footer open a solution by title: clear the filter so it is in the list, then open it
  useEffect(() => {
    const onOpen = (e: Event) => {
      const i = solutions.findIndex((s) => s.title === (e as CustomEvent<string>).detail);
      if (i === -1) return;
      viewTransition(() => {
        setFilter("All");
        setActive(i);
        setOpen(true);
      }, "open");
    };
    window.addEventListener(OPEN_SOLUTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SOLUTION_EVENT, onOpen);
  }, []);

  const pickFilter = (c: string) => {
    setFilter(c);
    setActive(0);
  };

  // The panel photo hands its view-transition-name to the viewer photo, so the browser morphs one into the other
  const openViewer = () => {
    const photo = panelPhoto(list[active].id);
    if (photo) photo.style.viewTransitionName = PHOTO_VT;
    viewTransition(() => {
      if (photo) photo.style.viewTransitionName = "";
      setOpen(true);
    }, "open");
  };

  // ...and takes it back on the way out. The panel is already expanded (the viewer keeps `active` in step)
  const closeViewer = (morph = true) => {
    const { id } = list[active];
    if (!morph) return setOpen(false);
    const shared: { photo: HTMLElement | null } = { photo: null };
    viewTransition(() => {
      setOpen(false);
      shared.photo = panelPhoto(id);
      if (shared.photo) shared.photo.style.viewTransitionName = PHOTO_VT;
    }, "close").then(() => {
      if (shared.photo) shared.photo.style.viewTransitionName = "";
      document.querySelector<HTMLElement>(`[data-solution-trigger="${id}"]`)?.focus({ preventScroll: true });
    });
  };

  const goTo = (i: number, dir: "next" | "prev") => viewTransition(() => setActive(i), dir);

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
                  onClick={() => pickFilter(c)}
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

        {/* Keyed by filter so the panels replay their entrance when the filter changes */}
        <Reveal key={filter} variant="clip" className="mt-10">
          <div className="flex flex-col gap-3 lg:h-[580px] lg:flex-row">
            {list.map((s, i) => (
              <SolutionPanel key={s.id} solution={s} index={i} active={i === active} onActivate={() => setActive(i)} onOpen={openViewer} />
            ))}
          </div>
        </Reveal>

        {open && list[active] && <SolutionViewer list={list} index={active} onClose={closeViewer} onGo={goTo} />}

        {/* Call-to-action band */}
        <Reveal delay={100} variant="scale">
          <div ref={ctaRef} className="relative mt-20 overflow-hidden rounded-[2rem] bg-grad p-8 text-white sm:p-12 lg:p-14">
            <img src="/images/cta-backdrop.webp" alt="" loading="lazy" width={740} height={416} className="drift absolute inset-0 h-full w-full scale-[1.2] object-cover opacity-25 mix-blend-luminosity" />
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
