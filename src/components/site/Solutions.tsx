import { useState } from "react";
import { Link } from "react-router-dom";
import { solutions } from "@/data/company";
import SolutionPanel from "./SolutionPanel";
import SolutionViewer, { PHOTO_VT, panelPhoto } from "./SolutionViewer";
import { viewTransition } from "@/hooks/use-motion";
import Reveal, { SectionHeading } from "./Reveal";

export default function Solutions() {
  const [active, setActive] = useState(0); // the expanded panel, and the one the viewer shows
  const [open, setOpen] = useState(false);

  const list = solutions;

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
              Start from AI <span className="gradient-text">that already runs.</span>
            </>
          }
        >
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            Each solution is a working starting point for a common kind of busywork. We adapt it to your systems, your data and your rules, so your project begins from running software, not a blank page.
          </p>
        </SectionHeading>

        <Reveal variant="clip" className="mt-12">
          <div className="flex flex-col gap-3 lg:h-[580px] lg:flex-row">
            {list.map((s, i) => (
              <SolutionPanel key={s.id} solution={s} index={i} active={i === active} onActivate={() => setActive(i)} onOpen={openViewer} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-6 flex justify-center">
            <Link to="/solutions" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
              Compare all {solutions.length} solutions
            </Link>
          </div>
        </Reveal>

        {open && list[active] && <SolutionViewer list={list} index={active} onClose={closeViewer} onGo={goTo} />}
      </div>
    </section>
  );
}
