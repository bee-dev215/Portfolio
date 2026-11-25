import { ArrowUpRight, BadgeCheck, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { levels, payFacts, payouts } from "@/data/company";
import Reveal from "./Reveal";

const payslip = [
  { k: "Base pay · 80 h", v: "$960.00" },
  { k: "Weekend shifts · 6 h", v: "$108.00" },
  { k: "Quality bonus", v: "$75.00" },
  { k: "Transfer fee (Wise)", v: "−$4.20" },
];

/**
 * Pay & growth: the four levels as a numbered list beside a sample payslip on a tilted backdrop, then the payout
 * methods along a line and the pay facts in a tinted card.
 */
export default function Pay() {
  return (
    <section id="pay" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="left">
            <p className="eyebrow">Pay & growth</p>
            <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-normal leading-[1.08] tracking-[-0.02em] text-ink">
              Do great work. <span className="gradient-text">Watch your rate grow.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-2">
              Your rate is agreed in writing before you start. Every quarter there's a review, and four clear levels each raise your base rate and your responsibilities.
            </p>
            <ol className="mt-9 space-y-5">
              {levels.map((l) => (
                <li key={l.n} className="flex gap-4 leading-relaxed">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-text">{l.n}</span>
                  <span className="pt-0.5">
                    <strong className="font-semibold text-ink">{l.name}</strong>
                    <span className="text-ink-2">
                      {" "}
                      — {l.reach} {l.gains}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal variant="right" delay={100}>
            <div className="relative px-4 py-6 sm:px-8 sm:py-10">
              <div className="tilt-back absolute inset-0 rounded-[2.25rem]" aria-hidden="true" />
              <div className="relative rounded-[1.5rem] border border-line bg-surface p-6 shadow-[0_30px_60px_-30px_rgb(15_31_61/.4)] sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow">Payslip · 1–15 Nov</p>
                  <span className="text-xs text-subtle">Sample</span>
                </div>
                <p className="mt-4 font-display text-[1.6rem] font-normal leading-tight text-ink">Every line, in plain sight.</p>
                <ul className="mt-5 space-y-2.5 text-[15px]">
                  {payslip.map((l) => (
                    <li key={l.k} className="flex justify-between gap-3">
                      <span className="text-ink-2">{l.k}</span>
                      <span className="font-mono tabular-nums">{l.v}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold">
                  <span>Total paid</span>
                  <span className="font-mono tabular-nums">$1,138.80</span>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <BadgeCheck className="h-3.5 w-3.5" /> Paid on time
                  </span>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-text">Level 2 · Specialist</span>
                  <span className="rounded-full bg-raised px-3 py-1 text-xs font-semibold text-ink-2">Wise</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Payout methods along a line, and the pay facts */}
        <div className="mt-24 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Paid twice a month</p>
            <h3 className="mt-4 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-normal leading-tight tracking-[-0.015em] text-ink">Choose how you get paid.</h3>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-2">Pick the method that works best where you live, and change it whenever you like from your workspace.</p>
            <ul className="mt-9 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
              {payouts.map((p, i) => (
                <li key={p.key}>
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${i === 0 ? "bg-brand" : "bg-iris/70"}`} />
                    <span className={`h-px flex-1 ${i === 0 ? "bg-brand" : "bg-line-strong"}`} />
                  </span>
                  <p className="mt-4 font-semibold text-ink">{p.label}</p>
                  <p className="mt-1 text-sm leading-snug text-subtle">{p.desc}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} variant="right">
            <div className="tint-card tint-1 h-full p-7 sm:p-9">
              <p className="eyebrow">The fine print, made plain</p>
              <ul className="mt-6 space-y-4">
                {payFacts.map((f) => (
                  <li key={f.k} className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-text" />
                    <span>
                      <strong className="font-semibold text-ink">{f.k}:</strong> <span className="text-ink-2">{f.v}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/faq#how-paid" className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                More about pay <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
