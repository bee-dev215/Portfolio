# Jovano — company website

The public website of Jovano LLC, a software and applied-AI engineering company. Jovano builds custom AI tools, web and mobile apps, and desktop software that take busywork off teams in healthcare, construction, real estate, professional services, logistics and SaaS.

The site has:

- a one-page overview at `/`
- a page for every service, solution, project and industry
- company pages: about, approach, technology, team, security & AI, FAQ and contact
- a **call-booking page** at `/book`
- privacy and terms pages
- a small admin inbox at `/admin` for contact-form messages and booked calls

Built with React 18, TypeScript, Vite, Tailwind CSS and shadcn/ui.

## Getting started

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # production build in dist/
npm run lint
```

## Editing content

| What | Where |
| --- | --- |
| Company details, contact info, the free-prototype offer, call-booking hours, services, solutions, industries, process, technology stack, principles, team, menus, stats, image credits | [`src/data/company.ts`](src/data/company.ts) |
| Projects (case studies on the home page, `/projects` and `/projects/:slug`, and in the "Our work" strips on service, solution and industry pages) | [`src/data/projects.ts`](src/data/projects.ts) |
| Extra detail on the service, solution and industry pages | [`src/data/service-details.ts`](src/data/service-details.ts), [`src/data/solution-details.ts`](src/data/solution-details.ts), [`src/data/industry-details.ts`](src/data/industry-details.ts) |
| About, approach, technology, team and security page content | [`src/data/company-pages.ts`](src/data/company-pages.ts) |
| Questions and answers (`/faq`; `featured` ones also on the home and contact pages) | [`src/data/faq.ts`](src/data/faq.ts) |
| Privacy policy and terms of use (`/privacy`, `/terms`) | [`src/data/legal.ts`](src/data/legal.ts) |
| Photography | [`public/images/`](public/images/) |
| Page title and social preview tags | [`index.html`](index.html) |
| Logo | The original is [`public/images/logo.png`](public/images/logo.png) (art on solid black). The site uses pieces cut from it: `logo-mark.webp` (the tile J), `logo-mark-dark.webp` (the same with its navy shading lifted to blue, for dark backgrounds), `logo-wordmark.webp` (a mask tinted with the text colour) and `favicon.png`, drawn by `Monogram` and `Wordmark` in [`src/components/site/Navbar.tsx`](src/components/site/Navbar.tsx) with the `.logo-mark` / `.logo-wordmark` styles in [`src/index.css`](src/index.css). Re-cut them if the logo changes. |
| Colour theme (light by default, plus dark; navy primary buttons, indigo → violet → sky highlights) | tokens in [`tailwind.config.ts`](tailwind.config.ts) and `.site-root` in [`src/index.css`](src/index.css) |

### Photo files

All photos are WebP, in [`public/images/`](public/images/):

| Use | File names | Shape |
| --- | --- | --- |
| Services | `svc-*` | 16:10 |
| Solutions | `sol-*` | 16:10 |
| Projects | `proj-<slug>` and `proj-<slug>-2` | 16:10 |
| Process phases | `phase-*` | 16:10 |
| About gallery | `about-*` | 16:10 |
| Technology | `tech-*` | 16:10 |
| Industries | `aud-*` | 4:5 |
| Hero tiles | `hero-*` | |
| Team portraits | `team/` | 4:5 |
| Marquee thumbnails | `thumbs/` | 160×100 |

## Pages

| URL | Page |
| --- | --- |
| `/` | Home: every section in one scroll ([`src/pages/Home.tsx`](src/pages/Home.tsx)) |
| `/services`, `/services/:slug` | Services index, and one page per service |
| `/solutions`, `/solutions/:slug` | Solutions index, and one page per solution |
| `/projects`, `/projects/:slug` | Our work, and one case study per project |
| `/industries`, `/industries/:key` | Industries, and one page per industry |
| `/book` | Book a call (see below) |
| `/about`, `/approach`, `/technology`, `/team`, `/responsible-ai`, `/faq`, `/contact` | Company pages (`/responsible-ai` is "Security & AI") |
| `/privacy`, `/terms` | Legal |
| `/admin` | Inbox for messages and booked calls |

Routes are declared in [`src/App.tsx`](src/App.tsx), and inner pages load on demand.

- Every page sits in `PageShell` (navbar, footer, title, scroll position) and starts with `PageHero`.
- Home sections live in [`src/components/site/`](src/components/site/).
- Slugs come from `src/data/company.ts` and `src/data/projects.ts`. Link with `servicePath`, `solutionPath`, `industryPath` and `projectPath` so URLs stay consistent.
- "Book a call" buttons use `bookCall(topic?)`, which opens `/book` with the topic filled in.
- `startEnquiry(topic?)` opens the contact form.

The site is a single-page app, so the host must serve `index.html` for every route. [`vercel.json`](vercel.json) does that on Vercel; other hosts need an equivalent rewrite.

## Booking a call

`/book` ([`BookingWidget`](src/components/booking/BookingWidget.tsx)) lets a visitor:

1. choose a quick intro chat or a discovery call
2. pick a day and time, shown in their own time zone
3. enter their details

After that, they can add the call to Google Calendar or download an `.ics` file. The home page's contact section also shows the next three open times.

- **Settings:** working hours and time zone, call types, notice and how far ahead people can book, and the video-call link are all in `booking` in `src/data/company.ts`.
- **Time-zone maths:** [`src/lib/booking-time.ts`](src/lib/booking-time.ts).
- **What happens to a booking:**
  - The database holds the time, so nobody can double-book it, and files the booking in the admin inbox (`book_call` in [`supabase/setup.sql`](supabase/setup.sql)).
  - It's also emailed to the company inbox through FormSubmit and sent to the CRM ([`src/lib/leads.ts`](src/lib/leads.ts)).
  - If the database can't be reached, the booking still arrives by email as a request to confirm.

The full walkthrough, including how to block time off, is in [`supabase/README.md`](supabase/README.md#booked-calls).

## Admin and backend

`/admin` is an inbox:

- contact-form messages and booked calls, newest first
- replies sent from Gmail
- **Cancel call** on a booking, which frees its time again

Only emails listed in the database's `admins` table can sign in. The projects, team and photos are not in the database; they're edited in the files above.

The Supabase client is configured in [`src/lib/supabase.ts`](src/lib/supabase.ts). The database schema and access rules are in [`supabase/setup.sql`](supabase/setup.sql), and the step-by-step setup is in [`supabase/README.md`](supabase/README.md).

## Before launch

- **Projects:** the case studies in `src/data/projects.ts` are **placeholders**, written to show the kind of work the company does. Clients are described rather than named, and no results figures are given. Replace them with your real work, or confirm each detail, because visitors will read them as projects you delivered.
- **Team:** the team shows **placeholder profiles**, fictional names on licensed stock portraits. Replace them in `builtInTeam` in `src/data/company.ts` (and the portraits in `public/images/team/`) with your real team.
- **Offer:** the free two-week prototype (`offer` in `src/data/company.ts`) is a business promise shown across the site. Change or remove it there.
- **Booking time zone:** booking times assume **Arizona time** (`booking.timezone`). Set your own, and your working hours, before launch.

## Photography and credits

Photos come from [Pexels](https://www.pexels.com) and [Freepik](https://www.freepik.com) (now Magnific) under their free licences. Freepik's licence requires attribution. Every photo is listed in `imageCredits` in `src/data/company.ts` and credited on `/terms#credits` (linked from the footer). When you add or replace a photo, update that list too.

## Contact form

Submissions are:

- saved to the admin inbox
- emailed through FormSubmit
- posted to the CRM, tagged `website-contact` plus the enquiry type ([`src/lib/leads.ts`](src/lib/leads.ts))

Each one counts as sent if any of the three gets through.
