// ============================================================
//  SOLUTION PAGES — the extra detail shown on /solutions/<slug>, keyed by slug.
//  The core facts (title, summary, capabilities, tech, deliverables, photo) live in
//  `solutions` in src/data/company.ts; this file adds the story around them.
//  Sample exchanges are scripted illustrations: the people, businesses and figures are invented.
// ============================================================

// AI roles (assistant, agent) and the business's own team (support) speak from the left;
// the people using the tool speak from the right; system notes sit in the middle.
export type TurnRole = "caller" | "customer" | "staff" | "reviewer" | "supervisor" | "manager" | "support" | "assistant" | "agent" | "system";

export interface SampleTurn {
  role: TurnRole;
  name?: string; // label shown beside the avatar; defaults to the role
  text: string;
  sources?: string[]; // citations shown under the turn
  chips?: string[]; // small status tags (e.g. "Needs review", "Draft — not sent")
}

export interface SolutionFaq {
  q: string;
  a: string;
}

export interface SolutionDetail {
  challenge: { intro: string; pains: string[] };
  howItWorks: { title: string; desc: string }[];
  sample: { title: string; context: string; turns: SampleTurn[] };
  integrations: string[];
  designedToImprove: string[]; // goals the design aims at — not measured results
  faqs: SolutionFaq[];
}

export const solutionDetails: Record<string, SolutionDetail> = {
  "document-ai": {
    challenge: {
      intro:
        "Invoices, intake forms, delivery notes and contracts arrive as PDFs, scans and email attachments, and someone has to type them into the system. It's slow, it's easy to get wrong, and the mistakes show up later as overpayments, missed renewals or awkward phone calls.",
      pains: [
        "Hours every week re-typing documents into accounting, CRM or practice systems",
        "Mismatches between invoices, purchase orders and receipts caught late, or not at all",
        "Documents sitting in shared inboxes with no clear owner",
      ],
    },
    howItWorks: [
      { title: "Collect", desc: "Documents arrive by email, upload, scanner or shared folder, and land in one queue." },
      { title: "Read & extract", desc: "AI reads each document and pulls out the fields you care about, line items included." },
      { title: "Check", desc: "Every field is checked against your rules and existing records: purchase orders, vendor lists, client or patient files." },
      { title: "Approve & post", desc: "Clean documents post to your systems once you trust the checks; anything unusual goes to a person, with the source highlighted." },
    ],
    sample: {
      title: "An invoice that doesn't match its purchase order",
      context: "An accounts payable clerk working through the review queue. The vendor, documents and figures are invented for illustration.",
      turns: [
        {
          role: "system",
          name: "Review queue",
          text: "Invoice INV-20418 received by email from a building-supplies vendor. 14 line items extracted, total $8,940.00.",
          chips: ["Needs review"],
        },
        {
          role: "assistant",
          name: "Document AI",
          text: "Line 6 bills 40 boxes of drywall screws at $18.50. Purchase order 7731 approved 30 boxes, and the delivery receipt shows 30 boxes arrived.",
          chips: ["Quantity mismatch"],
          sources: ["Invoice INV-20418 · line 6", "PO 7731 · line 4", "Delivery receipt DR-5520"],
        },
        {
          role: "assistant",
          name: "Document AI",
          text: "Separately, the bank account on this invoice is different from the one on the vendor's record. I haven't changed anything.",
          chips: ["Bank details changed"],
          sources: ["Vendor record · payment details"],
        },
        {
          role: "reviewer",
          name: "AP clerk",
          text: "Approve the other 13 lines. Short-pay line 6 to 30 boxes, and hold payment until we've confirmed the bank change with the vendor by phone.",
        },
        {
          role: "assistant",
          name: "Document AI",
          text: "Done. Line 6 is now 30 boxes and the total is $8,755.00. I've drafted a note to the vendor explaining the short payment, ready for you to send.",
          chips: ["Draft — not sent"],
        },
        {
          role: "system",
          text: "Bill posted to QuickBooks with payment on hold. Bank-detail change sent to the vendor-verification step.",
          chips: ["Posted · on hold"],
        },
      ],
    },
    integrations: ["QuickBooks", "Xero", "NetSuite", "Microsoft 365 / Outlook", "Gmail", "SharePoint", "Salesforce", "DocuSign"],
    designedToImprove: [
      "Less time re-typing, more time on the exceptions that need judgment",
      "Mismatches and suspicious changes caught before money moves",
      "A clear record of who approved what, and why",
    ],
    faqs: [
      {
        q: "What kinds of documents can it handle?",
        a: "Invoices, receipts, purchase orders, intake and referral forms, delivery notes, leases, contracts and lab results, as PDFs, scans, photos or email attachments. During the prototype we test it on a sample of your own documents.",
      },
      {
        q: "What about handwriting and poor scans?",
        a: "Printed text works well; handwriting and low-quality scans vary. Anything the system isn't confident about goes to a person with the source highlighted, rather than being guessed.",
      },
      {
        q: "Will it post to our accounting system without anyone checking?",
        a: "Only if you want it to. Most teams start with every document going through review, then let clean, low-risk ones post straight through once they trust the checks.",
      },
      {
        q: "Can it handle sensitive documents, like patient records?",
        a: "Yes, with the right setup. For healthcare we build it to support HIPAA requirements, with encryption, access controls and audit logs, and documents can be processed entirely in your own cloud account.",
      },
    ],
  },

  "knowledge-assistant": {
    challenge: {
      intro:
        "The answers your team needs usually exist somewhere: a procedure, a spec, a past proposal, a policy on the shared drive. Finding them is the hard part, so people interrupt the one colleague who knows, or they guess.",
      pains: [
        "Answers buried across shared drives, wikis and old email threads",
        "Senior people interrupted all day with the same questions",
        "New starters slow to find their feet because nothing is easy to find",
      ],
    },
    howItWorks: [
      { title: "Connect your documents", desc: "Procedures, handbooks, specs and project files are indexed from where they already live, along with their permissions." },
      { title: "Ask in plain language", desc: "Staff ask in a web app, Microsoft Teams or Slack, the way they'd ask a colleague." },
      { title: "Answer with sources", desc: "Every answer cites the passages it used and links to the original. If the documents don't cover it, the assistant says so." },
      { title: "Fill the gaps", desc: "Content owners see which questions go unanswered and which documents need updating." },
    ],
    sample: {
      title: "A cited answer, and an honest \"I don't know\"",
      context: "A new associate at an accounting firm, asking in Microsoft Teams during their first week. The firm and its documents are invented for illustration.",
      turns: [
        { role: "staff", name: "Associate", text: "What do we need from a new business client before we start on their tax return?" },
        {
          role: "assistant",
          text: "Four things: a signed engagement letter, an ID check for each owner, the last two years' returns, and read access to their bookkeeping system. The engagement letter template is in the Templates library.",
          sources: ["Client onboarding procedure v4 · §2 Required documents", "Templates library · Engagement letter (business)"],
        },
        { role: "staff", name: "Associate", text: "Do we do the ID check, or does the client upload it?" },
        {
          role: "assistant",
          text: "The client uploads ID through the client portal. You confirm it in the practice-management system before any work starts.",
          sources: ["Client onboarding procedure v4 · §3 Identity checks"],
        },
        { role: "staff", name: "Associate", text: "What do we charge for a business return with payroll?" },
        {
          role: "assistant",
          text: "I couldn't find fee guidance in the documents you have access to, so I won't guess. Pricing questions go to your engagement partner.",
          chips: ["No source found"],
        },
        { role: "system", text: "Question added to the operations team's content-gaps report.", chips: ["Content gap"] },
      ],
    },
    integrations: ["SharePoint", "OneDrive", "Google Drive", "Confluence", "Notion", "Microsoft Teams", "Slack", "Microsoft Entra ID / Okta"],
    designedToImprove: [
      "Staff finding trustworthy answers without interrupting a colleague",
      "Senior people spending their time on the questions that need them",
      "Documentation that gets better because the gaps are visible",
    ],
    faqs: [
      {
        q: "Can it show someone a document they shouldn't see?",
        a: "No. It follows the document-level permissions in your existing systems and sign-on, so each person only gets answers from documents they can already open.",
      },
      {
        q: "What happens when it doesn't know?",
        a: "It says so rather than guessing, and points to the right person or channel. Those questions are logged so someone can fill the gap.",
      },
      {
        q: "How does it stay up to date?",
        a: "Sources re-sync on a schedule or when documents change, and every answer links to the current version.",
      },
      {
        q: "Is our data used to train AI models?",
        a: "No. We use model providers and settings that don't train on your data, and the search index lives in your own cloud account.",
      },
    ],
  },

  "ai-voice-agent": {
    challenge: {
      intro:
        "Calls come in when nobody can pick up: before opening, at lunch, while staff are with a customer or a patient. Many callers won't leave a voicemail; they try the next business on the list. The ones who do leave messages create a backlog of callbacks for the morning.",
      pains: [
        "Missed calls after hours and whenever every line is busy",
        "Staff pulled away from the person in front of them to answer the phone",
        "Voicemails and callbacks that pile up overnight",
      ],
    },
    howItWorks: [
      { title: "Teach it your business", desc: "Hours, services, prices, policies and common questions, from your own documents, with rules for what it may and may not say." },
      { title: "Connect your calendar", desc: "It reads and books real availability in your scheduling, practice-management or CRM system." },
      { title: "Answer and act", desc: "It answers questions, books and reschedules appointments and takes messages, by phone or chat." },
      { title: "Hand off and summarize", desc: "Anything urgent, sensitive or unusual goes to a person by your rules, and every conversation arrives as a short written summary." },
    ],
    sample: {
      title: "Rescheduling an appointment after hours",
      context: "A patient calls a family practice at 7:40 pm, after the front desk has closed. The caller, practice and calendar are invented for illustration.",
      turns: [
        { role: "caller", text: "Hi, I need to move my appointment on Thursday. Something came up at work." },
        {
          role: "agent",
          text: "I can help with that. To find your booking, could you tell me your full name and date of birth?",
          chips: ["After hours"],
        },
        { role: "caller", text: "Sam Rivera, March 3rd, 1985." },
        {
          role: "agent",
          text: "Thanks, Sam. I can see your appointment with Dr. Patel on Thursday at 10:30. I have Friday at 9:00 or 2:15, or Monday at 11:00. Would one of those work?",
          chips: ["Identity checked"],
        },
        { role: "caller", text: "Friday at 2:15. And are my lab results back yet?" },
        {
          role: "agent",
          text: "You're booked with Dr. Patel on Friday at 2:15, and a text confirmation is on its way. I can't discuss results by phone, so I've asked the care team to call you tomorrow morning.",
          chips: ["Booked", "Handed off to care team"],
        },
        {
          role: "system",
          name: "Call summary",
          text: "Sent to the front desk: appointment moved from Thu 10:30 to Fri 2:15. Callback requested about lab results.",
          chips: ["Summary + transcript"],
        },
      ],
    },
    integrations: ["Twilio", "Google Calendar", "Microsoft 365 / Outlook", "Calendly", "HubSpot", "Salesforce", "Slack / Microsoft Teams", "Practice-management systems via API"],
    designedToImprove: [
      "Fewer missed calls and lost inquiries, day and night",
      "Front-desk staff free to focus on the people in front of them",
      "Every conversation captured as a clear written summary",
    ],
    faqs: [
      {
        q: "Will callers know they're talking to AI?",
        a: "Yes. We recommend it introduces itself as an automated assistant, and callers can ask for a person at any time. Your hand-off rules decide what happens next.",
      },
      {
        q: "What won't it do?",
        a: "Anything you rule out. It doesn't give medical, legal or financial advice, discuss sensitive records or make promises outside your policies. Those calls go to a person, with a summary.",
      },
      {
        q: "Can it work for a healthcare practice?",
        a: "Yes. We build it to support HIPAA requirements: identity checks before anything is changed, encryption, access controls, audit logs, and voice and AI providers that sign a business associate agreement.",
      },
      {
        q: "Which languages does it speak?",
        a: "English and Spanish are common starting points, and the speech models we use support many more. We test each language on recordings of real calls before it goes live.",
      },
    ],
  },
};
