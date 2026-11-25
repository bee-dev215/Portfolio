import { CSSProperties } from "react";
import { ArrowRight, CalendarClock, Check, Clock3, Globe2, Layers, Plus, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import RoleCard from "@/components/roles/RoleCard";
import { roleIcons } from "@/components/site/icons";
import { applyPath, company, levels, promises, roleBySlug, roles, steps } from "@/data/company";
import NotFound from "./NotFound";

/** Splits a title so its last word can carry the highlight: "QA Tester" → ["QA", "Tester"]. */
const splitTitle = (t: string) => {
  const i = t.lastIndexOf(" ");
  return i === -1 ? ["", t] : [t.slice(0, i), t.slice(i + 1)];
};

export default function RoleDetail() {
  const { slug } = useParams();
  const role = roleBySlug(slug);
  if (!role) return <NotFound />;

  const Icon = roleIcons[role.key];
  const [head, tail] = splitTitle(role.title);
  const facts = [
    { icon: Globe2, k: "Location", v: "Anywhere — fully remote" },
    { icon: Clock3, k: "Hours", v: role.commitment },
    { icon: CalendarClock, k: "Schedule", v: role.schedule },
    { icon: Layers, k: "Track", v: role.track },
  ];
  // Other roles: the same track first
  const others = [...roles.filter((r) => r.key !== role.key && r.track === role.track), ...roles.filter((r) => r.track !== role.track)].slice(0, 3);
  // The path in, with this role's own skills check
  const path = steps.map((s) => (s.id === "skills" ? { ...s, summary: role.skillsCheck } : s));

  const jobSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: `${role.summary} Responsibilities: ${role.duties.join("; ")}. Requirements: ${role.requirements.join("; ")}.`,
    hiringOrganization: { "@type": "Organization", name: company.name },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "Worldwide" },
    employmentType: role.commitment.includes("part") ? ["FULL_TIME", "PART_TIME"] : ["FULL_TIME"],
    datePosted: "2026-11-01",
  });

  return (
    <PageShell title={role.title} description={`${role.short} Fully remote at ${company.name}, open to applicants worldwide.`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobSchema }} />
      <PageHero
        crumbs={[{ label: "Roles", to: "/roles" }, { label: role.title }]}
        eyebrow={
          <>
            <Icon className="h-3.5 w-3.5" /> {role.category}
          </>
        }
        title={
          <>
            {head} <span className="gradient-text">{tail}</span>
          </>
        }
        lead={role.summary}
        actions={
          <>
            <Link to={applyPath(role)} className="btn btn-primary px-7 py-4 text-base">
              Apply for this role <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/how-it-works" className="btn btn-secondary px-7 py-4 text-base">
              How it works
            </Link>
          </>
        }
        aside={
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-line bg-raised shadow-soft">
              <img src={role.image} alt="" width={1280} height={800} style={{ objectPosition: role.focus }} className="h-full w-full object-cover" />
              <div className="photo-fade absolute inset-0" />
            </div>
            <div className="glass absolute -bottom-6 left-4 right-4 grid grid-cols-2 gap-3 rounded-2xl border border-line p-4 shadow-soft sm:left-8 sm:right-8">
              {facts.map((f) => (
                <div key={f.k} className="flex items-start gap-2.5">
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" />
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-subtle">{f.k}</span>
                    <span className="block text-[13px] font-semibold leading-snug">{f.v}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* The role */}
      <section className="px-5 pb-20 pt-8 sm:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="space-y-14">
            <Reveal>
              <h2 className="font-display text-3xl font-medium tracking-[-0.015em]">What you'll do</h2>
              <ol className="mt-6 space-y-3">
                {role.duties.map((d, i) => (
                  <li key={d} className="card flex items-start gap-4 p-5">
                    <span className="bg-grad grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-xs font-bold text-white">{String(i + 1).padStart(2, "0")}</span>
                    <span className="pt-1 leading-relaxed">{d}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              <Reveal className="h-full">
                <div className="card h-full p-7">
                  <h2 className="font-display text-xl font-bold">What you'll need</h2>
                  <ul className="mt-5 space-y-3">
                    {role.requirements.map((r) => (
                      <li key={r} className="flex gap-3 leading-relaxed text-ink-2">
                        <span className="bg-grad mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white">
                          <Check className="h-3 w-3" />
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={80} className="h-full">
                <div className="card h-full p-7">
                  <h2 className="font-display text-xl font-bold">Nice to have</h2>
                  <ul className="mt-5 space-y-3">
                    {role.bonus.map((r) => (
                      <li key={r} className="flex gap-3 leading-relaxed text-ink-2">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-raised text-brand-text">
                          <Plus className="h-3 w-3" />
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm text-subtle">Missing a few of these? Apply anyway — we hire for potential too.</p>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <h2 className="font-display text-xl font-bold">Tools you'll use</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {role.tools.map((t) => (
                  <li key={t} className="rounded-full border border-line bg-surface px-4 py-1.5 font-display text-sm font-semibold text-ink-2">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Apply card */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal variant="right">
              <div className="card relative overflow-hidden p-7">
                <div className="mesh pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
                <div className="relative">
                  <span className="icon-tile h-12 w-12">
                    <Icon className="h-[22px] w-[22px]" />
                  </span>
                  <p className="mt-5 font-display text-2xl font-medium tracking-[-0.015em]">{role.title}</p>
                  <ul className="mt-4 space-y-2">
                    {role.highlights.map((h) => (
                      <li key={h} className="flex gap-2 text-sm text-ink-2">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" /> {h}
                      </li>
                    ))}
                  </ul>
                  <Link to={applyPath(role)} className="btn btn-primary mt-7 w-full py-3.5">
                    Apply now <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-3 text-center text-xs text-subtle">{promises.free}</p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* A day in the role */}
      <section className="band px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="A day in the role"
            title={
              <>
                What a typical day <span className="gradient-text">looks like.</span>
              </>
            }
          >
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">An example day, in your own time zone. Every team is a little different — your lead walks you through yours.</p>
          </SectionHeading>
          <Reveal delay={100}>
            <ol className="relative mt-14 grid gap-6 md:grid-cols-4">
              <span className="bg-grad absolute left-[19px] top-2 hidden h-[2px] opacity-40 md:left-5 md:right-5 md:block" aria-hidden="true" />
              {role.day.map((d, i) => (
                <li key={d.time} className="relative" style={{ "--i": i } as CSSProperties}>
                  <span className="relative z-[1] grid h-10 w-10 place-items-center rounded-full border-4 border-canvas bg-grad text-white shadow-[0_8px_18px_-8px_rgb(var(--brand-rgb)/.8)]">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  <div className="card mt-5 p-5">
                    <p className="font-mono text-xs font-bold text-brand-text">{d.time}</p>
                    <p className="mt-1.5 font-display text-lg font-bold">{d.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{d.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Path in + levels */}
      <section className="px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              label="Your path in"
              title={
                <>
                  Five steps, <span className="gradient-text">all online.</span>
                </>
              }
            />
            <ol className="mt-10 space-y-3">
              {path.map((s, i) => (
                <li key={s.id}>
                  <Reveal delay={i * 60}>
                    <div className={`card flex gap-4 p-5 ${s.id === "skills" ? "grad-border" : ""}`}>
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${s.id === "skills" ? "bg-grad text-white" : "bg-brand-soft text-brand-text"}`}>{i + 1}</span>
                      <div>
                        <p className="flex flex-wrap items-center gap-x-3 font-display text-lg font-bold">
                          {s.name} <span className="text-xs font-semibold text-subtle">{s.time}</span>
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-2">{s.summary}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:pt-24">
            <Reveal variant="right">
              <div className="card p-7">
                <p className="font-display text-xl font-bold">Grow through four levels</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">Quarterly reviews, clear criteria, and a higher base rate at every step.</p>
                <ol className="mt-6 space-y-2.5">
                  {levels.map((l) => (
                    <li key={l.n} className="flex items-center gap-3">
                      <span className="w-6 font-mono text-xs font-bold text-subtle">L{l.n}</span>
                      <span className="h-8 flex-1 overflow-hidden rounded-lg bg-raised">
                        <span className="bg-grad flex h-full items-center rounded-lg px-3 text-xs font-bold text-white" style={{ width: `${l.height}%` }}>
                          {l.name}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
                <Link to="/how-it-works#pay" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                  How pay and levels work <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Other roles */}
      <section className="band px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              label="Other roles"
              title={
                <>
                  Not quite right? <span className="gradient-text">Explore more.</span>
                </>
              }
            />
            <Link to="/roles" className="btn btn-secondary px-6 py-3 text-sm">
              All roles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((r, i) => (
              <li key={r.key}>
                <Reveal delay={i * 80} className="h-full">
                  <RoleCard role={r} index={i} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand role={role} title={`Ready to join as a ${role.title}?`} primaryLabel="Apply for this role" secondary={{ label: "Read the FAQ", to: "/faq" }} />
    </PageShell>
  );
}
