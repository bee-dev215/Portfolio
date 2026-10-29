// ============================================================
//  Frequently asked questions — the FAQ page (/faq) shows them all by category;
//  the home page and the contact page show the ones marked `featured`.
//  `id` is the question's anchor (/faq#id) — keep it stable once published, links may point to it.
// ============================================================

export type FaqCategory = "The free prototype" | "Working with us" | "AI & quality" | "Security & data" | "Pricing & timelines";

export interface Faq {
  id: string;
  q: string;
  a: string;
  category: FaqCategory;
  featured?: boolean;
}

export const faqCategories: FaqCategory[] = ["The free prototype", "Working with us", "AI & quality", "Security & data", "Pricing & timelines"];

export const faqs: Faq[] = [
  // ---------- The free prototype ----------
  {
    id: "free-prototype",
    category: "The free prototype",
    featured: true,
    q: "What does the free two-week prototype include?",
    a: "One task, built end to end on a sample of your real data, in two weeks. It starts with a short call and a one-page plan of what we'll prove. At the end, your team tries it on real work and you get a demo and an honest recommendation: a fixed-scope quote if it's worth building properly, or a plain \"not worth it\" if it isn't.",
  },
  {
    id: "whats-the-catch",
    category: "The free prototype",
    featured: true,
    q: "Is there a catch?",
    a: "No. There's no fee and no obligation to continue. A working prototype is the quickest way for both sides to see whether the work is worth doing, and most of the effort goes into understanding your task — which we'd need to do anyway. If you don't go ahead, you owe nothing and we delete the sample data you shared.",
  },
  {
    id: "prototype-fit",
    category: "The free prototype",
    q: "What kind of task fits a two-week prototype?",
    a: "Repetitive work with a clear input and a clear result: reading invoices or forms, answering routine calls or questions, moving data between systems, turning field notes into reports, putting together a weekly summary. If the whole problem is bigger, we pick the slice that proves the idea. If software isn't the answer, we'll tell you on the call.",
  },
  {
    id: "what-we-need",
    category: "The free prototype",
    q: "What do you need from us?",
    a: "One person who knows the work and can make decisions, some time with the people who do the task today, a sample of real examples to build on, and test or read-only access to the systems involved. For the prototype, that means a kickoff and a demo — not weeks of meetings.",
  },

  // ---------- Working with us ----------
  {
    id: "the-call",
    category: "Working with us",
    featured: true,
    q: "What happens on the call?",
    a: "You talk to a senior engineer, not a salesperson. Tell us about the task that eats your team's week — how it's done today, which systems it touches and what \"fixed\" would look like. We'll tell you honestly whether software can help and, if it can, what a two-week prototype would prove. Book 15 minutes for a quick intro, or 30 for a fuller discovery call.",
  },
  {
    id: "who-owns-the-code",
    category: "Working with us",
    featured: true,
    q: "Who owns the code?",
    a: "You do. Source code lives in a repository you own, infrastructure runs in cloud accounts in your name, and documentation is handed over as we go — from day one, not at the end. No lock-in, and no hosting you can't move.",
  },
  {
    id: "existing-systems",
    category: "Working with us",
    q: "Can you work with the systems we already use?",
    a: "Yes — that's most of the job. We connect to accounting, CRM, scheduling, practice-management and e-commerce tools through their APIs, and through exports, email or desktop automation when there's no API. You don't need to replace what already works.",
  },
  {
    id: "time-zones",
    category: "Working with us",
    q: "Do you work with clients in other time zones?",
    a: "Yes. We work with clients in different time zones, and calls are booked in your local time — the booking page shows the available times in your own time zone. Weekly demos are set at a time that suits both sides, and written notes follow every call.",
  },
  {
    id: "small-business",
    category: "Working with us",
    q: "Do you work with small businesses?",
    a: "Yes. Small teams often feel the busywork most, because there's nobody else to hand it to. The free prototype lets you see whether it works before you spend anything, and builds are scoped to what you need, not to an enterprise budget.",
  },
  {
    id: "take-over-project",
    category: "Working with us",
    q: "Can you take over a project someone else started?",
    a: "Yes. We start with an audit of the code, infrastructure and documentation, and tell you plainly what state it's in. Then we stabilize what's there and move it forward in small, safe steps — without a risky rewrite unless one is truly needed.",
  },
  {
    id: "own-engineers",
    category: "Working with us",
    q: "Do we need our own engineers?",
    a: "No. We can design, build and run the system for you. If you do have engineers, we work alongside them in your repositories and hand over with documentation and training, so they can run and extend it without us.",
  },

  // ---------- AI & quality ----------
  {
    id: "wrong-answers",
    category: "AI & quality",
    q: "How do you stop the AI from getting things wrong?",
    a: "Answers are grounded in your own documents and cite their sources, and the assistant says so when it doesn't know. Every release is tested against real examples from your business, consequential actions wait for a person's approval, and everything is logged so a mistake can be traced and fixed.",
  },
  {
    id: "which-models",
    category: "AI & quality",
    q: "Which AI models do you use?",
    a: "We choose per task. That might be a commercial model such as GPT, Claude or Gemini, or an open model such as Llama or Mistral, depending on quality, cost and privacy — and we can run open models inside your own cloud when data must stay there. The product is built so the model can be swapped later.",
  },
  {
    id: "replace-staff",
    category: "AI & quality",
    q: "Will AI replace our staff?",
    a: "That's not what we build. The aim is to take the re-typing, chasing and copy-paste off people's desks, so they spend their time on the work that needs them. People stay in control of anything that matters.",
  },

  // ---------- Security & data ----------
  {
    id: "training-on-our-data",
    category: "Security & data",
    featured: true,
    q: "Do you train AI on our data?",
    a: "No. We use AI providers under business terms that exclude your data from model training, or run open models in your own cloud. Your data is used to do your work, not to improve anyone else's model. If a project ever needs a model trained on your data, it's trained for you alone, in your account, and only with your written agreement.",
  },
  {
    id: "nda",
    category: "Security & data",
    q: "Will you sign an NDA?",
    a: "Yes. We'll sign your NDA, or offer ours, before you share anything sensitive — including the sample data for a prototype. Client work stays confidential by default, which is also why you won't find client logos on this site.",
  },
  {
    id: "data-security",
    category: "Security & data",
    q: "How do you keep our data secure?",
    a: "Data is encrypted in transit and at rest, access is limited by role with single sign-on and multi-factor authentication, and secrets are kept out of code. For healthcare work we design to support HIPAA requirements, and card payments go through Stripe to keep your PCI scope small. We're happy to answer your security questionnaire, too.",
  },

  // ---------- Pricing & timelines ----------
  {
    id: "pricing",
    category: "Pricing & timelines",
    featured: true,
    q: "How does pricing work?",
    a: "The two-week prototype is free. If it's worth building properly, we quote a fixed price for an agreed scope, with milestones, before any paid work starts — so the number doesn't move unless the scope does. Ongoing support, or a dedicated team, is billed monthly and sized to the work.",
  },
  {
    id: "timeline",
    category: "Pricing & timelines",
    q: "How long does a project take?",
    a: "The prototype takes two weeks. A full build depends on scope, and the proposal sets out the milestones before work starts. You see working software in a demo every week, so progress is never a surprise.",
  },
  {
    id: "support",
    category: "Pricing & timelines",
    q: "Do you offer support and maintenance?",
    a: "Yes. We monitor uptime, errors, cost and AI quality, fix what needs fixing and ship improvements based on your team's feedback. Support plans are sized to the system and billed monthly — or, if you'd rather run it yourselves, we hand over with runbooks and training.",
  },
];
