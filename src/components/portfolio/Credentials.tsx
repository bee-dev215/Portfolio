import { ArrowUpRight, Download, Eye, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { certificates, education, profile } from "@/data/portfolio";
import Reveal, { SectionHeading } from "./Reveal";

export function downloadResume() {
  if (!profile.resumeUrl) {
    toast("Résumé coming soon", { description: "Add your résumé link to profile.resumeUrl in src/data/portfolio.ts" });
    return;
  }
  const a = document.createElement("a");
  a.href = profile.resumeUrl;
  a.download = `${profile.name.replace(/\s+/g, "_")}_Resume.pdf`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function viewResume() {
  if (!profile.resumeUrl) return downloadResume();
  window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
}

export default function Credentials() {
  return (
    <section id="credentials" className="px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          index="05"
          label="Credentials"
          title={
            <>
              Education & <span className="glow-text text-copper">certificates.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Education */}
          <div>
            <Reveal>
              <h3 className="font-code text-xs uppercase tracking-[0.2em] text-muted2">Education</h3>
            </Reveal>
            {education.map((e) => (
              <Reveal key={e.id} delay={80} variant="left">
                <div className="spotlight plate hud group mt-4 border border-line bg-paper-2/70 p-7">
                  <GraduationCap className="h-7 w-7 text-copper transition-colors group-hover:text-copper-hi" />
                  <p className="mt-6 font-code text-sm text-muted2">
                    {e.start} — {e.end}
                  </p>
                  <h4 className="mt-2 font-display text-2xl font-semibold uppercase leading-tight tracking-wide">{e.degree}</h4>
                  <p className="mt-2 text-muted2">{e.school}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Certificates */}
          <div>
            <Reveal>
              <h3 className="font-code text-xs uppercase tracking-[0.2em] text-muted2">Certificates</h3>
            </Reveal>
            <ul className="mt-4 border-t border-line">
              {certificates.map((c, i) => (
                <li key={c.href} className="border-b border-line">
                  <Reveal delay={i * 70}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-5 py-5 transition-colors hover:bg-paper-2/80 sm:px-3"
                    >
                      <span className="font-code text-xs text-muted2 transition-colors group-hover:text-copper">0{i + 1}</span>
                      <span className="flex-1">
                        <span className="block font-display text-lg font-semibold uppercase leading-snug tracking-wide sm:text-xl">{c.title}</span>
                        <span className="mt-0.5 block font-code text-xs text-muted2">{c.issuer}</span>
                      </span>
                      <span className="grid h-10 w-10 shrink-0 place-items-center border border-line transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-ink">
                        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Résumé band */}
        <Reveal delay={100} variant="scale">
          <div className="bevel cut relative mt-24 overflow-hidden bg-signal-deep p-8 text-ink sm:p-12">
            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#0d0805_1px,transparent_1px),linear-gradient(to_bottom,#0d0805_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="hazard-dark pointer-events-none absolute inset-x-0 top-0 h-2 opacity-60" />
            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="font-code text-xs uppercase tracking-[0.22em]">Résumé · PDF · {profile.resumeUpdated}</p>
                <h3 className="extrude-sm mt-4 max-w-xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
                  Want the full story? Grab the résumé.
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadResume}
                  className="press key-dark cut-sm group inline-flex items-center gap-2 bg-paper px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-copper hover:bg-paper-3 hover:text-copper-hi"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" /> Download PDF
                </button>
                <button
                  onClick={viewResume}
                  className="press inline-flex items-center gap-2 border border-ink/40 px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide hover:bg-paper hover:text-ink"
                >
                  <Eye className="h-4 w-4" /> View online
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
