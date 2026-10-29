// ============================================================
//  SITE CONTENT — Jovano, software & applied-AI engineering.
//  Edit this single file to update the public site
//  (company details, the free-prototype offer, call booking, services, solutions,
//  industries, process, stack, team).
// ============================================================

export const company = {
  name: "Jovano",
  shortName: "Jovano",
  legalName: "Jovano LLC",
  initials: "J",
  entity: "Limited liability company",
  discipline: "Software & AI engineering",
  email: "terabyte5050@gmail.com",
  phone: "+1 (480) 271 8467",
  phoneHref: "tel:+14802718467",
  availability: "Booking new projects",
  responseTime: "one business day",
  engagements: "Free two-week prototype · Fixed-scope builds · Dedicated teams",
  tagline:
    "Jovano is a small senior team that builds custom AI tools, web and mobile apps, and desktop software — so the repetitive work that eats your team's week runs on its own.",
  intro:
    "One team from first call to production: we find the busywork worth automating, prove it with a working prototype, then engineer it properly and look after it.",
  about: [
    "Jovano is a software and applied-AI engineering company. We build the tools that take busywork off people's desks — the re-typing, chasing, copying and reporting that quietly eat a team's week — for healthcare, construction, real estate, professional services, logistics and growing software companies.",
    "We start with a task, not a technology. A short call to understand what's slowing your team down, a working prototype on your own data within two weeks, and only then a plan for the full build. You judge us by software you can click, not by slides.",
    "You work directly with the senior engineers who write the code, and everything we build is yours: source code, cloud accounts and documentation, from the first day. We stay as long as you need us — and make sure you don't have to.",
  ],
};

// ------------------------------------------------------------
//  The free-prototype offer — shown in the hero, on the booking page and in the closing calls to action.
//  It is a business promise: change or remove it here and every mention follows.
// ------------------------------------------------------------

export const offer = {
  badge: "First two weeks on us",
  title: "A working prototype in two weeks — on us",
  desc: "Tell us the task that eats your week. If software can take it off your plate, we build a working prototype on your own data in two weeks, free of charge. If it's worth building properly, we quote the rest; if not, you've lost nothing.",
};

// ------------------------------------------------------------
//  Call booking (/book). Times are worked out in the team's time zone below and shown to each visitor in theirs.
//  Booked calls are kept in the database (/admin → Bookings), which also stops two people taking the same time.
// ------------------------------------------------------------

export type CallTypeKey = "intro" | "discovery";

export interface CallType {
  key: CallTypeKey;
  label: string;
  minutes: number; // no longer than booking.slotMinutes, so calls never overlap
  desc: string;
}

export const booking = {
  timezone: "America/Phoenix", // the team's working hours are in this time zone (Arizona: no daylight saving)
  days: [1, 2, 3, 4, 5], // weekdays calls can be booked on: 0 = Sunday … 6 = Saturday
  start: "09:00", // the first call starts at…
  end: "17:00", // …and the last one ends by
  slotMinutes: 30, // calls start on the hour and half-hour; supabase/setup.sql (book_call) checks the same grid
  minNoticeHours: 12, // the soonest a call can be booked
  daysAhead: 21, // how far ahead
  meetingUrl: "", // your Google Meet or Zoom room; until it's set, the confirmation says the link follows by email
  callTypes: [
    {
      key: "intro",
      label: "Quick intro chat",
      minutes: 15,
      desc: "Tell us the task that eats your week. We'll tell you honestly whether software can take it off your plate.",
    },
    {
      key: "discovery",
      label: "Discovery call",
      minutes: 30,
      desc: "Walk us through the workflow, the systems and the data. You leave with a rough plan for a two-week prototype.",
    },
  ] as CallType[],
};

export type SocialKey = "email" | "phone";

export interface SocialLink {
  key: SocialKey;
  label: string;
  handle: string;
  href: string;
}

export const socials: SocialLink[] = [
  { key: "email", label: "Email", handle: company.email, href: `mailto:${company.email}` },
  { key: "phone", label: "Phone", handle: company.phone, href: company.phoneHref },
];

// ------------------------------------------------------------
//  Services — the engineering capabilities we offer
// ------------------------------------------------------------

export type ServiceKey = "ai" | "web" | "mobile" | "desktop" | "automation" | "cloud" | "data" | "rescue";

export interface Service {
  key: ServiceKey;
  slug: string; // URL: /services/<slug>
  title: string;
  desc: string;
  includes: string[];
  image?: string; // photo for the service card, menu preview and service page (public/images/svc-*.webp, 16:10); without one they show the icon
}

export const services: Service[] = [
  {
    key: "ai",
    slug: "ai-machine-learning",
    title: "AI & machine learning",
    desc: "Practical AI that does real work — assistants grounded in your documents, agents that use your tools, and vision and speech models — measured before it ships.",
    includes: ["LLM apps & agents", "RAG over your data", "Vision & speech"],
    image: "/images/svc-llm.webp",
  },
  {
    key: "web",
    slug: "custom-software-development",
    title: "Custom software & SaaS",
    desc: "Web applications, portals and SaaS products built around how your business actually runs — with the APIs and integrations behind them.",
    includes: ["Web apps & portals", "SaaS products", "APIs & integrations"],
    image: "/images/svc-platform.webp",
  },
  {
    key: "mobile",
    slug: "mobile-app-development",
    title: "Mobile app development",
    desc: "iOS and Android apps for customers and field teams — offline-first where signal is poor, with cameras, maps, scanning and push notifications.",
    includes: ["iOS & Android", "Offline-first", "Camera & GPS"],
    image: "/images/svc-mobile.webp",
  },
  {
    key: "desktop",
    slug: "desktop-software",
    title: "Desktop software",
    desc: "Windows, macOS and Linux applications and Office add-ins — for heavy files, local hardware, or data that must stay on the machine.",
    includes: ["Windows & macOS", "Office add-ins", "Hardware & local data"],
    image: "/images/svc-desktop.webp",
  },
  {
    key: "automation",
    slug: "business-process-automation",
    title: "Business process automation",
    desc: "The copy-paste, re-typing and chasing handed to software — documents read, systems synced and people nudged, with a human approving what matters.",
    includes: ["Workflow automation", "Document processing", "System integrations"],
    image: "/images/svc-automation.webp",
  },
  {
    key: "cloud",
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    desc: "Infrastructure that is secure, observable and cheap to run — set up as code in your own AWS, Azure or Google Cloud account.",
    includes: ["AWS · Azure · GCP", "CI/CD pipelines", "Monitoring & cost"],
    image: "/images/svc-cloud.webp",
  },
  {
    key: "data",
    slug: "data-engineering-analytics",
    title: "Data engineering & analytics",
    desc: "Your scattered spreadsheets and systems joined into one trustworthy source — with pipelines, dashboards and reports that update themselves.",
    includes: ["Data pipelines", "Warehouses", "Dashboards & reports"],
    image: "/images/svc-analytics.webp",
  },
  {
    key: "rescue",
    slug: "project-rescue-modernization",
    title: "Project rescue & modernization",
    desc: "Stalled builds, fragile legacy systems and code nobody wants to touch — audited, stabilized and moved forward without a risky rewrite.",
    includes: ["Code & architecture audits", "Stabilization", "Legacy modernization"],
    image: "/images/svc-evaluation.webp",
  },
];

// ------------------------------------------------------------
//  Technology stack. Each group shows up to 8 tools.
// ------------------------------------------------------------

export const stackGroups = [
  { title: "AI models", items: ["OpenAI GPT", "Anthropic Claude", "Google Gemini", "Llama", "Mistral", "Whisper"] },
  { title: "AI frameworks", items: ["LangChain", "LlamaIndex", "Hugging Face", "PyTorch", "OpenCV", "vLLM"] },
  { title: "Web & backend", items: ["TypeScript", "React", "Next.js", "Node.js", "Python", "FastAPI"] },
  { title: "Mobile & desktop", items: ["React Native", "Flutter", "Swift", "Kotlin", "Electron", ".NET"] },
  { title: "Data & integration", items: ["PostgreSQL", "pgvector", "Redis", "dbt", "Airflow", "n8n"] },
  { title: "Cloud & DevOps", items: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform"] },
];

// Capabilities scrolling under the hero
export const ticker = [
  "AI agents",
  "Document AI",
  "Web apps",
  "Mobile apps",
  "Desktop software",
  "Workflow automation",
  "Integrations",
  "Voice AI",
  "Dashboards",
  "Cloud & DevOps",
  "Data pipelines",
  "Legacy modernization",
];

// ------------------------------------------------------------
//  Solutions — packaged starting points we adapt per client.
//  Images live in public/images/ (16:10).
// ------------------------------------------------------------

export interface Solution {
  id: number;
  slug: string; // URL: /solutions/<slug>
  title: string;
  category: string; // where it works, used by the filter
  domain: string;
  summary: string;
  description: string;
  capabilities: string[];
  tech: string[];
  deliverables: string[];
  image: string;
}

export const solutions: Solution[] = [
  {
    id: 1,
    slug: "document-ai",
    title: "Document AI",
    category: "Back office",
    domain: "Invoices · Forms · Contracts",
    summary: "Paperwork in, clean data out — invoices, forms and contracts read, checked and posted to your systems, with a person approving the exceptions.",
    description:
      "Document AI takes the documents your team re-types every day — invoices, intake forms, delivery notes, lease agreements, lab results — and turns them into structured data. It reads PDFs, scans and email attachments, checks each field against your rules and existing records, and posts the result to your accounting, CRM or practice-management system. Anything unusual lands in a review queue, so people only handle the exceptions.",
    capabilities: [
      "Reads PDFs, scans, photos and email attachments",
      "Checks every field against your rules and existing records",
      "Review queue for exceptions, with the source highlighted",
      "Posts approved data to your accounting, CRM or ERP",
    ],
    tech: ["Claude / GPT", "Azure Document Intelligence", "Python", "FastAPI", "PostgreSQL", "React"],
    deliverables: ["Extraction pipeline", "Review & approval app", "System connectors", "Accuracy test set"],
    image: "/images/sol-document-ai.webp",
  },
  {
    id: 2,
    slug: "knowledge-assistant",
    title: "Knowledge Assistant",
    category: "Back office",
    domain: "RAG · Policies · Internal docs",
    summary: "An assistant that answers your team's questions from your own manuals, policies and past work — always with a link to the source.",
    description:
      "Knowledge Assistant gives staff instant, cited answers from the documents your company already has: procedures, handbooks, specifications, past proposals and project files. It respects existing permissions through single sign-on, says so when it doesn't know, and works where your people already are — a web app, Microsoft Teams or Slack. Content owners see which questions are asked, so gaps get filled.",
    capabilities: [
      "Cited answers from manuals, policies and project files",
      "Single sign-on and document-level permissions",
      "Works in a web app, Microsoft Teams or Slack",
      "Question analytics that show where documentation is missing",
    ],
    tech: ["LlamaIndex", "pgvector", "Claude / GPT", "FastAPI", "React", "Azure"],
    deliverables: ["Assistant web & chat app", "Ingestion pipeline", "Admin console", "Evaluation set"],
    image: "/images/sol-knowledge.webp",
  },
  {
    id: 3,
    slug: "ai-voice-agent",
    title: "AI Voice Agent",
    category: "Customer-facing",
    domain: "Calls · Chat · Scheduling",
    summary: "Answers calls and chats around the clock, books appointments, qualifies leads and hands anything tricky to a person — with a written summary.",
    description:
      "AI Voice Agent picks up when your team can't: after hours, at lunch, or when every line is busy. It answers common questions from your own information, books and reschedules appointments in your calendar or practice system, takes messages and qualifies new inquiries. Anything sensitive or unusual is passed to a person, and every conversation arrives as a short written summary instead of a voicemail.",
    capabilities: [
      "Natural phone and chat conversations, day and night",
      "Books and reschedules in your calendar or scheduling system",
      "Hands off to a person by rules you set",
      "Call summaries and transcripts sent to your team",
    ],
    tech: ["Twilio", "Whisper", "Claude / GPT", "Node.js", "PostgreSQL", "AWS"],
    deliverables: ["Voice & chat agent", "Calendar & CRM connectors", "Hand-off rules", "Call review dashboard"],
    image: "/images/sol-voice-agent.webp",
  },
  {
    id: 4,
    slug: "field-operations-app",
    title: "Field Operations App",
    category: "Field teams",
    domain: "Inspections · Site reports · Offline",
    summary: "A mobile app for crews and inspectors — checklists, photos, signatures and site reports that work offline and reach the office the moment there's signal.",
    description:
      "Field Operations App replaces the clipboard, the camera roll and the evening spent typing up notes. Crews fill in checklists and daily reports on a phone or tablet, attach photos and signatures, and keep working without signal. When they reconnect, everything syncs to the office, and AI turns voice notes and photos into a tidy report your project managers can send without rewriting.",
    capabilities: [
      "Checklists, daily reports, photos and signatures",
      "Works offline and syncs when back in signal",
      "Voice notes turned into written reports",
      "Office dashboard with every site and inspection",
    ],
    tech: ["React Native", "SQLite", "Node.js", "PostgreSQL", "Whisper", "AWS"],
    deliverables: ["iOS & Android app", "Office web dashboard", "Report templates", "Offline sync service"],
    image: "/images/sol-field-app.webp",
  },
  {
    id: 5,
    slug: "reporting-autopilot",
    title: "Reporting Autopilot",
    category: "Back office",
    domain: "Dashboards · KPIs · Weekly summaries",
    summary: "Connects the tools you already use, keeps the numbers in one place and writes the weekly report for you — so Monday morning starts with answers.",
    description:
      "Reporting Autopilot ends the spreadsheet stitching. It pulls data from your accounting, CRM, project, e-commerce and operations tools into one warehouse, checks it, and keeps live dashboards up to date. Each week it drafts a plain-language summary of what changed and why, and it can alert the right person the moment a number moves out of range.",
    capabilities: [
      "Connectors for accounting, CRM, e-commerce and project tools",
      "One checked source of truth in your own database",
      "Live dashboards for owners, managers and teams",
      "AI-written weekly summaries and threshold alerts",
    ],
    tech: ["Python", "dbt", "PostgreSQL", "Airflow", "Metabase", "Claude / GPT"],
    deliverables: ["Data pipeline & warehouse", "Dashboards", "Weekly summary & alerts", "Data dictionary"],
    image: "/images/sol-analytics.webp",
  },
  {
    id: 6,
    slug: "client-portal",
    title: "Client Portal",
    category: "Customer-facing",
    domain: "Web & mobile · Self-service",
    summary: "A branded portal where your customers submit requests, share documents, sign, pay and check progress — instead of emailing and calling to ask.",
    description:
      "Client Portal gives your customers, tenants, patients or partners one place to deal with you. They submit requests and documents, sign and pay, and see the status of their job, case or order without picking up the phone. Behind it, requests flow into your existing systems, and your team gets a simple back office to answer and update them.",
    capabilities: [
      "Requests, documents, e-signatures and payments",
      "Live status updates and notifications",
      "Back office for your team, linked to your systems",
      "Web first, with a mobile app when you need one",
    ],
    tech: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    deliverables: ["Customer portal", "Team back office", "Integrations", "Admin & reporting"],
    image: "/images/sol-client-portal.webp",
  },
];

// ------------------------------------------------------------
//  Industries — who we build for. Images live in public/images/ (4:5 crops).
// ------------------------------------------------------------

export interface Industry {
  key: string; // also the URL: /industries/<key>
  title: string;
  focus: string;
  desc: string;
  work: string[];
  solutions: string[]; // solution titles; each opens that solution's details
  image: string;
  imageAlt: string;
}

export const industries: Industry[] = [
  {
    key: "healthcare",
    title: "Healthcare",
    focus: "Clinics · Practices · Health-tech",
    desc: "Less time on phones and paperwork, more time with patients — built with privacy and HIPAA requirements in mind from the first sketch.",
    work: ["Patient calls & scheduling", "Intake & referral paperwork", "Clinical note drafting"],
    solutions: ["AI Voice Agent", "Document AI", "Knowledge Assistant"],
    image: "/images/aud-healthcare.webp",
    imageAlt: "A smiling doctor in a white coat using a tablet",
  },
  {
    key: "construction",
    title: "Construction",
    focus: "Contractors · Subcontractors · Engineering",
    desc: "Site reports, inspections and document control that work in the field and land in the office without anyone re-typing them.",
    work: ["Daily reports & inspections", "RFIs, submittals & document control", "Estimating & takeoff support"],
    solutions: ["Field Operations App", "Document AI", "Reporting Autopilot"],
    image: "/images/aud-construction.webp",
    imageAlt: "A site manager in a hard hat checking plans on a tablet at a construction site",
  },
  {
    key: "real-estate",
    title: "Real estate",
    focus: "Brokerages · Property managers · Investors",
    desc: "Leads answered in minutes, tenants served without phone tag, and leases and invoices processed while your team does the deals.",
    work: ["Lead response & follow-up", "Tenant & owner portals", "Lease and invoice processing"],
    solutions: ["Client Portal", "Document AI", "AI Voice Agent"],
    image: "/images/aud-real-estate.webp",
    imageAlt: "A real estate agent handing over house keys to new owners",
  },
  {
    key: "professional-services",
    title: "Professional services",
    focus: "Law · Accounting · Insurance · Consulting",
    desc: "Document-heavy work made faster and safer — review, intake and research tools that keep confidential files under your control.",
    work: ["Document & contract review", "Client intake & onboarding", "Internal knowledge search"],
    solutions: ["Knowledge Assistant", "Document AI", "Client Portal"],
    image: "/images/aud-professional.webp",
    imageAlt: "A professional reviewing documents at a desk in a modern office",
  },
  {
    key: "logistics",
    title: "Logistics & e-commerce",
    focus: "Warehouses · Online retail · Distribution",
    desc: "Orders, stock and shipments kept in sync across every system, with customers answered and exceptions caught before they cost you.",
    work: ["Order & inventory sync", "Shipment tracking & updates", "Customer support automation"],
    solutions: ["Reporting Autopilot", "AI Voice Agent", "Field Operations App"],
    image: "/images/aud-logistics.webp",
    imageAlt: "A warehouse worker scanning packages between tall shelves",
  },
  {
    key: "startups",
    title: "Startups & SaaS",
    focus: "Founders · Product teams · Scale-ups",
    desc: "A senior team that ships your MVP, adds AI to your product, or rescues a build that has stalled — without slowing your roadmap.",
    work: ["MVPs & new products", "AI features in your product", "Rescue & scale-up engineering"],
    solutions: ["Client Portal", "Knowledge Assistant"],
    image: "/images/aud-startups.webp",
    imageAlt: "A software team brainstorming product ideas in an office",
  },
];

// ------------------------------------------------------------
//  Delivery process. Activities use "Label: detail" so the UI can emphasise the label.
// ------------------------------------------------------------

export interface Phase {
  id: number;
  name: string;
  title: string;
  summary: string;
  activities: string[];
  outputs: string[];
  image: string; // banner photo on the phase card (public/images/phase-*.webp, 16:10)
}

export const phases: Phase[] = [
  {
    id: 1,
    name: "Discover",
    title: "Find the busywork",
    summary: "A short call about the task that eats your week. We learn how the work is done today, which systems it touches and what 'fixed' would look like.",
    activities: [
      "Call: A free 15- or 30-minute call with a senior engineer, not a salesperson.",
      "Workflow walk-through: We watch the task being done and map the systems and data it touches.",
      "Success measures: What 'done' means for your team, agreed before anything is built.",
      "Prototype plan: A one-page plan for what we'll prove in the next two weeks.",
    ],
    outputs: ["Workflow map", "Success measures", "Two-week prototype plan"],
    image: "/images/phase-discover.webp",
  },
  {
    id: 2,
    name: "Prototype",
    title: "Two weeks, on us",
    summary: "A working prototype on your own data within two weeks — free. You see the busywork handled by software before you commit to anything.",
    activities: [
      "Build: The core of the solution working end to end on a sample of your real data.",
      "Try it: Your team uses it on real tasks and tells us what helps and what doesn't.",
      "Proposal: If it's worth building properly, a fixed-scope quote with milestones. If not, you've lost nothing.",
    ],
    outputs: ["Working prototype", "Feedback notes", "Fixed-scope proposal"],
    image: "/images/phase-prototype.webp",
  },
  {
    id: 3,
    name: "Build",
    title: "Production engineering",
    summary: "Secure, maintainable software built in short iterations, with a demo every week and automated tests on every change.",
    activities: [
      "Architecture: A design that fits your systems, your security needs and your budget to run.",
      "Weekly demos: Working software every week, so progress is something you can click.",
      "Quality: Code review, automated tests and AI evaluations on every release.",
    ],
    outputs: ["Source code in your repository", "CI/CD pipeline", "Security review"],
    image: "/images/phase-build.webp",
  },
  {
    id: 4,
    name: "Launch",
    title: "Release & training",
    summary: "A careful rollout to real users, the training your team needs, and everything handed over: code, cloud accounts and documentation.",
    activities: [
      "Rollout: A staged release, starting with a small group, with monitoring from day one.",
      "Training: Short sessions for the people who use it and the people who'll maintain it.",
      "Handover: Code, credentials, runbooks and architecture notes — all in your name.",
    ],
    outputs: ["Production release", "Training sessions", "Runbooks & documentation"],
    image: "/images/phase-launch.webp",
  },
  {
    id: 5,
    name: "Support",
    title: "Measure & improve",
    summary: "Launch is the start. We watch reliability, cost and usage, fix what needs fixing and keep improving it for as long as you want us to.",
    activities: [
      "Monitoring: Uptime, errors, cost and AI quality dashboards with alerts.",
      "Iteration: Regular releases driven by your team's feedback.",
      "Support: A support plan sized to the system — or a clean handover to your own team.",
    ],
    outputs: ["Support plan", "Release notes", "Monthly health report"],
    image: "/images/phase-improve.webp",
  },
];

// ------------------------------------------------------------
//  Company
// ------------------------------------------------------------

export const principles = [
  {
    title: "The task before the tech",
    desc: "We start from the work that eats your week, not from a tool we want to sell. If a spreadsheet fix is enough, we'll say so.",
  },
  {
    title: "Senior engineers, direct line",
    desc: "You talk to the people who design and write the code. No account-manager relay, no juniors learning on your project.",
  },
  {
    title: "Show, don't promise",
    desc: "A working prototype in two weeks, then a demo every week. You judge progress by software you can use.",
  },
  {
    title: "Yours to keep",
    desc: "Source code, cloud accounts and documentation belong to you from day one. No lock-in, no hostage hosting.",
  },
];

// ------------------------------------------------------------
//  Team. PLACEHOLDER PROFILES: fictional names on licensed stock portraits.
//  Replace with your real team before launch — visitors will read these as your staff.
//  The site shows the team from the database (edited at /admin → Team) and falls back to this
//  list when it can't. supabase/setup.sql loads the same people as the database's starting team.
//  photo: portrait in public/images/team/ (4:5); without one the card shows initials.
// ------------------------------------------------------------

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  focus?: string[]; // up to three specialities, shown as tags
}

export const builtInTeam: TeamMember[] = [
  {
    name: "Martin Keller",
    role: "Founder & CEO",
    bio: "Takes most of the first calls, and makes sure every project starts from a real task that's eating someone's week.",
    photo: "/images/team/martin.webp",
    focus: ["Discovery", "Strategy", "Partnerships"],
  },
  {
    name: "Kenji Watanabe",
    role: "CTO · Head of engineering",
    bio: "Owns architecture and engineering standards, from the first prototype to production infrastructure and security.",
    photo: "/images/team/kenji.webp",
    focus: ["Architecture", "Cloud", "Security"],
  },
  {
    name: "Mei Lin Chen",
    role: "Lead AI engineer",
    bio: "Builds and tests the AI behind our assistants, agents and document tools, with a focus on accuracy and safe hand-offs.",
    photo: "/images/team/mei.webp",
    focus: ["LLM apps", "Agents", "Evaluation"],
  },
  {
    name: "Marcus Bello",
    role: "Senior full-stack engineer",
    bio: "Turns prototypes into fast, reliable web apps and portals, and wires them into the systems clients already use.",
    photo: "/images/team/marcus.webp",
    focus: ["React", "Node.js", "Integrations"],
  },
  {
    name: "Sofia Marín",
    role: "Mobile engineering lead",
    bio: "Builds iOS and Android apps for customers and field crews — offline-first, camera-ready and easy to use with gloves on.",
    photo: "/images/team/sofia.webp",
    focus: ["React Native", "Swift", "Offline-first"],
  },
  {
    name: "Hannah Lindqvist",
    role: "Data engineer",
    bio: "Joins scattered systems and spreadsheets into one reliable source, and builds the dashboards and reports on top.",
    photo: "/images/team/hannah.webp",
    focus: ["Data pipelines", "dbt", "Dashboards"],
  },
  {
    name: "Amara Nwosu",
    role: "Automation & desktop engineer",
    bio: "Automates the copy-paste between systems and builds desktop tools and Office add-ins where the work really happens.",
    photo: "/images/team/amara.webp",
    focus: ["Automation", ".NET", "Office add-ins"],
  },
  {
    name: "Owen Brady",
    role: "Product designer",
    bio: "Shapes interfaces that make complex software feel simple, from first sketch to a design system your team can reuse.",
    photo: "/images/team/owen.webp",
    focus: ["Product design", "UX research", "Prototyping"],
  },
];

// Shown beside the contact form
export const nextSteps = [
  { title: "Reply from an engineer", desc: `A senior engineer reads your message and replies within ${company.responseTime}.` },
  { title: "A short call", desc: "15 or 30 minutes about the task, the systems it touches and what 'fixed' looks like." },
  { title: "Two-week prototype, on us", desc: "Working software on your own data — then a fixed-scope quote only if it's worth building." },
];

export const companyFile = [
  { k: "Legal name", v: company.legalName },
  { k: "Entity", v: company.entity },
  { k: "Focus", v: company.discipline },
  { k: "Engagements", v: company.engagements },
];

export const stats = [
  { value: "2", label: "Weeks to a working prototype — on us" },
  { value: String(services.length), label: "Engineering capabilities under one roof" },
  { value: String(industries.length), label: "Industries we build for" },
  { value: String(stackGroups.reduce((n, g) => n + g.items.length, 0)), label: "Tools across our stack" },
];

// Descriptions of the site photos that aren't decorative and aren't described elsewhere in this file.
// A replacement chosen in the admin can override them (see usePhotos).
export const photoAlts = {
  "company-team.webp": "A product team mapping ideas on a whiteboard with sticky notes",
  "company-client.webp": "Two colleagues on a video call with a client at a laptop",
  "trust-security.webp": "An engineer reviewing code on two monitors in a quiet office",
};

// ------------------------------------------------------------
//  Photography credits. Freepik's (now Magnific) free licence requires attribution, so every
//  photo used on the site is listed here and shown at /terms#credits. Pexels photos don't
//  require it, but are credited alongside for consistency.
// ------------------------------------------------------------

export interface ImageCredit {
  file: string;
  subject: string;
  author: string;
  href: string; // the photo's page on its source site
  source?: "Magnific" | "Pexels"; // defaults to Magnific
}

export const imageCredits: ImageCredit[] = [
  { file: "sol-knowledge.webp", subject: "Knowledge Assistant — colleagues reviewing work on screen", author: "Apunto Group", href: "https://www.pexels.com/photo/focused-colleagues-working-on-project-in-office-7752873/", source: "Pexels" },
  { file: "sol-analytics.webp", subject: "Reporting Autopilot — a team reviewing a dashboard", author: "Muhammad Jawadur Rahman", href: "https://www.pexels.com/photo/brainstorming-during-presentation-15096572/", source: "Pexels" },
  { file: "aud-startups.webp", subject: "Startups & SaaS — software engineers brainstorming", author: "DC Studio", href: "https://www.magnific.com/free-photo/team-software-engineers-doing-brainstorming-office_417798983.htm" },
  { file: "company-team.webp", subject: "Company — team mapping ideas on a whiteboard", author: "Thirdman", href: "https://www.pexels.com/photo/colleagues-planning-a-business-5257576/", source: "Pexels" },
  { file: "cta-backdrop.webp", subject: "Banner — engineers and AI", author: "DC Studio", href: "https://www.magnific.com/free-photo/engineers-brainstorming-ways-use-ai_190325729.htm" },
  { file: "svc-llm.webp", subject: "AI & machine learning — chat prompt to a language model (Visualising AI artwork by Wes Cockx)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-illustration-depicts-language-models-which-generate-text-it-was-created-by-wes-cockx-as-part-of-the-visualising-ai-project-l-18069695/", source: "Pexels" },
  { file: "svc-analytics.webp", subject: "Data engineering & analytics — analyst reviewing dashboards on two monitors", author: "Kampus Production", href: "https://www.pexels.com/photo/woman-in-yellow-long-sleeve-shirt-looking-at-computer-data-8204355/", source: "Pexels" },
  { file: "svc-evaluation.webp", subject: "Project rescue & modernization — engineer carefully reviewing code", author: "Naboth Otieno", href: "https://www.pexels.com/photo/man-working-with-computers-19805877/", source: "Pexels" },
  { file: "svc-build.webp", subject: "Two engineers building together at a monitor", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/young-professionals-working-with-computers-7988745/", source: "Pexels" },
  { file: "tech-datacenter.webp", subject: "Data centre — aisle of server racks", author: "Brett Sayles", href: "https://www.pexels.com/photo/server-racks-on-data-center-4508751/", source: "Pexels" },
  { file: "tech-code.webp", subject: "Code on screen — developer at a dual-monitor standing desk", author: "Christina Morillo", href: "https://www.pexels.com/photo/woman-sitting-in-front-laptop-1181677/", source: "Pexels" },
  { file: "tech-ai-abstract.webp", subject: "Abstract AI visual — iridescent glass shapes (Visualising AI artwork by Wes Cockx)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-image-visualises-artificial-general-intelligence-or-agi-it-was-created-by-wes-cockx-as-part-of-the-visualising-ai-project-l-17486102/", source: "Pexels" },
  { file: "hero-ai.webp", subject: "Abstract AI tile — blue and violet data blocks (Visualising AI artwork by Rose Pilkington)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-image-visualises-the-input-and-output-of-neural-networks-and-how-ai-systems-perceive-data-it-was-created-by-rose-pilkington-17485706/", source: "Pexels" },
  { file: "proj-saas-platform-rescue.webp", subject: "SaaS Platform Rescue — engineers reviewing results together at a monitor", author: "Tiger Lily", href: "https://www.pexels.com/photo/colleagues-looking-at-the-screen-7109095/", source: "Pexels" },
  { file: "proj-saas-platform-rescue-2.webp", subject: "SaaS Platform Rescue — team mapping findings on a glass wall", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/collaborative-office-team-brainstorming-39204849/", source: "Pexels" },
  { file: "proj-clinic-call-assistant-2.webp", subject: "Clinic Call Assistant — healthcare workers using a laptop and tablet", author: "Thirdman", href: "https://www.pexels.com/photo/healthcare-professionals-working-on-their-gadgets-while-sitting-next-to-each-other-5327654/", source: "Pexels" },
  { file: "about-pairing.webp", subject: "About — engineers pair-programming", author: "Diva Plavalaguna", href: "https://www.pexels.com/photo/men-looking-at-the-screen-of-a-laptop-6147360/", source: "Pexels" },
  { file: "about-research.webp", subject: "About — walking a client through a prototype", author: "Yan Krukau", href: "https://www.pexels.com/photo/women-sitting-at-the-meeting-table-with-laptop-and-digital-tablet-8837735/", source: "Pexels" },
  { file: "about-remote.webp", subject: "About — hybrid team meeting on video call", author: "MART PRODUCTION", href: "https://www.pexels.com/photo/a-group-of-people-in-a-meeting-using-video-call-7644076/", source: "Pexels" },
  { file: "about-office.webp", subject: "About — bright, plant-filled studio", author: "Thirdman", href: "https://www.pexels.com/photo/man-and-woman-having-a-conversation-7653773/", source: "Pexels" },
  { file: "about-celebrate.webp", subject: "About — team celebrating a launch", author: "Andrea Piacquadio", href: "https://www.pexels.com/photo/smiling-diverse-employees-of-different-ages-using-laptop-and-cooperating-on-project-in-office-3866342/", source: "Pexels" },
  { file: "phase-discover.webp", subject: "Delivery phase — Discover", author: "fauxels", href: "https://www.pexels.com/photo/group-of-people-gathered-around-wooden-table-3184360/", source: "Pexels" },
  { file: "phase-prototype.webp", subject: "Delivery phase — Prototype", author: "Akshar Dave🌻", href: "https://www.pexels.com/photo/a-person-holding-black-smartphone-11780441/", source: "Pexels" },
  { file: "phase-build.webp", subject: "Delivery phase — Build", author: "ThisIsEngineering", href: "https://www.pexels.com/photo/woman-coding-on-computer-3861958/", source: "Pexels" },
  { file: "phase-improve.webp", subject: "Delivery phase — Support (reviewing metrics)", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/creative-team-meeting-analyzing-business-growth-39190577/", source: "Pexels" },
  { file: "aud-healthcare.webp", subject: "Healthcare — smiling doctor in a white coat using a tablet", author: "Tessy Agbonome", href: "https://www.pexels.com/photo/smiling-doctor-sitting-with-tablet-19963124/", source: "Pexels" },
  { file: "proj-clinic-call-assistant.webp", subject: "After-Hours Clinic Call Assistant — doctor taking a phone call at her desk while typing on a laptop", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/female-doctor-using-laptop-and-phone-in-office-39192373/", source: "Pexels" },
  { file: "sol-voice-agent.webp", subject: "AI Voice Agent — call-center agent with a headset taking a call at her desk", author: "Jep Gambardella", href: "https://www.pexels.com/photo/woman-working-as-a-call-center-agent-7689734/", source: "Pexels" },
  { file: "hero-work.webp", subject: "Hero tile — relaxed office manager smiling at her laptop", author: "Mizuno K", href: "https://www.pexels.com/photo/smiling-woman-sitting-behind-a-desk-and-using-laptop-12912112/", source: "Pexels" },
  { file: "company-client.webp", subject: "Company — two colleagues on a video call at a laptop", author: "RDNE Stock project", href: "https://www.pexels.com/photo/businesswomen-holding-a-ceramic-mug-sitting-and-having-video-conference-using-a-computer-laptop-7491548/", source: "Pexels" },
  { file: "trust-security.webp", subject: "Security & AI — engineer reviewing code on dual monitors in a calm office", author: "Ofspace LLC, Culture", href: "https://www.pexels.com/photo/a-man-sitting-at-a-desk-with-two-monitors-16323580/", source: "Pexels" },
  { file: "phase-launch.webp", subject: "Delivery phase — Launch (team celebrating at a laptop)", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/team-celebrating-success-with-a-laptop-39204861/", source: "Pexels" },
  { file: "svc-platform.webp", subject: "Custom software & SaaS — developer writing HTML on a large monitor", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/back-view-shot-of-a-man-working-on-his-computer-7988113/", source: "Pexels" },
  { file: "svc-mobile.webp", subject: "Mobile app development — app running on a phone stand beside a laptop and monitors full of code", author: "Firos nv", href: "https://www.pexels.com/photo/a-close-up-shot-of-a-smartphone-beside-a-laptop-8171308/", source: "Pexels" },
  { file: "svc-desktop.webp", subject: "Desktop software — engineer working on a 3D CAD model across two screens", author: "ThisIsEngineering", href: "https://www.pexels.com/photo/engineer-working-in-office-19895882/", source: "Pexels" },
  { file: "svc-automation.webp", subject: "Business process automation — data flowing through a chain of processing stages (Visualising AI artwork by Novoto Studio)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-image-was-inspired-by-neural-networks-used-in-deep-learning-it-was-created-by-novoto-studio-as-part-of-the-visualising-ai-pr-17483874/", source: "Pexels" },
  { file: "svc-cloud.webp", subject: "Cloud & DevOps — engineer with a laptop in a server room", author: "Christina Morillo", href: "https://www.pexels.com/photo/software-engineer-using-laptop-1181341/", source: "Pexels" },
  { file: "aud-construction.webp", subject: "Construction — engineer in a hard hat and hi-vis vest holding a tablet on a city building site", author: "Mikael Blomkvist", href: "https://www.pexels.com/photo/a-woman-wearing-a-personal-protective-clothing-8961018/", source: "Pexels" },
  { file: "sol-field-app.webp", subject: "Field Operations App — construction worker in a hard hat and safety vest checking a phone on a steel-frame site", author: "Provisionshots LLC", href: "https://www.pexels.com/photo/man-in-yellow-vest-wearing-a-blue-hard-hat-10923553/", source: "Pexels" },
  { file: "proj-site-report-app.webp", subject: "Daily Site Report App — site manager in a hard hat reviewing a tablet in a building under renovation", author: "Tima Miroshnichenko", href: "https://www.pexels.com/photo/woman-wearing-white-helmet-while-holding-a-tablet-inside-the-house-6474459/", source: "Pexels" },
  { file: "proj-site-report-app-2.webp", subject: "Daily Site Report App — project team in hard hats reviewing plans around a site-office table", author: "Harrun Muhammad", href: "https://www.pexels.com/photo/team-of-engineers-discuss-construction-plans-37198884/", source: "Pexels" },
  { file: "aud-real-estate.webp", subject: "Real estate — agent handing house keys to new owners outside a property", author: "Thirdman", href: "https://www.pexels.com/photo/an-agent-handing-the-key-to-the-owners-8470805/", source: "Pexels" },
  { file: "proj-invoice-intake-automation.webp", subject: "Invoice Intake Automation — accountant working through invoices with a laptop and calculator", author: "RDNE Stock project", href: "https://www.pexels.com/photo/a-man-sitting-at-the-table-7821710/", source: "Pexels" },
  { file: "proj-invoice-intake-automation-2.webp", subject: "Invoice Intake Automation — modern apartment building with balconies against a blue sky", author: "Jan van der Wolf", href: "https://www.pexels.com/photo/modern-apartment-building-against-clear-blue-sky-37224965/", source: "Pexels" },
  { file: "sol-client-portal.webp", subject: "Client Portal — couple on a sofa at home looking at a laptop together", author: "Mizuno K", href: "https://www.pexels.com/photo/man-and-woman-sitting-on-a-couch-in-a-living-room-and-using-laptop-12788350/", source: "Pexels" },
  { file: "sol-document-ai.webp", subject: "Document AI — office worker sorting a tall stack of paper files next to a laptop", author: "Pavel Danilyuk", href: "https://www.pexels.com/photo/woman-working-in-an-office-7654448/", source: "Pexels" },
  { file: "aud-professional.webp", subject: "Professional services — professional reviewing documents at a desk in a modern office", author: "ANTONI SHKRABA production", href: "https://www.pexels.com/photo/man-wearing-black-coat-holding-documents-8278848/", source: "Pexels" },
  { file: "proj-contract-review-assistant.webp", subject: "Contract Review Desktop Assistant — lawyer marking up a contract at a desk", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/side-view-of-a-woman-writing-on-the-contract-8730368/", source: "Pexels" },
  { file: "proj-contract-review-assistant-2.webp", subject: "Contract Review Desktop Assistant — colleagues reviewing documents together at a table", author: "Kindel Media", href: "https://www.pexels.com/photo/people-working-together-on-the-table-7651829/", source: "Pexels" },
  { file: "aud-logistics.webp", subject: "Logistics & e-commerce — warehouse worker scanning stock between racks", author: "Tiger Lily", href: "https://www.pexels.com/photo/photo-of-man-using-digital-tablet-4484150/", source: "Pexels" },
  { file: "proj-order-operations-hub.webp", subject: "Order Operations Hub — warehouse worker taping up an order box for shipping", author: "Tima Miroshnichenko", href: "https://www.pexels.com/photo/woman-in-white-crew-neck-t-shirt-holding-white-and-red-ceramic-mug-6169030/", source: "Pexels" },
  { file: "proj-order-operations-hub-2.webp", subject: "Order Operations Hub — person reviewing a dashboard on a laptop", author: "RDNE Stock project", href: "https://www.pexels.com/photo/person-using-black-laptop-on-table-7948012/", source: "Pexels" },
  { file: "team/martin.webp", subject: "Team portrait — Martin Keller (placeholder)", author: "katemangostar", href: "https://www.magnific.com/free-photo/portrait-positive-confident-businessman_3584960.htm" },
  { file: "team/kenji.webp", subject: "Team portrait — Kenji Watanabe (placeholder)", author: "katemangostar", href: "https://www.magnific.com/free-photo/content-confident-handsome-asian-businessman-looking-camera_3583387.htm" },
  { file: "team/mei.webp", subject: "Team portrait — Mei Lin Chen (placeholder)", author: "benzoix", href: "https://www.magnific.com/free-photo/young-asian-woman-professional-entrepreneur-standing-office-clothing-smiling-looking-confident-white-background_23649170.htm" },
  { file: "team/marcus.webp", subject: "Team portrait — Marcus Bello (placeholder)", author: "wayhomestudio", href: "https://www.magnific.com/free-photo/prosperous-businessman-keeps-hands-crossed-has-satisfied-expression_10521289.htm" },
  { file: "team/sofia.webp", subject: "Team portrait — Sofia Marín (placeholder)", author: "tonodiaz", href: "https://www.magnific.com/free-photo/portrait-attractive-hispanic-businesswoman-with-her-arms-crossed-against-white-background-with-lot-copy-space_27507512.htm" },
  { file: "team/hannah.webp", subject: "Team portrait — Hannah Lindqvist (placeholder)", author: "wayhomestudio", href: "https://www.magnific.com/free-photo/cheerful-beautiful-european-female-with-pleasant-smile_12086582.htm" },
  { file: "team/amara.webp", subject: "Team portrait — Amara Nwosu (placeholder)", author: "pch.vector", href: "https://www.magnific.com/free-photo/happy-successful-female-agent_6101390.htm" },
  { file: "team/owen.webp", subject: "Team portrait — Owen Brady (placeholder)", author: "cookie_studio", href: "https://www.magnific.com/free-photo/handsome-bearded-redhead-guy-posing-against-white-wall-with-glasses_11104169.htm" },
];

// ------------------------------------------------------------
//  Top-bar menus. Services, Solutions and Industries list the data above;
//  the Company menu is set here. Hovering an item previews it on the right.
// ------------------------------------------------------------

export type CompanyMenuKey = "about" | "approach" | "technology" | "team" | "responsible" | "contact";

export interface CompanyMenuItem {
  key: CompanyMenuKey;
  label: string;
  desc: string;
  to: string; // page route
  image?: string; // preview photo; Team and Contact draw their own preview, others fall back to the icon
}

export const companyMenu: CompanyMenuItem[] = [
  { key: "about", label: "About", desc: "Who we are, how we work with clients and what we stand for.", to: "/about", image: "/images/about-office.webp" },
  { key: "approach", label: "How we work", desc: "From a free call to a two-week prototype to production — and the ways to engage.", to: "/approach", image: "/images/phase-discover.webp" },
  { key: "technology", label: "Technology", desc: "The models, frameworks and cloud platforms we build with — and how we choose.", to: "/technology", image: "/images/tech-ai-abstract.webp" },
  { key: "team", label: "Team", desc: "The senior engineers and designers you'll work with directly.", to: "/team" },
  { key: "responsible", label: "Security & AI", desc: "How we protect your data, your code and your customers.", to: "/responsible-ai", image: "/images/trust-security.webp" },
  { key: "contact", label: "Contact", desc: `Tell us what's eating your week — we reply within ${company.responseTime}.`, to: "/contact" },
];

// Home page sections, in order (the navbar highlights the menu that covers the one in view)
export const homeSections = ["busywork", "services", "solutions", "projects", "industries", "process", "technology", "company", "team", "faq", "contact"];

// Every page, for the footer site map
export const sitePages = [
  { to: "/services", label: "Services" },
  { to: "/solutions", label: "Solutions" },
  { to: "/projects", label: "Our work" },
  { to: "/industries", label: "Industries" },
  { to: "/approach", label: "How we work" },
  { to: "/technology", label: "Technology" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/responsible-ai", label: "Security & AI" },
  { to: "/faq", label: "Questions" },
  { to: "/book", label: "Book a call" },
  { to: "/contact", label: "Contact" },
];

// Page URLs, so every link to a solution, service or industry agrees
export const solutionPath = (s: Pick<Solution, "slug">) => `/solutions/${s.slug}`;
export const servicePath = (s: Pick<Service, "slug">) => `/services/${s.slug}`;
export const industryPath = (i: Pick<Industry, "key">) => `/industries/${i.key}`;

export const legalLinks = [
  { to: "/privacy", label: "Privacy policy" },
  { to: "/terms", label: "Terms of use" },
];

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// The router's navigate function, registered by PageShell, so the helpers below can change page.
let navigateTo: ((to: string) => void) | null = null;
export const setNavigator = (fn: ((to: string) => void) | null) => {
  navigateTo = fn;
};
const go = (to: string) => (navigateTo ? navigateTo(to) : window.location.assign(to));

/**
 * Fired on window to open a solution's details in place; detail is the solution title.
 * The Solutions section handles it by calling preventDefault(); on pages without it, the solution's page opens instead.
 */
export const OPEN_SOLUTION_EVENT = "jovano:open-solution";

export const openSolution = (title: string) => {
  const handled = !window.dispatchEvent(new CustomEvent<string>(OPEN_SOLUTION_EVENT, { detail: title, cancelable: true }));
  const s = solutions.find((x) => x.title === title);
  if (!handled && s) go(solutionPath(s));
};

/**
 * Fired on window to pre-fill the contact form; detail is the topic of interest, if any.
 * A contact form on the page handles it (preventDefault) and is scrolled to; otherwise /contact opens, pre-filled.
 */
export const ENQUIRE_EVENT = "jovano:enquire";

export const startEnquiry = (topic?: string) => {
  const handled = !window.dispatchEvent(new CustomEvent<string | undefined>(ENQUIRE_EVENT, { detail: topic, cancelable: true }));
  if (handled) scrollToId("contact");
  else go(topic ? `/contact?topic=${encodeURIComponent(topic)}` : "/contact");
};

/** Opens the booking page (/book); a topic, such as a service or solution title, is carried into the booking form. */
export const bookCall = (topic?: string) => go(topic ? `/book?topic=${encodeURIComponent(topic)}` : "/book");
