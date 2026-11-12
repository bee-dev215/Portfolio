import { CSSProperties } from "react";
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, AudioLines, BellRing, BrainCircuit, CalendarCheck, Cloud, CornerDownRight,
  Database, FileCheck2, FileText, FlaskConical, GitBranch, Inbox, Layers, LayoutDashboard, Library, ListChecks, LucideIcon,
  MessagesSquare, PhoneCall, Plug, RefreshCw, RotateCcw, ScanText, Server, Smartphone, Sparkles, UserCheck, Workflow,
} from "lucide-react";
import { FlowIcon, FlowStep, Project } from "@/data/projects";
import Reveal from "@/components/site/Reveal";

const icons: Record<FlowIcon, LucideIcon> = {
  phone: PhoneCall, voice: AudioLines, chat: MessagesSquare, calendar: CalendarCheck, summary: FileText,
  mobile: Smartphone, sync: RefreshCw, draft: Sparkles, review: UserCheck, dashboard: LayoutDashboard,
  inbox: Inbox, scan: ScanText, checks: ListChecks, post: FileCheck2,
  word: FileText, server: Server, library: Library, model: BrainCircuit,
  sources: Plug, pipeline: Workflow, database: Database, alert: BellRing,
  repo: GitBranch, tests: FlaskConical, staging: Layers, cloud: Cloud, monitor: Activity,
};

const kindLabel = { ai: "AI", people: "People" } as const;

/** The leg of the line from one stop to the next: a dot runs it (both ways on two-way legs); at xl it carries its labels. */
function Leg({ step, i }: { step: FlowStep; i: number }) {
  const delay = (k: number) => ({ "--d": `${0.9 + i * 0.4 + k}s` }) as CSSProperties;
  return (
    <span className={`metro-leg ${step.returns ? "is-two-way" : ""}`} aria-hidden="true">
      <span className="metro-run" style={delay(0)} />
      {step.returns && <span className="metro-run is-back" style={delay(1.4)} />}
      <span className="metro-tags hidden xl:flex">
        {step.returns ? (
          <>
            <span className="flex items-center gap-1">{step.sends} <ArrowRight className="h-3 w-3 shrink-0" /></span>
            <span className="flex items-center gap-1 text-subtle"><ArrowLeft className="h-3 w-3 shrink-0" /> {step.returns}</span>
          </>
        ) : (
          step.sends
        )}
      </span>
    </span>
  );
}

/**
 * How a project's system fits together, drawn as a metro line: each part of the system is a stop, each leg says what
 * travels along it, AI and people stops are marked, side exits hang off the stop they leave from, and a feedback loop
 * (if any) runs back under the line. Down the page on narrow screens, across from xl.
 */
export default function ProjectFlow({ flow, loop }: { flow: Project["flow"]; loop?: string }) {
  return (
    <Reveal variant="clip">
      <div style={{ "--n": flow.length } as CSSProperties}>
        <ol className="mx-auto flex max-w-xl flex-col xl:max-w-none xl:flex-row xl:pt-11">
          {flow.map((step, i) => {
            const Icon = icons[step.icon];
            const next = flow[i + 1];
            return (
              <li key={step.label} className="metro-stop flex gap-5 xl:min-w-0 xl:flex-1 xl:flex-col xl:gap-0" style={{ "--i": i } as CSSProperties}>
                {/* The line: this stop, then the leg to the next */}
                <div className="flex shrink-0 flex-col items-center xl:flex-row">
                  <span
                    className={`metro-node relative z-[1] grid h-12 w-12 shrink-0 place-items-center rounded-full ${
                      step.kind === "ai"
                        ? "is-ai bg-grad text-white shadow-[0_10px_26px_-8px_rgb(var(--brand-rgb)/.8)]"
                        : step.kind === "people"
                          ? "border-2 border-sun bg-surface text-sun"
                          : "border border-line-strong bg-surface text-brand-text shadow-[var(--shadow-card)]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {next && <Leg step={step} i={i} />}
                </div>

                {/* The stop */}
                <div className={`min-w-0 flex-1 pt-2.5 xl:pr-6 xl:pt-5 ${next ? "pb-10 xl:pb-0" : ""}`}>
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tabular-nums tracking-[.14em] text-subtle">
                    {String(i + 1).padStart(2, "0")}
                    {step.kind && (
                      <span className={step.kind === "ai" ? "text-brand-text" : "text-ink"}>
                        · {kindLabel[step.kind]}
                      </span>
                    )}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold leading-snug">{step.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{step.detail}</p>
                  {step.exit && (
                    <p className="mt-3 flex gap-2 text-[13px] font-medium leading-snug text-ink">
                      <CornerDownRight className="mt-px h-4 w-4 shrink-0 text-sun" />
                      {step.exit}
                    </p>
                  )}
                  {/* Narrow screens: what travels the leg below, beside it */}
                  {next && step.sends && (
                    <div className="mt-4 space-y-1 text-[12px] font-semibold text-brand-text xl:hidden" aria-hidden="true">
                      <p className="flex items-center gap-1.5"><ArrowDown className="h-3.5 w-3.5 shrink-0" /> {step.sends}</p>
                      {step.returns && <p className="flex items-center gap-1.5 text-subtle"><ArrowUp className="h-3.5 w-3.5 shrink-0" /> {step.returns}</p>}
                    </div>
                  )}
                  {next && step.sends && (
                    <span className="sr-only">
                      Sends {step.sends.toLowerCase()} to {next.label}
                      {step.returns ? `, which sends back ${step.returns.toLowerCase()}` : ""}.
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {loop && (
          <div className="metro-loop">
            <span className="metro-loop-tag">
              <RotateCcw className="h-3.5 w-3.5 shrink-0 text-brand-text" />
              <span className="sr-only">Then back to {flow[0].label}:</span> {loop}
            </span>
          </div>
        )}
      </div>
    </Reveal>
  );
}
