import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { forCompanies } from "@/data/company";
import Reveal from "./Reveal";

/** For companies that want a remote team: a statement block with a brand rule down its left edge. */
export default function ForCompanies() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-[1200px]">
        <div className="statement pl-7 sm:pl-10">
          <p className="eyebrow">For companies</p>
          <h2 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.1] tracking-[-0.02em] text-ink">
            {forCompanies.title} <span className="gradient-text">We'll build it with you.</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-2">{forCompanies.desc}</p>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {forCompanies.points.map((p) => (
                <li key={p} className="inline-flex items-center gap-2 font-medium text-ink">
                  <Check className="h-4 w-4 text-brand-text" /> {p}
                </li>
              ))}
            </ul>
            <Link to="/contact?topic=hire" className="btn btn-secondary shrink-0 px-6 py-3 text-sm sm:ml-auto">
              Talk to us about hiring <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
