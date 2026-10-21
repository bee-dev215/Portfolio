import { useEffect, useRef } from "react";
import { ArrowDownRight, Download } from "lucide-react";
import { experience, profile, scrollToId, skillGroups } from "@/data/portfolio";
import { prefersReducedMotion } from "@/hooks/use-motion";
import RobotArm from "./RobotArm";
import ScrambleText from "./ScrambleText";
import VelocityTicker from "./VelocityTicker";

const GRID = 56; // matches .bp-grid's cell size
const pad4 = (n: number) => String(Math.round(n)).padStart(4, "0");

const current = experience.find((j) => j.end === "Present");

const specs = [
  { k: "Role", v: profile.title },
  ...(current ? [{ k: "Now", v: `${current.company} · ${current.location.split(", ").pop()}` }] : []),
  { k: "Focus", v: "Education platforms, full-stack delivery" },
  { k: "Core stack", v: "Angular · React · Next.js · TypeScript" },
  { k: "Data", v: "PostgreSQL · MongoDB · Supabase" },
  { k: "Uptime", v: `${profile.yearsExperience} years · 2017 – present` },
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
  const snap = useRef<HTMLSpanElement>(null);
  const [firstName, ...rest] = profile.name.split(" ");

  // Pointer coordinate readout, plus a crosshair that snaps to the nearest node of the machine grid
  useEffect(() => {
    const el = section.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (coords.current) coords.current.textContent = `X ${pad4(x)} · Y ${pad4(y)}`;
        if (snap.current) {
          snap.current.style.transform = `translate3d(${Math.round(x / GRID) * GRID}px, ${Math.round(y / GRID) * GRID}px, 0)`;
          snap.current.style.opacity = "1";
        }
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      if (snap.current) snap.current.style.opacity = "0";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={section} className="hero relative overflow-hidden">
      <div className="bp-grid pointer-events-none absolute inset-0" />

      {/* machine-shop decor */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="spin-step absolute left-[44%] top-[10%] h-20 w-20 rounded-full border border-dashed border-signal/30">
          <div className="absolute inset-3 rounded-full border border-ink/15" />
          <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-signal" />
        </div>
        <span ref={snap} className="crosshair hero-snap" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-5 pb-14 pt-10 sm:px-10 lg:px-14 lg:pb-16 lg:pt-14">
        <p className="fade-up flex items-center font-code text-xs uppercase tracking-[0.25em] text-muted2" style={{ animationDelay: ".1s" }}>
          <span className="draw-x mr-3 inline-block h-px w-10 bg-signal" style={{ animationDelay: ".1s" }} />
          <ScrambleText text={`Portfolio · ${new Date().getFullYear()} · Sys online`} delay={150} duration={800} />
          <span ref={coords} className="ml-auto hidden font-code text-[11px] tracking-[0.2em] text-muted2/80 lg:inline" aria-hidden="true">
            X 0000 · Y 0000
          </span>
        </p>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div>
            <p className="fade-up font-code text-sm text-copper" style={{ animationDelay: ".15s" }}>
              &gt; hello_world --operator<span className="blink">_</span>
            </p>
            <h1 className="mt-5 font-display font-bold uppercase leading-[0.88] tracking-tight text-[clamp(3.2rem,9vw,8rem)]">
              <Letters text={firstName} delay={0.15} className="extrude" />
              <Letters text={rest.join(" ")} delay={0.35} className="text-outline wave-fill extrude" />
            </h1>

            <div className="mt-8 flex items-center gap-3">
              <div className="draw-x h-1.5 w-32 bg-signal shadow-[0_0_14px_rgba(168,68,15,.7)] sm:w-44" />
              <div className="draw-x hazard h-1.5 w-20 opacity-60" style={{ animationDelay: ".7s" }} />
            </div>

            <p className="fade-up mt-8 font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl" style={{ animationDelay: ".55s" }}>
              <ScrambleText text={profile.title} delay={600} duration={1000} replayOnHover />
            </p>
            <p className="fade-up mt-5 max-w-xl text-lg leading-relaxed text-muted2" style={{ animationDelay: ".7s" }}>
              {profile.tagline}
            </p>

            <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".85s" }}>
              <button
                onClick={() => scrollToId("work")}
                className="press btn-signal cut-sm group inline-flex items-center gap-2 bg-signal px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-ink hover:bg-signal-hi"
              >
                View my work
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>
              <button
                onClick={onResume}
                className="press key-dark group inline-flex items-center gap-2 border border-line bg-paper/40 px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide hover:border-signal hover:text-copper"
              >
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" /> Download résumé
              </button>
            </div>
          </div>

          <div className="fade-up" style={{ animationDelay: ".9s" }}>
            <RobotArm />
            <p className="mt-3 hidden font-code text-[10px] uppercase tracking-[0.2em] text-muted2 lg:block">
              Move the cursor to steer · hold click to grab the crate, release to throw
            </p>
          </div>
        </div>

        {/* Telemetry strip, standing on the factory floor */}
        <div className="relative mt-14">
          <div className="floor3d" aria-hidden="true">
            <div />
          </div>
          <dl className="fade-up plate relative grid grid-cols-1 border-l border-t border-line bg-paper-2/80 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" style={{ animationDelay: "1.05s" }}>
            {specs.map((s, i) => (
              <div key={s.k} className="spec-row group border-b border-r border-line px-5 py-4 transition-colors hover:bg-paper-3" style={{ animationDelay: `${1.15 + i * 0.08}s` }}>
                <dt className="flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted2">
                  <span className="text-copper">{String(i + 1).padStart(2, "0")}</span>
                  {s.k}
                </dt>
                <dd className="mt-1.5 text-sm font-medium transition-colors group-hover:text-copper-hi">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <VelocityTicker items={ticker} />
    </section>
  );
}
