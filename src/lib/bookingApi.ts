import { db, supabase } from "@/lib/supabase";
import type { Busy } from "@/lib/booking-time";

export const BOOKINGS_TABLE = "bookings";
export const BOOKINGS_KEY = ["bookings"] as const;

/** The topic book_call() files each booking under in Messages (see supabase/setup.sql). */
export const CALL_BOOKED_TOPIC = "Call booked";

export type BookingStatus = "booked" | "confirmed" | "done" | "cancelled";

/** A call booked on /book. */
export interface BookingRow {
  id: number;
  starts_at: string;
  minutes: number;
  call_type: string;
  name: string;
  email: string;
  organisation: string | null;
  phone: string | null;
  topic: string | null;
  notes: string | null;
  timezone: string | null; // the visitor's, as their browser reported it
  status: BookingStatus;
  message_id: number | null; // the copy filed in Messages, which replies go through
  created_at: string;
}

/** Thrown when the chosen time was taken (or blocked) after the visitor picked it. */
export class SlotTakenError extends Error {
  constructor() {
    super("Someone just booked that time — please pick another.");
  }
}

// ---------- Public site ----------

/** What's taken between two times — booked calls and blocked time, never who booked them. */
export async function fetchBusy(from: Date, to: Date): Promise<Busy[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("busy_times", { p_from: from.toISOString(), p_to: to.toISOString() });
  if (error) throw error;
  return ((data ?? []) as { starts_at: string; ends_at: string }[]).map((b) => ({ start: Date.parse(b.starts_at), end: Date.parse(b.ends_at) }));
}

export interface BookingInput {
  starts_at: string;
  minutes: number;
  call_type: string;
  name: string;
  email: string;
  organisation: string | null;
  phone: string | null;
  topic: string | null;
  notes: string | null;
  timezone: string;
  message: string; // the summary filed in Messages
}

/**
 * Books a call through the database's book_call(), which checks the time is still free and files a copy in Messages.
 * Throws SlotTakenError if the time has gone; any other error means the database couldn't be reached or isn't set up.
 */
export async function reserveCall(b: BookingInput): Promise<number> {
  if (!supabase) throw new Error("The database isn't connected yet.");
  const { data, error } = await supabase.rpc("book_call", {
    p_starts_at: b.starts_at,
    p_minutes: b.minutes,
    p_call_type: b.call_type,
    p_name: b.name,
    p_email: b.email,
    p_organisation: b.organisation,
    p_phone: b.phone,
    p_topic: b.topic,
    p_notes: b.notes,
    p_timezone: b.timezone,
    p_message: b.message,
  });
  if (error) {
    if (/slot_taken/.test(error.message)) throw new SlotTakenError();
    throw error;
  }
  return data as number;
}

// ---------- Admin ----------

export async function fetchBookings(): Promise<BookingRow[]> {
  const { data, error } = await db().from(BOOKINGS_TABLE).select("*").order("starts_at");
  if (error) throw error;
  return data as BookingRow[];
}

export async function setBookingStatus(id: number, status: BookingStatus) {
  const { error } = await db().from(BOOKINGS_TABLE).update({ status }).eq("id", id);
  if (error) throw error;
}
