import { CSSProperties } from "react";
import { ArrowRight, Compass, Globe2, Target, UserCheck, Users, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import ForCompanies from "@/components/site/ForCompanies";
import HowWeWork from "@/components/site/HowWeWork";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import { roleIcons, valueIcons } from "@/components/site/icons";
import { company, rolePath, roles, values } from "@/data/company";

const tiles = [
  { icon: Globe2, title: "Remote-first", desc: "Every role, every step, fully online." },
  { icon: Users, title: `${roles.length} roles, one team`, desc: "Support, engineering, ops and growth." },
  { icon: UserCheck, title: "Personal review", desc: "A person reads every application." },
  { icon: Wallet, title: "Paid on time", desc: "Twice a month, with a clear payslip." },
];

export default function About() {
  return (
    <PageShell title="About us" description={`${company.name} is a remote-first team hiring capable people worldwide. ${company.mission}`}>
      <PageHero
        crumbs={[{ label: "About us" }]}
        eyebrow="Our mission & story"
        title={
          <>
            Great work, from <span className="gradient-text">anywhere.</span>
          </>
        }
        lead={company.mission}
        actions={
          <>
            <Link to="/roles" className="btn btn-primary px-7 py-4 text-base">
              Explore roles <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/how-it-works" className="btn btn-secondary px-7 py-4 text-base">
              How it works
            </Link>
          </>
        }
        aside={
          <div className="relative">
            <div data-scroll className="aspect-[4/3] overflow-hidden rounded-[2rem] border border-line bg-raised shadow-soft">
              <img src="/images/remote/role-growth.webp" alt="" width={1280} height={800} className="parallax-img h-full w-full object-cover" />
            </div>
            <div data-scroll className="absolute -bottom-8 -left-2 w-[46%] overflow-hidden rounded-[1.4rem] border-4 border-surface bg-raised shadow-soft sm:-left-8">
              <img src="/images/remote/why-hours.webp" alt="" width={1280} height={800} className="parallax-img aspect-[4/3] h-full w-full object-cover [--parallax:12%]" />
            </div>
          </div>
        }
      />

      {/* Who we are */}
      <section className="px-5 pb-24 pt-10 sm:px-8 lg:pb-32">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <SectionHeading
            label="Who we are"
            title={
              <>
                Talent is everywhere. <span className="gradient-text">Opportunity should be too.</span>
              </>
            }
          />
          <Reveal delay={100}>
            <div className="space-y-5 text-lg leading-relaxed text-ink-2">
              {company.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
        <ul className="mx-auto mt-14 grid max-w-[1240px] grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <li key={t.title}>
              <Reveal delay={i * 70} className="h-full">
                <div className="card spotlight h-full p-6">
                  <t.icon className="h-6 w-6 text-brand-text" />
                  <p className="mt-4 font-display text-lg font-bold">{t.title}</p>
                  <p className="mt-1 text-sm text-subtle">{t.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Vision & mission */}
      <section className="px-5 pb-24 sm:px-8 lg:pb-32">
        <div className="mx-auto grid max-w-[1240px] gap-5 md:grid-cols-2">
          {[
            { icon: Compass, k: "Our vision", v: company.vision },
            { icon: Target, k: "Our mission", v: company.mission },
          ].map((x, i) => (
            <Reveal key={x.k} delay={i * 100} variant="scale" className="h-full">
              <div className="on-dark relative h-full overflow-hidden rounded-[2rem] bg-canvas p-8 text-ink shadow-soft sm:p-12">
                <div className="mesh pointer-events-none absolute inset-0" aria-hidden="true" />
                <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-volt">
                    <x.icon className="h-4 w-4" /> {x.k}
                  </span>
                  <p className="mt-5 text-balance font-display text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-tight">{x.v}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="band px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            center
            label="Our values"
            title={
              <>
                What we <span className="gradient-text">stand for.</span>
              </>
            }
          />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = valueIcons[v.key];
              return (
                <li key={v.key}>
                  <Reveal delay={i * 80} className="h-full">
                    <div className="card card-hover h-full p-7">
                      <span className="icon-tile h-12 w-12">
                        <Icon className="h-[22px] w-[22px]" />
                      </span>
                      <h3 className="mt-6 font-display text-xl font-bold">{v.title}</h3>
                      <p className="mt-2 leading-relaxed text-ink-2">{v.desc}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <HowWeWork />

      {/* Join the team */}
      <section className="band px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Join the team"
            title={
              <>
                {roles.length} ways to <span className="gradient-text">be part of it.</span>
              </>
            }
          />
          {/* Every row of cards shares one height, so a title that wraps doesn't make its card stand out */}
          <ul className="stagger is-in mt-12 grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((r, i) => {
              const Icon = roleIcons[r.key];
              return (
                <li key={r.key} className="h-full" style={{ "--i": i } as CSSProperties}>
                  <Link to={rolePath(r)} className="card card-hover group flex h-full min-h-[88px] items-center gap-4 p-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-text transition-colors group-hover:bg-grad group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-semibold leading-tight">{r.title}</span>
                      <span className="mt-1 block truncate text-sm text-subtle">{r.category}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-subtle" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ForCompanies />
      <CtaBand title="Join us — from wherever you are." secondary={{ label: "How it works", to: "/how-it-works" }} />
    </PageShell>
  );
}
