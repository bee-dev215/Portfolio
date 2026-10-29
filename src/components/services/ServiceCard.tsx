import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Service, servicePath } from "@/data/company";
import { serviceIcons } from "@/components/site/icons";
import { usePhotos } from "@/hooks/use-photos";

/** A service as a linked card: photo (when it has one), icon, title, description and (optionally) what's included. */
export default function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  const photos = usePhotos();
  const Icon = serviceIcons[service.key];
  return (
    <Link to={servicePath(service)} className="card card-hover group relative flex h-full flex-col overflow-hidden">
      {service.image && (
        <div className={`sheen relative overflow-hidden bg-raised ${compact ? "aspect-[16/9]" : "aspect-[16/8]"}`}>
          <img src={photos.src(service.image)} alt="" loading="lazy" width={640} height={400} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgb(10_16_32/.35)] to-transparent" aria-hidden="true" />
          <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white backdrop-blur transition-colors group-hover:bg-white group-hover:text-[#1e40af]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      )}
      <div className={`relative flex flex-1 flex-col ${compact ? "p-6" : "p-7 sm:p-8"}`}>
        <div className="bg-grad pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />
        <div className="flex items-start justify-between gap-4">
          {/* With a photo, the icon sits on its lower edge */}
          <span className={`icon-tile ${compact ? "h-11 w-11" : "h-12 w-12"} ${service.image ? `ring-4 ring-surface ${compact ? "-mt-[46px]" : "-mt-[54px]"}` : ""}`}>
            <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />
          </span>
          {!service.image && <ArrowUpRight className="h-5 w-5 text-subtle transition-colors group-hover:text-brand-text" />}
        </div>
        <h3 className={`font-display font-bold leading-snug tracking-tight ${compact ? "mt-4 text-lg" : "mt-5 text-2xl"}`}>{service.title}</h3>
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
      </div>
    </Link>
  );
}
