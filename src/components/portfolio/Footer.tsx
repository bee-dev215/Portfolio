import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { navLinks, profile, scrollToId } from "@/data/portfolio";
import { useMagnetic } from "@/hooks/use-motion";

export default function Footer({ onResume }: { onResume: () => void }) {
  const year = new Date().getFullYear();
  const backToTop = useMagnetic<HTMLButtonElement>(0.3);
  return (
    <footer className="site-dark border-t border-white/15 bg-ink px-5 pb-8 pt-14 text-paper sm:px-10 lg:px-14">
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <div>
          <p className="font-display text-2xl font-bold uppercase tracking-wide">
            {profile.name}
            <span className="text-signal">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55">{profile.title} — building fast, scalable and well-crafted web applications.</p>
        </div>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 md:max-w-md md:justify-end">
          {navLinks.map((l) => (
            <li key={l.id}>
              <button onClick={() => scrollToId(l.id)} className="u-link font-display text-sm font-medium uppercase tracking-wide text-white/75 hover:text-signal">
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button onClick={onResume} className="u-link font-display text-sm font-medium uppercase tracking-wide text-signal">
              Résumé
            </button>
          </li>
        </ul>
      </div>

      <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
        <p>
          © {year} {profile.name}. All rights reserved.
        </p>
        <p className="font-code">
          Designed & built with care ·{" "}
          <Link to="/admin" className="transition-colors hover:text-signal">
            Admin
          </Link>
        </p>
        <button
          ref={backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="magnetic group flex items-center gap-2 border border-white/25 px-4 py-2 font-display text-xs font-medium uppercase tracking-wide text-white/80 hover:border-signal hover:text-signal"
        >
          Back to top <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      </div>
    </footer>
  );
}
