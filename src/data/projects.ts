// ============================================================
//  PROJECTS — case studies shown on the home page, /projects and /projects/<slug>,
//  and linked from the solution, service and industry pages they relate to.
//  The site shows exactly this list, in this order; pages read it through useProjects().
//
//  PLACEHOLDER CASE STUDIES: drafted to show the kind of work Jovano does, not work it has delivered.
//  Replace them with your real projects (or confirm each detail) before launch — visitors will
//  read these as work you delivered. Clients are described, never named (see "Confidentiality"
//  on /about), and results are given as what was measured, not as figures.
//  Each one follows the way we work: a call, a free two-week prototype, the build, then launch.
//  Photos live in public/images/ (16:10): proj-<slug>.webp and proj-<slug>-2.webp.
// ============================================================

import { industries, type ServiceKey } from "./company";

export interface ProjectStep {
  phase: string;
  when: string; // e.g. "Weeks 1–2"
  desc: string;
}

export interface ProjectFeature {
  title: string;
  desc: string;
}

export interface Project {
  slug: string; // URL: /projects/<slug>
  title: string;
  client: string; // a description of the client, never its name
  audience: string; // industry key (see `industries`)
  solution?: string; // slug of the solution it started from
  services: ServiceKey[];
  year: string;
  duration: string;
  team: string;
  summary: string;
  challenge: string;
  brief: string[]; // what the client asked for, agreed on the first call
  steps: ProjectStep[];
  built: ProjectFeature[];
  flow: { label: string; detail: string }[]; // how the system fits together, in order
  safeguards: string[];
  measures: string[]; // what success was judged on — no figures, so nothing reads as a published result
  stack: string[];
  image: string;
  imageAlt: string;
  gallery: { src: string; alt: string; caption: string };
  featured?: boolean; // shown first on the home page
}

export const builtInProjects: Project[] = [
  {
    slug: "site-report-app",
    title: "Daily Site Report App",
    client: "Regional general contractor · commercial and multifamily",
    audience: "construction",
    solution: "field-operations-app",
    services: ["mobile", "ai", "cloud"],
    year: "2025",
    duration: "2-week prototype · 12 weeks to launch",
    team: "A mobile lead, an AI engineer, a back-end engineer and a product designer",
    summary: "An offline-first mobile app that turns superintendents' voice notes and photos into finished daily reports, filed to Procore without anyone typing them up at night.",
    challenge:
      "Superintendents were spending their evenings typing up daily reports from notebooks and camera rolls. Reports arrived late and in different formats, photos were hard to find when a dispute came up, and project managers rewrote much of what they received before sending it to owners. Earlier apps had been dropped because they needed signal on site and too many taps.",
    brief: [
      "Capture the day by voice and photo, without typing on site",
      "Work with no signal, from basements to remote jobs",
      "Reports in the company's own format, ready to send",
      "File everything to Procore and the company's own cloud",
    ],
    steps: [
      { phase: "Discovery call", when: "Before kickoff", desc: "A call with the operations director, then a morning on site with superintendents to see how reports were really written." },
      { phase: "Prototype", when: "Weeks 1–2", desc: "The free two-week prototype: voice notes and photos from a live job turned into a draft daily report, tried by superintendents on their own sites." },
      { phase: "Build", when: "Weeks 3–10", desc: "Offline sync, report templates, the Procore connection and the office dashboard, with a demo every week." },
      { phase: "Launch", when: "Weeks 11–12", desc: "Rolled out job by job, with short training for crews and project managers and a handover of code and cloud accounts." },
    ],
    built: [
      { title: "Voice-to-report drafting", desc: "Superintendents talk through the day; AI drafts the report sections (work done, crews, deliveries, issues) for them to check." },
      { title: "Offline-first capture", desc: "Photos, notes, signatures and checklists saved on the device and synced when signal returns." },
      { title: "The company's own templates", desc: "Daily report, inspection and incident formats filled in the same way on every job." },
      { title: "Office dashboard", desc: "Every job's reports, photos and open issues in one place, searchable by date, trade and location." },
    ],
    flow: [
      { label: "Field app", detail: "React Native app with on-device storage" },
      { label: "Sync service", detail: "Queued uploads that resume when signal returns" },
      { label: "Drafting", detail: "Speech-to-text, then a structured report draft" },
      { label: "Review", detail: "The superintendent checks and signs the report" },
      { label: "Procore & dashboard", detail: "Filed to the job's daily log and the office dashboard" },
    ],
    safeguards: [
      "Nothing is filed until the superintendent has reviewed and signed the report",
      "Photos and reports stored in the contractor's own AWS account, with access by role",
      "Every edit to a submitted report is logged with who made it and when",
      "Voice recordings are deleted once the report is approved, unless a job requires keeping them",
    ],
    measures: [
      "How soon after the end of a shift reports reached the office",
      "How much project managers edited reports before sending them",
      "Superintendents' feedback on using it in the field",
      "How quickly photos and issues could be found when needed",
    ],
    stack: ["React Native", "SQLite", "Whisper", "Claude", "Procore API", "AWS"],
    image: "/images/proj-site-report-app.webp",
    imageAlt: "A site manager in a hard hat checks a tablet on a construction site",
    gallery: {
      src: "/images/proj-site-report-app-2.webp",
      alt: "Two engineers in hard hats review plans together on site",
      caption: "Project managers see every job's reports in one place and one format, ready to send rather than rewrite.",
    },
    featured: true,
  },
  {
    slug: "invoice-intake-automation",
    title: "Invoice Intake Automation",
    client: "Property management company · residential portfolio",
    audience: "real-estate",
    solution: "document-ai",
    services: ["automation", "ai", "web"],
    year: "2026",
    duration: "2-week prototype · 10 weeks to launch",
    team: "An AI engineer, an automation engineer and a full-stack engineer",
    summary: "Vendor invoices read, matched to the right property and GL account, and queued for approval, so the accounts team checks the exceptions instead of typing every line.",
    challenge:
      "Vendor invoices arrived by email, by mail and through vendor portals, in every format imaginable. Each one was keyed into the property management system by hand, coded to a property and GL account, and chased for approval. Month end meant late nights, and duplicate or miscoded invoices still slipped through.",
    brief: [
      "Read invoices from email, scans and vendor portals",
      "Code each line to the right property, unit and GL account",
      "A person approves every invoice before it's posted",
      "Post approved bills to the property management system",
    ],
    steps: [
      { phase: "Discovery call", when: "Before kickoff", desc: "A call with the controller, then a walk-through of a week's invoices and the coding rules the team followed." },
      { phase: "Prototype", when: "Weeks 1–2", desc: "The free two-week prototype read a sample of real invoices and proposed the coding, compared side by side with the team's own work." },
      { phase: "Build", when: "Weeks 3–8", desc: "Email intake, the review app, duplicate checks and the connection to the property management system, with a demo every week." },
      { phase: "Launch", when: "Weeks 9–10", desc: "Run alongside the old process through a month-end close, then switched over, with training for the accounts team." },
    ],
    built: [
      { title: "One intake queue", desc: "A dedicated invoice address and vendor-portal downloads feed one queue, with attachments split and de-duplicated." },
      { title: "Field extraction", desc: "Vendor, amounts, dates, line items and property references read from PDFs, scans and photos." },
      { title: "Coding suggestions", desc: "Each line matched to a property, unit and GL account using the vendor's history and the team's rules." },
      { title: "Review and approval", desc: "Exceptions highlighted against the source document; approvers accept, correct or reject on one screen." },
    ],
    flow: [
      { label: "Intake", detail: "Invoice inbox and vendor portals" },
      { label: "Extraction", detail: "Fields and line items read from each document" },
      { label: "Checks", detail: "Vendor, property and duplicate checks against existing records" },
      { label: "Review app", detail: "The accounts team approves, corrects or rejects" },
      { label: "Posting", detail: "Approved bills posted to the property management system" },
    ],
    safeguards: [
      "No invoice is posted or paid until a person approves it",
      "Possible duplicates and unusual amounts are flagged, never passed through silently",
      "Every correction and approval is logged against the invoice",
      "Documents are processed under AI provider terms that exclude them from model training",
    ],
    measures: [
      "Share of invoices approved without corrections",
      "Time from an invoice arriving to its approval",
      "Duplicates and miscoded lines caught before posting",
      "The accounts team's view of the month-end workload",
    ],
    stack: ["Azure Document Intelligence", "Claude", "Python", "FastAPI", "PostgreSQL", "React"],
    image: "/images/proj-invoice-intake-automation.webp",
    imageAlt: "An accountant checks invoice figures on a calculator beside a laptop",
    gallery: {
      src: "/images/proj-invoice-intake-automation-2.webp",
      alt: "A modern residential apartment building",
      caption: "Every line is coded to the right property and GL account before anyone is asked to approve it.",
    },
    featured: true,
  },
  {
    slug: "clinic-call-assistant",
    title: "After-Hours Clinic Call Assistant",
    client: "Multi-location outpatient clinic group",
    audience: "healthcare",
    solution: "ai-voice-agent",
    services: ["ai", "automation", "cloud"],
    year: "2026",
    duration: "2-week prototype · 16 weeks to full rollout",
    team: "An AI engineer, a voice and telephony engineer, a back-end engineer and a cloud engineer",
    summary: "An AI voice agent that answers after-hours and overflow calls, books and reschedules in the practice system, and hands anything urgent to the on-call line, with a written summary of every call.",
    challenge:
      "After hours and at peak times, calls went to voicemail. Front-desk staff started each morning returning messages, patients who couldn't get through booked elsewhere, and urgent calls depended on patients picking the right option from a phone menu. The group wanted calls answered without stretching its staff further, and without putting patient information at risk.",
    brief: [
      "Answer common questions and book, move or cancel appointments",
      "Send anything urgent or clinical straight to a person",
      "Write every call into the practice system as a summary",
      "Built to support HIPAA requirements, with BAAs for every vendor",
    ],
    steps: [
      { phase: "Discovery call", when: "Before kickoff", desc: "A call with the practice manager and front-desk leads, then a review of why patients call and how each location schedules." },
      { phase: "Prototype", when: "Weeks 1–2", desc: "The free two-week prototype: a voice agent on a test line, answering common call types and booking into a sandbox of the practice system, tried by front-desk staff." },
      { phase: "Build", when: "Weeks 3–12", desc: "Telephony, the scheduling integration, escalation rules, call summaries and a privacy review, with a demo every week." },
      { phase: "Launch", when: "Weeks 13–16", desc: "Started with after-hours calls at one location, then added overflow calls and the other locations one at a time." },
    ],
    built: [
      { title: "Natural phone conversations", desc: "Answers about hours, locations, directions and visit preparation, from the clinics' own approved information." },
      { title: "Scheduling in the practice system", desc: "Books, reschedules and cancels by provider, visit type and each location's rules." },
      { title: "Escalation rules", desc: "Symptoms, urgent requests and anything clinical go straight to the on-call line or a staff queue. The agent never gives medical advice." },
      { title: "Call summaries", desc: "Every call arrives as a short written summary on the patient's record or in the morning queue." },
    ],
    flow: [
      { label: "Phone line", detail: "After-hours and overflow calls routed through Twilio" },
      { label: "Speech", detail: "Streaming speech-to-text and a natural voice" },
      { label: "Conversation", detail: "Answers from approved clinic information, with escalation rules checked on every turn" },
      { label: "Scheduling", detail: "Practice-system API for availability and bookings" },
      { label: "Summaries", detail: "Written summaries and transcripts for the front desk" },
    ],
    safeguards: [
      "Never gives medical advice: symptoms and clinical questions go to a person",
      "PHI encrypted in transit and at rest, with business associate agreements for every vendor that handles it",
      "Callers' identity checked before any appointment details are discussed",
      "Every call logged with a transcript and an audit trail, kept under the group's retention policy",
    ],
    measures: [
      "Share of after-hours calls resolved without a callback",
      "How quickly urgent calls reached a person",
      "Front-desk review of sampled call summaries",
      "Patient feedback on the call experience",
    ],
    stack: ["Twilio", "Whisper", "Claude", "Node.js", "PostgreSQL", "AWS"],
    image: "/images/proj-clinic-call-assistant.webp",
    imageAlt: "A doctor takes a phone call at her desk while typing on a laptop",
    gallery: {
      src: "/images/proj-clinic-call-assistant-2.webp",
      alt: "A clinician in scrubs goes over details on a tablet with a patient",
      caption: "Every call arrives as a short written summary, so the morning starts with answers instead of voicemail.",
    },
    featured: true,
  },
  {
    slug: "contract-review-assistant",
    title: "Contract Review Desktop Assistant",
    client: "Mid-size law firm · commercial practice",
    audience: "professional-services",
    solution: "knowledge-assistant",
    services: ["desktop", "ai"],
    year: "2025",
    duration: "2-week prototype · 12 weeks to launch",
    team: "An AI engineer, a desktop and Office add-in engineer and a product designer",
    summary: "A Word add-in that reviews contracts against the firm's own playbook and precedents, running on firm-controlled infrastructure so client documents never leave it.",
    challenge:
      "Associates spent hours on first-pass review of routine commercial contracts, checking each clause against a playbook that lived in a long Word document. The firm wanted AI help, but partners would not allow client documents in public AI tools, and every suggestion had to point to the clause and the precedent behind it.",
    brief: [
      "Work inside Word, where lawyers already review",
      "Check contracts against the firm's own playbook and precedents",
      "Link every flag to the clause and the source it relies on",
      "Keep client documents on firm-controlled infrastructure",
    ],
    steps: [
      { phase: "Discovery call", when: "Before kickoff", desc: "A call with the practice group leader and IT, then a session watching associates review a contract and a security review of where the system could run." },
      { phase: "Prototype", when: "Weeks 1–2", desc: "The free two-week prototype reviewed sample contracts drafted from the firm's templates against its playbook, compared with an associate's own markup." },
      { phase: "Build", when: "Weeks 3–10", desc: "The Word add-in, precedent search, a private model deployment, single sign-on and matter permissions, with a demo every week." },
      { phase: "Launch", when: "Weeks 11–12", desc: "Rolled out to one practice group, with short training sessions and a feedback button on every flag." },
    ],
    built: [
      { title: "Playbook review", desc: "Each clause compared with the firm's preferred position and fallbacks, with deviations flagged by risk." },
      { title: "Cited precedents", desc: "Suggested language drawn from the firm's own approved clauses, with a link to the source." },
      { title: "Comments in Word", desc: "Flags and suggestions appear as comments beside the clause; the lawyer accepts, edits or dismisses each one." },
      { title: "Matter-aware search", desc: "Questions answered across past agreements the user is already allowed to open." },
    ],
    flow: [
      { label: "Word add-in", detail: "Reads the open contract and shows flags beside each clause" },
      { label: "Review service", detail: "Runs in the firm's own Azure tenant" },
      { label: "Playbook & precedents", detail: "Indexed with the firm's document permissions" },
      { label: "Model", detail: "Private deployment under terms that exclude training on firm data" },
      { label: "Lawyer review", detail: "Comments accepted, edited or dismissed in Word" },
    ],
    safeguards: [
      "Client documents processed only on firm-controlled infrastructure, never in public AI tools",
      "Search and answers respect matter permissions and ethical walls",
      "The assistant suggests; a lawyer decides on every change",
      "Activity logged for supervision; document text isn't kept once a review is closed",
    ],
    measures: [
      "Associates' agreement with the flags on sampled contracts",
      "Time spent on first-pass review, as reported by associates",
      "Issues found in partner review that the assistant missed",
      "Use across the practice group after launch",
    ],
    stack: [".NET", "Office.js", "Azure OpenAI", "pgvector", "Python", "Azure"],
    image: "/images/proj-contract-review-assistant.webp",
    imageAlt: "A lawyer highlights a contract at her desk",
    gallery: {
      src: "/images/proj-contract-review-assistant-2.webp",
      alt: "Four colleagues gather around a laptop at a wooden table, reviewing documents and notes together",
      caption: "Every flag links to the clause and the precedent behind it. The lawyer makes the call.",
    },
  },
  {
    slug: "order-operations-hub",
    title: "Order Operations Hub",
    client: "Online retailer · fulfillment through a third-party warehouse",
    audience: "logistics",
    solution: "reporting-autopilot",
    services: ["data", "automation", "web"],
    year: "2026",
    duration: "2-week prototype · 10 weeks to launch",
    team: "A data engineer, an automation engineer and a full-stack engineer",
    summary: "One live view of orders, stock and shipments across the store, the 3PL and the ERP, with stuck orders flagged automatically and the weekly report drafted for the team.",
    challenge:
      "Orders flowed from Shopify to a third-party warehouse and into NetSuite, but the systems rarely agreed. The operations team spent mornings exporting spreadsheets to find stuck orders, customers often reported problems before the team saw them, and the weekly numbers took most of Friday to put together.",
    brief: [
      "One view of every order from checkout to delivery",
      "Flag stuck orders and stock mismatches automatically",
      "A weekly report the team doesn't have to build by hand",
      "No change to the store, the 3PL or the ERP",
    ],
    steps: [
      { phase: "Discovery call", when: "Before kickoff", desc: "A call with the head of operations, then a morning following orders from checkout to the warehouse and back." },
      { phase: "Prototype", when: "Weeks 1–2", desc: "The free two-week prototype joined live orders from the store and the 3PL in one table, with the first exception rules running on real data." },
      { phase: "Build", when: "Weeks 3–8", desc: "Pipelines from Shopify, ShipStation, the 3PL and NetSuite, the exception queue, dashboards and the weekly summary, demoed every week." },
      { phase: "Launch", when: "Weeks 9–10", desc: "Run side by side with the old spreadsheets, then handed over with runbooks and training for the team." },
    ],
    built: [
      { title: "Order timeline", desc: "Each order's path through the store, warehouse, carrier and ERP in one place." },
      { title: "Exception queue", desc: "Stuck, late or mismatched orders flagged with the reason and assigned to the right person." },
      { title: "Stock reconciliation", desc: "Store and warehouse stock compared through the day, with differences explained." },
      { title: "Weekly summary", desc: "A plain-language report on orders, delays and returns, drafted from the checked data every Monday." },
    ],
    flow: [
      { label: "Sources", detail: "Shopify, ShipStation, the 3PL's API and NetSuite" },
      { label: "Pipelines", detail: "Scheduled and webhook loads, modeled with dbt" },
      { label: "Warehouse", detail: "One checked source of truth in PostgreSQL" },
      { label: "Rules & alerts", detail: "Exception rules with alerts to Slack and email" },
      { label: "Dashboards", detail: "Live dashboards and the AI-drafted weekly report" },
    ],
    safeguards: [
      "Read-only access to the source systems, apart from the actions the team approved",
      "Refunds, cancellations and stock adjustments are never made automatically",
      "Every data load is checked; a failed or partial load raises an alert instead of showing stale numbers",
      "Customer personal data limited to what support needs, with access by role",
    ],
    measures: [
      "How early stuck orders were spotted, compared with before",
      "Time the team spent on reconciliation and reporting each week",
      "Agreement between dashboard numbers and finance's month-end figures",
      "Customer contacts about order status",
    ],
    stack: ["Python", "dbt", "PostgreSQL", "Airflow", "Metabase", "Shopify API"],
    image: "/images/proj-order-operations-hub.webp",
    imageAlt: "A warehouse worker tapes up an e-commerce order for shipping",
    gallery: {
      src: "/images/proj-order-operations-hub-2.webp",
      alt: "Over-the-shoulder view of a person reviewing pie, donut and bar charts on a laptop, with printed charts beside it",
      caption: "Exceptions arrive with the reason attached, so the team fixes orders instead of hunting for them.",
    },
  },
  {
    slug: "saas-platform-rescue",
    title: "SaaS Platform Rescue",
    client: "Seed-stage B2B SaaS company",
    audience: "startups",
    services: ["rescue", "web", "cloud"],
    year: "2025",
    duration: "2-week audit · 14 weeks to a stable release",
    team: "A technical lead, a senior full-stack engineer and a cloud engineer",
    summary: "An MVP that had stalled with a previous vendor, audited, stabilized and shipped to pilot customers without the full rewrite the founders had been quoted.",
    challenge:
      "The founders had paid a previous vendor for an MVP that was months late, broke with every release and had no tests or documentation. Pilot customers were waiting, the code was hosted in the vendor's accounts, and another firm had quoted a complete rewrite. They needed an honest view of what could be saved, and a release they could put in front of customers.",
    brief: [
      "An honest audit of what to keep, fix or replace",
      "Code, hosting and domains moved into the company's own accounts",
      "A stable release for the pilot customers",
      "Tests and documentation a future in-house team can rely on",
    ],
    steps: [
      { phase: "Discovery call", when: "Before kickoff", desc: "A call with the founders, then read-only access to the repository and the hosting setup." },
      { phase: "Audit", when: "Weeks 1–2", desc: "The free first two weeks: a code and architecture audit, a written report on what to keep, fix or replace, and one critical bug fixed to show how we'd work." },
      { phase: "Stabilize & build", when: "Weeks 3–12", desc: "Ownership moved to the company, then CI/CD, tests and monitoring, the bugs blocking the pilot, and the missing MVP features, with a demo every week." },
      { phase: "Launch", when: "Weeks 13–14", desc: "Released to pilot customers in stages, then handed over with documentation and runbooks." },
    ],
    built: [
      { title: "Code and architecture audit", desc: "A plain-language report on what to keep, fix or replace, ranked by risk to the pilot." },
      { title: "Ownership transfer", desc: "Repository, cloud hosting, domains and third-party accounts moved into the company's name." },
      { title: "Release pipeline", desc: "Automated tests, CI/CD, a staging environment and quick rollback, so every release is checked before customers see it." },
      { title: "Monitoring and docs", desc: "Error tracking, uptime alerts, an architecture overview and runbooks for the next engineer." },
    ],
    flow: [
      { label: "Repository", detail: "Company-owned GitHub, with branch protection and code review" },
      { label: "CI/CD", detail: "GitHub Actions running tests on every change" },
      { label: "Staging", detail: "A copy of production for demos and release checks" },
      { label: "Production", detail: "Containers in the company's own AWS account, defined in Terraform" },
      { label: "Monitoring", detail: "Error tracking, uptime and cost alerts" },
    ],
    safeguards: [
      "No big-bang rewrite: every change shipped in small, reversible steps",
      "Production data copied to staging only in anonymized form",
      "Old vendor access removed and every secret rotated once ownership moved",
      "Database backups tested by restoring them, not just scheduled",
    ],
    measures: [
      "How often releases shipped, and how often they failed, before and after",
      "Errors and crashes reported by monitoring",
      "Pilot customers' feedback on stability",
      "Whether a new engineer could set up and ship from the documentation alone",
    ],
    stack: ["TypeScript", "Node.js", "PostgreSQL", "GitHub Actions", "Terraform", "AWS"],
    image: "/images/proj-saas-platform-rescue.webp",
    imageAlt: "Four engineers gather around a laptop in a bright office, one taking notes as they work through the results",
    gallery: {
      src: "/images/proj-saas-platform-rescue-2.webp",
      alt: "A team arranges sticky notes on a glass wall in a modern office",
      caption: "Audit findings mapped with the founders: what to fix first, what to keep, and what can wait.",
    },
  },
];

export const projectPath = (p: Pick<Project, "slug">) => `/projects/${p.slug}`;

/** The title of the industry a project was built for, e.g. "Healthcare". */
export const audienceTitle = (p: Pick<Project, "audience">) => industries.find((i) => i.key === p.audience)?.title ?? "";
