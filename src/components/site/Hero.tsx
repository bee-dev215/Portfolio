import { ArrowRight, CalendarDays, CheckCircle2, Gift, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { company, offer, ticker } from "@/data/company";
import { usePhotos } from "@/hooks/use-photos";
import AutomationDemo from "./AutomationDemo";

const promises = ["Senior engineers only", "You own the code", "Working software in two weeks"];

// Small photos between the capabilities in the marquee (thumbnails in public/images/thumbs/, 160×100)
const tickerPhotos = [
  "proj-site-report-app",
  "tech-ai-abstract",
  "proj-clinic-call-assistant",
  "svc-build",
  "proj-invoice-intake-automation",
  "svc-mobile",
  "proj-order-operations-hub",
  "tech-code",
  "proj-contract-review-assistant",
  "svc-analytics",
  "proj-saas-platform-rescue",
  "hero-ai",
];

export default function Hero() {
  const photos = usePhotos();

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
            Give your team <span className="gradient-text">its week back.</span>
          </h1>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-ink-2" style={{ animationDelay: ".2s" }}>
            {company.tagline}
          </p>

          <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".28s" }}>
            <Link to="/book" className="btn btn-primary px-7 py-3.5">
              Book a free call <CalendarDays className="h-4 w-4" />
            </Link>
            <Link to="/projects" className="btn btn-secondary px-7 py-3.5">
              See our work <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Link
            to="/book"
            className="fade-up group mt-6 flex max-w-xl items-start gap-3 rounded-2xl border border-sun/30 bg-sun/10 p-4 transition-colors hover:border-sun/60"
            style={{ animationDelay: ".34s" }}
          >
            <Gift className="mt-0.5 h-5 w-5 shrink-0 text-sun" />
            <span className="text-sm leading-relaxed text-ink-2">
              <span className="font-semibold text-ink">{offer.badge}:</span> tell us the task that eats your week, and we'll build a working prototype on your own data — free.
            </span>
          </Link>

          <ul className="fade-up mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-2" style={{ animationDelay: ".4s" }}>
            {promises.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-text" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="fade-up relative" style={{ animationDelay: ".3s" }}>
          {/* Photo tiles tucked behind the demo window */}
          <div className="hero-tile shadow-soft pointer-events-none absolute -left-6 -top-14 hidden w-32 -rotate-6 overflow-hidden rounded-2xl border-4 border-surface lg:block xl:-left-12 xl:w-36" aria-hidden="true">
            <img src={photos.src("/images/hero-work.webp")} alt="" width={600} height={750} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div
            className="hero-tile shadow-soft pointer-events-none absolute -bottom-14 -right-4 hidden w-28 rotate-6 overflow-hidden rounded-2xl border-4 border-surface lg:block xl:-right-10 xl:w-32"
            style={{ animationDelay: ".9s, 1.8s" }}
            aria-hidden="true"
          >
            <img src={photos.src("/images/hero-ai.webp")} alt="" width={800} height={800} className="aspect-square w-full object-cover" />
          </div>
          <AutomationDemo />
        </div>
      </div>

      {/* capabilities marquee */}
      <div className="marquee-host relative mt-20 overflow-hidden border-y border-line bg-surface/50 py-4 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]" aria-hidden="true">
        <div className="marquee flex w-max">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center gap-10 pr-10">
              {ticker.map((t, i) => (
                <span key={t} className="flex items-center gap-10 whitespace-nowrap font-display text-base font-semibold text-ink-2">
                  {t}
                  <img src={`/images/thumbs/${tickerPhotos[i % tickerPhotos.length]}.webp`} alt="" loading="lazy" width={160} height={100} className="h-9 w-14 rounded-full object-cover ring-1 ring-line" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
