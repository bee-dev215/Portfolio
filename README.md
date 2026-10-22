# GSedu International — company website

The public website of GSedu International LLC, an AI engineering company for education. A one-page overview at `/` plus a page for every solution, service and audience, company pages (about, approach, technology, team, responsible AI, FAQ, contact) and privacy / terms pages. A small admin panel manages project records in the database.

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
| Company details, contact info, services, industries, solutions, process, technology stack, principles, team, menus, stats, image credits | [`src/data/company.ts`](src/data/company.ts) |
| Extra detail on the solution, service and audience pages | [`src/data/solution-details.ts`](src/data/solution-details.ts), [`src/data/service-details.ts`](src/data/service-details.ts), [`src/data/industry-details.ts`](src/data/industry-details.ts) |
| About, approach, technology, team and responsible-AI page content | [`src/data/company-pages.ts`](src/data/company-pages.ts) |
| Questions and answers (`/faq`; `featured` ones also on the home page) | [`src/data/faq.ts`](src/data/faq.ts) |
| Privacy policy and terms of use (`/privacy`, `/terms`) | [`src/data/legal.ts`](src/data/legal.ts) |
| Photography | [`public/images/`](public/images/) (WebP; solutions 16:10, audiences 4:5, collage 4:3, banner 16:9; team portraits in `team/`, 4:5) |
| Page title and social preview tags, boot screen | [`index.html`](index.html) |
| Colour theme (light default + dark; indigo → violet → sky brand gradient) | tokens in [`tailwind.config.ts`](tailwind.config.ts) and `.site-root` in [`src/index.css`](src/index.css) |

## Pages

| URL | Page |
| --- | --- |
| `/` | Home — every section in one scroll ([`src/pages/Home.tsx`](src/pages/Home.tsx)) |
| `/solutions`, `/solutions/:slug` | Solutions index and one page per solution |
| `/services`, `/services/:slug` | Services index and one page per service |
| `/industries`, `/industries/:key` | Who we serve, and one page per audience |
| `/about`, `/approach`, `/technology`, `/team`, `/responsible-ai`, `/faq`, `/contact` | Company pages |
| `/privacy`, `/terms` | Legal |

Routes are declared in [`src/App.tsx`](src/App.tsx); inner pages load on demand. Every page sits in `PageShell` (navbar, footer, title, scroll position) and starts with `PageHero`. Home sections live in [`src/components/site/`](src/components/site/). Slugs come from `src/data/company.ts` — link with `solutionPath`, `servicePath` and `industryPath` so URLs stay consistent.

The site is a single-page app, so the host must serve `index.html` for every route. [`vercel.json`](vercel.json) does that on Vercel; other hosts need an equivalent rewrite.

## Photography and credits

Photos are from [Freepik](https://www.freepik.com) (now Magnific) under its free licence, which requires attribution. Every photo is listed in `imageCredits` in `src/data/company.ts` and credited on `/terms#credits` (linked from the footer). When you add or replace a photo, update that list too.

The team section currently shows **placeholder profiles** — fictional names on licensed stock portraits. Replace them in `team` in `src/data/company.ts` (and the portraits in `public/images/team/`) with your real team before launch.

## Admin

Visit `/admin`. If no admin exists yet, the first account created there becomes the only admin — claim it right after deploying. The admin edits the `portfolio_projects` table; the public site's solutions come from `src/data/company.ts`.

## Backend

The Supabase client is configured in [`src/lib/supabase.ts`](src/lib/supabase.ts). The admin expects:

- A table `portfolio_projects` (columns match `ProjectRow` in [`src/lib/portfolioApi.ts`](src/lib/portfolioApi.ts), plus `updated_at`)
- A public storage bucket `portfolio-images`
- RPC functions `portfolio_admin_exists`, `is_portfolio_admin` and `claim_portfolio_admin`
- Row-level security that allows public reads and restricts writes to the admin

The schema and policies are not yet versioned in this repository. The old `portfolio_experience` table is no longer used and can be dropped.

## Contact form

Submissions are posted to the CRM endpoint in [`src/components/site/Contact.tsx`](src/components/site/Contact.tsx), tagged `website-contact` plus the enquiry type. The optional company name is prepended to the message.
