import { ClipboardCheck, FileText, Gift, GitBranch, KeyRound, Kanban, LucideIcon, NotebookPen, Presentation, ScrollText, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Process from "@/components/site/Process";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import PageSection from "@/components/company/PageSection";
import EngagementModels from "@/components/company/EngagementModels";
import HandoverChecklist from "@/components/company/HandoverChecklist";
import { bookCall, company, offer, phases } from "@/data/company";
import { inTheLoop, isFreePhase, needFromYou } from "@/data/company-pages";

const needIcons: LucideIcon[] = [UserCheck, Users, FileText, ShieldCheck, KeyRound];
const loopIcons: LucideIcon[] = [Presentation, NotebookPen, Kanban, ScrollText, ClipboardCheck, GitBranch];

function PhaseSummary() {
  return (
    <div className="card shadow-soft rounded-3xl p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-subtle">At a glance</p>
      <ol className="relative mt-5 space-y-1">
        <span className="bg-grad absolute bottom-5 left-[17px] top-5 w-[2px] opacity-40" aria-hidden="true" />
        {phases.map((p, i) => (
          <li key={p.id} className="relative flex items-center gap-4 py-2">
            <span className="bg-grad relative z-[1] grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-sm font-bold text-white">{i + 1}</span>
            <span>
              <span className="flex items-center gap-2 font-display font-bold">
                {p.name}
                {isFreePhase(p) && (
                  <span className="chip border-sun/30 bg-sun/10 px-2 py-0.5 text-[11px] font-semibold text-ink">
                    <Gift className="h-3 w-3 text-sun" /> Free
                  </span>
                )}
              </span>
              <span className="block text-sm text-subtle">{p.title}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-line pt-5 text-sm text-ink-2">{company.engagements}</p>
    </div>
  );
}

export default function Approach() {
  return (
    <PageShell title="How we work" description={`How ${company.name} runs a project: ${phases.length} phases from a free call and a two-week prototype to production and support, three ways to engage, and what you receive at handover.`}>
      <PageHero
        crumbs={[{ label: "How we work" }]}
        eyebrow="Approach"
        title={
          <>
            From a free call <span className="gradient-text">to software you use.</span>
          </>
        }
        lead="Short phases, working software at every step and decisions written down. The first two weeks are on us, so you see it working before you commit to anything."
        actions={
          <>
            <button onClick={() => bookCall()} className="btn btn-primary px-7 py-3.5">
              Book a call
            </button>
            <a href="#engage" className="btn btn-secondary px-7 py-3.5">
              Ways to engage
            </a>
          </>
        }
        aside={<PhaseSummary />}
      />

      <Process more={false} />

      {/* Engagement models */}
      <PageSection id="engage">
        <SectionHeading
          label="Ways to engage"
          title={
            <>
              Three ways <span className="gradient-text">to work together.</span>
            </>
          }
        >
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">Most work starts with the free prototype, becomes a fixed-scope build if it proves itself, and moves to a dedicated team or monthly retainer once it's live.</p>
        </SectionHeading>
        <EngagementModels />
      </PageSection>

      {/* What we need */}
      <PageSection band>
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            label="Your side"
            title={
              <>
                What we need <span className="gradient-text">from you.</span>
              </>
            }
          >
            <p className="mt-5 text-lg leading-relaxed text-ink-2">Not much — but these five things make the difference between a project that ships and one that stalls.</p>
          </SectionHeading>
          <ol className="grid gap-4 sm:grid-cols-2">
            {needFromYou.map((n, i) => {
              const Icon = needIcons[i % needIcons.length];
              return (
                <li key={n.title} className={i === needFromYou.length - 1 && needFromYou.length % 2 ? "sm:col-span-2" : ""}>
                  <Reveal delay={i * 70} className="card h-full p-6">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-text">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold">{n.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{n.desc}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </PageSection>

      {/* In the loop + handover */}
      <PageSection>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
          <div>
            <SectionHeading
              label="Visibility"
              title={
                <>
                  How we keep you <span className="gradient-text">in the loop.</span>
                </>
              }
            />
            <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {inTheLoop.map((l, i) => {
                const Icon = loopIcons[i % loopIcons.length];
                return (
                  <li key={l.title}>
                    <Reveal delay={i * 60} className="flex gap-4">
                      <span className="icon-tile h-10 w-10 shrink-0 rounded-xl">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div>
                        <h3 className="font-display font-bold">{l.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-2">{l.desc}</p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
            <Reveal delay={200}>
              <p className="mt-10 text-sm text-subtle">
                Questions about pricing or timelines?{" "}
                <Link to="/faq" className="u-link font-semibold text-ink">
                  Read the FAQ
                </Link>
              </p>
            </Reveal>
          </div>
          <Reveal delay={100} variant="right" className="lg:sticky lg:top-28 lg:self-start">
            <HandoverChecklist />
          </Reveal>
        </div>
      </PageSection>

      <CtaBand title="Every project starts with a free call." kicker={offer.title} secondary={{ label: "Meet the team", to: "/team" }} />
    </PageShell>
  );
}
