import { Linkedin } from "lucide-react";
import { TeamMember } from "@/data/company";

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
    return <img src={member.photo} alt={`${member.name}, ${member.role}`} loading="lazy" width={480} height={600} className="h-full w-full object-cover" />;
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
      <div className="unveil sheen relative aspect-[4/5] overflow-hidden bg-raised">
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
