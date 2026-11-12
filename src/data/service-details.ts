// ============================================================
//  SERVICE PAGES — extra content for /services/<slug>, keyed by the service key in company.ts.
//  The solutions and related services on each page come from company.ts, so they never drift.
//  Copy drafted for review: no client names, results or certifications are claimed here.
// ============================================================

import type { ServiceKey } from "./company";

export interface ServiceDetail {
  intro: string;
  outcomes: string[]; // what the service is designed to achieve (qualitative)
  included: { title: string; items: string[] }[]; // deliverables, in 3 groups
  steps: { title: string; desc: string }[]; // how we run it, 4 steps
  roles: { role: string; does: string }[];
  stack: string[]; // stackGroups titles
  faqs: { q: string; a: string }[];
}

export const serviceDetails: Record<ServiceKey, ServiceDetail> = {
  ai: {
    intro:
      "We build AI that does one specific job inside your business: an assistant that answers from your own documents, an agent that reads an email and updates your CRM, a voice agent that answers the phone after hours. Every feature is tested on real examples from your work before it ships, and it hands off to a person when it isn't sure.",
    outcomes: [
      "AI that answers from your own data, with sources people can check",
      "Clear rules for when the AI acts on its own and when a person approves",
      "Quality measured on real examples before launch and on every release",
      "Running costs understood and planned before you commit",
    ],
    included: [
      { title: "Build", items: ["LLM assistants and agents", "Retrieval over your documents (RAG)", "Voice and chat agents"] },
      { title: "Safeguards", items: ["Permissions that follow your existing roles", "Human review and hand-off rules", "Guardrails and safe fallbacks"] },
      { title: "Quality", items: ["Evaluation set built from your real cases", "Cost and response-time monitoring", "Model and prompt documentation"] },
    ],
    steps: [
      { title: "Free call", desc: "We talk through the task and the data behind it, and tell you honestly whether AI is the right tool." },
      { title: "Two-week prototype", desc: "The core AI working on a sample of your real data, so you can judge the answers for yourself." },
      { title: "Build", desc: "Production engineering with a demo every week and evaluations on every change." },
      { title: "Launch & measure", desc: "A staged rollout, with quality, cost and hand-offs monitored from day one." },
    ],
    roles: [
      { role: "AI engineer", does: "Designs the prompts, retrieval, agents and evaluation set." },
      { role: "Full-stack engineer", does: "Builds the app, APIs and integrations around the AI." },
      { role: "Product designer", does: "Shapes how people ask, review and correct the AI's work." },
      { role: "Your subject expert", does: "From your side: judges the answers and sets the rules the AI must follow." },
    ],
    stack: ["AI models", "AI frameworks", "Data & cloud"],
    faqs: [
      { q: "Which AI model will you use?", a: "Whichever does the job best for your task, data and budget. We compare models on your own examples during the prototype, and design the system so the model can be swapped later." },
      { q: "Is our data used to train public models?", a: "No. We use providers and settings that don't train on your data, and where data must stay in-house we can run open models in your own cloud account." },
      { q: "What happens when the AI gets something wrong?", a: "We design for it. Low-confidence answers go to a person, every action is logged, and mistakes are added to the evaluation set so they don't come back." },
      { q: "Can you add AI to software we already have?", a: "Yes. Many projects add an assistant or an agent to an existing product or internal tool through its API or database, without rebuilding it." },
    ],
  },

  automation: {
    intro:
      "Most teams have a task that eats hours every week: copying data between systems, chasing approvals, re-typing documents, building the same report again. We hand that work to AI and software. Documents get read, systems stay in sync and people get nudged, with a person approving the steps that matter.",
    outcomes: [
      "Re-typing and copy-paste handed to software",
      "Systems that agree with each other without manual exports",
      "Approvals and follow-ups that happen on time",
      "A clear log of what ran, what was flagged and who approved it",
    ],
    included: [
      { title: "Documents", items: ["Document reading and data extraction", "Checks against your rules and records", "Human review for anything unusual"] },
      { title: "Workflows", items: ["Workflow map and automation design", "Approval and exception queues", "Email, Slack and Microsoft Teams notifications"] },
      { title: "Integrations", items: ["Connectors to accounting, CRM and ERP systems", "Scheduled and event-driven syncs", "Monitoring and error alerts"] },
    ],
    steps: [
      { title: "Free call", desc: "Tell us the task that eats your week and the systems it touches." },
      { title: "Two-week prototype", desc: "One real workflow automated end to end on your own data, running alongside the manual process." },
      { title: "Build", desc: "More workflows, edge cases and approvals, shipped in weekly increments." },
      { title: "Switch over", desc: "Move across in stages, watch every run and tune the rules with your team." },
    ],
    roles: [
      { role: "Automation engineer", does: "Designs and builds the workflows, queues and alerts." },
      { role: "AI engineer", does: "Handles document reading and the judgment calls inside the workflow." },
      { role: "Full-stack engineer", does: "Connects your accounting, CRM and operations systems, and builds the review screens." },
      { role: "Your process owner", does: "From your side: knows the edge cases and approves the rules." },
    ],
    stack: ["AI models", "Web & backend", "Data & cloud"],
    faqs: [
      { q: "Do we need to replace our current systems?", a: "No. Automation works with the systems you already have, through their APIs or exports, and where nothing else exists, through carefully built screen automation." },
      { q: "What if a document or case doesn't fit the rules?", a: "It goes to a review queue for a person, with the reason it was flagged. Nothing unusual is posted without someone checking it." },
      { q: "Why not just use Zapier or n8n ourselves?", a: "For simple, low-risk flows, you should, and we use tools like n8n too. We're useful when a workflow needs document reading, careful error handling, approvals or systems those tools don't reach." },
      { q: "How do we know it's working?", a: "Every run is logged, failures raise an alert, and a simple dashboard shows what was processed, what was flagged and what needed a person." },
    ],
  },

  software: {
    intro:
      "Off-the-shelf tools get you most of the way. The last part is often where your team's week goes: spreadsheets, re-typing and workarounds between systems. We build web apps, internal tools and SaaS products around how your business actually runs, add AI features to products you already have, and put stalled builds back on track.",
    outcomes: [
      "Software that fits your workflow, not the other way around",
      "AI features that work inside the product your customers already use",
      "Clean code and documentation your own engineers can pick up",
      "Stalled or fragile builds stabilized, and back under your control",
    ],
    included: [
      { title: "Product", items: ["Workflow map and success measures", "Working prototype on your own data", "Interface design and a reusable component library"] },
      { title: "Engineering", items: ["Web apps, SaaS products and admin back offices", "AI features, APIs and integrations", "Sign-in, roles, billing and audit trails"] },
      { title: "Run & rescue", items: ["Infrastructure as code in your cloud account", "Automated tests, CI/CD and monitoring", "Code audits and step-by-step modernization"] },
    ],
    steps: [
      { title: "Free call", desc: "Walk us through the product, the workflow and the tools it touches today." },
      { title: "Two-week prototype", desc: "The core screens or feature working on your own data — or, for a rescue, a written audit." },
      { title: "Build", desc: "A fixed-scope build in short iterations, with a working demo every week." },
      { title: "Launch & hand over", desc: "A staged release, training for your team, and everything handed over in your name." },
    ],
    roles: [
      { role: "Tech lead", does: "Owns the architecture, security and code quality." },
      { role: "Full-stack engineer", does: "Builds the front end, APIs and integrations." },
      { role: "Product designer", does: "Shapes the screens and tests them with the people who'll use them." },
      { role: "Your product owner", does: "From your side: sets priorities and signs off each milestone." },
    ],
    stack: ["Web & backend", "Data & cloud", "AI models"],
    faqs: [
      { q: "Should we build custom software or buy a product?", a: "Buy when a product fits, and we'll tell you so on the first call. Custom software makes sense when the work is specific to how you operate, or when your team is stitching several tools together by hand." },
      { q: "Can you build a SaaS product from scratch?", a: "Yes. We build MVPs and full products, including customer accounts, billing with Stripe, admin tools and the analytics that show how early users actually use it." },
      { q: "Can you take over a project another company started?", a: "Yes. We start with a written audit of the code and infrastructure, fix what's urgent, then move it forward in small, safe steps — rarely with a full rewrite." },
      { q: "Can you work with our existing developers?", a: "Yes. We can lead the build, or join your team, follow your conventions and review code together." },
    ],
  },
};
