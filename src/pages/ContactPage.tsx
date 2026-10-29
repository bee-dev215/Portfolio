import { ArrowRight, CalendarDays, ClipboardList, Clock, Gift, Handshake, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import Contact from "@/components/site/Contact";
import ProjectScoper from "@/components/contact/ProjectScoper";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import { company, offer, scrollToId } from "@/data/company";
import { faqs } from "@/data/faq";

const facts = [
  { icon: Clock, k: "Reply time", v: `Within ${company.responseTime}` },
  { icon: Gift, k: "First step", v: `A free call — then ${offer.badge.toLowerCase()}` },
  { icon: Handshake, k: "Engagements", v: company.engagements },
];

// Questions people usually ask before getting in touch
const beforeYouWrite = faqs.filter((f) => f.featured).slice(0, 4);

export default function ContactPage() {
  return (
    <PageShell title="Contact" description={`Tell ${company.name} what your team does by hand, or what you need built — a senior engineer replies within ${company.responseTime}.`}>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        eyebrow="Contact"
        title={
          <>
            Let's take something <span className="gradient-text">off your plate.</span>
          </>
        }
        lead={`Busywork to automate, an app to build or a project to rescue? Tell us about it — a senior engineer, not a salesperson, replies within ${company.responseTime}. Or skip the email and book a call.`}
        actions={
          <>
            <Link to="/book" className="btn btn-primary px-7 py-3.5">
              <CalendarDays className="h-4 w-4" /> Book a call
            </Link>
            <button onClick={() => scrollToId("scoper")} className="btn btn-secondary px-7 py-3.5">
              <ClipboardList className="h-4 w-4" /> Plan your project
            </button>
            <button onClick={() => scrollToId("contact")} className="btn btn-secondary px-7 py-3.5">
              <PenLine className="h-4 w-4" /> Write to us
            </button>
          </>
        }
        aside={
          <div className="card shadow-soft rounded-3xl p-6 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <span className="live-dot" /> {company.availability}
            </p>
            <dl className="mt-6 space-y-5">
              {facts.map(({ icon: Icon, k, v }) => (
                <div key={k} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-subtle">{k}</dt>
                    <dd className="mt-0.5 font-semibold">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-ink-2">
              We keep client work confidential — see how in{" "}
              <Link to="/responsible-ai" className="font-semibold text-brand-text underline-offset-2 hover:underline">
                Security & AI
              </Link>
              .
            </p>
          </div>
        }
      />

      <div id="scoper" className="scroll-mt-24">
        <Reveal>
          <ProjectScoper />
        </Reveal>
      </div>

      <Contact showHeading={false} />

      {/* Before you write */}
      <section className="band px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              label="Before you write"
              title={
                <>
                  Quick answers, <span className="gradient-text">just in case.</span>
                </>
              }
            />
            <Reveal delay={80}>
              <Link to="/faq" className="btn btn-secondary shrink-0 px-6 py-3 text-sm">
                All {faqs.length} questions <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {beforeYouWrite.map((f, i) => (
              <li key={f.id}>
                <Reveal delay={i * 70} className="h-full">
                  <Link to={`/faq#${f.id}`} className="card card-hover group flex h-full flex-col p-6 sm:p-7">
                    <span className="text-xs font-semibold uppercase tracking-wider text-subtle">{f.category}</span>
                    <h3 className="mt-2 font-display text-lg font-bold leading-snug">{f.q}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-2">{f.a}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-text">
                      Read the answer <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
