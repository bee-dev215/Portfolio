import { Accessibility, ArrowRight, BookCheck, LockKeyhole, ShieldCheck, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { usePhotos } from "@/hooks/use-photos";

const commitments = [
  { icon: BookCheck, title: "Grounded answers, with sources", desc: "Assistants answer from your approved content and show where each answer came from." },
  { icon: UserCheck, title: "A person reviews what matters", desc: "Grades, feedback and other high-stakes outputs go to an educator before they reach a learner." },
  { icon: LockKeyhole, title: "Your data stays yours", desc: "Enterprise terms keep your data out of model training, and open models can run in your own cloud." },
  { icon: Accessibility, title: "Accessible by design", desc: "Interfaces are designed for keyboard, screen-reader and caption users from the first sketch." },
];

/** Home-page band: the four commitments behind every build, linking to /responsible-ai. */
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
                <ShieldCheck className="h-3.5 w-3.5" /> Responsible AI
              </span>
              <h2 id="trust-title" className="mt-5 text-balance font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
                Built to be trusted <span className="gradient-text">in a classroom.</span>
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink-2">
                Learners, parents and staff need to trust what AI tells them. These commitments are part of every project — planned with your safeguarding and compliance teams, not added at the end.
              </p>
              <div className="unveil shadow-soft mt-7 overflow-hidden rounded-2xl bg-raised">
                <img src={photos.src("/images/trust-classroom.webp")} alt={photos.alt("/images/trust-classroom.webp")} loading="lazy" width={640} height={400} className="aspect-[16/9] w-full object-cover" />
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-auto lg:pt-8">
                <Link to="/responsible-ai" className="btn btn-primary px-6 py-3 text-sm">
                  How we protect learners <ArrowRight className="h-4 w-4" />
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
