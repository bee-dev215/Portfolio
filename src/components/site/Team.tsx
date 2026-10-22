import { Linkedin } from "lucide-react";
import { team, TeamMember } from "@/data/company";
import Reveal from "./Reveal";

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
    return (
      <div className="photo-cast relative h-full w-full">
        <img src={member.photo} alt={`${member.name}, ${member.role}`} loading="lazy" width={480} height={600} className="photo h-full w-full object-cover" />
      </div>
    );
  }
  // No headshot: a machined monogram plate on the blueprint grid
  return (
    <div className="relative grid h-full w-full place-items-center bg-paper-3" aria-hidden="true">
      <div className="bp-grid-dark absolute inset-0 opacity-70" />
      <span className="crosshair absolute left-4 top-4" />
      <span className="extrude relative font-display text-6xl font-bold tracking-tight text-ink/90">{initials(member.name)}</span>
    </div>
  );
}

/** "The team" subsection of Company. Renders nothing until real team members are listed. */
export default function Team() {
  if (team.length === 0) return null;

  return (
    <div className="mt-20">
      <Reveal>
        <div className="flex items-center gap-4 font-code text-xs uppercase tracking-[0.22em] text-muted2">
          <span className="text-beam">// The team</span>
          <span className="h-px flex-1 bg-gradient-to-r from-signal/60 via-line to-transparent" />
          <span>{String(team.length).padStart(2, "0")} {team.length === 1 ? "member" : "members"}</span>
        </div>
        <h3 className="extrude-sm mt-6 max-w-3xl font-display text-3xl font-bold uppercase leading-[0.95] tracking-tight sm:text-4xl">
          The people who <span className="text-beam">write the code.</span>
        </h3>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {team.map((m, i) => (
          <Reveal key={m.name} delay={(i % 4) * 90} className="h-full">
            <article className="plate hud group relative flex h-full flex-col border border-line bg-paper-2/80 hover:border-signal/50">
              <div className="relative aspect-[4/5] overflow-hidden border-b border-line">
                <Portrait member={m} />
                <span className="absolute left-0 top-0 z-[2] border-b border-r border-line bg-paper/85 px-3 py-1.5 font-code text-xs text-beam backdrop-blur">
                  TEAM-{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-display text-xl font-semibold uppercase leading-tight tracking-wide">{m.name}</h4>
                    <p className="mt-1 font-code text-[11px] uppercase tracking-wider text-beam">{m.role}</p>
                  </div>
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                      className="press key-dark relative z-[2] grid h-9 w-9 shrink-0 place-items-center border border-line text-muted2 hover:border-signal hover:text-beam"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-muted2">{m.bio}</p>
                {m.focus && m.focus.length > 0 && (
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {m.focus.slice(0, 3).map((f) => (
                      <li key={f} className="border border-line bg-paper/50 px-2 py-1 font-code text-[11px] text-ink/80">
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <span className="glow-line absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-signal transition-transform duration-300 [transition-timing-function:var(--ease-servo)] group-hover:scale-x-100" />
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
