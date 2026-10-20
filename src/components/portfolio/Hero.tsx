import { useEffect, useRef } from "react";
import { ArrowDownRight, Download } from "lucide-react";
import { experience, profile, scrollToId, skillGroups } from "@/data/portfolio";
import { prefersReducedMotion, useMagnetic } from "@/hooks/use-motion";
import ScrambleText from "./ScrambleText";
import VelocityTicker from "./VelocityTicker";

const current = experience.find((j) => j.end === "Present");

const specs = [
  { k: "Role", v: profile.title },
  ...(current ? [{ k: "Now", v: `${current.company} · ${current.location.split(", ").pop()}` }] : []),
  { k: "Focus", v: "Education platforms, full-stack delivery" },
  { k: "Core stack", v: "Angular · React · Next.js · TypeScript" },
  { k: "Data", v: "PostgreSQL · MongoDB · Supabase" },
  { k: "Experience", v: `${profile.yearsExperience} years · 2017 – present` },
];

/** Splits a word into letters that rise one after another. */
function Letters({ text, delay, className = "" }: { text: string; delay: number; className?: string }) {
  return (
    <span className={`mask-line ${className}`}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden="true" className="ch" style={{ animationDelay: `${delay + i * 0.045}s`, ["--i" as string]: i }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero({ onResume }: { onResume: () => void }) {
  const ticker = skillGroups.flatMap((g) => g.items);
  const section = useRef<HTMLElement>(null);
  const coords = useRef<HTMLSpanElement>(null);
  const primary = useMagnetic<HTMLButtonElement>(0.25);
  const secondary = useMagnetic<HTMLButtonElement>(0.25);
  const [firstName, ...rest] = profile.name.split(" ");

  // Mouse + scroll parallax via CSS variables (--mx, --my in -1..1, --scroll in px)
  useEffect(() => {
    const el = section.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const my = ((e.clientY - r.top) / r.height) * 2 - 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", mx.toFixed(3));
        el.style.setProperty("--my", my.toFixed(3));
        if (coords.current) {
          const x = String(Math.round(e.clientX - r.left)).padStart(4, "0");
          const y = String(Math.round(e.clientY - r.top)).padStart(4, "0");
          coords.current.textContent = `X ${x} · Y ${y}`;
        }
      });
    };
    const onScroll = () => {
      if (window.scrollY < el.offsetHeight) el.style.setProperty("--scroll", `${window.scrollY}px`);
    };
    el.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={section} className="hero relative overflow-hidden">
      <div className="bp-grid pointer-events-none absolute inset-0" />

      {/* angular accent plane */}
      <div
        className="parallax pointer-events-none absolute -right-24 top-0 hidden h-[78%] w-[34%] lg:block"
        style={{ ["--depth" as string]: -18, ["--scroll-rate" as string]: 0.18 }}
      >
        <div className="plane-in h-full w-full bg-signal/90" style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%)" }} />
      </div>

      {/* blueprint decor */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="parallax absolute right-[38%] top-[14%]" style={{ ["--depth" as string]: 26 }}>
          <div className="spin-slow relative h-24 w-24 border border-ink/25">
            <div className="absolute inset-3 border border-dashed border-ink/20" />
          </div>
        </div>
        <div className="parallax absolute left-[46%] top-[58%]" style={{ ["--depth" as string]: -32 }}>
          <span className="crosshair" />
        </div>
        <div className="parallax absolute right-[8%] bottom-[22%]" style={{ ["--depth" as string]: 40 }}>
          <span className="crosshair" />
          <span className="ml-3 font-code text-[10px] uppercase tracking-[0.2em] text-muted2">REF · 07</span>
        </div>
        <div className="parallax absolute left-[62%] top-[6%]" style={{ ["--depth" as string]: 14 }}>
          <span className="float-y block">
            <span className="block h-2.5 w-2.5 rotate-45 bg-ink" />
          </span>
        </div>
      </div>

      <div className="relative px-5 pb-16 pt-14 sm:px-10 lg:px-14 lg:pb-20 lg:pt-24">
        <p className="fade-up flex items-center font-code text-xs uppercase tracking-[0.25em] text-muted2" style={{ animationDelay: ".1s" }}>
          <span className="draw-x mr-3 inline-block h-px w-10 bg-ink" style={{ animationDelay: ".1s" }} />
          <ScrambleText text={`Portfolio · ${new Date().getFullYear()}`} delay={150} duration={700} />
          <span ref={coords} className="ml-auto hidden font-code text-[11px] tracking-[0.2em] text-muted2/80 lg:inline" aria-hidden="true">
            X 0000 · Y 0000
          </span>
        </p>

        <h1 className="mt-8 font-display font-bold uppercase leading-[0.88] tracking-tight text-[clamp(3.4rem,10.5vw,9rem)]">
          <Letters text={firstName} delay={0.15} />
          <Letters text={rest.join(" ")} delay={0.35} className="text-outline wave-fill" />
        </h1>

        <div className="draw-x mt-8 h-1.5 w-40 bg-signal sm:w-56" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="fade-up font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl" style={{ animationDelay: ".55s" }}>
              <ScrambleText text={profile.title} delay={600} duration={1000} replayOnHover />
            </p>
            <p className="fade-up mt-5 max-w-xl text-lg leading-relaxed text-muted2" style={{ animationDelay: ".7s" }}>
              {profile.tagline}
            </p>

            <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".85s" }}>
              <button
                ref={primary}
                onClick={() => scrollToId("work")}
                className="magnetic cut-sm group inline-flex items-center gap-2 bg-ink px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal hover:text-ink"
              >
                View my work
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>
              <button
                ref={secondary}
                onClick={onResume}
                className="magnetic group inline-flex items-center gap-2 border border-ink px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide hover:bg-ink hover:text-paper"
              >
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" /> Download résumé
              </button>
            </div>
          </div>

          {/* Spec sheet */}
          <div className="fade-up cut-tr relative overflow-hidden border border-ink bg-paper/90 backdrop-blur" style={{ animationDelay: "1s" }}>
            <span className="scan-line pointer-events-none absolute inset-x-0 top-0 h-16" aria-hidden="true" />
            <div className="flex items-center justify-between border-b border-ink bg-ink px-5 py-2.5 font-code text-[11px] uppercase tracking-[0.2em] text-paper">
              <span>Spec sheet</span>
              <span className="flex items-center gap-2 text-signal">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-signal" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                </span>
                Available
              </span>
            </div>
            <dl>
              {specs.map((s, i) => (
                <div
                  key={s.k}
                  className="spec-row grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line px-5 py-3.5 last:border-b-0 sm:grid-cols-[8rem_1fr]"
                  style={{ animationDelay: `${1.15 + i * 0.08}s` }}
                >
                  <dt className="font-code text-[11px] uppercase tracking-wider text-muted2">{s.k}</dt>
                  <dd className="text-sm font-medium">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <VelocityTicker items={ticker} />
    </section>
  );
}
