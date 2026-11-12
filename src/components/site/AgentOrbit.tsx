import { useEffect, useState } from "react";
import { BookOpen, BrainCircuit, CalendarDays, LucideIcon, Mail, PhoneIncoming, UserCheck, Users } from "lucide-react";
import { prefersReducedMotion } from "@/hooks/use-motion";

interface Node {
  key: string;
  label: string;
  icon: LucideIcon;
  action: string;
  person?: boolean; // the node where a person takes over
}

// The systems an agent works across, clockwise from the right; the last one is the person it hands decisions to
const nodes: Node[] = [
  { key: "inbox", label: "Inbox", icon: Mail, action: "Reads incoming invoices and matches each one to its purchase order" },
  { key: "phone", label: "Phone", icon: PhoneIncoming, action: "Picks up after-hours calls and takes down what the caller needs" },
  { key: "calendar", label: "Calendar", icon: CalendarDays, action: "Finds an open slot, books it and texts the confirmation" },
  { key: "crm", label: "CRM", icon: Users, action: "Logs every call and email against the right customer" },
  { key: "docs", label: "Docs", icon: BookOpen, action: "Answers your team's questions, with the source linked" },
  { key: "you", label: "You", icon: UserCheck, action: "Hands you the judgment calls, with the context to decide", person: true },
];

const SIZE = 520; // SVG units; the figure scales to its container
const C = SIZE / 2;
const RING = 208; // node centres sit on this ring (40% of the size)
const CORE = 70; // spokes start just outside the core disc
const STEP_MS = 2600;

const angle = (i: number) => ((i * 360) / nodes.length) * (Math.PI / 180); // 0 = right, so no node sits top or bottom centre
const at = (i: number, r: number) => ({ x: C + r * Math.cos(angle(i)), y: C + r * Math.sin(angle(i)) });

/** Hero visual: the agent at the centre, wired to the tools it works in; one connection lights up at a time. */
export default function AgentOrbit() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const current = hovered ?? active;
  const node = nodes[current];

  useEffect(() => {
    if (hovered !== null || prefersReducedMotion()) return;
    const t = window.setInterval(() => setActive((i) => (i + 1) % nodes.length), STEP_MS);
    return () => window.clearInterval(t);
  }, [hovered]);

  return (
    <figure
      className="mx-auto w-full max-w-[520px]"
      role="img"
      aria-label="An AI agent connected to your inbox, phone, calendar, CRM and documents, handing the judgment calls to a person."
    >
      <div className="relative aspect-square w-full" aria-hidden="true">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <radialGradient id="orbit-glow">
              <stop offset="0" stopColor="rgb(var(--brand-rgb))" stopOpacity=".28" />
              <stop offset="1" stopColor="rgb(var(--brand-rgb))" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={C} cy={C} r={RING * 0.9} fill="url(#orbit-glow)" />

          {/* Rings: the outer one carries the nodes, both turn slowly with a satellite riding each */}
          <g className="orbit-spin">
            <circle cx={C} cy={C} r={RING} fill="none" className="stroke-line" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
            <circle cx={C + RING} cy={C} r="4" className="fill-sky2" />
          </g>
          <g className="orbit-spin orbit-spin-rev">
            <circle cx={C} cy={C} r={RING * 0.58} fill="none" className="stroke-line" strokeWidth="1.5" />
            <circle cx={C} cy={C - RING * 0.58} r="3.5" className="fill-iris" />
          </g>

          {/* Spokes: the active one lights up and carries a packet out to its node */}
          {nodes.map((n, i) => {
            const a = at(i, CORE);
            const b = at(i, RING - 34);
            const on = i === current;
            return (
              <g key={n.key}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={on ? 2 : 1.5} className={`transition-[stroke] duration-500 ${on ? (n.person ? "stroke-sun" : "stroke-brand") : "stroke-line"}`} />
                {on && (
                  <line
                    key={`packet-${current}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    pathLength={100}
                    strokeWidth="6"
                    strokeLinecap="round"
                    className={`orbit-packet ${n.person ? "stroke-sun" : "stroke-sky2"}`}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Core: the agent */}
        <div className="absolute left-1/2 top-1/2 grid h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center">
          <span className="orbit-pulse bg-grad absolute inset-0 rounded-full" />
          <span className="orbit-pulse bg-grad absolute inset-0 rounded-full" style={{ animationDelay: "-1.6s" }} />
          <span className="bg-grad relative grid h-full w-full place-items-center rounded-full text-white shadow-[0_18px_50px_-12px_rgb(var(--iris-rgb)/.7)] ring-[6px] ring-surface/70">
            <span className="flex flex-col items-center gap-1">
              <BrainCircuit className="h-[clamp(22px,6vw,34px)] w-[clamp(22px,6vw,34px)]" strokeWidth={1.75} />
              <span className="font-display text-[clamp(10px,2.4vw,13px)] font-bold tracking-wide">AI agent</span>
            </span>
          </span>
        </div>

        {/* Nodes: the tools the agent works in */}
        {nodes.map((n, i) => {
          const p = at(i, RING);
          const on = i === current;
          return (
            <div
              key={n.key}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
              style={{ left: `${(p.x / SIZE) * 100}%`, top: `${(p.y / SIZE) * 100}%` }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
              onPointerLeave={() => {
                if (hovered === null) return;
                setActive(hovered);
                setHovered(null);
              }}
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl border transition-all duration-500 sm:h-14 sm:w-14 ${
                  on
                    ? `scale-110 border-transparent text-white ${n.person ? "bg-sun shadow-[0_12px_30px_-8px_rgb(var(--sun-rgb)/.8)]" : "bg-grad shadow-[0_12px_30px_-8px_rgb(var(--brand-rgb)/.8)]"}`
                    : `glass border-line shadow-soft ${n.person ? "text-sun" : "text-brand-text"}`
                }`}
              >
                <n.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-[.14em] transition-colors sm:text-[12px] ${on ? "text-ink" : "text-subtle"}`}>{n.label}</span>
            </div>
          );
        })}
      </div>

      {/* What the agent is doing there */}
      <figcaption className="mx-auto mt-3 min-h-[3.5rem] max-w-[400px] text-center" aria-hidden="true">
        <p key={node.key} className="msg-in text-[15px] leading-snug text-ink-2">
          <span className={`font-bold ${node.person ? "text-ink" : "text-brand-text"}`}>{node.label} · </span>
          {node.action}
        </p>
      </figcaption>
    </figure>
  );
}
