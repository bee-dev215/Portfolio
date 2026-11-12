import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { solutionPath, solutions } from "@/data/company";
import SolutionPanel from "./SolutionPanel";
import Reveal, { SectionHeading } from "./Reveal";

export default function Solutions() {
  const [active, setActive] = useState(0); // the expanded panel
  const navigate = useNavigate();

  const list = solutions;

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
              <SolutionPanel key={s.id} solution={s} index={i} active={i === active} onActivate={() => setActive(i)} onOpen={() => navigate(solutionPath(s))} />
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
      </div>
    </section>
  );
}
