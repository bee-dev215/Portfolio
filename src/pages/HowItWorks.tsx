import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import Process from "@/components/site/Process";
import StepDetails from "@/components/site/StepDetails";
import Workspace from "@/components/site/Workspace";
import Pay from "@/components/site/Pay";
import Faq from "@/components/site/Faq";
import { readyIcons } from "@/components/site/icons";
import { company, readyList, steps } from "@/data/company";

export default function HowItWorks() {
  return (
    <PageShell
      title="How it works"
      description={`Five steps from your first visit to your first payday at ${company.name}: apply online, a short skills check, an interview, paid onboarding, and then you start working and earning.`}
    >
      <PageHero
        crumbs={[{ label: "How it works" }]}
        eyebrow="Five steps · All online"
        title={
          <>
            Your path to a <span className="gradient-text">remote career.</span>
          </>
        }
        lead={`Five clear steps take you from your first visit to your first payday. No fees, no guesswork — and a real person at every step, with an answer within ${company.reviewTime}.`}
        actions={
          <>
            <Link to="/apply" className="btn btn-primary px-7 py-4 text-base">
              Start your application <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/roles" className="btn btn-secondary px-7 py-4 text-base">
              Explore roles
            </Link>
          </>
        }
        aside={
          <ol className="card shadow-soft relative space-y-1 p-5 sm:p-7">
            <span className="absolute bottom-10 left-[41px] top-10 w-px bg-line sm:left-[49px]" aria-hidden="true" />
            {steps.map((s, i) => (
              <li key={s.id}>
                <a href={`#step-${s.id}`} className="group relative flex items-center gap-4 rounded-2xl p-2.5 transition-colors hover:bg-raised/60">
                  <span className={`relative z-[1] grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${i === steps.length - 1 ? "bg-volt text-[#0b1020]" : "bg-grad text-white"}`}>
                    {i === steps.length - 1 ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display font-bold">{s.name}</span>
                    <span className="block text-sm text-subtle">{s.time}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        }
      />

      {/* Before you start */}
      <section className="px-5 pb-24 pt-4 sm:px-8 lg:pb-32">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Before you start"
            title={
              <>
                What to <span className="gradient-text">have ready.</span>
              </>
            }
          >
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">Nothing fancy. If you're reading this on a laptop with a decent connection, you're most of the way there.</p>
          </SectionHeading>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {readyList.map((r, i) => {
              const Icon = readyIcons[r.key];
              return (
                <li key={r.key}>
                  <Reveal delay={i * 70} className="h-full">
                    <div className="card card-hover h-full p-7">
                      <span className="icon-tile h-12 w-12">
                        <Icon className="h-[22px] w-[22px]" />
                      </span>
                      <h3 className="mt-6 font-display text-xl font-bold">{r.title}</h3>
                      <p className="mt-2 leading-relaxed text-ink-2">{r.desc}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Process more={false} />
      <StepDetails />
      <Workspace />
      <Pay />
      <Faq />
      <CtaBand title="Ready when you are." secondary={{ label: "Explore roles", to: "/roles" }} />
    </PageShell>
  );
}
