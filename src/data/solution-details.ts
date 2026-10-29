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
  related: string[]; // other solution slugs
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
    related: ["reporting-autopilot", "knowledge-assistant", "client-portal"],
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
    related: ["document-ai", "ai-voice-agent", "client-portal"],
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
    related: ["knowledge-assistant", "client-portal", "document-ai"],
  },

  "field-operations-app": {
    challenge: {
      intro:
        "Field work often gets recorded three times: on a clipboard or in someone's head, in a phone's camera roll, and again at a desk in the evening. Reports arrive late, photos lose their context, and the office hears about problems after they've grown.",
      pains: [
        "Evenings spent typing up notes and sorting photos",
        "Paper checklists that get lost, rained on or misread",
        "Apps that stop working where there's no signal",
        "The office waiting until the end of the day to know what happened on site",
      ],
    },
    howItWorks: [
      { title: "Set up your templates", desc: "Your checklists, inspection forms and daily-report formats become digital templates, with required fields and photo prompts." },
      { title: "Capture on site", desc: "Crews fill them in on a phone or tablet and add photos, signatures and voice notes, with or without signal." },
      { title: "Sync & write up", desc: "When the device reconnects, everything syncs to the office and AI turns voice notes and photos into a tidy draft report." },
      { title: "Review & share", desc: "Project managers review, edit and send reports from the office dashboard, with every site in one view." },
    ],
    sample: {
      title: "A voice note becomes a daily report",
      context: "A site supervisor on a commercial build, dictating at the end of the day with no signal. The project and details are invented for illustration.",
      turns: [
        {
          role: "supervisor",
          name: "Site supervisor",
          text: "Daily report for level 3. Drywall crew finished the east corridor. Electrical rough-in is still waiting on inspection, inspector's coming Thursday. One issue: water stain on the ceiling by stair B, looks like a roof drain leak. Took photos.",
          chips: ["Voice note · offline"],
        },
        { role: "system", text: "No signal. Voice note and 4 photos saved on the device; they'll sync when you reconnect.", chips: ["Saved offline"] },
        { role: "system", text: "Back online. Voice note, 4 photos and location synced to the office.", chips: ["Synced"] },
        {
          role: "assistant",
          name: "Report draft",
          text: "Daily report, level 3. Progress: drywall complete in the east corridor. Waiting on: electrical rough-in inspection, booked for Thursday. Issue: water stain on the ceiling near stair B, possible roof drain leak, 4 photos attached.",
          chips: ["Draft — not sent"],
          sources: ["Voice note · 4:52 pm", "Photos 1–4 · stair B"],
        },
        { role: "assistant", name: "Report draft", text: "Should I log the leak as an issue for the roofing subcontractor?" },
        { role: "supervisor", name: "Site supervisor", text: "Yes, mark it urgent. Then send the report to the project manager." },
        {
          role: "system",
          text: "Issue logged as urgent and assigned to the roofing subcontractor. Daily report sent to the project manager and filed to the project in Procore.",
          chips: ["Issue logged", "Report sent"],
        },
      ],
    },
    integrations: ["Procore", "Autodesk Construction Cloud", "ServiceTitan", "SharePoint", "Google Drive", "QuickBooks", "Microsoft Teams"],
    designedToImprove: [
      "Reports written once, on site, instead of re-typed in the evening",
      "Photos and notes that arrive with their context: where, when and who",
      "The office hearing about problems the same day",
    ],
    faqs: [
      {
        q: "Does it really work without signal?",
        a: "Yes. Everything is saved on the device first and synced when the connection returns, so crews never lose work or wait on a loading screen.",
      },
      {
        q: "Can it use our existing forms and checklists?",
        a: "Yes. We turn your current paper or PDF forms into digital templates, keeping the fields and wording your crews and inspectors already know.",
      },
      {
        q: "Will it run on the devices our crews already have?",
        a: "It runs on recent iPhones, Android phones and tablets, including rugged models. We test on the hardware your teams actually carry.",
      },
      {
        q: "Is it only for construction?",
        a: "No. The same approach suits property inspections, facilities maintenance, deliveries and any team that does checklists, photos and reports away from a desk.",
      },
    ],
    related: ["document-ai", "reporting-autopilot", "client-portal"],
  },

  "reporting-autopilot": {
    challenge: {
      intro:
        "Someone spends the start of every week exporting spreadsheets from several tools, pasting them together and working out why the totals don't match. By the time the report is ready it's out of date, and nobody trusts the numbers enough to act on them.",
      pains: [
        "Hours every week spent exporting, pasting and reconciling spreadsheets",
        "Different teams reporting different numbers for the same thing",
        "Problems spotted weeks after they start, when the month closes",
      ],
    },
    howItWorks: [
      { title: "Connect your tools", desc: "Pipelines pull data from your accounting, CRM, e-commerce, project and operations systems on a schedule." },
      { title: "Check and model", desc: "The data lands in one warehouse in your own cloud, where it's cleaned, tested and modeled with agreed definitions." },
      { title: "Dashboards that stay current", desc: "Live dashboards for owners, managers and teams, each showing the numbers they act on." },
      { title: "Summaries and alerts", desc: "A plain-language summary of what changed every Monday, and an alert the moment a number moves out of range." },
    ],
    sample: {
      title: "Monday's summary, and a follow-up question",
      context: "An operations manager at an online retailer reading the weekly summary in Slack. The business and every figure are invented for illustration.",
      turns: [
        {
          role: "assistant",
          name: "Weekly summary",
          text: "Week of Oct 20. Orders: 1,284, up from 1,190 the week before. Revenue: $96,400. Two things stand out: returns on the trail-shoe range rose from 11 to 24, and 38 orders shipped late from the east warehouse.",
          chips: ["Monday · 7:00 am"],
          sources: ["Shopify · orders", "ShipStation · shipments", "Returns log"],
        },
        { role: "manager", name: "Operations manager", text: "Why were the east warehouse orders late?" },
        {
          role: "assistant",
          text: "31 of the 38 were waiting on one product, which was out of stock from Tuesday to Thursday. Its reorder point in NetSuite is set below what it now sells in a week.",
          sources: ["NetSuite · inventory, SKU TR-204", "ShipStation · east warehouse timestamps"],
        },
        { role: "manager", name: "Operations manager", text: "Alert me if that's about to happen again, and I'd like returns by product on the dashboard." },
        {
          role: "assistant",
          text: "Done for the alert: you'll get a Slack message when any product is on track to run out within five days. I've sent the returns-by-product chart request to the dashboard owner.",
          chips: ["Alert created", "Request sent"],
        },
        { role: "system", text: "Alert rule saved: projected stock-out within 5 days → #ops-alerts.", chips: ["Alert rule"] },
      ],
    },
    integrations: ["QuickBooks", "Xero", "NetSuite", "Shopify", "Stripe", "HubSpot", "Google Sheets", "Slack / Microsoft Teams"],
    designedToImprove: [
      "Mondays that start with answers instead of spreadsheet stitching",
      "One set of numbers every team agrees on",
      "Problems spotted while there's still time to act",
    ],
    faqs: [
      {
        q: "Do we need a data warehouse first?",
        a: "No. We set up a lightweight one in your own cloud as part of the project, or build on the one you already have.",
      },
      {
        q: "Can we keep our dashboard tool?",
        a: "Yes. We can feed Power BI, Looker Studio or Metabase, or build dashboards into your own app.",
      },
      {
        q: "Can we trust the AI-written summaries?",
        a: "They're written from the checked numbers in your warehouse, not estimated, and each one links to the figures and sources it used. You decide who receives them, and when.",
      },
      {
        q: "How soon do we see our own numbers?",
        a: "The two-week prototype joins two or three of your sources into a first working dashboard, so you see your own numbers before committing to more.",
      },
    ],
    related: ["document-ai", "knowledge-assistant", "field-operations-app"],
  },

  "client-portal": {
    challenge: {
      intro:
        "Customers want to know where things stand, so they email, call and email again. Each status question pulls someone off real work, documents arrive scattered across inboxes, and nobody has the full picture of a job, case or request.",
      pains: [
        "Phones and inboxes full of \"any update?\" messages",
        "Documents and signatures chased by email, one attachment at a time",
        "No single record of what was asked, promised and done",
      ],
    },
    howItWorks: [
      { title: "Map the requests", desc: "We list what your customers ask for, the documents involved and the steps each request goes through." },
      { title: "One place for customers", desc: "A branded portal where they submit requests, upload documents, sign, pay and see live status." },
      { title: "Connect your systems", desc: "Requests flow into the tools your team already uses, such as your CRM or property-management system, with no re-typing." },
      { title: "Run it from the back office", desc: "Your team answers, updates and closes requests from a simple back office, and customers are notified at every step." },
    ],
    sample: {
      title: "A tenant checking on a repair",
      context: "A tenant following up on a maintenance request in a property manager's portal. The people, property and details are invented for illustration.",
      turns: [
        { role: "customer", name: "Tenant", text: "Hi, is there any update on the leaking kitchen faucet? I reported it on Monday." },
        {
          role: "system",
          name: "Request #2417",
          text: "Kitchen faucet leak · Status: Scheduled. Plumber booked for Thursday, 8–10 am.",
          chips: ["Scheduled"],
        },
        {
          role: "support",
          name: "Property team",
          text: "Hi! The plumber is booked for Thursday between 8 and 10 am. Will someone be home, or are you happy for them to use the building key?",
        },
        { role: "customer", name: "Tenant", text: "I'll be at work, so the key is fine." },
        { role: "system", text: "Permission-to-enter form signed by the tenant and saved to the request.", chips: ["Signed"] },
        {
          role: "system",
          name: "Thursday 9:12 am",
          text: "Status: Completed. Plumber's note and 2 photos added. Tenant notified by text and email.",
          chips: ["Completed"],
        },
      ],
    },
    integrations: ["AppFolio", "Buildium", "Yardi", "Salesforce", "HubSpot", "Stripe", "DocuSign", "Twilio (SMS)"],
    designedToImprove: [
      "Customers who can check status without calling or emailing",
      "Less staff time on status updates and chasing documents",
      "One complete record of every request, from first message to done",
    ],
    faqs: [
      {
        q: "Can it match our brand?",
        a: "Yes. It uses your logo, colors and domain, so customers see it as part of your business.",
      },
      {
        q: "Does it replace the system we use today?",
        a: "No. The portal sits in front of the systems you already use and keeps them in sync, so your team doesn't have to switch tools.",
      },
      {
        q: "Can customers pay and sign in the portal?",
        a: "Yes. Payments run through providers such as Stripe, and signatures through DocuSign or a built-in signing step, with receipts and signed copies saved to the request.",
      },
      {
        q: "Do we need a mobile app as well?",
        a: "Usually not at first. The portal works well in a phone's browser. If your customers need push notifications or offline access, we add an iOS and Android app later.",
      },
    ],
    related: ["ai-voice-agent", "document-ai", "knowledge-assistant"],
  },
};
