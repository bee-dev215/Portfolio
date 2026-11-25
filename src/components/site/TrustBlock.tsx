import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { company } from "@/data/company";
import Reveal from "./Reveal";

const callouts = [
  { title: "We never ask for money", desc: "Not to apply, not for training, not for equipment. If someone does, it isn't us." },
  { title: "One official address", desc: `We only contact applicants from ${company.email}.` },
];

/** Safe by design: an icon, an eyebrow, a statement and two callouts with a rule down their left edge. */
export default function TrustBlock() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-[1200px] border-t border-line pt-14">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand text-white shadow-[0_14px_30px_-14px_rgb(var(--brand-rgb)/.8)]">
          <ShieldCheck className="h-8 w-8" />
        </span>
        <p className="eyebrow mt-6">Safe by design</p>
        <h2 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.1] tracking-[-0.02em] text-ink">
          Free to apply — <span className="gradient-text">and it always will be.</span>
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-2">
          Remote work attracts scams, so we make the honest path easy to recognise: a free application, a real interview with a real person, and a written contract
          before you start.{" "}
          <Link to="/faq#spot-scams" className="font-semibold text-brand-text underline-offset-4 hover:underline">
            How to spot a fake offer
          </Link>
          .
        </p>
        <div className="mt-9 grid gap-6 sm:grid-cols-2">
          {callouts.map((c) => (
            <div key={c.title} className="border-l-2 border-iris/60 pl-5">
              <p className="font-semibold text-ink">{c.title}</p>
              <p className="mt-1 text-ink-2">{c.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
