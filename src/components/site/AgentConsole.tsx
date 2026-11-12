import { useEffect, useState } from "react";
import { BookOpen, Check, FileText, LucideIcon, PhoneIncoming, UserCheck } from "lucide-react";
import { prefersReducedMotion } from "@/hooks/use-motion";

interface Step {
  label: string;
  detail: string;
  person?: boolean; // a step where a person reads or decides
}

interface Scene {
  key: string;
  tab: string;
  icon: LucideIcon;
  trigger: string;
  steps: Step[];
  done: string;
}

// Scripted illustrations: the businesses, documents and figures are invented
const scenes: Scene[] = [
  {
    key: "documents",
    tab: "Invoices",
    icon: FileText,
    trigger: "invoice_2291.pdf arrived in the accounts inbox",
    steps: [
      { label: "Read", detail: "Vendor, PO number and 6 line items extracted" },
      { label: "Check", detail: "Matched to PO-4471 — quantities and totals agree" },
      { label: "Flag", detail: "Line 4 price differs from the contract rate" },
      { label: "Review", detail: "Sent to Dana with the difference highlighted", person: true },
    ],
    done: "Draft bill waiting for approval in accounting",
  },
  {
    key: "calls",
    tab: "Calls",
    icon: PhoneIncoming,
    trigger: "Incoming call at 7:42 pm, after hours",
    steps: [
      { label: "Listen", detail: "Caller wants to move Thursday's appointment" },
      { label: "Check", detail: "Friday 10:30 and 2:00 are open in the calendar" },
      { label: "Book", detail: "Moved to Friday 10:30 — confirmation texted" },
      { label: "Hand off", detail: "Question about an invoice left for the team", person: true },
    ],
    done: "Call summary filed for the morning",
  },
  {
    key: "knowledge",
    tab: "Questions",
    icon: BookOpen,
    trigger: "Slack: “Can annual plans be refunded after 30 days?”",
    steps: [
      { label: "Search", detail: "4 passages in documents this person can open" },
      { label: "Answer", detail: "Pro-rated refunds within 60 days of renewal" },
      { label: "Cite", detail: "Refund policy v3, section 2.1 — linked" },
      { label: "Escalate", detail: "Exception requests go to the billing lead", person: true },
    ],
    done: "Answered in the thread, with the source",
  },
];

const STEP_MS = 1100;
const HOLD_MS = 3600;

/** Hero visual: an AI agent working through a task step by step, then handing the judgment call to a person. */
export default function AgentConsole() {
  const [scene, setScene] = useState(0);
  const [step, setStep] = useState(() => (prefersReducedMotion() ? scenes[0].steps.length : 0));
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const current = scenes[scene];
  const finished = step >= current.steps.length;

  // Reveal one step at a time; once the task is done, hold, then move to the next scene
  useEffect(() => {
    if (paused) return;
    if (!finished) {
      const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 700 : STEP_MS);
      return () => window.clearTimeout(t);
    }
    if (!auto || prefersReducedMotion()) return;
    const t = window.setTimeout(() => {
      setScene((i) => (i + 1) % scenes.length);
      setStep(0);
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [step, finished, auto, paused]);

  const pick = (i: number) => {
    setAuto(false);
    setScene(i);
    setStep(prefersReducedMotion() ? scenes[i].steps.length : 0);
  };

  return (
    <div
      className="card shadow-soft relative overflow-hidden rounded-[28px]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Window bar */}
      <div className="flex items-center gap-3 border-b border-line bg-raised/50 px-5 py-3.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="font-mono text-[11px] font-medium text-subtle">agent · live run</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-subtle">
          <span className="live-dot" /> Illustrative
        </span>
      </div>

      {/* Scenes */}
      <div className="flex gap-1 border-b border-line px-3 pt-3" role="tablist" aria-label="Example tasks">
        {scenes.map((s, i) => {
          const on = i === scene;
          return (
            <button
              key={s.key}
              role="tab"
              aria-selected={on}
              onClick={() => pick(i)}
              className={`relative flex items-center gap-2 rounded-t-xl px-3.5 pb-3 pt-2 text-[13px] font-semibold transition-colors ${on ? "text-brand-text" : "text-subtle hover:text-ink"}`}
            >
              <s.icon className="h-4 w-4" />
              {s.tab}
              {on && <span className="bg-grad absolute inset-x-2 -bottom-px h-0.5 rounded-full" />}
            </button>
          );
        })}
      </div>

      <div key={current.key} className="min-h-[372px] p-5 sm:p-6" role="tabpanel" aria-live="polite">
        {/* Trigger */}
        <div className="msg-in flex items-center gap-3 rounded-2xl border border-line bg-raised/50 px-4 py-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface text-brand-text shadow-sm">
            <current.icon className="h-4 w-4" />
          </span>
          <p className="min-w-0 text-[13.5px] font-medium leading-snug text-ink">{current.trigger}</p>
        </div>

        {/* Steps */}
        <ol className="relative mt-4 space-y-2.5 pl-1">
          <span className="absolute bottom-3 left-[19px] top-3 w-px bg-line" aria-hidden="true" />
          {current.steps.map((st, i) => {
            if (i > step) return null;
            const working = i === step && !finished;
            return (
              <li key={st.label} className="msg-in relative flex items-start gap-3">
                <span
                  className={`relative z-[1] mt-0.5 grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full text-white ${
                    working ? "border border-line bg-surface text-subtle" : st.person ? "bg-sun" : "bg-grad"
                  }`}
                >
                  {working ? (
                    <span className="typing flex gap-0.5 text-brand-text" aria-label="Working">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : st.person ? (
                    <UserCheck className="h-3.5 w-3.5" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0 pt-1">
                  <p className={`text-[11px] font-bold uppercase tracking-[.14em] ${st.person && !working ? "text-ink" : "text-subtle"}`}>
                    {st.label}
                    {st.person && !working && <span className="ml-2 rounded-full bg-sun/15 px-2 py-0.5 text-[10px] tracking-wider text-ink">A person decides</span>}
                  </p>
                  <p className={`mt-0.5 text-[14px] leading-snug transition-opacity ${working ? "opacity-40" : "text-ink-2"}`}>{st.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Result */}
        {finished && (
          <div className="msg-in mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
              <Check className="h-3.5 w-3.5" />
            </span>
            <p className="text-[13.5px] font-semibold text-emerald-800 [[data-theme=dark]_&]:text-emerald-300">{current.done}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3 text-[12px] text-subtle">
        <span>Every step logged</span>
        <span className="flex gap-1.5" aria-hidden="true">
          {scenes.map((s, i) => (
            <i key={s.key} className={`h-1.5 rounded-full transition-all duration-500 ${i === scene ? "bg-grad w-5" : "w-1.5 bg-subtle/40"}`} />
          ))}
        </span>
      </div>
    </div>
  );
}
