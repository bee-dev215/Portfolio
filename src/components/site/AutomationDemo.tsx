import { useEffect, useState } from "react";
import { Check, CheckCircle2, Loader2, Send, Sparkles, UserCheck } from "lucide-react";
import { prefersReducedMotion, useInView } from "@/hooks/use-motion";
import { company } from "@/data/company";

// Sample hand-offs for the hero demo (illustrative, not real clients)
const SCENES = [
  {
    subject: "Accounts payable · Property management",
    ask: "Every Monday we re-type the vendor invoices from our inbox into QuickBooks. Can you take that over?",
    steps: ["Read the new invoices in the AP inbox", "Matched each vendor and property code", "Checked totals against purchase orders", "Posted the approved bills to QuickBooks"],
    result: "2 invoices need your OK",
  },
  {
    subject: "Daily site report · Construction",
    ask: "Turn my voice note and today's site photos into the daily report for the office.",
    steps: ["Transcribed the voice note from site", "Sorted the photos by area and trade", "Filled in weather, crew and deliveries", "Drafted the daily report"],
    result: "Report ready to review and send",
  },
  {
    subject: "After-hours calls · Clinic",
    ask: "Answer patient calls after we close, and book them straight into the schedule.",
    steps: ["Answered the evening's calls", "Booked new appointments in the schedule", "Took refill requests for the nurse", "Sent the urgent call to the on-call line"],
    result: "Call summaries sent to the front desk",
  },
];

const STEP_MS = 850;

type Stage = "ask" | "work" | "done";

/** Hero demo: a task handed to a Jovano-built agent, worked through step by step, with the exceptions left for a person. */
export default function AutomationDemo() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = prefersReducedMotion();
  const [scene, setScene] = useState(0);
  const [stage, setStage] = useState<Stage>(reduced ? "done" : "ask");
  const [step, setStep] = useState(reduced ? SCENES[0].steps.length : 0); // steps finished so far
  const s = SCENES[scene];

  useEffect(() => {
    if (reduced || !inView) return;
    let t: ReturnType<typeof setTimeout>;
    if (stage === "ask") t = setTimeout(() => setStage("work"), 1100);
    else if (stage === "work") {
      if (step < s.steps.length) t = setTimeout(() => setStep((n) => n + 1), STEP_MS);
      else t = setTimeout(() => setStage("done"), 300);
    } else
      t = setTimeout(() => {
        setScene((n) => (n + 1) % SCENES.length);
        setStep(0);
        setStage("ask");
      }, 4200);
    return () => clearTimeout(t);
  }, [stage, step, s.steps.length, inView, reduced]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[560px]" aria-label="Demo of a repetitive task handed over to software" role="img">
      {/* glow behind the window */}
      <div className="bg-grad absolute -inset-6 -z-10 rounded-[2.5rem] opacity-20 blur-3xl" aria-hidden="true" />

      <div className="card shadow-soft overflow-hidden rounded-3xl" aria-hidden="true">
        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-line bg-raised/60 px-5 py-3.5">
          <span className="flex gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-brand-text" /> {company.shortName} Agent
          </span>
          <span key={scene} className="msg-in ml-auto hidden truncate rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-subtle ring-1 ring-line sm:block">
            {s.subject}
          </span>
        </div>

        <div className="min-h-[320px] space-y-4 px-5 py-6">
          {/* the busywork, in the team's own words */}
          <div key={`q${scene}`} className="msg-in flex justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm leading-relaxed text-canvas shadow-[0_8px_20px_-12px_rgb(var(--shadow-rgb)/.6)]">{s.ask}</p>
          </div>

          {stage !== "ask" && (
            <div key={`a${scene}`} className="msg-in flex items-start gap-3">
              <span className="bg-grad grid h-8 w-8 shrink-0 place-items-center rounded-full text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-line bg-raised/70 px-4 py-3">
                <ol className="space-y-2">
                  {s.steps.map((label, i) => {
                    const done = i < step;
                    const running = stage === "work" && i === step;
                    if (!done && !running) return null;
                    return (
                      <li key={label} className="msg-in flex items-center gap-2.5 text-sm">
                        {done ? (
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                        ) : (
                          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-brand-text" />
                        )}
                        <span className={done ? "text-ink" : "text-subtle"}>{label}</span>
                      </li>
                    );
                  })}
                </ol>
                {/* progress */}
                <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-line">
                  <div className="bg-grad h-full rounded-full transition-[width] duration-500" style={{ width: `${(step / s.steps.length) * 100}%` }} />
                </div>
                {stage === "done" && (
                  <p className="msg-in mt-3 inline-flex items-center gap-1.5 rounded-full bg-sun/15 px-2.5 py-1 text-[11px] font-semibold text-ink-2">
                    <UserCheck className="h-3 w-3 text-sun" /> {s.result}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* composer */}
        <div className="flex items-center gap-3 border-t border-line px-5 py-3.5">
          <span className="flex-1 truncate text-sm text-subtle">Describe a task your team repeats…</span>
          <span className="bg-grad grid h-9 w-9 place-items-center rounded-full text-white">
            <Send className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* floating cards */}
      <div className="card shadow-soft absolute -bottom-14 -left-16 hidden w-56 rounded-2xl p-4 xl:block" aria-hidden="true">
        <p className="text-xs font-semibold text-ink">Waiting for your OK</p>
        <p className="text-[11px] text-subtle">People approve what matters</p>
        <ul className="mt-3 space-y-2">
          {["Invoice over approval limit", "New vendor, no PO"].map((item) => (
            <li key={item} className="flex items-center justify-between gap-2 rounded-lg bg-raised px-2.5 py-1.5 text-[11px] font-medium">
              <span className="truncate">{item}</span>
              <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-canvas">Approve</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card shadow-soft absolute -right-6 -top-9 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-semibold lg:flex" aria-hidden="true">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Works with the tools you have
      </div>
    </div>
  );
}
