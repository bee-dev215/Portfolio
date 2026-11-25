import { ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { applyPath, Role, rolePath } from "@/data/company";
import { roleIcons } from "@/components/site/icons";

/** A role as a Timeline-style image card: photo on top, a small uppercase category, the title, a line of text, links. */
export default function RoleCard({ role }: { role: Role; index?: number }) {
  const Icon = roleIcons[role.key];
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link to={rolePath(role)} className="sheen relative block aspect-[16/10] overflow-hidden bg-raised" tabIndex={-1} aria-hidden="true">
        <img src={role.image} alt="" loading="lazy" width={1280} height={800} style={{ objectPosition: role.focus }} className="h-full w-full object-cover" />
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#0f1f3d] shadow-sm">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-subtle">{role.category}</p>
        <h3 className="mt-3 font-display text-[1.5rem] font-medium leading-tight text-ink">
          <Link to={rolePath(role)} className="transition-colors hover:text-brand-text">
            {role.title}
          </Link>
        </h3>
        <p className="mt-3 leading-relaxed text-ink-2">{role.short}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
          <span className="inline-flex items-center gap-1.5 text-sm text-subtle">
            <Clock3 className="h-4 w-4" /> {role.commitment}
          </span>
          <span className="flex items-center gap-4">
            <Link to={rolePath(role)} className="text-sm font-semibold text-ink hover:text-brand-text">
              Details
            </Link>
            <Link to={applyPath(role)} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text">
              Apply <ArrowRight className="h-4 w-4" />
            </Link>
          </span>
        </div>
      </div>
    </article>
  );
}
