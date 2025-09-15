This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploying to GitHub Pages

This project is configured for a static export suitable for GitHub Pages.

### 1. Enable GitHub Pages
In your repository settings, under "Pages", set:
 - Source: GitHub Actions (recommended)

The included workflow at `.github/workflows/deploy.yml` will build and publish on every push to `main`.

### 2. Local Static Export
```
npm install
npm run export
```
The static site is output to the `out/` directory.

### 3. Project Page vs User Page
If deploying to `https://<user>.github.io/<repo>/` (a project page), the workflow sets `NEXT_PUBLIC_GH_PAGES_REPO` to the repo name so `basePath` and `assetPrefix` are applied automatically (see `next.config.ts`).

If deploying to a user page root (repository named `<user>.github.io`), leave `NEXT_PUBLIC_GH_PAGES_REPO` empty (you can override in repo Actions settings or remove the env export step) so the site builds at the root.

### 4. Why Did README Show Instead of the App?
GitHub Pages served the default `index.html` created from your README because no built static site existed at the expected path. The static export now provides an `index.html` in `out/` which the workflow deploys.

### 5. Common Gotchas
 - Dynamic server-only features aren't supported in static export.
 - Ensure all asset paths start with `/` so they resolve under the base path.
 - When using images with `next/image`, `unoptimized: true` is set for export; consider plain `<img>` tags for simplicity.

### 6. Trigger a Deployment Manually
Go to the Actions tab, choose "Deploy to GitHub Pages" workflow, click "Run workflow".

### 7. Cache Busting
Static assets are content-hashed by Next.js. If you change large media in `public/`, increment any query param you manually reference to force refresh (e.g., `/image.jpg?v=2`).

---

For a more seamless experience (automatic image optimization, edge rendering), consider deploying to Vercel.
