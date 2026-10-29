import { ArrowRight, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { company, TeamMember } from "@/data/company";
import { useTeam } from "@/hooks/use-team";
import Reveal, { SectionHeading } from "./Reveal";

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Portrait({ member }: { member: TeamMember }) {
  if (member.photo) {
    return <img src={member.photo} alt={`${member.name}, ${member.role}`} loading="lazy" width={480} height={600} className="img-zoom h-full w-full object-cover" />;
  }
  return (
    <div className="bg-grad grid h-full w-full place-items-center" aria-hidden="true">
      <span className="font-display text-6xl font-extrabold tracking-tight text-white/90">{initials(member.name)}</span>
    </div>
  );
}

/** One person: portrait, name, role, bio and focus tags. */
export function TeamCard({ member: m }: { member: TeamMember }) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="unveil relative aspect-[4/5] overflow-hidden bg-raised">
        <Portrait member={m} />
        {m.linkedin && (
          <a
            href={m.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${m.name} on LinkedIn`}
            className="glass absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:text-brand-text"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-tight">{m.name}</h3>
        <p className="mt-0.5 text-sm font-semibold text-brand-text">{m.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">{m.bio}</p>
        {m.focus && m.focus.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {m.focus.slice(0, 3).map((f) => (
              <li key={f} className="chip text-[11px]">
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/** Team section: the people in builtInTeam (src/data/company.ts). Renders nothing if nobody is listed. */
export default function Team() {
  const { team } = useTeam();

  if (team.length === 0) return null;

  return (
    <section id="team" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            label="Team"
            title={
              <>
                Senior engineers, <span className="gradient-text">one small team.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              AI, web, mobile, data and automation engineers, plus product design — working side by side on every {company.shortName} project, from the first call to support.
            </p>
          </SectionHeading>
          <Reveal delay={100}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="flex items-center gap-2 text-sm font-medium text-subtle">
                <span className="live-dot" /> {team.length} people · {company.availability.toLowerCase()}
              </p>
              <Link to="/team" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                Meet the team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={(i % 4) * 80} className="h-full">
              <TeamCard member={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
