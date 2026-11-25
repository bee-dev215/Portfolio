import { useEffect, useState } from "react";
import { Clock3, Globe2, MessagesSquare, Wallet } from "lucide-react";
import NetworkMap from "./NetworkMap";
import Reveal, { SectionHeading } from "./Reveal";

// A sample of the time zones one team can span. Illustrative: we hire everywhere.
const cities = [
  { city: "Bogotá", tz: "America/Bogota" },
  { city: "Lisbon", tz: "Europe/Lisbon" },
  { city: "Lagos", tz: "Africa/Lagos" },
  { city: "Nairobi", tz: "Africa/Nairobi" },
  { city: "Karachi", tz: "Asia/Karachi" },
  { city: "Manila", tz: "Asia/Manila" },
];

const how = [
  { icon: Globe2, title: "Hire anywhere", desc: "We hire on skills, not postcodes. If you can do the work, where you live doesn't matter." },
  { icon: Clock3, title: "Your local time", desc: "Shifts, meetings and deadlines always show in your own time zone." },
  { icon: MessagesSquare, title: "Async by default", desc: "We write things down, so nobody has to be awake at 3 a.m. to keep up." },
  { icon: Wallet, title: "Paid where you are", desc: "Bank, Wise, Payoneer or USDT — whichever works best in your country." },
];

const fmt = (d: Date, tz: string, opts: Intl.DateTimeFormatOptions) => {
  try {
    return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: tz }).format(d);
  } catch {
    return "";
  }
};

/** One team across every time zone: the dotted world with the team's cities, live local clocks and how we make it work. */
export default function GlobalTeam() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="global" className="relative overflow-hidden px-5 py-24 sm:px-8 lg:py-32">
      <NetworkMap className="opacity-90" />
      <div className="relative mx-auto max-w-[1240px]">
        <SectionHeading
          center
          label="One global team"
          title={
            <>
              One team, <span className="gradient-text">every time zone.</span>
            </>
          }
        >
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            We hire across the Americas, Europe, Africa and Asia. Teams work async by default and overlap a few hours a day — so wherever you are, you fit right in.
          </p>
        </SectionHeading>

        {/* Live local times */}
        <Reveal delay={120}>
          <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Local times across the team">
            {cities.map((c) => {
              const hour = Number(fmt(now, c.tz, { hour: "2-digit", hourCycle: "h23" }));
              const day = hour >= 7 && hour < 19;
              return (
                <li key={c.city} className="glass rounded-2xl border border-line p-3.5 text-center shadow-soft">
                  <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-subtle">
                    <span className={`h-1.5 w-1.5 rounded-full ${day ? "bg-sun" : "bg-iris"}`} />
                    {c.city}
                  </p>
                  <p className="mt-1 font-mono text-xl font-bold tabular-nums">{fmt(now, c.tz, { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="text-[11px] text-subtle">{day ? "Working hours" : "Off — async"}</p>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {how.map((h, i) => (
            <li key={h.title}>
              <Reveal delay={i * 70} className="h-full">
                <div className="card card-hover h-full bg-surface/85 p-6 backdrop-blur">
                  <span className="icon-tile h-11 w-11">
                    <h.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{h.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{h.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
