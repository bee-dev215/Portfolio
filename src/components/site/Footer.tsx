import { ReactNode } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { company, footerLinks, legalLinks, openSolution, scrollToId, socials, solutions, startEnquiry } from "@/data/company";
import { Monogram } from "./Navbar";
import SocialIcon from "./SocialIcon";

const linkCls = "text-sm text-ink-2 transition-colors hover:text-brand-text";
const headCls = "text-xs font-semibold uppercase tracking-wider text-subtle";

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
    <footer className="relative border-t border-line bg-surface px-5 pb-8 pt-16 sm:px-8">
      <div className="mx-auto max-w-[1240px]">
        {/* CTA strip */}
        <div className="grad-border flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand-soft/60 p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight">Ready to bring AI into your learning experience?</p>
            <p className="mt-1 text-ink-2">Book a free discovery call — we reply within {company.responseTime}.</p>
          </div>
          <HomeAction section="contact" onHome={() => startEnquiry()} className="btn btn-primary shrink-0 px-6 py-3">
            Start a project <ArrowUpRight className="h-4 w-4" />
          </HomeAction>
        </div>

        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Monogram />
              <p className="font-display text-xl font-extrabold tracking-tight">{company.legalName}</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
              {company.discipline} — AI tutors, assessment, analytics and training for the organisations that teach.
            </p>
            <ul className="mt-6 space-y-2.5">
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} className="inline-flex items-center gap-2.5 text-sm text-ink-2 transition-colors hover:text-brand-text">
                    <SocialIcon name={s.key} className="h-4 w-4 text-brand-text" />
                    {s.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
            <p className={headCls}>Legal</p>
            <ul className="mt-4 space-y-2.5">
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

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-sm text-subtle sm:flex-row sm:items-center">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <Link to="/admin" className="transition-colors hover:text-brand-text">
            Admin
          </Link>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="btn btn-secondary px-4 py-2 text-xs">
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
