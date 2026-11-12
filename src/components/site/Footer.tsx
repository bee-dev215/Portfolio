import { ArrowUp, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { company, legalLinks, servicePath, services, sitePages, solutionPath, solutions } from "@/data/company";
import { projectPath, projects } from "@/data/projects";
import { scrollToTop } from "@/lib/scroll";
import { Monogram, Wordmark } from "./Navbar";
import ContactLine from "./ContactLine";
import { copyLine, directLines } from "./reach";

const linkCls = "foot-link text-sm text-ink-2 transition-colors hover:text-ink";
const headCls = "text-xs font-semibold uppercase tracking-[0.14em] text-subtle";

// Company column: every page that isn't a service, solution or project
const companyPages = sitePages.filter((p) => !["/solutions", "/projects", "/services"].includes(p.to));

function LinkColumn({ title, to, links, className = "" }: { title: string; to?: string; links: { to: string; label: string }[]; className?: string }) {
  return (
    <div className={className}>
      <p className={headCls}>{to ? <Link to={to} className="transition-colors hover:text-ink">{title}</Link> : title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className={linkCls}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ cta = true }: { cta?: boolean }) {
  const year = new Date().getFullYear();
  // Projects column: the featured ones, then a link to the rest
  const footerProjects = [
    ...projects.filter((p) => p.featured).map((p) => ({ to: projectPath(p), label: p.title })),
    { to: "/projects", label: `All ${projects.length} projects` },
  ];

  return (
    <footer className="on-dark relative isolate overflow-hidden bg-canvas px-5 pt-20 sm:px-8 sm:pt-24">
      {/* Backdrop: pooled brand light, a faint dot grid and a gradient hairline along the top */}
      <div className="mesh pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden="true" />
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="bg-grad absolute inset-x-0 top-0 h-px opacity-70" aria-hidden="true" />

      <div className="mx-auto max-w-[1240px]">
        {/* CTA card */}
        {cta && (
          <div className="foot-cta cta-flow relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-12 lg:p-16">
            <div className="foot-cta-glow pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="max-w-2xl font-display text-[clamp(2.1rem,5vw,4rem)] font-extrabold leading-[1] tracking-[-0.04em]">
                  Ready to hand off the busywork?
                </h2>
                <p className="mt-4 max-w-lg text-white/80">
                  Book a free call with a senior engineer. If software can take the task off your plate, the first two weeks of building are on us.
                </p>
              </div>
              <div className="flex flex-col items-start gap-5 lg:items-center lg:justify-self-end">
                <Link
                  to="/book"
                  className="btn magnetic group bg-volt px-7 py-4 text-base font-semibold text-[#0b1020] shadow-[0_16px_34px_-12px_rgb(0_0_0/.5)] hover:bg-white"
                >
                  Book a free call
                  <CalendarDays className="h-4 w-4" />
                </Link>
                <ContactLine />
              </div>
            </div>
          </div>
        )}

        <div className={`${cta ? "mt-16 lg:mt-20" : ""} grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1.15fr_.9fr_.9fr]`}>
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Monogram className="h-11 w-11" />
              <span className="leading-tight">
                <span className="sr-only">{company.name}</span>
                <Wordmark className="h-[22px]" />
                <span className="mt-1 block text-xs text-subtle">{company.discipline}</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-2">
              AI agents, automations and custom software that take the busywork off your team.
            </p>
            <p className={`mt-9 ${headCls}`}>Get in touch</p>
            <ul className="mt-4 space-y-3">
              {directLines.map((l) => (
                <li key={l.key}>
                  <a href={l.href} onClick={() => copyLine(l.value)} className={linkCls}>
                    {l.value}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/book" className={linkCls}>
                  Book a call
                </Link>
              </li>
            </ul>
          </div>

          <LinkColumn title="Services" to="/services" links={services.map((x) => ({ to: servicePath(x), label: x.title }))} />
          <div className="space-y-9">
            <LinkColumn title="Solutions" to="/solutions" links={solutions.map((x) => ({ to: solutionPath(x), label: x.title }))} />
            <LinkColumn title="Our work" to="/projects" links={footerProjects} />
          </div>
          <LinkColumn title="Company" links={companyPages} />
          <LinkColumn title="Legal" links={[...legalLinks, { to: "/terms#credits", label: "Image credits" }]} />
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-line py-7 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <button
            onClick={() => scrollToTop()}
            data-back-to-top
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface/70 text-ink transition-[background-color,border-color,color,scale] hover:border-brand/60 hover:bg-brand hover:text-white active:scale-95"
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
