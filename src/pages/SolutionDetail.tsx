import { CSSProperties, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Layers, MessageSquareText, Package, Plus, Plug, Target, Users, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import SampleExchange from "@/components/solutions/SampleExchange";
import SectionNav, { NavSection, SECTION_OFFSET } from "@/components/solutions/SectionNav";
import SolutionCard from "@/components/solutions/SolutionCard";
import ProjectStrip from "@/components/projects/ProjectStrip";
import { industries, industryPath, solutionPath, solutions, startEnquiry } from "@/data/company";
import { SolutionFaq, solutionDetails } from "@/data/solution-details";
import { projectsForSolution } from "@/data/projects";
import NotFound from "@/pages/NotFound";

const SECTIONS: NavSection[] = [
  { id: "overview", label: "Overview" },
  { id: "how-it-works", label: "How it works" },
  { id: "sample", label: "Sample" },
  { id: "capabilities", label: "Capabilities" },
  { id: "technology", label: "Technology" },
  { id: "faq", label: "FAQ" },
];

// Sections sit below the navbar and the sticky section bar when jumped to
const anchor: CSSProperties = { scrollMarginTop: SECTION_OFFSET };
const pad = (n: number) => String(n).padStart(2, "0");

function FaqList({ faqs }: { faqs: SolutionFaq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q} className={`card overflow-hidden transition-colors ${isOpen ? "border-brand/30" : ""}`}>
            <h3>
              <button
                id={`sfaq-q-${i}`}
                aria-controls={`sfaq-a-${i}`}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-4 px-6 py-5 text-left"
              >
                <span className="flex-1 font-display text-lg font-bold leading-snug">{f.q}</span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${isOpen ? "rotate-45 bg-grad text-white" : "bg-raised text-ink-2"}`}>
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div
              id={`sfaq-a-${i}`}
              role="region"
              aria-labelledby={`sfaq-q-${i}`}
              className={`grid transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-ink-2">{f.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function SolutionDetail() {
  const { slug } = useParams();
  const index = solutions.findIndex((s) => s.slug === slug);
  if (index === -1 || !solutionDetails[solutions[index].slug]) return <NotFound />;
  // Keyed by slug so the sample and FAQ start fresh when moving between solutions
  return <SolutionPage key={solutions[index].slug} index={index} />;
}

function SolutionPage({ index }: { index: number }) {
  const solution = solutions[index];
  const detail = solutionDetails[solution.slug];
  const prev = solutions[(index - 1 + solutions.length) % solutions.length];
  const next = solutions[(index + 1) % solutions.length];
  const audiences = industries.filter((i) => i.solutions.includes(solution.title));
  const related = detail.related.map((r) => solutions.find((s) => s.slug === r)).filter((s): s is (typeof solutions)[number] => Boolean(s));

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: detail.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  });

  const seeSample = () => {
    const el = document.getElementById("sample");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SECTION_OFFSET + 8, behavior: "smooth" });
  };

  return (
    <PageShell title={solution.title} description={solution.summary}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <PageHero
        crumbs={[{ label: "Solutions", to: "/solutions" }, { label: solution.title }]}
        eyebrow={solution.domain}
        title={solution.title}
        lead={solution.summary}
        actions={
          <>
            <button onClick={() => startEnquiry(solution.title)} className="btn btn-primary px-7 py-3.5">
              Discuss this solution <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={seeSample} className="btn btn-secondary px-7 py-3.5">
              <MessageSquareText className="h-4 w-4" /> See a sample
            </button>
          </>
        }
        aside={
          <div className="relative pb-10 sm:pb-0 sm:pr-10">
            <div className="shadow-soft overflow-hidden rounded-[2rem] bg-raised">
              {solution.image && <img src={solution.image} alt="" width={1280} height={800} className="aspect-[4/3] w-full object-cover" />}
            </div>
            <div className="glass shadow-soft absolute -bottom-2 left-4 right-4 rounded-2xl border border-line p-4 sm:-bottom-8 sm:left-auto sm:right-0 sm:w-72">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">At a glance</p>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 shrink-0 text-brand-text" />
                  <dt className="sr-only">For</dt>
                  <dd className="font-semibold">{solution.category}</dd>
                </div>
                <div className="flex items-center gap-2.5">
                  <Package className="h-4 w-4 shrink-0 text-brand-text" />
                  <dt className="sr-only">Deliverables</dt>
                  <dd>
                    <span className="font-semibold">{solution.deliverables.length} deliverables</span>
                    <span className="text-subtle"> · {solution.capabilities.length} capabilities</span>
                  </dd>
                </div>
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 shrink-0 text-brand-text" />
                  <dt className="sr-only">Key technology</dt>
                  <dd className="truncate text-ink-2">{solution.tech.slice(0, 3).join(" · ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        }
      />

      <SectionNav sections={SECTIONS} />

      {/* Overview: the problem and what the solution is designed to change */}
      <section id="overview" style={anchor} className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <div>
            <SectionHeading
              label="The challenge"
              title={
                <>
                  Why <span className="gradient-text">{solution.title}</span> exists
                </>
              }
            >
              <p className="mt-5 text-lg leading-relaxed text-ink-2">{detail.challenge.intro}</p>
            </SectionHeading>
            <Reveal delay={80}>
              <p className="mt-8 text-[17px] leading-relaxed text-ink-2">{solution.description}</p>
            </Reveal>
          </div>
          <div className="space-y-5">
            <Reveal variant="right">
              <div className="card p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-subtle">What gets in the way today</p>
                <ul className="mt-4 space-y-3">
                  {detail.challenge.pains.map((p) => (
                    <li key={p} className="flex gap-3 text-ink">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-raised text-subtle">
                        <X className="h-3 w-3" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal variant="right" delay={100}>
              <div className="card grad-border p-6">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-text">
                  <Target className="h-4 w-4" /> Designed to improve
                </p>
                <ul className="mt-4 space-y-3">
                  {detail.designedToImprove.map((g) => (
                    <li key={g} className="flex gap-3 text-ink">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-grad text-white">
                        <Check className="h-3 w-3" />
                      </span>
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-subtle">Goals the design aims at. Each project agrees its own success measures during discovery.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works: a four-step stepper */}
      <section id="how-it-works" style={anchor} className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="How it works"
            title={
              <>
                From your content to <span className="gradient-text">everyday use.</span>
              </>
            }
          />
          <div className="relative mt-14">
            <span className="bg-grad absolute left-8 right-8 top-[2.875rem] hidden h-px opacity-40 xl:block" aria-hidden="true" />
            <ol className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {detail.howItWorks.map((step, i) => (
                <li key={step.title}>
                  <Reveal delay={i * 90} className="h-full">
                    <div className="card relative flex h-full flex-col p-6">
                      <span className="icon-tile relative h-11 w-11 font-display text-sm font-bold">{pad(i + 1)}</span>
                      <h3 className="mt-5 font-display text-lg font-bold">{step.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{step.desc}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Sample interaction */}
      <section id="sample" style={anchor} className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] items-start gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-44">
            <SectionHeading
              label="Sample"
              title={
                <>
                  See it <span className="gradient-text">in action.</span>
                </>
              }
            >
              <p className="mt-5 text-lg leading-relaxed text-ink-2">
                A short, scripted walk-through of a typical moment with {solution.title}. Play it, step through it turn by turn, or replay it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-subtle">
                The people, documents and data in this sample are invented for illustration. In a real project the content comes from your own material.
              </p>
            </SectionHeading>
          </div>
          <Reveal delay={100}>
            <SampleExchange title={detail.sample.title} context={detail.sample.context} turns={detail.sample.turns} />
          </Reveal>
        </div>
      </section>

      {/* Capabilities and deliverables */}
      <section id="capabilities" style={anchor} className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Capabilities"
            title={
              <>
                What it does, <span className="gradient-text">what you receive.</span>
              </>
            }
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
            <ol className="grid gap-4 sm:grid-cols-2">
              {solution.capabilities.map((c, i) => (
                <li key={c}>
                  <Reveal delay={i * 70} className="h-full">
                    <div className="card card-hover h-full p-6">
                      <span className="gradient-text font-display text-2xl font-extrabold tabular-nums">{pad(i + 1)}</span>
                      <p className="mt-3 leading-relaxed text-ink">{c}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal variant="right" delay={120}>
              <div className="card h-full p-6 sm:p-7">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                  <Package className="h-4 w-4 text-brand-text" /> You receive
                </p>
                <ul className="mt-5 divide-y divide-line">
                  {solution.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-text">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="font-medium">{d}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-subtle">
                  Plus the source code, documentation and training your team needs to run it.{" "}
                  <Link to="/approach" className="u-link font-semibold text-brand-text">
                    How we deliver
                  </Link>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Technology, integrations and who it's for */}
      <section id="technology" style={anchor} className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Technology"
            title={
              <>
                Fits the systems <span className="gradient-text">you already run.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              Model-agnostic and built on open standards, so it can be maintained by us or by your own engineers.{" "}
              <Link to="/technology" className="u-link font-semibold text-brand-text">
                Our full stack
              </Link>
            </p>
          </SectionHeading>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="card h-full p-6 sm:p-7">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                  <Layers className="h-4 w-4 text-brand-text" /> Built with
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {solution.tech.map((t) => (
                    <li key={t} className="chip px-3 py-1.5 text-[13px]">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={90} className="h-full">
              <div className="card h-full p-6 sm:p-7">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                  <Plug className="h-4 w-4 text-brand-text" /> Works with
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {detail.integrations.map((t) => (
                    <li key={t} className="chip px-3 py-1.5 text-[13px]">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {audiences.length > 0 && (
            <div className="mt-16">
              <h3 className="font-display text-2xl font-bold tracking-tight">Who it's for</h3>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {audiences.map((a, i) => (
                  <li key={a.key}>
                    <Reveal delay={i * 70} className="h-full">
                      <Link to={industryPath(a)} className="card card-hover group flex h-full items-center gap-4 p-3 pr-4">
                        <img src={a.image} alt="" loading="lazy" width={64} height={64} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block font-display font-bold leading-tight">{a.title}</span>
                          <span className="mt-0.5 block truncate text-xs text-subtle">{a.focus}</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-subtle transition-colors group-hover:text-brand-text" />
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={anchor} className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            label="FAQ"
            title={
              <>
                Questions about <span className="gradient-text">{solution.title}</span>
              </>
            }
          >
            <p className="mt-5 text-lg leading-relaxed text-ink-2">The things teams ask most before they start.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => startEnquiry(solution.title)} className="btn btn-secondary px-6 py-3 text-sm">
                Ask your own question <ArrowUpRight className="h-4 w-4" />
              </button>
              <Link to="/faq" className="btn px-4 py-3 text-sm text-brand-text hover:bg-raised">
                All questions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </SectionHeading>
          <Reveal delay={80}>
            <FaqList faqs={detail.faqs} />
          </Reveal>
        </div>
      </section>

      <ProjectStrip
        list={projectsForSolution(solution.slug)}
        title={
          <>
            Built on <span className="gradient-text">{solution.title}.</span>
          </>
        }
        lead="Projects that started from this blueprint, then grew into something specific to the client."
      />

      {/* Previous / next and related */}
      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <nav aria-label="More solutions" className="grid gap-4 sm:grid-cols-2">
            {[
              { s: prev, dir: "Previous", Icon: ArrowLeft },
              { s: next, dir: "Next", Icon: ArrowRight },
            ].map(({ s, dir, Icon }) => (
              <Link
                key={dir}
                to={solutionPath(s)}
                className={`card card-hover group flex items-center gap-4 p-3 ${dir === "Next" ? "flex-row-reverse text-right" : ""}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-colors group-hover:border-transparent group-hover:bg-grad group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-subtle">{dir}</span>
                  <span className="block truncate font-display text-lg font-bold">{s.title}</span>
                </span>
                {s.image && <img src={s.image} alt="" loading="lazy" width={96} height={64} className="hidden h-14 w-20 shrink-0 rounded-xl object-cover sm:block" />}
              </Link>
            ))}
          </nav>

          {related.length > 0 && (
            <div className="mt-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-3xl font-bold tracking-tight">Often paired with</h2>
                <Link to="/solutions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                  All {solutions.length} solutions <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((s, i) => (
                  <Reveal key={s.slug} delay={i * 80} className="h-full">
                    <SolutionCard solution={s} compact />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        kicker={`Every ${solution.title} project starts with a free discovery call.`}
        title={<>Make {solution.title} yours.</>}
        topic={solution.title}
        primaryLabel="Discuss this solution"
        secondary={{ label: "How we work", to: "/approach" }}
      />
    </PageShell>
  );
}
