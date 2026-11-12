import { CSSProperties, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Gift,
  Globe,
  Loader2,
  Mail,
  MessagesSquare,
  Moon,
  Sun,
  Sunrise,
  Video,
  Zap,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { booking, CallType, CallTypeKey, company, offer, startEnquiry } from "@/data/company";
import { CONTACT_SUBJECTS } from "@/components/contact/form";
import { Monogram } from "@/components/site/Navbar";
import { useAvailability } from "@/hooks/use-availability";
import { reserveCall, SlotTakenError } from "@/lib/bookingApi";
import {
  allZones,
  CalendarEvent,
  dayKey,
  dayLabel,
  dayParts,
  downloadIcs,
  googleCalendarUrl,
  hourIn,
  localZone,
  rangeLabel,
  timeLabel,
  whenLabel,
  zoneName,
} from "@/lib/booking-time";
import { emailInbox, sendToCrm, tag } from "@/lib/leads";
import { saveMessage } from "@/lib/messagesApi";
import { glideTo, targetTop } from "@/lib/scroll";

type Step = "time" | "details" | "done";

const STEPS: { key: Step; label: string }[] = [
  { key: "time", label: "Pick a time" },
  { key: "details", label: "Your details" },
  { key: "done", label: "Confirmed" },
];

/** Times are grouped by the part of the day they fall in, in the visitor's time zone. */
const PERIODS = [
  { key: "morning", label: "Morning", icon: Sunrise, has: (h: number) => h < 12 },
  { key: "afternoon", label: "Afternoon", icon: Sun, has: (h: number) => h >= 12 && h < 17 },
  { key: "evening", label: "Evening", icon: Moon, has: (h: number) => h >= 17 },
];

const EMPTY = { name: "", email: "", company: "", phone: "", topic: CONTACT_SUBJECTS[0] as string, notes: "" };

/** The calendar invite for a booked call. */
const inviteFor = (start: Date, type: CallType): CalendarEvent => ({
  start,
  minutes: type.minutes,
  title: `${type.label} with ${company.name}`,
  details: [
    `${type.minutes}-minute ${type.label.toLowerCase()} with ${company.name}.`,
    booking.meetingUrl ? `Join the call: ${booking.meetingUrl}` : "The video link follows by email.",
    `Need to move it? Reply to our email or write to ${company.email}.`,
  ].join("\n\n"),
  location: booking.meetingUrl || "Video call",
});

/** Progress through the three steps, with a gradient line filling in behind the finished ones. */
function Stepper({ step }: { step: Step }) {
  const at = STEPS.findIndex((s) => s.key === step);
  return (
    <ol className="mb-7 flex items-center gap-2" aria-label="Booking progress">
      {STEPS.map((s, i) => (
        <li key={s.key} className={`flex items-center gap-2 ${i < STEPS.length - 1 ? "flex-1" : ""}`} aria-current={i === at ? "step" : undefined}>
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-300 ${
              i < at ? "bg-grad text-on-brand" : i === at ? "bg-ink text-canvas ring-4 ring-brand/15" : "border border-line text-subtle"
            }`}
          >
            {i < at ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
          </span>
          <span className={`text-xs font-semibold ${i === at ? "text-ink" : "hidden text-subtle sm:inline"}`}>{s.label}</span>
          {i < STEPS.length - 1 && (
            <span className="relative h-0.5 min-w-[1rem] flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <span className="absolute inset-y-0 left-0 bg-grad transition-[width] duration-700" style={{ width: i < at ? "100%" : "0%" }} />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/** A tear-off calendar leaf: month, date, weekday. */
function DateLeaf({ at, zone, size = "md" }: { at: Date; zone: string; size?: "md" | "lg" }) {
  const p = dayParts(at, zone);
  return (
    <span
      className={`date-leaf grid shrink-0 place-items-center rounded-2xl bg-grad text-on-brand ${size === "lg" ? "w-[76px] py-2.5" : "w-[60px] py-2"}`}
      aria-hidden="true"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">{p.month}</span>
      <span className={`font-display font-extrabold leading-none ${size === "lg" ? "text-4xl" : "text-[28px]"}`}>{p.day}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{p.weekday}</span>
    </span>
  );
}

/** A one-off burst of confetti behind the confirmation tick. */
function Confetti() {
  const bits = useMemo(() => {
    const colours = ["iris", "brand", "sky", "sun", "volt"].map((c) => `rgb(var(--${c}-rgb))`);
    return Array.from({ length: 26 }, (_, i) => {
      const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 80 + Math.random() * 90;
      return {
        "--x": `${Math.cos(angle) * dist}px`,
        "--y": `${Math.sin(angle) * dist * 0.75 - 30}px`,
        "--r": `${(Math.random() - 0.5) * 720}deg`,
        "--d": `${Math.random() * 0.12}s`,
        background: colours[i % colours.length],
      } as CSSProperties;
    });
  }, []);
  return (
    <span className="confetti" aria-hidden="true">
      {bits.map((style, i) => (
        <i key={i} style={style} />
      ))}
    </span>
  );
}

/**
 * Call booking: choose the kind of call, a day and a time (shown in the visitor's time zone), then your details.
 * Reached at /book; `?topic=` pre-fills the topic and `?slot=<ISO time>` jumps straight to the details for that time.
 */
export default function BookingWidget() {
  const [params] = useSearchParams();
  const { slots, loading, refresh } = useAvailability();
  const [zone, setZone] = useState(localZone);
  const zones = useMemo(allZones, []);
  const [typeKey, setTypeKey] = useState<CallTypeKey>(booking.callTypes[0].key);
  const type = booking.callTypes.find((t) => t.key === typeKey) ?? booking.callTypes[0];
  const [step, setStep] = useState<Step>("time");
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<Date | null>(null);
  const [booked, setBooked] = useState<{ start: Date; type: CallType; reserved: boolean; email: string } | null>(null);

  const topicParam = params.get("topic");
  const [form, setForm] = useState(() => ({ ...EMPTY, topic: topicParam || EMPTY.topic }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  // Honeypot: hidden from people, so anything typed here came from a bot
  const [trap, setTrap] = useState("");
  const top = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  // A topic that isn't one of the usual subjects (a service or solution name) is offered first
  const topics = topicParam && !(CONTACT_SUBJECTS as readonly string[]).includes(topicParam) ? [topicParam, ...CONTACT_SUBJECTS] : [...CONTACT_SUBJECTS];

  // Open times grouped by the visitor's calendar day
  const days = useMemo(() => {
    const groups = new Map<string, Date[]>();
    for (const s of slots) {
      const k = dayKey(s, zone);
      groups.set(k, [...(groups.get(k) ?? []), s]);
    }
    return Array.from(groups, ([key, times]) => ({ key, times }));
  }, [slots, zone]);
  const current = days.find((d) => d.key === day) ?? days[0];
  const busiest = Math.max(1, ...days.map((d) => d.times.length));
  const soonest = slots[0];

  // Arriving with ?slot=…: go straight to the details if that time is still open
  const slotParam = params.get("slot");
  const usedSlotParam = useRef(false);
  useEffect(() => {
    if (usedSlotParam.current || !slotParam || loading) return;
    usedSlotParam.current = true;
    const wanted = slots.find((s) => s.getTime() === Date.parse(slotParam));
    if (!wanted) return;
    setDay(dayKey(wanted, zone));
    setSlot(wanted);
    setStep("details");
  }, [slotParam, slots, loading, zone]);

  // The day strip: which ends still have days off-screen (for the edge fades and arrow buttons)
  const measure = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, days.length, step, loading]);

  // Keep the chosen day in view in the strip — sideways only, so the page itself never jumps
  useEffect(() => {
    const el = strip.current;
    const on = el?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!el || !on) return;
    const left = on.offsetLeft - el.clientWidth / 2 + on.offsetWidth / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, [current?.key, step, loading]);

  const nudge = (dir: 1 | -1) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const goTo = (next: Step) => {
    setStep(next);
    // Keep the top of the widget in view on phones, where the steps are long
    requestAnimationFrame(() => {
      const el = top.current;
      if (el && el.getBoundingClientRect().top < 0) glideTo(() => targetTop(el));
    });
  };

  const takeSoonest = () => {
    if (!soonest) return;
    setDay(dayKey(soonest, zone));
    setSlot(soonest);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Please enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!slot || !validate()) return;
    const name = form.name.trim();
    const email = form.email.trim();
    const done = (reserved: boolean) => {
      setBooked({ start: slot, type, reserved, email });
      setForm({ ...EMPTY, topic: form.topic });
      goTo("done");
    };
    if (trap) return done(true); // a bot: show the usual confirmation, book nothing

    setSending(true);
    const organisation = form.company.trim() || null;
    const phone = form.phone.trim() || null;
    const notes = form.notes.trim() || null;
    const teamTime = whenLabel(slot, booking.timezone);
    const theirTime = `${whenLabel(slot, zone)} (${zone})`;
    const message = [
      `${type.label} (${type.minutes} min) booked for ${teamTime}.`,
      `Their time: ${theirTime}`,
      `Topic: ${form.topic}`,
      organisation && `Organization: ${organisation}`,
      phone && `Phone: ${phone}`,
      "",
      notes ?? "(No notes)",
    ]
      .filter((line) => line !== null)
      .join("\n");

    // The database holds the time for them; if it can't be reached, the booking still arrives as a request by email and in Messages
    let reserved = false;
    try {
      await reserveCall({ starts_at: slot.toISOString(), minutes: type.minutes, call_type: type.label, name, email, organisation, phone, topic: form.topic, notes, timezone: zone, message });
      reserved = true;
    } catch (e) {
      if (e instanceof SlotTakenError) {
        toast.error("That time was just taken", { description: "Please pick another — the list has been refreshed." });
        setSlot(null);
        setSending(false);
        refresh();
        goTo("time");
        return;
      }
    }

    const sent = await Promise.allSettled([
      emailInbox(`${reserved ? "New call booked" : "Call request"}: ${teamTime} — ${name}`, {
        name,
        email,
        organisation: organisation ?? undefined,
        phone: phone ?? undefined,
        call: `${type.label} (${type.minutes} min)`,
        time: teamTime,
        their_time: theirTime,
        topic: form.topic,
        notes: notes ?? undefined,
        status: reserved ? "Booked — the time is held in /admin → Bookings" : "Requested — the booking database couldn't be reached, so please confirm by email",
      }),
      sendToCrm({ email, name, phone: phone ?? undefined, sms_opt_in: false, subject: `Call booked: ${type.label}`, message, source: "booking", tags: ["website-booking", tag(type.label), tag(form.topic)] }),
      ...(reserved ? [] : [saveMessage({ name, email, organisation, phone, topic: "Call request", message, sms_opt_in: false })]),
    ]);
    setSending(false);
    if (!reserved && sent.every((r) => r.status === "rejected")) {
      toast.error("Something went wrong", { description: `Please try again, or email us at ${company.email}.` });
      return;
    }
    refresh();
    done(reserved);
  };

  const label = "mb-1.5 block text-sm font-semibold text-ink";
  const err = "border-red-400 focus:border-red-400";
  let slotIndex = 0; // running count across the day's periods, for the staggered entrance

  return (
    <div ref={top} className="card shadow-soft scroll-mt-24 overflow-hidden rounded-3xl lg:grid lg:grid-cols-[340px_1fr]">
      {/* Summary: who, how long, which kind of call */}
      <aside className="book-aside relative border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <span className="relative">
            <Monogram className="h-11 w-11" />
            <span className="live-dot absolute -bottom-0.5 -right-0.5 ring-2 ring-surface" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-bold">{company.name}</p>
            <p className="text-xs text-subtle">With a senior engineer</p>
          </div>
        </div>

        <fieldset className="mt-7" disabled={step === "done"}>
          <legend className="text-xs font-semibold uppercase tracking-wider text-subtle">Kind of call</legend>
          <div className="mt-3 space-y-2.5">
            {booking.callTypes.map((t) => {
              const on = t.key === typeKey;
              return (
                <label key={t.key} className={`book-type group block cursor-pointer rounded-2xl border p-4 ${on ? "is-on border-brand/60 bg-brand-soft" : "border-line bg-surface hover:border-brand/30"}`}>
                  <input type="radio" name="call-type" value={t.key} checked={on} onChange={() => setTypeKey(t.key)} className="sr-only" />
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 ${
                          on ? "border-transparent bg-grad text-on-brand" : "border-line-strong group-hover:border-brand/50"
                        }`}
                        aria-hidden="true"
                      >
                        <Check className={`h-3 w-3 transition-transform duration-300 ${on ? "scale-100" : "scale-0"}`} strokeWidth={3.5} />
                      </span>
                      <span className={`font-display font-bold ${on ? "text-brand-text" : ""}`}>{t.label}</span>
                    </span>
                    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${on ? "bg-surface text-brand-text" : "text-subtle"}`}>
                      <Clock className="h-3.5 w-3.5" /> {t.minutes} min
                    </span>
                  </span>
                  <span className="mt-2 block pl-[30px] text-[13px] leading-relaxed text-ink-2">{t.desc}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <ul className="mt-6 space-y-2.5 text-sm text-ink-2">
          <li className="flex items-center gap-2.5">
            <Video className="h-4 w-4 shrink-0 text-brand-text" /> Video call — {booking.meetingUrl ? "link in your invite" : "link sent by email"}
          </li>
          <li className="flex items-center gap-2.5">
            <Globe className="h-4 w-4 shrink-0 text-brand-text" /> Times in {zone.replace(/_/g, " ")} ({zoneName(zone)})
          </li>
          {slot && step !== "time" && (
            <li className="mega-swap flex items-start gap-2.5 font-semibold text-ink">
              <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" /> {whenLabel(slot, zone)}
            </li>
          )}
        </ul>

        <div className="book-offer relative mt-7 overflow-hidden rounded-2xl border border-sun/30 bg-sun/10 p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-sun/20">
              <Gift className="h-4 w-4 text-sun" />
            </span>
            {offer.badge}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{offer.title}. No cost, no commitment.</p>
        </div>
      </aside>

      {/* min-w-0 keeps the scrolling day strip from widening the column */}
      <div className="min-h-[520px] min-w-0 p-6 sm:p-8">
        <Stepper step={step} />

        {step === "time" && (
          <div className="mega-swap">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">Pick a day</h2>
                {!loading && slots.length > 0 && (
                  <p className="mt-0.5 text-xs text-subtle">
                    {slots.length} open times over the next {booking.daysAhead} days
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-3 pr-1 text-xs text-subtle transition-colors focus-within:border-brand/60 hover:border-brand/30">
                  <span className="sr-only">Time zone</span>
                  <Globe className="h-3.5 w-3.5 shrink-0 text-brand-text" aria-hidden="true" />
                  <select value={zone} onChange={(e) => setZone(e.target.value)} className="max-w-[170px] cursor-pointer truncate bg-transparent py-0.5 pr-1 text-xs font-medium text-ink-2 outline-none">
                    {zones.map((z) => (
                      <option key={z} value={z}>
                        {z.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </label>
                {days.length > 0 && (
                  <span className="hidden gap-1 sm:flex">
                    <button type="button" onClick={() => nudge(-1)} disabled={edges.start} aria-label="Earlier days" className="strip-nav">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => nudge(1)} disabled={edges.end} aria-label="Later days" className="strip-nav">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div aria-hidden="true">
                <div className="mt-5 flex gap-2">
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} className="h-[84px] w-[70px] shrink-0 animate-pulse rounded-2xl bg-raised" />
                  ))}
                </div>
                <div className="mt-9 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i} className="h-11 animate-pulse rounded-xl bg-raised" />
                  ))}
                </div>
              </div>
            ) : days.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-line p-8 text-center">
                <p className="font-semibold">No open times in the next {booking.daysAhead} days.</p>
                <p className="mt-1 text-sm text-ink-2">Send us a message and we'll find a time that works.</p>
                <button onClick={() => startEnquiry("a call")} className="btn btn-secondary mt-5 px-5 py-2.5 text-sm">
                  Send a message
                </button>
              </div>
            ) : (
              <>
                {soonest && slot?.getTime() !== soonest.getTime() && (
                  <button type="button" onClick={takeSoonest} className="soonest group mt-4">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-grad text-on-brand">
                      <Zap className="h-3.5 w-3.5" fill="currentColor" />
                    </span>
                    <span>
                      Soonest: <strong className="font-semibold text-ink">{dayParts(soonest, zone).weekday}, {dayParts(soonest, zone).month} {dayParts(soonest, zone).day} · {timeLabel(soonest, zone)}</strong>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}

                <div
                  ref={strip}
                  onScroll={measure}
                  className={`day-strip relative -mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-3 pt-1 sm:-mx-8 sm:px-8 ${edges.start ? "" : "fade-start"} ${edges.end ? "" : "fade-end"}`}
                  role="group"
                  aria-label="Days with open times"
                >
                  {days.map((d) => {
                    const p = dayParts(d.times[0], zone);
                    const on = d.key === current?.key;
                    const level = Math.ceil((d.times.length / busiest) * 3);
                    return (
                      <button
                        key={d.key}
                        onClick={() => setDay(d.key)}
                        aria-pressed={on}
                        aria-label={`${dayLabel(d.times[0], zone)}, ${d.times.length} open times`}
                        className={`day-btn flex w-[70px] shrink-0 flex-col items-center rounded-2xl border pb-2 pt-2.5 ${on ? "is-on border-transparent text-on-brand" : "border-line bg-surface hover:border-brand/40"}`}
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{p.weekday}</span>
                        <span className="font-display text-[22px] font-extrabold leading-tight">{p.day}</span>
                        <span className="text-[11px] opacity-75">{p.month}</span>
                        <span className="mt-1.5 flex gap-0.5" aria-hidden="true">
                          {[1, 2, 3].map((n) => (
                            <span key={n} className={`h-1 w-1 rounded-full ${n <= level ? (on ? "bg-white" : "bg-brand") : on ? "bg-white/35" : "bg-line-strong"}`} />
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {current && (
                  <div key={current.key} className="mega-swap mt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-base font-bold">{dayLabel(current.times[0], zone)}</h3>
                      <span className="text-xs text-subtle">
                        {current.times.length} open · {type.minutes} min each
                      </span>
                    </div>
                    {PERIODS.map((period) => {
                      const times = current.times.filter((t) => period.has(hourIn(t, zone)));
                      if (!times.length) return null;
                      const Icon = period.icon;
                      return (
                        <section key={period.key} className="mt-4">
                          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                            <Icon className={`h-3.5 w-3.5 ${period.key === "evening" ? "text-iris" : "text-sun"}`} aria-hidden="true" />
                            {period.label}
                            <span className="h-px flex-1 bg-line" aria-hidden="true" />
                          </p>
                          <ul className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {times.map((t) => {
                              const on = slot?.getTime() === t.getTime();
                              return (
                                <li key={t.getTime()} className="slot-in" style={{ "--i": slotIndex++ } as CSSProperties}>
                                  <button
                                    onClick={() => setSlot(on ? null : t)}
                                    aria-pressed={on}
                                    title={rangeLabel(t, type.minutes, zone)}
                                    className={`slot-btn w-full rounded-xl border py-2.5 text-sm font-semibold tabular-nums ${on ? "is-on border-transparent text-on-brand" : "border-line bg-surface"}`}
                                  >
                                    {on && <Check className="-ml-1 mr-1 inline h-3.5 w-3.5 align-[-2px]" strokeWidth={3} />}
                                    {timeLabel(t, zone)}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </section>
                      );
                    })}
                  </div>
                )}

                {/* The chosen time, with the way forward — stays pinned to the bottom of the screen while scrolling the list */}
                <div aria-live="polite">
                  {slot && (
                    <div key={slot.getTime()} className="book-bar sticky bottom-4 z-10 mt-6 flex items-center gap-3 rounded-2xl border border-line bg-surface/90 p-2.5 pl-3 shadow-soft backdrop-blur-md">
                      <DateLeaf at={slot} zone={zone} />
                      <div className="min-w-0 flex-1 leading-snug">
                        <p className="text-xs text-subtle">
                          {type.label} · {type.minutes} min
                        </p>
                        <p className="truncate font-display font-bold">{rangeLabel(slot, type.minutes, zone)}</p>
                      </div>
                      <button type="button" onClick={() => goTo("details")} className="btn btn-primary shrink-0 px-4 py-3 text-sm sm:px-6">
                        <span className="hidden sm:inline">Continue</span>
                        <span className="sm:hidden">Next</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            <p className="mt-8 text-xs text-subtle">
              Rather write?{" "}
              <button onClick={() => startEnquiry()} className="font-semibold text-ink-2 underline underline-offset-2 hover:text-brand-text">
                Send us a message
              </button>{" "}
              — we reply within {company.responseTime}.
            </p>
          </div>
        )}

        {step === "details" && slot && (
          <form onSubmit={submit} noValidate className="mega-swap space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-raised/50 p-3 pr-4">
              <DateLeaf at={slot} zone={zone} />
              <div className="min-w-0 flex-1 leading-snug">
                <p className="font-display font-bold">{type.label}</p>
                <p className="text-sm text-ink-2">{rangeLabel(slot, type.minutes, zone)}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-subtle">
                  <Video className="h-3.5 w-3.5" /> Video call · {type.minutes} min
                </p>
              </div>
              <button type="button" onClick={() => goTo("time")} className="u-link shrink-0 text-sm font-semibold text-brand-text">
                Change
              </button>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Almost there — who are we talking to?</h2>
              <p className="mt-1 text-sm text-ink-2">Two fields are all we need. The rest helps us come prepared.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="b-name" className={label}>Name</label>
                <input id="b-name" value={form.name} onChange={set("name")} placeholder="Jane Doe" autoComplete="name" className={`field ${errors.name ? err : ""}`} />
                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="b-email" className={label}>Work email</label>
                <input id="b-email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" autoComplete="email" className={`field ${errors.email ? err : ""}`} />
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="b-company" className={label}>Company <span className="font-normal text-subtle">(optional)</span></label>
                <input id="b-company" value={form.company} onChange={set("company")} placeholder="Acme Property Group" autoComplete="organization" className="field" />
              </div>
              <div>
                <label htmlFor="b-phone" className={label}>Phone <span className="font-normal text-subtle">(optional)</span></label>
                <input id="b-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" autoComplete="tel" className="field" />
              </div>
            </div>
            <div>
              <label htmlFor="b-topic" className={label}>What's it about?</label>
              <select id="b-topic" value={form.topic} onChange={set("topic")} className="field">
                {topics.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="b-notes" className={label}>The task that eats your week <span className="font-normal text-subtle">(optional)</span></label>
              <textarea
                id="b-notes"
                rows={4}
                value={form.notes}
                onChange={set("notes")}
                placeholder="What your team does by hand today, the tools involved, and anything we should look at before the call…"
                className="field resize-none"
              />
            </div>
            {/* Honeypot — off-screen and skipped by keyboard and screen readers */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="b-website">Website</label>
              <input id="b-website" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>
            <button type="submit" disabled={sending} className="btn btn-primary w-full py-4 disabled:opacity-60">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
              {sending ? "Booking…" : `Confirm ${timeLabel(slot, zone)} on ${dayParts(slot, zone).weekday}`}
            </button>
            <p className="text-center text-xs text-subtle">
              We use your details to arrange and prepare for the call, as set out in our{" "}
              <Link to="/privacy" className="font-medium text-ink-2 underline underline-offset-2 hover:text-brand-text">
                privacy policy
              </Link>
              .
            </p>
          </form>
        )}

        {step === "done" && booked && (
          <div className="mega-swap flex flex-col items-center text-center" role="status">
            <div className="relative mt-2">
              <Confetti />
              <div className="icon-tile pop-in relative h-16 w-16 rounded-full">
                <Check className="h-8 w-8" strokeWidth={3} />
              </div>
            </div>
            <h2 className="mt-6 font-display text-3xl font-extrabold">{booked.reserved ? "You're booked!" : "Request sent"}</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-2">
              {booked.reserved
                ? booking.meetingUrl
                  ? `Join at ${booking.meetingUrl} when it's time. We'll also send a confirmation to ${booked.email}.`
                  : `We'll send a calendar invite with the video link to ${booked.email} within ${company.responseTime}.`
                : `We couldn't hold the time automatically, so we'll confirm it by email to ${booked.email} within ${company.responseTime}.`}
            </p>

            <div className="mt-6 flex w-full max-w-md items-center gap-4 rounded-2xl border border-line bg-raised/50 p-3 pr-5 text-left">
              <DateLeaf at={booked.start} zone={zone} size="lg" />
              <div className="min-w-0 leading-snug">
                <p className="font-display text-lg font-bold">{booked.type.label}</p>
                <p className="text-sm text-ink-2">{dayLabel(booked.start, zone)}</p>
                <p className="text-sm font-semibold text-ink">{rangeLabel(booked.start, booked.type.minutes, zone)}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={googleCalendarUrl(inviteFor(booked.start, booked.type))} target="_blank" rel="noreferrer" className="btn btn-primary px-5 py-3 text-sm">
                <CalendarPlus className="h-4 w-4" /> Add to Google Calendar
              </a>
              <button onClick={() => downloadIcs(inviteFor(booked.start, booked.type), `${company.shortName.toLowerCase()}-call.ics`)} className="btn btn-secondary px-5 py-3 text-sm">
                <Download className="h-4 w-4" /> Outlook / Apple (.ics)
              </button>
            </div>

            <ol className="mt-8 grid w-full gap-3 text-left sm:grid-cols-3">
              {[
                { icon: Mail, title: "Check your inbox", desc: booked.reserved ? "Your invite and video link are on the way." : "We'll confirm the time by email." },
                { icon: FileText, title: "We prepare", desc: "A senior engineer reads your notes before the call." },
                { icon: MessagesSquare, title: "Bring the task", desc: "A screenshot or sample file makes the call twice as useful." },
              ].map(({ icon: Icon, title, desc }, i) => (
                <li key={title} className="slot-in rounded-2xl border border-line bg-surface p-4" style={{ "--i": i * 3 + 4 } as CSSProperties}>
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand-text">
                      <Icon className="h-4 w-4" />
                    </span>
                    {title}
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">{desc}</span>
                </li>
              ))}
            </ol>

            <button
              onClick={() => {
                setBooked(null);
                setSlot(null);
                goTo("time");
              }}
              className="u-link mt-7 text-sm font-semibold text-brand-text"
            >
              Book another call
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
