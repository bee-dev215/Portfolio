// ============================================================
//  SITE CONTENT — Jovano, an AI & software engineering company.
//  Edit this single file to update the public site
//  (company details, the free-prototype offer, call booking, services, solutions, process, stack, team).
// ============================================================

import { startNavigation } from "@/lib/route-preload";
import { scrollToSection } from "@/lib/scroll";

export const company = {
  name: "Jovano",
  shortName: "Jovano",
  legalName: "Jovano LLC",
  initials: "J",
  entity: "Limited liability company",
  discipline: "AI & software engineering",
  email: "terabyte5050@gmail.com",
  phone: "+1 (480) 271 8467",
  phoneHref: "tel:+14802718467",
  availability: "Booking new projects",
  responseTime: "one business day",
  engagements: "Free two-week prototype · Fixed-scope builds · Dedicated teams",
  tagline:
    "Jovano is a small senior team that builds AI agents, automations and custom software — so the repetitive work that eats your team's week runs on its own.",
  intro:
    "AI that does real work, automation that connects your systems, and the custom software around both — built by one senior team, from the first call to production.",
  about: [
    "Jovano is an AI and software engineering company. We build AI agents, automations and the custom software around them — the tools that take the re-typing, chasing, copying and answering off people's desks, for growing businesses and software companies.",
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
  desc: "Tell us the task that eats your week. If AI or software can take it off your plate, we build a working prototype on your own data in two weeks, free of charge. If it's worth building properly, we quote the rest; if not, you've lost nothing.",
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
      desc: "Tell us the task that eats your week. We'll tell you honestly whether AI or software can take it off your plate.",
    },
    {
      key: "discovery",
      label: "Discovery call",
      minutes: 30,
      desc: "Walk us through the workflow, the systems and the data. You leave with a rough plan for a two-week prototype.",
    },
  ] as CallType[],
};

// ------------------------------------------------------------
//  Services — the three things we do
// ------------------------------------------------------------

export type ServiceKey = "ai" | "automation" | "software";

export interface Service {
  key: ServiceKey;
  slug: string; // URL: /services/<slug>
  title: string;
  desc: string;
  includes: string[];
  image: string; // photo for the menu preview and the service page (public/images/svc-*.webp, 16:10)
}

export const services: Service[] = [
  {
    key: "ai",
    slug: "ai-agents-assistants",
    title: "AI agents & assistants",
    desc: "Assistants that answer from your own documents, agents that use your tools, and voice agents that pick up the phone — tested on your real cases before they ship.",
    includes: ["LLM apps & agents", "RAG over your data", "Voice & chat agents"],
    image: "/images/svc-llm.webp",
  },
  {
    key: "automation",
    slug: "ai-automation",
    title: "AI workflow automation",
    desc: "The re-typing, copy-paste and chasing handed to AI — documents read, systems updated and people nudged, with a person approving what matters.",
    includes: ["Document processing", "Workflow automation", "System integrations"],
    image: "/images/svc-automation.webp",
  },
  {
    key: "software",
    slug: "custom-software",
    title: "Custom software & SaaS",
    desc: "Web apps, internal tools and SaaS products built around how your business runs — including AI features in a product you already have, and builds that need rescuing.",
    includes: ["Web apps & SaaS", "AI features in your product", "APIs, cloud & rescue"],
    image: "/images/svc-platform.webp",
  },
];

// ------------------------------------------------------------
//  Technology stack. Each group shows up to 8 tools.
// ------------------------------------------------------------

export const stackGroups = [
  { title: "AI models", items: ["Anthropic Claude", "OpenAI GPT", "Google Gemini", "Llama", "Mistral", "Whisper"] },
  { title: "AI frameworks", items: ["LangChain", "LlamaIndex", "Model Context Protocol", "Hugging Face", "vLLM", "OpenCV"] },
  { title: "Web & backend", items: ["TypeScript", "React", "Next.js", "Node.js", "Python", "FastAPI"] },
  { title: "Data & cloud", items: ["PostgreSQL", "pgvector", "Redis", "AWS", "Docker", "Terraform"] },
];

// ------------------------------------------------------------
//  Solutions — packaged AI starting points we adapt per client.
//  Images live in public/images/ (16:10).
// ------------------------------------------------------------

export interface Solution {
  id: number;
  slug: string; // URL: /solutions/<slug>
  title: string;
  category: string; // where it works
  domain: string;
  service: ServiceKey; // the service it is delivered under
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
    service: "automation",
    summary: "Paperwork in, clean data out — invoices, forms and contracts read, checked and posted to your systems, with a person approving the exceptions.",
    description:
      "Document AI takes the documents your team re-types every day — invoices, purchase orders, intake forms, delivery notes, contracts — and turns them into structured data. It reads PDFs, scans and email attachments, checks each field against your rules and existing records, and posts the result to your accounting, CRM or ERP. Anything unusual lands in a review queue, so people only handle the exceptions.",
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
    service: "ai",
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
    service: "ai",
    summary: "Answers calls and chats around the clock, books appointments, qualifies leads and hands anything tricky to a person — with a written summary.",
    description:
      "AI Voice Agent picks up when your team can't: after hours, at lunch, or when every line is busy. It answers common questions from your own information, books and reschedules appointments in your calendar or scheduling system, takes messages and qualifies new inquiries. Anything sensitive or unusual is passed to a person, and every conversation arrives as a short written summary instead of a voicemail.",
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
];

/** The solutions delivered under a service. */
export const solutionsFor = (key: ServiceKey) => solutions.filter((s) => s.service === key);

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

export const team: TeamMember[] = [
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
    bio: "Turns prototypes into fast, reliable web apps and SaaS products, and wires them into the systems clients already use.",
    photo: "/images/team/marcus.webp",
    focus: ["React", "Node.js", "Integrations"],
  },
  {
    name: "Grace Park",
    role: "AI automation engineer",
    bio: "Automates the copy-paste between systems — document pipelines, integrations and the agents that run them, with approvals built in.",
    photo: "/images/team/grace.webp",
    focus: ["Automation", "Document AI", "Integrations"],
  },
  {
    name: "Owen Brady",
    role: "Product designer",
    bio: "Shapes interfaces that make AI and complex software feel simple, from first sketch to a design system your team can reuse.",
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

// Promises, not results: each one is made elsewhere on the site too
export const stats = [
  { value: "2", label: "Weeks to a working prototype — on us" },
  { value: "1", label: "Business day to a reply from an engineer" },
  { value: "100%", label: "Of the code and cloud accounts in your name" },
  { value: "0", label: "Account managers between you and the engineers" },
];

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
  { file: "company-team.webp", subject: "Company page, product team — two colleagues mapping ideas with colourful sticky notes on a board", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/creative-team-brainstorming-with-colored-notes-39219856/", source: "Pexels" },
  { file: "cta-backdrop.webp", subject: "CTA banner backdrop — engineer studying glowing blue data on a large screen in a dark room", author: "Sylvain Cls", href: "https://www.pexels.com/photo/man-in-sunglasses-and-screen-5866051/", source: "Pexels" },
  { file: "svc-llm.webp", subject: "AI agents & assistants — chat prompt to a language model (Visualising AI artwork by Wes Cockx)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-illustration-depicts-language-models-which-generate-text-it-was-created-by-wes-cockx-as-part-of-the-visualising-ai-project-l-18069695/", source: "Pexels" },
  { file: "svc-build.webp", subject: "Two engineers building together at a monitor", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/young-professionals-working-with-computers-7988745/", source: "Pexels" },
  { file: "tech-datacenter.webp", subject: "Data centre — aisle of server racks", author: "Brett Sayles", href: "https://www.pexels.com/photo/server-racks-on-data-center-4508751/", source: "Pexels" },
  { file: "tech-code.webp", subject: "Code on screen — developer at a dual-monitor standing desk", author: "Christina Morillo", href: "https://www.pexels.com/photo/woman-sitting-in-front-laptop-1181677/", source: "Pexels" },
  { file: "tech-ai-abstract.webp", subject: "Abstract AI visual — iridescent glass shapes (Visualising AI artwork by Wes Cockx)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-image-visualises-artificial-general-intelligence-or-agi-it-was-created-by-wes-cockx-as-part-of-the-visualising-ai-project-l-17486102/", source: "Pexels" },
  { file: "proj-saas-platform-rescue.webp", subject: "SaaS Platform Rescue — engineers working through results together at a laptop", author: "Artem Podrez", href: "https://www.pexels.com/photo/people-looking-at-the-screen-of-a-laptop-8519253/", source: "Pexels" },
  { file: "proj-saas-platform-rescue-2.webp", subject: "SaaS Platform Rescue — team mapping findings on a glass wall", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/collaborative-office-team-brainstorming-39204849/", source: "Pexels" },
  { file: "proj-clinic-call-assistant-2.webp", subject: "Clinic Call Assistant project — clinician in scrubs going over a tablet with a patient at a clinic", author: "Cedric Fauntleroy", href: "https://www.pexels.com/photo/a-doctor-and-a-patient-looking-at-a-tablet-4266938/", source: "Pexels" },
  { file: "about-pairing.webp", subject: "About — engineers pair-programming at one screen", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/men-working-on-a-computer-7988742/", source: "Pexels" },
  { file: "about-research.webp", subject: "About — walking a client through a prototype", author: "Yan Krukau", href: "https://www.pexels.com/photo/women-sitting-at-the-meeting-table-with-laptop-and-digital-tablet-8837735/", source: "Pexels" },
  { file: "about-remote.webp", subject: "About — hybrid team meeting on video call", author: "MART PRODUCTION", href: "https://www.pexels.com/photo/a-group-of-people-in-a-meeting-using-video-call-7644076/", source: "Pexels" },
  { file: "about-office.webp", subject: "About — bright, plant-filled studio", author: "Thirdman", href: "https://www.pexels.com/photo/man-and-woman-having-a-conversation-7653773/", source: "Pexels" },
  { file: "about-celebrate.webp", subject: "About page, launch celebration — team cheering and high-fiving across a table of laptops", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/office-team-having-a-meeting-in-the-room-7988238/", source: "Pexels" },
  { file: "phase-discover.webp", subject: "Delivery phase — Discover (workshop around a meeting table)", author: "Thirdman", href: "https://www.pexels.com/photo/a-group-of-people-having-a-meeting-in-the-office-7652176/", source: "Pexels" },
  { file: "phase-prototype.webp", subject: "Delivery phase — Prototype", author: "Akshar Dave🌻", href: "https://www.pexels.com/photo/a-person-holding-black-smartphone-11780441/", source: "Pexels" },
  { file: "phase-build.webp", subject: "Delivery phase — Build", author: "ThisIsEngineering", href: "https://www.pexels.com/photo/woman-coding-on-computer-3861958/", source: "Pexels" },
  { file: "phase-improve.webp", subject: "Delivery phase — Support (reviewing metrics on a wall screen)", author: "Artem Podrez", href: "https://www.pexels.com/photo/a-woman-doing-a-presentation-at-a-meeting-5716030/", source: "Pexels" },
  { file: "proj-clinic-call-assistant.webp", subject: "After-Hours Clinic Call Assistant — doctor taking a phone call at her desk while typing on a laptop", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/female-doctor-using-laptop-and-phone-in-office-39192373/", source: "Pexels" },
  { file: "sol-voice-agent.webp", subject: "AI Voice Agent — smiling support agent in a headset taking a call at his desk", author: "Yan Krukau", href: "https://www.pexels.com/photo/man-in-white-long-sleeve-shirt-sitting-in-front-of-a-computer-8867374/", source: "Pexels" },
  { file: "company-client.webp", subject: "Company page, client calls — two colleagues waving to a client on a laptop video call (laptop logo retouched out)", author: "Karola G", href: "https://www.pexels.com/photo/happy-people-talking-on-video-call-on-computer-5908491/", source: "Pexels" },
  { file: "trust-security.webp", subject: "Security & AI — engineer reviewing code on dual monitors in a calm office", author: "Ofspace LLC, Culture", href: "https://www.pexels.com/photo/a-man-sitting-at-a-desk-with-two-monitors-16323580/", source: "Pexels" },
  { file: "phase-launch.webp", subject: "Delivery phase — Launch (team celebrating at a laptop)", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/team-celebrating-success-with-a-laptop-39204861/", source: "Pexels" },
  { file: "svc-platform.webp", subject: "Custom software & SaaS — developer writing HTML on a large monitor", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/back-view-shot-of-a-man-working-on-his-computer-7988113/", source: "Pexels" },
  { file: "svc-automation.webp", subject: "AI workflow automation — data flowing through a chain of processing stages (Visualising AI artwork by Novoto Studio)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-image-was-inspired-by-neural-networks-used-in-deep-learning-it-was-created-by-novoto-studio-as-part-of-the-visualising-ai-pr-17483874/", source: "Pexels" },
  { file: "proj-invoice-intake-automation.webp", subject: "Invoice Intake Automation project — accountant checking figures on a calculator beside a laptop and a stack of paperwork", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/a-woman-computing-with-a-calculator-8297069/", source: "Pexels" },
  { file: "proj-invoice-intake-automation-2.webp", subject: "Invoice Intake Automation — modern apartment building with balconies against a blue sky", author: "Jan van der Wolf", href: "https://www.pexels.com/photo/modern-apartment-building-against-clear-blue-sky-37224965/", source: "Pexels" },
  { file: "sol-document-ai.webp", subject: "Document AI — office worker sorting a tall stack of paper files next to a laptop", author: "Pavel Danilyuk", href: "https://www.pexels.com/photo/woman-working-in-an-office-7654448/", source: "Pexels" },
  { file: "proj-contract-review-assistant.webp", subject: "Contract Review Assistant project — lawyer highlighting a contract at her office desk", author: "RDNE Stock project", href: "https://www.pexels.com/photo/a-female-lawyer-writing-on-documents-7841463/", source: "Pexels" },
  { file: "proj-contract-review-assistant-2.webp", subject: "Contract Review Assistant — colleagues reviewing documents together at a table", author: "Kindel Media", href: "https://www.pexels.com/photo/people-working-together-on-the-table-7651829/", source: "Pexels" },
  { file: "team/martin.webp", subject: "Team portrait — Martin Keller (placeholder)", author: "katemangostar", href: "https://www.magnific.com/free-photo/portrait-positive-confident-businessman_3584960.htm" },
  { file: "team/kenji.webp", subject: "Team portrait — Kenji Watanabe (placeholder)", author: "katemangostar", href: "https://www.magnific.com/free-photo/content-confident-handsome-asian-businessman-looking-camera_3583387.htm" },
  { file: "team/mei.webp", subject: "Team portrait — Mei Lin Chen (placeholder)", author: "benzoix", href: "https://www.magnific.com/free-photo/young-asian-woman-professional-entrepreneur-standing-office-clothing-smiling-looking-confident-white-background_23649170.htm" },
  { file: "team/marcus.webp", subject: "Team portrait — Marcus Bello (placeholder)", author: "Bruno Curly", href: "https://www.pexels.com/photo/portrait-of-man-wearing-grey-polo-shirt-26125923/", source: "Pexels" },
  { file: "team/grace.webp", subject: "Team portrait — Grace Park (placeholder)", author: "Tran Nhu Tuan", href: "https://www.pexels.com/photo/confident-businesswoman-in-professional-attire-29995622/", source: "Pexels" },
  { file: "team/owen.webp", subject: "Team portrait — Owen Brady (placeholder)", author: "cookie_studio", href: "https://www.magnific.com/free-photo/handsome-bearded-redhead-guy-posing-against-white-wall-with-glasses_11104169.htm" },
];

// ------------------------------------------------------------
//  Top-bar menus. Services, Solutions and Our work list the data above;
//  the Company menu is set here. Hovering an item previews it on the right.
// ------------------------------------------------------------

export type CompanyMenuKey = "about" | "approach" | "technology" | "team" | "responsible" | "contact";

export interface CompanyMenuItem {
  key: CompanyMenuKey;
  label: string;
  desc: string;
  to: string; // page route
  image: string; // photo shown in the top-bar menu while the item is hovered
}

export const companyMenu: CompanyMenuItem[] = [
  { key: "about", label: "About", desc: "Who we are, how we work with clients and what we stand for.", to: "/about", image: "/images/about-office.webp" },
  { key: "approach", label: "How we work", desc: "From a free call to a two-week prototype to production — and the ways to engage.", to: "/approach", image: "/images/phase-discover.webp" },
  { key: "technology", label: "Technology", desc: "The models, frameworks and cloud platforms we build with — and how we choose.", to: "/technology", image: "/images/tech-ai-abstract.webp" },
  { key: "team", label: "Team", desc: "The senior engineers and designers you'll work with directly.", to: "/team", image: "/images/about-celebrate.webp" },
  { key: "responsible", label: "Security & AI", desc: "How we protect your data, your code and your customers.", to: "/responsible-ai", image: "/images/trust-security.webp" },
  { key: "contact", label: "Contact", desc: `Tell us what's eating your week — we reply within ${company.responseTime}.`, to: "/contact", image: "/images/company-client.webp" },
];

// Home page sections, in order (the navbar highlights the menu that covers the one in view)
export const homeSections = ["busywork", "services", "solutions", "projects", "process", "company", "faq", "contact"];

// Every page, for the footer site map
export const sitePages = [
  { to: "/services", label: "Services" },
  { to: "/solutions", label: "Solutions" },
  { to: "/projects", label: "Our work" },
  { to: "/approach", label: "How we work" },
  { to: "/technology", label: "Technology" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/responsible-ai", label: "Security & AI" },
  { to: "/faq", label: "Questions" },
  { to: "/book", label: "Book a call" },
  { to: "/contact", label: "Contact" },
];

// Page URLs, so every link to a solution or service agrees
export const solutionPath = (s: Pick<Solution, "slug">) => `/solutions/${s.slug}`;
export const servicePath = (s: Pick<Service, "slug">) => `/services/${s.slug}`;

export const legalLinks = [
  { to: "/privacy", label: "Privacy policy" },
  { to: "/terms", label: "Terms of use" },
];

/** Glides to a section of the current page (see src/lib/scroll.ts). */
export const scrollToId = (id: string) => {
  scrollToSection(id);
};

// The router's navigate function, registered by PageShell, so the helpers below can change page.
let navigateTo: ((to: string) => void) | null = null;
export const setNavigator = (fn: ((to: string) => void) | null) => {
  navigateTo = fn;
};
const go = (to: string) => {
  if (!navigateTo) return window.location.assign(to);
  startNavigation(to);
  navigateTo(to);
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
