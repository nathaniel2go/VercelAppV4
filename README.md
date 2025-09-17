# Next.js Portfolio – Vercel Deployment

This is a Next.js App Router project deployed on Vercel.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app. Edit `src/app/page.tsx` to make changes.

## Build

```bash
npm run build
```

Vercel runs `next build` automatically on each push.

## Deployment (Vercel)

- Connect this GitHub repository to Vercel.
- Framework Preset: Next.js (auto-detected)
- Build Command: `next build`
- Output: `.next`

Push to `main` to trigger a Production deployment. Use branches/PRs for Preview deployments.

## Notes

- The blog is statically generated at build time using `generateStaticParams` and local markdown files under `src/app/blog/content/blog`.
- You can adopt `next/image` for automatic image optimization on Vercel.
- No GitHub Pages workflow is used; Vercel handles builds and hosting.

## Learn More

- Next.js Docs: https://nextjs.org/docs
- Vercel + Next.js: https://vercel.com/docs/frameworks/nextjs
