import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import SolutionCard from "@/components/solutions/SolutionCard";
import { bookCall, servicePath, services, solutionPath, solutions } from "@/data/company";

const serviceOf = (key: string) => services.find((s) => s.key === key)!;

// The rows of the comparison, read straight from each solution's data
const rows = [
  { label: "Works on", cell: (s: (typeof solutions)[number]) => s.domain },
  { label: "Where it works", cell: (s: (typeof solutions)[number]) => s.category },
  {
    label: "Delivered as",
    cell: (s: (typeof solutions)[number]) => (
      <Link to={servicePath(serviceOf(s.service))} className="u-link font-semibold text-brand-text">
        {serviceOf(s.service).title}
      </Link>
    ),
  },
  {
    label: "You get",
    cell: (s: (typeof solutions)[number]) => (
      <ul className="space-y-1.5">
        {s.deliverables.map((d) => (
          <li key={d} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" /> {d}
          </li>
        ))}
      </ul>
    ),
  },
];

export default function SolutionsIndex() {

  return (
    <PageShell
      title="Solutions"
      description={`Three AI starting points we adapt to your systems and data — ${solutions.map((s) => s.title).join(", ")}.`}
    >
      <PageHero
        crumbs={[{ label: "Solutions" }]}
        eyebrow={`${solutions.length} AI solutions`}
        title={
          <>
            Start from AI <span className="gradient-text">that already runs.</span>
          </>
        }
        lead="Each solution is a working starting point for a common kind of busywork. We adapt it to your systems, your data and your rules, so your two-week prototype begins from running software, not a blank page."
        actions={
          <>
            <button onClick={() => bookCall()} className="btn btn-primary px-7 py-3.5">
              Book a call
            </button>
            <a href="#compare" className="btn btn-secondary px-7 py-3.5">
              Compare them
            </a>
          </>
        }
      />

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <ul className="mx-auto grid max-w-[1240px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <li key={s.slug}>
              <Reveal delay={i * 80} className="h-full">
                <SolutionCard solution={s} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Side by side */}
      <section id="compare" className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Side by side"
            title={
              <>
                Three solutions, <span className="gradient-text">one way of working.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              Every one reads from your own data, hands anything unusual to a person and runs in your own cloud account. What differs is the busywork it takes on.
            </p>
          </SectionHeading>

          <Reveal delay={100}>
            <div className="card relative mt-12 overflow-x-auto rounded-3xl">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <caption className="sr-only">The three solutions compared</caption>
                <thead>
                  <tr className="border-b border-line">
                    <td className="w-40 px-5 py-5 sm:px-6" />
                    {solutions.map((s) => (
                      <th key={s.slug} scope="col" className="px-5 py-5">
                        <Link to={solutionPath(s)} className="group flex items-center gap-3">
                          <img src={s.image} alt="" loading="lazy" width={56} height={40} className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                          <span className="font-display text-base font-bold transition-colors group-hover:text-brand-text">{s.title}</span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="border-b border-line align-top last:border-0">
                      <th scope="row" className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-subtle sm:px-6">
                        {r.label}
                      </th>
                      {solutions.map((s) => (
                        <td key={s.slug} className="px-5 py-4 leading-relaxed text-ink-2">
                          {r.cell(s)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        kicker="Not on the list? Every project starts with a call."
        title="Tell us the task. We'll tell you if AI can take it."
        primaryLabel="Book a call"
        secondary={{ label: "How we work", to: "/approach" }}
      />
    </PageShell>
  );
}
