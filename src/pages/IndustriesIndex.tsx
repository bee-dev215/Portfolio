import { ArrowRight, ArrowUpRight, BookOpenCheck, Cable, Check, MessageCircle, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import { company, industries, industryPath, solutionPath, solutions, startEnquiry } from "@/data/company";
import { otherSettings } from "@/data/industry-details";
import { usePhotos } from "@/hooks/use-photos";

// What every audience can count on, whoever they are
const commitments = [
  { icon: BookOpenCheck, title: "Grounded in your content", desc: "Answers and feedback come from your curriculum, courses and policies — with sources." },
  { icon: UserCheck, title: "A person stays in charge", desc: "Educators review anything that affects a grade, a record or a message home." },
  { icon: Cable, title: "Fits your platforms", desc: "Built into the LMS, SIS and identity systems you already run." },
  { icon: Check, title: "Measured on learning", desc: "Success is agreed up front and tracked after launch — not just usage." },
];

export default function IndustriesIndex() {
  const photos = usePhotos();

  return (
    <PageShell
      title="Who we serve"
      description={`${company.name} builds AI for K-12 schools, universities and colleges, EdTech companies and corporate learning teams.`}
    >
      <PageHero
        crumbs={[{ label: "Who we serve" }]}
        eyebrow="Who we serve"
        title={
          <>
            Built for the people <span className="gradient-text">who teach and learn.</span>
          </>
        }
        lead="From the classroom to the boardroom — we understand how each kind of learning organisation works, the systems it runs and the rules it follows, and build AI that fits."
        actions={
          <>
            <button onClick={() => startEnquiry()} className="btn btn-primary px-7 py-3.5">
              Start a project <ArrowRight className="h-4 w-4" />
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
                {ind.title} <ArrowRight className="h-3 w-3" />
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
                {/* The whole card opens the audience page; the title link is the keyboard route, the chips stay separate */}
                <Link to={industryPath(ind)} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[1]" />
                <div className="relative aspect-[16/10] overflow-hidden bg-raised">
                  <img src={photos.src(ind.image)} alt={photos.alt(ind.image, ind.imageAlt)} loading="lazy" width={620} height={388} className="img-zoom h-full w-full object-cover" />
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
                          {t} <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      ) : null;
                    })}
                    <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                      How we help <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
            label="Other settings"
            title={
              <>
                Wherever people learn, <span className="gradient-text">we can help.</span>
              </>
            }
          >
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              The same building blocks — tutors, feedback, analytics, knowledge assistants and training — adapt to other learning settings too.
            </p>
          </SectionHeading>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherSettings.map((o, i) => (
              <li key={o.name}>
                <Reveal delay={(i % 3) * 70} className="h-full">
                  <div className="card flex h-full flex-col p-5 sm:p-6">
                    <h3 className="font-display text-lg font-bold">{o.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{o.desc}</p>
                    <button onClick={() => startEnquiry(o.name)} className="u-link mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-semibold text-brand-text">
                      <MessageCircle className="h-4 w-4" /> Talk to us
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
            label="For everyone"
            center
            title={
              <>
                What every audience <span className="gradient-text">can count on.</span>
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
                Read our responsible-AI commitments <ArrowUpRight className="h-4 w-4" />
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Don't see your setting? Tell us about it." kicker="We build for learning organisations of every shape." secondary={{ label: "Browse services", to: "/services" }} />
    </PageShell>
  );
}
