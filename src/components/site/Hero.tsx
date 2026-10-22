import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
import { company, scrollToId, startEnquiry, ticker } from "@/data/company";
import TutorDemo from "./TutorDemo";

const promises = ["Model-agnostic", "Privacy-first", "LMS-ready"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-28 sm:pt-32 lg:pt-40">
      <div className="mesh pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
        <div>
          <p className="fade-up eyebrow" style={{ animationDelay: ".05s" }}>
            <Sparkles className="h-3.5 w-3.5" /> {company.discipline}
          </p>
          <h1 className="fade-up mt-6 font-display text-[clamp(2.75rem,7vw,4.75rem)] font-extrabold leading-[1.02] tracking-tight" style={{ animationDelay: ".12s" }}>
            AI that helps people <span className="gradient-text">learn better.</span>
          </h1>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-ink-2" style={{ animationDelay: ".2s" }}>
            {company.tagline}
          </p>

          <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".28s" }}>
            <button onClick={() => startEnquiry()} className="btn btn-primary px-7 py-3.5">
              Start a project <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => scrollToId("solutions")} className="btn btn-secondary px-7 py-3.5">
              <PlayCircle className="h-4 w-4" /> Explore solutions
            </button>
          </div>

          <ul className="fade-up mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-2" style={{ animationDelay: ".36s" }}>
            {promises.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-text" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="fade-up" style={{ animationDelay: ".3s" }}>
          <TutorDemo />
        </div>
      </div>

      {/* capabilities marquee */}
      <div className="marquee-host relative mt-20 overflow-hidden border-y border-line bg-surface/50 py-4 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]" aria-hidden="true">
        <div className="marquee flex w-max">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center gap-10 pr-10">
              {ticker.map((t) => (
                <span key={t} className="flex items-center gap-10 whitespace-nowrap font-display text-base font-semibold text-ink-2">
                  {t}
                  <Sparkles className="h-4 w-4 text-brand-text/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
