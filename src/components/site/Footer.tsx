import { ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { company, footerLinks, legalLinks, openSolution, scrollToId, socials, solutions, startEnquiry } from "@/data/company";
import { Monogram } from "./Navbar";
import SocialIcon from "./SocialIcon";

const linkCls = "u-link font-display text-sm font-medium uppercase tracking-wide text-ink/75 transition-colors hover:text-beam";
const ctaCls = "u-link font-display text-sm font-medium uppercase tracking-wide text-beam transition-colors hover:text-beam-hi";
const headCls = "font-code text-[10px] uppercase tracking-[0.2em] text-muted2";

/** On the home page, acts in place; elsewhere (legal pages), navigates home to the section. */
function HomeAction({ section, onHome, className, children }: { section: string; onHome: () => void; className: string; children: ReactNode }) {
  const home = useLocation().pathname === "/";
  return home ? (
    <button onClick={onHome} className={className}>
      {children}
    </button>
  ) : (
    <Link to={`/#${section}`} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-paper px-5 pb-8 pt-16 sm:px-10 lg:px-14">
      <div className="hazard pointer-events-none absolute inset-x-0 top-0 h-1 opacity-40" />
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_0.9fr]">
          {/* Identity & contact */}
          <div>
            <div className="flex items-center gap-3">
              <Monogram />
              <p className="font-display text-2xl font-bold uppercase tracking-wide">
                {company.legalName}
                <span className="text-beam">.</span>
              </p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted2">
              {company.discipline} — motion, perception and fleet software, from simulation to the factory floor.
            </p>
            <ul className="mt-6 space-y-2.5">
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} className="group inline-flex items-center gap-3 text-sm text-ink/85 transition-colors hover:text-beam">
                    <SocialIcon name={s.key} className="h-4 w-4 text-beam" />
                    <span className="u-link">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted2">
              <span className="led" /> {company.availability}
            </p>
          </div>

          {/* Site map */}
          <nav aria-label="Footer">
            <p className={headCls}>Explore</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map((l) => (
                <li key={l.id}>
                  <HomeAction section={l.id} onHome={() => scrollToId(l.id)} className={linkCls}>
                    {l.label}
                  </HomeAction>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={headCls}>Solutions</p>
            <ul className="mt-4 space-y-2.5">
              {solutions.map((s) => (
                <li key={s.id}>
                  <HomeAction section="solutions" onHome={() => openSolution(s.title)} className={linkCls}>
                    {s.title}
                  </HomeAction>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headCls}>Company</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <HomeAction section="contact" onHome={() => startEnquiry()} className={ctaCls}>
                  Start a project
                </HomeAction>
              </li>
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/terms#credits" className={linkCls}>
                  Image credits
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-muted2 sm:flex-row sm:items-center">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <p className="font-code uppercase tracking-wider">
            // End of transmission ·{" "}
            <Link to="/admin" className="transition-colors hover:text-beam">
              Admin
            </Link>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="press key-dark group flex items-center gap-2 border border-line px-4 py-2 font-display text-xs font-medium uppercase tracking-wide text-ink/80 hover:border-signal hover:text-beam"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
