import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Service, servicePath } from "@/data/company";
import { serviceIcons } from "@/components/site/icons";

/** A service as a linked card: icon, title, description and (optionally) what's included. */
export default function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  const Icon = serviceIcons[service.key];
  return (
    <Link
      to={servicePath(service)}
      className={`card card-hover group relative flex h-full flex-col overflow-hidden ${compact ? "p-6" : "p-7 sm:p-8"}`}
    >
      <div className="bg-grad pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />
      <div className="flex items-start justify-between gap-4">
        <span className={`icon-tile ${compact ? "h-11 w-11" : "h-12 w-12"}`}>
          <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />
        </span>
        <ArrowUpRight className="h-5 w-5 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-text" />
      </div>
      <h3 className={`font-display font-bold leading-snug tracking-tight ${compact ? "mt-5 text-lg" : "mt-6 text-2xl"}`}>{service.title}</h3>
      <p className={`mt-2.5 leading-relaxed text-ink-2 ${compact ? "line-clamp-3 text-sm" : ""}`}>{service.desc}</p>
      {!compact && (
        <ul className="mt-auto flex flex-wrap gap-2 pt-6">
          {service.includes.map((it) => (
            <li key={it} className="chip">
              {it}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
