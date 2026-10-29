import { ArrowRight, ArrowUpRight, BrainCircuit, Cloud, Code2, Database, Layers, LucideIcon, MonitorSmartphone } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Technology from "@/components/site/Technology";
import Reveal, { SectionHeading } from "@/components/site/Reveal";
import PageSection from "@/components/company/PageSection";
import ModelSelector from "@/components/company/ModelSelector";
import EvalPipeline from "@/components/company/EvalPipeline";
import ArchitectureDiagram from "@/components/company/ArchitectureDiagram";
import { bookCall, company, stackGroups } from "@/data/company";
import { standards } from "@/data/company-pages";

// Same order as stackGroups (matches the Technology section)
const groupIcons: LucideIcon[] = [BrainCircuit, Layers, Code2, MonitorSmartphone, Database, Cloud];

function StackSummary() {
  return (
    <div className="card shadow-soft rounded-3xl p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-subtle">The stack, by layer</p>
      <ul className="mt-5 space-y-3">
        {stackGroups.map((g, i) => {
          const Icon = groupIcons[i % groupIcons.length];
          return (
            <li key={g.title} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[15px] font-bold">{g.title}</span>
                <span className="line-clamp-1 block text-xs text-subtle">{g.items.slice(0, 4).join(" · ")}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function TechnologyPage() {
  return (
    <PageShell title="Technology" description={`The models, frameworks, cloud platforms and open standards ${company.name} builds with — how we choose a model, evaluate it and connect it to your systems.`}>
      <PageHero
        crumbs={[{ label: "Technology" }]}
        eyebrow="Technology"
        title={
          <>
            Model-agnostic, <span className="gradient-text">evidence-driven.</span>
          </>
        }
        lead="We pick models for each task on quality, cost and privacy, prove them on your own data, and build on open standards so you are never locked in."
        actions={
          <>
            <a href="#choose" className="btn btn-primary px-7 py-3.5">
              Try the model selector <ArrowRight className="h-4 w-4" />
            </a>
            <button onClick={() => bookCall("Technology choices")} className="btn btn-secondary px-7 py-3.5">
              Ask an engineer <ArrowUpRight className="h-4 w-4" />
            </button>
          </>
        }
        aside={<StackSummary />}
      />

      {/* Model selector */}
      <PageSection id="choose" band>
        <SectionHeading
          label="Choosing a model"
          title={
            <>
              How we choose <span className="gradient-text">a model.</span>
            </>
          }
        >
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            There is no single best model — only the best fit for your data, your customers and your budget. Answer three questions to see where we would start.
          </p>
        </SectionHeading>
        <ModelSelector />
      </PageSection>

      {/* Architecture */}
      <PageSection>
        <SectionHeading
          label="Architecture"
          title={
            <>
              From your systems <span className="gradient-text">to your team.</span>
            </>
          }
        >
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            The same building blocks sit behind most of the AI we ship — an invoice agent, a voice agent or a knowledge assistant. The model gateway is what keeps you model-agnostic: change the model, keep the product.
          </p>
        </SectionHeading>
        <ArchitectureDiagram />
      </PageSection>

      {/* Evaluation */}
      <PageSection band>
        <SectionHeading
          label="Evaluation"
          center
          title={
            <>
              Nothing ships <span className="gradient-text">without evidence.</span>
            </>
          }
        >
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            Every change to a prompt, a model or the content it draws on goes through the same five steps before it reaches your team or your customers.
          </p>
        </SectionHeading>
        <EvalPipeline />
      </PageSection>

      <Technology more={false} />

      {/* Open standards */}
      <PageSection band>
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            label="Open standards"
            title={
              <>
                Plays well with <span className="gradient-text">your systems.</span>
              </>
            }
          >
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Open standards mean what we build connects to the tools you already use — and your data can move with you.
            </p>
          </SectionHeading>
          <ul className="grid gap-4 sm:grid-cols-2">
            {standards.map((s, i) => (
              <li key={s.name}>
                <Reveal delay={i * 60} className="card card-hover h-full p-5">
                  <p className="font-code text-sm font-semibold text-brand-text">{s.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.desc}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      <CtaBand title="Not sure which model fits? We'll test it on your data." topic="Model selection and evaluation" secondary={{ label: "Security & AI", to: "/responsible-ai" }} />
    </PageShell>
  );
}
