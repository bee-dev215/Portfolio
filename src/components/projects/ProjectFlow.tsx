import { CSSProperties, Fragment } from "react";
import {
  Activity, AudioLines, BellRing, BrainCircuit, CalendarCheck, Cloud, CornerDownRight, Database, FileCheck2, FileText,
  FlaskConical, GitBranch, Inbox, Layers, LayoutDashboard, Library, ListChecks, LucideIcon, MessagesSquare, PhoneCall, Plug,
  RefreshCw, RotateCcw, ScanText, Server, Smartphone, Sparkles, UserCheck, UserRound, Workflow,
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

/** The link between two steps: what passes forward and, for two-way links, what comes back, each with a travelling dot. */
function FlowLink({ step, i }: { step: FlowStep; i: number }) {
  const delay = (k: number) => ({ "--d": `${0.8 + i * 0.35 + k}s` }) as CSSProperties;
  return (
    <li className={`flow-link relative shrink-0 ${step.returns ? "is-two-way" : ""}`} aria-hidden="true">
      <span className="flow-lane flow-fwd">
        <span className="flow-dot" style={delay(0)} />
      </span>
      {step.sends && <span className="flow-tag flow-tag-fwd">{step.sends}</span>}
      {step.returns && (
        <>
          <span className="flow-lane flow-back">
            <span className="flow-dot" style={delay(1.3)} />
          </span>
          <span className="flow-tag flow-tag-back">{step.returns}</span>
        </>
      )}
    </li>
  );
}

/**
 * How a project's system fits together, as a left-to-right flow (top-to-bottom below xl).
 * Each link is labelled with what passes along it, two-way links run both ways, side exits sit in the step they leave from,
 * and a feedback loop (if any) runs back under the row from the last step to the first.
 */
export default function ProjectFlow({ flow, loop }: { flow: Project["flow"]; loop?: string }) {
  return (
    <Reveal variant="clip">
      <div className={loop ? "pb-5" : ""} style={{ "--n": flow.length } as CSSProperties}>
        <ol className="mx-auto flex max-w-xl flex-col xl:max-w-none xl:flex-row">
          {flow.map((step, i) => {
            const Icon = icons[step.icon];
            const next = flow[i + 1];
            return (
              <Fragment key={step.label}>
                <li className={`flow-step card relative flex flex-col p-5 xl:min-w-0 xl:flex-1 ${step.kind === "ai" ? "flow-ai" : ""}`} style={{ "--i": i } as CSSProperties}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`flow-icon relative grid h-10 w-10 place-items-center rounded-xl ${step.kind === "ai" ? "bg-grad text-white" : "bg-brand-soft text-brand-text"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    {step.kind === "ai" && (
                      <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand-text">
                        <Sparkles className="h-3 w-3" /> AI
                      </span>
                    )}
                    {step.kind === "people" && (
                      <span className="flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] font-semibold text-ink-2">
                        <UserRound className="h-3 w-3" /> People
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-[11px] font-bold tabular-nums tracking-wider text-subtle">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-display text-lg font-bold leading-snug">{step.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{step.detail}</p>
                  {step.exit && (
                    <div className="mt-auto pt-4">
                      <p className="flex gap-2 border-t border-dashed border-line-strong pt-3 text-[13px] font-medium leading-snug text-ink">
                        <CornerDownRight className="mt-px h-4 w-4 shrink-0 text-sun" />
                        {step.exit}
                      </p>
                    </div>
                  )}
                  {next && step.sends && (
                    <span className="sr-only">
                      Sends {step.sends.toLowerCase()} to {next.label}
                      {step.returns ? `, which sends back ${step.returns.toLowerCase()}` : ""}.
                    </span>
                  )}
                </li>
                {next && <FlowLink step={step} i={i} />}
              </Fragment>
            );
          })}
        </ol>
        {loop && (
          <div className="flow-loop">
            <span className="flow-dot" aria-hidden="true" />
            <span className="flow-loop-tag">
              <RotateCcw className="h-3.5 w-3.5 shrink-0 text-brand-text" />
              <span className="sr-only">Then back to {flow[0].label}:</span> {loop}
            </span>
          </div>
        )}
      </div>
    </Reveal>
  );
}
