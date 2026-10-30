import { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { bookCall } from "@/data/company";
import { usePhotos } from "@/hooks/use-photos";
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
  const photos = usePhotos();
  return (
    <section className="px-5 pb-24 sm:px-8 lg:pb-32">
      <Reveal variant="scale" className="mx-auto max-w-[1240px]">
        <div className="relative overflow-hidden rounded-[2rem] bg-grad p-8 text-white sm:p-12 lg:p-14">
          <img src={photos.src("/images/cta-backdrop.webp")} alt="" loading="lazy" width={740} height={416} className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b3f]/85 via-[#12295c]/55 to-transparent" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold text-white/80">{kicker}</p>
              <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h2>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-5 lg:items-end">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => bookCall(topic)} className="btn bg-white px-6 py-3.5 text-[#1e40af] shadow-lg hover:-translate-y-px">
                  {primaryLabel} <CalendarDays className="h-4 w-4" />
                </button>
                {secondary && (
                  <Link to={secondary.to} className="btn border border-white/40 px-6 py-3.5 text-white hover:bg-white/10">
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
