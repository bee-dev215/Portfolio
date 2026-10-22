import { ArrowLeft, ArrowRight, ArrowUpRight, Check, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServiceArt from "@/components/services/ServiceArt";
import ServiceCard from "@/components/services/ServiceCard";
import SolutionCards from "@/components/services/SolutionCards";
import { serviceIcons } from "@/components/site/icons";
import { scrollToId, servicePath, services, stackGroups, startEnquiry } from "@/data/company";
import { serviceDetails, serviceGroups } from "@/data/service-details";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index];
  const detail = serviceDetails[slug];
  if (!service || !detail) return <NotFound />;

  const group = serviceGroups.find((g) => g.keys.includes(service.key));
  const prev = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];
  const related = detail.related.map((r) => services.find((s) => s.slug === r)).filter((s): s is (typeof services)[number] => Boolean(s));
  const tools = stackGroups.filter((g) => detail.stack.includes(g.title));

  return (
    <PageShell title={service.title} description={service.desc}>
      <PageHero
        crumbs={[{ label: "Services", to: "/services" }, { label: service.title }]}
        eyebrow={group ? `Services · ${group.name}` : "Services"}
        title={service.title}
        lead={service.desc}
        aside={<ServiceArt service={service} />}
        actions={
          <>
            <button onClick={() => startEnquiry(service.title)} className="btn btn-primary px-7 py-3.5">
              Discuss your project <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => scrollToId("included")} className="btn btn-secondary px-7 py-3.5">
              What's included
            </button>
          </>
        }
      >
        <ul className="flex flex-wrap gap-2">
          {service.includes.map((it) => (
            <li key={it} className="chip px-3 py-1.5 text-[13px]">
              {it}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Overview */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <SectionHeading
              label="Overview"
              title={
                <>
                  What this service <span className="gradient-text">is for.</span>
                </>
              }
            />
            <Reveal delay={80}>
              <p className="mt-6 text-lg leading-relaxed text-ink-2">{detail.intro}</p>
            </Reveal>
          </div>
          <Reveal delay={120} variant="right">
            <div className="card p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Designed to deliver</p>
              <ul className="mt-5 space-y-4">
                {detail.outcomes.map((o) => (
                  <li key={o} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-grad text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="leading-relaxed text-ink">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Included */}
      <section id="included" className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="What's included"
            title={
              <>
                What you get <span className="gradient-text">at the end.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">The usual deliverables. The exact scope is agreed in a fixed proposal after discovery.</p>
          </SectionHeading>
          <div className={`mt-12 grid gap-5 ${detail.included.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
            {detail.included.map((g, i) => (
              <Reveal key={g.title} delay={i * 80} className="h-full">
                <div className="card h-full p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft font-display text-sm font-bold text-brand-text">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-lg font-bold">{g.title}</h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-[15px] text-ink-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How we run it */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="How we run it"
            title={
              <>
                Four steps, <span className="gradient-text">no surprises.</span>
              </>
            }
          />
          <ol className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <span className="bg-grad absolute left-6 right-6 top-6 hidden h-px opacity-40 lg:block" aria-hidden="true" />
            {detail.steps.map((st, i) => (
              <li key={st.title}>
                <Reveal delay={i * 90} className="h-full">
                  <div className="relative h-full">
                    <span className="icon-tile relative h-12 w-12 font-display text-base font-extrabold">{i + 1}</span>
                    <h3 className="mt-5 font-display text-lg font-bold">{st.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-2">{st.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal delay={200}>
            <Link to="/approach" className="u-link mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
              How every engagement runs <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Team & tools */}
      <section className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              label="Who's involved"
              title={
                <>
                  The people <span className="gradient-text">on the work.</span>
                </>
              }
            />
            <ul className="mt-10 space-y-3">
              {detail.roles.map((r, i) => (
                <li key={r.role}>
                  <Reveal delay={i * 60}>
                    <div className="card flex items-center gap-4 p-4 sm:p-5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-text">
                        <UserRound className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-display font-bold">{r.role}</p>
                        <p className="text-sm text-ink-2">{r.does}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal>
              <Link to="/team" className="u-link mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                Meet the team <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div>
            <SectionHeading
              label="Tools"
              title={
                <>
                  What we <span className="gradient-text">reach for.</span>
                </>
              }
            />
            <div className="mt-10 space-y-4">
              {tools.map((g, i) => (
                <Reveal key={g.title} delay={i * 60}>
                  <div className="card p-5">
                    <p className="font-display text-sm font-bold">{g.title}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {g.items.map((t) => (
                        <li key={t} className="chip px-3 py-1.5 text-[13px]">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <Link to="/technology" className="u-link mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                How we choose technology <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Solutions */}
      {detail.solutions.length > 0 && (
        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-[1240px]">
            <SectionHeading
              label="Solutions"
              title={
                <>
                  Where this service <span className="gradient-text">shows up.</span>
                </>
              }
            >
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">Solution blueprints that lean on this service — a working starting point we adapt to you.</p>
            </SectionHeading>
            <div className="mt-12">
              <SolutionCards titles={detail.solutions} />
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              label="Questions"
              title={
                <>
                  Asked <span className="gradient-text">and answered.</span>
                </>
              }
            >
              <button onClick={() => startEnquiry(service.title)} className="btn btn-secondary mt-8 px-6 py-3 text-sm">
                Ask your own <ArrowUpRight className="h-4 w-4" />
              </button>
            </SectionHeading>
          </div>
          <FaqAccordion faqs={detail.faqs} />
        </div>
      </section>

      {/* Related services + previous / next */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Often paired with"
            title={
              <>
                Services that <span className="gradient-text">work well together.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s, i) => (
              <Reveal key={s.key} delay={i * 70} className="h-full">
                <ServiceCard service={s} compact />
              </Reveal>
            ))}
          </div>

          <nav aria-label="More services" className="mt-14 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
            {[
              { s: prev, label: "Previous service", dir: "prev" as const },
              { s: next, label: "Next service", dir: "next" as const },
            ].map(({ s, label, dir }) => {
              const Icon = serviceIcons[s.key];
              return (
                <Link
                  key={dir}
                  to={servicePath(s)}
                  className={`card card-hover group flex items-center gap-4 p-5 ${dir === "next" ? "sm:flex-row-reverse sm:text-right" : ""}`}
                >
                  {dir === "prev" ? (
                    <ArrowLeft className="h-5 w-5 shrink-0 text-subtle transition-transform group-hover:-translate-x-0.5 group-hover:text-brand-text" />
                  ) : (
                    <ArrowRight className="h-5 w-5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand-text" />
                  )}
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-subtle">{label}</span>
                    <span className="block truncate font-display font-bold">{s.title}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <CtaBand title={`${service.title}: let's talk about your project.`} topic={service.title} secondary={{ label: "How we work", to: "/approach" }} />
    </PageShell>
  );
}
