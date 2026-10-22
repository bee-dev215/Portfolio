-- ============================================================
--  Database for the site's admin page (/admin).
--  Run it in Supabase: SQL Editor → New query → paste this whole file → Run.
--  Safe to run again: it only adds what's missing, and loads the starting projects and team only into empty tables.
--  Step-by-step setup: supabase/README.md
-- ============================================================


-- ---------- 1. Who can edit ----------
-- Sign-in accounts are created in Authentication → Users. An account can edit only if its email is listed here.

create table if not exists public.admins (
  email text primary key
);
-- No policies: visitors can't read the list; only is_admin() below looks at it
alter table public.admins enable row level security;

insert into public.admins (email) values ('terabyte5050@gmail.com') on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

grant execute on function public.is_admin() to anon, authenticated;


-- ---------- 2. Projects ----------
-- The slug (the project's URL) and its place in the list are columns; everything a project page shows is in `data`.

create table if not exists public.projects (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  published boolean not null default true,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Anyone reads published projects" on public.projects;
create policy "Anyone reads published projects" on public.projects
  for select using (published or public.is_admin());

drop policy if exists "Admins add projects" on public.projects;
create policy "Admins add projects" on public.projects
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins edit projects" on public.projects;
create policy "Admins edit projects" on public.projects
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete projects" on public.projects;
create policy "Admins delete projects" on public.projects
  for delete to authenticated using (public.is_admin());

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;


-- ---------- 3. Photos uploaded from the admin page ----------
-- A public bucket, so the site can show them; only admins can upload (5 MB per image).
-- Despite its name it holds every upload: projects/, team/ and site/ folders.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "Admins upload project images" on storage.objects;
create policy "Admins upload project images" on storage.objects
  for insert to authenticated with check (bucket_id = 'project-images' and public.is_admin());

-- Lets the upload read back the file it just stored (the public links don't need this)
drop policy if exists "Admins read project images" on storage.objects;
create policy "Admins read project images" on storage.objects
  for select to authenticated using (bucket_id = 'project-images' and public.is_admin());


-- ---------- 4. Starting projects ----------
-- The 9 projects built into the site (src/data/projects.ts), in their current order. Skipped once the table has any project.

insert into public.projects (slug, sort_order, data)
select p ->> 'slug', (n - 1)::int, p - 'slug'
from jsonb_array_elements($seed$
[
  {
    "slug": "socratic-math-coach",
    "title": "Socratic Math Coach",
    "client": "Public school district · United States",
    "audience": "schools",
    "solution": "ai-tutor",
    "services": [
      "build",
      "llm",
      "platform",
      "evaluation"
    ],
    "year": "2025",
    "duration": "16 weeks to pilot",
    "team": "5 — AI engineers, a learning designer and a data scientist",
    "summary": "A hint-first math tutor for grades 6–9 that lives inside Google Classroom and guides students through problems without handing over the answers.",
    "challenge": "Math teachers across the district saw homework completion rise while understanding fell: students were pasting problems into general-purpose chatbots and copying the answers. The district wanted a tutor that would help in the evening, at home — but on its own curriculum, under its own rules, and with teachers able to see what was asked.",
    "brief": [
      "Guide students — never give away the final answer to assigned work",
      "Grounded in the district's adopted math curriculum",
      "Runs inside Google Classroom with school sign-in",
      "Teachers see questions by topic, so the next lesson can respond"
    ],
    "steps": [
      {
        "phase": "Discover",
        "when": "Weeks 1–3",
        "desc": "Classroom observations and interviews with teachers, students and the safeguarding lead; curriculum and data-protection review."
      },
      {
        "phase": "Prototype",
        "when": "Weeks 4–7",
        "desc": "A tutor on two units of the grade 7 curriculum, tested with students in after-school sessions."
      },
      {
        "phase": "Build",
        "when": "Weeks 8–14",
        "desc": "Hint ladder, teacher topic view, Classroom integration and the evaluation suite that runs on every release."
      },
      {
        "phase": "Pilot",
        "when": "Weeks 15–16",
        "desc": "Launched in volunteer classrooms for a term-long pilot, with weekly teacher check-ins."
      }
    ],
    "built": [
      {
        "title": "Three-step hint ladder",
        "desc": "A question first, then a worked step, then a similar example — never the final answer to an assigned problem."
      },
      {
        "title": "Curriculum-grounded explanations",
        "desc": "Every explanation draws on the district's own lessons and worked examples, with a link to the page."
      },
      {
        "title": "Teacher topic view",
        "desc": "Questions grouped by topic and misconception, so the next lesson can start where the class is stuck."
      },
      {
        "title": "Safety layer",
        "desc": "Age-appropriate filters, gentle redirection off-topic, and escalation of safeguarding concerns to a named adult."
      }
    ],
    "flow": [
      {
        "label": "Curriculum",
        "detail": "Lessons, worked examples and answer keys, chunked by unit and standard"
      },
      {
        "label": "Retrieval",
        "detail": "Vector index filtered by grade and unit"
      },
      {
        "label": "Tutor policy",
        "detail": "Hint-ladder prompts with an answer-leak check"
      },
      {
        "label": "Safety",
        "detail": "Input and output classifiers, escalation rules"
      },
      {
        "label": "Classroom app",
        "detail": "React app launched from Google Classroom"
      }
    ],
    "safeguards": [
      "No final answers to assigned problems — an automated answer-leak test runs on every release",
      "Conversations are visible to the student's teacher; no advertising and no model training on student data",
      "Concerning messages go to the school's safeguarding lead, never handled by the AI alone",
      "Data stays in the district's cloud tenancy and is deleted on the district's schedule"
    ],
    "measures": [
      "How often students reached the answer themselves",
      "Teachers' review of hint quality on sampled conversations",
      "Student and teacher surveys on usefulness and trust",
      "Unit assessment results, compared with the previous year"
    ],
    "stack": [
      "Claude",
      "LangChain",
      "pgvector",
      "FastAPI",
      "React",
      "Google Classroom API"
    ],
    "image": "/images/proj-socratic-math-coach.webp",
    "imageAlt": "A middle-school girl concentrates on a laptop at her desk, with an open textbook beside her, in a bright classroom",
    "gallery": {
      "src": "/images/proj-socratic-math-coach-2.webp",
      "alt": "A teacher leans over a student's shoulder to look at his laptop while classmates work on their own laptops nearby",
      "caption": "Teachers stay in the loop: the topic view shows where a class is stuck before the lesson starts."
    },
    "featured": true
  },
  {
    "slug": "essay-feedback-copilot",
    "title": "Essay Feedback Copilot",
    "client": "Group of secondary schools · English departments",
    "audience": "schools",
    "solution": "assessment-assistant",
    "services": [
      "build",
      "llm",
      "design",
      "evaluation"
    ],
    "year": "2025",
    "duration": "12 weeks",
    "team": "4 — AI engineers, a learning designer and an assessment specialist",
    "summary": "Rubric-aligned feedback drafts on student essays that English teachers review, edit and release — every comment tied to evidence in the student's own text.",
    "challenge": "English teachers were spending their weekends marking, and feedback got shorter as the pile went down. An earlier trial of 'AI grading' had produced confident scores that teachers couldn't explain or trust. The schools wanted help writing feedback — not a machine that grades.",
    "brief": [
      "Drafts only — a teacher releases every comment",
      "Built on the schools' own rubrics and exemplar essays",
      "Each point quotes the student's text as evidence",
      "Fits the existing assignment workflow"
    ],
    "steps": [
      {
        "phase": "Discover",
        "when": "Weeks 1–2",
        "desc": "Marking sessions with teachers to see how feedback is written today; rubrics and exemplars collected."
      },
      {
        "phase": "Calibrate",
        "when": "Weeks 3–5",
        "desc": "Drafts compared with teacher feedback on past, anonymised essays, and tuned until teachers agreed with them."
      },
      {
        "phase": "Build",
        "when": "Weeks 6–10",
        "desc": "Review workspace, assignment integration and consistency checks across classes."
      },
      {
        "phase": "Pilot",
        "when": "Weeks 11–12",
        "desc": "Two year groups, with teachers' edits to each draft recorded to improve the prompts."
      }
    ],
    "built": [
      {
        "title": "Evidence-linked comments",
        "desc": "Each rubric criterion gets a met / partly met / not yet judgement, with the sentences that support it."
      },
      {
        "title": "Review workspace",
        "desc": "Teachers accept, edit or reject every comment. Nothing reaches a student until it is released."
      },
      {
        "title": "Next-step targets",
        "desc": "One or two concrete targets per essay, written for the student's level."
      },
      {
        "title": "Moderation view",
        "desc": "Shows where judgements diverge across classes, ready for department moderation."
      }
    ],
    "flow": [
      {
        "label": "Rubrics & exemplars",
        "detail": "The department's criteria and annotated model essays"
      },
      {
        "label": "Essay parsing",
        "detail": "Paragraph and sentence segmentation, pseudonymised"
      },
      {
        "label": "Criterion assessor",
        "detail": "One judgement per criterion, evidence required"
      },
      {
        "label": "Consistency check",
        "detail": "Compared with exemplars; low confidence flagged"
      },
      {
        "label": "Review workspace",
        "detail": "Teacher edits, approves and releases"
      }
    ],
    "safeguards": [
      "No marks or grades are generated — only feedback drafts for teacher review",
      "Essays are pseudonymised before processing and never used to train models",
      "Low-confidence judgements are flagged to the teacher, not hidden",
      "Teachers' edits improve the prompts only with the department's approval"
    ],
    "measures": [
      "Share of draft comments teachers kept, edited or rejected",
      "Time spent per essay, as reported by teachers",
      "Whether students acted on the feedback in their next draft",
      "Agreement between drafts and moderated teacher judgements"
    ],
    "stack": [
      "Claude / GPT",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "React",
      "Microsoft 365"
    ],
    "image": "/images/proj-essay-feedback-copilot.webp",
    "imageAlt": "A teacher holding a red pen reads a student's paper at his desk, with an open laptop beside him",
    "gallery": {
      "src": "/images/proj-essay-feedback-copilot-2.webp",
      "alt": "A student in a checked shirt writes on sheets of paper at a classroom desk while a classmate writes behind him",
      "caption": "Feedback written for the student's level, with one or two targets for the next draft."
    }
  },
  {
    "slug": "student-success-signals",
    "title": "Student Success Signals",
    "client": "Public research university · first-year programme",
    "audience": "universities",
    "solution": "learning-analytics",
    "services": [
      "analytics",
      "evaluation",
      "design"
    ],
    "year": "2024",
    "duration": "20 weeks",
    "team": "5 — data engineers, a data scientist and a product designer",
    "summary": "An early-warning service that helps first-year advisers spot students who are falling behind — with the evidence behind every flag and a suggested next step.",
    "challenge": "Advisers found out that students were struggling when mid-term grades arrived — by then many had already disengaged. The signals were there earlier, scattered across the LMS, attendance records and the student information system, but nobody could see them together.",
    "brief": [
      "One view of engagement across the LMS, attendance and SIS",
      "Flags that advisers can understand and challenge",
      "No automated decisions about students",
      "Designed with the university's data-protection office"
    ],
    "steps": [
      {
        "phase": "Discover",
        "when": "Weeks 1–4",
        "desc": "Shadowed advisers, mapped data sources and completed a data-protection impact assessment."
      },
      {
        "phase": "Data",
        "when": "Weeks 5–10",
        "desc": "Pipelines from the LMS, attendance and the SIS into a learning-record warehouse."
      },
      {
        "phase": "Model",
        "when": "Weeks 11–15",
        "desc": "An interpretable risk model, a fairness review across student groups and adviser workshops on reading the signals."
      },
      {
        "phase": "Launch",
        "when": "Weeks 16–20",
        "desc": "Adviser workspace and weekly digest rolled out to the first-year team."
      }
    ],
    "built": [
      {
        "title": "Unified learning record",
        "desc": "LMS events, attendance and enrolment data modelled together in one warehouse."
      },
      {
        "title": "Explainable signals",
        "desc": "Every flag lists the behaviours behind it — missed submissions, fewer log-ins, absences from labs."
      },
      {
        "title": "Adviser workspace",
        "desc": "Caseload view, notes and outreach tracking, linked to the existing case-management tool."
      },
      {
        "title": "Weekly digest",
        "desc": "A plain-language summary for each adviser, written by AI and citing the data behind it."
      }
    ],
    "flow": [
      {
        "label": "Sources",
        "detail": "LMS activity, attendance and SIS enrolment"
      },
      {
        "label": "Pipelines",
        "detail": "Scheduled loads, modelled with dbt"
      },
      {
        "label": "Risk model",
        "detail": "Interpretable model with per-student explanations"
      },
      {
        "label": "Fairness checks",
        "detail": "Performance compared across student groups each term"
      },
      {
        "label": "Adviser tools",
        "detail": "Dashboard, caseload and weekly digest"
      }
    ],
    "safeguards": [
      "Signals prompt a conversation; they never trigger automatic action or appear on a record",
      "Students are told what data is used and why, in plain language",
      "Model performance is reviewed across student groups every term",
      "Only a student's assigned adviser can see their signals"
    ],
    "measures": [
      "How early students were contacted, compared with previous years",
      "Advisers' judgement of whether each flag was useful",
      "Whether flagged students re-engaged after outreach",
      "Model calibration and fairness across student groups"
    ],
    "stack": [
      "Python",
      "dbt",
      "PostgreSQL",
      "scikit-learn",
      "SHAP",
      "React"
    ],
    "image": "/images/proj-student-success-signals.webp",
    "imageAlt": "An adviser works through something on a laptop with a university student at a table in a campus library",
    "gallery": {
      "src": "/images/proj-student-success-signals-2.webp",
      "alt": "Over-the-shoulder view of a person reviewing pie, donut and bar charts on a laptop, with printed charts beside it",
      "caption": "Every flag links to the evidence behind it, so advisers can judge it for themselves."
    },
    "featured": true
  },
  {
    "slug": "course-companion",
    "title": "Course Companion for Intro Programming",
    "client": "University computer-science department",
    "audience": "universities",
    "solution": "ai-tutor",
    "services": [
      "llm",
      "platform",
      "build"
    ],
    "year": "2025",
    "duration": "10 weeks",
    "team": "3 — two AI engineers and a learning designer",
    "summary": "A course assistant for a large introductory programming course: it answers from the lecture notes and labs, explains errors, and hands harder questions to teaching assistants.",
    "challenge": "With several hundred students and a small team of teaching assistants, the course forum and lab queues overflowed in the days before every deadline. Many questions were already answered in the lecture notes; others needed a person but got lost in the noise.",
    "brief": [
      "Answers grounded in this course's notes, labs and policies",
      "Explains errors without writing students' code for them",
      "Escalates to teaching assistants with the context attached",
      "Launches from the LMS with university sign-in"
    ],
    "steps": [
      {
        "phase": "Discover",
        "when": "Weeks 1–2",
        "desc": "Analysed a past term's forum questions and interviewed the instructor and teaching assistants."
      },
      {
        "phase": "Build",
        "when": "Weeks 3–7",
        "desc": "Course knowledge base, code-aware tutoring, the hand-off to TAs and an LTI 1.3 launch."
      },
      {
        "phase": "Evaluate",
        "when": "Weeks 8–9",
        "desc": "An evaluation set of real, anonymised questions, reviewed by the teaching assistants."
      },
      {
        "phase": "Launch",
        "when": "Week 10",
        "desc": "Rolled out for the new term, with a feedback button on every answer."
      }
    ],
    "built": [
      {
        "title": "Code-aware explanations",
        "desc": "Reads a student's error message and code, explains the cause and points to the relevant lecture — without rewriting the solution."
      },
      {
        "title": "Policy-aware answers",
        "desc": "Knows the course's collaboration and extension rules, and quotes them."
      },
      {
        "title": "Hand-off to TAs",
        "desc": "Questions it can't answer go to the TA queue with the conversation attached."
      },
      {
        "title": "Instructor insights",
        "desc": "The topics students asked about most each week, ready before the next lecture."
      }
    ],
    "flow": [
      {
        "label": "Course content",
        "detail": "Slides, notes, labs and the syllabus"
      },
      {
        "label": "Indexing",
        "detail": "Code-aware chunking and hybrid search"
      },
      {
        "label": "Tutor",
        "detail": "Socratic prompting with a no-full-solution rule"
      },
      {
        "label": "Hand-off",
        "detail": "TA queue in the course forum"
      },
      {
        "label": "LMS",
        "detail": "LTI 1.3 launch with single sign-on"
      }
    ],
    "safeguards": [
      "Won't write complete solutions to graded assignments",
      "Clearly labelled as AI, with a link to the source of every answer",
      "Course staff can see conversations, under the university's retention policy",
      "Runs on enterprise model terms — no training on student data"
    ],
    "measures": [
      "Share of questions resolved without a hand-off",
      "Teaching assistants' weekly review of answer accuracy",
      "Forum and lab-queue volume before deadlines",
      "Students' rating of each answer"
    ],
    "stack": [
      "Claude",
      "LlamaIndex",
      "pgvector",
      "FastAPI",
      "React",
      "LTI 1.3"
    ],
    "image": "/images/proj-course-companion.webp",
    "imageAlt": "A lecturer talks with students seated at wooden desks with laptops in a bright university lecture hall",
    "gallery": {
      "src": "/images/proj-course-companion-2.webp",
      "alt": "A student types code on a laptop by a window, with the code editor visible on screen",
      "caption": "It explains the error and points to the lecture — the fix is still the student's to write."
    }
  },
  {
    "slug": "voice-speaking-tutor",
    "title": "Speaking Practice Tutor",
    "client": "Language-learning app · EdTech scale-up",
    "audience": "edtech",
    "services": [
      "voice",
      "build",
      "evaluation"
    ],
    "year": "2026",
    "duration": "18 weeks",
    "team": "5 — speech engineers, a full-stack engineer and a product designer",
    "summary": "A voice tutor inside a language-learning app that holds short role-play conversations and gives gentle, specific feedback on pronunciation.",
    "challenge": "Learners in the app could read and write with confidence but froze when they had to speak. Live tutors were expensive and hard to schedule across time zones, and the app's existing speech feature only said right or wrong.",
    "brief": [
      "Short, realistic role-plays at the learner's level",
      "Feedback on specific sounds, not a single score",
      "Fast enough to feel like a conversation on mid-range phones",
      "Fair to learners with strong accents and speech differences"
    ],
    "steps": [
      {
        "phase": "Discover",
        "when": "Weeks 1–3",
        "desc": "Learner interviews and a review of the existing speech feature and the course catalogue."
      },
      {
        "phase": "Prototype",
        "when": "Weeks 4–8",
        "desc": "A voice role-play prototype tested with learners at three levels."
      },
      {
        "phase": "Build",
        "when": "Weeks 9–16",
        "desc": "Streaming speech pipeline, pronunciation feedback and the in-app experience."
      },
      {
        "phase": "Launch",
        "when": "Weeks 17–18",
        "desc": "A staged rollout to a share of learners, monitored against a control group."
      }
    ],
    "built": [
      {
        "title": "Role-play conversations",
        "desc": "Scenarios such as ordering food or a job interview, using vocabulary from the learner's current unit."
      },
      {
        "title": "Sound-level feedback",
        "desc": "Highlights the specific sounds to practise, with slowed-down model audio."
      },
      {
        "title": "Adaptive pacing",
        "desc": "Slows down, rephrases or switches to text when a learner is struggling."
      },
      {
        "title": "Accessible by default",
        "desc": "Captions throughout, and a text path for learners who can't or prefer not to speak."
      }
    ],
    "flow": [
      {
        "label": "Microphone",
        "detail": "On-device voice-activity detection"
      },
      {
        "label": "Speech-to-text",
        "detail": "Streaming recognition"
      },
      {
        "label": "Pronunciation",
        "detail": "Phoneme alignment against reference audio"
      },
      {
        "label": "Conversation",
        "detail": "Role-play kept to the unit's vocabulary"
      },
      {
        "label": "Voice",
        "detail": "Neural text-to-speech at adjustable speed"
      }
    ],
    "safeguards": [
      "Recordings are used for feedback and deleted after the session unless the learner opts in",
      "Pronunciation feedback tested across accents so non-standard speech isn't penalised",
      "Role-plays come from a reviewed, age-appropriate scenario library",
      "Every speaking task has a text alternative"
    ],
    "measures": [
      "How often learners completed speaking tasks they used to skip",
      "Agreement between pronunciation feedback and expert raters",
      "Response time on reference devices",
      "Learner confidence surveys before and after four weeks"
    ],
    "stack": [
      "Whisper",
      "PyTorch",
      "WebRTC",
      "FastAPI",
      "React Native",
      "AWS"
    ],
    "image": "/images/proj-voice-speaking-tutor.webp",
    "imageAlt": "A young woman with a wireless earbud holds her phone up and speaks into it in a bright, airy building",
    "gallery": {
      "src": "/images/proj-voice-speaking-tutor-2.webp",
      "alt": "A smiling woman wearing a headset with a microphone talks to her laptop at a desk in a study booth",
      "caption": "Feedback on the exact sounds to practise — not a single score."
    },
    "featured": true
  },
  {
    "slug": "multilingual-course-studio",
    "title": "Multilingual Course Studio",
    "client": "Online course publisher · professional education",
    "audience": "edtech",
    "solution": "content-studio",
    "services": [
      "build",
      "llm",
      "design"
    ],
    "year": "2025",
    "duration": "14 weeks",
    "team": "4 — AI engineers, a product designer and a learning designer",
    "summary": "An authoring studio that turns subject experts' outlines into draft lessons, quizzes and translations — every draft reviewed before it is published.",
    "challenge": "The publisher's backlog of courses grew faster than its authors could write them, and translating each course added months. An early chatbot experiment produced fluent text that matched neither the house style, the standards nor, at times, the facts.",
    "brief": [
      "Drafts in the house style, aligned to stated learning objectives",
      "Subject experts review and sign off every draft",
      "Translation that keeps terminology consistent",
      "Publishes straight to the existing course platform"
    ],
    "steps": [
      {
        "phase": "Discover",
        "when": "Weeks 1–2",
        "desc": "Shadowed authors and editors; gathered the style guide, glossaries and exemplar courses."
      },
      {
        "phase": "Prototype",
        "when": "Weeks 3–5",
        "desc": "Lesson drafting from an outline, compared side by side with human-written lessons."
      },
      {
        "phase": "Build",
        "when": "Weeks 6–12",
        "desc": "Authoring workspace, review workflow, glossary-aware translation and SCORM export."
      },
      {
        "phase": "Launch",
        "when": "Weeks 13–14",
        "desc": "Trained the editorial team and moved the first courses through the studio."
      }
    ],
    "built": [
      {
        "title": "Outline-to-lesson drafting",
        "desc": "Lessons, examples and summaries drafted from an outline and the author's source material."
      },
      {
        "title": "Assessment generation",
        "desc": "Quiz items mapped to each learning objective, with the reasoning behind every distractor."
      },
      {
        "title": "Review workflow",
        "desc": "Comments, version history and sign-off by a named subject expert."
      },
      {
        "title": "Glossary-aware translation",
        "desc": "Translations that respect the publisher's term bases, queued for native-speaker review."
      }
    ],
    "flow": [
      {
        "label": "Sources",
        "detail": "Outlines, source documents, style guide and glossaries"
      },
      {
        "label": "Drafting",
        "detail": "Structured generation, section by section"
      },
      {
        "label": "Checks",
        "detail": "Style, reading level and objective coverage"
      },
      {
        "label": "Review",
        "detail": "Expert sign-off with version history"
      },
      {
        "label": "Publishing",
        "detail": "SCORM and xAPI packages to the LMS"
      }
    ],
    "safeguards": [
      "Every lesson has a named human approver before publication",
      "Source material stays in the publisher's own cloud tenancy",
      "Factual claims link back to the source material for reviewers to check",
      "AI involvement is recorded in each course's metadata"
    ],
    "measures": [
      "Time from outline to approved lesson",
      "Editors' ratings of drafts against the style guide",
      "Review rounds needed per lesson",
      "Reviewer edits per thousand translated words"
    ],
    "stack": [
      "Claude / GPT",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "SCORM",
      "AWS"
    ],
    "image": "/images/proj-multilingual-course-studio.webp",
    "imageAlt": "An instructor holds up a sketch and explains it to a camera on a tripod in a bright design studio",
    "gallery": {
      "src": "/images/proj-multilingual-course-studio-2.webp",
      "alt": "Four colleagues gather around a laptop with a world-map cover, reviewing content and notes together at a wooden table",
      "caption": "Every draft goes through expert review before it reaches a learner."
    }
  },
  {
    "slug": "clinical-onboarding-assistant",
    "title": "Clinical Onboarding Assistant",
    "client": "Regional healthcare network · learning & development",
    "audience": "corporate",
    "solution": "knowledge-assistant",
    "services": [
      "llm",
      "build",
      "academy",
      "evaluation"
    ],
    "year": "2025",
    "duration": "12 weeks",
    "team": "4 — AI engineers, a data engineer and an AI education lead",
    "summary": "A knowledge assistant that answers new nurses' and staff members' questions from approved policies and training material — always citing the source, and knowing when to send them to a person.",
    "challenge": "New clinical staff faced hundreds of policies and procedures in their first weeks, spread across an intranet, PDFs and training modules. Questions went to busy senior colleagues, and out-of-date documents were still easy to find.",
    "brief": [
      "Answers only from approved, current documents",
      "Cites the exact policy section",
      "Never gives clinical advice about a patient",
      "Single sign-on and role-based access"
    ],
    "steps": [
      {
        "phase": "Discover",
        "when": "Weeks 1–2",
        "desc": "Interviews with clinical educators, new starters and the policy team; a full content audit."
      },
      {
        "phase": "Build",
        "when": "Weeks 3–8",
        "desc": "Ingestion with document owners and review dates, retrieval, the answer policy and single sign-on."
      },
      {
        "phase": "Evaluate",
        "when": "Weeks 9–10",
        "desc": "Clinical educators reviewed answers to a set of real onboarding questions."
      },
      {
        "phase": "Launch & train",
        "when": "Weeks 11–12",
        "desc": "Rolled out to new-starter cohorts, with short training sessions for educators."
      }
    ],
    "built": [
      {
        "title": "Cited answers",
        "desc": "Every answer quotes the policy section it comes from, with the document's review date."
      },
      {
        "title": "Scope guardrails",
        "desc": "Patient-specific and clinical-decision questions are declined and routed to the right person."
      },
      {
        "title": "Content-gap reports",
        "desc": "Shows the policy team which questions have no good answer, so documents can be fixed."
      },
      {
        "title": "Onboarding pathways",
        "desc": "Suggested reading and check-in questions for each role's first weeks."
      }
    ],
    "flow": [
      {
        "label": "Policy library",
        "detail": "Approved documents with owners and review dates"
      },
      {
        "label": "Ingestion",
        "detail": "Version-aware parsing; expired documents excluded"
      },
      {
        "label": "Hybrid search",
        "detail": "Keyword and vector retrieval combined"
      },
      {
        "label": "Answer policy",
        "detail": "Cite-or-decline, with a clinical-scope check"
      },
      {
        "label": "Teams & intranet",
        "detail": "Chat where staff already work"
      }
    ],
    "safeguards": [
      "Declines anything that looks like clinical advice about a patient",
      "Expired or draft documents are never used as sources",
      "Answers are logged for the education team to review",
      "Hosted in the network's own Azure tenancy"
    ],
    "measures": [
      "Share of answers clinical educators rated correct and complete",
      "Questions routed to a person, and why",
      "New starters' confidence in their first month",
      "Content gaps closed by the policy team"
    ],
    "stack": [
      "Azure OpenAI",
      "Elasticsearch",
      "pgvector",
      "FastAPI",
      "Microsoft Teams",
      "Azure"
    ],
    "image": "/images/proj-clinical-onboarding-assistant.webp",
    "imageAlt": "A clinical instructor demonstrates equipment on a colleague lying on a training bed while nurses in blue scrubs watch",
    "gallery": {
      "src": "/images/proj-clinical-onboarding-assistant-2.webp",
      "alt": "Two healthcare workers with stethoscopes work together on a laptop and a tablet at a glass desk",
      "caption": "Answers cite the exact policy section and its review date — or say who to ask instead."
    },
    "featured": true
  },
  {
    "slug": "ai-ready-educators",
    "title": "AI-Ready Educators",
    "client": "Network of independent schools",
    "audience": "schools",
    "solution": "ai-academy",
    "services": [
      "academy",
      "design"
    ],
    "year": "2026",
    "duration": "One school year",
    "team": "3 — an AI education lead, a learning designer and an AI engineer",
    "summary": "A year-long AI-literacy programme for teachers and school leaders: hands-on workshops, classroom-ready activities and a responsible-use policy written together.",
    "challenge": "Staff were split between banning AI tools and using them without guidance. Leaders needed a shared, practical policy, and teachers wanted to know what actually helps in a lesson — not another talk about the future.",
    "brief": [
      "Practical sessions built around teachers' own lessons",
      "A responsible-use policy for staff and students",
      "Activities that teach students to question AI output",
      "A champion in each school to keep it going"
    ],
    "steps": [
      {
        "phase": "Discover",
        "when": "Term 1, weeks 1–3",
        "desc": "Staff survey, focus groups and a review of existing policies."
      },
      {
        "phase": "Workshops",
        "when": "Term 1",
        "desc": "Hands-on sessions on planning, feedback, differentiation and checking AI output."
      },
      {
        "phase": "Policy",
        "when": "Term 2",
        "desc": "Leaders, teachers and safeguarding staff drafted the responsible-use policy together."
      },
      {
        "phase": "Champions",
        "when": "Term 3",
        "desc": "A champion trained in each school, with materials to run sessions on their own."
      }
    ],
    "built": [
      {
        "title": "Workshop series",
        "desc": "Six hands-on sessions that use teachers' own schemes of work."
      },
      {
        "title": "Classroom activity pack",
        "desc": "Lessons that teach students to prompt, check and cite AI tools."
      },
      {
        "title": "Responsible-use policy",
        "desc": "A staff and student policy written with leadership, safeguarding and parents."
      },
      {
        "title": "Champion toolkit",
        "desc": "Facilitator guides, slides and recordings, so schools can carry on without us."
      }
    ],
    "flow": [
      {
        "label": "Needs survey",
        "detail": "What staff use, fear and want"
      },
      {
        "label": "Workshops",
        "detail": "Hands-on, on teachers' own lessons"
      },
      {
        "label": "Classroom trials",
        "detail": "Activities tried and reported back"
      },
      {
        "label": "Policy",
        "detail": "Written together, approved by leadership"
      },
      {
        "label": "Champions",
        "detail": "Running sessions in every school"
      }
    ],
    "safeguards": [
      "Sessions use approved tools with education-grade data terms",
      "No student data is entered into AI tools during training",
      "The policy covers academic integrity, disclosure and age limits",
      "Parents were consulted on the student-facing guidance"
    ],
    "measures": [
      "Teacher confidence at the start and end of the year",
      "Activities teachers went on to use in class",
      "Adoption of the policy across schools",
      "Sessions run by champions without our involvement"
    ],
    "stack": [
      "Anthropic Claude",
      "OpenAI GPT",
      "Google Gemini",
      "Google Workspace",
      "Microsoft Copilot"
    ],
    "image": "/images/proj-ai-ready-educators.webp",
    "imageAlt": "Workshop participants with lanyards work on laptops at shared tables, with presentation screens behind them",
    "gallery": {
      "src": "/images/proj-ai-ready-educators-2.webp",
      "alt": "A facilitator holding a tablet speaks to a small group of adults seated on chairs in a bright, white room",
      "caption": "Every session works on teachers' own lessons — not generic examples."
    }
  },
  {
    "slug": "tutor-safety-evaluation",
    "title": "Tutor Safety & Evaluation Suite",
    "client": "K-12 EdTech company · AI tutoring product",
    "audience": "edtech",
    "services": [
      "evaluation",
      "build"
    ],
    "year": "2026",
    "duration": "8 weeks",
    "team": "3 — ML engineers and a safeguarding specialist",
    "summary": "An independent evaluation and red-teaming suite for a children's AI tutor, now running on every release in the client's CI pipeline.",
    "challenge": "The company's AI tutor for children was growing fast, and each prompt or model change was checked by hand, if at all. School buyers had begun asking for evidence of safety testing that the team couldn't easily provide.",
    "brief": [
      "Test accuracy, grounding, tone and safeguarding",
      "Red-team the ways children actually misuse chat",
      "Run automatically on every release",
      "Produce evidence school buyers can read"
    ],
    "steps": [
      {
        "phase": "Assess",
        "when": "Weeks 1–2",
        "desc": "Reviewed the product, past incidents and the company's safeguarding policy."
      },
      {
        "phase": "Design",
        "when": "Weeks 3–4",
        "desc": "Wrote the test taxonomy and built test sets with educators and a safeguarding specialist."
      },
      {
        "phase": "Red-team",
        "when": "Weeks 5–6",
        "desc": "Structured red-teaming sessions, with findings triaged alongside the product team."
      },
      {
        "phase": "Automate",
        "when": "Weeks 7–8",
        "desc": "The suite wired into CI, with release gates and a readable report."
      }
    ],
    "built": [
      {
        "title": "Test taxonomy",
        "desc": "Coverage of subject accuracy, curriculum grounding, age-appropriate tone, safeguarding and bias."
      },
      {
        "title": "Graded test sets",
        "desc": "Scenarios written with teachers, including adversarial ones found in red-teaming."
      },
      {
        "title": "Release gates",
        "desc": "CI blocks a release when safety tests regress, with a clear diff of what changed."
      },
      {
        "title": "Assurance report",
        "desc": "A plain-language summary for school buyers, regenerated with every release."
      }
    ],
    "flow": [
      {
        "label": "Scenarios",
        "detail": "Curated and red-team test cases"
      },
      {
        "label": "Runner",
        "detail": "Parallel runs against staging builds"
      },
      {
        "label": "Graders",
        "detail": "Rule checks, model graders and human spot-checks"
      },
      {
        "label": "Release gates",
        "detail": "Thresholds enforced in CI"
      },
      {
        "label": "Report",
        "detail": "Dashboard and buyer-facing summary"
      }
    ],
    "safeguards": [
      "Red-team content handled only by trained staff, under a written protocol",
      "No real children's conversations used — scenarios are written by educators",
      "Model graders are calibrated against human judgements",
      "Findings shared privately with the client before any release"
    ],
    "measures": [
      "Coverage of the test taxonomy",
      "Regressions caught before release",
      "Agreement between model graders and human reviewers",
      "Time to evaluate a candidate release"
    ],
    "stack": [
      "Python",
      "pytest",
      "promptfoo",
      "GitHub Actions",
      "PostgreSQL",
      "Grafana"
    ],
    "image": "/images/proj-tutor-safety-evaluation.webp",
    "imageAlt": "Three colleagues lean in around a monitor in a bright office, one pointing at the screen as they discuss results",
    "gallery": {
      "src": "/images/proj-tutor-safety-evaluation-2.webp",
      "alt": "A team arranges colourful sticky notes on a glass wall while discussing ideas in a modern office",
      "caption": "Red-team findings are triaged with the product team, then turned into permanent tests."
    }
  }
]
$seed$::jsonb) with ordinality as t(p, n)
where not exists (select 1 from public.projects);


-- ---------- 5. Messages from the contact form ----------
-- Anyone can send one; only admins can read, file or delete them. The admin page shows them under Messages.

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  organisation text check (char_length(organisation) <= 200),
  phone text check (char_length(phone) <= 50),
  topic text check (char_length(topic) <= 100),
  message text not null check (char_length(message) between 1 and 10000),
  sms_opt_in boolean not null default false,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Visitors can only add a new, unread message; they can't read any back, not even their own
drop policy if exists "Anyone sends a message" on public.messages;
create policy "Anyone sends a message" on public.messages
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists "Admins read messages" on public.messages;
create policy "Admins read messages" on public.messages
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins file messages" on public.messages;
create policy "Admins file messages" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete messages" on public.messages;
create policy "Admins delete messages" on public.messages
  for delete to authenticated using (public.is_admin());

grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;


-- ---------- 6. Team ----------
-- The people on the Team page, the home page and /about, in the admin's order.

create table if not exists public.team_members (
  id bigint generated always as identity primary key,
  name text not null,
  role text not null,
  bio text not null default '',
  photo text not null default '',
  linkedin text not null default '',
  focus text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

drop policy if exists "Anyone reads published team members" on public.team_members;
create policy "Anyone reads published team members" on public.team_members
  for select using (published or public.is_admin());

drop policy if exists "Admins add team members" on public.team_members;
create policy "Admins add team members" on public.team_members
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins edit team members" on public.team_members;
create policy "Admins edit team members" on public.team_members
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete team members" on public.team_members;
create policy "Admins delete team members" on public.team_members
  for delete to authenticated using (public.is_admin());

grant select on public.team_members to anon, authenticated;
grant insert, update, delete on public.team_members to authenticated;

-- The team built into the site (src/data/company.ts). Skipped once the table has anyone in it.
insert into public.team_members (name, role, bio, photo, focus, sort_order)
select name, role, bio, photo, focus, sort_order
from (values
  ('Martin Keller', 'Founder & CEO', 'Leads strategy and client partnerships, and makes sure every project starts from a real learning problem.', '/images/team/martin.webp', array['Strategy', 'EdTech', 'Partnerships'], 0),
  ('Kenji Watanabe', 'CTO · Head of AI engineering', 'Owns the architecture and engineering standards, from retrieval pipelines to production infrastructure.', '/images/team/kenji.webp', array['LLM systems', 'Architecture', 'MLOps'], 1),
  ('Mei Lin Chen', 'Lead ML engineer', 'Builds and evaluates the models behind our tutors and assistants, with a focus on grounding and safety.', '/images/team/mei.webp', array['RAG', 'Evaluation', 'PyTorch'], 2),
  ('Marcus Bello', 'Senior full-stack engineer', 'Turns prototypes into fast, accessible products and connects them to the platforms schools already use.', '/images/team/marcus.webp', array['React', 'FastAPI', 'LTI 1.3'], 3),
  ('Sofia Marín', 'Learning experience designer', 'Designs how learners and teachers work with AI, grounded in learning science and plenty of user testing.', '/images/team/sofia.webp', array['Learning design', 'UX research', 'Accessibility'], 4),
  ('Hannah Lindqvist', 'Data scientist · Learning analytics', 'Builds the analytics and early-warning models that help educators act sooner.', '/images/team/hannah.webp', array['Analytics', 'xAPI', 'Modelling'], 5),
  ('Amara Nwosu', 'AI education lead', 'Runs the AI Academy — engineering bootcamps, educator workshops and AI-literacy programmes.', '/images/team/amara.webp', array['Training', 'Curriculum', 'AI literacy'], 6),
  ('Owen Brady', 'Product designer', 'Shapes interfaces that make complex AI feel simple, from first sketch to design system.', '/images/team/owen.webp', array['Product design', 'Design systems', 'Prototyping'], 7)
) as t(name, role, bio, photo, focus, sort_order)
where not exists (select 1 from public.team_members);


-- ---------- 7. Site photos ----------
-- Replacements for the photos built into the site (public/images/). A row swaps one photo everywhere it appears;
-- deleting the row brings the original back.

create table if not exists public.site_photos (
  file text primary key, -- the original's file name in public/images/, e.g. sol-ai-tutor.webp
  url text not null,
  alt text not null default '', -- replaces the original's description, where the site gives it one
  updated_at timestamptz not null default now()
);

alter table public.site_photos enable row level security;

drop policy if exists "Anyone reads site photos" on public.site_photos;
create policy "Anyone reads site photos" on public.site_photos
  for select using (true);

drop policy if exists "Admins add site photos" on public.site_photos;
create policy "Admins add site photos" on public.site_photos
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins edit site photos" on public.site_photos;
create policy "Admins edit site photos" on public.site_photos
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete site photos" on public.site_photos;
create policy "Admins delete site photos" on public.site_photos
  for delete to authenticated using (public.is_admin());

grant select on public.site_photos to anon, authenticated;
grant insert, update, delete on public.site_photos to authenticated;
