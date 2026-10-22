import { Linkedin } from "lucide-react";
import { company, team, TeamMember } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";

const initials = (name: string) =>
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

/** Team section. Renders nothing until team members are listed in src/data/company.ts. */
export default function Team() {
  if (team.length === 0) return null;

  return (
    <section id="team" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            label="Team"
            title={
              <>
                Engineers and educators, <span className="gradient-text">one team.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              AI engineers, learning designers and product specialists — working side by side on every {company.shortName} project, from discovery to support.
            </p>
          </SectionHeading>
          <Reveal delay={100}>
            <p className="flex items-center gap-2 text-sm font-medium text-subtle">
              <span className="live-dot" /> {team.length} people · {company.availability.toLowerCase()}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={(i % 4) * 80} className="h-full">
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
