// ============================================================
//  PORTFOLIO CONTENT — sourced from the résumé (Jackson Moore.pdf).
//  Edit this single file to update the public site
//  (profile, experience, projects and credentials).
// ============================================================

export const profile = {
  name: "Jackson Moore",
  firstName: "Jackson",
  initials: "JM",
  // Paste an image URL here to show a portrait in the hero
  avatar: "",
  title: "Senior Full-Stack Engineer",
  focus: "Angular · React · Next.js · TypeScript",
  email: "welcome.devs@gmail.com",
  phone: "+1 (480) 271 8467",
  phoneHref: "tel:+14802718467",
  availability: "Open to new opportunities",
  yearsExperience: "8+",
  tagline:
    "I build fast, intuitive and scalable web applications — from considered interfaces and clean frontend architecture to the APIs and data layers behind them.",
  bio: [
    "I'm Jackson, a senior full-stack engineer with a frontend heart. I specialise in crafting intuitive user interfaces and scalable architectures with Angular, TypeScript and RxJS, and I'm just as comfortable in React, Next.js, Node.js and PostgreSQL. Today I'm at Timeline International AG in Switzerland, making the company's education app work beautifully for students and teachers.",
    "My approach combines creativity with engineering discipline — from designing seamless user experiences to implementing advanced data handling and automation that streamlines business processes. I'm analytical, collaborative, and equally happy leading a project independently or working inside a dynamic team.",
    "I stay current with the frontend ecosystem and enjoy exploring emerging technologies that improve web performance and developer productivity. Away from the keyboard you'll find me at the table-tennis table, the foosball table, or over a chessboard.",
  ],
  interests: ["Table tennis", "Foosball", "Chess"],
  resumeUrl: "/Jackson_Moore_Resume.pdf",
  resumeUpdated: "Updated October 2026",
};

export type SocialKey = "email" | "phone";

export interface SocialLink {
  key: SocialKey;
  label: string;
  handle: string;
  href: string;
}

export const socials: SocialLink[] = [
  { key: "email", label: "Email", handle: profile.email, href: `mailto:${profile.email}` },
  { key: "phone", label: "Phone", handle: profile.phone, href: profile.phoneHref },
];

export const stats = [
  { value: "8+", label: "Years in professional practice" },
  { value: "3", label: "Companies, 2017 – today" },
  { value: "4", label: "Industry certifications" },
  { value: "20+", label: "Technologies in the toolkit" },
];

export const skillGroups = [
  { title: "Frontend", items: ["Angular", "React", "Next.js", "TypeScript", "JavaScript", "RxJS", "NgRx", "Tailwind CSS"] },
  { title: "Backend & APIs", items: ["Node.js", "Express", "Python", "RESTful API"] },
  { title: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Firebase"] },
  { title: "Cloud & DevOps", items: ["Amazon Web Services", "Docker", "CI/CD"] },
  { title: "AI & Machine Learning", items: ["Artificial Intelligence", "LangChain", "Machine Learning"] },
];

export const focusAreas = [
  { title: "Application architecture", desc: "Structuring large-scale Angular applications — modules, components and services — so they stay maintainable as they grow." },
  { title: "Performance", desc: "Lazy loading, tree shaking, AOT compilation, code splitting and caching for fast load times and efficient rendering." },
  { title: "Design & UX partnership", desc: "Working with UI/UX designers to ship responsive, cross-browser interfaces that are genuinely pleasant to use." },
  { title: "Data & automation", desc: "API integration, state management and handling large data sets — plus automation that streamlines business processes." },
];

export interface Education {
  id: number;
  degree: string;
  school: string;
  start: string;
  end: string;
}

export const education: Education[] = [
  { id: 1, degree: "Bachelor in Computer Science", school: "Australian Catholic University", start: "2013", end: "2017" },
];

export interface Certificate {
  title: string;
  issuer: string;
  href: string;
}

export const certificates: Certificate[] = [
  {
    title: "IBM Machine Learning Specialist — Professional",
    issuer: "IBM · Credly",
    href: "https://www.credly.com/badges/2cc9b4cf-9471-4d24-84f3-3f6aa451327e/public_url",
  },
  {
    title: "IBM Machine Learning Specialist — Associate",
    issuer: "IBM · Credly",
    href: "https://www.credly.com/badges/9e1677f0-b21d-486a-a458-8261bb3cf3a1/public_url",
  },
  {
    title: "Web Development with Python",
    issuer: "Credly",
    href: "https://www.credly.com/badges/c3495023-cb50-49cb-9195-60ac3083dec6/public_url",
  },
  {
    title: "Web Development Fundamentals",
    issuer: "Credly",
    href: "https://www.credly.com/badges/2df0a7cc-2be0-4ee6-a622-d71e4f1f8adc/public_url",
  },
];

// ------------------------------------------------------------
//  Projects shown on the public site, newest first.
//  Images live in public/projects/. (The /admin Projects tab
//  still edits the database, but no longer feeds this page.)
// ------------------------------------------------------------

export type ProjectCategory = string; // "All" is used as the "no filter" value

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  role: string;
  summary: string;
  description: string;
  highlights: string[];
  tech: string[];
  image: string;
  liveUrl: string;
  repoUrl: string;
}

export const projects: Project[] = [
  {
    id: 6,
    title: "Epoch Atlas",
    category: "EdTech",
    year: "2026",
    role: "Senior Full-Stack Developer",
    summary:
      "An interactive learning app that lets students zoom through history — from the Big Bang to today — with lessons, quizzes and progress built in.",
    description:
      "Epoch Atlas is the flagship education app I work on at Timeline International AG. History is presented as one continuous, zoomable timeline: students glide from billions of years down to a single decade, open events to read linked lessons and sources, then test themselves with short quizzes. I own the app end to end — the canvas-based timeline renderer, the lesson and quiz flows, the content APIs and the data model that keeps every learner's progress in sync across devices.",
    highlights: [
      "Smooth zooming across 13.8 billion years on a GPU-accelerated canvas renderer",
      "Lessons, quizzes and daily streaks woven directly into the timeline",
      "Learner progress synced across web, tablet and mobile",
      "Content model that lets educators publish new timelines without a deploy",
    ],
    tech: ["React", "Next.js", "TypeScript", "Canvas / WebGL", "Node.js", "PostgreSQL"],
    image: "/projects/epoch-atlas.webp",
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: 5,
    title: "ClassPilot",
    category: "EdTech",
    year: "2026",
    role: "Senior Full-Stack Developer",
    summary:
      "A teacher workspace for running classes, setting assignments and spotting who needs help — live, in one dashboard.",
    description:
      "ClassPilot is the teacher-facing side of the learning platform. Teachers create classes, assign lessons from the timeline library, run live sessions and review submissions, while the dashboard surfaces each student's progress and mastery in real time. I built the dashboard, the assignment and grading workflows, and the real-time layer that streams submissions and session activity as they happen.",
    highlights: [
      "Real-time submissions and live-session presence over WebSockets",
      "Assignment board with to-review, in-progress and graded states",
      "Per-student mastery insights that flag who needs support",
      "Role-based access for schools, teachers and students",
    ],
    tech: ["Angular", "TypeScript", "RxJS", "NgRx", "Node.js", "PostgreSQL", "WebSockets"],
    image: "/projects/classpilot.webp",
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: 4,
    title: "Mentora AI",
    category: "AI",
    year: "2026",
    role: "Senior Full-Stack Developer",
    summary:
      "An AI study companion that explains lessons in plain language and turns them into flashcards and quizzes in seconds.",
    description:
      "Mentora is an AI tutor built on top of the course content. Students ask questions in their own words and get age-appropriate explanations grounded in the lesson they're studying — with sources — plus auto-generated flashcards and quizzes to practise with. I designed the retrieval pipeline that keeps answers anchored to approved course material, the guardrails that keep the tutor on-topic and safe for students, and the chat and practice interface.",
    highlights: [
      "Answers grounded in course material, with cited lesson sources",
      "Flashcards and quizzes generated from any lesson in seconds",
      "Guardrails for age-appropriate, on-topic tutoring",
      "Weak-spot tracking that feeds back into each learner's path",
    ],
    tech: ["Next.js", "TypeScript", "Python", "LangChain", "PostgreSQL", "AWS"],
    image: "/projects/mentora.webp",
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: 3,
    title: "Ledgerline",
    category: "FinTech",
    year: "2024",
    role: "Full-Stack Developer",
    summary:
      "A treasury dashboard that gives finance teams a live view of cash, FX exposure and payments across every entity.",
    description:
      "Ledgerline brings a company's bank accounts, payments and forecasts into one Angular workspace. Finance teams track their cash position across entities and currencies, compare actuals against rolling forecasts, and approve payment batches with a full audit trail. I architected the modular Angular front end, the shared component library and the reactive data layer that keeps dozens of live widgets in sync without slowing the page down.",
    highlights: [
      "Modular Angular architecture with lazy-loaded feature areas",
      "Reactive RxJS data layer driving dozens of live widgets",
      "Actual-vs-forecast liquidity charts with drill-down",
      "Payment approval workflows with a full audit trail",
    ],
    tech: ["Angular", "TypeScript", "RxJS", "NgRx", "Node.js", "PostgreSQL"],
    image: "/projects/ledgerline.webp",
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: 2,
    title: "Harbour OMS",
    category: "E-commerce",
    year: "2023",
    role: "Full-Stack Developer",
    summary:
      "An order management console that takes orders from every sales channel through packing, shipping and delivery.",
    description:
      "Harbour OMS is the operations hub for a multi-channel retailer. Orders from the web store, social shops and marketplaces land in a single pipeline where staff pick, pack and ship them, while customers follow their delivery live. I built the order pipeline and table views, the low-stock alerts and the customer tracking screens, with responsive layouts that work as well at a warehouse packing station as they do on a phone.",
    highlights: [
      "One pipeline for web, social and marketplace orders",
      "Live delivery tracking for customers",
      "Low-stock alerts with reorder suggestions",
      "Responsive views for warehouse stations and mobile",
    ],
    tech: ["Angular", "TypeScript", "Angular Material", "Node.js", "Express", "MySQL"],
    image: "/projects/harbour.webp",
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: 1,
    title: "Fleetgrid",
    category: "Platform",
    year: "2020",
    role: "Angular Developer",
    summary:
      "A logistics platform that tracks a live fleet and handles over a hundred thousand shipments without breaking a sweat.",
    description:
      "Fleetgrid gives dispatchers a live map of every vehicle and route next to a searchable grid of shipments. The challenge was scale: the grid had to stay smooth with more than 100,000 rows while live updates streamed in. I built the Angular front end with virtual scrolling, server-side pagination and NgRx state management, and integrated the routing and tracking APIs behind the map.",
    highlights: [
      "Virtual scrolling that stays smooth at 100k+ rows",
      "Live vehicle positions and route overlays on the map",
      "Server-side pagination, filtering and export",
      "NgRx state management for a predictable data flow",
    ],
    tech: ["Angular", "TypeScript", "NgRx", "RxJS", "Bootstrap", "REST APIs"],
    image: "/projects/fleetgrid.webp",
    liveUrl: "",
    repoUrl: "",
  },
];

// Suggested categories offered in the admin form (you can type any category)
export const suggestedCategories = ["SaaS", "EdTech", "E-commerce", "FinTech", "AI", "Platform", "Mobile", "Open Source"];

export const employmentTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

export interface Job {
  id: number;
  company: string;
  role: string;
  type: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  achievements: string[];
  tech: string[];
}

// Employment history, newest first. Achievements use "Label: detail" so the UI can emphasise the label.
export const experience: Job[] = [
  {
    id: 3,
    company: "Timeline International AG",
    role: "Senior Full-Stack Developer",
    type: "",
    location: "Rheinfelden, Switzerland",
    start: "11/2025",
    end: "Present",
    summary:
      "Leading full-stack development of the company's education app — turning an ambitious learning product into a fast, reliable experience that students and teachers can count on, from the interface down to the APIs and data behind it.",
    achievements: [
      "Education app delivery: Took ownership of making the education app work end to end — stabilising the core learning flows, fixing long-standing defects and shipping the features that were blocking launch.",
      "Interactive learning UI: Built rich, responsive interfaces for timelines, lessons, quizzes and progress tracking that run smoothly on desktop, tablet and mobile.",
      "Content & data: Designed the APIs and data models behind courses, lessons, assessments and learner progress.",
      "AI-assisted learning: Added an AI study companion that explains lessons in plain language and generates flashcards and quizzes from course content.",
      "Performance: Cut load times with code splitting, caching and optimised media delivery, so lessons open quickly even on slower school networks.",
      "Quality & reliability: Introduced automated tests, CI/CD pipelines and error monitoring to catch regressions before they reach learners.",
      "Collaboration: Work closely with educators, designers and product owners to turn teaching goals into features students actually use.",
    ],
    tech: ["React", "Next.js", "Angular", "TypeScript", "Node.js", "PostgreSQL", "LangChain", "Docker", "CI/CD"],
  },
  {
    id: 2,
    company: "Sydney Technology Solutions",
    role: "Full-Stack Developer",
    type: "",
    location: "",
    start: "03/2021",
    end: "03/2025",
    summary:
      "Owned the architecture of large-scale Angular applications and partnered with UI/UX designers to deliver fast, consistent and user-friendly products.",
    achievements: [
      "Application architecture: Designed the overall architecture of large-scale Angular applications, including the structure of modules, components and services.",
      "Design patterns: Applied patterns such as MVC and MVVM to keep code maintainable, scalable and efficient.",
      "Component design: Built reusable, modular components shared across the application.",
      "UI/UX guidance: Worked with UI/UX designers so the application is user-friendly, visually appealing and responsive.",
      "Advanced Angular: Used lazy loading, change detection strategies, state management and custom directives and pipes.",
      "Performance: Optimised with AOT compilation, tree shaking, code splitting and caching.",
      "Cross-browser compatibility: Kept the application consistent across browsers and devices.",
    ],
    tech: ["Angular", "TypeScript", "RxJS"],
  },
  {
    id: 1,
    company: "IT Alliance Australia",
    role: "Angular Developer",
    type: "",
    location: "",
    start: "08/2017",
    end: "01/2021",
    summary:
      "Built the frontend of a web application with Angular — from components and API integration to state management, responsive layouts and load-time optimisation.",
    achievements: [
      "Components & services: Created Angular components, services and modules to handle the frontend logic.",
      "API integration: Integrated backend APIs to fetch, display and manage data with proper error handling and optimisation.",
      "State management: Used NgRx and services to manage data flow across the app.",
      "Responsive design: Delivered fully responsive layouts with Bootstrap, Material and custom CSS.",
      "Load time: Applied lazy loading, tree shaking and AOT compilation for fast, efficient performance.",
      "Large data sets: Implemented pagination and infinite scrolling without compromising performance.",
    ],
    tech: ["Angular", "TypeScript", "NgRx", "Bootstrap", "Material"],
  },
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
