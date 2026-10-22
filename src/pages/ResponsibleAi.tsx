import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Ban,
  Baby,
  Eye,
  FileSearch,
  FlaskConical,
  Lock,
  LucideIcon,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import PageSection from "@/components/company/PageSection";
import DataLifecycle from "@/components/company/DataLifecycle";
import { company, startEnquiry } from "@/data/company";
import { commitments, confidentiality, dataLifecycle, neverDo, policies, policiesNote } from "@/data/company-pages";

// Same order as `commitments`
const commitmentIcons: LucideIcon[] = [Lock, FileSearch, UserCheck, FlaskConical, Scale, Accessibility, Baby, Eye];

function NeverCard() {
  return (
    <div className="card shadow-soft rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="icon-tile h-11 w-11">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <p className="font-display text-lg font-bold">What we never do</p>
      </div>
      <ul className="mt-6 space-y-3.5">
        {neverDo.map((n) => (
          <li key={n} className="flex gap-3 text-[15px] leading-relaxed">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-text">
              <Ban className="h-3.5 w-3.5" />
            </span>
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResponsibleAi() {
  return (
    <PageShell
      title="Responsible AI"
      description={`How ${company.name} protects learners, data and client confidentiality: our commitments, the data lifecycle and the regulations we design around.`}
    >
      <PageHero
        crumbs={[{ label: "Responsible AI" }]}
        eyebrow="Responsible AI"
        title={
          <>
            AI that learners, educators <span className="gradient-text">and parents can trust.</span>
          </>
        }
        lead="Education is a high-trust setting. Privacy, safety and fairness are part of the design from the first workshop — planned with your compliance and safeguarding teams, never bolted on later."
        actions={
          <>
            <button onClick={() => startEnquiry("privacy and responsible AI requirements")} className="btn btn-primary px-7 py-3.5">
              Discuss your requirements <ArrowUpRight className="h-4 w-4" />
            </button>
            <a href="#lifecycle" className="btn btn-secondary px-7 py-3.5">
              Follow your data <ArrowRight className="h-4 w-4" />
            </a>
          </>
        }
        aside={<NeverCard />}
      />

      {/* Commitments */}
      <PageSection band>
        <SectionHeading
          label="Our commitments"
          center
          title={
            <>
              Eight commitments <span className="gradient-text">on every project.</span>
            </>
          }
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((c, i) => {
            const Icon = commitmentIcons[i % commitmentIcons.length];
            return (
              <li key={c.title}>
                <Reveal delay={(i % 4) * 70} className="card card-hover h-full p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-text">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.desc}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </PageSection>

      {/* Data lifecycle */}
      <PageSection id="lifecycle">
        <SectionHeading
          label="Your data"
          title={
            <>
              What happens to data, <span className="gradient-text">stage by stage.</span>
            </>
          }
        >
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            Every project starts with a data map: what is collected, where it goes, who can see it and when it is deleted. These {dataLifecycle.length} stages are what it covers.
          </p>
        </SectionHeading>
        <DataLifecycle />
      </PageSection>

      {/* Policies */}
      <PageSection band>
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            label="Regulation"
            title={
              <>
                Policies we <span className="gradient-text">design around.</span>
              </>
            }
          >
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{policiesNote}</p>
          </SectionHeading>
          <ul className="grid gap-4 sm:grid-cols-2">
            {policies.map((p, i) => (
              <li key={p.name} className={i === policies.length - 1 && policies.length % 2 ? "sm:col-span-2" : ""}>
                <Reveal delay={i * 60} className="card h-full p-5">
                  <p className="font-display text-lg font-bold">{p.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{p.desc}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      {/* Confidentiality */}
      <PageSection id="confidentiality">
        <div className="grad-border overflow-hidden rounded-[2rem] bg-surface">
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:p-14">
            <div>
              <span className="eyebrow">
                <Lock className="h-3.5 w-3.5" /> Confidentiality
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Client work stays off the record.</h2>
              <Link to="/about" className="u-link mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                Why you won't see client logos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="space-y-6">
              {confidentiality.map((c) => (
                <li key={c.title} className="flex gap-4">
                  <span className="bg-grad mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                  <div>
                    <h3 className="font-display font-bold">{c.title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-2">{c.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageSection>

      <CtaBand
        title="Bring your compliance team. We'll bring ours."
        kicker="Privacy and safeguarding are on the agenda from the first call."
        topic="privacy and responsible AI requirements"
        secondary={{ label: "Read the FAQ", to: "/faq" }}
      />
    </PageShell>
  );
}
