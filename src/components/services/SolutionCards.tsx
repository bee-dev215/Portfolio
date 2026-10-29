import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { solutionPath, solutions } from "@/data/company";
import Reveal from "@/components/site/Reveal";
import { usePhotos } from "@/hooks/use-photos";

/** Linked photo cards for the named solutions (unknown titles are skipped). */
export default function SolutionCards({ titles }: { titles: string[] }) {
  const photos = usePhotos();
  const list = titles.map((t) => solutions.find((s) => s.title === t)).filter((s): s is (typeof solutions)[number] => Boolean(s));

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s, i) => (
        <Reveal key={s.id} delay={i * 80} className="h-full">
          <Link to={solutionPath(s)} className="card card-hover group flex h-full flex-col overflow-hidden">
            <div className="relative aspect-[16/10] overflow-hidden bg-raised">
              <img src={photos.src(s.image)} alt="" loading="lazy" width={480} height={300} className="img-zoom h-full w-full object-cover" />
              <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-ink">{s.category}</span>
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-text">{s.domain}</p>
              <h3 className="mt-2 font-display text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-2">{s.summary}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-text">
                Explore the solution <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
