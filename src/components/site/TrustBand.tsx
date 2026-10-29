import { EyeOff, GitBranch, LockKeyhole, ShieldCheck, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { usePhotos } from "@/hooks/use-photos";

const commitments = [
  { icon: LockKeyhole, title: "Encrypted and access-controlled", desc: "Data is encrypted in transit and at rest, and people see only what their role needs." },
  { icon: GitBranch, title: "You own the code and the cloud", desc: "Source code, cloud accounts and documentation are in your name from day one." },
  { icon: EyeOff, title: "Never used to train AI", desc: "AI providers are used under terms that keep your data out of model training." },
  { icon: UserCheck, title: "A person approves what matters", desc: "AI answers cite their sources, and consequential actions wait for human approval." },
];

/** Home-page band: the four security commitments behind every build, linking to /responsible-ai (Security & AI). */
export default function TrustBand() {
  const photos = usePhotos();

  return (
    <section aria-labelledby="trust-title" className="px-5 pb-24 sm:px-8 lg:pb-32">
      <Reveal variant="scale" className="mx-auto max-w-[1240px]">
        <div className="grad-border relative overflow-hidden rounded-[2rem] bg-surface">
          <div className="mesh pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:p-14">
            <div className="flex flex-col">
              <span className="eyebrow self-start">
                <ShieldCheck className="h-3.5 w-3.5" /> Security & AI
              </span>
              <h2 id="trust-title" className="mt-5 text-balance font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
                Built to be trusted <span className="gradient-text">with your data.</span>
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink-2">
                Customer records, contracts, invoices, patient details. These commitments are part of every project — planned with your IT or compliance team, not added at the end.
              </p>
              <div className="unveil shadow-soft mt-7 overflow-hidden rounded-2xl bg-raised">
                <img src={photos.src("/images/trust-security.webp")} alt={photos.alt("/images/trust-security.webp")} loading="lazy" width={640} height={400} className="aspect-[16/9] w-full object-cover" />
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-auto lg:pt-8">
                <Link to="/responsible-ai" className="btn btn-primary px-6 py-3 text-sm">
                  How we protect your data
                </Link>
                <p className="text-sm text-subtle">Client work stays confidential.</p>
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {commitments.map(({ icon: Icon, title, desc }, i) => (
                <li key={title}>
                  <Reveal delay={i * 70} className="h-full">
                    <div className="h-full rounded-2xl border border-line bg-surface/80 p-5 backdrop-blur">
                      <span className="icon-tile h-10 w-10 rounded-xl">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{desc}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
