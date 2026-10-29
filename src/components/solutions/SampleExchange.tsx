import { useEffect, useRef, useState } from "react";
import {
  AudioLines,
  Briefcase,
  ClipboardCheck,
  FileText,
  HardHat,
  Headset,
  Info,
  LucideIcon,
  Pause,
  PhoneCall,
  Play,
  RotateCcw,
  SkipForward,
  Sparkles,
  User,
  UserRound,
} from "lucide-react";
import { SampleTurn, TurnRole } from "@/data/solution-details";
import { prefersReducedMotion, useInView } from "@/hooks/use-motion";

/**
 * How each role looks: the AI ("ai") and the business's own team ("team") speak from the left,
 * the people using the tool ("person") from the right, and system notes sit in the middle.
 */
type Kind = "ai" | "team" | "person" | "system";

const roleMeta: Record<TurnRole, { label: string; icon: LucideIcon; kind: Kind }> = {
  assistant: { label: "Assistant", icon: Sparkles, kind: "ai" },
  agent: { label: "AI voice agent", icon: AudioLines, kind: "ai" },
  support: { label: "Support team", icon: Headset, kind: "team" },
  caller: { label: "Caller", icon: PhoneCall, kind: "person" },
  customer: { label: "Customer", icon: User, kind: "person" },
  staff: { label: "Staff", icon: UserRound, kind: "person" },
  reviewer: { label: "Reviewer", icon: ClipboardCheck, kind: "person" },
  supervisor: { label: "Supervisor", icon: HardHat, kind: "person" },
  manager: { label: "Manager", icon: Briefcase, kind: "person" },
  system: { label: "System", icon: Info, kind: "system" },
};

const isLeft = (r: TurnRole) => roleMeta[r].kind === "ai" || roleMeta[r].kind === "team";

const avatarStyle: Record<Kind, string> = {
  ai: "bg-grad text-white",
  team: "border border-brand/30 bg-brand-soft text-brand-text",
  person: "border border-line bg-surface text-ink-2",
  system: "",
};

function Turn({ turn }: { turn: SampleTurn }) {
  const meta = roleMeta[turn.role];
  const Icon = meta.icon;
  const name = turn.name ?? meta.label;

  if (meta.kind === "system") {
    return (
      <li className="msg-in flex justify-center">
        <div className="max-w-[90%] rounded-2xl border border-dashed border-line bg-raised/60 px-4 py-2.5 text-center text-[13px] leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">{name} · </span>
          {turn.text}
          {turn.chips && <Chips chips={turn.chips} center />}
        </div>
      </li>
    );
  }

  const left = isLeft(turn.role);
  return (
    <li className={`msg-in flex items-end gap-2.5 ${left ? "" : "flex-row-reverse"}`}>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${avatarStyle[meta.kind]}`} aria-hidden="true">
        <Icon className="h-4 w-4" />
      </span>
      <div className={`flex min-w-0 max-w-[82%] flex-col ${left ? "items-start" : "items-end"}`}>
        <span className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-subtle">{name}</span>
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
            left ? "rounded-bl-md border border-line bg-surface text-ink" : "rounded-br-md bg-brand-soft text-ink"
          }`}
        >
          {turn.text}
          {turn.chips && <Chips chips={turn.chips} />}
          {turn.sources && (
            <ul className="mt-3 space-y-1 border-t border-line pt-2.5">
              {turn.sources.map((s) => (
                <li key={s} className="flex items-center gap-1.5 text-xs text-subtle">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-brand-text" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

function Chips({ chips, center = false }: { chips: string[]; center?: boolean }) {
  return (
    <span className={`mt-2.5 flex flex-wrap gap-1.5 ${center ? "justify-center" : ""}`}>
      {chips.map((c) => (
        <span key={c} className="chip border-brand/20 bg-brand-soft px-2.5 py-0.5 text-[11px] text-brand-text">
          {c}
        </span>
      ))}
    </span>
  );
}

/**
 * A scripted conversation that plays itself turn by turn once it scrolls into view, with a typing indicator,
 * play/pause, step and replay. Under reduced motion every turn is shown at once.
 */
export default function SampleExchange({ title, context, turns }: { title: string; context: string; turns: SampleTurn[] }) {
  const n = turns.length;
  const reduced = useRef(prefersReducedMotion()).current;
  const [count, setCount] = useState(reduced ? n : 0);
  const [typing, setTyping] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hostRef, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const logRef = useRef<HTMLOListElement>(null);
  const started = useRef(false);

  // Start playing the first time the sample is on screen
  useEffect(() => {
    if (inView && !started.current && !reduced) {
      started.current = true;
      setPlaying(true);
    }
  }, [inView, reduced]);

  // The playback clock: a pause to "read" the last turn, then a typing indicator, then the next turn
  useEffect(() => {
    if (!playing) return;
    if (count >= n) {
      setPlaying(false);
      return;
    }
    const prev = turns[count - 1];
    const t = typing
      ? window.setTimeout(() => {
          setTyping(false);
          setCount((c) => c + 1);
        }, 850)
      : window.setTimeout(() => setTyping(true), count === 0 ? 300 : Math.min(2400, 700 + (prev?.text.length ?? 0) * 12));
    return () => window.clearTimeout(t);
  }, [playing, typing, count, n, turns]);

  // Keep the newest turn in view inside the log (without scrolling the page)
  useEffect(() => {
    const el = logRef.current;
    if (el && count > 0) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [count, typing, reduced]);

  const done = count >= n;
  const next = turns[count];

  const step = () => {
    setPlaying(false);
    setTyping(false);
    setCount((c) => Math.min(n, c + 1));
  };

  const replay = () => {
    setTyping(false);
    if (reduced) {
      setCount(n);
      return;
    }
    setCount(0);
    setPlaying(true);
  };

  const toggle = () => {
    if (done) replay();
    else setPlaying((p) => !p);
  };

  const ctrl =
    "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink-2 transition-colors hover:border-brand/40 hover:text-brand-text disabled:pointer-events-none disabled:opacity-40";

  return (
    <div ref={hostRef} className="card shadow-soft relative overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text">Sample interaction — scripted for illustration</p>
          <h3 className="mt-1 font-display text-lg font-bold">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-subtle">{context}</p>
        </div>
        <span className="shrink-0 rounded-full bg-raised px-3 py-1 text-xs font-semibold tabular-nums text-ink-2" aria-live="off">
          {count} / {n}
        </span>
      </div>

      <ol ref={logRef} className="relative h-[460px] space-y-4 overflow-y-auto overscroll-contain bg-canvas/40 px-4 py-6 sm:px-7" aria-live="polite" aria-label={`${title} — conversation`}>
        {turns.slice(0, count).map((t, i) => (
          <Turn key={i} turn={t} />
        ))}
        {typing && next && (
          <li className={`msg-in flex items-center gap-2.5 ${roleMeta[next.role].kind === "system" ? "justify-center" : isLeft(next.role) ? "" : "flex-row-reverse"}`}>
            <span className="typing inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3.5 py-2.5 text-subtle" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="sr-only">{next.name ?? roleMeta[next.role].label} is typing</span>
          </li>
        )}
        {count === 0 && !typing && (
          <li className="grid h-full place-items-center text-sm text-subtle">
            <button onClick={toggle} className="btn btn-secondary px-5 py-2.5 text-sm">
              <Play className="h-4 w-4" /> Play the sample
            </button>
          </li>
        )}
      </ol>

      <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3.5 sm:px-7">
        <button onClick={toggle} className={ctrl} aria-label={playing ? "Pause" : done ? "Replay" : "Play"}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : done ? "Play again" : "Play"}
        </button>
        <button onClick={step} disabled={done} className={ctrl} aria-label="Show next turn">
          <SkipForward className="h-4 w-4" /> Step
        </button>
        <button onClick={replay} disabled={count === 0} className={ctrl} aria-label="Restart from the beginning">
          <RotateCcw className="h-4 w-4" /> Replay
        </button>
        <div className="ml-auto hidden h-1.5 w-32 overflow-hidden rounded-full bg-raised sm:block" aria-hidden="true">
          <div className="h-full rounded-full bg-grad transition-[width] duration-500" style={{ width: `${(count / n) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
