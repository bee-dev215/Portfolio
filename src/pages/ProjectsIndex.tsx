import { Check, KeyRound, Lock, LucideIcon, MousePointerClick, PhoneCall, Sparkles, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import PageSection from "@/components/company/PageSection";
import ProjectCard from "@/components/projects/ProjectCard";
import { bookCall, solutionPath, solutions } from "@/data/company";
import { mainService, Project, projectPath, projects } from "@/data/projects";

// The way every project runs, whatever the stack
const common: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: PhoneCall, title: "A call before any code", desc: "A short call about the task that eats your week, and a shared definition of 'fixed' before anything is built." },
  { icon: MousePointerClick, title: "A prototype in two weeks", desc: "Working software on your own data within two weeks, free, so you judge it before you're quoted for the rest." },
  { icon: UserCheck, title: "A person approves what matters", desc: "Payments, messages to customers and sensitive decisions wait for someone on your team to sign off." },
  { icon: KeyRound, title: "Yours to keep", desc: "Code, cloud accounts, documentation and training handed over in your name — no black boxes left behind." },
];

/** Four project photos, staggered, for the page hero. */
function HeroMosaic({ projects }: { projects: Project[] }) {
  const tiles = projects.slice(0, 4);
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {tiles.map((p, i) => (
        <Link
          key={p.slug}
          to={projectPath(p)}
          className={`sheen shadow-soft group relative block overflow-hidden rounded-3xl bg-raised ${i % 2 ? "translate-y-8" : ""}`}
        >
          <img src={p.image} alt={p.imageAlt} width={640} height={400} className="aspect-[4/5] w-full object-cover" />
          <div className="photo-fade absolute inset-0" aria-hidden="true" />
          <p className="absolute inset-x-0 bottom-0 p-4 font-display text-sm font-bold leading-tight text-white sm:text-base">{p.title}</p>
        </Link>
      ))}
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const solution = solutions.find((s) => s.slug === project.solution);
  return (
    <Reveal variant="scale">
      <article className="card group grid overflow-hidden lg:grid-cols-[1.15fr_.85fr]">
        <Link to={projectPath(project)} className="sheen relative block min-h-[16rem] overflow-hidden bg-raised" tabIndex={-1} aria-hidden="true">
          <img src={project.image} alt="" width={1280} height={800} className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1e40af] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Featured project
          </span>
        </Link>
        <div className="flex flex-col p-6 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-text">
            {mainService(project).title} · {project.year}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            <Link to={projectPath(project)} className="transition-colors hover:text-brand-text">
              {project.title}
            </Link>
          </h2>
          <p className="mt-1.5 text-sm text-subtle">{project.client}</p>
          <p className="mt-4 leading-relaxed text-ink-2">{project.summary}</p>
          <ul className="mt-5 space-y-2.5">
            {project.brief.slice(0, 3).map((b) => (
              <li key={b} className="flex gap-2.5 text-sm text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-7">
            <Link to={projectPath(project)} className="btn btn-primary px-6 py-3 text-sm">
              Read the case study
            </Link>
            {solution && (
              <Link to={solutionPath(solution)} className="u-link text-sm font-semibold text-brand-text">
                Built on {solution.title}
              </Link>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function ProjectsIndex() {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p !== featured);

  return (
    <PageShell
      title="Our work"
      description="Case studies in AI agents, AI automation and custom software: document AI, a voice agent, a contract-review assistant and a SaaS platform rescue."
    >
      <PageHero
        crumbs={[{ label: "Our work" }]}
        eyebrow={`${projects.length} projects`}
        title={
          <>
            Busywork, <span className="gradient-text">handed to AI.</span>
          </>
        }
        lead="What the task was, what the two-week prototype proved, what we built and how it was kept safe — from the first call to software in daily use."
        actions={
          <>
            <button onClick={() => bookCall()} className="btn btn-primary px-7 py-3.5">
              Book a call
            </button>
            <a href="#all-projects" className="btn btn-secondary px-7 py-3.5">
              Browse projects
            </a>
          </>
        }
        aside={<HeroMosaic projects={projects} />}
      >
        <p className="flex items-center gap-2 text-sm text-subtle">
          <Lock className="h-4 w-4 shrink-0" /> Clients are described, not named — their business stays their own.
        </p>
      </PageHero>

      <section id="all-projects" className="scroll-mt-24 px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-[1240px]">
          <FeaturedProject project={featured} />
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={i * 80} className="h-full">
                  <ProjectCard project={p} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What every project shares */}
      <PageSection band>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            label="Every project"
            title={
              <>
                Different problems, <span className="gradient-text">the same discipline.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">Whatever the task or the stack, every project follows the same four rules.</p>
          </SectionHeading>
          <Reveal delay={100}>
            <Link to="/approach" className="btn btn-secondary shrink-0 px-6 py-3 text-sm">
              How we work
            </Link>
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {common.map(({ icon: Icon, title, desc }, i) => (
            <li key={title}>
              <Reveal delay={i * 80} className="h-full">
                <div className="card card-hover h-full p-6">
                  <span className="icon-tile h-11 w-11">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </PageSection>

      <CtaBand
        kicker="Every project starts with a free call."
        title="Got a task that eats your team's week?"
        secondary={{ label: "Browse solutions", to: "/solutions" }}
      />
    </PageShell>
  );
}
