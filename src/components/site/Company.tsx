import { Compass, EyeOff, GitBranch, KeyRound, LockKeyhole, LucideIcon, Presentation, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { company, principles } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";

// Same order as `principles`
const principleIcons: LucideIcon[] = [Compass, Users, Presentation, KeyRound];

// The security commitments behind every build (the full list is on /responsible-ai)
const commitments = [
  { icon: LockKeyhole, title: "Encrypted and access-controlled", desc: "Encrypted in transit and at rest; people see only what their role needs." },
  { icon: GitBranch, title: "Your code, your cloud", desc: "Source code, cloud accounts and documentation in your name from day one." },
  { icon: EyeOff, title: "Never used to train AI", desc: "AI providers are used under terms that keep your data out of training." },
  { icon: UserCheck, title: "A person approves what matters", desc: "Answers cite their sources; consequential actions wait for approval." },
];

/** Home-page "Why Jovano": how we work, then the security commitments behind every build. */
export default function Company() {
  return (
    <section id="company" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              label={`Why ${company.shortName}`}
              title={
                <>
                  A small senior team, <span className="gradient-text">first call to production.</span>
                </>
              }
            />
            <Reveal delay={80}>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-2">
                <p className="text-ink">{company.about[0]}</p>
                <p>{company.about[2]}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/about" className="btn btn-secondary px-6 py-3 text-sm">
                  About {company.shortName}
                </Link>
                <Link to="/team" className="btn px-4 py-3 text-sm text-brand-text hover:bg-brand-soft">
                  Meet the team
                </Link>
              </div>
            </Reveal>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {principles.map((f, i) => {
              const Icon = principleIcons[i % principleIcons.length];
              return (
                <li key={f.title}>
                  <Reveal delay={i * 70} className="h-full">
                    <div className="card card-hover h-full p-6 sm:p-7">
                      <span className="icon-tile h-11 w-11">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
                      <p className="mt-2 leading-relaxed text-ink-2">{f.desc}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Security */}
        <Reveal variant="scale" className="mt-16 lg:mt-20">
          <div className="on-dark relative overflow-hidden rounded-[2rem] bg-canvas p-7 text-ink sm:p-10 lg:p-12">
            <div className="mesh pointer-events-none absolute inset-0 opacity-90" aria-hidden="true" />
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="relative grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-14">
              <div>
                <span className="eyebrow">
                  <ShieldCheck className="h-3.5 w-3.5" /> Security & AI
                </span>
                <h2 className="mt-5 text-balance font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
                  Built to be trusted <span className="gradient-text">with your data.</span>
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-ink-2">
                  Customer records, contracts, invoices. These commitments are part of every project — planned with your IT team, not added at the end.
                </p>
                <Link to="/responsible-ai" className="btn btn-primary mt-7 px-6 py-3 text-sm">
                  How we protect your data
                </Link>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {commitments.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="rounded-2xl border border-line bg-surface/60 p-5 backdrop-blur">
                    <Icon className="h-5 w-5 text-sky2" />
                    <h3 className="mt-3 font-display font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
