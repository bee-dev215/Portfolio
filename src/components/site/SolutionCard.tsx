import { ArrowUpRight } from "lucide-react";
import { Solution } from "@/data/company";

export default function SolutionCard({
  solution,
  code,
  onOpen,
}: {
  solution: Solution;
  code: string;
  onOpen: (s: Solution) => void;
}) {
  return (
    <div className="plate plate-lift hud group relative flex h-full w-full flex-col border border-line bg-paper-2/80 text-left hover:border-signal/50">
      {/* Stretched button opens the details modal */}
      <button
        onClick={() => onOpen(solution)}
        data-cursor="view"
        aria-label={`View ${solution.title} details`}
        className="absolute inset-0 z-[1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      />

      <div className="img-wipe photo-cast relative aspect-[16/10] overflow-hidden border-b border-line bg-paper-3">
        {solution.image && (
          <div className="img-zoom h-full w-full">
            <img
              src={solution.image}
              alt=""
              loading="lazy"
              width={1200}
              height={750}
              className="photo h-full w-full object-cover"
            />
          </div>
        )}
        <span className="img-scan absolute inset-0" aria-hidden="true" />
        <span className="absolute left-0 top-0 z-[2] border-b border-r border-line bg-paper/85 px-3 py-1.5 font-code text-xs text-beam backdrop-blur">{code}</span>
        <span className="absolute bottom-0 right-0 z-[2] bg-signal px-3 py-1.5 font-code text-[11px] font-medium uppercase tracking-wider text-on-signal">{solution.category}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold uppercase leading-tight tracking-wide">{solution.title}</h3>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-beam" />
        </div>
        <p className="mt-1 font-code text-xs uppercase tracking-wider text-muted2">{solution.domain}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted2">{solution.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {solution.tech.map((t) => (
            <span key={t} className="border border-line bg-paper/50 px-2 py-1 font-code text-[11px] text-ink/80 transition-colors duration-300 group-hover:border-signal/40">
              {t}
            </span>
          ))}
        </div>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-signal glow-line transition-transform duration-300 [transition-timing-function:var(--ease-servo)] group-hover:scale-x-100" />
    </div>
  );
}
