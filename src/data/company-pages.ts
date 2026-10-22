// ============================================================
//  COMPANY PAGES — content for /about, /approach, /technology, /team and /responsible-ai.
//  Core company facts, services, team and process stay in src/data/company.ts.
//  Copy here was drafted for the site: review it before launch.
// ============================================================

import type { ServiceKey, TeamMember } from "./company";

// ------------------------------------------------------------
//  About
// ------------------------------------------------------------

export interface Practice {
  title: string;
  desc: string;
  services: ServiceKey[]; // the service pages this practice delivers
}

/** How the company is organised: four practices that staff every project together. */
export const practices: Practice[] = [
  {
    title: "AI engineering",
    desc: "Builds the products: retrieval pipelines, agents, model integration, APIs and the apps people use — plus the integrations into your platforms.",
    services: ["build", "llm", "platform", "voice"],
  },
  {
    title: "Data & analytics",
    desc: "Owns the record of learning: pipelines, warehouses, dashboards, explainable models — and the evaluation suites that keep AI features honest.",
    services: ["analytics", "evaluation"],
  },
  {
    title: "Learning & product design",
    desc: "Researches how learners and educators actually work, and designs AI features that fit a lesson, a workflow or a workday.",
    services: ["design"],
  },
  {
    title: "AI Academy",
    desc: "Teaches as we build: engineering bootcamps, educator workshops and AI-literacy sessions, so your team can run what we hand over.",
    services: ["academy"],
  },
];

/** "Inside the studio" photos on /about. The first one is shown large. */
export const studioGallery = [
  { src: "/images/about-office.webp", alt: "A bright studio with plants, where one person works at a laptop while two colleagues review notes by the window", caption: "The studio — engineers, designers and educators in one room" },
  { src: "/images/about-pairing.webp", alt: "Two engineers working through code together at one laptop", caption: "Pairing on a retrieval pipeline" },
  { src: "/images/about-research.webp", alt: "A researcher with a tablet talking through a prototype with an educator at a laptop", caption: "Testing a prototype with the people who'll use it" },
  { src: "/images/about-remote.webp", alt: "Colleagues at a conference table on a video call with a remote teammate", caption: "Weekly demo with a client team" },
  { src: "/images/about-celebrate.webp", alt: "Three colleagues sharing a high-five around a laptop", caption: "Shipping day" },
];

/** Why the site shows no client logos or case-study names. */
export const confidentiality = [
  {
    title: "Client work stays confidential",
    desc: "Schools, universities and companies trust us with learner data, course material and unreleased products. We don't name them, show their logos or publish their screens unless they agree to it in writing.",
  },
  {
    title: "Described by the engineering",
    desc: "Instead of logos, our project write-ups describe the engineering — the problem, what we built and how it was kept safe — with client names and identifying details left out. In a discovery call we can walk you through relevant work in more detail.",
  },
  {
    title: "Your project gets the same care",
    desc: "Confidentiality terms are part of every engagement from the first call — and they continue after the project ends.",
  },
];

// ------------------------------------------------------------
//  Approach — ways to engage
// ------------------------------------------------------------

export interface EngagementModel {
  key: "project" | "retainer" | "training";
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
    key: "project",
    name: "Fixed-scope project",
    tagline: "A defined product or feature, delivered against agreed acceptance criteria.",
    bestFor: "A new AI product, a pilot, or a feature with a clear goal and a deadline — an AI tutor for one course, a feedback workflow, an LMS integration.",
    pricing: "Discovery first, then a fixed price for the scope in the proposal, invoiced by milestone.",
    shape: "Discovery → prototype → build → pilot, with a demo at the end of every two-week iteration.",
    youGet: ["Working software in production", "Source code and infrastructure as code", "Evaluation suite and runbooks", "Handover training for your team"],
    team: ["Engagement lead", "AI and full-stack engineers", "Learning designer", "Evaluation support"],
  },
  {
    key: "retainer",
    name: "Retainer",
    tagline: "A standing team that keeps improving what you run.",
    bestFor: "Products already in use that need steady iteration, monitoring and support — sized to your term calendar or business cycle.",
    pricing: "A monthly fee for an agreed amount of team time, reviewed each quarter.",
    shape: "A shared backlog, regular releases and monitoring — priorities set together every month.",
    youGet: ["Regular releases driven by feedback and evaluations", "Quality, cost and usage monitoring", "Support within agreed response times", "Quarterly outcome reviews"],
    team: ["Engagement lead", "Engineers from the original build", "Data and evaluation support as needed"],
  },
  {
    key: "training",
    name: "Training programme",
    tagline: "AI Academy courses for engineers, educators and staff.",
    bestFor: "Teams that want to build with AI themselves, or adopt it responsibly — from engineering bootcamps to AI-literacy sessions for leadership.",
    pricing: "Priced per cohort, with materials and recordings your team keeps.",
    shape: "Short needs assessment, then on-site or remote sessions — an intensive bootcamp or a series of short workshops.",
    youGet: ["A curriculum tailored to your use cases", "Hands-on labs and course materials", "Recordings and reference guides", "A skills check at the end"],
    team: ["AI education lead", "Practising engineers as instructors", "Learning designer"],
  },
];

/** What a project needs from the client side. */
export const needFromYou = [
  { title: "A product owner", desc: "One person who can make decisions and is available for a short check-in each week." },
  { title: "Access to real users", desc: "Learners, educators or staff we can interview and test with during discovery and the pilot." },
  { title: "Content and data", desc: "The course material, policies or datasets the system will be grounded in — or a sample to start with." },
  { title: "Your policies", desc: "Privacy, safeguarding and AI-use policies, and a contact in compliance or IT security." },
  { title: "Platform access", desc: "Sandbox access to your LMS, SIS or identity provider when the work integrates with them." },
];

/** How a client stays informed during a project. */
export const inTheLoop = [
  { title: "Weekly check-in", desc: "Thirty minutes on progress, blockers and decisions needed — with notes sent afterwards." },
  { title: "Demo every iteration", desc: "Working software shown at the end of each two-week iteration, not slides." },
  { title: "Shared board", desc: "The backlog and its status are visible to your team at all times." },
  { title: "Decision log", desc: "Every significant product, model or architecture decision is written down with its reasons." },
  { title: "Evaluation reports", desc: "Results from the evaluation suite shared with each release, including what got worse." },
  { title: "Open repository", desc: "Your code lives in a repository you own and can read from day one." },
];

/** What is handed over at the end of a build. */
export const handoverChecklist = [
  "Source code in a repository you own",
  "Infrastructure as code and deployment pipeline",
  "Architecture overview and decision log",
  "Evaluation suite with the latest results",
  "Runbooks for monitoring, incidents and model updates",
  "Admin and educator guides",
  "Training sessions for your engineers and staff",
  "Credentials and accounts transferred to your organisation",
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
    summary: "A leading model such as GPT, Claude or Gemini, called through an API under enterprise terms that exclude your data from training.",
    strengths: ["Strongest reasoning and writing quality", "Fastest route to a working pilot", "No infrastructure to run"],
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
    summary: "A compact model trained for one narrow task — classification, extraction, short feedback — that runs fast and cheaply.",
    strengths: ["Very low latency", "Lowest cost per request at scale", "Can run in your cloud or on the edge"],
    tradeoffs: ["Narrow: one task per model", "Needs labelled examples to train and maintain"],
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

/** The "How we choose a model" selector. Each answer adds to the approaches it favours; the highest total wins. */
export const selectorQuestions: SelectorQuestion[] = [
  {
    key: "data",
    question: "How sensitive is the data?",
    options: [
      { label: "Public or published content", note: "Public content can go to a hosted model with little extra protection.", scores: { hosted: 2, open: 0, small: 0, hybrid: 1 } },
      { label: "Internal, not personal", note: "Internal documents are fine under enterprise terms, but some teams prefer to keep them in their own cloud.", scores: { hosted: 1, open: 1, small: 1, hybrid: 2 } },
      { label: "Personal or student data", note: "Personal and student data points towards models that run inside your environment.", scores: { hosted: 0, open: 3, small: 2, hybrid: 2 } },
    ],
  },
  {
    key: "latency",
    question: "How fast must it respond?",
    options: [
      { label: "A few seconds is fine", note: "Chat-style answers within a few seconds work with any approach.", scores: { hosted: 1, open: 1, small: 0, hybrid: 1 } },
      { label: "It must feel instant", note: "Live voice, autocomplete or in-lesson feedback favour small, fast models.", scores: { hosted: 0, open: 0, small: 3, hybrid: 1 } },
    ],
  },
  {
    key: "scale",
    question: "How much use do you expect?",
    options: [
      { label: "A pilot or one course", note: "At pilot scale, speed of building matters more than cost per request.", scores: { hosted: 3, open: 0, small: 0, hybrid: 1 } },
      { label: "Thousands of users each day", note: "Steady daily use is where mixing models starts to pay off.", scores: { hosted: 1, open: 1, small: 1, hybrid: 2 } },
      { label: "Millions of requests", note: "At very high volume, cost per request dominates — smaller and self-hosted models win.", scores: { hosted: 0, open: 2, small: 3, hybrid: 1 } },
    ],
  },
];

/** Tie-break order when two approaches score the same. */
export const approachPriority: ModelApproachKey[] = ["hybrid", "open", "hosted", "small"];

/** Evaluation pipeline: how a change reaches learners. */
export const evalPipeline = [
  { title: "Test set", desc: "Real questions and tasks from your learners and educators, with the answers or behaviours we expect." },
  { title: "Automated evals", desc: "Every change runs against the test set: accuracy, grounding, citations, tone and refusal behaviour." },
  { title: "Human review", desc: "Educators and subject experts review a sample, focusing on the cases automation can't judge." },
  { title: "Release gate", desc: "A release ships only if it meets the agreed thresholds and nothing important got worse." },
  { title: "Monitoring", desc: "In production we watch quality, cost and drift — and new failure cases go back into the test set." },
];

/** Reference architecture, left to right. `layer` groups the nodes in the diagram. */
export const architecture = [
  { title: "Your systems", desc: "LMS, SIS, content stores, identity provider", layer: "Sources" },
  { title: "Ingestion", desc: "Connectors, cleaning, chunking, permissions", layer: "Data" },
  { title: "Retrieval", desc: "Vector and keyword search over approved content", layer: "Data" },
  { title: "Model gateway", desc: "Routes each request to the right model", layer: "AI" },
  { title: "Guardrails", desc: "Safety, policy and grounding checks", layer: "AI" },
  { title: "Your apps", desc: "Tutor, assistant, dashboards — inside the LMS or standalone", layer: "Experience" },
  { title: "Analytics", desc: "Usage, quality and learning outcomes", layer: "Insight" },
];

/** Learning standards, with what each one is for. */
export const standards = [
  { name: "LTI 1.3", desc: "Launches our tools inside Canvas, Moodle, Blackboard and other LMSs, with single sign-on and grade passback." },
  { name: "xAPI", desc: "Records learning activity from any app into a learning record store for analytics." },
  { name: "SCORM", desc: "Packages courses so they play and report progress in almost any LMS." },
  { name: "QTI", desc: "Exchanges questions and tests between authoring tools and assessment platforms." },
  { name: "OneRoster", desc: "Syncs classes, enrolments and rosters from the student information system." },
  { name: "Caliper", desc: "Captures structured learning events for analytics across platforms." },
];

// ------------------------------------------------------------
//  Team
// ------------------------------------------------------------

export type Discipline = "Leadership" | "Engineering" | "Data & ML" | "Design" | "Education";

export const disciplines: Discipline[] = ["Leadership", "Engineering", "Data & ML", "Design", "Education"];

/** Which disciplines a person belongs to, read from their role. */
export function disciplinesOf(m: TeamMember): Discipline[] {
  const role = m.role.toLowerCase();
  const out: Discipline[] = [];
  if (/founder|ceo|cto/.test(role)) out.push("Leadership");
  if (/engineer|cto/.test(role)) out.push("Engineering");
  if (/\bml\b|data|analytics/.test(role)) out.push("Data & ML");
  if (/design/.test(role)) out.push("Design");
  if (/education|learning experience|academy|training/.test(role)) out.push("Education");
  return out;
}

/** Typical roles on a project — the mix changes with the work. */
export const projectRoles = [
  { title: "Engagement lead", desc: "Your single point of contact: scope, schedule, risks and decisions.", when: "Every project" },
  { title: "AI engineer", desc: "Retrieval, prompts, agents, model integration and evaluation pipelines.", when: "Every project" },
  { title: "Full-stack engineer", desc: "The app, the APIs and the integrations with your platforms.", when: "Every build" },
  { title: "Learning designer", desc: "Research with learners and educators, and how the AI fits the learning.", when: "Learner-facing work" },
  { title: "Data scientist", desc: "Pipelines, analytics, early-warning models and their explanations.", when: "Analytics work" },
  { title: "AI Academy instructor", desc: "Handover training and workshops for your engineers and staff.", when: "Handover and training" },
];

/** How the team works with clients. */
export const workingValues = [
  { title: "Engineers you can talk to", desc: "The people building your product are in the meetings — no hand-offs through account managers." },
  { title: "Small, steady teams", desc: "The same people from discovery to support, so context isn't lost between phases." },
  { title: "Plain language", desc: "We explain models, risks and trade-offs without jargon, and write them down." },
  { title: "Bad news early", desc: "If an evaluation fails or a timeline slips, you hear it from us first — with options." },
];

// ------------------------------------------------------------
//  Responsible AI
// ------------------------------------------------------------

export const commitments = [
  { title: "Privacy by design", desc: "We collect only the data a feature needs, keep it in the region you choose and encrypt it in transit and at rest." },
  { title: "Grounded, cited answers", desc: "Assistants answer from your approved content and show their sources — and say so when they don't know." },
  { title: "People decide high-stakes outcomes", desc: "Grades, feedback that counts and safeguarding flags go to an educator for review before anything reaches a learner." },
  { title: "Evaluated before release", desc: "Every release is tested against an evaluation set of real tasks, and doesn't ship if quality drops." },
  { title: "Fairness reviews", desc: "We test outputs across learner groups, languages and abilities, and report what we find — including what we can't yet fix." },
  { title: "Accessible by default", desc: "Interfaces are designed and tested against WCAG 2.2 AA, with keyboard, screen-reader and captioning support." },
  { title: "Safeguarding young learners", desc: "Age-appropriate content filters, escalation paths for concerning conversations and settings agreed with your safeguarding lead." },
  { title: "Transparent to learners", desc: "Learners can always tell when they are talking to AI, what it can and can't do, and how to reach a person." },
];

export const neverDo = [
  "Use your data, or your learners' data, to train models for anyone else",
  "Sell or share personal data",
  "Release AI-generated grades without an educator's review",
  "Name clients, show their logos or publish their work without written permission",
  "Hide that a learner is talking to an AI",
  "Ship a model change that hasn't passed the evaluation suite",
];

/** Data lifecycle: what happens to data at each stage. */
export const dataLifecycle = [
  { title: "Collect", desc: "Only the fields a feature needs, agreed in a data map during discovery. Identifiers are minimised or pseudonymised where possible." },
  { title: "Process", desc: "Models run under enterprise terms that exclude training on your data, or inside your own cloud when data must stay there." },
  { title: "Store", desc: "Encrypted at rest in the region you choose, with role-based access that respects your existing permissions." },
  { title: "Retain", desc: "Kept only as long as the purpose requires — retention periods are set with you and written into the runbooks." },
  { title: "Delete", desc: "Removed on schedule or on request, including backups and logs, with confirmation when it is done." },
];

/** Regulations and standards we design around — not certifications. */
export const policies = [
  { name: "FERPA", desc: "US student education records: access controls and disclosure rules mapped with your registrar or compliance team." },
  { name: "COPPA", desc: "Children under 13 in the US: parental-consent flows and data limits designed in when younger learners are involved." },
  { name: "GDPR / UK GDPR", desc: "Lawful basis, data-subject rights, data-processing agreements and regional hosting for European and UK learners." },
  { name: "WCAG 2.2", desc: "Accessibility of every interface we ship, tested with assistive technologies." },
  { name: "Your AI-use policy", desc: "Your institution's rules on AI in teaching, assessment and work — we design the product to follow them." },
];

export const policiesNote =
  "We design and build to support these requirements, working with your compliance team. They describe what we design for — they are not certifications, and compliance remains a shared responsibility with your organisation.";
