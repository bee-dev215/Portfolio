import { focusAreas, profile, stats } from "@/data/portfolio";
import CountUp from "./CountUp";
import Reveal, { SectionHeading } from "./Reveal";

export default function About() {
  return (
    <section id="about" className="px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          index="01"
          label="About"
          title={
            <>
              Engineering that feels <span className="glow-text text-signal">effortless</span> to use.
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <Reveal delay={80} variant="left">
            <div className="space-y-6 border-l-2 border-signal/60 pl-6 text-lg leading-relaxed text-muted2">
              {profile.bio.map((p, i) => (
                <p key={i} className={i === 0 ? "text-xl text-ink" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160} variant="right">
            <div className="hud border border-line bg-paper-2/70">
              <div className="flex items-center justify-between border-b border-line px-5 py-2.5 font-code text-[11px] uppercase tracking-[0.2em] text-muted2">
                <span>Off the clock</span>
                <span className="flex items-center gap-2 text-signal">
                  <span className="led" /> Sub-routines
                </span>
              </div>
              <ul>
                {profile.interests.map((it, i) => (
                  <li key={it} className="group relative flex items-center justify-between overflow-hidden border-b border-line px-5 py-4 last:border-b-0">
                    <span className="absolute inset-0 origin-left scale-x-0 bg-signal transition-transform duration-500 ease-out group-hover:scale-x-100" aria-hidden="true" />
                    <span className="relative font-display text-lg font-medium uppercase tracking-wide transition-all duration-300 group-hover:translate-x-2 group-hover:text-paper">{it}</span>
                    <span className="relative font-code text-xs text-muted2 transition-colors group-hover:text-paper">0{i + 1}</span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-line px-5 py-4 text-sm text-muted2">Focus, patience and quick problem-solving — on the table and in the editor.</p>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} variant="clip" className="border-b border-r border-line">
              <div className="group relative h-full p-6 transition-colors duration-300 hover:bg-paper-2 sm:p-8">
                <span className="absolute right-4 top-4 font-code text-[10px] uppercase tracking-[0.2em] text-muted2/70">M-{String(i + 1).padStart(2, "0")}</span>
                <div className="font-display text-5xl font-bold tracking-tight transition-colors duration-300 group-hover:text-signal sm:text-6xl">
                  <CountUp value={s.value} />
                </div>
                <div className="mt-3 text-sm text-muted2">{s.label}</div>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-signal transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Focus areas */}
        <div className="mt-20 grid gap-px border border-line bg-line sm:grid-cols-2">
          {focusAreas.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} className="bg-paper">
              <div className="spotlight group relative h-full p-7 transition-colors duration-300 hover:bg-paper-2 sm:p-9">
                <span className="font-code text-xs text-signal">0{i + 1} /</span>
                <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-wide transition-transform duration-300 group-hover:translate-x-1">{f.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-muted2">{f.desc}</p>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-signal shadow-[0_0_10px_rgba(255,107,26,.7)] transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
