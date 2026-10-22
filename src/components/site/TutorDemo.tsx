import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Lightbulb, Send, Sparkles } from "lucide-react";
import { prefersReducedMotion, useInView } from "@/hooks/use-motion";
import { company } from "@/data/company";

// Sample conversations for the hero demo (illustrative, not real users)
const SCENES = [
  {
    subject: "Algebra I · Unit 3",
    student: "Why does x² = 9 have two answers?",
    tutor: "Good question! Which numbers give 9 when you multiply them by themselves? Try 3 × 3 — then try (−3) × (−3). What do you notice?",
    source: "Lesson 3.2 · Square roots",
  },
  {
    subject: "Biology · Cell division",
    student: "What's the difference between mitosis and meiosis?",
    tutor: "Let's compare them. Mitosis makes two identical cells for growth and repair. Meiosis makes four cells with half the chromosomes. Which one do you think creates genetic variety?",
    source: "Unit 5 · Cell division",
  },
  {
    subject: "Chemistry · Reactions",
    student: "Is rusting a chemical or a physical change?",
    tutor: "Here's a hint: once iron has rusted, can you get the original iron back just by drying or cooling it? If a new substance forms, what kind of change is that?",
    source: "Unit 2 · Chemical changes",
  },
];

const MASTERY = [
  { topic: "Linear eq.", v: 86 },
  { topic: "Inequalities", v: 72 },
  { topic: "Quadratics", v: 58 },
  { topic: "Functions", v: 67 },
  { topic: "Graphs", v: 79 },
];

type Stage = "ask" | "think" | "type" | "done";

/** Hero product demo: an AI tutor conversation that plays through a few subjects. */
export default function TutorDemo() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = prefersReducedMotion();
  const [scene, setScene] = useState(0);
  const [stage, setStage] = useState<Stage>(reduced ? "done" : "ask");
  const [chars, setChars] = useState(reduced ? SCENES[0].tutor.length : 0);
  const s = SCENES[scene];

  useEffect(() => {
    if (reduced || !inView) return;
    let t: ReturnType<typeof setTimeout>;
    if (stage === "ask") t = setTimeout(() => setStage("think"), 700);
    else if (stage === "think") t = setTimeout(() => setStage("type"), 1100);
    else if (stage === "type") {
      if (chars < s.tutor.length) t = setTimeout(() => setChars((c) => Math.min(s.tutor.length, c + 2)), 22);
      else t = setTimeout(() => setStage("done"), 200);
    } else
      t = setTimeout(() => {
        setScene((n) => (n + 1) % SCENES.length);
        setChars(0);
        setStage("ask");
      }, 4200);
    return () => clearTimeout(t);
  }, [stage, chars, s.tutor.length, inView, reduced]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[560px]" aria-label="Demo of an AI tutor conversation" role="img">
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
            <Sparkles className="h-4 w-4 text-brand-text" /> {company.shortName} Tutor
          </span>
          <span key={scene} className="msg-in ml-auto rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-subtle ring-1 ring-line">
            {s.subject}
          </span>
        </div>

        {/* conversation */}
        <div className="min-h-[300px] space-y-4 px-5 py-6 sm:min-h-[290px]">
          <div key={`q${scene}`} className="msg-in flex justify-end">
            <p className="max-w-[80%] rounded-2xl rounded-br-md bg-grad px-4 py-2.5 text-sm leading-relaxed text-white shadow-[0_8px_20px_-10px_rgb(var(--brand-rgb)/.7)]">{s.student}</p>
          </div>

          {stage !== "ask" && (
            <div key={`a${scene}`} className="msg-in flex items-start gap-3">
              <span className="bg-grad grid h-8 w-8 shrink-0 place-items-center rounded-full text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="max-w-[85%]">
                <div className="rounded-2xl rounded-tl-md border border-line bg-raised/70 px-4 py-3 text-sm leading-relaxed text-ink">
                  {stage === "think" ? (
                    <span className="typing flex items-center gap-1 py-1 text-subtle">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <span className={stage === "type" ? "caret" : ""}>{s.tutor.slice(0, chars)}</span>
                  )}
                </div>
                {stage === "done" && (
                  <div className="msg-in mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand-text">
                      <BookOpen className="h-3 w-3" /> {s.source}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sun/15 px-2.5 py-1 text-[11px] font-medium text-ink-2">
                      <Lightbulb className="h-3 w-3 text-sun" /> Hint mode
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* composer */}
        <div className="flex items-center gap-3 border-t border-line px-5 py-3.5">
          <span className="flex-1 truncate text-sm text-subtle">Ask your tutor anything…</span>
          <span className="bg-grad grid h-9 w-9 place-items-center rounded-full text-white">
            <Send className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* floating cards */}
      <div className="card shadow-soft absolute -bottom-16 -left-16 hidden w-52 rounded-2xl p-4 xl:block" aria-hidden="true">
        <p className="text-xs font-semibold text-ink">Topic mastery</p>
        <p className="text-[11px] text-subtle">Demo class · this week</p>
        <div className="mt-3 flex h-20 items-end gap-2">
          {MASTERY.map((m, i) => (
            <span key={m.topic} className="flex h-full flex-1 flex-col justify-end">
              <span className="bar-grow w-full rounded-md bg-grad" style={{ height: `${m.v}%`, animationDelay: `${0.4 + i * 0.08}s`, opacity: 0.55 + m.v / 250 }} />
            </span>
          ))}
        </div>
      </div>
      <div className="card shadow-soft absolute -right-6 -top-9 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-semibold lg:flex" aria-hidden="true">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Grounded in your curriculum
      </div>
    </div>
  );
}
