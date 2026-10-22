import { db, supabase } from "@/lib/supabase";

export const MESSAGES_TABLE = "messages";
export const MESSAGES_KEY = ["messages"] as const;

export type MessageStatus = "new" | "read" | "archived";

/** A message sent through the contact form. */
export interface MessageRow {
  id: number;
  name: string;
  email: string;
  organisation: string | null;
  phone: string | null;
  topic: string | null;
  message: string;
  sms_opt_in: boolean;
  status: MessageStatus;
  created_at: string;
}

export type MessageInput = Omit<MessageRow, "id" | "status" | "created_at">;

// ---------- Public site ----------

/** Keeps a contact-form message for the admin's inbox. Visitors can add messages but never read them back. */
export async function saveMessage(values: MessageInput) {
  if (!supabase) throw new Error("The database isn't connected yet.");
  const { error } = await supabase.from(MESSAGES_TABLE).insert(values);
  if (error) throw error;
}

// ---------- Admin ----------

export async function fetchMessages(): Promise<MessageRow[]> {
  const { data, error } = await db().from(MESSAGES_TABLE).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as MessageRow[];
}

export async function setMessageStatus(id: number, status: MessageStatus) {
  const { error } = await db().from(MESSAGES_TABLE).update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteMessage(id: number) {
  const { error } = await db().from(MESSAGES_TABLE).delete().eq("id", id);
  if (error) throw error;
}
