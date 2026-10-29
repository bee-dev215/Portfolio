import { company } from "@/data/company";

// ------------------------------------------------------------
//  Where enquiries and booked calls are sent besides the database: the CRM and the company inbox.
// ------------------------------------------------------------

const CRM_URL = "https://famous.ai/api/crm/6ad5d2059d9fe46e4e2f09d9/subscribe";
// Emails each submission to the company inbox. Until the inbox clicks the "Activate Form" link FormSubmit sends with the first one, nothing is delivered.
const EMAIL_URL = `https://formsubmit.co/ajax/${company.email}`;

const postJson = (url: string, body: object) =>
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });

/** "Book a call" → "book-a-call", for CRM tags. */
export const tag = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export interface Lead {
  name: string;
  email: string;
  phone?: string;
  sms_opt_in: boolean;
  subject: string;
  message: string;
  source: string;
  tags: string[];
}

/** Adds the lead to the CRM, which also keeps the SMS consent. */
export async function sendToCrm(lead: Lead) {
  const res = await postJson(CRM_URL, lead);
  if (!res.ok) throw new Error("CRM request failed");
}

/** Emails a submission to the company inbox as a table of fields. Empty fields are left out. */
export async function emailInbox(subject: string, fields: Record<string, string | undefined>) {
  // FormSubmit answers 200 even when it delivers nothing, so its own success flag is what counts
  const res = await postJson(EMAIL_URL, { _subject: subject, _template: "table", ...fields });
  const data: { success?: string | boolean; message?: string } = await res.json();
  if (String(data.success) !== "true") throw new Error(data.message ?? "Email request failed");
}
