// ============================================================
//  SITE CONTENT — GSedu International, AI engineering for education.
//  Edit this single file to update the public site
//  (company details, services, solutions, audiences, process, stack, team).
// ============================================================

export const company = {
  name: "GSedu International",
  shortName: "GSedu",
  legalName: "GSedu International LLC",
  initials: "GS",
  entity: "Limited liability company",
  discipline: "AI engineering for education",
  email: "terabyte5050@gmail.com",
  phone: "+1 (480) 271 8467",
  phoneHref: "tel:+14802718467",
  availability: "Booking new projects",
  responseTime: "one business day",
  engagements: "Fixed-scope projects · Retainers · Team training",
  tagline:
    "GSedu International designs, builds and ships AI for learning — tutors, assessment, analytics and knowledge assistants — for schools, universities and the companies that teach.",
  intro:
    "One team from idea to production: product strategy, AI engineering, learning design, and the training your people need to run it with confidence.",
  about: [
    "GSedu International is an AI engineering company built around one mission: helping people learn better. We design and build the AI products that sit behind modern learning — tutors that explain instead of answering, feedback that teachers trust, and analytics that spot a struggling learner before the exam does.",
    "We are model-agnostic and evidence-driven. Every feature is grounded in your own content, tested against evaluation sets before it ships, and measured on learning outcomes afterwards — not just on usage.",
    "And we teach as we build. Engagements end with your engineers, educators and staff able to run, extend and question the system themselves, through hands-on workshops and documentation written for people, not just for machines.",
  ],
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
//  Services — the ways we work with clients
// ------------------------------------------------------------

export type ServiceKey = "build" | "llm" | "platform" | "academy" | "analytics" | "evaluation" | "voice" | "design";

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
    key: "build",
    slug: "ai-product-engineering",
    title: "AI product engineering",
    desc: "Full-stack AI products from first prototype to production — web and mobile apps, APIs, and the evaluation pipelines that keep models honest.",
    includes: ["Rapid prototyping", "Full-stack apps", "Evals & monitoring"],
    image: "/images/svc-build.webp",
  },
  {
    key: "llm",
    slug: "llm-rag-solutions",
    title: "LLM & RAG solutions",
    desc: "Assistants grounded in your own content — curricula, course material, policies — with citations, guardrails and role-based access.",
    includes: ["Retrieval (RAG)", "Agents & tools", "Guardrails"],
    image: "/images/svc-llm.webp",
  },
  {
    key: "platform",
    slug: "learning-platform-integration",
    title: "Learning platform integration",
    desc: "AI features inside the systems you already use — Canvas, Moodle, Google Classroom or your own platform — connected through LTI and open standards.",
    includes: ["LTI 1.3", "LMS plugins", "Data pipelines"],
    image: "/images/svc-platform.webp",
  },
  {
    key: "academy",
    slug: "ai-training-upskilling",
    title: "AI training & upskilling",
    desc: "Hands-on courses and workshops that teach your engineers, educators and staff to build with AI and to use it responsibly.",
    includes: ["Engineering bootcamps", "Educator workshops", "AI literacy"],
    image: "/images/svc-academy.webp",
  },
  {
    key: "analytics",
    slug: "learning-analytics-data",
    title: "Learning analytics & data engineering",
    desc: "One trustworthy record of learning — pipelines from your LMS, SIS and apps into a warehouse, with dashboards and explainable models on top.",
    includes: ["xAPI & LRS", "Data pipelines", "Explainable models"],
    image: "/images/svc-analytics.webp",
  },
  {
    key: "evaluation",
    slug: "ai-evaluation-safety",
    title: "AI evaluation & safety",
    desc: "Independent testing of AI features before and after launch — accuracy, grounding, bias and safeguarding — with evaluation suites your team can keep running.",
    includes: ["Evaluation suites", "Red-teaming", "Bias reviews"],
    image: "/images/svc-evaluation.webp",
  },
  {
    key: "voice",
    slug: "speech-voice-ai",
    title: "Speech & voice AI",
    desc: "Listening, speaking and reading support — transcription, pronunciation feedback and voice tutors — for language learning and accessibility.",
    includes: ["Speech-to-text", "Pronunciation feedback", "Voice tutors"],
    image: "/images/svc-voice.webp",
  },
  {
    key: "design",
    slug: "learning-experience-design",
    title: "Learning experience design",
    desc: "Research-led product and learning design that makes AI genuinely useful in a classroom or a workday — tested with real learners and educators.",
    includes: ["UX research", "Learning design", "Accessibility"],
    image: "/images/svc-design.webp",
  },
];

// ------------------------------------------------------------
//  Technology stack. Each group shows up to 8 tools.
// ------------------------------------------------------------

export const stackGroups = [
  { title: "Foundation models", items: ["OpenAI GPT", "Anthropic Claude", "Google Gemini", "Llama", "Mistral", "Whisper"] },
  { title: "AI frameworks", items: ["LangChain", "LlamaIndex", "Hugging Face", "PyTorch", "vLLM", "MLflow"] },
  { title: "Data & retrieval", items: ["PostgreSQL", "pgvector", "Pinecone", "Elasticsearch", "Redis", "dbt"] },
  { title: "Product engineering", items: ["TypeScript", "React", "Next.js", "Python", "FastAPI", "React Native"] },
  { title: "Learning standards", items: ["LTI 1.3", "xAPI", "SCORM", "QTI", "OneRoster", "Caliper"] },
  { title: "Cloud & MLOps", items: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform"] },
];

// Capabilities scrolling under the hero
export const ticker = [
  "AI tutors",
  "Retrieval-augmented generation",
  "LLM evaluation",
  "Learning analytics",
  "Adaptive learning",
  "LTI 1.3",
  "Content generation",
  "Speech & voice",
  "AI agents",
  "Responsible AI",
  "MLOps",
  "Educator copilots",
];

// ------------------------------------------------------------
//  Solutions — packaged starting points we adapt per client.
//  Images live in public/images/ (16:10).
// ------------------------------------------------------------

export interface Solution {
  id: number;
  slug: string; // URL: /solutions/<slug>
  title: string;
  category: string; // audience, used by the filter
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
    slug: "ai-tutor",
    title: "AI Tutor",
    category: "Schools & universities",
    domain: "Conversational learning · Socratic tutoring",
    summary: "A patient, always-on tutor grounded in your course material — it gives hints and asks questions instead of handing out answers.",
    description:
      "AI Tutor is a conversational learning assistant built on your own curriculum. It explains concepts step by step, adapts to each learner's level, and is designed to guide rather than to do the work for them. Teachers choose the subjects and the rules, see which topics students struggle with, and can review conversations. It runs inside your LMS through LTI or as a standalone app.",
    capabilities: [
      "Step-by-step explanations grounded in your course content, with sources",
      "Hint-first mode that guides learners instead of giving answers away",
      "Teacher controls for subjects, tone and academic-integrity rules",
      "Topic insights showing where a class is getting stuck",
    ],
    tech: ["Claude / GPT", "LangChain", "pgvector", "FastAPI", "React", "LTI 1.3"],
    deliverables: ["Tutor web app & LMS plugin", "Curriculum knowledge base", "Teacher dashboard", "Evaluation suite"],
    image: "/images/sol-ai-tutor.webp",
  },
  {
    id: 2,
    slug: "assessment-assistant",
    title: "Assessment Assistant",
    category: "Schools & universities",
    domain: "Feedback · Rubrics · Question generation",
    summary: "Rubric-aligned feedback drafts that teachers review and approve, so every learner gets detailed feedback in a fraction of the time.",
    description:
      "Assessment Assistant drafts feedback on written work against your own rubrics and examples, highlights where an answer meets or misses each criterion, and suggests next steps for the learner. The teacher stays in charge: nothing reaches a student until it has been reviewed. It also generates question banks and practice quizzes aligned to your learning objectives.",
    capabilities: [
      "Rubric-aligned feedback drafts with evidence quoted from the work",
      "Teacher review and edit before anything is released",
      "Question and quiz generation mapped to learning objectives",
      "Consistency checks across markers and sections",
    ],
    tech: ["Claude / GPT", "Python", "FastAPI", "PostgreSQL", "React", "QTI"],
    deliverables: ["Feedback workflow app", "Rubric & exemplar library", "Question-bank generator", "Calibration report"],
    image: "/images/sol-assessment.webp",
  },
  {
    id: 3,
    slug: "learning-analytics",
    title: "Learning Analytics",
    category: "EdTech",
    domain: "Data · Early warning · Insight",
    summary: "Dashboards and early-warning models that show who is falling behind, why, and what to do next — while there is still time to act.",
    description:
      "Learning Analytics brings activity, assessment and engagement data together into one learning record store, then turns it into insight: progress dashboards for teachers and managers, early-warning signals for learners at risk, and plain-language summaries generated from the data. Models are explainable, and every alert links to the evidence behind it.",
    capabilities: [
      "Unified learning record store fed by xAPI, LMS and SIS data",
      "Early-warning models for learners at risk, with explanations",
      "Role-based dashboards for teachers, advisers and leadership",
      "AI-written weekly summaries in plain language",
    ],
    tech: ["Python", "dbt", "PostgreSQL", "xAPI", "PyTorch", "React"],
    deliverables: ["Data pipeline & warehouse", "Risk models & model cards", "Dashboards", "Alerting playbook"],
    image: "/images/sol-analytics.webp",
  },
  {
    id: 4,
    slug: "content-studio",
    title: "Content Studio",
    category: "EdTech",
    domain: "Course creation · Localisation",
    summary: "An AI workspace that turns outlines and source material into lessons, quizzes and translations — reviewed by your subject experts.",
    description:
      "Content Studio speeds up course production without lowering the bar. Authors start from an outline or existing material, and the studio drafts lessons, examples, assessments and summaries in your house style, aligned to the standards you choose. Every draft moves through a review workflow with subject-matter experts, and approved content can be translated and published to your platform.",
    capabilities: [
      "Lesson, quiz and summary drafts from outlines or source documents",
      "House-style and standards alignment built into every prompt",
      "Expert review workflow with version history",
      "Translation and localisation for multilingual courses",
    ],
    tech: ["Claude / GPT", "Next.js", "TypeScript", "PostgreSQL", "SCORM", "AWS"],
    deliverables: ["Authoring web app", "Style & standards guides", "Review workflow", "Publishing connectors"],
    image: "/images/sol-content-studio.webp",
  },
  {
    id: 5,
    slug: "knowledge-assistant",
    title: "Knowledge Assistant",
    category: "Corporate learning",
    domain: "RAG · Policies · Onboarding",
    summary: "An assistant that answers staff questions from your handbooks, policies and training material — always with a link to the source.",
    description:
      "Knowledge Assistant gives employees and students instant, cited answers from the documents your organisation already has: handbooks, policies, course catalogues and training guides. It respects existing permissions through single sign-on, says so when it does not know, and shows content owners which questions are being asked so gaps can be filled.",
    capabilities: [
      "Cited answers from handbooks, policies and training material",
      "Single sign-on and document-level permissions",
      "Honest fallbacks and hand-off to a human when unsure",
      "Question analytics that reveal gaps in your content",
    ],
    tech: ["LlamaIndex", "Elasticsearch", "pgvector", "FastAPI", "React", "Azure"],
    deliverables: ["Assistant web & chat app", "Ingestion pipeline", "Admin console", "Evaluation set"],
    image: "/images/sol-knowledge.webp",
  },
  {
    id: 6,
    slug: "ai-academy",
    title: "AI Academy",
    category: "Corporate learning",
    domain: "Training · Upskilling · AI literacy",
    summary: "Hands-on programmes that take your team from AI-curious to AI-capable — for engineers, educators and everyone in between.",
    description:
      "AI Academy is our training practice. Engineering tracks cover prompt design, retrieval, agents, evaluation and deployment through labs on your own use cases. Educator and staff tracks focus on using AI well and responsibly in daily work, with practical policies you can adopt. Programmes run on site or remotely, as intensive bootcamps or as a series of short sessions.",
    capabilities: [
      "Engineering bootcamps with labs built on your real use cases",
      "Workshops for educators, trainers and support staff",
      "Responsible-use and AI-policy sessions for leadership",
      "Course material and recordings your team keeps",
    ],
    tech: ["Python", "LangChain", "OpenAI GPT", "Anthropic Claude", "Jupyter", "GitHub"],
    deliverables: ["Training curriculum", "Hands-on labs", "Course materials", "Skills assessment"],
    image: "/images/sol-academy.webp",
  },
];

// ------------------------------------------------------------
//  Audiences — who we build for. Images live in public/images/ (4:5 crops).
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
    key: "schools",
    title: "K-12 schools",
    focus: "Districts · Teachers · Students",
    desc: "Safe, curriculum-aligned AI that gives teachers time back and gives every student a patient guide.",
    work: ["Tutoring & homework help", "Feedback drafting", "Parent communication"],
    solutions: ["AI Tutor", "Assessment Assistant"],
    image: "/images/aud-schools.webp",
    imageAlt: "Students working together on laptops in a classroom",
  },
  {
    key: "universities",
    title: "Universities & colleges",
    focus: "Faculty · Advisers · Learners",
    desc: "AI across teaching, advising and student services — integrated with your LMS and your data.",
    work: ["Course assistants", "Early-warning analytics", "Student-services chat"],
    solutions: ["AI Tutor", "Learning Analytics", "Knowledge Assistant"],
    image: "/images/aud-universities.webp",
    imageAlt: "University students studying together",
  },
  {
    key: "edtech",
    title: "EdTech companies",
    focus: "Product · Content · Data",
    desc: "An experienced AI engineering team that ships new features into your product without slowing your roadmap.",
    work: ["AI feature development", "Content generation", "Evaluation pipelines"],
    solutions: ["Content Studio", "Learning Analytics"],
    image: "/images/aud-edtech.webp",
    imageAlt: "A software team reviewing a product on screen",
  },
  {
    key: "corporate",
    title: "Corporate learning",
    focus: "L&D · Onboarding · Upskilling",
    desc: "Faster onboarding, answers on demand and AI skills for every team, measured against business goals.",
    work: ["Knowledge assistants", "Onboarding copilots", "AI upskilling programmes"],
    solutions: ["Knowledge Assistant", "AI Academy"],
    image: "/images/aud-corporate.webp",
    imageAlt: "Colleagues in a corporate training workshop",
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
    title: "Goals, learners & data",
    summary: "We start with the learning problem, not the model: who the learners are, what success looks like, and what data and policies apply.",
    activities: [
      "Interviews: We talk to learners, educators and administrators to understand the real workflow.",
      "Success metrics: Learning and business outcomes agreed up front, so we can measure what matters.",
      "Data & policy review: Content, data sources, privacy requirements and AI-use policies mapped together with your team.",
      "Proposal: A fixed-scope plan with milestones, acceptance criteria and known risks.",
    ],
    outputs: ["Discovery brief", "Success metrics", "Fixed-scope proposal"],
    image: "/images/phase-discover.webp",
  },
  {
    id: 2,
    name: "Prototype",
    title: "Working demo in weeks",
    summary: "A clickable, working prototype on your own content, put in front of real users early — before anyone commits to the full build.",
    activities: [
      "Prototype: The core experience built end to end on a sample of your real content.",
      "User testing: Sessions with learners and educators to see what helps and what confuses.",
      "Evaluation set: The first set of test questions and expected behaviours, used from here on.",
    ],
    outputs: ["Working prototype", "User-testing notes", "Evaluation set v1"],
    image: "/images/phase-prototype.webp",
  },
  {
    id: 3,
    name: "Build",
    title: "Production engineering",
    summary: "Secure, scalable software built in short iterations, with automated evaluations running on every change.",
    activities: [
      "Architecture: Model-agnostic design with clear interfaces to your LMS, SIS and identity provider.",
      "Engineering: Features delivered in two-week iterations with a demo at the end of each.",
      "Quality: Automated tests and model evaluations on every release, plus safety and bias reviews.",
    ],
    outputs: ["Source code", "CI & eval pipeline", "Security review"],
    image: "/images/phase-build.webp",
  },
  {
    id: 4,
    name: "Launch",
    title: "Pilot, training & rollout",
    summary: "A measured pilot with a real cohort, the training your people need, and a rollout plan based on what the pilot shows.",
    activities: [
      "Pilot: A time-boxed pilot with a real class, cohort or team, against the agreed metrics.",
      "Training: Workshops for administrators, educators and support staff.",
      "Rollout: Staged release with monitoring, documentation and a support handover.",
    ],
    outputs: ["Pilot report", "Training sessions", "Runbooks"],
    image: "/images/phase-launch.webp",
  },
  {
    id: 5,
    name: "Improve",
    title: "Measure & iterate",
    summary: "Launch is the start. We watch quality and learning outcomes, and keep improving the system for as long as you run it.",
    activities: [
      "Monitoring: Quality, cost and usage dashboards with alerts when answers drift.",
      "Iteration: Regular releases driven by feedback and evaluation results.",
      "Support: Support plans sized to your term calendar or business cycle.",
    ],
    outputs: ["Support plan", "Release notes", "Outcome reports"],
    image: "/images/phase-improve.webp",
  },
];

// ------------------------------------------------------------
//  Company
// ------------------------------------------------------------

export const principles = [
  {
    title: "Learners first",
    desc: "Every feature starts from a learner's or educator's real need. If it doesn't help someone learn or teach better, we don't build it.",
  },
  {
    title: "Responsible by design",
    desc: "Privacy, safety and fairness are part of the design from day one — planned with your compliance and safeguarding teams, never bolted on later.",
  },
  {
    title: "Evidence over hype",
    desc: "We evaluate models before they ship and measure outcomes after. Claims about AI should be tested, not assumed.",
  },
  {
    title: "Teach as we build",
    desc: "We hand over knowledge, not just code — so your team can run, extend and challenge the system without us.",
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
    bio: "Leads strategy and client partnerships, and makes sure every project starts from a real learning problem.",
    photo: "/images/team/martin.webp",
    focus: ["Strategy", "EdTech", "Partnerships"],
  },
  {
    name: "Kenji Watanabe",
    role: "CTO · Head of AI engineering",
    bio: "Owns the architecture and engineering standards, from retrieval pipelines to production infrastructure.",
    photo: "/images/team/kenji.webp",
    focus: ["LLM systems", "Architecture", "MLOps"],
  },
  {
    name: "Mei Lin Chen",
    role: "Lead ML engineer",
    bio: "Builds and evaluates the models behind our tutors and assistants, with a focus on grounding and safety.",
    photo: "/images/team/mei.webp",
    focus: ["RAG", "Evaluation", "PyTorch"],
  },
  {
    name: "Marcus Bello",
    role: "Senior full-stack engineer",
    bio: "Turns prototypes into fast, accessible products and connects them to the platforms schools already use.",
    photo: "/images/team/marcus.webp",
    focus: ["React", "FastAPI", "LTI 1.3"],
  },
  {
    name: "Sofia Marín",
    role: "Learning experience designer",
    bio: "Designs how learners and teachers work with AI, grounded in learning science and plenty of user testing.",
    photo: "/images/team/sofia.webp",
    focus: ["Learning design", "UX research", "Accessibility"],
  },
  {
    name: "Hannah Lindqvist",
    role: "Data scientist · Learning analytics",
    bio: "Builds the analytics and early-warning models that help educators act sooner.",
    photo: "/images/team/hannah.webp",
    focus: ["Analytics", "xAPI", "Modelling"],
  },
  {
    name: "Amara Nwosu",
    role: "AI education lead",
    bio: "Runs the AI Academy — engineering bootcamps, educator workshops and AI-literacy programmes.",
    photo: "/images/team/amara.webp",
    focus: ["Training", "Curriculum", "AI literacy"],
  },
  {
    name: "Owen Brady",
    role: "Product designer",
    bio: "Shapes interfaces that make complex AI feel simple, from first sketch to design system.",
    photo: "/images/team/owen.webp",
    focus: ["Product design", "Design systems", "Prototyping"],
  },
];

// Shown beside the contact form
export const nextSteps = [
  { title: "Reply from an expert", desc: `An AI engineer reads your message and replies within ${company.responseTime}.` },
  { title: "Discovery call", desc: "A short call about your learners, your content and your goals." },
  { title: "Proposal", desc: "A fixed-scope proposal with milestones and acceptance criteria." },
];

export const companyFile = [
  { k: "Legal name", v: company.legalName },
  { k: "Entity", v: company.entity },
  { k: "Focus", v: company.discipline },
  { k: "Engagements", v: company.engagements },
];

export const stats = [
  { value: String(solutions.length), label: "Solution blueprints ready to adapt" },
  { value: String(industries.length), label: "Learning audiences we build for" },
  { value: String(phases.length), label: "Delivery phases, discovery to support" },
  { value: String(stackGroups.reduce((n, g) => n + g.items.length, 0)), label: "Tools across the AI stack" },
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
  { file: "sol-ai-tutor.webp", subject: "AI Tutor — a student learning online with headphones", author: "Karola G", href: "https://www.pexels.com/photo/teenage-boy-in-headphones-working-on-computer-6345307/", source: "Pexels" },
  { file: "sol-assessment.webp", subject: "Assessment Assistant — a teacher marking work in class", author: "RDNE Stock project", href: "https://www.pexels.com/photo/a-woman-in-green-long-sleeve-shirt-sitting-at-the-table-holding-a-pencil-on-paper-8363162/", source: "Pexels" },
  { file: "sol-analytics.webp", subject: "Learning Analytics — a team reviewing a dashboard", author: "Muhammad Jawadur Rahman", href: "https://www.pexels.com/photo/brainstorming-during-presentation-15096572/", source: "Pexels" },
  { file: "sol-content-studio.webp", subject: "Content Studio — a creator recording a lesson", author: "Alena Darmel", href: "https://www.pexels.com/photo/woman-in-white-long-sleeve-shirt-wearing-black-framed-eyeglasses-holding-white-notepad-9040531/", source: "Pexels" },
  { file: "sol-knowledge.webp", subject: "Knowledge Assistant — colleagues reviewing work on screen", author: "Apunto Group", href: "https://www.pexels.com/photo/focused-colleagues-working-on-project-in-office-7752873/", source: "Pexels" },
  { file: "sol-academy.webp", subject: "AI Academy — a workshop on AI and data", author: "Mikael Blomkvist", href: "https://www.pexels.com/photo/a-woman-in-red-long-sleeve-shirt-6476783/", source: "Pexels" },
  { file: "aud-schools.webp", subject: "K-12 schools — students in class", author: "pressfoto", href: "https://www.magnific.com/free-photo/students-working-laptop-school_857862.htm" },
  { file: "aud-universities.webp", subject: "Universities — students in a library", author: "garetsvisual", href: "https://www.magnific.com/free-photo/group-young-cheerful-students-joyfully-talking-while-studying-together-library-university_23177325.htm" },
  { file: "aud-edtech.webp", subject: "EdTech — software engineers brainstorming", author: "DC Studio", href: "https://www.magnific.com/free-photo/team-software-engineers-doing-brainstorming-office_417798983.htm" },
  { file: "aud-corporate.webp", subject: "Corporate learning — training workshop", author: "Freepik", href: "https://www.magnific.com/free-photo/medium-shot-people-learning-office_23404611.htm" },
  { file: "company-team.webp", subject: "Company — team mapping ideas on a whiteboard", author: "Thirdman", href: "https://www.pexels.com/photo/colleagues-planning-a-business-5257576/", source: "Pexels" },
  { file: "company-learning.webp", subject: "Company — student joining an online class", author: "Julia M Cameron", href: "https://www.pexels.com/photo/4145153/", source: "Pexels" },
  { file: "cta-backdrop.webp", subject: "Solutions banner — engineers and AI", author: "DC Studio", href: "https://www.magnific.com/free-photo/engineers-brainstorming-ways-use-ai_190325729.htm" },
  { file: "svc-build.webp", subject: "AI product engineering — two engineers building together at a monitor", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/young-professionals-working-with-computers-7988745/", source: "Pexels" },
  { file: "svc-llm.webp", subject: "LLM & RAG — chat prompt to a language model (Visualising AI artwork by Wes Cockx)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-illustration-depicts-language-models-which-generate-text-it-was-created-by-wes-cockx-as-part-of-the-visualising-ai-project-l-18069695/", source: "Pexels" },
  { file: "svc-platform.webp", subject: "Learning platform integration — student following an online lesson on a laptop", author: "Annushka Ahuja", href: "https://www.pexels.com/photo/a-girl-attending-an-online-class-8055848/", source: "Pexels" },
  { file: "svc-academy.webp", subject: "AI training & upskilling — instructor-led workshop with adults on laptops", author: "Luis Sevilla", href: "https://www.pexels.com/photo/business-meeting-presentation-in-modern-office-34221175/", source: "Pexels" },
  { file: "svc-analytics.webp", subject: "Learning analytics & data — analyst reviewing dashboards on two monitors", author: "Kampus Production", href: "https://www.pexels.com/photo/woman-in-yellow-long-sleeve-shirt-looking-at-computer-data-8204355/", source: "Pexels" },
  { file: "svc-evaluation.webp", subject: "AI evaluation & safety — engineer carefully reviewing code", author: "Naboth Otieno", href: "https://www.pexels.com/photo/man-working-with-computers-19805877/", source: "Pexels" },
  { file: "svc-voice.webp", subject: "Speech & voice AI — woman speaking into a studio microphone with headphones", author: "Karola G", href: "https://www.pexels.com/photo/a-woman-talking-on-a-microphone-6920078/", source: "Pexels" },
  { file: "svc-design.webp", subject: "Learning experience design — designer walking through paper wireframes", author: "Christina Morillo", href: "https://www.pexels.com/photo/photo-of-woman-pointing-on-white-paper-1181487/", source: "Pexels" },
  { file: "tech-datacenter.webp", subject: "Data centre — aisle of server racks", author: "Brett Sayles", href: "https://www.pexels.com/photo/server-racks-on-data-center-4508751/", source: "Pexels" },
  { file: "tech-code.webp", subject: "Code on screen — developer at a dual-monitor standing desk", author: "Christina Morillo", href: "https://www.pexels.com/photo/woman-sitting-in-front-laptop-1181677/", source: "Pexels" },
  { file: "tech-ai-abstract.webp", subject: "Abstract AI visual — iridescent glass shapes (Visualising AI artwork by Wes Cockx)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-image-visualises-artificial-general-intelligence-or-agi-it-was-created-by-wes-cockx-as-part-of-the-visualising-ai-project-l-17486102/", source: "Pexels" },
  { file: "hero-ai.webp", subject: "Abstract AI tile — blue and violet data blocks (Visualising AI artwork by Rose Pilkington)", author: "Google DeepMind", href: "https://www.pexels.com/photo/an-artist-s-illustration-of-artificial-intelligence-ai-this-image-visualises-the-input-and-output-of-neural-networks-and-how-ai-systems-perceive-data-it-was-created-by-rose-pilkington-17485706/", source: "Pexels" },
  { file: "proj-socratic-math-coach.webp", subject: "Socratic Math Coach — middle-school student working on a laptop in class", author: "RDNE Stock project", href: "https://www.pexels.com/photo/a-young-girl-typing-on-her-laptop-while-sitting-on-the-chair-inside-the-classroom-8499501/", source: "Pexels" },
  { file: "proj-socratic-math-coach-2.webp", subject: "Socratic Math Coach — teacher checking in on students using laptops", author: "Mikhail Nilov", href: "https://www.pexels.com/photo/a-man-in-blazer-looking-at-the-students-work-9159042/", source: "Pexels" },
  { file: "proj-essay-feedback-copilot.webp", subject: "Essay Feedback Copilot — teacher reviewing student work with a red pen", author: "Andy Barbour", href: "https://www.pexels.com/photo/a-man-looking-at-the-test-paper-6684374/", source: "Pexels" },
  { file: "proj-essay-feedback-copilot-2.webp", subject: "Essay Feedback Copilot — student writing a draft by hand", author: "cottonbro studio", href: "https://www.pexels.com/photo/man-in-blue-plaid-button-up-t-shirt-writing-on-bond-paper-6209589/", source: "Pexels" },
  { file: "proj-student-success-signals.webp", subject: "Student Success Signals — adviser meeting one-to-one with a student", author: "Kampus Production", href: "https://www.pexels.com/photo/young-black-guy-using-laptop-during-exam-preparation-with-female-tutor-in-library-5940703/", source: "Pexels" },
  { file: "proj-student-success-signals-2.webp", subject: "Student Success Signals — reviewing an analytics dashboard", author: "RDNE Stock project", href: "https://www.pexels.com/photo/person-using-black-laptop-on-table-7948012/", source: "Pexels" },
  { file: "proj-course-companion.webp", subject: "Course Companion — university lecture with students on laptops", author: "Yan Krukau", href: "https://www.pexels.com/photo/students-during-lecture-8199151/", source: "Pexels" },
  { file: "proj-course-companion-2.webp", subject: "Course Companion — student writing code on a laptop", author: "Christina Morillo", href: "https://www.pexels.com/photo/woman-using-macbook-pro-1181278/", source: "Pexels" },
  { file: "proj-voice-speaking-tutor.webp", subject: "Voice Speaking Tutor — learner speaking into a phone with earbuds", author: "Roberto Hund", href: "https://www.pexels.com/photo/woman-talking-on-the-phone-5357603/", source: "Pexels" },
  { file: "proj-voice-speaking-tutor-2.webp", subject: "Voice Speaking Tutor — learner on a video lesson with a headset", author: "Ron Lach", href: "https://www.pexels.com/photo/a-woman-engaged-in-a-video-call-using-a-laptop-8681891/", source: "Pexels" },
  { file: "proj-multilingual-course-studio.webp", subject: "Multilingual Course Studio — instructor recording a video lesson", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/creative-fashion-designer-filming-tutorial-36731347/", source: "Pexels" },
  { file: "proj-multilingual-course-studio-2.webp", subject: "Multilingual Course Studio — team reviewing content together on screen", author: "Kindel Media", href: "https://www.pexels.com/photo/people-working-together-on-the-table-7651829/", source: "Pexels" },
  { file: "proj-clinical-onboarding-assistant.webp", subject: "Clinical Onboarding Assistant — nursing staff in a hands-on training session", author: "Sahil Singh", href: "https://www.pexels.com/photo/medical-training-session-with-healthcare-professionals-35645519/", source: "Pexels" },
  { file: "proj-clinical-onboarding-assistant-2.webp", subject: "Clinical Onboarding Assistant — healthcare workers using a laptop and tablet", author: "Thirdman", href: "https://www.pexels.com/photo/healthcare-professionals-working-on-their-gadgets-while-sitting-next-to-each-other-5327654/", source: "Pexels" },
  { file: "proj-ai-ready-educators.webp", subject: "AI-Ready Educators — adults in a professional-development workshop with laptops", author: "Beniam", href: "https://www.pexels.com/photo/diverse-team-engaged-in-business-training-workshop-34046709/", source: "Pexels" },
  { file: "proj-ai-ready-educators-2.webp", subject: "AI-Ready Educators — facilitator presenting to a group of adults", author: "fauxels", href: "https://www.pexels.com/photo/man-wearing-gray-dress-shirt-and-blue-jeans-3184317/", source: "Pexels" },
  { file: "proj-tutor-safety-evaluation.webp", subject: "Tutor Safety Evaluation — engineers reviewing results together at a monitor", author: "Tiger Lily", href: "https://www.pexels.com/photo/colleagues-looking-at-the-screen-7109095/", source: "Pexels" },
  { file: "proj-tutor-safety-evaluation-2.webp", subject: "Tutor Safety Evaluation — team mapping findings on a glass wall", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/collaborative-office-team-brainstorming-39204849/", source: "Pexels" },
  { file: "about-pairing.webp", subject: "About — engineers pair-programming", author: "Diva Plavalaguna", href: "https://www.pexels.com/photo/men-looking-at-the-screen-of-a-laptop-6147360/", source: "Pexels" },
  { file: "about-research.webp", subject: "About — user research with an educator", author: "Yan Krukau", href: "https://www.pexels.com/photo/women-sitting-at-the-meeting-table-with-laptop-and-digital-tablet-8837735/", source: "Pexels" },
  { file: "about-remote.webp", subject: "About — hybrid team meeting on video call", author: "MART PRODUCTION", href: "https://www.pexels.com/photo/a-group-of-people-in-a-meeting-using-video-call-7644076/", source: "Pexels" },
  { file: "about-office.webp", subject: "About — bright, plant-filled studio", author: "Thirdman", href: "https://www.pexels.com/photo/man-and-woman-having-a-conversation-7653773/", source: "Pexels" },
  { file: "phase-discover.webp", subject: "Delivery phase — Discover", author: "fauxels", href: "https://www.pexels.com/photo/group-of-people-gathered-around-wooden-table-3184360/", source: "Pexels" },
  { file: "phase-prototype.webp", subject: "Delivery phase — Prototype", author: "Akshar Dave🌻", href: "https://www.pexels.com/photo/a-person-holding-black-smartphone-11780441/", source: "Pexels" },
  { file: "phase-build.webp", subject: "Delivery phase — Build", author: "ThisIsEngineering", href: "https://www.pexels.com/photo/woman-coding-on-computer-3861958/", source: "Pexels" },
  { file: "phase-launch.webp", subject: "Delivery phase — Launch (classroom pilot)", author: "Max Fischer", href: "https://www.pexels.com/photo/a-two-girls-using-laptop-with-classmates-5212695/", source: "Pexels" },
  { file: "phase-improve.webp", subject: "Delivery phase — Improve (reviewing metrics)", author: "Vitaly Gariev", href: "https://www.pexels.com/photo/creative-team-meeting-analyzing-business-growth-39190577/", source: "Pexels" },
  { file: "trust-classroom.webp", subject: "Responsible AI — teacher with young students using tablets", author: "Arthur Krijgsman", href: "https://www.pexels.com/photo/children-sitting-on-brown-chairs-inside-the-classroom-4019754/", source: "Pexels" },
  { file: "hero-student.webp", subject: "Hero tile — student learning on a laptop", author: "Zen Chung", href: "https://www.pexels.com/photo/happy-young-asian-student-doing-homework-and-listening-to-music-with-earphones-5538618/", source: "Pexels" },
  { file: "about-celebrate.webp", subject: "About — team celebrating a launch", author: "Andrea Piacquadio", href: "https://www.pexels.com/photo/smiling-diverse-employees-of-different-ages-using-laptop-and-cooperating-on-project-in-office-3866342/", source: "Pexels" },
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
//  Top-bar menus. Solutions, Services and Who we serve list the data above;
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
  { key: "about", label: "About", desc: "Who we are, what we stand for and how the company is organised.", to: "/about", image: "/images/about-office.webp" },
  { key: "approach", label: "How we work", desc: "Five phases and three ways to engage, from discovery to long-term support.", to: "/approach", image: "/images/phase-discover.webp" },
  { key: "technology", label: "Technology", desc: "The models, frameworks and learning standards we build with — and how we choose.", to: "/technology", image: "/images/tech-ai-abstract.webp" },
  { key: "team", label: "Team", desc: "The engineers and educators who design and build it.", to: "/team" },
  { key: "responsible", label: "Responsible AI", desc: "How we protect learners, data and client confidentiality.", to: "/responsible-ai", image: "/images/trust-classroom.webp" },
  { key: "contact", label: "Contact", desc: `Tell us about your learners — we reply within ${company.responseTime}.`, to: "/contact" },
];

// Home page sections, in order (the navbar highlights the menu that covers the one in view)
export const homeSections = ["services", "solutions", "projects", "industries", "outcomes", "process", "technology", "company", "team", "faq", "contact"];

// Every page, for the footer site map
export const sitePages = [
  { to: "/solutions", label: "Solutions" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Who we serve" },
  { to: "/approach", label: "How we work" },
  { to: "/technology", label: "Technology" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/responsible-ai", label: "Responsible AI" },
  { to: "/faq", label: "Questions" },
  { to: "/contact", label: "Contact" },
];

// Page URLs, so every link to a solution, service or audience agrees
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
export const OPEN_SOLUTION_EVENT = "gsedu:open-solution";

export const openSolution = (title: string) => {
  const handled = !window.dispatchEvent(new CustomEvent<string>(OPEN_SOLUTION_EVENT, { detail: title, cancelable: true }));
  const s = solutions.find((x) => x.title === title);
  if (!handled && s) go(solutionPath(s));
};

/**
 * Fired on window to pre-fill the contact form; detail is the topic of interest, if any.
 * A contact form on the page handles it (preventDefault) and is scrolled to; otherwise /contact opens, pre-filled.
 */
export const ENQUIRE_EVENT = "gsedu:enquire";

export const startEnquiry = (topic?: string) => {
  const handled = !window.dispatchEvent(new CustomEvent<string | undefined>(ENQUIRE_EVENT, { detail: topic, cancelable: true }));
  if (handled) scrollToId("contact");
  else go(topic ? `/contact?topic=${encodeURIComponent(topic)}` : "/contact");
};
