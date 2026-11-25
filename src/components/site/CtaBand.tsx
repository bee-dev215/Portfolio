import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { applyPath, Role } from "@/data/company";
import Reveal from "./Reveal";

/** Closing call to action for inner pages: a soft gradient card, centred, with "Apply now" and an optional second link. */
export default function CtaBand({
  kicker = "Start your application",
  title,
  role,
  primaryLabel = "Apply now",
  secondary,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  role?: Pick<Role, "slug">; // opens the apply form with this role chosen
  primaryLabel?: string;
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <Reveal variant="scale" className="mx-auto max-w-[1200px]">
        <div className="wash-card rounded-[2rem] border border-line px-6 py-14 text-center sm:px-12 lg:py-20">
          <p className="eyebrow">{kicker}</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance font-display text-[clamp(2rem,4.4vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.02em] text-ink">{title}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={applyPath(role)} className="btn btn-primary px-8 py-4 text-base">
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            {secondary && (
              <Link to={secondary.to} className="btn btn-secondary px-8 py-4 text-base">
                {secondary.label}
              </Link>
            )}
          </div>
          <p className="mt-4 text-sm text-subtle">Free to apply · About five minutes · Reviewed by a real person</p>
        </div>
      </Reveal>
    </section>
  );
}
