// ============================================================
//  INDUSTRY PAGES — extra content for /industries/<key>, keyed by the industry key in company.ts.
//  Copy drafted for review: no client names, results or certifications are claimed here.
//  Security & compliance items describe what we design for, not certifications or audits passed.
// ============================================================

import { ServiceKey } from "./company";

export interface IndustryDetail {
  intro: string;
  challenges: { title: string; desc: string }[];
  services: ServiceKey[]; // the most relevant services (four fill a row)
  useCases: { title: string; desc: string }[];
  integrations: { name: string; desc: string }[];
  policies: { name: string; desc: string }[]; // shown as "Security & compliance": what we design for
  // An illustrative day for one role, before and after — qualitative, no figures
  day: { role: string; moments: { time: string; before: string; after: string }[] };
  faqs: { q: string; a: string }[];
}

export const industryDetails: Record<string, IndustryDetail> = {
  healthcare: {
    intro:
      "Clinics run on phones, forms and schedules. Front desks juggle calls, referrals and insurance paperwork while patients wait. We build tools that answer, read and file that work for your staff, connected to the practice systems you already use and built to support HIPAA requirements from the first sketch.",
    challenges: [
      { title: "Phones that never stop", desc: "Calls about bookings, refills and directions tie up the front desk, and after-hours calls go to voicemail." },
      { title: "Paperwork on every patient", desc: "Intake forms, referrals and insurance cards arrive as faxes, PDFs and photos, and someone types them in." },
      { title: "Systems that don't talk", desc: "The EHR, the phones, the calendar and billing each hold part of the picture." },
      { title: "Privacy at every step", desc: "Patient data can't go into just any tool. Every new system and vendor has to fit your HIPAA obligations." },
    ],
    services: ["ai", "automation", "web", "cloud"],
    useCases: [
      { title: "After-hours call answering", desc: "A voice agent that answers common questions, books and reschedules, and passes urgent calls to the on-call line." },
      { title: "Intake and referral processing", desc: "Forms, referrals and insurance cards read and checked, then filed to the chart after staff review." },
      { title: "Reminders and waitlists", desc: "Confirmations and reminders by text, with slots freed by cancellations offered to waitlisted patients." },
      { title: "Note and letter drafting", desc: "Draft visit notes and referral letters from dictation, for the clinician to edit and sign." },
      { title: "Policy and protocol search", desc: "Staff get cited answers from your own protocols instead of searching a shared drive." },
      { title: "Patient portal", desc: "Forms, documents, messages and payments in one place, so patients stop calling to ask." },
    ],
    integrations: [
      { name: "EHR & practice management", desc: "Systems such as athenahealth or eClinicalWorks, through their APIs, FHIR or HL7 interfaces." },
      { name: "Twilio", desc: "Phone numbers, calls and text messages, with a business associate agreement in place." },
      { name: "Google & Microsoft calendars", desc: "Provider schedules and staff calendars kept in sync." },
      { name: "Cloud fax", desc: "Incoming faxes captured and read like any other document." },
    ],
    policies: [
      { name: "HIPAA & PHI", desc: "Built to support HIPAA requirements: PHI encrypted in transit and at rest, minimum-necessary access, and BAAs with every vendor that handles it." },
      { name: "Audit trails", desc: "Who viewed, changed or sent what, and when, logged for every record the system touches." },
      { name: "AI providers", desc: "Models used only under terms that exclude your data from training, with a BAA wherever PHI is involved." },
      { name: "Data retention", desc: "Recordings, transcripts and documents kept only as long as your retention policy says." },
    ],
    day: {
      role: "A clinic front-desk lead",
      moments: [
        { time: "Opening", before: "Starts the day with a voicemail inbox full of overnight calls to return.", after: "Opens a list of overnight calls already answered, with bookings made and a short summary of the rest." },
        { time: "Morning rush", before: "Answers the phone, checks patients in and books follow-ups all at once.", after: "Routine calls are handled by the voice agent; the ones that need a person come through with context." },
        { time: "Midday", before: "Re-types referral letters and intake forms into the EHR.", after: "Reviews pre-filled intake and referral details, fixes the odd field and files them." },
        { time: "End of day", before: "Calls patients one by one to fill tomorrow's cancellations.", after: "Waitlisted patients have already been offered the open slots by text." },
      ],
    },
    faqs: [
      { q: "Can it handle patient information safely?", a: "We design for it from the first sketch: encryption, minimum-necessary access, audit logs and business associate agreements with every vendor that touches PHI. The details are agreed with your privacy officer before anything goes live." },
      { q: "Will it work with our EHR?", a: "Most practice systems offer an API, FHIR or HL7 interface, and we work within what your vendor supports. We check what's possible on the first call, before the prototype starts." },
      { q: "What happens when a caller needs a person?", a: "You set the rules. Anything urgent, clinical or unusual goes to your team or the on-call line, and every call arrives as a written summary. The agent never gives medical advice." },
    ],
  },
  construction: {
    intro:
      "Construction runs on information that starts in the field: daily reports, photos, inspections, RFIs and change orders. Most of it gets typed twice, once on site and again in the office. We build field apps and back-office automation that capture it once, work without signal, and land in Procore, your accounting system or wherever your team already works.",
    challenges: [
      { title: "Reports typed twice", desc: "Superintendents take notes on site, then rebuild them as daily reports at night." },
      { title: "Paper and photos everywhere", desc: "Inspections, delivery tickets and site photos live in notebooks, camera rolls and inboxes." },
      { title: "Document control", desc: "RFIs, submittals and drawing revisions are hard to track across subcontractors and versions." },
      { title: "No signal on site", desc: "Basements, remote jobs and steel structures break apps that assume a connection." },
    ],
    services: ["mobile", "automation", "ai", "data"],
    useCases: [
      { title: "Daily site reports", desc: "Voice notes, photos and crew counts turned into a clean daily report the project manager can send." },
      { title: "Inspections and punch lists", desc: "Checklists with photos, signatures and locations that work offline and sync to the office." },
      { title: "Delivery tickets and invoices", desc: "Supplier tickets and invoices read, matched to purchase orders and queued for approval." },
      { title: "RFI and submittal tracking", desc: "Drafts, reminders and status reports, so nothing waits on a forgotten email." },
      { title: "Spec and drawing search", desc: "Cited answers from specifications, drawings and past project files." },
      { title: "Job dashboards", desc: "Cost, schedule and safety numbers from every job in one place, updated without spreadsheets." },
    ],
    integrations: [
      { name: "Procore", desc: "Daily logs, RFIs, submittals, photos and documents through Procore's API." },
      { name: "Autodesk Construction Cloud", desc: "Documents, issues and forms in Autodesk Build and BIM 360." },
      { name: "Bluebeam", desc: "Marked-up PDFs and drawing sets kept with the right job and revision." },
      { name: "QuickBooks & Sage", desc: "Job costs, purchase orders and supplier invoices synced with accounting." },
    ],
    policies: [
      { name: "Data ownership", desc: "Site photos, reports and documents stored in your own cloud account, under your name." },
      { name: "Audit trails", desc: "Every report, approval and edit logged with who did it and when, for when a dispute comes up." },
      { name: "Access by role", desc: "Subcontractors, site crews and office staff see only the jobs and documents they need." },
      { name: "Record retention", desc: "Project records kept for as long as your contracts and local rules require." },
    ],
    day: {
      role: "A project manager",
      moments: [
        { time: "Early morning", before: "Chases superintendents for yesterday's daily reports.", after: "Finds yesterday's reports already in, written up from voice notes and photos." },
        { time: "On site", before: "Walks the punch list with a clipboard and types it up later.", after: "Logs items on a tablet with photos and locations; the list syncs as soon as there's signal." },
        { time: "Afternoon", before: "Digs through email threads to find where an RFI stands.", after: "Checks one RFI list with the status, the owner and the next reminder already set." },
        { time: "End of week", before: "Pulls numbers from several spreadsheets for the owner's report.", after: "Reviews a drafted weekly report with cost and schedule from every job, and adds a note." },
      ],
    },
    faqs: [
      { q: "Does it work without signal?", a: "Yes. The field apps we build are offline-first: crews keep working in basements and remote sites, and everything syncs when the device reconnects." },
      { q: "Will it replace Procore?", a: "No. We build around the tools you already use, add what's missing, and feed the results back into Procore, Autodesk or your accounting system." },
      { q: "Our crews aren't keen on new apps. Will they use it?", a: "We design for the field: big buttons, few screens and voice notes instead of typing. During the two-week prototype your own crews try it on a real job and tell us what gets in the way." },
    ],
  },
  "real-estate": {
    intro:
      "Property teams spend their days answering the same questions, chasing documents and keying invoices and leases into the system. We build tools that respond to leads and tenants quickly, read the paperwork, and keep AppFolio, Buildium or Yardi up to date, so your team can spend its time with owners, tenants and deals.",
    challenges: [
      { title: "Slow lead response", desc: "Inquiries arrive at all hours, and the first company to reply often wins the showing." },
      { title: "Phone tag with tenants", desc: "Maintenance requests, rent questions and document requests come in by phone, email and text." },
      { title: "Invoices and leases by hand", desc: "Vendor invoices and lease terms are keyed into the property system one at a time." },
      { title: "Owner reporting", desc: "Monthly owner reports are stitched together from several systems and spreadsheets." },
    ],
    services: ["automation", "ai", "web", "data"],
    useCases: [
      { title: "Lead response", desc: "New inquiries answered right away by text or chat, qualified and booked for a showing." },
      { title: "Tenant requests", desc: "Maintenance requests triaged, logged and sent to vendors, with tenants kept up to date." },
      { title: "Invoice processing", desc: "Vendor invoices read, coded to the right property and GL account, and queued for approval." },
      { title: "Lease abstraction", desc: "Key dates, rents and clauses pulled from leases into your system for a person to check." },
      { title: "Owner and tenant portals", desc: "Documents, payments, requests and statements in one branded place." },
      { title: "Owner reports", desc: "Monthly owner reports drafted from your property system, with a plain-language summary." },
    ],
    integrations: [
      { name: "AppFolio, Buildium & Yardi", desc: "Properties, units, tenants, work orders and bills through each system's API or supported imports." },
      { name: "Follow Up Boss", desc: "Leads, follow-up tasks and notes synced with your CRM." },
      { name: "DocuSign", desc: "Leases, renewals and addenda sent for signature and filed when signed." },
      { name: "Twilio & email", desc: "Text and email conversations with leads and tenants, logged against the right record." },
    ],
    policies: [
      { name: "Fair housing", desc: "Lead and tenant messaging checked against fair housing rules, with set answers for sensitive topics." },
      { name: "Tenant data privacy", desc: "Applications and ID documents encrypted, access limited by role, and kept only as long as needed." },
      { name: "PCI DSS scope", desc: "Payments run through processors such as Stripe, so card data never touches your servers." },
      { name: "Audit trails", desc: "Every invoice approval, lease change and message logged with who did it and when." },
    ],
    day: {
      role: "A property manager",
      moments: [
        { time: "Morning", before: "Works through a backlog of voicemails and emails about maintenance.", after: "Sees overnight requests already logged, sorted by urgency and assigned to vendors." },
        { time: "Midday", before: "Keys a stack of vendor invoices into the property system.", after: "Approves invoices that arrived pre-coded and checks only the ones flagged as unusual." },
        { time: "Afternoon", before: "Misses a new lead while out at a showing.", after: "Comes back to a lead that has already been answered, qualified and booked for a viewing." },
        { time: "Month end", before: "Builds owner reports by hand from exports and spreadsheets.", after: "Reviews drafted owner reports, adds a comment and sends them." },
      ],
    },
    faqs: [
      { q: "Do we have to switch property management software?", a: "No. We connect to the system you run, whether that's AppFolio, Buildium, Yardi or another, and fill the gaps around it." },
      { q: "Who checks the invoices?", a: "Your team does. The system reads and codes each invoice, but nothing is posted or paid until a person approves it, and anything unusual is flagged for a closer look." },
      { q: "Can AI talk to prospective tenants?", a: "Yes, within rules you set. It answers questions from your listings and policies and books showings. Anything sensitive, such as screening decisions, goes to a person." },
    ],
  },
  "professional-services": {
    intro:
      "Law firms, accounting practices and consultancies sell expertise, yet a large part of every week goes to intake, first-pass review, searching past work and chasing clients for documents. We build assistants and automation that take on that groundwork while keeping confidential files on infrastructure you control.",
    challenges: [
      { title: "Document-heavy work", desc: "Contracts, filings and statements need careful reading, and the first pass takes hours." },
      { title: "Knowledge in old files", desc: "The right precedent or past answer exists somewhere, but finding it means asking around." },
      { title: "Slow client intake", desc: "New matters and engagements wait on forms, checks and missing documents." },
      { title: "Confidentiality", desc: "Client files can't be sent to just any AI tool, and partners need to know where data goes." },
    ],
    services: ["ai", "desktop", "automation", "web"],
    useCases: [
      { title: "Contract review", desc: "First-pass review against your playbook, with each issue linked to the clause, for a lawyer to confirm." },
      { title: "Precedent search", desc: "Cited answers from your own templates, memos and past matters, respecting matter permissions." },
      { title: "Client intake", desc: "Intake forms, ID checks and engagement letters handled in one guided flow." },
      { title: "Document collection", desc: "Clients upload what's needed through a portal, and missing items are chased automatically." },
      { title: "Time entry drafts", desc: "Draft time entries built from calendars, emails and documents, for each person to review." },
      { title: "Word and Outlook add-ins", desc: "Help that appears inside the documents and inboxes your team already works in." },
    ],
    integrations: [
      { name: "Microsoft 365", desc: "Word, Outlook, Teams and SharePoint, with your existing sign-in and permissions." },
      { name: "NetDocuments & iManage", desc: "Documents and matter workspaces searched and filed in your document management system." },
      { name: "Clio", desc: "Matters, contacts, tasks and time entries kept in sync." },
      { name: "Xero & QuickBooks", desc: "Invoices, payments and client records kept in step with your practice tools." },
    ],
    policies: [
      { name: "Client confidentiality", desc: "Documents stay on infrastructure you control, such as your own Azure tenant or the user's machine, and are never used to train models." },
      { name: "Ethical walls", desc: "Answers respect matter-level access, so people only see what they're already allowed to open." },
      { name: "Audit trails", desc: "Every document processed and every answer given is logged for supervision and review." },
      { name: "Data residency", desc: "Data kept in the region you choose, to fit client agreements and professional rules." },
    ],
    day: {
      role: "A paralegal",
      moments: [
        { time: "Morning", before: "Reads a new batch of contracts line by line, looking for non-standard clauses.", after: "Starts from a first-pass review that flags clauses that differ from the firm's playbook, with the text highlighted." },
        { time: "Late morning", before: "Emails a client again about missing documents.", after: "Checks the intake portal, where the client has uploaded most items and reminders went out for the rest." },
        { time: "Afternoon", before: "Asks around the office for a clause the firm used on a similar matter.", after: "Searches past matters and finds the clause, with a link to the source document." },
        { time: "End of day", before: "Rebuilds the day's time entries from memory.", after: "Reviews draft time entries built from the day's documents and emails, and adjusts a few." },
      ],
    },
    faqs: [
      { q: "Where do our documents go?", a: "Where you decide. We can run in your own cloud tenant, on your own servers, or as a desktop app that keeps files on the user's machine, and we use AI models only under terms that exclude your data from training." },
      { q: "Does it replace professional judgment?", a: "No. It does the first pass (reading, sorting, finding and drafting), and a professional reviews and signs off on everything that goes to a client." },
      { q: "Does it work inside Word and Outlook?", a: "Yes. We build Office add-ins and desktop tools, so the help appears in the documents and inboxes your team already uses." },
    ],
  },
  logistics: {
    intro:
      "Online retailers and logistics teams run on systems that should agree but often don't: the store, the warehouse, the carriers and the accounts. When they drift apart, people fix it by hand. We build integrations, automation and dashboards that keep orders, stock and shipments in sync, and flag the exceptions before customers notice.",
    challenges: [
      { title: "Systems out of sync", desc: "Stock levels, order status and tracking differ between the store, the 3PL and the ERP." },
      { title: "Exceptions by hand", desc: "Address errors, split shipments and late deliveries are found and fixed one email at a time." },
      { title: "“Where's my order?”", desc: "Support teams answer the same tracking questions all day." },
      { title: "Reports from exports", desc: "Daily numbers come from CSV exports and spreadsheets that are out of date by lunchtime." },
    ],
    services: ["automation", "data", "web", "ai"],
    useCases: [
      { title: "Order and inventory sync", desc: "Orders, stock and tracking kept in step across your store, warehouse and accounting." },
      { title: "Exception alerts", desc: "Stuck orders, late shipments and stock mismatches flagged to the right person, with context attached." },
      { title: "Support automation", desc: "Order-status and returns questions answered from live data, with anything unusual passed to your team." },
      { title: "Supplier documents", desc: "Purchase orders, packing lists and invoices read and matched automatically." },
      { title: "Operations dashboards", desc: "Orders, fulfillment, returns and margin in one place, updated through the day." },
      { title: "Warehouse apps", desc: "Simple mobile and scanner apps for receiving, picking and cycle counts." },
    ],
    integrations: [
      { name: "Shopify", desc: "Orders, products, inventory and customers through Shopify's APIs and webhooks." },
      { name: "ShipStation", desc: "Shipments, labels and tracking updates." },
      { name: "NetSuite", desc: "Sales orders, inventory, fulfillments and invoices in your ERP." },
      { name: "3PL & carrier APIs", desc: "Warehouse partners and carriers through their APIs, EDI or scheduled file drops." },
    ],
    policies: [
      { name: "PCI DSS scope", desc: "Card payments stay with Stripe or Shopify Payments, so card data never touches your servers." },
      { name: "Customer data", desc: "Personal data limited to what fulfillment and support need, and deleted on your schedule." },
      { name: "Audit trails", desc: "Every automated change to an order or stock level is logged, so you can see what happened and reverse it." },
      { name: "Human approval", desc: "Refunds, cancellations and large stock adjustments wait for a person to approve them." },
    ],
    day: {
      role: "An operations manager",
      moments: [
        { time: "Morning", before: "Exports orders from three systems to see what's stuck.", after: "Opens a list of exceptions that need attention, each with the order's history attached." },
        { time: "Midday", before: "Hears about a stock mismatch when a customer complains.", after: "Gets an alert as soon as store and warehouse stock stop matching." },
        { time: "Afternoon", before: "Answers support's questions about late orders one by one.", after: "Support sees live order status and tracking in one view and only escalates the unusual cases." },
        { time: "End of week", before: "Builds the weekly report from spreadsheets on Friday afternoon.", after: "Reads a drafted summary of orders, delays and returns, and adds a few notes." },
      ],
    },
    faqs: [
      { q: "Do we need to change our 3PL or store platform?", a: "No. We connect what you already use: through APIs where they exist, and EDI or file drops where they don't." },
      { q: "What if an automation gets something wrong?", a: "Every automated change is logged and can be traced. Consequential actions, such as refunds or cancellations, wait for a person to approve them, and alerts tell you when something looks off." },
      { q: "Can we start small?", a: "Yes, and we recommend it. The two-week prototype focuses on one painful workflow, such as order exceptions, so you can judge it before anything wider is built." },
    ],
  },
  startups: {
    intro:
      "Startups need software that ships and keeps working as they grow, without hiring a full team before they've found their market. We work as a senior engineering team for founders: building MVPs, adding AI features to existing products, and rescuing builds that have stalled with a previous vendor.",
    challenges: [
      { title: "Speed versus quality", desc: "You need to ship fast, but shortcuts in the first version become next year's rewrite." },
      { title: "AI that holds up", desc: "An AI demo that impresses in a pitch can fall apart with real users and real data." },
      { title: "Stalled builds", desc: "A previous vendor or freelancer left code that's late, fragile or hard to change." },
      { title: "Hiring gaps", desc: "Senior engineers are hard to hire, and the work can't wait for the hire to land." },
    ],
    services: ["web", "ai", "rescue", "cloud"],
    useCases: [
      { title: "MVPs", desc: "A first version scoped to what you need to test with users, built so it can grow." },
      { title: "AI features in your product", desc: "Assistants, search, document processing or agents built into your app, with evaluation tests on every release." },
      { title: "Project rescue", desc: "An audit of the existing code, a plan to stabilize it, and steady progress without a risky rewrite." },
      { title: "Billing and accounts", desc: "Subscriptions, plans, invoices and customer accounts built on Stripe." },
      { title: "Cloud and DevOps", desc: "Infrastructure as code, CI/CD and monitoring, set up in your own cloud accounts." },
      { title: "Product analytics", desc: "Events and dashboards that show how customers actually use the product." },
    ],
    integrations: [
      { name: "Stripe", desc: "Subscriptions, invoicing and payments, with webhooks kept in sync with your app." },
      { name: "HubSpot", desc: "Sign-ups, accounts and product usage synced to your CRM." },
      { name: "GitHub", desc: "Your repositories, pull requests and CI pipelines from the first commit." },
      { name: "Segment", desc: "Product events sent once and routed to your analytics and marketing tools." },
    ],
    policies: [
      { name: "Code ownership", desc: "Code lives in your GitHub organization and cloud accounts from the first commit." },
      { name: "PCI DSS scope", desc: "Payments run through Stripe, so card data never touches your servers." },
      { name: "SOC 2 readiness", desc: "Logging, access control and change history set up with a future SOC 2 audit in mind." },
      { name: "Security reviews", desc: "Dependency scanning, secrets management and access reviews built into the pipeline." },
    ],
    day: {
      role: "A founder",
      moments: [
        { time: "Morning", before: "Spends the first hour chasing the agency for an update.", after: "Opens the weekly demo notes and clicks through what shipped." },
        { time: "Midday", before: "Tells a customer “we're looking into it” about a bug nobody can reproduce.", after: "Sees the bug already caught by monitoring, with a fix in review." },
        { time: "Afternoon", before: "Pushes back the AI feature investors keep asking about.", after: "Tries the AI feature on real data in staging, with its test results attached." },
        { time: "Evening", before: "Worries whether the code will hold up when the next big customer signs.", after: "Knows where the code stands: it's documented, tested and in the company's own accounts." },
      ],
    },
    faqs: [
      { q: "Can you take over a project from another vendor?", a: "Yes. We start with a short code and architecture audit, tell you plainly what we found, and stabilize the parts that matter before adding features. A full rewrite is a last resort." },
      { q: "Who owns the code?", a: "You do, from the first commit. It lives in your repositories and your cloud accounts, with documentation your next hire can use." },
      { q: "Can you work alongside our engineers?", a: "Yes. We follow your conventions, review process and release cadence, and pair with your team so the knowledge stays in the company." },
    ],
  },
};

// Other industries where the same busywork shows up — shown on /industries as a compact list (no separate pages)
export const otherSettings = [
  { name: "Manufacturing", desc: "Work orders, quality checks and supplier paperwork moved off clipboards and spreadsheets." },
  { name: "Financial services", desc: "Applications, statements and onboarding documents read, checked and routed, with a person signing off." },
  { name: "Hospitality", desc: "Bookings, supplier orders and staff schedules handled without the phone tag." },
  { name: "Home services & trades", desc: "Quotes, job scheduling and invoicing that keep pace with crews in the field." },
  { name: "Recruiting & staffing", desc: "Candidate intake, interview scheduling and paperwork sped up, with recruiters making every decision." },
  { name: "Nonprofits", desc: "Grant reports, donor records and volunteer coordination joined up on a small budget." },
];
