import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { bookCall, company, services, stats } from "@/data/company";
import ServiceCard from "@/components/services/ServiceCard";
import CountUp from "./CountUp";
import Reveal, { SectionHeading } from "./Reveal";

export default function Services() {
  return (
    <section id="services" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            label="Services"
            title={
              <>
                One senior team, <span className="gradient-text">from first call to production.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{company.intro}</p>
          </SectionHeading>
          <Reveal delay={100}>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link to="/services" className="btn btn-primary px-6 py-3 text-sm">
                All {services.length} services <ArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={() => bookCall()} className="btn btn-secondary px-6 py-3 text-sm">
                Book a call <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.key} delay={(i % 4) * 70} className="h-full">
              <ServiceCard service={s} compact />
            </Reveal>
          ))}
        </div>

        {/* Stats */}
        <Reveal delay={100}>
          <div className="grad-border mt-16 grid grid-cols-2 overflow-hidden rounded-3xl bg-surface lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`p-7 sm:p-9 ${i > 0 ? "border-line lg:border-l" : ""} ${i % 2 === 1 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}>
                <div className="gradient-text font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
                  <CountUp value={s.value} />
                </div>
                <div className="mt-2 text-sm font-medium text-ink-2">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
