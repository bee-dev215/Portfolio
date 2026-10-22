import { ArrowRight, ArrowUpRight, Check, Plug, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServiceCard from "@/components/services/ServiceCard";
import SolutionCards from "@/components/services/SolutionCards";
import DayToggle from "@/components/industries/DayToggle";
import ProjectStrip from "@/components/projects/ProjectStrip";
import { industries, industryPath, scrollToId, services, startEnquiry } from "@/data/company";
import { industryDetails } from "@/data/industry-details";
import { usePhotos } from "@/hooks/use-photos";
import NotFound from "./NotFound";

// Lower-cases a title's first word for use mid-sentence, leaving names like "K-12" and "EdTech" alone
const midSentence = (t: string) => (/^[A-Z][a-z]*\s/.test(t) ? t[0].toLowerCase() + t.slice(1) : t);

export default function IndustryDetail() {
  const photos = usePhotos();
  const { slug = "" } = useParams();
  const industry = industries.find((i) => i.key === slug);
  const detail = industryDetails[slug];
  if (!industry || !detail) return <NotFound />;

  const relevant = detail.services.map((k) => services.find((s) => s.key === k)).filter((s): s is (typeof services)[number] => Boolean(s));
  const others = industries.filter((i) => i.key !== industry.key);

  return (
    <PageShell title={industry.title} description={industry.desc}>
      <PageHero
        crumbs={[{ label: "Who we serve", to: "/industries" }, { label: industry.title }]}
        eyebrow={industry.focus}
        title={industry.title}
        lead={industry.desc}
        actions={
          <>
            <button onClick={() => startEnquiry(industry.title)} className="btn btn-primary px-7 py-3.5">
              Discuss your project <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => scrollToId("use-cases")} className="btn btn-secondary px-7 py-3.5">
              See use cases
            </button>
          </>
        }
        aside={
          <div className="relative pb-10 sm:pb-0">
            <div className="shadow-soft overflow-hidden rounded-[2rem] border border-line bg-raised">
              <img src={photos.src(industry.image)} alt={photos.alt(industry.image, industry.imageAlt)} width={740} height={555} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="glass shadow-soft absolute -bottom-2 right-4 max-w-[16rem] rounded-2xl border border-line p-4 sm:-bottom-8 sm:-left-6 sm:right-auto">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">Where teams often start</p>
              <ul className="mt-2.5 space-y-1.5">
                {industry.work.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-sm font-medium">
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand-text" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      {/* Challenges */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              label="The challenge"
              title={
                <>
                  What gets in the way <span className="gradient-text">today.</span>
                </>
              }
            />
            <Reveal delay={80}>
              <p className="mt-6 text-lg leading-relaxed text-ink-2">{detail.intro}</p>
            </Reveal>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {detail.challenges.map((c, i) => (
              <Reveal key={c.title} delay={i * 70} className="h-full">
                <div className="card h-full p-6">
                  <span className="font-display text-sm font-extrabold text-brand-text">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-lg font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we build */}
      <section className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="What we build"
            title={
              <>
                Solutions for <span className="gradient-text">{midSentence(industry.title)}.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">Working blueprints we adapt to your learners, content and platform.</p>
          </SectionHeading>
          <div className="mt-12">
            <SolutionCards titles={industry.solutions} />
          </div>

          <Reveal>
            <p className="mt-16 text-xs font-semibold uppercase tracking-wider text-subtle">The services we bring</p>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relevant.map((s, i) => (
              <Reveal key={s.key} delay={i * 70} className="h-full">
                <ServiceCard service={s} compact />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Use cases"
            title={
              <>
                Where AI <span className="gradient-text">earns its place.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {detail.useCases.map((u, i) => (
              <Reveal key={u.title} delay={(i % 3) * 70} className="h-full">
                <div className="card card-hover h-full p-6">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-text">
                    <Check className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{u.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{u.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Day in the life */}
      <section className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            label="Before & after"
            title={
              <>
                The same day, <span className="gradient-text">with better tools.</span>
              </>
            }
          >
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">Switch between today and with AI support to see where the time and attention go.</p>
          </SectionHeading>
          <Reveal delay={100} variant="right">
            <DayToggle day={detail.day} />
          </Reveal>
        </div>
      </section>

      {/* Integrations & policy */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-2 lg:gap-16">
          {[
            { label: "Integrations & standards", title: "Fits the systems you run.", icon: Plug, items: detail.integrations },
            { label: "Privacy & policy", title: "Designed around your rules.", icon: ShieldCheck, items: detail.policies },
          ].map((col) => (
            <div key={col.label}>
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="icon-tile h-11 w-11">
                    <col.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-subtle">{col.label}</p>
                    <h2 className="font-display text-2xl font-bold tracking-tight">{col.title}</h2>
                  </div>
                </div>
              </Reveal>
              <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface">
                {col.items.map((it) => (
                  <li key={it.name} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6">
                    <span className="shrink-0 font-display text-[15px] font-bold sm:w-44">{it.name}</span>
                    <span className="text-sm leading-relaxed text-ink-2">{it.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Reveal>
          <p className="mx-auto mt-8 max-w-[1240px] text-sm text-subtle">
            Requirements are mapped with your own compliance, data protection and safeguarding teams during discovery.{" "}
            <Link to="/responsible-ai" className="u-link font-semibold text-brand-text">
              Our responsible-AI commitments
            </Link>
          </p>
        </Reveal>
      </section>

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
              <button onClick={() => startEnquiry(industry.title)} className="btn btn-secondary mt-8 px-6 py-3 text-sm">
                Ask your own <ArrowUpRight className="h-4 w-4" />
              </button>
            </SectionHeading>
          </div>
          <FaqAccordion faqs={detail.faqs} />
        </div>
      </section>

      <ProjectStrip
        match={(p) => p.audience === industry.key}
        title={
          <>
            Built for {midSentence(industry.title)}, <span className="gradient-text">in use today.</span>
          </>
        }
        lead="Recent projects for organisations like yours. Clients are described, not named."
      />

      {/* Other audiences */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              label="Also building for"
              title={
                <>
                  Other people <span className="gradient-text">who teach.</span>
                </>
              }
            />
            <Reveal>
              <Link to="/industries" className="btn btn-secondary shrink-0 px-6 py-3 text-sm">
                All audiences <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {others.map((o, i) => (
              <Reveal key={o.key} delay={i * 80} className="h-full">
                <Link to={industryPath(o)} className="card card-hover group relative block overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-raised">
                    <img src={photos.src(o.image)} alt="" loading="lazy" width={400} height={300} className="img-zoom h-full w-full object-cover" />
                    <div className="photo-fade absolute inset-0" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                      <div>
                        <p className="font-display text-xl font-bold leading-tight">{o.title}</p>
                        <p className="mt-0.5 text-xs text-white/80">{o.focus}</p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={`Let's build something for ${midSentence(industry.title)}.`} topic={industry.title} secondary={{ label: "How we work", to: "/approach" }} />
    </PageShell>
  );
}
