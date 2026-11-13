import { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { bookCall } from "@/data/company";
import ContactLine from "./ContactLine";
import Reveal from "./Reveal";

/** Closing call to action for inner pages: a gradient card with "Book a call" and an optional second link. */
export default function CtaBand({
  kicker = "Every project starts with a free call — and the first two weeks are on us.",
  title,
  topic,
  primaryLabel = "Book a call",
  secondary,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  topic?: string; // pre-fills the booking form's topic
  primaryLabel?: string;
  secondary?: { label: string; to: string };
}) {
  return (
    // No top padding of its own: it leans on the section above. After a tinted .band it adds some, so the card
    // doesn't sit on the band's bottom edge
    <section className="px-5 pb-24 sm:px-8 lg:pb-32 [.band+&]:pt-20 lg:[.band+&]:pt-28">
      <Reveal variant="scale" className="mx-auto max-w-[1240px]">
        <div className="cta-flow relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-12 lg:p-16">
          <img src="/images/cta-backdrop.webp" alt="" loading="lazy" width={740} height={416} className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b3f]/85 via-[#12295c]/55 to-transparent" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2.5 text-sm font-semibold text-volt"><span className="live-dot !bg-volt" />{kicker}</p>
              <h2 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2.1rem,5vw,4rem)] font-extrabold leading-[1] tracking-[-0.04em]">{title}</h2>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-5 lg:items-center">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => bookCall(topic)} className="btn magnetic bg-volt px-7 py-4 text-base text-[#0b1020] shadow-[0_16px_34px_-12px_rgb(0_0_0/.5)] hover:bg-white">
                  {primaryLabel} <CalendarDays className="h-4 w-4" />
                </button>
                {secondary && (
                  <Link to={secondary.to} className="btn border-[1.5px] border-white/60 px-7 py-4 text-base text-white hover:bg-white hover:text-[#0b1020]">
                    {secondary.label}
                  </Link>
                )}
              </div>
              <ContactLine />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
