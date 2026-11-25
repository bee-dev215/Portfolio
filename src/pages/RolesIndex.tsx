import { useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import RoleCard from "@/components/roles/RoleCard";
import { roleIcons } from "@/components/site/icons";
import { applyPath, company, rolePath, roles, roleTracks, RoleTrack } from "@/data/company";

type Filter = "All" | RoleTrack;

export default function RolesIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = filter === "All" ? roles : roles.filter((r) => r.track === filter);
  const tabs: Filter[] = ["All", ...roleTracks];

  return (
    <PageShell
      title="Open roles"
      description={`${roles.length} fully remote career paths at ${company.name}: virtual assistant, customer support, software engineering, business development, QA and operations. Free to apply, open worldwide.`}
    >
      <PageHero
        crumbs={[{ label: "Open roles" }]}
        eyebrow={`${roles.length} career paths · Open worldwide`}
        title={
          <>
            Remote roles, <span className="gradient-text">real careers.</span>
          </>
        }
        lead="Every role is fully remote, comes with paid training and a lead who has done the job, and grows through four clear levels. Pick the one that fits your skills — or send an open application."
      >
        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-1 rounded-full border border-line bg-surface p-1 shadow-soft" role="tablist" aria-label="Filter roles by track">
            {tabs.map((t) => {
              const n = t === "All" ? roles.length : roles.filter((r) => r.track === t).length;
              const on = filter === t;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={on}
                  aria-controls="role-list"
                  onClick={() => setFilter(t)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    on ? "bg-grad text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {t}
                  <span className={`rounded-full px-1.5 text-xs tabular-nums ${on ? "bg-white/20" : "bg-raised text-subtle"}`}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </PageHero>

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-[1240px]">
          <ul id="role-list" role="tabpanel" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((r, i) => (
              <li key={r.key} className="mega-swap">
                <Reveal delay={(i % 3) * 80} className="h-full">
                  <RoleCard role={r} index={i} />
                </Reveal>
              </li>
            ))}
            <li className="mega-swap">
              <Reveal delay={100} className="h-full">
                <div className="spotlight flex h-full min-h-[320px] flex-col justify-between rounded-3xl border border-dashed border-line-strong bg-surface/60 p-7">
                  <div>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-raised text-ink-2">
                      <Send className="h-5 w-5" />
                    </span>
                    <p className="mt-6 font-display text-2xl font-medium tracking-[-0.015em]">Don't see your role?</p>
                    <p className="mt-3 leading-relaxed text-ink-2">
                      Send an open application. Tell us what you're great at and we'll reach out when a team opens that fits your skills.
                    </p>
                  </div>
                  <Link to="/apply?role=open" className="btn btn-secondary mt-7 self-start px-5 py-2.5 text-sm">
                    Open application <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </li>
          </ul>
        </div>
      </section>

      {/* Side by side */}
      <section className="band px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Compare"
            title={
              <>
                All roles, <span className="gradient-text">side by side.</span>
              </>
            }
          >
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">Hours, schedule and the skills check for each role, at a glance.</p>
          </SectionHeading>
          <Reveal delay={100}>
            <div className="card mt-12 overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wider text-subtle">
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-4 py-4 font-semibold">Hours</th>
                    <th className="px-4 py-4 font-semibold">Schedule</th>
                    <th className="px-4 py-4 font-semibold">Skills check</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {roles.map((r) => {
                    const Icon = roleIcons[r.key];
                    return (
                      <tr key={r.key} className="transition-colors hover:bg-raised/40">
                        <td className="px-6 py-4">
                          <Link to={rolePath(r)} className="flex items-center gap-3 font-display font-bold hover:text-brand-text">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
                              <Icon className="h-4 w-4" />
                            </span>
                            {r.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-ink-2">{r.commitment}</td>
                        <td className="px-4 py-4 text-ink-2">{r.schedule}</td>
                        <td className="max-w-xs px-4 py-4 text-ink-2">{r.skillsCheck.split(/,\s(?:and|plus|followed)/)[0].replace(/\.$/, "")}</td>
                        <td className="px-6 py-4 text-right">
                          <Link to={applyPath(r)} className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-brand-text">
                            Apply <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Found your role? Apply in five minutes." secondary={{ label: "How it works", to: "/how-it-works" }} />
    </PageShell>
  );
}
