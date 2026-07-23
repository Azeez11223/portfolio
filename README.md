# Mohammed Abdul Azeez — Developer Portfolio

A single-page developer portfolio built with Next.js (App Router), TypeScript,
Tailwind CSS, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint     # eslint
```

## Project structure

```
src/
  app/                Routes: layout, page, /api/contact, robots.ts, sitemap.ts
  components/
    layout/            Navbar, Footer, BackToTop, LoadingScreen
    sections/          One component per page section (Hero, About, Experience, ...)
    ui/                 Shared primitives (Button, Badge, Dialog, Reveal, TiltCard, ...)
  content/
    data.ts             SINGLE SOURCE OF TRUTH — all resume-derived copy lives here
  lib/
    utils.ts            Small class-name helper
```

To change any text, stat, project, skill, or timeline entry, edit
`src/content/data.ts` — every section reads from it.

## Before deploying, fill in the TODOs

Search the codebase for `[TODO:` and `public/README-TODOS.txt` for the full list.
The important ones:

1. **Resume PDF** — add `public/resume.pdf`. The Resume buttons already link to it.
2. **Favicon & OG image** — add `public/favicon.ico` and `public/og-image.png` (1200×630).
3. **Project links** — add `repoUrl` / `liveUrl` / real `duration` for each project in
   `src/content/data.ts`.
4. **Certification links** — add `credentialUrl` for each certification if available.
5. **Contact form email delivery** — `src/app/api/contact/route.ts` currently validates
   and logs submissions server-side. Wire in Resend, EmailJS, or another provider to
   actually deliver messages (see the comment at the top of that file).
6. **Production URL** — replace the placeholder domain in `layout.tsx`, `sitemap.ts`,
   and `robots.ts` with the real deployed URL.

## Notes

- Dark mode is default; the theme toggle persists via `localStorage`.
- The GitHub Activity section calls the public GitHub REST API live
  (`api.github.com/users/Azeez11223/repos`) and renders a live contribution
  graph — nothing here is mocked.
- All motion respects `prefers-reduced-motion`.
- Deploy target: Vercel (`vercel.json` not required — zero-config Next.js app).
