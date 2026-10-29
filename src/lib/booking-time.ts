import { booking } from "@/data/company";

// ------------------------------------------------------------
//  Time-zone arithmetic for the booking page, with the browser's Intl API (no date-zone library).
//  Calls are planned in the team's time zone (booking.timezone) and shown in the visitor's.
// ------------------------------------------------------------

/** A taken stretch of time, in epoch milliseconds: someone's call or time the team has blocked off. */
export interface Busy {
  start: number;
  end: number;
}

const MINUTE = 60_000;

/** The visitor's own time zone, e.g. "Europe/Berlin". */
export const localZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

/** Every time zone the browser knows, for the zone picker (older browsers get just the visitor's and the team's). */
export function allZones() {
  const supported = (Intl as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf?.("timeZone");
  return Array.from(new Set([...(supported ?? []), localZone(), booking.timezone])).sort();
}

const partsCache = new Map<string, Intl.DateTimeFormat>();

/** The calendar date and wall-clock time at an instant in a time zone. */
function wallClock(at: number, timeZone: string) {
  let fmt = partsCache.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", { timeZone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" });
    partsCache.set(timeZone, fmt);
  }
  const n: Record<string, number> = {};
  for (const p of fmt.formatToParts(new Date(at))) if (p.type !== "literal") n[p.type] = Number(p.value);
  return { y: n.year, m: n.month - 1, d: n.day, h: n.hour, min: n.minute };
}

/** How far a time zone is ahead of UTC at an instant, in milliseconds. */
function zoneOffset(at: number, timeZone: string) {
  const w = wallClock(at, timeZone);
  return Date.UTC(w.y, w.m, w.d, w.h, w.min) - Math.floor(at / MINUTE) * MINUTE;
}

/** The instant a wall-clock time happens in a time zone (month is 0-based, as in Date). */
export function zonedTime(y: number, m: number, d: number, h: number, min: number, timeZone: string) {
  const guess = Date.UTC(y, m, d, h, min);
  // A second pass settles times near a daylight-saving change
  const first = guess - zoneOffset(guess, timeZone);
  return guess - zoneOffset(first, timeZone);
}

const minutesOf = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/**
 * The call start times still open, soonest first: the team's working hours on bookable days,
 * from booking.minNoticeHours from now until booking.daysAhead days ahead, minus anything busy.
 */
export function openSlots(busy: Busy[], now = Date.now()): Date[] {
  const { timezone, days, slotMinutes, minNoticeHours, daysAhead } = booking;
  const from = minutesOf(booking.start);
  const until = minutesOf(booking.end);
  const earliest = now + minNoticeHours * 60 * MINUTE;
  const today = wallClock(now, timezone);
  const slots: Date[] = [];

  for (let i = 0; i <= daysAhead; i++) {
    const day = new Date(Date.UTC(today.y, today.m, today.d + i));
    if (!days.includes(day.getUTCDay())) continue;
    for (let t = from; t + slotMinutes <= until; t += slotMinutes) {
      const at = zonedTime(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), Math.floor(t / 60), t % 60, timezone);
      const end = at + slotMinutes * MINUTE;
      if (at < earliest || busy.some((b) => at < b.end && end > b.start)) continue;
      slots.push(new Date(at));
    }
  }
  return slots;
}

/** The time range to ask the database about for openSlots. */
export const slotWindow = (now = Date.now()) => ({ from: new Date(now), to: new Date(now + (booking.daysAhead + 2) * 24 * 60 * MINUTE) });

// ---------- Formatting, always in an explicit time zone ----------

const fmt = (timeZone: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone, ...options });

/** "2026-11-03": the calendar day an instant falls on in a time zone, for grouping. */
export const dayKey = (d: Date, timeZone: string) => {
  const w = wallClock(d.getTime(), timeZone);
  return `${w.y}-${String(w.m + 1).padStart(2, "0")}-${String(w.d).padStart(2, "0")}`;
};

/** "9:30 AM" */
export const timeLabel = (d: Date, timeZone: string) => fmt(timeZone, { hour: "numeric", minute: "2-digit" }).format(d);

/** "Tuesday, November 3" */
export const dayLabel = (d: Date, timeZone: string) => fmt(timeZone, { weekday: "long", month: "long", day: "numeric" }).format(d);

/** { weekday: "Tue", day: "3", month: "Nov" }, for the day picker. */
export const dayParts = (d: Date, timeZone: string) => {
  const parts = fmt(timeZone, { weekday: "short", day: "numeric", month: "short" }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { weekday: get("weekday"), day: get("day"), month: get("month") };
};

/** A zone's short name at a given time, e.g. "MST" or "GMT+1". */
export const zoneName = (timeZone: string, at = new Date()) =>
  fmt(timeZone, { timeZoneName: "short" }).formatToParts(at).find((p) => p.type === "timeZoneName")?.value ?? timeZone;

/** "Tuesday, November 3 · 9:30 AM MST" */
export const whenLabel = (d: Date, timeZone: string) => `${dayLabel(d, timeZone)} · ${timeLabel(d, timeZone)} ${zoneName(timeZone, d)}`;

// ---------- Calendar invites ----------

export interface CalendarEvent {
  start: Date;
  minutes: number;
  title: string;
  details: string;
  location?: string;
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const endOf = (e: CalendarEvent) => new Date(e.start.getTime() + e.minutes * MINUTE);

/** A link that opens the event, pre-filled, in Google Calendar. */
export function googleCalendarUrl(e: CalendarEvent) {
  const q = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${stamp(e.start)}/${stamp(endOf(e))}`, details: e.details });
  if (e.location) q.set("location", e.location);
  return `https://calendar.google.com/calendar/render?${q}`;
}

// iCalendar text values escape backslashes, commas, semicolons and line breaks
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\r?\n/g, "\\n");

/** Downloads the event as an .ics file, which Outlook, Apple Calendar and most others open. */
export function downloadIcs(e: CalendarEvent, filename: string) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jovano//Call booking//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${stamp(e.start)}-${Math.random().toString(36).slice(2, 10)}@jovano`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(endOf(e))}`,
    `SUMMARY:${icsText(e.title)}`,
    `DESCRIPTION:${icsText(e.details)}`,
    ...(e.location ? [`LOCATION:${icsText(e.location)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
