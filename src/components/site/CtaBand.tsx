import { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { startEnquiry } from "@/data/company";
import Reveal from "./Reveal";

/** Closing call to action for inner pages: a gradient card with "Start a project" and an optional second link. */
export default function CtaBand({
  kicker = "Every engagement starts with a free discovery call.",
  title,
  topic,
  primaryLabel = "Start a project",
  secondary,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  topic?: string; // pre-fills the contact form
  primaryLabel?: string;
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="px-5 pb-24 sm:px-8 lg:pb-32">
      <Reveal variant="scale" className="mx-auto max-w-[1240px]">
        <div className="relative overflow-hidden rounded-[2rem] bg-grad p-8 text-white sm:p-12 lg:p-14">
          <img src="/images/cta-backdrop.webp" alt="" loading="lazy" width={740} height={416} className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#312e81]/80 via-[#5b21b6]/50 to-transparent" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold text-white/80">{kicker}</p>
              <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h2>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button onClick={() => startEnquiry(topic)} className="btn bg-white px-6 py-3.5 text-[#3730a3] shadow-lg hover:-translate-y-px">
                {primaryLabel} <ArrowUpRight className="h-4 w-4" />
              </button>
              {secondary && (
                <Link to={secondary.to} className="btn border border-white/40 px-6 py-3.5 text-white hover:bg-white/10">
                  {secondary.label} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
