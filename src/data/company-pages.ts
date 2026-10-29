// ============================================================
//  COMPANY PAGES — content for /about, /approach, /technology, /team and /responsible-ai (Security & AI).
//  Core company facts, services, team and process stay in src/data/company.ts.
//  Copy here was drafted for the site: review it before launch.
// ============================================================

import type { Phase, ServiceKey, TeamMember } from "./company";

// ------------------------------------------------------------
//  About
// ------------------------------------------------------------

export interface Practice {
  title: string;
  desc: string;
  services: ServiceKey[]; // the service pages this practice delivers
}

/** How the company is organized: four practices that staff every project together. */
export const practices: Practice[] = [
  {
    title: "AI & automation",
    desc: "Assistants, agents and document tools that do real work, and the automations that move data between your systems — with a person approving what matters.",
    services: ["ai", "automation"],
  },
  {
    title: "Product engineering",
    desc: "The web apps, portals, mobile apps and desktop tools people use every day — designed with the people who'll use them and built to be maintained.",
    services: ["web", "mobile", "desktop"],
  },
  {
    title: "Cloud & data",
    desc: "Secure infrastructure set up as code in your own cloud account, and the pipelines, dashboards and reports that keep your numbers in one place.",
    services: ["cloud", "data"],
  },
  {
    title: "Rescue & support",
    desc: "Stalled builds and fragile legacy systems audited and moved forward, and the software we launch monitored and improved for as long as you need us.",
    services: ["rescue"],
  },
];

/** "Inside the studio" photos on /about. The first one is shown large. */
export const studioGallery = [
  { src: "/images/about-office.webp", alt: "A bright studio with plants, where one person works at a laptop while two colleagues review notes by the window", caption: "The studio — engineers and designers in one room" },
  { src: "/images/about-pairing.webp", alt: "Two engineers working through code together at one laptop", caption: "Pairing on a document-processing pipeline" },
  { src: "/images/about-research.webp", alt: "A woman with a tablet talking through a prototype with a colleague at a laptop", caption: "Walking a client through their prototype" },
  { src: "/images/about-remote.webp", alt: "Colleagues at a conference table on a video call with a remote teammate", caption: "Weekly demo with a client team" },
  { src: "/images/about-celebrate.webp", alt: "Three colleagues sharing a high-five around a laptop", caption: "Shipping day" },
];

/** Why the site shows no client logos or case-study names. */
export const confidentiality = [
  {
    title: "Client work stays confidential",
    desc: "The businesses we work with share customer records, financial documents and products that haven't launched. We don't name them, show their logos or publish their screens unless they agree to it in writing.",
  },
  {
    title: "Described by the engineering",
    desc: "Instead of logos, our project write-ups describe the engineering — the problem, what we built and how it was kept secure — with client names and identifying details left out. On a call we can walk you through relevant work in more detail.",
  },
  {
    title: "Your project gets the same care",
    desc: "Confidentiality terms — and an NDA, if you'd like one — are in place before you share anything sensitive, and they continue after the project ends.",
  },
];

// ------------------------------------------------------------
//  Approach — ways to engage
// ------------------------------------------------------------

/** The free phase (the two-week prototype), marked wherever the phases are listed. */
export const isFreePhase = (p: Phase) => p.name === "Prototype";

export interface EngagementModel {
  key: "prototype" | "project" | "team";
  name: string;
  tagline: string;
  bestFor: string;
  pricing: string;
  shape: string; // how the engagement typically runs
  youGet: string[];
  team: string[];
}

export const engagementModels: EngagementModel[] = [
  {
    key: "prototype",
    name: "Free two-week prototype",
    tagline: "Working software on your own data in two weeks — before you commit to anything.",
    bestFor: "One task that eats your team's week and that software could take over — re-typing invoices, answering the same calls, stitching together a weekly report.",
    pricing: "Free",
    shape: "A short call, a one-page plan, two weeks of building on a sample of your real data, then a demo and an honest recommendation.",
    youGet: ["A working prototype on your own data", "Feedback from your team using it on real tasks", "A fixed-scope proposal, if it's worth building", "A straight answer if it isn't"],
    team: ["A senior engineer who runs the call and the build", "An AI, web or mobile engineer, depending on the task"],
  },
  {
    key: "project",
    name: "Fixed-scope build",
    tagline: "The full system, engineered for production against a scope agreed up front.",
    bestFor: "Turning a proven prototype into software your team relies on every day — or a new web app, mobile app or integration with a clear goal.",
    pricing: "Fixed price, quoted after the prototype",
    shape: "Short iterations with a demo every week and automated tests on every change, then a staged launch and a full handover.",
    youGet: ["Production software, tested and monitored", "Source code in your repository, infrastructure in your cloud account", "Documentation and runbooks", "Training for the people who use and maintain it"],
    team: ["A senior engineer as your single point of contact", "AI, full-stack or mobile engineers, as the work needs", "Product design support"],
  },
  {
    key: "team",
    name: "Dedicated team",
    tagline: "A standing team, or a monthly retainer, that keeps building and improving what you run.",
    bestFor: "Software already in use that needs steady new features, monitoring and support — or a product that needs senior engineers without a hiring round.",
    pricing: "Monthly, sized to the team",
    shape: "A shared backlog, regular releases and monitoring, with priorities set together each month.",
    youGet: ["Regular releases driven by your priorities", "Uptime, cost and AI-quality monitoring", "Support within agreed response times", "A monthly health report"],
    team: ["Engineers from the original build", "Data, design or DevOps support as needed"],
  },
];

/** What a project needs from the client side. */
export const needFromYou = [
  { title: "A decision-maker", desc: "One person who knows the work, can make decisions and has time for a short demo each week." },
  { title: "The people who do the task", desc: "Time with the people doing the work today, so we see the real workflow — shortcuts, exceptions and all." },
  { title: "Real examples", desc: "A sample of the invoices, emails, reports or records involved, to build and test on — shared under NDA if you'd like." },
  { title: "Your security rules", desc: "Any security, privacy or compliance requirements we need to follow, and a contact in IT if you have one." },
  { title: "Access to your systems", desc: "Test or read-only access to the tools the work touches — accounting, CRM, scheduling or practice-management systems." },
];

/** How a client stays informed during a project. */
export const inTheLoop = [
  { title: "Weekly demo", desc: "Working software every week, on your data — progress you can click, not slides." },
  { title: "Notes after every call", desc: "Progress, blockers and the decisions we need from you, written down and sent the same day." },
  { title: "Shared board", desc: "The backlog and its status are visible to your team at all times." },
  { title: "Decision log", desc: "Every significant product, model or architecture decision is written down with its reasons." },
  { title: "Quality reports", desc: "Test and AI-evaluation results shared with each release, including anything that got worse." },
  { title: "Your repository", desc: "The code lives in a repository you own and can read from day one." },
];

/** What is handed over at the end of a build. */
export const handoverChecklist = [
  "Source code in a repository you own",
  "Cloud accounts and credentials in your name",
  "Infrastructure as code and deployment pipeline",
  "Architecture overview and decision log",
  "Automated tests and the AI evaluation set",
  "Runbooks for monitoring, incidents and updates",
  "User and admin guides",
  "Training for the people who use and maintain it",
];

// ------------------------------------------------------------
//  Technology
// ------------------------------------------------------------

export type ModelApproachKey = "hosted" | "open" | "small" | "hybrid";

export interface ModelApproach {
  key: ModelApproachKey;
  name: string;
  summary: string;
  strengths: string[];
  tradeoffs: string[];
}

export const modelApproaches: Record<ModelApproachKey, ModelApproach> = {
  hosted: {
    key: "hosted",
    name: "Hosted commercial model",
    summary: "A leading model such as GPT, Claude or Gemini, called through an API under business terms that exclude your data from training.",
    strengths: ["Strongest reasoning and writing quality", "Fastest route to a working prototype", "No infrastructure to run"],
    tradeoffs: ["Data leaves your cloud (under contract)", "Per-request cost grows with usage"],
  },
  open: {
    key: "open",
    name: "Open model in your cloud",
    summary: "An open-weight model such as Llama or Mistral, deployed inside your own cloud account so data never leaves it.",
    strengths: ["Data stays in your environment", "Predictable cost at volume", "Full control over versions and updates"],
    tradeoffs: ["You run and monitor the infrastructure", "Some tasks need more prompt and evaluation work"],
  },
  small: {
    key: "small",
    name: "Small fine-tuned model",
    summary: "A compact model trained for one narrow task — sorting documents, pulling out fields, routing requests — that runs fast and cheaply.",
    strengths: ["Very low latency", "Lowest cost per request at scale", "Can run in your cloud or on a device"],
    tradeoffs: ["Narrow: one task per model", "Needs labeled examples to train and maintain"],
  },
  hybrid: {
    key: "hybrid",
    name: "Hybrid routing",
    summary: "A model gateway that sends each request to the right model: sensitive or high-volume steps stay in your cloud, harder ones go to a hosted model.",
    strengths: ["Balances quality, cost and privacy", "Swap models without rewriting the product", "Fallbacks if one provider is down"],
    tradeoffs: ["More moving parts to evaluate", "Routing rules need monitoring"],
  },
};

export interface SelectorOption {
  label: string;
  note: string; // why this answer pulls the way it does
  scores: Record<ModelApproachKey, number>;
}

export interface SelectorQuestion {
  key: string;
  question: string;
  options: SelectorOption[];
}

/** The "How we choose a model" selector. Each answer adds to the approaches it favors; the highest total wins. */
export const selectorQuestions: SelectorQuestion[] = [
  {
    key: "data",
    question: "How sensitive is the data?",
    options: [
      { label: "Public information", note: "Public content can go to a hosted model with little extra protection.", scores: { hosted: 2, open: 0, small: 0, hybrid: 1 } },
      { label: "Internal, not personal", note: "Internal documents are fine under business terms, but some teams prefer to keep them in their own cloud.", scores: { hosted: 1, open: 1, small: 1, hybrid: 2 } },
      { label: "Personal, health or financial", note: "Patient, customer and financial records point toward models that run inside your own environment.", scores: { hosted: 0, open: 3, small: 2, hybrid: 2 } },
    ],
  },
  {
    key: "latency",
    question: "How fast must it respond?",
    options: [
      { label: "A few seconds is fine", note: "Chat-style answers and document processing work with any approach.", scores: { hosted: 1, open: 1, small: 0, hybrid: 1 } },
      { label: "It must feel instant", note: "Live phone calls, autocomplete and checks while someone types favor small, fast models.", scores: { hosted: 0, open: 0, small: 3, hybrid: 1 } },
    ],
  },
  {
    key: "scale",
    question: "How much use do you expect?",
    options: [
      { label: "A prototype or one team", note: "At prototype scale, speed of building matters more than cost per request.", scores: { hosted: 3, open: 0, small: 0, hybrid: 1 } },
      { label: "Daily use across the business", note: "Steady daily use is where mixing models starts to pay off.", scores: { hosted: 1, open: 1, small: 1, hybrid: 2 } },
      { label: "Millions of requests", note: "At very high volume, cost per request dominates — smaller and self-hosted models win.", scores: { hosted: 0, open: 2, small: 3, hybrid: 1 } },
    ],
  },
];

/** Tie-break order when two approaches score the same. */
export const approachPriority: ModelApproachKey[] = ["hybrid", "open", "hosted", "small"];

/** Evaluation pipeline: how a change reaches the people who use it. */
export const evalPipeline = [
  { title: "Test set", desc: "Real examples from your business — invoices, questions, calls — with the answers or actions we expect." },
  { title: "Automated evals", desc: "Every change runs against the test set: accuracy, grounding, citations, tone and what it should refuse to do." },
  { title: "Human review", desc: "Your subject experts review a sample, focusing on the cases automation can't judge." },
  { title: "Release gate", desc: "A release ships only if it meets the agreed thresholds and nothing important got worse." },
  { title: "Monitoring", desc: "In production we watch quality, cost and drift — and new failure cases go back into the test set." },
];

/** Reference architecture, left to right. `layer` groups the nodes in the diagram. */
export const architecture = [
  { title: "Your systems", desc: "Email, documents, CRM, accounting, scheduling", layer: "Sources" },
  { title: "Ingestion", desc: "Connectors, cleaning, chunking, permissions", layer: "Data" },
  { title: "Retrieval", desc: "Vector and keyword search over approved content", layer: "Data" },
  { title: "Model gateway", desc: "Routes each request to the right model", layer: "AI" },
  { title: "Guardrails", desc: "Policy, grounding and approval checks", layer: "AI" },
  { title: "Your apps", desc: "An invoice agent, a voice agent, a knowledge assistant — web, mobile or desktop", layer: "Experience" },
  { title: "Analytics", desc: "Usage, quality, cost and audit logs", layer: "Insight" },
];

/** Open standards we build on, with what each one is for. */
export const standards = [
  { name: "OpenAPI", desc: "Every API we build comes with a machine-readable spec, so your team and other tools can use and test it." },
  { name: "OAuth 2.0 & OpenID Connect", desc: "Single sign-on with Microsoft 365, Google Workspace, Okta and other identity providers." },
  { name: "Webhooks", desc: "Systems tell each other the moment something changes, instead of waiting for a nightly export." },
  { name: "Model Context Protocol", desc: "Connects AI assistants and agents to your tools and data through one open, permissioned interface." },
  { name: "HL7 FHIR", desc: "Exchanges healthcare data with EHR and practice-management systems that support it." },
  { name: "EDI, CSV & Excel", desc: "The file formats logistics, accounting and older systems still rely on, read and written reliably." },
];

// ------------------------------------------------------------
//  Team
// ------------------------------------------------------------

export type Discipline = "Leadership" | "Engineering" | "AI & data" | "Mobile" | "Automation & desktop" | "Design";

export const disciplines: Discipline[] = ["Leadership", "Engineering", "AI & data", "Mobile", "Automation & desktop", "Design"];

/** Which disciplines a person belongs to, read from their role. */
export function disciplinesOf(m: TeamMember): Discipline[] {
  const role = m.role.toLowerCase();
  const out: Discipline[] = [];
  if (/founder|ceo|cto|head of/.test(role)) out.push("Leadership");
  if (/engineer|developer|cto/.test(role)) out.push("Engineering");
  if (/\bai\b|\bml\b|machine learning|data|analytics/.test(role)) out.push("AI & data");
  if (/mobile|ios|android/.test(role)) out.push("Mobile");
  if (/automation|desktop/.test(role)) out.push("Automation & desktop");
  if (/design/.test(role)) out.push("Design");
  return out;
}

/** Typical roles on a project — the mix changes with the work. */
export const projectRoles = [
  { title: "Lead engineer", desc: "Your single point of contact: scope, architecture, schedule and decisions.", when: "Every project" },
  { title: "Full-stack engineer", desc: "The app, the APIs and the integrations with your systems.", when: "Every build" },
  { title: "AI engineer", desc: "Prompts, retrieval, agents, model integration and evaluations.", when: "AI work" },
  { title: "Mobile engineer", desc: "iOS and Android apps, offline sync, cameras and maps.", when: "Mobile apps" },
  { title: "Data engineer", desc: "Pipelines, warehouses, dashboards and reports.", when: "Data & reporting" },
  { title: "Automation & desktop engineer", desc: "Automations between systems, desktop tools and Office add-ins.", when: "Automation work" },
  { title: "Product designer", desc: "Research with the people who'll use it, and interfaces that keep it simple.", when: "User-facing work" },
];

/** How the team works with clients. */
export const workingValues = [
  { title: "Engineers you can talk to", desc: "The people building your software are on the calls — no hand-offs through account managers." },
  { title: "Small, steady teams", desc: "The same people from the first call to support, so context isn't lost between phases." },
  { title: "Plain language", desc: "We explain models, risks and trade-offs without jargon, and write them down." },
  { title: "Bad news early", desc: "If a test fails or a timeline slips, you hear it from us first — with options." },
];

// ------------------------------------------------------------
//  Security & AI (/responsible-ai)
// ------------------------------------------------------------

/** How client data and systems are protected, and who owns what. */
export const commitments = [
  { title: "Encrypted everywhere", desc: "Data is encrypted in transit and at rest, in the cloud region you choose." },
  { title: "Least-privilege access", desc: "Single sign-on, multi-factor authentication and role-based permissions — people and services see only what they need." },
  { title: "Secrets kept out of code", desc: "Keys and passwords live in a secrets manager, never in the repository, a chat thread or an email." },
  { title: "Only the data it needs", desc: "We collect the fields a feature needs and nothing more, and build prototypes on a sample — de-identified where we can." },
  { title: "Your code, your repository", desc: "Source code lives in a repository you own from the first commit, not one we lend you access to." },
  { title: "Your cloud, in your name", desc: "Infrastructure runs in your own AWS, Azure or Google Cloud account, so you hold the keys and the bills." },
  { title: "No training on your data", desc: "AI providers are used under terms that exclude your data from model training, and we don't train on it for anyone else." },
  { title: "Reviewed before launch", desc: "Code is reviewed, dependencies are scanned and the security setup is checked before anything goes live." },
];

/** How AI features are kept accurate, accountable and under your control. */
export const aiSafeguards = [
  { title: "Grounded answers, with sources", desc: "Assistants answer from your approved documents and link to the source — and say so when they don't know." },
  { title: "A person approves what matters", desc: "Payments, messages to customers, record changes and other consequential actions wait for human approval, by rules you set." },
  { title: "Evaluated before every release", desc: "Each change is tested against real examples from your business, and doesn't ship if quality drops." },
  { title: "Logged and reviewable", desc: "AI requests, answers and actions are logged, so you can see what happened, when, and what it was based on." },
];

export const neverDo = [
  "Use your data to train AI models for anyone but you",
  "Sell or share your data",
  "Keep your code, cloud accounts or credentials in our name",
  "Let AI take a consequential action without the approval you've set",
  "Ship an AI change that hasn't passed its evaluations",
  "Name clients, show their logos or publish their work without written permission",
];

/** Data lifecycle: what happens to data at each stage. */
export const dataLifecycle = [
  { title: "Collect", desc: "Only the fields a feature needs, agreed in a data map before we build. Identifiers are minimized or removed where the task allows." },
  { title: "Process", desc: "AI models run under business terms that exclude training on your data, or inside your own cloud when data must stay there." },
  { title: "Store", desc: "Encrypted at rest in your own cloud account and region, with role-based access that respects your existing permissions." },
  { title: "Retain", desc: "Kept only as long as the purpose requires — retention periods are set with you and written into the runbooks." },
  { title: "Delete", desc: "Removed on schedule or on request — including the sample data used for a prototype, backups and logs — with confirmation when it's done." },
];

/** Requirements we design around — not certifications. */
export const policies = [
  { name: "HIPAA", desc: "For healthcare work, we design to support HIPAA requirements: access controls, audit logs, encryption, and hosting and AI providers that offer a business associate agreement." },
  { name: "PCI DSS", desc: "Card payments go through Stripe, so card numbers never touch your servers or ours — which keeps your PCI scope as small as possible." },
  { name: "Privacy laws", desc: "Data-processing agreements, regional hosting and access or deletion requests, handled when GDPR, CCPA or similar laws apply." },
  { name: "NDAs & confidentiality", desc: "We sign your NDA, or offer ours, before you share anything sensitive — and confidentiality continues after the project ends." },
  { name: "Your security review", desc: "We answer your vendor security questions, follow your IT policies, and your team can review the code at any time." },
];

export const policiesNote =
  "We design and build to support these requirements, working with your compliance or IT team. They describe what we design for — they are not certifications, and compliance remains a shared responsibility with your organization.";
