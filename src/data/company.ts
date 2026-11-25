// ============================================================
//  SITE CONTENT — Jovano, a remote-first team hiring people worldwide.
//  Edit this single file to update the public site
//  (company details, roles, the application steps, pay and levels, the workspace, values).
// ============================================================

import { startNavigation } from "@/lib/route-preload";
import { scrollToSection } from "@/lib/scroll";

export const company = {
  name: "Jovano",
  shortName: "Jovano",
  legalName: "Jovano LLC",
  initials: "J",
  entity: "Limited liability company",
  discipline: "Remote careers",
  email: "hello@jovano.io",
  phone: "+1 (347) 850-4577",
  phoneHref: "tel:+13478504577",
  availability: "Hiring now · Open worldwide",
  responseTime: "one business day", // replies to messages
  reviewTime: "five business days", // a decision on an application
  tagline:
    "Jovano is a remote-first team. We hire capable people anywhere in the world, train them, and place them on real work for the companies we support — with fair pay, on time, and a person you can talk to.",
  intro:
    "Six career paths, one remote team. Apply in minutes, get reviewed by a real person, and build your career from wherever you open your laptop.",
  mission: "To open remote careers to capable people everywhere, through a path that is simple, personal and fair.",
  vision: "A world where great work is never limited by location.",
  about: [
    "Jovano is a remote-first company. We build dedicated remote teams for growing businesses — virtual assistants, customer support, engineers, QA testers, operations and business development — and we hire the people on those teams from anywhere in the world.",
    "Every team member is hired, trained and paid by Jovano. The companies we support pay us for the work; we pay you, on a fixed schedule, with a payslip that shows exactly how your pay was worked out.",
    "We started Jovano because talent is everywhere but opportunity isn't. A great support specialist in Nairobi or a sharp engineer in Bogotá shouldn't need to move cities to do their best work.",
  ],
};

// ------------------------------------------------------------
//  Promises we make to every applicant. They show up in the hero, on the apply page and on the footer tape.
//  They are business promises: change them here and every mention follows.
// ------------------------------------------------------------

export const promises = {
  free: "Free to apply — we never ask applicants for money",
  human: "Every application is read by a real person",
  pay: "Paid twice a month, on time, with a clear payslip",
};

// ------------------------------------------------------------
//  Call booking. The public booking page is gone, but /admin still lists calls booked before the switch,
//  so these settings stay for the admin inbox (src/components/admin/MessagesInbox.tsx).
// ------------------------------------------------------------

export type CallTypeKey = "intro" | "discovery";

export interface CallType {
  key: CallTypeKey;
  label: string;
  minutes: number;
  desc: string;
}

export const booking = {
  timezone: "America/Phoenix",
  days: [1, 2, 3, 4, 5],
  start: "09:00",
  end: "17:00",
  slotMinutes: 30,
  minNoticeHours: 12,
  daysAhead: 21,
  meetingUrl: "",
  callTypes: [
    { key: "intro", label: "Intro call", minutes: 15, desc: "A short call to answer your questions." },
    { key: "discovery", label: "Longer call", minutes: 30, desc: "A longer conversation." },
  ] as CallType[],
};

// ------------------------------------------------------------
//  Roles — the career paths we hire for. Each one gets a card on the home page and /roles, and its own page
//  at /roles/<slug>. Photos live in public/images/ (16:10).
// ------------------------------------------------------------

export type RoleKey = "assistant" | "support" | "engineer" | "growth" | "qa" | "operations";
export type RoleTrack = "Operations" | "Support" | "Engineering" | "Growth";

export interface Role {
  key: RoleKey;
  slug: string; // URL: /roles/<slug>
  title: string;
  track: RoleTrack;
  category: string; // the work, in a few words
  short: string; // one line for cards
  summary: string; // the role page's lead
  image: string;
  focus?: string; // object-position, when the subject isn't centred
  commitment: string;
  schedule: string;
  highlights: string[]; // three bullets for cards
  duties: string[]; // what you'll do
  requirements: string[]; // what you need
  bonus: string[]; // nice to have
  tools: string[];
  skillsCheck: string; // the role's step 2
  day: { time: string; title: string; desc: string }[]; // a day in the role
}

export const roles: Role[] = [
  {
    key: "assistant",
    slug: "virtual-assistant",
    title: "Virtual Assistant",
    track: "Operations",
    category: "Calendars, inbox & client calls",
    short: "Keep a busy team organised: calendars, inboxes, calls and the hundred small things in between.",
    summary:
      "You're the person a busy founder or team lead relies on to keep the week running. You manage calendars and inboxes, join and take notes on client calls, follow up on what was agreed and keep documents tidy — so the people you support can focus on the work only they can do.",
    image: "/images/remote/role-assistant.webp",
    commitment: "Full-time or part-time",
    schedule: "Flexible, with 4 hours' overlap with your team",
    highlights: ["Choose your hours around a shared overlap", "Support one team, not a queue of strangers", "Levels that raise your base rate"],
    duties: [
      "Manage calendars: schedule meetings across time zones and protect focus time",
      "Triage the inbox: draft replies, flag what's urgent and file the rest",
      "Join client and team calls, take clear notes and send the follow-ups",
      "Keep documents, trackers and shared drives organised and up to date",
      "Book travel, prepare agendas and handle small research tasks",
    ],
    requirements: [
      "Clear, friendly written and spoken English",
      "A reliable computer, a stable internet connection and a headset",
      "Comfort with Google Workspace or Microsoft 365",
      "Good judgement about what can wait and what can't",
    ],
    bonus: ["Experience as an executive or administrative assistant", "A second language", "Familiarity with Notion, Slack or a CRM"],
    tools: ["Google Workspace", "Microsoft 365", "Slack", "Notion", "Zoom", "Calendly"],
    skillsCheck: "Plan a sample week from a messy inbox and calendar, and record a two-minute video introduction.",
    day: [
      { time: "09:00", title: "Inbox sweep", desc: "Clear overnight email, flag two urgent replies for your lead." },
      { time: "10:30", title: "Client call", desc: "Join the weekly client check-in, take notes, send the recap." },
      { time: "13:00", title: "Calendar Tetris", desc: "Move three meetings so a launch review fits across time zones." },
      { time: "15:30", title: "Wrap-up", desc: "Update the task tracker and leave a handover note for tomorrow." },
    ],
  },
  {
    key: "support",
    slug: "customer-support-specialist",
    title: "Customer Support Specialist",
    track: "Support",
    category: "Chat, email & phone support",
    short: "Be the friendly, knowledgeable voice customers reach when they need help — by chat, email or phone.",
    summary:
      "You help customers of the companies we support get unstuck. You answer questions by chat, email and phone, troubleshoot problems step by step, write up the bugs you find for the product team, and make sure every customer leaves the conversation better off than they arrived.",
    image: "/images/remote/role-support.webp",
    focus: "50% 25%",
    commitment: "Full-time or part-time",
    schedule: "Shift-based, with shifts you choose each week",
    highlights: ["Pick your shifts every week", "Full product training before your first ticket", "Clear quality targets, coaching included"],
    duties: [
      "Answer customer questions by chat, email and phone",
      "Troubleshoot account and product issues step by step",
      "Write up bugs and feedback clearly for the product team",
      "Keep the help centre accurate as the product changes",
      "Hit response-time and quality targets you agree with your lead",
    ],
    requirements: [
      "Excellent written English and a patient, warm tone",
      "A quiet place to work, a reliable computer and a headset",
      "Comfort learning new software quickly",
      "At least 6 months in any customer-facing role",
    ],
    bonus: ["Experience with Zendesk, Intercom or Freshdesk", "Technical support or SaaS experience", "A second language"],
    tools: ["Zendesk", "Intercom", "Freshdesk", "Slack", "Loom", "Jira"],
    skillsCheck: "Reply to three sample support tickets in writing, and record a two-minute video introduction.",
    day: [
      { time: "08:00", title: "Shift start", desc: "Read the handover from the previous shift and check the queue." },
      { time: "10:00", title: "Live chat", desc: "Help a dozen customers, solving most in the first reply." },
      { time: "13:30", title: "Bug report", desc: "Reproduce a billing issue and write it up for engineering." },
      { time: "16:00", title: "Coaching", desc: "A 20-minute review of last week's tickets with your lead." },
    ],
  },
  {
    key: "engineer",
    slug: "software-engineer",
    title: "Software Engineer",
    track: "Engineering",
    category: "Web & product engineering",
    short: "Build and ship real web products with a small, senior team — code reviews, clear specs and no busywork.",
    summary:
      "You join a small product team building web applications for the companies we support. You turn clear specs into working features, write tests, review your teammates' code and ship to production — with a senior engineer to pair with and a team that writes things down.",
    image: "/images/remote/role-engineer.webp",
    commitment: "Full-time",
    schedule: "Async-first, with a daily overlap with your team",
    highlights: ["Ship to production in your first weeks", "Code review and pairing with senior engineers", "Modern stack, clear specs, real ownership"],
    duties: [
      "Build features end to end across the front end and the API",
      "Write tests and keep the code you touch better than you found it",
      "Review pull requests and pair with teammates on tricky problems",
      "Estimate honestly and flag risks early",
      "Document what you build so the next person can pick it up",
    ],
    requirements: [
      "2+ years building web applications professionally",
      "Strong TypeScript or JavaScript, and React or a similar framework",
      "Experience with a back-end language and SQL",
      "Clear written communication for async work",
    ],
    bonus: ["Node.js, Python or Go", "Cloud experience (AWS, GCP or Azure)", "Open-source contributions or a public portfolio"],
    tools: ["TypeScript", "React", "Node.js", "PostgreSQL", "GitHub", "Linear"],
    skillsCheck: "A short take-home exercise (about 90 minutes), followed by a code walk-through at the interview.",
    day: [
      { time: "09:30", title: "Async stand-up", desc: "Post yesterday's progress and today's plan in the team channel." },
      { time: "10:00", title: "Deep work", desc: "Build the new invoice export and its tests." },
      { time: "14:00", title: "Pairing", desc: "Work through a tricky migration with a senior engineer." },
      { time: "16:30", title: "Code review", desc: "Review two pull requests and ship yours to staging." },
    ],
  },
  {
    key: "growth",
    slug: "business-development-representative",
    title: "Business Development Representative",
    track: "Growth",
    category: "Leads, proposals & pipeline",
    short: "Help Jovano win new clients: research leads, write tailored proposals and keep the pipeline moving.",
    summary:
      "You help Jovano grow. You research companies that could use a remote team, write tailored proposals and outreach in Jovano's own name, keep every opportunity up to date in the CRM, and hand warm leads to the account team — with clear targets and a commission on the work you help win.",
    image: "/images/remote/role-growth.webp",
    commitment: "Full-time or part-time",
    schedule: "Flexible, with weekly pipeline reviews",
    highlights: ["Base pay plus commission on won work", "Templates, training and a clear playbook", "Every proposal in Jovano's own name"],
    duties: [
      "Research companies and decision-makers that fit our services",
      "Write tailored proposals and outreach on behalf of Jovano",
      "Track every lead and conversation in the CRM",
      "Book introductory calls for the account team",
      "Review what's working each week and sharpen the playbook",
    ],
    requirements: [
      "Persuasive, error-free written English",
      "Curiosity about how businesses work and what they need",
      "Organised, target-driven and comfortable with a CRM",
      "Some experience in sales, marketing or recruiting",
    ],
    bonus: ["Experience with Upwork, LinkedIn Sales Navigator or HubSpot", "A background in B2B services", "A second language"],
    tools: ["HubSpot", "LinkedIn", "Google Sheets", "Notion", "Slack", "Loom"],
    skillsCheck: "Research one sample company and write a short tailored proposal, plus a two-minute video introduction.",
    day: [
      { time: "09:00", title: "Pipeline check", desc: "Update the CRM and follow up on two warm conversations." },
      { time: "11:00", title: "Research", desc: "Shortlist ten companies hiring for support roles this month." },
      { time: "14:00", title: "Proposals", desc: "Write two tailored proposals from the playbook templates." },
      { time: "16:00", title: "Hand-off", desc: "Brief the account team on a call you booked for Thursday." },
    ],
  },
  {
    key: "qa",
    slug: "qa-tester",
    title: "QA Tester",
    track: "Engineering",
    category: "Testing & quality",
    short: "Find the bugs before customers do: test new features on web and mobile and write reports engineers love.",
    summary:
      "You make sure what the product teams ship actually works. You test new features on web and mobile, write clear, reproducible bug reports, keep test plans current and work with engineers to confirm fixes — the last line of defence before a release reaches real customers.",
    image: "/images/remote/role-qa.webp",
    commitment: "Full-time or part-time",
    schedule: "Flexible, aligned to the release calendar",
    highlights: ["Test real products before they ship", "A path into automation and engineering", "Work closely with product teams"],
    duties: [
      "Test new features on web and mobile against the spec",
      "Write clear, reproducible bug reports with steps and screenshots",
      "Maintain test plans and regression checklists",
      "Confirm fixes and sign off releases with the team",
      "Suggest improvements when something feels confusing to use",
    ],
    requirements: [
      "A sharp eye for detail and a methodical way of working",
      "Clear written English",
      "Access to a computer and a smartphone for testing",
      "Comfort with issue trackers such as Jira or Linear",
    ],
    bonus: ["Experience with test automation (Playwright, Cypress)", "Basic SQL or API testing with Postman", "ISTQB or similar certification"],
    tools: ["Jira", "Linear", "Postman", "Playwright", "BrowserStack", "TestRail"],
    skillsCheck: "Test a small sample app and report the bugs you find, plus a two-minute video introduction.",
    day: [
      { time: "09:00", title: "Release prep", desc: "Review what's in today's build and plan the test run." },
      { time: "10:30", title: "Exploratory testing", desc: "Find three issues in the new checkout flow on mobile." },
      { time: "13:30", title: "Bug reports", desc: "Write them up with steps, screenshots and expected results." },
      { time: "16:00", title: "Sign-off", desc: "Re-test the fixes and sign off the release." },
    ],
  },
  {
    key: "operations",
    slug: "data-operations-specialist",
    title: "Data & Operations Specialist",
    track: "Operations",
    category: "Research, data & operations",
    short: "Keep the data clean and the operations running: research, data entry, reporting and process upkeep.",
    summary:
      "You keep the operations of the teams we support running smoothly. You research and enrich data, keep spreadsheets and systems accurate, build simple reports and document the processes everyone relies on — the careful, organised work that makes everything else possible.",
    image: "/images/remote/role-operations.webp",
    commitment: "Full-time or part-time",
    schedule: "Flexible, deadline-based",
    highlights: ["Flexible, deadline-based hours", "Learn reporting and automation tools", "Clear checklists and quality targets"],
    duties: [
      "Research companies, products and contacts and record what you find",
      "Enter, clean and enrich data in spreadsheets and business systems",
      "Build simple weekly reports and dashboards",
      "Write and update step-by-step process documents",
      "Spot errors and suggest better ways of working",
    ],
    requirements: [
      "Careful, accurate and organised",
      "Good English reading and writing",
      "Confident with Google Sheets or Excel",
      "A reliable computer and internet connection",
    ],
    bonus: ["Experience with Airtable, Zapier or a CRM", "Basic formulas, pivot tables or SQL", "A background in admin or bookkeeping"],
    tools: ["Google Sheets", "Excel", "Airtable", "Zapier", "Notion", "HubSpot"],
    skillsCheck: "Clean and summarise a small sample data set, plus a two-minute video introduction.",
    day: [
      { time: "08:30", title: "Data check", desc: "Run the morning checklist and fix two mismatched records." },
      { time: "10:00", title: "Research", desc: "Enrich 40 new leads with company size and contact details." },
      { time: "13:00", title: "Reporting", desc: "Update the weekly dashboard for your team lead." },
      { time: "15:30", title: "Process docs", desc: "Rewrite the onboarding checklist with a teammate's feedback." },
    ],
  },
];

export const roleTracks: RoleTrack[] = ["Operations", "Support", "Engineering", "Growth"];
export const rolePath = (r: Pick<Role, "slug">) => `/roles/${r.slug}`;
export const roleBySlug = (slug?: string) => roles.find((r) => r.slug === slug);

// ------------------------------------------------------------
//  The path in: five steps from applying to your first payment (home page, /how-it-works, the apply page).
// ------------------------------------------------------------

export interface Step {
  id: string;
  name: string;
  time: string; // how long it takes
  summary: string;
  activities: string[]; // "Label: detail" puts the label in bold
  needs: string[]; // chips: what you need for this step
  image: string;
  focus?: string; // object-position for the banner photo, when its subject isn't centred
}

export const steps: Step[] = [
  {
    id: "apply",
    name: "Apply online",
    time: "About 5 minutes",
    summary: "Choose a role, tell us a little about yourself and add a link to your CV or portfolio. No account fees, no long forms.",
    activities: [
      "Pick your role: choose the career path that fits you best — you can mention a second one too.",
      "Tell us about you: where you're based, your experience and when you're available.",
      "Confirmation: you get an email confirming we've received your application.",
    ],
    needs: ["A CV or LinkedIn link", "10 quiet minutes"],
    image: "/images/remote/step-apply.webp",
    focus: "50% 30%",
  },
  {
    id: "skills",
    name: "Skills check",
    time: "30–90 minutes, on your schedule",
    summary: "A short, practical task that mirrors the real work, and a two-minute video introduction. No trick questions.",
    activities: [
      "A real-world task: a sample support reply, a bug hunt, a short coding exercise — matched to your role.",
      "Video intro: two minutes about you, recorded in your browser. Re-record as often as you like.",
      "Your timing: you have five days to send both, whenever suits you.",
    ],
    needs: ["Camera & microphone", "A browser"],
    image: "/images/remote/step-skills.webp",
  },
  {
    id: "interview",
    name: "Interview",
    time: "A 30-minute video call",
    summary: "A relaxed conversation with someone from the team. We talk through your task, and you ask us anything.",
    activities: [
      "Real people: you speak with a recruiter and, for most roles, a future team lead.",
      "Two-way: bring your questions about pay, hours, the team and growth.",
      "A clear answer: you hear back within five business days, whatever the decision.",
    ],
    needs: ["A quiet room", "Your questions"],
    image: "/images/about-remote.webp",
  },
  {
    id: "onboard",
    name: "Onboarding",
    time: "Your first week — paid",
    summary: "Sign your contract, set up your workspace and learn the tools and the team. Training time is paid time.",
    activities: [
      "Contract & payouts: sign online and choose how you'd like to be paid.",
      "Training: role and client training at your own pace, with a lead on hand.",
      "A buddy: a teammate in the same role to answer the small questions.",
    ],
    needs: ["ID for your contract", "Payout details"],
    image: "/images/remote/step-onboarding.webp",
    focus: "50% 20%",
  },
  {
    id: "work",
    name: "Start working & earning",
    time: "Paid twice a month",
    summary: "Join your team, do great work and get paid on time. Every quarter, a review — and a clear path to the next level.",
    activities: [
      "Your team: you're assigned to a client team with a named lead.",
      "Pay on schedule: twice a month, with a payslip that shows every line.",
      "Growth: quarterly reviews and levels that raise your base rate.",
    ],
    needs: ["Your best work", "Curiosity"],
    image: "/images/remote/step-earning.webp",
    focus: "50% 22%",
  },
];

// ------------------------------------------------------------
//  Pay & growth
// ------------------------------------------------------------

export interface Level {
  n: number;
  name: string;
  reach: string; // how you get there
  gains: string; // what changes
  height: number; // bar height in the chart, 0–100 (illustrative, not a pay figure)
}

export const levels: Level[] = [
  { n: 1, name: "Associate", reach: "Where everyone starts after onboarding.", gains: "Your base rate, full training and a buddy.", height: 38 },
  { n: 2, name: "Specialist", reach: "Two strong quarterly reviews.", gains: "A higher base rate and first pick of new teams.", height: 56 },
  { n: 3, name: "Senior", reach: "Consistent quality and helping others.", gains: "A higher rate again, and mentoring new joiners.", height: 76 },
  { n: 4, name: "Lead", reach: "Lead a small team or a client account.", gains: "Lead pay, a seat in hiring and planning.", height: 98 },
];

export const payouts = [
  { key: "bank", label: "Bank transfer", desc: "Local currency where available" },
  { key: "wise", label: "Wise", desc: "Low fees, fast in most countries" },
  { key: "payoneer", label: "Payoneer", desc: "Popular with remote professionals" },
  { key: "usdt", label: "USDT", desc: "On request, where it's legal" },
];

export const payFacts = [
  { k: "Schedule", v: "Twice a month, on fixed dates" },
  { k: "Payslip", v: "Every hour, bonus and deduction, line by line" },
  { k: "Rate", v: "Agreed in writing before you start" },
  { k: "Reviews", v: "Every quarter, with a clear next level" },
];

// ------------------------------------------------------------
//  Why join — photo tiles and reasons
// ------------------------------------------------------------

export const whyTiles: { title: string; desc: string; image: string; tags: string[] }[] = [
  { title: "Work from anywhere", desc: "Your office is wherever you open your laptop — home, a café or a co-working space.", image: "/images/remote/why-anywhere.webp", tags: ["Remote", "Any location"] },
  { title: "Learn from real people", desc: "Training, a buddy and a lead who has done the job before you — always a message away.", image: "/images/remote/why-people.webp", tags: ["Training", "Mentoring"] },
  { title: "Your own hours", desc: "Flexible schedules with a shared overlap, so work fits around your life — not the other way round.", image: "/images/remote/why-hours.webp", tags: ["Flexible", "Your schedule"] },
];

export type PerkKey = "anywhere" | "simple" | "human" | "hours" | "pay" | "levels";

export const perks: { key: PerkKey; title: string; desc: string; note: string }[] = [
  { key: "anywhere", title: "Work from anywhere", desc: "Open to applicants worldwide. All you need is a computer, a reliable connection and the right skills.", note: "Home, a café or a co-working space — your choice, every day." },
  { key: "simple", title: "A simple, honest application", desc: "Five minutes to apply, no fees, ever. You always know where your application stands.", note: "An email at every step, and a decision within five business days." },
  { key: "human", title: "Reviewed by a real person", desc: "A recruiter reads every application and every task. Nobody is filtered out by a keyword script.", note: "You'll speak to a person before any decision is made." },
  { key: "hours", title: "Your hours, your rules", desc: "Choose your schedule or your shifts, with a few hours of overlap so your team can reach you.", note: "Agreed in writing before you start, and easy to change." },
  { key: "pay", title: "Paid on time, every time", desc: "Twice a month, by bank, Wise, Payoneer or USDT — with a payslip that shows every line.", note: "Every hour, bonus and fee, visible in your workspace." },
  { key: "levels", title: "Levels that reward growth", desc: "Quarterly reviews and four clear levels. Each one raises your base rate and your responsibilities.", note: "The criteria for every level are written down from day one." },
];

// Promises, not results: each one is made elsewhere on the site too
export const stats = [
  { value: "100%", label: "Remote", desc: "Apply, interview, train and work without leaving home." },
  { value: String(roles.length), label: "Career paths", desc: "From virtual assistance to software engineering." },
  { value: "$0", label: "To apply", desc: "We never ask applicants for money. Not now, not later." },
  { value: "1:1", label: "Support", desc: "A real person to talk to, from your first day." },
];

// ------------------------------------------------------------
//  The member workspace (home and /how-it-works)
// ------------------------------------------------------------

export type WorkspaceKey = "overview" | "schedule" | "tasks" | "payments" | "chat" | "learning";

export const workspaceFeatures: { key: WorkspaceKey; title: string; desc: string; headline: string; points: string[] }[] = [
  { key: "overview", title: "Overview", desc: "Your week at a glance: shifts, tasks, messages and your next payday.", headline: "Your whole week, on one screen", points: ["Hours worked and planned this pay period", "Today's shifts and meetings in your time zone", "Progress towards your next level"] },
  { key: "schedule", title: "Schedule", desc: "Set your availability and see your shifts and meetings in your own time zone.", headline: "A calendar that works in your time zone", points: ["Mark the hours you're available", "Pick open shifts each week", "Meetings converted to your local time"] },
  { key: "tasks", title: "Tasks", desc: "Everything assigned to you, with clear priorities and due dates.", headline: "Always know what's next", points: ["Clear priorities from your lead", "Due dates you can plan around", "Hand-over notes between shifts"] },
  { key: "payments", title: "Payments", desc: "Every payslip and payout, with the hours and bonuses behind it.", headline: "Pay you can check, line by line", points: ["A payslip for every pay period", "Hours, bonuses and fees itemised", "Your full payout history"] },
  { key: "chat", title: "Team chat", desc: "Message your lead, your buddy and the support team in real time.", headline: "A real person, one message away", points: ["Your team channel and your lead", "A buddy for the small questions", "Support from the Jovano team"] },
  { key: "learning", title: "Learning", desc: "Role guides, client playbooks and short courses that count towards your next level.", headline: "Learn as you earn", points: ["Role guides and client playbooks", "Short courses at your own pace", "Progress that counts towards your next level"] },
];

// ------------------------------------------------------------
//  What to have ready (/how-it-works)
// ------------------------------------------------------------

export type ReadyKey = "computer" | "internet" | "camera" | "payout";

export const readyList: { key: ReadyKey; title: string; desc: string }[] = [
  { key: "computer", title: "A computer", desc: "A laptop or desktop from the last five years, with an up-to-date browser." },
  { key: "internet", title: "A reliable connection", desc: "Stable broadband (10 Mbps or more) — enough for a clear video call." },
  { key: "camera", title: "Camera & microphone", desc: "For your video intro and interview. A headset helps for support roles." },
  { key: "payout", title: "A way to get paid", desc: "A bank, Wise or Payoneer account — added after you join, never before." },
];

// ------------------------------------------------------------
//  About: values and principles
// ------------------------------------------------------------

export type ValueKey = "integrity" | "excellence" | "collaboration" | "empowerment";

export const values: { key: ValueKey; title: string; desc: string }[] = [
  { key: "integrity", title: "Integrity", desc: "We say what we'll pay, pay it on time and never ask applicants for money." },
  { key: "excellence", title: "Excellence", desc: "We hire carefully, train properly and hold ourselves to the standard we ask of you." },
  { key: "collaboration", title: "Collaboration", desc: "Remote doesn't mean alone. Every person has a lead, a buddy and a team." },
  { key: "empowerment", title: "Empowerment", desc: "Clear levels, real feedback and the tools to grow into the next role." },
];

export type PrincipleKey = "remote" | "transparent" | "people";

export const principles: { key: PrincipleKey; title: string; desc: string; points: string[]; image: string; focus?: string }[] = [
  {
    key: "remote",
    title: "Remote by design",
    desc: "We write things down, work async by default and meet when it matters. Nobody is a second-class citizen for being far away.",
    points: ["Written briefs and hand-overs", "A few hours of overlap, not 9-to-5", "Meetings with a purpose and notes"],
    image: "/images/remote/step-onboarding.webp",
    focus: "60% 0%",
  },
  {
    key: "transparent",
    title: "Transparent by default",
    desc: "Your rate, your hours and how your pay is worked out are in writing, in your workspace, from day one.",
    points: ["Your rate agreed before you start", "Every payslip itemised", "Level criteria written down"],
    image: "/images/remote/role-operations.webp",
  },
  {
    key: "people",
    title: "People before process",
    desc: "A person reviews every application, answers every message and has your back when something goes wrong.",
    points: ["A named lead and a buddy", "Real replies, usually the same day", "Help first, process second"],
    image: "/images/remote/why-people.webp",
  },
];

// For companies hiring a remote team through Jovano (home, About, Contact)
export const forCompanies = {
  title: "Need a remote team?",
  desc: "We build dedicated remote teams — assistants, support, engineers, QA and operations — hired, trained and managed by Jovano, so you get the output without the overhead.",
  points: ["Vetted, trained people", "One monthly invoice", "Replacements at no extra cost"],
};

// ------------------------------------------------------------
//  Photography credits. Pexels photos don't require attribution, but are credited for consistency
//  and shown at /terms#credits.
// ------------------------------------------------------------

export interface ImageCredit {
  file: string;
  subject: string;
  author: string;
  href: string;
  source?: "Magnific" | "Pexels";
}

export const imageCredits: ImageCredit[] = [
  { file: "remote/hero-main.webp", subject: "Home hero — man in headphones on a video call at his home-office desk", author: "Pexels contributor", href: "https://www.pexels.com/photo/6267056/", source: "Pexels" },
  { file: "remote/hero-home.webp", subject: "Home hero — working from home at a round wooden table with a laptop and notebook", author: "Tranmautritam", href: "https://www.pexels.com/photo/woman-in-black-tank-shirt-facing-a-black-laptop-computer-on-brown-wooden-round-table-68761/", source: "Pexels" },
  { file: "remote/role-assistant.webp", subject: "Virtual Assistant — planning in a notebook beside a laptop", author: "Karola G", href: "https://www.pexels.com/photo/person-writing-on-notebook-while-using-a-laptop-5387268/", source: "Pexels" },
  { file: "remote/role-support.webp", subject: "Customer Support Specialist — woman in a headset at her laptop", author: "Karola G", href: "https://www.pexels.com/photo/a-woman-wearing-headset-and-using-a-laptop-4468124/", source: "Pexels" },
  { file: "remote/role-engineer.webp", subject: "Software Engineer — developer coding on two monitors", author: "Lisa Fotios", href: "https://www.pexels.com/photo/man-working-on-computers-coding-16129724/", source: "Pexels" },
  { file: "remote/role-growth.webp", subject: "Business Development — video call with a client from a café", author: "Jack Sparrow", href: "https://www.pexels.com/photo/woman-on-a-vide-conference-5917841/", source: "Pexels" },
  { file: "remote/role-qa.webp", subject: "QA Tester — testing an app on a phone beside a laptop", author: "iam hogir", href: "https://www.pexels.com/photo/woman-using-touchscreen-17754374/", source: "Pexels" },
  { file: "remote/role-operations.webp", subject: "Data & Operations — reviewing a spreadsheet on a laptop", author: "Wolf Art", href: "https://www.pexels.com/photo/person-analyzing-data-on-laptop-screen-34639577/", source: "Pexels" },
  { file: "remote/step-apply.webp", subject: "Apply online — on the sofa with a laptop", author: "Mizuno K", href: "https://www.pexels.com/photo/woman-sitting-on-couch-studying-on-laptop-12911654/", source: "Pexels" },
  { file: "remote/step-skills.webp", subject: "Skills check — a video call at a home desk with notes", author: "Ivan S", href: "https://www.pexels.com/photo/woman-having-video-call-in-home-office-4240610/", source: "Pexels" },
  { file: "about-remote.webp", subject: "Interview — a team on a video call with a candidate", author: "MART PRODUCTION", href: "https://www.pexels.com/photo/a-group-of-people-in-a-meeting-using-video-call-7644076/", source: "Pexels" },
  { file: "remote/step-onboarding.webp", subject: "Onboarding — a group video call on a laptop", author: "cottonbro studio", href: "https://www.pexels.com/photo/a-group-of-people-chatting-in-a-video-call-in-a-laptop-5486096/", source: "Pexels" },
  { file: "remote/step-earning.webp", subject: "Start earning — celebrating at a laptop in a home office", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/excited-man-celebrating-success-at-laptop-39219501/", source: "Pexels" },
  { file: "remote/why-anywhere.webp", subject: "Work from anywhere — typing on a laptop at a café", author: "iam hogir", href: "https://www.pexels.com/photo/woman-sitting-with-laptop-17754365/", source: "Pexels" },
  { file: "remote/why-people.webp", subject: "Learn from real people — two colleagues working through something together", author: "Christina Morillo", href: "https://www.pexels.com/photo/two-woman-sitting-on-sofa-while-using-laptops-1181274/", source: "Pexels" },
  { file: "remote/why-hours.webp", subject: "Your own hours — morning coffee and a laptop at home", author: "RDNE Stock project", href: "https://www.pexels.com/photo/a-woman-drinking-from-a-mug-while-sitting-6517217/", source: "Pexels" },
  { file: "cta-backdrop.webp", subject: "Call-to-action backdrop — glowing data on a large screen", author: "Sylvain Cls", href: "https://www.pexels.com/photo/man-in-sunglasses-and-screen-5866051/", source: "Pexels" },
];

// ------------------------------------------------------------
//  Navigation
// ------------------------------------------------------------

// Home page sections, in order (the navbar highlights the link that covers the one in view)
export const homeSections = ["why", "workspace", "process", "roles", "pay", "global", "life", "faq"];

// Top-level links after the Roles menu
export const navLinks = [
  { to: "/how-it-works", label: "How it works", sections: ["process", "workspace", "pay"] },
  { to: "/about", label: "About", sections: ["why", "global", "life"] },
  { to: "/faq", label: "FAQ", sections: ["faq"] },
  { to: "/contact", label: "Contact", sections: [] as string[] },
];

// Every page, for the footer and the 404 page
export const sitePages = [
  { to: "/roles", label: "Open roles" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About us" },
  { to: "/faq", label: "FAQ" },
  { to: "/apply", label: "Apply now" },
  { to: "/contact", label: "Contact" },
];

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

/** The apply page, optionally with a role chosen and an email filled in. */
export const applyPath = (role?: Pick<Role, "slug">, email?: string) => {
  const q = new URLSearchParams();
  if (role) q.set("role", role.slug);
  if (email) q.set("email", email);
  const s = q.toString();
  return s ? `/apply?${s}` : "/apply";
};

export const startApplication = (role?: Pick<Role, "slug">, email?: string) => go(applyPath(role, email));
