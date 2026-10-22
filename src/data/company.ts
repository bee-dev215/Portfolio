// ============================================================
//  SITE CONTENT — GKT LLC, AI engineering for education.
//  Edit this single file to update the public site
//  (company details, services, solutions, audiences, process, stack, team).
// ============================================================

export const company = {
  name: "GKT",
  legalName: "GKT LLC",
  initials: "GKT",
  entity: "Limited liability company",
  discipline: "AI engineering for education",
  email: "welcome.devs@gmail.com",
  phone: "+1 (480) 271 8467",
  phoneHref: "tel:+14802718467",
  availability: "Booking new projects",
  responseTime: "one business day",
  engagements: "Fixed-scope projects · Retainers · Team training",
  tagline:
    "GKT designs, builds and ships AI for learning — tutors, assessment, analytics and knowledge assistants — for schools, universities and the companies that teach.",
  intro:
    "One team from idea to production: product strategy, AI engineering, learning design, and the training your people need to run it with confidence.",
  about: [
    "GKT is an AI engineering company built around one mission: helping people learn better. We design and build the AI products that sit behind modern learning — tutors that explain instead of answering, feedback that teachers trust, and analytics that spot a struggling learner before the exam does.",
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
//  Services — the four ways we work with clients
// ------------------------------------------------------------

export type ServiceKey = "build" | "llm" | "platform" | "academy";

export interface Service {
  key: ServiceKey;
  title: string;
  desc: string;
  includes: string[];
}

export const services: Service[] = [
  {
    key: "build",
    title: "AI product engineering",
    desc: "Full-stack AI products from first prototype to production — web and mobile apps, APIs, and the evaluation pipelines that keep models honest.",
    includes: ["Rapid prototyping", "Full-stack apps", "Evals & monitoring"],
  },
  {
    key: "llm",
    title: "LLM & RAG solutions",
    desc: "Assistants grounded in your own content — curricula, course material, policies — with citations, guardrails and role-based access.",
    includes: ["Retrieval (RAG)", "Agents & tools", "Guardrails"],
  },
  {
    key: "platform",
    title: "Learning platform integration",
    desc: "AI features inside the systems you already use — Canvas, Moodle, Google Classroom or your own platform — connected through LTI and open standards.",
    includes: ["LTI 1.3", "LMS plugins", "Data pipelines"],
  },
  {
    key: "academy",
    title: "AI training & upskilling",
    desc: "Hands-on courses and workshops that teach your engineers, educators and staff to build with AI and to use it responsibly.",
    includes: ["Engineering bootcamps", "Educator workshops", "AI literacy"],
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
  key: string;
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

// Frequently asked questions (shown above the contact form)
export const faqs = [
  {
    q: "Which AI models do you use?",
    a: "We are model-agnostic. We choose between commercial models such as GPT, Claude and Gemini and open models such as Llama or Mistral for each task, based on quality, cost and privacy — and we can run open models inside your own cloud when data must stay there.",
  },
  {
    q: "How do you protect student and staff data?",
    a: "We collect only the data a feature needs, use enterprise API terms that exclude your data from model training, encrypt data in transit and at rest, and respect your existing permissions. Privacy requirements such as FERPA or GDPR are mapped with your compliance team during discovery.",
  },
  {
    q: "How do you stop the AI from giving wrong answers?",
    a: "Answers are grounded in your approved content and cite their sources. Every release is tested against an evaluation set of real questions, guardrails catch off-topic or unsafe requests, and high-stakes outputs such as grades go to a person for review.",
  },
  {
    q: "Can it work inside our LMS?",
    a: "Yes. We integrate with platforms such as Canvas, Moodle, Blackboard and Google Classroom through LTI 1.3 and open standards like xAPI and OneRoster, so learners and educators use AI where they already work.",
  },
  {
    q: "How are projects priced?",
    a: "Most work starts with a short discovery phase, followed by a fixed-scope proposal with milestones and acceptance criteria agreed up front. Ongoing improvement and support run on a retainer, and training programmes are priced per cohort.",
  },
  {
    q: "Do you train our own team?",
    a: "Yes — it is part of every engagement. We also run standalone AI Academy programmes: engineering bootcamps, educator workshops and AI-literacy sessions for leadership and staff.",
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
//  photo used on the site is listed here and shown at /terms#credits.
// ------------------------------------------------------------

export interface ImageCredit {
  file: string;
  subject: string;
  author: string;
  href: string; // the photo's Freepik page
}

export const imageCredits: ImageCredit[] = [
  { file: "sol-ai-tutor.webp", subject: "AI Tutor — students learning on a laptop", author: "jcomp", href: "https://www.magnific.com/free-photo/two-students-studying-together-online-with-laptop-park_2525704.htm" },
  { file: "sol-assessment.webp", subject: "Assessment Assistant — teacher with a student", author: "Drazen Zigic", href: "https://www.magnific.com/free-photo/happy-black-teacher-schoolgirl-using-digital-tablet-classroom_26609427.htm" },
  { file: "sol-analytics.webp", subject: "Learning Analytics — team reviewing data", author: "DC Studio", href: "https://www.magnific.com/free-photo/business-people-looking-documents-charts-laptop-using-financial-statistics-create-data-analysis-team-workers-planning-economy-presentation-together-doing-work-collaboration_25700886.htm" },
  { file: "sol-content-studio.webp", subject: "Content Studio — learner with laptop and books", author: "Freepik", href: "https://www.magnific.com/free-photo/woman-taking-e-learning-courses_21828975.htm" },
  { file: "sol-knowledge.webp", subject: "Knowledge Assistant — online learning at work", author: "Drazen Zigic", href: "https://www.magnific.com/free-photo/closeup-freelancer-learning-online-while-using-laptop-office_26346338.htm" },
  { file: "sol-academy.webp", subject: "AI Academy — workplace training session", author: "Freepik", href: "https://www.magnific.com/free-photo/medium-shot-colleagues-learning-work_23404621.htm" },
  { file: "aud-schools.webp", subject: "K-12 schools — students in class", author: "pressfoto", href: "https://www.magnific.com/free-photo/students-working-laptop-school_857862.htm" },
  { file: "aud-universities.webp", subject: "Universities — students in a library", author: "garetsvisual", href: "https://www.magnific.com/free-photo/group-young-cheerful-students-joyfully-talking-while-studying-together-library-university_23177325.htm" },
  { file: "aud-edtech.webp", subject: "EdTech — software engineers brainstorming", author: "DC Studio", href: "https://www.magnific.com/free-photo/team-software-engineers-doing-brainstorming-office_417798983.htm" },
  { file: "aud-corporate.webp", subject: "Corporate learning — training workshop", author: "Freepik", href: "https://www.magnific.com/free-photo/medium-shot-people-learning-office_23404611.htm" },
  { file: "company-team.webp", subject: "Company — team planning a project", author: "fabrikasimf", href: "https://www.magnific.com/free-photo/team-diverse-coworkers-modern-office-discuss-their-project-together_21130991.htm" },
  { file: "company-learning.webp", subject: "Company — students with a laptop", author: "Freepik", href: "https://www.magnific.com/free-photo/students-with-laptop-medium-shot_13819167.htm" },
  { file: "cta-backdrop.webp", subject: "Solutions banner — engineers and AI", author: "DC Studio", href: "https://www.magnific.com/free-photo/engineers-brainstorming-ways-use-ai_190325729.htm" },
  { file: "team/martin.webp", subject: "Team portrait — Martin Keller (placeholder)", author: "katemangostar", href: "https://www.magnific.com/free-photo/closeup-happy-middle-aged-business-leader_1304420.htm" },
  { file: "team/kenji.webp", subject: "Team portrait — Kenji Watanabe (placeholder)", author: "DC Studio", href: "https://www.magnific.com/free-photo/portrait-happy-cto-manager-using-pc-startup-office-implement-algorithms_416761681.htm" },
  { file: "team/mei.webp", subject: "Team portrait — Mei Lin Chen (placeholder)", author: "DC Studio", href: "https://www.magnific.com/free-photo/portrait-smiling-asian-software-developer-looking-camera-cloud-computing-development-agency-confident-programer-posing-happy-colleagues-working-big-data-office_26367495.htm" },
  { file: "team/marcus.webp", subject: "Team portrait — Marcus Bello (placeholder)", author: "DC Studio", href: "https://www.magnific.com/free-photo/portrait-african-american-programer-sitting-down-working-laptop-arranging-glasses-looking-up-smiling-camera-system-engineer-using-portable-computer-computing-big-data_25498839.htm" },
  { file: "team/sofia.webp", subject: "Team portrait — Sofia Marín (placeholder)", author: "wayhomestudio", href: "https://www.magnific.com/free-photo/young-woman-wearing-grey-turtleneck-eyeglasses_10228105.htm" },
  { file: "team/hannah.webp", subject: "Team portrait — Hannah Lindqvist (placeholder)", author: "katemangostar", href: "https://www.magnific.com/free-photo/young-businesswoman-portrait-office_993616.htm" },
  { file: "team/amara.webp", subject: "Team portrait — Amara Nwosu (placeholder)", author: "partystock", href: "https://www.magnific.com/free-photo/portrait-woman-business-embrace-confidence-posing-beauty-black-african-american-isolated-gray-background_25767305.htm" },
  { file: "team/owen.webp", subject: "Team portrait — Owen Brady (placeholder)", author: "drobotdean", href: "https://www.magnific.com/free-photo/cheerful-readhead-bearded-man-glasses-white-tshirt-holding-laptop-hands_7339019.htm" },
];

// Suggested categories offered in the admin project form (you can type any category)
export const suggestedCategories = ["Schools & universities", "EdTech", "Corporate learning", "Healthcare education", "Government"];

export const navLinks = [
  { id: "services", label: "Services" },
  { id: "solutions", label: "Solutions" },
  { id: "industries", label: "Who we serve" },
  { id: "process", label: "Process" },
  { id: "team", label: "Team" },
  { id: "contact", label: "Contact" },
];

// Footer site map (every section, including the ones not in the top bar)
export const footerLinks = [
  { id: "services", label: "Services" },
  { id: "solutions", label: "Solutions" },
  { id: "industries", label: "Who we serve" },
  { id: "process", label: "Process" },
  { id: "technology", label: "Technology" },
  { id: "company", label: "Company" },
  { id: "team", label: "Team" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const legalLinks = [
  { to: "/privacy", label: "Privacy policy" },
  { to: "/terms", label: "Terms of use" },
];

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Fired on window to open a solution's details; detail is the solution title. */
export const OPEN_SOLUTION_EVENT = "gkt:open-solution";

/** Opens one solution's details in place (the modal overlays wherever the reader is). */
export const openSolution = (title: string) => {
  window.dispatchEvent(new CustomEvent<string>(OPEN_SOLUTION_EVENT, { detail: title }));
};

/** Fired on window to pre-fill the contact form; detail is the solution of interest, if any. */
export const ENQUIRE_EVENT = "gkt:enquire";

/** Scrolls to the contact form, optionally pre-filling it for a specific solution. */
export const startEnquiry = (topic?: string) => {
  window.dispatchEvent(new CustomEvent<string | undefined>(ENQUIRE_EVENT, { detail: topic }));
  scrollToId("contact");
};
