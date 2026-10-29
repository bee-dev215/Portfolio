import { scrollToId } from "@/data/company";

/** Options in the contact form's "What can we help with?" menu. */
export const CONTACT_SUBJECTS = [
  "Automate a task or workflow",
  "AI tool or assistant",
  "Web app or SaaS product",
  "Mobile app",
  "Desktop software",
  "Data, dashboards & reporting",
  "Rescue or modernize a project",
  "Something else",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

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
