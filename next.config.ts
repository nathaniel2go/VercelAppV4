import type { NextConfig } from "next";

// Adjust this to your GitHub Pages repository name if deploying to user/organization page vs project page.
// For a project page at https://<user>.github.io/<repo>/ you need assetPrefix and basePath set to '/<repo>'.
// For a user/organization root page (https://<user>.github.io/) leave basePath and assetPrefix as ''.
// NOTE: Replace REPO_NAME below if this project will be published under a project page.
const repoName = process.env.NEXT_PUBLIC_GH_PAGES_REPO || ""; // e.g. 'nathaniel2go.github.io' or ''

const isProjectPage = !!repoName && repoName !== ""; // customize if needed

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages
  output: "export",
  trailingSlash: true, // GitHub Pages prefers folder style paths
  images: {
    unoptimized: true, // Disable next/image optimization for static export
  },
  // basePath/assetPrefix only if deploying as a project page (like /my-site)
  ...(isProjectPage
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
  // Ensure fonts and dynamic routes don't break static export
  experimental: {
    // Future flags can go here
  },
};

export default nextConfig;
