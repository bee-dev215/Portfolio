import { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Gauge, Layers, ShieldCheck, Target, Users, Workflow } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import SectionNav, { NavSection, SECTION_OFFSET } from "@/components/solutions/SectionNav";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFlow from "@/components/projects/ProjectFlow";
import { serviceIcons } from "@/components/site/icons";
import { industries, industryPath, servicePath, services, solutionPath, solutions, startEnquiry } from "@/data/company";
import { audienceTitle, Project, projectPath, projects } from "@/data/projects";
import NotFound from "./NotFound";

const SECTIONS: NavSection[] = [
  { id: "overview", label: "Overview" },
  { id: "approach", label: "Approach" },
  { id: "built", label: "What we built" },
  { id: "architecture", label: "Architecture" },
  { id: "safeguards", label: "Safeguards & measures" },
];

// Sections sit below the navbar and the sticky section bar when jumped to
const anchor: CSSProperties = { scrollMarginTop: SECTION_OFFSET };

/** Up to three other projects: same audience first, then those sharing the most services. */
function relatedTo(project: Project) {
  const shared = (p: Project) => p.services.filter((k) => project.services.includes(k)).length;
  return projects
    .filter((p) => p !== project)
    .sort((a, b) => Number(b.audience === project.audience) - Number(a.audience === project.audience) || shared(b) - shared(a))
    .slice(0, 3);
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return <NotFound />;
  return <ProjectPage key={projects[index].slug} index={index} />;
}

function ProjectPage({ index }: { index: number }) {
  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const audience = industries.find((i) => i.key === project.audience);
  const solution = solutions.find((s) => s.slug === project.solution);
  const used = project.services.map((k) => services.find((s) => s.key === k)).filter((s): s is (typeof services)[number] => Boolean(s));
  const related = relatedTo(project);

  const facts = [
    { k: "Client", v: project.client },
    { k: "Year", v: project.year },
    { k: "Timeline", v: project.duration },
    { k: "Team", v: project.team },
  ];

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SECTION_OFFSET + 8, behavior: "smooth" });
  };

  return (
    <PageShell title={project.title} description={project.summary}>
      <PageHero
        crumbs={[{ label: "Projects", to: "/projects" }, { label: project.title }]}
        eyebrow={`${audienceTitle(project)} · ${project.year}`}
        title={project.title}
        lead={project.summary}
        actions={
          <>
            <button onClick={() => startEnquiry(project.title)} className="btn btn-primary px-7 py-3.5">
              Discuss a similar project <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => jump("architecture")} className="btn btn-secondary px-7 py-3.5">
              <Workflow className="h-4 w-4" /> See the architecture
            </button>
          </>
        }
        aside={
          <div className="relative pb-10 sm:pb-0 sm:pr-10">
            <div className="shadow-soft overflow-hidden rounded-[2rem] bg-raised">
              <img src={project.image} alt={project.imageAlt} width={1280} height={800} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="glass shadow-soft absolute -bottom-2 left-4 right-4 rounded-2xl border border-line p-4 sm:-bottom-8 sm:left-auto sm:right-0 sm:w-72">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">Project at a glance</p>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 shrink-0 text-brand-text" />
                  <dt className="sr-only">Client</dt>
                  <dd className="truncate font-semibold">{project.client}</dd>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-brand-text" />
                  <dt className="sr-only">Timeline</dt>
                  <dd>{project.duration}</dd>
                </div>
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 shrink-0 text-brand-text" />
                  <dt className="sr-only">Key technology</dt>
                  <dd className="truncate text-ink-2">{project.stack.slice(0, 3).join(" · ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        }
      />

      <SectionNav sections={SECTIONS} />

      {/* Overview: the problem, the brief and the facts */}
      <section id="overview" style={anchor} className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <div>
            <SectionHeading
              label="The challenge"
              title={
                <>
                  What needed <span className="gradient-text">to change.</span>
                </>
              }
            >
              <p className="mt-6 text-lg leading-relaxed text-ink">{project.challenge}</p>
            </SectionHeading>
            <Reveal delay={80}>
              <div className="card grad-border mt-10 p-6">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-text">
                  <Target className="h-4 w-4" /> The brief
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.brief.map((b) => (
                    <li key={b} className="flex gap-3 text-ink">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-grad text-white">
                        <Check className="h-3 w-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal variant="right" delay={100} className="lg:sticky lg:top-44 lg:self-start">
            <div className="card shadow-soft rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Project facts</p>
              <dl className="mt-5 divide-y divide-line">
                {facts.map(({ k, v }) => (
                  <div key={k} className="flex flex-col gap-1 py-3.5 first:pt-0 sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm text-subtle">{k}</dt>
                    <dd className="text-sm font-semibold sm:text-right">{v}</dd>
                  </div>
                ))}
                {audience && (
                  <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm text-subtle">Audience</dt>
                    <dd className="text-sm font-semibold sm:text-right">
                      <Link to={industryPath(audience)} className="u-link text-brand-text">
                        {audience.title}
                      </Link>
                    </dd>
                  </div>
                )}
                {solution && (
                  <div className="flex flex-col gap-1 py-3.5 last:pb-0 sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm text-subtle">Started from</dt>
                    <dd className="text-sm font-semibold sm:text-right">
                      <Link to={solutionPath(solution)} className="u-link text-brand-text">
                        {solution.title} blueprint
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
              <p className="mt-6 border-t border-line pt-5 text-xs font-semibold uppercase tracking-wider text-subtle">Services</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {used.map((s) => {
                  const Icon = serviceIcons[s.key];
                  return (
                    <li key={s.key}>
                      <Link to={servicePath(s)} className="chip px-3 py-1.5 text-[13px] transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-text">
                        <Icon className="h-3.5 w-3.5" /> {s.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Approach: the project's phases */}
      <section id="approach" style={anchor} className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Approach"
            title={
              <>
                How the project <span className="gradient-text">ran.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              {project.steps.length} phases, each ending in something the client could see and test.{" "}
              <Link to="/approach" className="u-link font-semibold text-brand-text">
                Our delivery process
              </Link>
            </p>
          </SectionHeading>
          <div className="relative mt-14">
            <span className="bg-grad absolute left-8 right-8 top-[2.875rem] hidden h-px opacity-40 xl:block" aria-hidden="true" />
            <ol className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {project.steps.map((step, i) => (
                <li key={step.phase}>
                  <Reveal delay={i * 90} className="h-full">
                    <div className="card relative flex h-full flex-col p-6">
                      <span className="icon-tile relative h-11 w-11 font-display text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-brand-text">{step.when}</p>
                      <h3 className="mt-1 font-display text-lg font-bold">{step.phase}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{step.desc}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* What we built, beside the second photo */}
      <section id="built" style={anchor} className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="What we built"
            title={
              <>
                The product, <span className="gradient-text">feature by feature.</span>
              </>
            }
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-[.95fr_1.05fr] lg:gap-10">
            <Reveal variant="left" className="lg:sticky lg:top-44 lg:self-start">
              <figure>
                <div className="unveil shadow-soft overflow-hidden rounded-[2rem] bg-raised">
                  <img src={project.gallery.src} alt={project.gallery.alt} loading="lazy" width={1280} height={800} className="aspect-[4/3] w-full object-cover" />
                </div>
                <figcaption className="mt-4 flex gap-3 text-sm leading-relaxed text-ink-2">
                  <span className="bg-grad mt-2 h-px w-6 shrink-0" aria-hidden="true" />
                  {project.gallery.caption}
                </figcaption>
              </figure>
            </Reveal>
            <ol className="grid gap-4 sm:grid-cols-2">
              {project.built.map((f, i) => (
                <li key={f.title}>
                  <Reveal delay={i * 70} className="h-full">
                    <div className="card card-hover h-full p-6">
                      <span className="gradient-text font-display text-2xl font-extrabold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-3 font-display text-lg font-bold">{f.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{f.desc}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" style={anchor} className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              label="Architecture"
              title={
                <>
                  How it <span className="gradient-text">fits together.</span>
                </>
              }
            >
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">The path from the client's own content and data to the people who use it.</p>
            </SectionHeading>
            <Reveal delay={100}>
              <Link to="/technology" className="btn btn-secondary shrink-0 px-6 py-3 text-sm">
                How we choose models <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12">
            <ProjectFlow flow={project.flow} />
          </div>
          <Reveal delay={120}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mr-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                <Layers className="h-4 w-4 text-brand-text" /> Built with
              </span>
              {project.stack.map((t) => (
                <span key={t} className="chip px-3 py-1.5 text-[13px]">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Safeguards and how success was judged */}
      <section id="safeguards" style={anchor} className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Safeguards & measures"
            title={
              <>
                Safe by design, <span className="gradient-text">judged on learning.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="card h-full p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                  <ShieldCheck className="h-4 w-4 text-brand-text" /> Safeguards
                </p>
                <ul className="mt-5 space-y-4">
                  {project.safeguards.map((s) => (
                    <li key={s} className="flex gap-3 leading-relaxed text-ink">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-text">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
                <Link to="/responsible-ai" className="u-link mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                  Our responsible-AI commitments <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={90} className="h-full">
              <div className="card grad-border h-full p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                  <Gauge className="h-4 w-4 text-brand-text" /> How success was judged
                </p>
                <ol className="mt-5 space-y-4">
                  {project.measures.map((m, i) => (
                    <li key={m} className="flex gap-3 leading-relaxed text-ink">
                      <span className="bg-grad grid h-6 w-6 shrink-0 place-items-center rounded-lg font-display text-xs font-bold text-white">{i + 1}</span>
                      {m}
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-sm leading-relaxed text-subtle">Agreed with the client during discovery and reported back to them — results stay between us and the client.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Previous / next and related */}
      <section className="band px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <nav aria-label="More projects" className="grid gap-4 sm:grid-cols-2">
            {[
              { p: prev, dir: "Previous", Icon: ArrowLeft },
              { p: next, dir: "Next", Icon: ArrowRight },
            ].map(({ p, dir, Icon }) => (
              <Link
                key={dir}
                to={projectPath(p)}
                className={`card card-hover group flex items-center gap-4 p-3 ${dir === "Next" ? "flex-row-reverse text-right" : ""}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-colors group-hover:border-transparent group-hover:bg-grad group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-subtle">{dir} project</span>
                  <span className="block truncate font-display text-lg font-bold">{p.title}</span>
                </span>
                <img src={p.image} alt="" loading="lazy" width={96} height={64} className="hidden h-14 w-20 shrink-0 rounded-xl object-cover sm:block" />
              </Link>
            ))}
          </nav>

          <div className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-bold tracking-tight">Related projects</h2>
              <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                All {projects.length} projects <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80} className="h-full">
                  <ProjectCard project={p} compact />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        kicker="Every project starts with a free discovery call."
        title={<>Want something like {project.title}?</>}
        topic={project.title}
        primaryLabel="Discuss a similar project"
        secondary={{ label: "All projects", to: "/projects" }}
      />
    </PageShell>
  );
}

