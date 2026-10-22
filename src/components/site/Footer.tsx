import { ArrowUp, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { company, industries, industryPath, legalLinks, servicePath, services, sitePages, socials, solutionPath, solutions, startEnquiry } from "@/data/company";
import { projectPath, projects } from "@/data/projects";
import { useInView } from "@/hooks/use-motion";
import { Monogram } from "./Navbar";
import SocialIcon from "./SocialIcon";

const linkCls = "foot-link text-sm text-ink-2 transition-colors hover:text-ink";
const headCls = "text-xs font-semibold uppercase tracking-[0.14em] text-subtle";

// Company column: every page that isn't a solution, project, service or audience
const companyPages = sitePages.filter((p) => !["/solutions", "/projects", "/services", "/industries"].includes(p.to));
// Projects column: the featured ones, then a link to the rest
const footerProjects = [...projects.filter((p) => p.featured).map((p) => ({ to: projectPath(p), label: p.title })), { to: "/projects", label: `All ${projects.length} projects` }];

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
  // Fills the wordmark once it is well into view at the end of the page
  const [mark, filled] = useInView<HTMLDivElement>({ threshold: 0.6, rootMargin: "0px" });

  return (
    <footer className="on-dark relative isolate overflow-hidden bg-canvas px-5 pt-20 sm:px-8 sm:pt-24">
      {/* Backdrop: pooled brand light, a faint dot grid and a gradient hairline along the top */}
      <div className="mesh pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden="true" />
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="bg-grad absolute inset-x-0 top-0 h-px opacity-70" aria-hidden="true" />

      <div className="mx-auto max-w-[1240px]">
        {/* CTA card */}
        {cta && (
          <div className="foot-cta bg-grad relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-12 lg:p-14">
            <div className="foot-cta-glow pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                  <span className="live-dot" /> {company.availability}
                </span>
                <h2 className="mt-5 max-w-xl font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]">
                  Ready to bring AI into your learning experience?
                </h2>
                <p className="mt-4 max-w-lg text-white/80">
                  Book a free discovery call. Tell us what your learners need — we reply within {company.responseTime}.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <button
                  onClick={() => startEnquiry()}
                  className="btn group bg-white px-6 py-3.5 font-semibold text-[#3730a3] shadow-[0_14px_30px_-12px_rgb(0_0_0/.45)] hover:-translate-y-px"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
                <a href={`mailto:${company.email}`} className="btn border border-white/30 bg-white/10 px-6 py-3.5 text-white backdrop-blur hover:bg-white/20">
                  Email us
                </a>
              </div>
            </div>
          </div>
        )}

        <div className={`${cta ? "mt-16 lg:mt-20" : ""} grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1.15fr_.9fr_.9fr]`}>
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Monogram className="h-10 w-10" />
              <span className="leading-tight">
                <span className="block font-display text-xl font-extrabold tracking-tight">{company.name}</span>
                <span className="block text-xs text-subtle">{company.discipline}</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-2">
              AI tutors, assessment, analytics and training for the schools, universities and companies that teach.
            </p>
            <ul className="mt-7 grid max-w-sm gap-2.5">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    className="group flex items-center gap-3 rounded-2xl border border-line bg-surface/60 p-3 pr-4 transition-colors hover:border-brand/50 hover:bg-surface"
                  >
                    <span className="icon-tile h-9 w-9 shrink-0 rounded-xl">
                      <SocialIcon name={s.key} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block text-[11px] font-medium uppercase tracking-wider text-subtle">{s.label}</span>
                      <span className="block truncate text-sm font-medium text-ink">{s.handle}</span>
                    </span>
                    <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-text" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-9">
            <LinkColumn title="Solutions" to="/solutions" links={solutions.map((x) => ({ to: solutionPath(x), label: x.title }))} />
            <LinkColumn title="Projects" to="/projects" links={footerProjects} />
          </div>
          <LinkColumn title="Services" to="/services" links={services.map((x) => ({ to: servicePath(x), label: x.title }))} />
          <LinkColumn title="Company" links={companyPages} />
          <div className="space-y-9">
            <LinkColumn title="Who we serve" to="/industries" links={industries.map((x) => ({ to: industryPath(x), label: x.title }))} />
            <LinkColumn title="Legal" links={[...legalLinks, { to: "/terms#credits", label: "Image credits" }]} />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-line py-7 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sun" /> Built to help people learn better.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/admin" className="transition-colors hover:text-ink">
              Admin
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group grid h-11 w-11 place-items-center rounded-full border border-line bg-surface/70 text-ink transition-colors hover:border-brand/60 hover:bg-brand hover:text-white"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Oversized wordmark that bleeds off the bottom edge */}
      <div ref={mark} className={`wordmark-host -mx-5 sm:-mx-8 ${filled ? "is-filled" : ""}`} aria-hidden="true">
        {["wordmark", "wordmark wordmark-fill"].map((cls) => (
          <p key={cls} className={`${cls} select-none whitespace-nowrap text-center font-display font-extrabold leading-[0.8] tracking-tight`}>
            {company.name}
          </p>
        ))}
      </div>
    </footer>
  );
}
