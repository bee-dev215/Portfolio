import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import PageSection from "@/components/company/PageSection";
import TeamDirectory from "@/components/company/TeamDirectory";
import { bookCall, company } from "@/data/company";
import { projectRoles, workingValues } from "@/data/company-pages";
import { useTeam } from "@/hooks/use-team";

function Mosaic() {
  const { team, ready } = useTeam();
  // Empty frames hold the space while the team loads
  const faces = ready ? team.filter((m) => m.photo).slice(0, 8).map((m) => m.photo) : Array<undefined>(8).fill(undefined);
  return (
    <div className="grid grid-cols-4 gap-3" aria-hidden="true">
      {faces.map((photo, i) => (
        <div key={i} className={`shadow-soft overflow-hidden rounded-2xl bg-raised ${i % 2 ? "translate-y-6" : ""}`}>
          <img src={photo} alt="" width={160} height={200} className="aspect-[4/5] w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function TeamPage() {
  const { team, ready } = useTeam();

  return (
    <PageShell title="Team" description={`The senior engineers and designers at ${company.name} — the people you work with directly.`}>
      <PageHero
        crumbs={[{ label: "Team" }]}
        eyebrow="Team"
        title={
          <>
            Senior engineers, <span className="gradient-text">one small team.</span>
          </>
        }
        lead="AI, web, mobile, data and automation engineers, plus product design — the same people from your first call to your support plan."
        actions={
          <>
            <button onClick={() => bookCall()} className="btn btn-primary px-7 py-3.5">
              Book a call
            </button>
            <Link to="/about" className="btn btn-secondary px-7 py-3.5">
              About {company.shortName}
            </Link>
          </>
        }
        aside={!ready || team.some((m) => m.photo) ? <Mosaic /> : undefined}
      />

      <PageSection>
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading label="The people" title="Who you'll work with." />
          {ready && (
            <p className="flex items-center gap-2 text-sm font-medium text-subtle">
              <span className="live-dot" /> {team.length} people · {company.availability.toLowerCase()}
            </p>
          )}
        </div>
        <TeamDirectory />
      </PageSection>

      {/* How we staff a project */}
      <PageSection band>
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            label="Staffing"
            title={
              <>
                How we staff <span className="gradient-text">a project.</span>
              </>
            }
          >
            <p className="mt-5 text-lg leading-relaxed text-ink-2">Small teams, sized to the work — the mix of roles changes with what you need.</p>
            <Link to="/approach" className="btn btn-secondary mt-8 px-6 py-3 text-sm">
              How we work
            </Link>
          </SectionHeading>
          <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
            {projectRoles.map((r, i) => (
              <li key={r.title}>
                <Reveal delay={i * 50} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold">{r.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{r.desc}</p>
                  </div>
                  <span className={`chip shrink-0 self-start sm:self-center ${r.when.startsWith("Every") ? "border-brand/20 bg-brand-soft text-brand-text" : ""}`}>{r.when}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      {/* Working with us */}
      <PageSection>
        <SectionHeading
          label="Working with us"
          center
          title={
            <>
              What it's like <span className="gradient-text">to work with us.</span>
            </>
          }
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {workingValues.map((v, i) => (
            <li key={v.title}>
              <Reveal delay={i * 80} className="card card-hover h-full p-6">
                <span className="bg-grad grid h-8 w-8 place-items-center rounded-full text-white">
                  <Check className="h-4 w-4" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{v.desc}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </PageSection>

      <CtaBand title="Meet the people who'd build it." kicker="Your first call is with an engineer, not a salesperson." primaryLabel="Book a discovery call" secondary={{ label: "About us", to: "/about" }} />
    </PageShell>
  );
}
