import { ArrowRight, ArrowUpRight, Compass, EyeOff, KeyRound, Lock, LucideIcon, Presentation, ScrollText, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import PageSection from "@/components/company/PageSection";
import { serviceIcons } from "@/components/site/icons";
import { bookCall, company, companyFile, principles, servicePath, services } from "@/data/company";
import { confidentiality, practices, studioGallery } from "@/data/company-pages";
import { usePhotos } from "@/hooks/use-photos";
import { useTeam } from "@/hooks/use-team";

// Same order as `principles`
const principleIcons: LucideIcon[] = [Compass, Users, Presentation, KeyRound];
const confidentialityIcons: LucideIcon[] = [Lock, ScrollText, EyeOff];

function HeroCollage() {
  const photos = usePhotos();
  const { team } = useTeam();
  return (
    <div className="relative pb-14 pr-6 sm:pr-14">
      <div className="shadow-soft overflow-hidden rounded-[2rem]">
        <img src={photos.src("/images/company-team.webp")} alt={photos.alt("/images/company-team.webp")} width={740} height={555} className="aspect-[4/3] w-full object-cover" />
      </div>
      <div className="absolute bottom-0 right-0 w-[48%] overflow-hidden rounded-3xl border-4 border-canvas shadow-soft">
        <img src={photos.src("/images/company-client.webp")} alt={photos.alt("/images/company-client.webp")} width={480} height={360} className="aspect-[4/3] w-full object-cover" />
      </div>
      {/* Shown once the team has loaded */}
      {team.length > 0 && (
        <div className="glass shadow-soft absolute -left-2 bottom-6 hidden items-center gap-3 rounded-2xl border border-line p-3 pr-4 sm:flex">
          <div className="flex">
            {team
              .filter((m) => m.photo)
              .slice(0, 4)
              .map((m, i) => (
                <img key={m.name} src={m.photo} alt="" width={36} height={36} className={`h-9 w-9 rounded-full border-2 border-surface object-cover ${i ? "-ml-3" : ""}`} />
              ))}
          </div>
          <span className="text-sm font-semibold leading-tight">
            {team.length} people
            <br />
            <span className="font-medium text-subtle">one senior team</span>
          </span>
        </div>
      )}
    </div>
  );
}

export default function About() {
  const photos = usePhotos();

  return (
    <PageShell title="About" description={`${company.name}: ${company.discipline}. Who we are, what we stand for and how the company is organized.`}>
      <PageHero
        crumbs={[{ label: "About" }]}
        eyebrow="About us"
        title={
          <>
            Software and AI that <span className="gradient-text">take work off your desk.</span>
          </>
        }
        lead={company.intro}
        actions={
          <>
            <button onClick={() => bookCall()} className="btn btn-primary px-7 py-3.5">
              Book a call <ArrowUpRight className="h-4 w-4" />
            </button>
            <Link to="/team" className="btn btn-secondary px-7 py-3.5">
              Meet the team <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        }
        aside={<HeroCollage />}
      />

      {/* Story and company facts */}
      <PageSection band>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-20">
          <div>
            <SectionHeading
              label="Our story"
              title={
                <>
                  The task first, <span className="gradient-text">then the technology.</span>
                </>
              }
            />
            <Reveal delay={80}>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-2">
                {company.about.map((p, i) => (
                  <p key={i} className={i === 0 ? "text-ink" : ""}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={120} variant="right" className="lg:sticky lg:top-28 lg:self-start">
            <div className="card shadow-soft rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Company facts</p>
              <dl className="mt-5 divide-y divide-line">
                {companyFile.map((row) => (
                  <div key={row.k} className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-6">
                    <dt className="text-sm text-subtle">{row.k}</dt>
                    <dd className="text-sm font-semibold sm:text-right">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-sm text-subtle">
                <span className="live-dot" /> {company.availability}
              </div>
            </div>
          </Reveal>
        </div>
      </PageSection>

      {/* Inside the studio: a photo bento, the first photo large */}
      <PageSection>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            label="Inside the studio"
            title={
              <>
                Engineers and designers, <span className="gradient-text">at one table.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">How a project actually happens: pairing on the hard parts, walking clients through working prototypes, and showing progress every week.</p>
          </SectionHeading>
          <Reveal delay={100}>
            <Link to="/projects" className="btn btn-secondary shrink-0 px-6 py-3 text-sm">
              See our projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,15rem)]">
          {studioGallery.map((g, i) => (
            <li key={g.src} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
              <Reveal delay={i * 80} variant={i === 0 ? "scale" : "up"} className="h-full">
                <figure className="shadow-soft group relative h-full overflow-hidden rounded-3xl bg-raised">
                  <div className="unveil sheen h-full">
                    <img src={photos.src(g.src)} alt={photos.alt(g.src, g.alt)} loading="lazy" width={1280} height={800} className={`h-full w-full object-cover ${i === 0 ? "aspect-[4/3] lg:aspect-auto" : "aspect-[16/10] lg:aspect-auto"}`} />
                  </div>
                  <div className="photo-fade absolute inset-0" aria-hidden="true" />
                  <figcaption className={`absolute inset-x-0 bottom-0 p-5 font-medium text-white ${i === 0 ? "text-base sm:p-7" : "text-sm"}`}>{g.caption}</figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Principles */}
      <PageSection band>
        <SectionHeading
          label="What we stand for"
          center
          title={
            <>
              Four principles behind <span className="gradient-text">every project.</span>
            </>
          }
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => {
            const Icon = principleIcons[i % principleIcons.length];
            return (
              <Reveal key={p.title} delay={i * 80} className="h-full">
                <div className="card card-hover h-full p-6">
                  <span className="icon-tile h-11 w-11">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </PageSection>

      {/* Practices */}
      <PageSection>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            label="How we're organized"
            title={
              <>
                Four practices, <span className="gradient-text">one team per project.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              Every project draws on the practices it needs, so AI, product, infrastructure and support decisions are made together — not handed over the wall.
            </p>
          </SectionHeading>
          <Reveal delay={100}>
            <Link to="/approach" className="btn btn-secondary shrink-0 px-6 py-3 text-sm">
              How we work <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {practices.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="h-full">
              <article className="card h-full p-7 sm:p-8">
                <p className="font-display text-sm font-bold text-brand-text">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{p.desc}</p>
                <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                  {p.services.map((key) => {
                    const s = services.find((x) => x.key === key);
                    if (!s) return null;
                    const Icon = serviceIcons[key];
                    return (
                      <li key={key}>
                        <Link to={servicePath(s)} className="chip px-3 py-1.5 text-[13px] transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-text">
                          <Icon className="h-3.5 w-3.5" /> {s.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* Confidentiality */}
      <PageSection id="confidentiality" band>
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            label="Confidentiality"
            title={
              <>
                Why you won't see <span className="gradient-text">client logos here.</span>
              </>
            }
          >
            <p className="mt-5 text-lg leading-relaxed text-ink-2">Our clients share customer records, financial documents and products that haven't launched. Keeping that private comes first.</p>
            <Link to="/responsible-ai" className="btn btn-secondary mt-8 px-6 py-3 text-sm">
              How we protect client work <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionHeading>
          <div className="space-y-4">
            {confidentiality.map((c, i) => {
              const Icon = confidentialityIcons[i % confidentialityIcons.length];
              return (
                <Reveal key={c.title} delay={i * 80} variant="right">
                  <div className="card flex gap-5 p-6">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold">{c.title}</h3>
                      <p className="mt-1.5 leading-relaxed text-ink-2">{c.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </PageSection>

      <CtaBand title="Tell us what's eating your week." secondary={{ label: "How we work", to: "/approach" }} />
    </PageShell>
  );
}
