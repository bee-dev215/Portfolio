// ============================================================
//  SERVICE PAGES — extra content for /services/<slug>, keyed by the service slug in company.ts.
//  Copy drafted for review: no client names, results or certifications are claimed here.
// ============================================================

import { ServiceKey } from "./company";

export type ServiceGroup = "Build" | "Data & quality" | "People & learning";

export const serviceGroups: { name: ServiceGroup; desc: string; keys: ServiceKey[] }[] = [
  { name: "Build", desc: "AI products and features, engineered for production.", keys: ["build", "llm", "platform", "voice"] },
  { name: "Data & quality", desc: "The data underneath, and the tests that keep AI honest.", keys: ["analytics", "evaluation"] },
  { name: "People & learning", desc: "Design that fits real classrooms, and skills that stay with your team.", keys: ["design", "academy"] },
];

export interface ServiceDetail {
  intro: string;
  outcomes: string[]; // what the service is designed to achieve (qualitative)
  included: { title: string; items: string[] }[]; // deliverables, in 2–3 groups
  steps: { title: string; desc: string }[]; // how we run it, 4 steps
  roles: { role: string; does: string }[];
  stack: string[]; // stackGroups titles
  solutions: string[]; // solution titles
  related: string[]; // other service slugs
  faqs: { q: string; a: string }[];
}

export const serviceDetails: Record<string, ServiceDetail> = {
  "ai-product-engineering": {
    intro:
      "We take an AI idea for learning from first sketch to software people rely on — web and mobile apps, the APIs behind them, and the evaluation and monitoring that keep the AI behaving once real learners arrive. One team owns the whole path, so nothing is lost between prototype and production.",
    outcomes: [
      "A working prototype in front of real users before the full build is committed",
      "Production software your own engineers can read, run and extend",
      "AI quality that is measured on every release, not assumed",
      "Running costs that are understood and planned for up front",
    ],
    included: [
      { title: "Product", items: ["Discovery brief and success measures", "Clickable prototype on your content", "User-testing sessions with learners and educators"] },
      { title: "Engineering", items: ["Web and mobile apps", "APIs and integrations", "Infrastructure as code in your cloud"] },
      { title: "Quality", items: ["Evaluation set and CI pipeline", "Security and privacy review", "Monitoring dashboards and runbooks"] },
    ],
    steps: [
      { title: "Frame", desc: "Agree who it is for, what success looks like and which risks must be retired first." },
      { title: "Prototype", desc: "Build the core experience end to end on a sample of your real content and test it with users." },
      { title: "Build", desc: "Engineer for production in two-week iterations, each ending with a working demo." },
      { title: "Launch & hand over", desc: "Pilot with a real cohort, then release in stages with documentation and training for your team." },
    ],
    roles: [
      { role: "Product lead", does: "Owns scope, priorities and the success measures." },
      { role: "AI engineer", does: "Designs prompts, retrieval and the evaluation pipeline." },
      { role: "Full-stack engineer", does: "Builds the apps, APIs and integrations." },
      { role: "Product designer", does: "Shapes the interface and runs user testing." },
    ],
    stack: ["Foundation models", "AI frameworks", "Product engineering", "Cloud & MLOps"],
    solutions: ["AI Tutor", "Content Studio", "Knowledge Assistant"],
    related: ["llm-rag-solutions", "ai-evaluation-safety", "learning-experience-design"],
    faqs: [
      { q: "Do we own the code?", a: "Yes. Source code, infrastructure definitions and documentation are yours, delivered into your repositories as the work progresses." },
      { q: "Can you work alongside our engineering team?", a: "Yes. Many projects are mixed teams: we pair with your engineers, follow your conventions and leave them able to run the system without us." },
      { q: "How early do we see something working?", a: "The prototype phase exists for exactly this: a working version of the core experience on your own content, tested with real users before the full build is agreed." },
    ],
  },
  "llm-rag-solutions": {
    intro:
      "Assistants that answer from your own material — curricula, course content, handbooks, policies — and show where each answer came from. We design the retrieval, the guardrails and the permissions together, so the assistant is useful, honest about what it doesn't know, and only shows people what they are allowed to see.",
    outcomes: [
      "Answers grounded in approved content, with citations people can check",
      "Clear behaviour when the assistant does not know, including hand-off to a person",
      "Access that follows your existing roles and permissions",
      "A content team that can see which questions are being asked",
    ],
    included: [
      { title: "Knowledge", items: ["Content audit and ingestion pipeline", "Chunking, indexing and metadata design", "Freshness and re-indexing schedule"] },
      { title: "Assistant", items: ["Chat or in-product assistant", "Citations and source previews", "Guardrails and safe fallbacks"] },
      { title: "Control", items: ["Single sign-on and document-level permissions", "Evaluation set of real questions", "Question and gap analytics"] },
    ],
    steps: [
      { title: "Audit content", desc: "Map the sources, owners, formats and permissions the assistant will draw on." },
      { title: "Design retrieval", desc: "Choose chunking, embeddings and ranking, and test them against real questions." },
      { title: "Add guardrails", desc: "Define scope, tone, refusals and hand-off rules with your subject experts." },
      { title: "Evaluate & launch", desc: "Release behind an evaluation gate, then watch answer quality and content gaps." },
    ],
    roles: [
      { role: "AI engineer", does: "Builds retrieval, prompts and guardrails." },
      { role: "Data engineer", does: "Owns ingestion, indexing and permissions sync." },
      { role: "Evaluation specialist", does: "Writes and maintains the question sets." },
      { role: "Subject-matter partner", does: "From your side: approves content and behaviour." },
    ],
    stack: ["Foundation models", "AI frameworks", "Data & retrieval", "Cloud & MLOps"],
    solutions: ["Knowledge Assistant", "AI Tutor"],
    related: ["ai-evaluation-safety", "ai-product-engineering", "learning-platform-integration"],
    faqs: [
      { q: "What content can it use?", a: "Documents, web pages, course material and structured data are all possible. During the audit we agree which sources are in scope and who owns each one." },
      { q: "What happens when the answer isn't in our content?", a: "The assistant says so rather than guessing, and can point people to a person or a form. Those questions are logged so content owners can fill the gap." },
      { q: "Can different users see different content?", a: "Yes. Permissions are synced from your identity provider or document system, so people only get answers from content they are allowed to read." },
    ],
  },
  "learning-platform-integration": {
    intro:
      "AI features are most useful where learners and educators already work. We connect them to Canvas, Moodle, Blackboard, Google Classroom or your own platform through LTI 1.3 and open standards, and build the data flows so rosters, grades and activity stay in step.",
    outcomes: [
      "AI tools that open inside the learning platform, with single sign-on",
      "Rosters, courses and grades kept in sync without manual exports",
      "Activity data captured in an open format you control",
      "Integrations documented well enough for your team to maintain",
    ],
    included: [
      { title: "Connect", items: ["LTI 1.3 tool registration and launch", "Deep linking and grade pass-back", "Roster sync (OneRoster or platform APIs)"] },
      { title: "Data", items: ["xAPI statements and learning record store", "Data pipelines to your warehouse", "Event and error monitoring"] },
      { title: "Hand-over", items: ["Integration guide for administrators", "Test plans per platform", "Support runbook"] },
    ],
    steps: [
      { title: "Map the landscape", desc: "List the platforms, versions, identity providers and data owners involved." },
      { title: "Design the flows", desc: "Agree what moves where — launches, rosters, grades, activity — and on what schedule." },
      { title: "Build & test", desc: "Implement against sandbox instances and test every launch and data path." },
      { title: "Roll out", desc: "Release course by course or department by department, with administrators trained first." },
    ],
    roles: [
      { role: "Integration engineer", does: "Builds LTI tools, API connectors and data sync." },
      { role: "Data engineer", does: "Designs the learning record store and pipelines." },
      { role: "Solutions architect", does: "Works with your IT team on identity and hosting." },
    ],
    stack: ["Learning standards", "Product engineering", "Data & retrieval", "Cloud & MLOps"],
    solutions: ["AI Tutor", "Assessment Assistant", "Learning Analytics"],
    related: ["learning-analytics-data", "ai-product-engineering", "llm-rag-solutions"],
    faqs: [
      { q: "Which platforms do you work with?", a: "Any platform that supports LTI 1.3 or offers an API — commonly Canvas, Moodle, Blackboard, Brightspace and Google Classroom — as well as custom platforms." },
      { q: "Will it work with our single sign-on?", a: "Yes. We integrate with your identity provider so learners and staff never need a separate login." },
      { q: "Who maintains the integration afterwards?", a: "Your team can, using the guide and test plans we hand over, or we can look after it on a support retainer." },
    ],
  },
  "ai-training-upskilling": {
    intro:
      "Hands-on programmes that take people from AI-curious to AI-capable. Engineering tracks build real skills on your own use cases; educator and staff tracks focus on using AI well and responsibly in everyday work; leadership sessions turn principles into policies you can adopt.",
    outcomes: [
      "Engineers who can build, evaluate and ship AI features themselves",
      "Educators and staff confident about when — and when not — to use AI",
      "A responsible-use policy shaped by the people it applies to",
      "Course materials and recordings your organisation keeps",
    ],
    included: [
      { title: "Programmes", items: ["Engineering bootcamps", "Educator and trainer workshops", "AI literacy for all staff", "Leadership and policy sessions"] },
      { title: "Materials", items: ["Hands-on labs on your use cases", "Slides, guides and recordings", "Skills self-assessment before and after"] },
    ],
    steps: [
      { title: "Assess", desc: "Short survey and interviews to understand current skills, tools and concerns." },
      { title: "Tailor", desc: "Shape tracks and labs around your real work, systems and policies." },
      { title: "Deliver", desc: "Run sessions on site or remotely, as an intensive or a series of short sessions." },
      { title: "Embed", desc: "Follow-up clinics, shared materials and a plan for keeping skills current." },
    ],
    roles: [
      { role: "AI education lead", does: "Designs the programme and leads sessions." },
      { role: "Engineer-instructor", does: "Runs the technical labs and code reviews." },
      { role: "Learning designer", does: "Builds activities, materials and assessments." },
    ],
    stack: ["Foundation models", "AI frameworks", "Product engineering"],
    solutions: ["AI Academy"],
    related: ["learning-experience-design", "ai-evaluation-safety", "ai-product-engineering"],
    faqs: [
      { q: "Do people need technical experience?", a: "Only for the engineering tracks. Educator, staff and leadership sessions assume no technical background." },
      { q: "Can you train on the tools we already use?", a: "Yes. Labs and examples are built around the tools and policies your organisation has approved." },
      { q: "How large can a cohort be?", a: "Workshops work best in groups small enough for hands-on practice; larger audiences can be split into several cohorts. We agree the format during the assessment." },
    ],
  },
  "learning-analytics-data": {
    intro:
      "Learning data is usually scattered across the LMS, the student information system and a handful of apps. We bring it into one trustworthy record of learning, then build the dashboards and explainable models that help educators act while there is still time.",
    outcomes: [
      "One consistent record of learning activity, owned by you",
      "Dashboards each role actually uses, from teacher to leadership",
      "Early-warning signals that explain why a learner was flagged",
      "Data definitions everyone agrees on",
    ],
    included: [
      { title: "Data foundation", items: ["Source mapping and data dictionary", "Pipelines from LMS, SIS and apps", "Learning record store (xAPI)", "Warehouse models (dbt)"] },
      { title: "Insight", items: ["Role-based dashboards", "Explainable risk models with model cards", "Plain-language AI summaries", "Alerting playbook"] },
    ],
    steps: [
      { title: "Map the data", desc: "Inventory sources, owners, quality and privacy constraints." },
      { title: "Build the foundation", desc: "Pipelines and warehouse models with tests on every load." },
      { title: "Design the insight", desc: "Dashboards and models shaped with the people who will act on them." },
      { title: "Operate", desc: "Monitoring, model reviews and a clear process for acting on alerts." },
    ],
    roles: [
      { role: "Data engineer", does: "Builds pipelines, the record store and warehouse models." },
      { role: "Data scientist", does: "Develops and validates explainable models." },
      { role: "Analytics designer", does: "Designs dashboards around real decisions." },
    ],
    stack: ["Data & retrieval", "Learning standards", "AI frameworks", "Cloud & MLOps"],
    solutions: ["Learning Analytics"],
    related: ["learning-platform-integration", "ai-evaluation-safety", "learning-experience-design"],
    faqs: [
      { q: "Where does the data live?", a: "In your own cloud or data warehouse. We build inside your environment so you keep ownership and control of access." },
      { q: "How do you avoid unfair risk flags?", a: "Models are explainable, reviewed for bias across learner groups before release, and every alert links to the evidence behind it so a person makes the final call." },
      { q: "Can we start small?", a: "Yes. Many teams start with one course or department and one question they want answered, then extend the foundation." },
    ],
  },
  "ai-evaluation-safety": {
    intro:
      "Before an AI feature reaches learners, someone should test whether it is accurate, grounded, fair and safe — and keep testing after launch. We build evaluation suites for your use case, run structured red-teaming, and leave you with tests your team can run on every change.",
    outcomes: [
      "A clear, evidence-based picture of how an AI feature behaves",
      "Known failure modes found before learners find them",
      "Automated checks that run on every release",
      "Documentation that supports internal review and procurement",
    ],
    included: [
      { title: "Assessment", items: ["Evaluation set built from real questions", "Accuracy and grounding tests", "Bias review across learner groups", "Safeguarding and red-team exercises"] },
      { title: "Ongoing", items: ["Automated evaluation in CI", "Drift and quality monitoring", "Model cards and review reports"] },
    ],
    steps: [
      { title: "Define good", desc: "Agree with educators what a correct, helpful and safe response looks like." },
      { title: "Build the suite", desc: "Collect real questions, edge cases and adversarial prompts with expected behaviour." },
      { title: "Test & report", desc: "Run the suite, red-team the feature and report findings with recommended fixes." },
      { title: "Automate", desc: "Wire the suite into your release pipeline and monitoring." },
    ],
    roles: [
      { role: "Evaluation specialist", does: "Designs test sets and scoring." },
      { role: "ML engineer", does: "Builds the evaluation harness and automation." },
      { role: "Safeguarding reviewer", does: "Leads red-teaming on sensitive topics." },
    ],
    stack: ["Foundation models", "AI frameworks", "Cloud & MLOps"],
    solutions: ["AI Tutor", "Assessment Assistant", "Knowledge Assistant"],
    related: ["llm-rag-solutions", "ai-product-engineering", "ai-training-upskilling"],
    faqs: [
      { q: "Can you evaluate a system you didn't build?", a: "Yes. We can test any AI feature you can give us access to, whether built in-house or bought from a vendor." },
      { q: "Is this a certification?", a: "No. It is an independent, documented assessment with evidence and recommendations — useful for your own review and procurement processes." },
      { q: "How often should evaluation run?", a: "On every change to prompts, models or content, and on a schedule for systems that depend on external models that can change underneath you." },
    ],
  },
  "speech-voice-ai": {
    intro:
      "Some learning happens out loud. We build speech features for language learning, reading practice and accessibility — accurate transcription, pronunciation feedback and voice tutors — designed for real classrooms, accents and background noise.",
    outcomes: [
      "Speaking practice learners can do on their own, with useful feedback",
      "Lectures and lessons available as accurate, searchable text",
      "Voice interfaces that widen access for learners who need them",
      "Audio handled with clear consent and retention rules",
    ],
    included: [
      { title: "Speech features", items: ["Speech-to-text and captions", "Pronunciation and fluency feedback", "Read-aloud practice", "Voice tutor conversations"] },
      { title: "Quality & care", items: ["Accent and noise testing", "Consent and retention design", "Accessibility review"] },
    ],
    steps: [
      { title: "Listen first", desc: "Collect sample audio from your real learners and settings to test against." },
      { title: "Choose models", desc: "Compare speech models on your audio for accuracy, latency and cost." },
      { title: "Design feedback", desc: "Work with language teachers on feedback that helps rather than discourages." },
      { title: "Pilot", desc: "Trial with a class or cohort and refine on what learners actually say." },
    ],
    roles: [
      { role: "ML engineer", does: "Evaluates and integrates speech models." },
      { role: "Full-stack engineer", does: "Builds recording, playback and real-time features." },
      { role: "Learning designer", does: "Shapes practice activities and feedback." },
    ],
    stack: ["Foundation models", "AI frameworks", "Product engineering"],
    solutions: ["AI Tutor", "Content Studio"],
    related: ["ai-product-engineering", "learning-experience-design", "ai-evaluation-safety"],
    faqs: [
      { q: "Does it work with accents and young voices?", a: "Accuracy varies by model and setting, which is why we test on recordings from your own learners before committing to an approach." },
      { q: "Is audio stored?", a: "Only if there is a reason to, with consent, and for as long as agreed. Many features can process audio without keeping it." },
      { q: "Can it support learners with disabilities?", a: "Yes — captions, read-aloud and voice input are common accessibility features, designed and reviewed with accessibility in mind from the start." },
    ],
  },
  "learning-experience-design": {
    intro:
      "Good AI for learning is as much about design as models. We research how learners and educators actually work, design experiences grounded in learning science, and test them with real people — so the AI helps people learn rather than just finish faster.",
    outcomes: [
      "Experiences shaped by real learners and educators, not assumptions",
      "AI that supports thinking instead of replacing it",
      "Interfaces that are accessible from the first release",
      "A design system your team can keep building on",
    ],
    included: [
      { title: "Research", items: ["Interviews and classroom observation", "Journey maps and opportunity areas", "Usability testing"] },
      { title: "Design", items: ["Learning design for AI-supported activities", "Interface design and prototypes", "Accessibility review", "Design system and guidelines"] },
    ],
    steps: [
      { title: "Research", desc: "Observe and interview learners, educators and administrators in their own setting." },
      { title: "Frame", desc: "Turn findings into principles and the few moments where AI can genuinely help." },
      { title: "Prototype & test", desc: "Design, prototype and test with real users in short cycles." },
      { title: "Specify", desc: "Hand engineering a tested design, a design system and clear guidelines." },
    ],
    roles: [
      { role: "Learning experience designer", does: "Applies learning science to each activity." },
      { role: "UX researcher", does: "Plans and runs research and testing." },
      { role: "Product designer", does: "Designs interfaces and the design system." },
    ],
    stack: ["Product engineering"],
    solutions: ["AI Tutor", "Assessment Assistant", "Content Studio"],
    related: ["ai-product-engineering", "speech-voice-ai", "ai-training-upskilling"],
    faqs: [
      { q: "Can you work with our existing design team?", a: "Yes. We can lead the research and learning design while your designers own the interface, or work as one team." },
      { q: "How do you involve learners safely?", a: "Research with young people follows your safeguarding policies and consent processes, with staff present where required." },
      { q: "Is design only for new products?", a: "No. We often review an existing product and recommend focused improvements to how AI features fit into it." },
    ],
  },
};
