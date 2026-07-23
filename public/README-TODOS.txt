Before deploying, fill these in:
1. /public/resume.pdf - the actual resume PDF (referenced by the Resume buttons).
2. /public/favicon.ico + og-image.png (1200x630) for SEO/social previews.
3. Project repo/live URLs and screenshots in src/content/data.ts (projects array).
4. Certification credential URLs in src/content/data.ts (certifications array).
5. Wire a real email provider (Resend/EmailJS) in src/app/api/contact/route.ts.
6. Update the production URL placeholders in layout.tsx, sitemap.ts, robots.ts.
