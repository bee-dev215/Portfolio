import { Cable, Check, KeyRound, PhoneCall, Target, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import { bookCall, company, industries, industryPath, offer, solutionPath, solutions } from "@/data/company";
import { otherSettings } from "@/data/industry-details";
import { usePhotos } from "@/hooks/use-photos";

// What every client can count on, whatever the industry
const commitments = [
  { icon: Cable, title: "Fits the systems you run", desc: "Connected to the practice, accounting, project and CRM tools your team already uses — not one more login." },
  { icon: UserCheck, title: "A person approves what matters", desc: "Payments, messages to customers and changes to records wait for someone on your team to sign off." },
  { icon: KeyRound, title: "Yours to keep", desc: "Code, cloud accounts and documentation are in your name from day one, with your data kept where you choose." },
  { icon: Target, title: "Judged on the busywork removed", desc: "We agree up front what 'fixed' looks like, then check it after launch — not just whether people log in." },
];

export default function IndustriesIndex() {
  const photos = usePhotos();

  return (
    <PageShell
      title="Industries"
      description={`${company.name} builds custom AI tools, apps and automation for healthcare, construction, real estate, professional services, logistics and e-commerce, and startups.`}
    >
      <PageHero
        crumbs={[{ label: "Industries" }]}
        eyebrow="Industries"
        title={
          <>
            Different industries, <span className="gradient-text">the same busywork.</span>
          </>
        }
        lead="Re-typing invoices, chasing paperwork, answering the same calls, stitching together the weekly report. The work looks different in each industry, and so do the systems and rules around it — so we build around them."
        actions={
          <>
            <button onClick={() => bookCall()} className="btn btn-primary px-7 py-3.5">
              Book a call
            </button>
            <Link to="/solutions" className="btn btn-secondary px-7 py-3.5">
              Explore solutions
            </Link>
          </>
        }
      >
        <ul className="flex flex-wrap gap-2">
          {industries.map((ind) => (
            <li key={ind.key}>
              <Link to={industryPath(ind)} className="chip px-3.5 py-1.5 text-sm transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-text">
                {ind.title}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-[1240px] gap-6 md:grid-cols-2">
          {industries.map((ind, i) => (
            <Reveal key={ind.key} delay={(i % 2) * 90} className="h-full">
              <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
                {/* The whole card opens the industry page; the title link is the keyboard route, the chips stay separate */}
                <Link to={industryPath(ind)} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[1]" />
                <div className="sheen relative aspect-[16/10] overflow-hidden bg-raised">
                  <img src={photos.src(ind.image)} alt={photos.alt(ind.image, ind.imageAlt)} loading="lazy" width={620} height={388} className="h-full w-full object-cover" />
                  <div className="photo-fade absolute inset-0" aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{ind.focus}</p>
                    <h2 className="mt-1.5 font-display text-3xl font-bold tracking-tight">
                      <Link to={industryPath(ind)}>
                        {ind.title}
                      </Link>
                    </h2>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-[15px] leading-relaxed text-ink-2">{ind.desc}</p>
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {ind.work.map((w) => (
                      <li key={w} className="flex items-center gap-2.5 text-sm text-ink">
                        <Check className="h-4 w-4 shrink-0 text-brand-text" />
                        {w}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                    {ind.solutions.map((t) => {
                      const s = solutions.find((x) => x.title === t);
                      return s ? (
                        <Link key={t} to={solutionPath(s)} className="chip relative z-[2] transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-text">
                          {t}
                        </Link>
                      ) : null;
                    })}
                    <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                      Use cases & examples
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Other industries"
            title={
              <>
                Not on the list? <span className="gradient-text">The busywork looks familiar.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              The same building blocks — document AI, assistants, automation, field apps and dashboards — work wherever people re-type, chase and copy. A few more places it shows up:
            </p>
          </SectionHeading>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherSettings.map((o, i) => (
              <li key={o.name}>
                <Reveal delay={(i % 3) * 70} className="h-full">
                  <div className="card flex h-full flex-col p-5 sm:p-6">
                    <h3 className="font-display text-lg font-bold">{o.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{o.desc}</p>
                    <button onClick={() => bookCall(o.name)} className="u-link mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-semibold text-brand-text">
                      <PhoneCall className="h-4 w-4" /> Book a call<span className="sr-only"> about {o.name.toLowerCase()}</span>
                    </button>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            label="Every industry"
            center
            title={
              <>
                What every client <span className="gradient-text">can count on.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((c, i) => (
              <Reveal key={c.title} delay={i * 70} className="h-full">
                <div className="card h-full p-6">
                  <span className="icon-tile h-11 w-11">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-10 text-center">
              <Link to="/responsible-ai" className="u-link inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                How we handle security & AI
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Tell us the task that eats your week." kicker={offer.title} secondary={{ label: "Browse services", to: "/services" }} />
    </PageShell>
  );
}
