import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CalendarCheck, CalendarPlus, Check, Clock, Download, Gift, Globe, Loader2, Video } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { booking, CallType, CallTypeKey, company, offer, startEnquiry } from "@/data/company";
import { CONTACT_SUBJECTS } from "@/components/contact/form";
import { Monogram } from "@/components/site/Navbar";
import { useAvailability } from "@/hooks/use-availability";
import { reserveCall, SlotTakenError } from "@/lib/bookingApi";
import { allZones, CalendarEvent, dayKey, dayLabel, dayParts, downloadIcs, googleCalendarUrl, localZone, timeLabel, whenLabel, zoneName } from "@/lib/booking-time";
import { emailInbox, sendToCrm, tag } from "@/lib/leads";
import { saveMessage } from "@/lib/messagesApi";

type Step = "time" | "details" | "done";

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

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const goTo = (next: Step) => {
    setStep(next);
    // Keep the top of the widget in view on phones, where the steps are long
    requestAnimationFrame(() => {
      const box = top.current?.getBoundingClientRect();
      if (box && box.top < 0) top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const pick = (s: Date) => {
    setSlot(s);
    goTo("details");
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

  return (
    <div ref={top} className="card shadow-soft scroll-mt-24 overflow-hidden rounded-3xl lg:grid lg:grid-cols-[320px_1fr]">
      {/* Summary: who, how long, which kind of call */}
      <aside className="border-b border-line bg-raised/40 p-6 sm:p-8 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <Monogram className="h-10 w-10" />
          <div className="leading-tight">
            <p className="font-display font-bold">{company.name}</p>
            <p className="text-xs text-subtle">With a senior engineer</p>
          </div>
        </div>

        <fieldset className="mt-7" disabled={step === "done"}>
          <legend className="text-xs font-semibold uppercase tracking-wider text-subtle">Kind of call</legend>
          <div className="mt-3 space-y-2.5">
            {booking.callTypes.map((t) => (
              <label
                key={t.key}
                className={`block cursor-pointer rounded-2xl border p-4 transition-colors ${
                  t.key === typeKey ? "border-brand/60 bg-brand-soft" : "border-line bg-surface hover:border-brand/30"
                }`}
              >
                <input type="radio" name="call-type" value={t.key} checked={t.key === typeKey} onChange={() => setTypeKey(t.key)} className="sr-only" />
                <span className="flex items-center justify-between gap-3">
                  <span className={`font-display font-bold ${t.key === typeKey ? "text-brand-text" : ""}`}>{t.label}</span>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-subtle">
                    <Clock className="h-3.5 w-3.5" /> {t.minutes} min
                  </span>
                </span>
                <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">{t.desc}</span>
              </label>
            ))}
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
            <li className="flex items-start gap-2.5 font-semibold text-ink">
              <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" /> {whenLabel(slot, zone)}
            </li>
          )}
        </ul>

        <div className="mt-7 rounded-2xl border border-sun/30 bg-sun/10 p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Gift className="h-4 w-4 text-sun" /> {offer.badge}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{offer.title}. No cost, no commitment.</p>
        </div>
      </aside>

      {/* min-w-0 keeps the scrolling day strip from widening the column */}
      <div className="min-h-[480px] min-w-0 p-6 sm:p-8">
        {step === "time" && (
          <div className="mega-swap">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-xl font-bold">Pick a day</h2>
              <label className="flex items-center gap-2 text-xs text-subtle">
                <span className="sr-only">Time zone</span>
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                <select value={zone} onChange={(e) => setZone(e.target.value)} className="max-w-[200px] truncate rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-ink-2">
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="mt-5 flex gap-2" aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="h-[76px] w-[68px] shrink-0 animate-pulse rounded-2xl bg-raised" />
                ))}
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
                <div className="-mx-6 mt-5 flex gap-2 overflow-x-auto px-6 pb-2 sm:-mx-8 sm:px-8" role="group" aria-label="Days with open times">
                  {days.map((d) => {
                    const p = dayParts(d.times[0], zone);
                    const on = d.key === current?.key;
                    return (
                      <button
                        key={d.key}
                        onClick={() => setDay(d.key)}
                        aria-pressed={on}
                        aria-label={`${dayLabel(d.times[0], zone)}, ${d.times.length} open times`}
                        className={`flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-2.5 transition-colors ${
                          on ? "border-brand bg-brand-soft text-brand-text" : "border-line bg-surface hover:border-brand/40"
                        }`}
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{p.weekday}</span>
                        <span className="font-display text-xl font-extrabold leading-tight">{p.day}</span>
                        <span className="text-[11px] opacity-70">{p.month}</span>
                      </button>
                    );
                  })}
                </div>

                {current && (
                  <div key={current.key} className="mega-swap mt-7">
                    <h3 className="font-display text-base font-bold">{dayLabel(current.times[0], zone)}</h3>
                    <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {current.times.map((t) => (
                        <li key={t.getTime()}>
                          <button
                            onClick={() => pick(t)}
                            className="w-full rounded-xl border border-line bg-surface py-2.5 text-sm font-semibold tabular-nums transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand-text"
                          >
                            {timeLabel(t, zone)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
            <button type="button" onClick={() => goTo("time")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-subtle transition-colors hover:text-brand-text">
              <ArrowLeft className="h-4 w-4" /> Change time
            </button>
            <div>
              <h2 className="font-display text-xl font-bold">Your details</h2>
              <p className="mt-1 text-sm text-ink-2">
                {type.label} · {whenLabel(slot, zone)}
              </p>
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
              {sending ? "Booking…" : "Confirm booking"}
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
          <div className="mega-swap flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
            <div className="icon-tile h-16 w-16">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-extrabold">{booked.reserved ? "You're booked" : "Request sent"}</h2>
            <p className="mt-3 font-semibold">
              {booked.type.label} · {whenLabel(booked.start, zone)}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-2">
              {booked.reserved
                ? booking.meetingUrl
                  ? `Join at ${booking.meetingUrl} when it's time. We'll also send a confirmation to ${booked.email}.`
                  : `We'll send a calendar invite with the video link to ${booked.email} within ${company.responseTime}.`
                : `We couldn't hold the time automatically, so we'll confirm it by email to ${booked.email} within ${company.responseTime}.`}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href={googleCalendarUrl(inviteFor(booked.start, booked.type))} target="_blank" rel="noreferrer" className="btn btn-primary px-5 py-3 text-sm">
                <CalendarPlus className="h-4 w-4" /> Add to Google Calendar
              </a>
              <button onClick={() => downloadIcs(inviteFor(booked.start, booked.type), `${company.shortName.toLowerCase()}-call.ics`)} className="btn btn-secondary px-5 py-3 text-sm">
                <Download className="h-4 w-4" /> Outlook / Apple (.ics)
              </button>
            </div>
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
