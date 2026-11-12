import { CalendarRange, Check, FileCheck2, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import ServiceCard from "@/components/services/ServiceCard";
import { serviceIcons } from "@/components/site/icons";
import { bookCall, company, offer, servicePath, services, solutionsFor } from "@/data/company";

const engagements = [
  {
    icon: FlaskConical,
    title: "Two-week prototype",
    desc: `${offer.badge}. A working prototype on your own data, so you can judge the idea before you commit to a build.`,
  },
  {
    icon: FileCheck2,
    title: "Fixed-scope build",
    desc: "A proposal with milestones and acceptance criteria agreed before the build starts, then a working demo every week.",
  },
  {
    icon: CalendarRange,
    title: "Dedicated team & support",
    desc: "Senior engineers on a monthly plan for new features, improvements and support, sized to the system.",
  },
];

const everyService = ["Code, cloud accounts and docs in your name", "A working demo every week during the build", "Security and privacy planned from day one", "Training and handover for your team"];

export default function ServicesIndex() {
  return (
    <PageShell
      title="Services"
      description={`${company.name} services: AI agents & assistants, AI workflow automation, and custom software & SaaS.`}
    >
      <PageHero
        crumbs={[{ label: "Services" }]}
        eyebrow="Services"
        title={
          <>
            Three ways to take <span className="gradient-text">busywork off your team.</span>
          </>
        }
        lead={company.intro}
        actions={
          <>
            <button onClick={() => bookCall()} className="btn btn-primary px-7 py-3.5">
              Book a call
            </button>
            <Link to="/approach" className="btn btn-secondary px-7 py-3.5">
              How we work
            </Link>
          </>
        }
        aside={
          <div className="card shadow-soft rounded-3xl p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">At a glance</p>
            <ul className="mt-4 space-y-2">
              {services.map((sv) => {
                const Icon = serviceIcons[sv.key];
                return (
                  <li key={sv.key}>
                    <Link to={servicePath(sv)} className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-raised">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text transition-colors group-hover:bg-grad group-hover:text-white">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display font-bold leading-snug text-ink">{sv.title}</span>
                        <span className="block truncate text-[13px] text-subtle">{solutionsFor(sv.key).map((x) => x.title).join(" · ") || sv.includes.join(" · ")}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
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
                  From a two-week prototype <span className="gradient-text">to software you own.</span>
                </>
              }
            />
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {services.map((sv, i) => (
              <Reveal key={sv.key} delay={i * 80} className="h-full">
                <ServiceCard service={sv} />
              </Reveal>
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
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">Every service can be used on its own or combined — most projects mix AI with the software around it. Each project starts with a call and a prototype; after launch, support is there if you want it.</p>
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
                See how an engagement runs
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="pt-20 lg:pt-28">
        <CtaBand
          title="Not sure which service you need?"
          kicker="Tell us the task. We'll suggest where to start."
          primaryLabel="Book a call"
          secondary={{ label: "Browse solutions", to: "/solutions" }}
        />
      </div>
    </PageShell>
  );
}
