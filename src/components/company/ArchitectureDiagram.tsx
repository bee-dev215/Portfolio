import { Fragment } from "react";
import { BarChart3, Database, FileSearch, LayoutDashboard, LucideIcon, Server, ShieldCheck, Workflow } from "lucide-react";
import { architecture } from "@/data/company-pages";
import Reveal from "../site/Reveal";
import "./company.css";

// One icon per node, in the same order as `architecture`
const icons: LucideIcon[] = [Database, Workflow, FileSearch, Server, ShieldCheck, LayoutDashboard, BarChart3];

/** Reference architecture: one row of nodes joined by animated connectors on wide screens, a column on phones. */
export default function ArchitectureDiagram() {
  return (
    <Reveal className="mt-12">
      <div className="card shadow-soft overflow-hidden rounded-3xl p-5 sm:p-8">
        <ol className="flex flex-col items-stretch xl:flex-row xl:items-stretch" aria-label="Reference architecture, from your systems to analytics">
          {architecture.map((n, i) => {
            const Icon = icons[i % icons.length];
            const ai = n.layer === "AI";
            return (
              <Fragment key={n.title}>
                {i > 0 && (
                  <li aria-hidden="true" className="flex items-center justify-center py-1 xl:px-1 xl:py-0">
                    <span className="arch-flow-v block h-6 w-[2px] xl:hidden" />
                    <span className="arch-flow hidden h-[2px] w-5 xl:block" />
                  </li>
                )}
                <li className="flex-1">
                  <div className={`flex h-full items-center gap-4 rounded-2xl border p-4 xl:flex-col xl:items-start xl:gap-3 ${ai ? "border-brand/30 bg-brand-soft" : "border-line bg-raised/50"}`}>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${ai ? "bg-grad text-white" : "bg-surface text-brand-text"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">{n.layer}</p>
                      <p className="font-display text-[15px] font-bold leading-tight">{n.title}</p>
                      <p className="mt-1 text-xs leading-snug text-ink-2">{n.desc}</p>
                    </div>
                  </div>
                </li>
              </Fragment>
            );
          })}
        </ol>
        <p className="mt-6 text-xs leading-relaxed text-subtle">
          A simplified reference design. Each project adapts it — some keep everything inside your cloud, some only need part of the chain.
        </p>
      </div>
    </Reveal>
  );
}
