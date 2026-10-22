// ============================================================
//  SOLUTION PAGES — the extra detail shown on /solutions/<slug>, keyed by slug.
//  The core facts (title, summary, capabilities, tech, deliverables, photo) live in
//  `solutions` in src/data/company.ts; this file adds the story around them.
//  Sample exchanges are scripted illustrations, not transcripts of real users.
// ============================================================

export type TurnRole = "learner" | "tutor" | "teacher" | "assistant" | "system" | "staff" | "author" | "reviewer" | "trainer" | "participant";

export interface SampleTurn {
  role: TurnRole;
  name?: string; // label shown beside the avatar; defaults to the role
  text: string;
  sources?: string[]; // citations shown under the turn
  chips?: string[]; // small status tags (e.g. "Hint 1 of 3", "Draft — not yet released")
}

export interface SolutionFaq {
  q: string;
  a: string;
}

export interface SolutionDetail {
  challenge: { intro: string; pains: string[] };
  howItWorks: { title: string; desc: string }[];
  sample: { title: string; context: string; turns: SampleTurn[] };
  integrations: string[];
  designedToImprove: string[]; // goals the design aims at — not measured results
  faqs: SolutionFaq[];
  related: string[]; // other solution slugs
}

export const solutionDetails: Record<string, SolutionDetail> = {
  "ai-tutor": {
    challenge: {
      intro:
        "Learners get stuck at the moments no one is around — late in the evening, the night before a deadline, halfway through a problem set. General-purpose chatbots fill that gap by handing over answers, which helps with the homework but not with the learning, and teachers have no view of what was asked.",
      pains: [
        "Help is only available in class time or office hours",
        "Generic chatbots give answers away and ignore the course material",
        "Teachers can't see where a class is getting stuck until the assessment",
      ],
    },
    howItWorks: [
      { title: "Load your curriculum", desc: "Course notes, slides, worked examples and reading lists are indexed into a private knowledge base." },
      { title: "Set the rules", desc: "Teachers choose subjects, tone, hint depth and academic-integrity rules for each course or assignment." },
      { title: "Learners ask, the tutor guides", desc: "The tutor asks questions and gives graded hints, citing the course material it draws on." },
      { title: "Teachers see the patterns", desc: "A dashboard groups questions by topic so the next lesson can address what the class found hard." },
    ],
    sample: {
      title: "Hint-first tutoring in Algebra I",
      context: "A learner working on square roots late in the evening. The course is set to hint-first mode.",
      turns: [
        { role: "learner", text: "What's the answer to question 4? Solve x² = 49." },
        {
          role: "tutor",
          text: "Let's work it out together rather than me giving it away. What does x² mean — what operation is being done to x?",
          chips: ["Hint-first mode"],
        },
        { role: "learner", text: "x times x. So 7 × 7 = 49, x is 7." },
        {
          role: "tutor",
          text: "Good — 7 works. Is it the only number that works? Try (−7) × (−7). What do you notice?",
          chips: ["Hint 2 of 3"],
          sources: ["Lesson 3.2 · Square roots, page 2"],
        },
        { role: "learner", text: "Oh, that's 49 too. So x = 7 or x = −7." },
        {
          role: "tutor",
          text: "Exactly. Equations like x² = 49 have two solutions, written x = ±7. Want to try question 5 the same way?",
          sources: ["Lesson 3.2 · Worked example 3"],
        },
        { role: "system", text: "Topic logged for the teacher dashboard: \"negative square roots\".", chips: ["Visible to teacher"] },
      ],
    },
    integrations: ["Canvas", "Moodle", "Blackboard", "Google Classroom", "Microsoft Teams", "SSO (SAML / OIDC)"],
    designedToImprove: [
      "Learners getting help at the moment they are stuck",
      "Practice that builds understanding rather than copying answers",
      "Teachers knowing which topics to revisit before the test",
    ],
    faqs: [
      {
        q: "Can learners use it to cheat?",
        a: "Hint-first mode guides rather than answers, and teachers can switch the tutor off or restrict it for assessed work. Conversations can be reviewed, so its use is visible rather than hidden.",
      },
      {
        q: "Which subjects does it work for?",
        a: "Any subject with course material to ground it — maths, sciences, languages, humanities and professional courses. Subjects that need diagrams or code get suitable rendering in the chat.",
      },
      {
        q: "What age groups is it suitable for?",
        a: "We configure tone, vocabulary and safety rules per age group, and for younger learners we design with your safeguarding team before anything goes live.",
      },
    ],
    related: ["assessment-assistant", "learning-analytics", "knowledge-assistant"],
  },

  "assessment-assistant": {
    challenge: {
      intro:
        "Detailed written feedback is one of the most useful things a teacher gives — and one of the most time-consuming. With large classes, feedback arrives late or gets shorter, and consistency between markers is hard to keep.",
      pains: [
        "Marking takes evenings and weekends",
        "Feedback arrives after learners have moved on",
        "Different markers apply the same rubric differently",
      ],
    },
    howItWorks: [
      { title: "Share your rubric", desc: "Rubrics, exemplars and marking notes become the reference for every draft." },
      { title: "Drafts per submission", desc: "For each piece of work, the assistant drafts criterion-by-criterion feedback, quoting the evidence." },
      { title: "The teacher decides", desc: "Teachers edit, approve or discard each draft. Nothing reaches a learner without approval." },
      { title: "Calibrate together", desc: "A consistency view compares feedback across markers and sections so departments can align." },
    ],
    sample: {
      title: "Rubric feedback on a history essay",
      context: "A Year 10 essay marked against a four-criterion rubric. The teacher reviews the draft before release.",
      turns: [
        { role: "system", text: "New submission: \"Causes of the First World War\" — 1,120 words. Rubric: Argument · Evidence · Analysis · Structure." },
        {
          role: "assistant",
          name: "Feedback draft",
          text: "Evidence — meets the criterion. You support the alliance-system point with the 1907 Triple Entente and quote the source accurately (paragraph 3).",
          chips: ["Draft — not yet released"],
          sources: ["Rubric: Evidence, band 3", "Essay, paragraph 3"],
        },
        {
          role: "assistant",
          name: "Feedback draft",
          text: "Analysis — partly meets. Paragraph 5 lists causes but doesn't weigh them. Next step: say which cause mattered most and why.",
          chips: ["Draft — not yet released"],
          sources: ["Rubric: Analysis, band 2", "Exemplar B"],
        },
        { role: "teacher", text: "Agree on evidence. For analysis, add that the conclusion starts to do this — it should build on that." },
        {
          role: "assistant",
          name: "Feedback draft",
          text: "Updated: \"Your conclusion begins to weigh the causes — bring that judgement into paragraph 5 so the whole essay builds towards it.\"",
          chips: ["Edited by teacher"],
        },
        { role: "teacher", text: "Approved. Release to the learner." },
        { role: "system", text: "Feedback released with the teacher's name. Saved to the consistency report for the department.", chips: ["Released"] },
      ],
    },
    integrations: ["Canvas", "Moodle", "Google Classroom", "Turnitin workflows", "QTI question banks", "Gradebook export (CSV / LTI AGS)"],
    designedToImprove: [
      "Learners receiving detailed feedback while the work is still fresh",
      "Teachers spending their time on judgement rather than typing",
      "Consistent use of the rubric across classes and markers",
    ],
    faqs: [
      {
        q: "Does it give grades?",
        a: "It can suggest a band per criterion, but the grade is always the teacher's decision. Many schools use it for formative feedback only.",
      },
      {
        q: "Can it generate questions as well?",
        a: "Yes. It drafts question banks and practice quizzes mapped to your learning objectives, exported as QTI or straight into your LMS — again for a teacher to review.",
      },
      {
        q: "How does it handle handwritten work?",
        a: "Scanned work can be transcribed first; the teacher confirms the transcription before feedback is drafted, so reading errors don't turn into feedback errors.",
      },
    ],
    related: ["ai-tutor", "content-studio", "learning-analytics"],
  },

  "learning-analytics": {
    challenge: {
      intro:
        "The signs that a learner is falling behind are usually in the data — missed logins, late submissions, slipping quiz scores — but they are spread across the LMS, the student record system and a handful of apps. By the time someone joins them up, the moment to help has often passed.",
      pains: [
        "Learning data is scattered across systems that don't talk to each other",
        "Risk shows up in end-of-term results instead of week three",
        "Dashboards show numbers but not what to do about them",
      ],
    },
    howItWorks: [
      { title: "Connect the sources", desc: "LMS activity, assessment results and SIS records flow into one learning record store via xAPI and secure pipelines." },
      { title: "Model the signals", desc: "Explainable models highlight learners whose patterns suggest they need support." },
      { title: "Explain every alert", desc: "Each alert shows the evidence behind it, so advisers can judge whether it's right." },
      { title: "Summarise weekly", desc: "Plain-language summaries tell teachers and leaders what changed and where to look." },
    ],
    sample: {
      title: "An early-warning alert, with its evidence",
      context: "A first-year university adviser's weekly view. Names and data are invented for illustration.",
      turns: [
        {
          role: "system",
          name: "Weekly summary",
          text: "3 learners in your group show a new risk pattern this week. Biology 101 quiz scores dipped across the cohort after the cell-division unit.",
          chips: ["Week 4"],
        },
        { role: "staff", name: "Adviser", text: "Why is Sam flagged?" },
        {
          role: "assistant",
          text: "Three signals together: no LMS activity for 9 days (usually daily), two assignments submitted late, and the last quiz well below Sam's own average. Attendance is unchanged.",
          sources: ["LMS activity log", "Assignment submissions", "Quiz results — Biology 101"],
        },
        { role: "staff", name: "Adviser", text: "Is that unusual for this course?" },
        {
          role: "assistant",
          text: "Late submissions are common in week 4 here; the activity gap is the stronger signal. The model gives most weight to it. You can mark the alert as not useful if it's wrong.",
          chips: ["Explanation"],
        },
        { role: "staff", name: "Adviser", text: "Book a check-in and note that Sam mentioned a part-time job change last week." },
        { role: "system", text: "Check-in scheduled. Note saved to the adviser record, not shared with teaching staff.", chips: ["Private note"] },
      ],
    },
    integrations: ["Canvas Data", "Moodle logs", "Banner / PeopleSoft / other SIS", "xAPI learning record stores", "Power BI / Looker", "OneRoster"],
    designedToImprove: [
      "Spotting learners who need support while there is still time to act",
      "Advisers trusting alerts because they can see the reasons",
      "One shared picture of learning across systems",
    ],
    faqs: [
      {
        q: "Are the models fair?",
        a: "We test models for differences in performance between groups before launch and on a schedule after, publish model cards, and avoid using protected characteristics as inputs.",
      },
      {
        q: "Who can see the alerts?",
        a: "Access follows your roles: advisers see their learners, teachers see their courses, and leaders see aggregated views. Permissions come from your identity provider.",
      },
      {
        q: "Do we need a data warehouse first?",
        a: "No. We can build a lightweight learning record store as part of the project, or connect to the warehouse you already have.",
      },
    ],
    related: ["ai-tutor", "assessment-assistant", "knowledge-assistant"],
  },

  "content-studio": {
    challenge: {
      intro:
        "Course teams are asked for more content, in more formats and languages, without more people. Drafting from scratch is slow, and quick AI drafts often miss the house style, the standards and the accuracy experts expect.",
      pains: [
        "New courses take months from outline to launch",
        "Quality and style drift between authors",
        "Translation and updates multiply the work",
      ],
    },
    howItWorks: [
      { title: "Start from what you have", desc: "Authors upload an outline, existing material or source documents." },
      { title: "Draft in your style", desc: "The studio drafts lessons, examples, quizzes and summaries aligned to your style guide and chosen standards." },
      { title: "Expert review", desc: "Subject-matter experts review, comment and approve in a tracked workflow with version history." },
      { title: "Translate and publish", desc: "Approved content is localised and published to your platform as SCORM, xAPI or native pages." },
    ],
    sample: {
      title: "A lesson draft moving through review",
      context: "An author building a short course on workplace data protection. The style guide asks for plain English and one scenario per lesson.",
      turns: [
        { role: "author", text: "Draft lesson 2 from section 4 of the policy: \"Recognising a data breach\". Include one scenario and a three-question check." },
        {
          role: "assistant",
          name: "Studio",
          text: "Draft ready: learning objective, 450-word lesson, scenario (\"An email sent to the wrong customer\") and three questions with feedback.",
          chips: ["Draft v1", "Style guide applied"],
          sources: ["Data protection policy §4.1–4.3", "House style guide"],
        },
        {
          role: "reviewer",
          name: "Subject expert",
          text: "The scenario is good. Question 2 says breaches must be reported within 24 hours — our policy says 72. Please fix and cite.",
        },
        {
          role: "assistant",
          name: "Studio",
          text: "Corrected to 72 hours with a citation to §4.3. I also checked the lesson text: it already said 72.",
          chips: ["Draft v2"],
          sources: ["Data protection policy §4.3"],
        },
        { role: "reviewer", name: "Subject expert", text: "Approved. Queue the French and Spanish versions." },
        { role: "system", text: "Approved by the subject expert. Translations drafted and sent to language reviewers.", chips: ["Approved", "2 translations in review"] },
      ],
    },
    integrations: ["SCORM / xAPI packages", "Articulate & other authoring tools", "Canvas", "Moodle", "Docebo / Cornerstone", "Google Drive / SharePoint"],
    designedToImprove: [
      "Shorter time from outline to a reviewable draft",
      "Consistent style and standards across authors",
      "Easier translation and updates when source material changes",
    ],
    faqs: [
      {
        q: "Who owns the content it creates?",
        a: "You do. Drafts and approved content belong to your organisation, and your source material is never used to train third-party models.",
      },
      {
        q: "How do you keep drafts accurate?",
        a: "Drafts are grounded in the sources you provide and cite them; experts review every lesson before it's approved, and the workflow keeps a record of who approved what.",
      },
      {
        q: "Can it use our existing templates?",
        a: "Yes. Templates, style guides and standards are configured during set-up so every draft starts in your format.",
      },
    ],
    related: ["assessment-assistant", "ai-academy", "knowledge-assistant"],
  },

  "knowledge-assistant": {
    challenge: {
      intro:
        "Answers to most staff and student questions already exist — in a handbook, a policy, a course catalogue or a training guide. Finding them is the hard part, so the same questions land in inboxes and help desks every week.",
      pains: [
        "People can't find answers that already exist",
        "Help desks repeat the same answers every week",
        "Search tools ignore permissions or return the wrong version",
      ],
    },
    howItWorks: [
      { title: "Connect the documents", desc: "Handbooks, policies, catalogues and guides are ingested from where they live, with their permissions." },
      { title: "Answer with sources", desc: "Every answer cites the passages it came from, linked to the original document." },
      { title: "Know when not to answer", desc: "When the documents don't cover a question, the assistant says so and hands off to a person." },
      { title: "Close the gaps", desc: "Content owners see which questions go unanswered and which documents need updating." },
    ],
    sample: {
      title: "A cited policy answer — and an honest hand-off",
      context: "A new member of staff using the assistant in the intranet during their first week.",
      turns: [
        { role: "staff", name: "New starter", text: "How many days of annual leave do I get in my first year?" },
        {
          role: "assistant",
          text: "Full-time staff get 25 days a year plus public holidays, pro-rated in your first year from your start date. Leave requests go through the HR portal.",
          sources: ["Staff handbook 2026 · §5.1 Annual leave", "HR portal guide · Requesting leave"],
        },
        { role: "staff", name: "New starter", text: "Can I carry unused days into next year?" },
        {
          role: "assistant",
          text: "Up to 5 days can be carried over with your manager's approval, and must be used by the end of March.",
          sources: ["Staff handbook 2026 · §5.4 Carry-over"],
        },
        { role: "staff", name: "New starter", text: "Does that apply if I'm on a fixed-term research contract?" },
        {
          role: "assistant",
          text: "I couldn't find anything in the documents I can access about fixed-term research contracts and carry-over, so I don't want to guess. I've passed your question to the HR team.",
          chips: ["Handed off to HR"],
        },
        { role: "system", text: "Unanswered question added to the HR content-gaps report.", chips: ["Content gap"] },
      ],
    },
    integrations: ["SharePoint", "Google Drive", "Confluence", "Microsoft Teams", "Slack", "ServiceNow / Zendesk hand-off"],
    designedToImprove: [
      "People finding trustworthy answers on their own",
      "Help desks spending time on the questions that need a person",
      "Content owners knowing which documents need work",
    ],
    faqs: [
      {
        q: "Can it see documents a user shouldn't?",
        a: "No. It respects document-level permissions from your identity provider, so each person only gets answers from documents they can already open.",
      },
      {
        q: "What happens when documents change?",
        a: "Sources re-sync on a schedule or on change, and answers always cite the current version.",
      },
      {
        q: "Can students use it as well as staff?",
        a: "Yes — many organisations run separate collections for staff and students, each with its own tone, permissions and hand-off routes.",
      },
    ],
    related: ["ai-tutor", "content-studio", "ai-academy"],
  },

  "ai-academy": {
    challenge: {
      intro:
        "AI tools arrive faster than most organisations can learn to use them well. Engineers need practical skills on real use cases, educators need confidence and clear policies, and leaders need enough understanding to make good decisions.",
      pains: [
        "Generic courses don't match your systems or use cases",
        "Staff are unsure what's allowed and what's wise",
        "Skills fade without practice after a one-off session",
      ],
    },
    howItWorks: [
      { title: "Skills check", desc: "A short assessment and interviews show where each group is starting from." },
      { title: "Tailored programme", desc: "Tracks for engineers, educators and leaders, built around your real use cases and policies." },
      { title: "Hands-on labs", desc: "Participants build and test with real tools in guided labs — on site or remote." },
      { title: "Keep the materials", desc: "Recordings, labs and course material stay with your team for onboarding and refreshers." },
    ],
    sample: {
      title: "A lab in the engineering bootcamp",
      context: "Day 2 of an engineering track: building a small retrieval assistant on the organisation's own course catalogue.",
      turns: [
        { role: "trainer", text: "Your assistant answered \"Which courses run in spring?\" with a course that ended last year. What went wrong?" },
        { role: "participant", text: "It found an old catalogue page. We indexed every version of the catalogue." },
        {
          role: "trainer",
          text: "Right. Add the publication date to each chunk's metadata and filter to the current catalogue. Then rerun the evaluation set.",
          chips: ["Lab 4 · Retrieval quality"],
        },
        { role: "participant", text: "Done — the spring question passes now, but one question about fees fails." },
        {
          role: "trainer",
          text: "Good — that's what the evaluation set is for. Look at which passage it retrieved, then decide: is it a retrieval problem or a missing document?",
          chips: ["Evaluation: 18 / 20 passing"],
        },
        { role: "participant", text: "Missing document — fees are in a PDF we didn't load. Adding it." },
        { role: "system", text: "Lab complete. Notebook and evaluation set saved to the team repository.", chips: ["Saved to GitHub"] },
      ],
    },
    integrations: ["On-site or remote delivery", "Jupyter notebooks", "GitHub", "Your own cloud sandbox", "LMS-hosted course material", "Recordings for onboarding"],
    designedToImprove: [
      "Engineers able to build, test and run AI features on their own",
      "Educators and staff using AI confidently and within policy",
      "Leaders asking better questions of vendors and projects",
    ],
    faqs: [
      {
        q: "Do participants need coding experience?",
        a: "Only for the engineering tracks. Educator, staff and leadership tracks need no coding and focus on practical use, judgement and policy.",
      },
      {
        q: "How big are the cohorts?",
        a: "Labs work best with up to about twenty people per trainer; talks and leadership sessions can be larger.",
      },
      {
        q: "Can you help us write an AI-use policy?",
        a: "Yes. Leadership sessions include a policy workshop, and we can draft a starting policy for your team to adapt.",
      },
    ],
    related: ["knowledge-assistant", "content-studio", "ai-tutor"],
  },
};
