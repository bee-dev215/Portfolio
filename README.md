# Developer Portfolio

A single-page developer portfolio with a built-in admin panel for managing projects and employment history.

Built with React 18, TypeScript, Vite, Tailwind CSS and shadcn/ui. Projects, experience and images are stored in Supabase.

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
| Name, bio, contact details, stats, skills, employment history, projects, education, certificates, resume link | [`src/data/portfolio.ts`](src/data/portfolio.ts) |
| Project images | [`public/projects/`](public/projects/) (1600×1000 WebP) |
| Resume PDF | [`public/Jackson_Moore_Resume.pdf`](public/Jackson_Moore_Resume.pdf) |
| Page title and social preview tags | [`index.html`](index.html) |

> Employment history and projects on the public site come from `src/data/portfolio.ts`. The Experience and Projects tabs in `/admin` still edit the database, but no longer feed the public page.

To offer a resume, put the PDF in `public/` (e.g. `public/resume.pdf`) and set `profile.resumeUrl` to `"/resume.pdf"`.

## Admin

Visit `/admin`. If no admin exists yet, the first account created there becomes the only admin — claim it right after deploying.

## Backend

The Supabase client is configured in [`src/lib/supabase.ts`](src/lib/supabase.ts). The app expects:

- Tables `portfolio_projects` and `portfolio_experience` (columns match `ProjectRow` / `ExperienceRow` in [`src/lib/portfolioApi.ts`](src/lib/portfolioApi.ts), plus `updated_at`)
- A public storage bucket `portfolio-images`
- RPC functions `portfolio_admin_exists`, `is_portfolio_admin` and `claim_portfolio_admin`
- Row-level security that allows public reads and restricts writes to the admin

The schema and policies are not yet versioned in this repository.

## Contact form

Submissions are posted to the CRM endpoint in [`src/components/portfolio/Contact.tsx`](src/components/portfolio/Contact.tsx).
