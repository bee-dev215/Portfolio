// ============================================================
//  Frequently asked questions — the FAQ page (/faq) shows them all by category;
//  the home page and the contact page show the ones marked `featured`.
//  `id` is the question's anchor (/faq#id) — keep it stable once published, links may point to it.
// ============================================================

export type FaqCategory = "Working with us" | "AI & quality" | "Data & privacy" | "Pricing & timelines";

export interface Faq {
  id: string;
  q: string;
  a: string;
  category: FaqCategory;
  featured?: boolean;
}

export const faqCategories: FaqCategory[] = ["Working with us", "AI & quality", "Data & privacy", "Pricing & timelines"];

export const faqs: Faq[] = [
  // ---------- Working with us ----------
  {
    id: "lms-integration",
    category: "Working with us",
    featured: true,
    q: "Can it work inside our LMS?",
    a: "Yes. We integrate with platforms such as Canvas, Moodle, Blackboard and Google Classroom through LTI 1.3 and open standards like xAPI and OneRoster, so learners and educators use AI where they already work.",
  },
  {
    id: "train-our-team",
    category: "Working with us",
    featured: true,
    q: "Do you train our own team?",
    a: "Yes — it is part of every engagement. We also run standalone AI Academy programmes: engineering bootcamps, educator workshops and AI-literacy sessions for leadership and staff.",
  },
  {
    id: "typical-engagement",
    category: "Working with us",
    q: "What does a typical engagement look like?",
    a: "Five phases: discovery, a working prototype on your own content, production engineering in short iterations, a measured pilot with training, and ongoing improvement. You see working software early and at the end of every iteration, and you can stop after any phase.",
  },
  {
    id: "own-engineers",
    category: "Working with us",
    q: "Do we need our own engineers?",
    a: "No. We can design, build and run the system for you. If you do have an engineering team, we work alongside them in your repositories and hand over with documentation and workshops, so they can run and extend it without us.",
  },
  {
    id: "existing-product",
    category: "Working with us",
    q: "Can you add AI to a product we already have?",
    a: "Yes — much of our EdTech work is exactly that. We start by reviewing your architecture, data and roadmap, then ship AI features into your product in small, reviewable changes that fit your release process.",
  },
  {
    id: "who-owns-the-work",
    category: "Working with us",
    q: "Who owns the code and the content?",
    a: "Ownership is set out in each proposal before any work starts. Your content and your data always remain yours, and we normally propose that the code written for your project transfers to you on payment.",
  },

  // ---------- AI & quality ----------
  {
    id: "which-models",
    category: "AI & quality",
    featured: true,
    q: "Which AI models do you use?",
    a: "We are model-agnostic. We choose between commercial models such as GPT, Claude and Gemini and open models such as Llama or Mistral for each task, based on quality, cost and privacy — and we can run open models inside your own cloud when data must stay there.",
  },
  {
    id: "wrong-answers",
    category: "AI & quality",
    featured: true,
    q: "How do you stop the AI from giving wrong answers?",
    a: "Answers are grounded in your approved content and cite their sources. Every release is tested against an evaluation set of real questions, guardrails catch off-topic or unsafe requests, and high-stakes outputs such as grades go to a person for review.",
  },
  {
    id: "measuring-success",
    category: "AI & quality",
    q: "How do you know whether it is working?",
    a: "We agree success measures with you during discovery — learning and business outcomes, not just usage. Pilots are run against those measures, and after launch, dashboards track answer quality, cost and usage, with alerts when quality drifts.",
  },
  {
    id: "replace-teachers",
    category: "AI & quality",
    q: "Will AI replace teachers or trainers?",
    a: "That is not what we build. Our tools take on drafting, searching and routine questions so educators have more time for the parts of teaching only people can do — and educators stay in control of what reaches learners.",
  },
  {
    id: "academic-integrity",
    category: "AI & quality",
    q: "How do you handle academic integrity?",
    a: "Tutors can run in a hint-first mode that guides learners rather than handing out answers, and teachers set the rules for each subject or assessment. Conversations can be reviewed, so the tool supports your integrity policy instead of working around it.",
  },
  {
    id: "languages",
    category: "AI & quality",
    q: "Can it work in languages other than English?",
    a: "Yes. Modern models work in many languages, and we test quality in each language you need before launch. Content Studio can also translate and localise approved course material.",
  },

  // ---------- Data & privacy ----------
  {
    id: "data-protection",
    category: "Data & privacy",
    featured: true,
    q: "How do you protect student and staff data?",
    a: "We collect only the data a feature needs, use enterprise API terms that exclude your data from model training, encrypt data in transit and at rest, and respect your existing permissions. Privacy requirements such as FERPA or GDPR are mapped with your compliance team during discovery.",
  },
  {
    id: "training-on-our-data",
    category: "Data & privacy",
    q: "Is our data used to train AI models?",
    a: "No. We use model providers under enterprise terms that exclude your data from training, or run open models in an environment you control. Your content is used to answer your users' questions, not to improve anyone else's model.",
  },
  {
    id: "own-cloud",
    category: "Data & privacy",
    q: "Can it run in our own cloud?",
    a: "Yes. We deploy to AWS, Azure or Google Cloud, including your own accounts, and can host open models there when data must not leave your environment. The trade-offs in cost and quality are set out during discovery.",
  },
  {
    id: "confidentiality",
    category: "Data & privacy",
    q: "Will you name us as a client?",
    a: "Not without your written permission. Client work stays confidential by default — which is also why you won't find client logos on this site.",
  },

  // ---------- Pricing & timelines ----------
  {
    id: "pricing",
    category: "Pricing & timelines",
    featured: true,
    q: "How are projects priced?",
    a: "Most work starts with a short discovery phase, followed by a fixed-scope proposal with milestones and acceptance criteria agreed up front. Ongoing improvement and support run on a retainer, and training programmes are priced per cohort.",
  },
  {
    id: "timeline",
    category: "Pricing & timelines",
    q: "How long does a project take?",
    a: "It depends on scope, and the proposal sets out the milestones before work starts. We aim to put a working prototype on your own content in front of real users early, so decisions are based on software rather than slides.",
  },
  {
    id: "start-small",
    category: "Pricing & timelines",
    q: "Can we start small?",
    a: "Yes, and we usually recommend it. A discovery phase or a prototype is a contained first step with a clear deliverable, and you decide whether to continue once you have seen it work on your content.",
  },
  {
    id: "after-launch",
    category: "Pricing & timelines",
    q: "What happens after launch?",
    a: "We monitor quality, cost and usage, ship regular improvements driven by feedback and evaluation results, and offer support plans sized to your term calendar or business cycle. If you prefer to run it yourselves, we hand over with runbooks and training.",
  },
];
