import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Solution, solutionPath } from "@/data/company";
import { usePhotos } from "@/hooks/use-photos";

/** Photo card linking to a solution's page — used on the index and in "related solutions". */
export default function SolutionCard({ solution, compact = false }: { solution: Solution; compact?: boolean }) {
  const photos = usePhotos();

  return (
    <Link to={solutionPath(solution)} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="sheen relative aspect-[16/10] overflow-hidden bg-raised">
        {solution.image && (
          <img src={photos.src(solution.image)} alt="" loading="lazy" width={640} height={400} className="h-full w-full object-cover" />
        )}
        <div className="photo-fade absolute inset-0" aria-hidden="true" />
        <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{solution.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text">{solution.domain}</p>
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight">{solution.title}</h3>
        {!compact && <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{solution.summary}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm">
          <span className="text-subtle">
            {solution.capabilities.length} capabilities · {solution.deliverables.length} deliverables
          </span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-text transition-colors group-hover:bg-grad group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
