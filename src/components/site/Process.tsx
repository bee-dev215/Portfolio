import { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { steps } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";

/**
 * The five steps from applying to the first payday, as numbered columns on a grey band. The last step is the payoff,
 * so it is set apart as a dark card. `more` adds links to /apply and /how-it-works (off on that page itself).
 */
export default function Process({ more = true }: { more?: boolean }) {
  return (
    <section id="process" className="band px-5 py-24 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          label="How it works"
          title={
            <>
              From application <span className="gradient-text">to your first payday.</span>
            </>
          }
        >
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            {steps.length} clear steps, all online. You always know where your application stands, and you hear back within five business days at every step.
          </p>
        </SectionHeading>

        <Reveal delay={100}>
          <ol className="stagger mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {steps.map((s, i) => {
              const last = i === steps.length - 1;
              return (
                <li
                  key={s.id}
                  style={{ "--i": i } as CSSProperties}
                  className={last ? "rounded-[1.5rem] bg-ink p-6 text-canvas lg:-mt-0" : "step-col pt-6"}
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full font-mono text-sm font-bold ${
                      last ? "bg-volt text-[#0b1020]" : "bg-surface text-brand-text"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={`mt-5 font-display text-[1.35rem] font-medium leading-tight ${last ? "text-canvas" : "text-ink"}`}>{s.name}</h3>
                  <p className={`mt-1 text-xs font-semibold uppercase tracking-wider ${last ? "text-canvas/60" : "text-brand-text"}`}>{s.time}</p>
                  <p className={`mt-3 text-[15px] leading-relaxed ${last ? "text-canvas/80" : "text-ink-2"}`}>{s.summary}</p>
                </li>
              );
            })}
          </ol>
        </Reveal>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink-2">
            Free at every step. No fees, no deposits, no starter kits — and a real person reads every application and every task.
          </p>
          {more && (
            <div className="flex flex-wrap gap-3">
              <Link to="/apply" className="btn btn-primary px-6 py-3 text-sm">
                Start your application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works" className="btn btn-secondary px-6 py-3 text-sm">
                See the full process
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
