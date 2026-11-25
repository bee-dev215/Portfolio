import { scrollToId } from "@/data/company";

/** Options in the contact form's "What's it about?" menu. */
export const CONTACT_SUBJECTS = [
  "A question about applying",
  "My application",
  "Pay, contracts or my account",
  "Hiring a remote team",
  "Partnerships",
  "Something else",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

/** Short topic keys usable in links (/contact?topic=hire), mapped to the subject they pre-select. */
export const TOPIC_SUBJECTS: Record<string, ContactSubject> = {
  apply: "A question about applying",
  application: "My application",
  pay: "Pay, contracts or my account",
  hire: "Hiring a remote team",
  partner: "Partnerships",
};

export interface ContactPrefill {
  subject: ContactSubject;
  message: string;
}

/** Fired on window to fill the contact form's subject and message (replacing what is there). */
export const PREFILL_EVENT = "jovano:prefill-contact";

/** Fills the contact form on this page, then scrolls to it. */
export const prefillContact = (detail: ContactPrefill) => {
  window.dispatchEvent(new CustomEvent<ContactPrefill>(PREFILL_EVENT, { detail }));
  scrollToId("contact");
};
