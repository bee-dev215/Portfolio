import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Bell, Check, PlayCircle, Search, Send } from "lucide-react";
import { company, workspaceFeatures, WorkspaceKey } from "@/data/company";
import { prefersReducedMotion, useInView } from "@/hooks/use-motion";
import { Monogram } from "./Navbar";
import { workspaceIcons } from "./icons";
import Reveal, { SectionHeading } from "./Reveal";

// ------------------------------------------------------------
//  The six views of the mock workspace. Sample data only.
// ------------------------------------------------------------

const tile = "rounded-2xl border border-line bg-surface p-4";
const label = "text-[11px] font-semibold uppercase tracking-wider text-subtle";

function Overview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {[
          { k: "Hours this period", v: "46.5", s: "of 80 planned" },
          { k: "Tasks done", v: "18", s: "3 due this week" },
          { k: "Next payday", v: "4 days", s: "Payslip ready on the day" },
        ].map((x) => (
          <div key={x.k} className={tile}>
            <p className={label}>{x.k}</p>
            <p className="mt-1.5 font-display text-2xl font-medium tracking-[-0.015em]">{x.v}</p>
            <p className="mt-0.5 text-[11px] text-subtle">{x.s}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1.3fr_1fr] gap-3">
        <div className={tile}>
          <p className={label}>Today</p>
          <ul className="mt-3 space-y-2.5">
            {[
              { t: "09:00", n: "Shift · Customer chat", c: "bg-brand" },
              { t: "11:30", n: "Team stand-up", c: "bg-iris" },
              { t: "15:00", n: "Coaching with your lead", c: "bg-sky2" },
            ].map((e) => (
              <li key={e.t} className="flex items-center gap-3 text-[13px]">
                <span className="w-10 font-mono text-[11px] text-subtle">{e.t}</span>
                <span className={`h-6 w-1 rounded-full ${e.c}`} />
                <span className="font-semibold">{e.n}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={tile}>
          <p className={label}>Level progress</p>
          <p className="mt-1.5 font-display text-base font-bold">Associate → Specialist</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-raised">
            <div className="bg-grad h-full w-[68%] rounded-full" />
          </div>
          <p className="mt-2 text-[11px] text-subtle">1 review to go · next in 3 weeks</p>
        </div>
      </div>
    </div>
  );
}

function Schedule() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  // [day, start row, length, kind]
  const blocks: [number, number, number, "shift" | "meet" | "free"][] = [
    [0, 0, 4, "shift"], [1, 1, 3, "shift"], [2, 0, 2, "free"], [2, 3, 1, "meet"], [3, 0, 4, "shift"], [4, 2, 3, "shift"], [1, 5, 1, "meet"], [4, 0, 1, "meet"],
  ];
  const kind = { shift: "bg-grad text-white", meet: "bg-iris/15 text-iris border border-iris/30", free: "border border-dashed border-line-strong text-subtle" };
  const name = { shift: "Shift", meet: "Team call", free: "Available" };
  return (
    <div className={tile}>
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">This week · your time zone</p>
        <span className="chip text-[11px]">GMT+8</span>
      </div>
      <div className="mt-3 grid grid-cols-[34px_repeat(5,1fr)] gap-1.5">
        <span />
        {days.map((d) => (
          <span key={d} className="text-center text-[11px] font-semibold text-subtle">{d}</span>
        ))}
        <div className="grid grid-rows-6 gap-1.5 text-[10px] text-subtle">
          {["09", "10", "11", "12", "13", "14"].map((h) => (
            <span key={h} className="flex h-7 items-start font-mono">{h}:00</span>
          ))}
        </div>
        {days.map((d, di) => (
          <div key={d} className="relative grid grid-rows-6 gap-1.5">
            {Array.from({ length: 6 }).map((_, r) => (
              <span key={r} className="h-7 rounded-md bg-raised/60" />
            ))}
            {blocks
              .filter((b) => b[0] === di)
              .map(([, start, len, k], i) => (
                <span
                  key={i}
                  className={`absolute inset-x-0 rounded-md px-1.5 py-1 text-[10px] font-semibold leading-tight ${kind[k]}`}
                  style={{ top: `calc(${start} * (1.75rem + 0.375rem))`, height: `calc(${len} * 1.75rem + ${len - 1} * 0.375rem)` }}
                >
                  {name[k]}
                </span>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Tasks() {
  const tasks = [
    { t: "Reply to the 12 open tickets in the billing queue", p: "High", d: "Today", done: false },
    { t: "Update the refunds article in the help centre", p: "Medium", d: "Tomorrow", done: false },
    { t: "Write up the export bug with steps to reproduce", p: "High", d: "Today", done: true },
    { t: "Finish the “Tone of voice” course", p: "Low", d: "Fri", done: false },
    { t: "Hand-over note for the evening shift", p: "Medium", d: "Today", done: true },
  ];
  const pill = { High: "bg-rose-500/12 text-rose-500", Medium: "bg-sun/15 text-amber-600 dark:text-sun", Low: "bg-raised text-subtle" } as const;
  return (
    <div className={`${tile} p-0`}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="font-display text-sm font-bold">My tasks</p>
        <span className="text-[11px] text-subtle">2 of 5 done</span>
      </div>
      <ul className="divide-y divide-line">
        {tasks.map((x) => (
          <li key={x.t} className="flex items-center gap-3 px-4 py-2.5">
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${x.done ? "bg-grad border-transparent text-white" : "border-line-strong"}`}>
              {x.done && <Check className="h-3 w-3" />}
            </span>
            <span className={`flex-1 truncate text-[13px] ${x.done ? "text-subtle line-through" : "font-medium"}`}>{x.t}</span>
            <span className={`hidden rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline ${pill[x.p as keyof typeof pill]}`}>{x.p}</span>
            <span className="w-14 text-right text-[11px] text-subtle">{x.d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Payments() {
  const lines = [
    { k: "Base pay · 80 h", v: "$960.00" },
    { k: "Weekend shifts · 6 h", v: "$108.00" },
    { k: "Quality bonus", v: "$75.00" },
    { k: "Transfer fee (Wise)", v: "−$4.20" },
  ];
  return (
    <div className="grid grid-cols-[1.25fr_1fr] gap-3">
      <div className={tile}>
        <div className="flex items-center justify-between">
          <p className="font-display text-sm font-bold">Payslip · 1–15 Nov</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <BadgeCheck className="h-3 w-3" /> Paid on time
          </span>
        </div>
        <ul className="mt-3 space-y-2 text-[13px]">
          {lines.map((l) => (
            <li key={l.k} className="flex justify-between gap-3">
              <span className="text-ink-2">{l.k}</span>
              <span className="font-mono tabular-nums">{l.v}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-line pt-3 font-display font-bold">
          <span>Total paid</span>
          <span className="font-mono tabular-nums">$1,138.80</span>
        </div>
      </div>
      <div className={tile}>
        <p className={label}>History</p>
        <ul className="mt-3 space-y-2.5">
          {["16–31 Oct", "1–15 Oct", "16–30 Sep", "1–15 Sep"].map((p) => (
            <li key={p} className="flex items-center gap-2 text-[12px]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/12 text-emerald-500">
                <Check className="h-3 w-3" />
              </span>
              <span className="flex-1">{p}</span>
              <span className="text-subtle">On time</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Chat() {
  const msgs = [
    { me: false, who: "Team lead", t: "Morning! The billing queue is busy today — can you take the first two hours there?" },
    { me: true, who: "You", t: "On it. I'll flag anything that looks like the export bug from yesterday." },
    { me: false, who: "Team lead", t: "Perfect, thank you. Great work on that bug report, by the way — engineering fixed it in an hour. 🙌" },
  ];
  return (
    <div className={`${tile} flex h-full flex-col`}>
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <span className="live-dot" />
        <p className="font-display text-sm font-bold">Support team</p>
        <span className="text-[11px] text-subtle">· 6 members</span>
      </div>
      <ul className="flex-1 space-y-2.5 py-3">
        {msgs.map((m, i) => (
          <li key={i} className={`msg-in flex ${m.me ? "justify-end" : ""}`} style={{ animationDelay: `${i * 0.25}s` }}>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${m.me ? "bg-grad rounded-br-md text-white" : "rounded-bl-md bg-raised"}`}>
              <p className={`text-[10px] font-bold ${m.me ? "text-white/75" : "text-subtle"}`}>{m.who}</p>
              {m.t}
            </div>
          </li>
        ))}
        <li className="msg-in flex" style={{ animationDelay: ".8s" }}>
          <span className="typing inline-flex gap-1 rounded-2xl bg-raised px-3 py-2.5 text-subtle">
            <i />
            <i />
            <i />
          </span>
        </li>
      </ul>
      <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-subtle">
        <span className="flex-1">Write a message…</span>
        <span className="bg-grad grid h-6 w-6 place-items-center rounded-full text-white">
          <Send className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

function Learning() {
  const courses = [
    { t: "Welcome to the team", m: "6 lessons", p: 100 },
    { t: "Your client's product, end to end", m: "12 lessons", p: 75 },
    { t: "Tone of voice in writing", m: "5 lessons", p: 40 },
    { t: "Handling difficult conversations", m: "8 lessons", p: 0 },
  ];
  return (
    <div className={tile}>
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">Your learning path</p>
        <span className="chip text-[11px]">Counts toward Level 2</span>
      </div>
      <ul className="mt-3 space-y-3">
        {courses.map((c) => (
          <li key={c.t} className="flex items-center gap-3">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${c.p === 100 ? "bg-emerald-500/12 text-emerald-500" : "bg-brand-soft text-brand-text"}`}>
              {c.p === 100 ? <Check className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2 text-[13px]">
                <span className="truncate font-semibold">{c.t}</span>
                <span className="shrink-0 text-[11px] text-subtle">{c.m}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-raised">
                <div className="bg-grad h-full rounded-full transition-[width] duration-700" style={{ width: `${c.p}%` }} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const views: Record<WorkspaceKey, () => JSX.Element> = {
  overview: Overview,
  schedule: Schedule,
  tasks: Tasks,
  payments: Payments,
  chat: Chat,
  learning: Learning,
};

// ------------------------------------------------------------

/** The app window: sidebar, top bar and the chosen view. */
function Window({ active, onPick }: { active: WorkspaceKey; onPick: (k: WorkspaceKey) => void }) {
  const View = views[active];
  const feature = workspaceFeatures.find((f) => f.key === active)!;
  return (
    <div className="ws-window overflow-hidden rounded-[1.4rem] border border-line bg-canvas shadow-[0_30px_70px_-30px_rgb(15_31_61/.4)]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 hidden flex-1 items-center gap-2 rounded-full bg-raised px-3 py-1 text-[11px] text-subtle sm:flex">
          <Search className="h-3 w-3" /> {company.shortName} Workspace / {feature.title}
        </span>
        <span className="ml-auto rounded-full bg-sun/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-sun">Sample data</span>
      </div>
      <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[64px_1fr]">
        {/* sidebar */}
        <nav className="flex flex-col items-center gap-2 border-r border-line bg-surface py-4" aria-label="Workspace views">
          <Monogram className="mb-2 h-8 w-8" />
          {workspaceFeatures.map((f) => {
            const Icon = workspaceIcons[f.key];
            const on = f.key === active;
            return (
              <button
                key={f.key}
                onClick={() => onPick(f.key)}
                aria-label={f.title}
                aria-pressed={on}
                className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${on ? "bg-grad text-white shadow-[0_8px_18px_-8px_rgb(var(--brand-rgb)/.8)]" : "text-subtle hover:bg-raised hover:text-ink"}`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </button>
            );
          })}
        </nav>
        {/* main */}
        <div className="min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-medium tracking-[-0.015em]">{feature.title}</p>
              <p className="truncate text-[12px] text-subtle">Good morning, Sam · Customer Support · Level 1</p>
            </div>
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-2">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </span>
          </div>
          <div key={active} className="ws-view min-h-[296px]">
            <View />
          </div>
        </div>
      </div>
    </div>
  );
}

/** The member workspace in Timeline's tab format: pill tabs, then one large card with the feature on the left and the
 * live mock-up on the right. It tours the tabs on its own until the reader picks one. */
export default function Workspace() {
  const [active, setActive] = useState<WorkspaceKey>("overview");
  const [touched, setTouched] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const hovering = useRef(false);
  const feature = workspaceFeatures.find((f) => f.key === active)!;

  useEffect(() => {
    if (!inView || touched || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (hovering.current) return;
      setActive((cur) => {
        const i = workspaceFeatures.findIndex((f) => f.key === cur);
        return workspaceFeatures[(i + 1) % workspaceFeatures.length].key;
      });
    }, 5000);
    return () => window.clearInterval(id);
  }, [inView, touched]);

  const pick = (k: WorkspaceKey) => {
    setTouched(true);
    setActive(k);
  };

  return (
    <section id="workspace" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          split
          label="Your workspace"
          title={
            <>
              One place for your <span className="gradient-text">whole remote career.</span>
            </>
          }
        >
          <p className="text-lg leading-relaxed text-ink-2">
            From your first day you get your own workspace: your schedule, your tasks, your team and every payslip — in your time zone, on any device.
          </p>
        </SectionHeading>

        <Reveal delay={100}>
          <div className="-mx-5 mt-12 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2.5" role="tablist" aria-label="Workspace features">
              {workspaceFeatures.map((f) => {
                const on = f.key === active;
                return (
                  <button
                    key={f.key}
                    role="tab"
                    aria-selected={on}
                    aria-controls="workspace-panel"
                    onClick={() => pick(f.key)}
                    className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-[15px] font-medium transition-colors ${
                      on ? "border-ink bg-ink text-canvas" : "border-line-strong bg-surface text-ink hover:border-ink"
                    }`}
                  >
                    {f.title}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* The panel tips up from a 3D tilt and settles flat as it scrolls in */}
        <div data-scroll="settle" className="scroll-tilt-host">
        <div
          ref={ref}
          id="workspace-panel"
          role="tabpanel"
          onPointerEnter={() => (hovering.current = true)}
          onPointerLeave={() => (hovering.current = false)}
          className="scroll-tilt card mt-5 grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:p-12"
        >
          <div key={active} className="ws-view">
            <h3 className="font-display text-[clamp(1.7rem,3vw,2.3rem)] font-normal leading-tight tracking-[-0.015em] text-ink">{feature.headline}</h3>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{feature.desc}</p>
            <ul className="mt-7 space-y-3.5">
              {feature.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-ink">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgb(var(--iris-rgb)/.18),transparent)]" aria-hidden="true" />
            <Window active={active} onPick={pick} />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
