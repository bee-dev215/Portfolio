import { useEffect, useState } from "react";
import { ArrowRight, Mic, PhoneOff, Video, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { rolePath, roles } from "@/data/company";
import { Monogram } from "./Navbar";
import { roleIcons } from "./icons";
import RotatingWords from "./RotatingWords";

// Where the team works from, cycled through the headline's highlighted phrase
const places = ["anywhere.", "home.", "Manila.", "Lagos.", "Bogotá.", "Lisbon.", "Nairobi."];

const zones = [
  { city: "Manila", tz: "Asia/Manila" },
  { city: "Lagos", tz: "Africa/Lagos" },
  { city: "Bogotá", tz: "America/Bogota" },
];

function useNow(ms = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

const clock = (d: Date, tz: string) => {
  try {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(d);
  } catch {
    return "--:--";
  }
};

const dots = (
  <span className="flex gap-1.5">
    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
  </span>
);

/** Two overlapping app windows: a video interview behind, the member workspace in front. */
function Windows() {
  const now = useNow();
  return (
    <div className="relative mx-auto w-full max-w-[620px] pb-24 sm:pb-28" aria-hidden="true">
      {/* back: the interview call */}
      <div className="hero-photo overflow-hidden rounded-[1.4rem] border border-line bg-surface shadow-[0_30px_70px_-30px_rgb(15_31_61/.45)]">
        <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
          {dots}
          <span className="flex items-center gap-1.5 rounded-full bg-raised px-2.5 py-1 text-[11px] font-semibold text-ink-2">
            <Monogram className="h-3.5 w-3.5" /> Interview · Customer Support
          </span>
          <span className="ml-auto hidden items-center gap-3 text-[11px] font-medium text-subtle sm:flex">
            {zones.map((z) => (
              <span key={z.city}>
                {z.city} <span className="font-mono tabular-nums text-ink">{clock(now, z.tz)}</span>
              </span>
            ))}
          </span>
        </div>
        <div className="relative aspect-[16/10] bg-raised">
          <img src="/images/remote/hero-main.webp" alt="" width={1280} height={1000} className="h-full w-full object-cover" style={{ objectPosition: "50% 35%" }} />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Live · 12:04
          </span>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {[Mic, Video].map((I, i) => (
              <span key={i} className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink backdrop-blur">
                <I className="h-4 w-4" />
              </span>
            ))}
            <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-white">
              <PhoneOff className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* front: the workspace */}
      <div className="hero-photo absolute bottom-0 right-[-4%] w-[72%] overflow-hidden rounded-[1.2rem] border border-line bg-surface shadow-[0_30px_70px_-24px_rgb(15_31_61/.45)] sm:right-[-8%]" style={{ animationDelay: ".2s" }}>
        <div className="flex items-center gap-2 border-b border-line px-3.5 py-2">
          {dots}
          <span className="ml-2 text-[11px] font-semibold text-ink-2">Jovano Workspace</span>
          <span className="ml-auto rounded-full bg-raised px-2 py-0.5 text-[10px] font-semibold text-subtle">Sample</span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          {[
            { k: "Hours", v: "46.5" },
            { k: "Tasks", v: "18/21" },
            { k: "Level", v: "2" },
          ].map((x) => (
            <div key={x.k} className="rounded-xl border border-line p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">{x.k}</p>
              <p className="mt-0.5 font-display text-xl font-semibold leading-none">{x.v}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-line px-3.5 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
            <Wallet className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight">Payout sent · on time</p>
            <p className="text-[11px] text-subtle">Wise · payslip ready</p>
          </div>
          <span className="ml-auto h-1.5 w-16 overflow-hidden rounded-full bg-raised">
            <span className="block h-full w-full bg-brand" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-40">
      <div className="wash pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <p className="fade-up eyebrow eyebrow-pill" style={{ animationDelay: ".05s" }}>
            Remote-first · Open to applicants worldwide
          </p>

          <h1
            className="hero-title fade-up mt-7 font-display text-[clamp(2.6rem,5.4vw,4.6rem)] font-normal leading-[1.04] tracking-[-0.025em] text-ink"
            style={{ animationDelay: ".12s" }}
          >
            <span className="block">Build your career</span>
            <span className="block whitespace-nowrap">
              from <RotatingWords words={places} itemClassName="gradient-text" />
            </span>
          </h1>

          <p className="fade-up mt-7 max-w-[540px] text-lg leading-relaxed text-ink-2" style={{ animationDelay: ".2s" }}>
            Join our global remote team: {roles.length} career paths, one team. Apply in minutes, get reviewed by a real person, and get paid on time — every time.
          </p>

          <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".28s" }}>
            <Link to="/apply" className="btn btn-primary px-7 py-3.5 text-[15px]">
              Apply now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/roles" className="btn btn-secondary px-7 py-3.5 text-[15px]">
              Explore roles
            </Link>
          </div>
        </div>

        <div className="fade-up relative" style={{ animationDelay: ".24s" }}>
          <Windows />
        </div>
      </div>

      {/* Now hiring: the roles, where Timeline shows its client logos */}
      <div className="relative mx-auto mt-16 max-w-[1240px] px-5 pb-16 sm:px-8 lg:mt-20 lg:pb-20">
        <p className="text-sm font-medium text-subtle">Now hiring for</p>
        <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
          {roles.map((r) => {
            const Icon = roleIcons[r.key];
            return (
              <li key={r.key}>
                <Link to={rolePath(r)} className="group flex items-center gap-2.5 text-ink-2 transition-colors hover:text-brand-text">
                  <Icon className="h-5 w-5 shrink-0 text-subtle transition-colors group-hover:text-brand-text" />
                  <span className="whitespace-nowrap font-display text-[17px] font-medium leading-tight">{r.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
