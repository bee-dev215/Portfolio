import { ArrowRight, ArrowUpRight, CalendarDays, Gift, GitBranch, ShieldCheck, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { company, industries, offer, servicePath, services } from "@/data/company";
import { projectPath } from "@/data/projects";
import { usePhotos } from "@/hooks/use-photos";
import { useProjects } from "@/hooks/use-projects";
import { useTeam } from "@/hooks/use-team";
import { serviceIcons } from "./icons";

const HERO_PHOTO = "/images/hero-work.webp";

// The three capabilities in the hero panel, each with a one-line pitch
const featured = [
  { key: "ai", kicker: "Applied AI", line: "Assistants, agents and document AI that do real work" },
  { key: "web", kicker: "Software", line: "Web, mobile and desktop apps for your business" },
  { key: "automation", kicker: "Automation", line: "Busywork handed to software, with your OK" },
] as const;

const badges = [
  { icon: GitBranch, label: "Senior-led engineering", tint: "text-iris" },
  { icon: ShieldCheck, label: "You own the code", tint: "text-emerald-500" },
  { icon: Timer, label: "Working software in two weeks", tint: "text-sky2" },
];

const industryTitle = (key: string) => industries.find((i) => i.key === key)?.title ?? "";

export default function Hero() {
  const photos = usePhotos();
  const faces = useTeam().team.filter((m) => m.photo).slice(0, 4);
  const { projects } = useProjects();

  return (
    <section className="relative overflow-hidden pb-4 pt-28 sm:pt-32 lg:pt-36">
      <div className="clouds pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)] lg:gap-14">
        {/* message */}
        <div>
          <p className="fade-up inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-ink-2" style={{ animationDelay: ".05s" }}>
            <span className="bg-grad h-2 w-2 rounded-full" /> {company.discipline} studio
          </p>

          <h1
            className="fade-up mt-6 font-display text-[clamp(2.6rem,5.8vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.035em]"
            style={{ animationDelay: ".12s" }}
          >
            Give your team
            <br />
            <span className="gradient-text">its week back.</span>
          </h1>

          <p className="fade-up mt-6 font-display text-lg font-bold tracking-tight sm:text-xl" style={{ animationDelay: ".18s" }}>
            Custom software and applied AI, built by senior engineers.
          </p>
          <p className="fade-up mt-4 max-w-[600px] text-[17px] leading-relaxed text-ink-2" style={{ animationDelay: ".22s" }}>
            {company.tagline}
          </p>

          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: ".28s" }}>
            <Link to="/book" className="btn btn-primary px-7 py-3.5">
              Book a free call <CalendarDays className="h-4 w-4" />
            </Link>
            <Link to="/projects" className="btn btn-secondary px-7 py-3.5">
              See our work <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="fade-up mt-7 flex flex-wrap gap-2" style={{ animationDelay: ".34s" }}>
            <li>
              <Link to="/book" className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:border-brand/30">
                <Gift className="h-3.5 w-3.5 text-sun" /> {offer.badge}
                <span className="text-subtle">·</span>
                <span className="inline-flex items-center gap-1 text-brand-text">
                  Free prototype <ArrowUpRight className="h-3 w-3" />
                </span>
              </Link>
            </li>
            {badges.map(({ icon: Icon, label, tint }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-2">
                <Icon className={`h-3.5 w-3.5 ${tint}`} /> {label}
              </li>
            ))}
          </ul>
        </div>

        {/* what you get */}
        <aside className="fade-up card shadow-soft rounded-[28px] p-5 sm:p-6" style={{ animationDelay: ".24s" }}>
          <figure className="relative overflow-hidden rounded-2xl">
            <img
              src={photos.src(HERO_PHOTO)}
              alt={photos.alt(HERO_PHOTO)}
              width={1280}
              height={600}
              className="aspect-[2/1] w-full object-cover sm:aspect-[2.4/1]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-[#0a1020]/80 to-transparent px-4 pb-3.5 pt-12 text-white">
              <span className="flex shrink-0 -space-x-2">
                {faces.map((m) => (
                  <img key={m.name} src={photos.src(m.photo)} alt="" width={28} height={28} className="h-7 w-7 rounded-full bg-white/20 object-cover object-top ring-2 ring-white/90" />
                ))}
              </span>
              <span className="text-[13px] font-medium leading-tight">You talk to the engineers who build it</span>
            </figcaption>
          </figure>

          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <p className="gradient-text text-[11px] font-bold uppercase tracking-[.18em]">Engineering partner</p>
              <p className="mt-1.5 font-display text-xl font-bold leading-snug">From first call to production</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/25 [[data-theme=dark]_&]:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Direct senior access
            </span>
          </div>

          <ol className="mt-4 space-y-2.5">
            {featured.map(({ key, kicker, line }, i) => {
              const service = services.find((s) => s.key === key)!;
              const Icon = serviceIcons[key];
              return (
                <li key={key}>
                  <Link
                    to={servicePath(service)}
                    className="group flex items-center gap-3.5 rounded-2xl border border-line bg-raised/40 p-3.5 transition-colors hover:border-brand/30 hover:bg-surface"
                  >
                    <span className="icon-tile h-10 w-10 shrink-0 rounded-xl">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10.5px] font-bold uppercase tracking-[.14em] text-subtle">
                        0{i + 1} · {kicker}
                      </span>
                      <span className="block truncate text-[15px] font-semibold">{service.title}</span>
                      <span className="block truncate text-[13px] text-subtle">{line}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-subtle transition-colors group-hover:text-brand-text" />
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4 text-[13px]">
            <span className="truncate text-subtle">{industries.slice(0, 3).map((i) => i.title).join(" · ")}</span>
            <Link to="/services" className="inline-flex shrink-0 items-center gap-1 font-semibold transition-colors hover:text-brand-text">
              All {services.length} services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>

      {/* selected work */}
      <div className="relative mx-auto mt-16 max-w-[1240px] px-5 sm:px-8 lg:mt-20">
        <div className="border-t border-line pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-subtle">Selected work &amp; delivered platforms</p>
              <p className="mt-1 text-sm text-subtle">Built for teams in healthcare, construction, real estate, legal and e-commerce.</p>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text">
              All case studies <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link
                  to={projectPath(p)}
                  className="card-hover group flex h-full items-center gap-3.5 rounded-2xl border border-line bg-surface p-2.5 pr-4"
                >
                  <img src={photos.src(p.image)} alt="" loading="lazy" width={64} height={48} className="h-12 w-16 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.title}</span>
                    <span className="block truncate text-xs text-subtle">{industryTitle(p.audience)}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-subtle transition-colors group-hover:text-brand-text" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
