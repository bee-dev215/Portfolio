import { Fragment, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface Crumb {
  label: string;
  to?: string; // omit on the current page
}

/** Breadcrumb trail, starting at Home, with BreadcrumbList structured data. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Home", to: "/" }, ...crumbs];
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.to ? { item: new URL(c.to, window.location.origin).href } : {}) })),
  });

  return (
    <nav aria-label="Breadcrumb" className="fade-up">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-subtle">
        {trail.map((c, i) => (
          <Fragment key={c.label}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />}
            <li>
              {c.to ? (
                <Link to={c.to} className="transition-colors hover:text-brand-text">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink">
                  {c.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Top of every inner page: breadcrumbs, eyebrow, h1 (wrap a phrase in .gradient-text), lead, actions,
 * and an optional aside (a photo, a facts card…) that sits beside the text on wide screens.
 */
export default function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  actions,
  aside,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode; // extra content under the actions (chips, facts…)
}) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:pb-24 lg:pt-36">
      <div className="clouds pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

      <div className={`relative mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)] items-center gap-12 ${aside ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-16" : ""}`}>
        <div className={aside ? "min-w-0" : "max-w-3xl"}>
          <Breadcrumbs crumbs={crumbs} />
          {eyebrow && (
            <p className="fade-up eyebrow mt-8" style={{ animationDelay: ".05s" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-grad" />
              {eyebrow}
            </p>
          )}
          <h1
            className={`fade-up ${eyebrow ? "mt-5" : "mt-8"} text-balance font-display text-[clamp(2.4rem,6vw,4.25rem)] font-extrabold leading-[1.04] tracking-tight`}
            style={{ animationDelay: ".1s" }}
          >
            {title}
          </h1>
          {lead && (
            <p className="fade-up mt-6 max-w-2xl text-lg leading-relaxed text-ink-2" style={{ animationDelay: ".18s" }}>
              {lead}
            </p>
          )}
          {actions && (
            <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".26s" }}>
              {actions}
            </div>
          )}
          {children && (
            <div className="fade-up mt-9" style={{ animationDelay: ".32s" }}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="fade-up min-w-0" style={{ animationDelay: ".24s" }}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
