import { useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarRange, Check, FileCheck2, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import ServiceCard from "@/components/services/ServiceCard";
import { serviceIcons } from "@/components/site/icons";
import { company, servicePath, services, startEnquiry } from "@/data/company";
import { ServiceGroup, serviceGroups } from "@/data/service-details";

const byKey = (key: string) => services.find((s) => s.key === key)!;

const engagements = [
  {
    icon: FileCheck2,
    title: "Fixed-scope project",
    desc: "A short discovery, then a proposal with milestones and acceptance criteria agreed before the build starts.",
  },
  {
    icon: CalendarRange,
    title: "Retainer",
    desc: "Ongoing improvement, support and new features, sized to your term calendar or business cycle.",
  },
  {
    icon: GraduationCap,
    title: "Team training",
    desc: "AI Academy programmes priced per cohort — on their own, or alongside a build.",
  },
];

const everyService = ["Your code, data and IP stay yours", "Evaluation on every release", "Privacy and safety planned from day one", "Training and hand-over for your team"];

export default function ServicesIndex() {
  const [filter, setFilter] = useState<ServiceGroup | "All">("All");
  const shown = filter === "All" ? serviceGroups : serviceGroups.filter((g) => g.name === filter);

  return (
    <PageShell
      title="Services"
      description={`${company.name} services: AI product engineering, LLM & RAG, learning platform integration, analytics, evaluation & safety, speech AI, learning design and AI training.`}
    >
      <PageHero
        crumbs={[{ label: "Services" }]}
        eyebrow="Services"
        title={
          <>
            {services.length} ways we help you <span className="gradient-text">ship AI for learning.</span>
          </>
        }
        lead={company.intro}
        actions={
          <>
            <button onClick={() => startEnquiry()} className="btn btn-primary px-7 py-3.5">
              Start a project <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/approach" className="btn btn-secondary px-7 py-3.5">
              How we work
            </Link>
          </>
        }
        aside={
          <div className="card shadow-soft rounded-3xl p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">At a glance</p>
            <div className="mt-4 space-y-5">
              {serviceGroups.map((g) => (
                <div key={g.name}>
                  <p className="font-display text-sm font-bold">{g.name}</p>
                  <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                    {g.keys.map((k) => {
                      const s = byKey(k);
                      const Icon = serviceIcons[k];
                      return (
                        <li key={k}>
                          <Link to={servicePath(s)} className="group flex items-center gap-2.5 rounded-xl p-2 text-sm text-ink-2 transition-colors hover:bg-raised hover:text-ink">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-text transition-colors group-hover:bg-grad group-hover:text-white">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="leading-snug">{s.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              label="All services"
              title={
                <>
                  From first prototype <span className="gradient-text">to trained team.</span>
                </>
              }
            />
            <Reveal delay={80}>
              <div className="-mx-5 flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 sm:mx-0" role="group" aria-label="Filter services">
                {(["All", ...serviceGroups.map((g) => g.name)] as const).map((name) => (
                  <button
                    key={name}
                    aria-pressed={filter === name}
                    onClick={() => setFilter(name)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      filter === name ? "bg-grad text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]" : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div key={filter} className="mt-12 space-y-14">
            {shown.map((g) => (
              <div key={g.name}>
                <Reveal>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-4">
                    <h3 className="font-display text-xl font-bold">{g.name}</h3>
                    <p className="text-sm text-ink-2">{g.desc}</p>
                    <span className="ml-auto text-xs font-medium text-subtle">
                      {g.keys.length} {g.keys.length === 1 ? "service" : "services"}
                    </span>
                  </div>
                </Reveal>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {g.keys.map((k, i) => (
                    <Reveal key={k} delay={(i % 2) * 80} className="h-full">
                      <ServiceCard service={byKey(k)} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              label="Engagements"
              title={
                <>
                  Three ways <span className="gradient-text">to work with us.</span>
                </>
              }
            >
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">Every service can be bought on its own or combined. Most clients start with a project and stay on a retainer.</p>
            </SectionHeading>
            <Reveal delay={100}>
              <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-subtle">Included in every service</p>
              <ul className="mt-4 space-y-3">
                {everyService.map((e) => (
                  <li key={e} className="flex items-center gap-3 text-ink">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-text">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="space-y-4">
            {engagements.map((e, i) => (
              <Reveal key={e.title} delay={i * 80} variant="right">
                <div className="card flex gap-5 p-6">
                  <span className="icon-tile h-12 w-12 shrink-0">
                    <e.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{e.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-2">{e.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={260}>
              <Link to="/approach" className="u-link inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-brand-text">
                See how an engagement runs <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="pt-20 lg:pt-28">
        <CtaBand title="Not sure which service you need?" kicker="Tell us the problem — we'll suggest where to start." secondary={{ label: "Browse solutions", to: "/solutions" }} />
      </div>
    </PageShell>
  );
}
