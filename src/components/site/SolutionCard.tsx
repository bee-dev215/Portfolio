import { ArrowUpRight } from "lucide-react";
import { Solution } from "@/data/company";

export default function SolutionCard({ solution, onOpen }: { solution: Solution; code?: string; onOpen: (s: Solution) => void }) {
  return (
    <article className="card card-hover group relative flex h-full w-full flex-col overflow-hidden text-left">
      {/* Stretched button opens the details modal */}
      <button onClick={() => onOpen(solution)} aria-label={`View ${solution.title} details`} className="absolute inset-0 z-[1] rounded-[1.25rem]" />

      <div className="relative aspect-[16/10] overflow-hidden bg-raised">
        {solution.image && <img src={solution.image} alt="" loading="lazy" width={736} height={460} className="img-zoom h-full w-full object-cover" />}
        <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-ink">{solution.category}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-bold tracking-tight">{solution.title}</h3>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-subtle transition-all duration-300 group-hover:border-transparent group-hover:bg-grad group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-text">{solution.domain}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{solution.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {solution.tech.slice(0, 4).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
