// ============================================================
//  Frequently asked questions — the FAQ page (/faq) shows them all by category;
//  the home page and the apply page show the ones marked `featured`.
//  `id` is the question's anchor (/faq#id) — keep it stable once published, links may point to it.
// ============================================================

export type FaqCategory = "Applying" | "Roles & hours" | "Pay & levels" | "Working with Jovano" | "Trust & safety";

export interface Faq {
  id: string;
  q: string;
  a: string;
  category: FaqCategory;
  featured?: boolean;
}

export const faqCategories: FaqCategory[] = ["Applying", "Roles & hours", "Pay & levels", "Working with Jovano", "Trust & safety"];

export const faqs: Faq[] = [
  // ---------- Applying ----------
  {
    id: "who-can-apply",
    category: "Applying",
    featured: true,
    q: "Who can apply?",
    a: "Anyone, anywhere, who is of working age where they live, has the skills for the role and can work with a reliable computer and internet connection. We hire on skills and attitude, not on where you went to school or which country you're in.",
  },
  {
    id: "cost-to-apply",
    category: "Applying",
    featured: true,
    q: "Does it cost anything to apply?",
    a: "No. Applying, the skills check, the interview, onboarding and training are all free, and we will never ask you for a payment, a deposit or a \"starter kit\". If anyone claiming to be from Jovano asks you for money, it isn't us — please report it to us.",
  },
  {
    id: "what-to-prepare",
    category: "Applying",
    featured: true,
    q: "What do I need to apply?",
    a: "About five minutes, a CV or LinkedIn profile (a portfolio link for engineers), and a computer with a camera and microphone for the video intro later on. You don't need to set up any payment details until after you've joined.",
  },
  {
    id: "after-apply",
    category: "Applying",
    featured: true,
    q: "What happens after I apply?",
    a: "You'll get an email confirming we've received your application. A recruiter reads it, and if it's a fit we send you a short, role-specific skills check and ask for a two-minute video intro. After that comes a 30-minute interview, and then a decision — within five business days of each step.",
  },
  {
    id: "not-accepted",
    category: "Applying",
    q: "What if my application isn't accepted?",
    a: "We'll tell you, rather than leaving you waiting. Where we can, we'll say what would make a stronger application. You're welcome to apply again after three months, or straight away for a different role.",
  },
  {
    id: "multiple-roles",
    category: "Applying",
    q: "Can I apply for more than one role?",
    a: "Yes. Pick the role that fits you best on the form and mention a second one in your note. If your skills suit a different role better, the recruiter will suggest it.",
  },

  // ---------- Roles & hours ----------
  {
    id: "choose-hours",
    category: "Roles & hours",
    featured: true,
    q: "Can I choose my own hours?",
    a: "Mostly, yes. Most roles are flexible with a few hours of overlap with your team each day. Support roles are shift-based, and you choose your shifts each week. Your schedule is agreed in writing before you start.",
  },
  {
    id: "full-or-part-time",
    category: "Roles & hours",
    q: "Are the roles full-time or part-time?",
    a: "Both, for most roles. Software engineering is full-time. Everything else can be full-time or part-time (at least 20 hours a week) — tell us what you're looking for on the form.",
  },
  {
    id: "experience-needed",
    category: "Roles & hours",
    q: "Do I need experience?",
    a: "It depends on the role. Engineering asks for at least two years of professional experience; support asks for six months in any customer-facing job. For the other roles, the skills check matters more than your CV.",
  },

  // ---------- Pay & levels ----------
  {
    id: "how-paid",
    category: "Pay & levels",
    featured: true,
    q: "How and when do I get paid?",
    a: "Twice a month, on fixed dates, by bank transfer, Wise, Payoneer or — on request, where it's legal — USDT. Every payout comes with a payslip that shows your hours, any bonuses and any deductions, line by line.",
  },
  {
    id: "how-much",
    category: "Pay & levels",
    q: "How much does each role pay?",
    a: "Rates depend on the role, your level and your experience, and are agreed in writing before you start. We share the range for your role at the interview, so you never have to guess — and you can always ask earlier.",
  },
  {
    id: "levels",
    category: "Pay & levels",
    q: "What are levels?",
    a: "Four steps — Associate, Specialist, Senior and Lead — that each raise your base rate and your responsibilities. You move up through quarterly reviews based on the quality of your work and how you help your team. The criteria for each level are in your workspace.",
  },
  {
    id: "paid-training",
    category: "Pay & levels",
    q: "Is training paid?",
    a: "Yes. Once you've signed your contract, onboarding and training time is paid at your base rate. The skills check you do while applying is short and unpaid, and it's never real client work.",
  },

  // ---------- Working with Jovano ----------
  {
    id: "who-do-i-work-for",
    category: "Working with Jovano",
    q: "Who will I actually be working for?",
    a: "You're hired, trained and paid by Jovano, and assigned to a team that supports one of our client companies. You'll know the company, your team lead and your responsibilities before your first day.",
  },
  {
    id: "contract",
    category: "Working with Jovano",
    q: "Will I have a contract?",
    a: "Yes. Every team member signs a written contract — usually as an independent contractor — that sets out your role, your rate, your hours and how either side can end it. You'll have time to read it and ask questions before you sign.",
  },
  {
    id: "equipment",
    category: "Working with Jovano",
    q: "Do I need my own equipment?",
    a: "Yes: a computer from the last five years, a stable internet connection and, for support roles, a headset. Any software or accounts you need for the work are provided by Jovano or the team you join.",
  },

  // ---------- Trust & safety ----------
  {
    id: "spot-scams",
    category: "Trust & safety",
    q: "How do I know a message is really from Jovano?",
    a: "We only contact applicants from our company email address, and we never ask for money, gift cards, crypto deposits, or your bank password. We'll never ask you to apply for jobs or attend interviews under someone else's name. If something feels off, email us before you reply.",
  },
  {
    id: "my-data",
    category: "Trust & safety",
    q: "What happens to my personal information?",
    a: "We use it only to review your application and, if you join, to run your contract and payroll. We don't sell it. You can ask us to see or delete it at any time — see our privacy policy for the details.",
  },
];
