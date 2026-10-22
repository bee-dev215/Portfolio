# GKT — company website

The public website of GKT LLC, a robotics software company: services, industries, solution blueprints, delivery process, technology stack, company profile, FAQ, a project enquiry form, and privacy / terms pages. A small admin panel manages project records in the database.

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
| Company details, contact info, services, industries, solutions, process, technology stack, principles, FAQ, stats, image credits | [`src/data/company.ts`](src/data/company.ts) |
| Privacy policy and terms of use (`/privacy`, `/terms`) | [`src/data/legal.ts`](src/data/legal.ts) |
| Photography | [`public/images/`](public/images/) (WebP; solutions 16:10, industries 4:5, bands 16:9) |
| Page title and social preview tags, boot screen | [`index.html`](index.html) |
| Colour theme (steel / signal cyan / safety amber) | tokens in [`tailwind.config.ts`](tailwind.config.ts) and `.site-root` in [`src/index.css`](src/index.css) |

Sections live in [`src/components/site/`](src/components/site/) and are assembled in [`src/components/AppLayout.tsx`](src/components/AppLayout.tsx).

## Photography and credits

Photos are from [Freepik](https://www.freepik.com) (now Magnific) under its free licence, which requires attribution. Every photo is listed in `imageCredits` in `src/data/company.ts` and credited on `/terms#credits` (linked from the footer). When you add or replace a photo, update that list too.

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
