import { company, companyFile, principles } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";
import Team from "./Team";

export default function Company() {
  return (
    <section id="company" className="px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          index="06"
          label="Company"
          title={
            <>
              One discipline: <span className="glow-text text-beam">robotics.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <Reveal delay={80} variant="left">
            <div className="space-y-6 border-l-2 border-signal/60 pl-6 text-lg leading-relaxed text-muted2">
              {company.about.map((p, i) => (
                <p key={i} className={i === 0 ? "text-xl text-ink" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160} variant="right">
            <div className="plate hud border border-line bg-paper-2/70">
              <div className="flex items-center justify-between border-b border-line px-5 py-2.5 font-code text-[11px] uppercase tracking-[0.2em] text-muted2">
                <span>Company file</span>
                <span className="flex items-center gap-2 text-beam">
                  <span className="led" /> Active
                </span>
              </div>
              <dl>
                {companyFile.map((row, i) => (
                  <div key={row.k} className="group relative overflow-hidden border-b border-line px-5 py-4 last:border-b-0">
                    <span className="absolute inset-0 origin-left scale-x-0 bg-signal transition-transform duration-500 ease-out group-hover:scale-x-100" aria-hidden="true" />
                    <dt className="relative flex items-center justify-between font-code text-[10px] uppercase tracking-[0.2em] text-muted2 transition-colors group-hover:text-on-signal">
                      {row.k}
                      <span>0{i + 1}</span>
                    </dt>
                    <dd className="relative mt-1 font-display text-lg font-medium uppercase tracking-wide transition duration-300 group-hover:translate-x-2 group-hover:text-on-signal">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-t border-line px-5 py-4 text-sm text-muted2">Hardware-agnostic · Simulation-first · Safety by design.</p>
            </div>
          </Reveal>
        </div>

        {/* Photo band */}
        <Reveal delay={80} variant="clip">
          <figure className="on-dark plate hud group relative mt-20 border border-line bg-paper-3">
            <div className="photo-cast relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:aspect-[21/9]">
              <img src="/images/company-lab.webp" alt="Engineers in safety glasses wiring a robot in a lab" loading="lazy" width={740} height={416} className="photo h-full w-full object-cover" />
              <span className="photo-fade absolute inset-0" aria-hidden="true" />
              <span className="scan-line pointer-events-none absolute inset-x-0 top-0 h-1/5" aria-hidden="true" />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 z-[2] flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-9">
              <p className="extrude-sm max-w-xl font-display text-2xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
                Software engineered <span className="text-beam">beside the hardware</span> it drives.
              </p>
              <span className="flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-ink/75">
                <span className="led" /> Hardware in the loop
              </span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Operating principles */}
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {principles.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} className="bg-paper">
              <div className="spotlight bevel-cell group relative h-full p-7 transition-colors duration-300 hover:bg-paper-2 sm:p-9">
                <span className="font-code text-xs text-beam">0{i + 1} /</span>
                <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-wide transition-transform duration-300 group-hover:translate-x-1">{f.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-muted2">{f.desc}</p>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-signal glow-line transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>

        <Team />
      </div>
    </section>
  );
}
