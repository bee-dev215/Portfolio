import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import { sitePages } from "@/data/company";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <PageShell title="Page not found" footerCta>
      <section className="relative overflow-hidden px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
        <div className="mesh pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="eyebrow">Page not found</p>
          <h1 className="gradient-text mt-5 font-display text-8xl font-extrabold tracking-tight">404</h1>
          <p className="mt-4 text-lg text-ink-2">
            There's nothing at <span className="font-code text-base text-ink">{pathname}</span> — try one of these pages instead.
          </p>
          <Link to="/" className="btn btn-primary mt-8 px-6 py-3 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <ul className="mt-12 flex flex-wrap justify-center gap-2">
            {sitePages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="chip px-3.5 py-1.5 text-sm transition-colors hover:border-brand/40 hover:text-brand-text">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
