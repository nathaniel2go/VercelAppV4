import type { NextConfig } from "next";

// Standard Next.js configuration for Vercel deployment.
// - No static export; Vercel will serve from the .next output
// - Image Optimization is enabled by default
// - No basePath/assetPrefix tweaks needed

const nextConfig: NextConfig = {
  experimental: {
    // Place future flags here if needed
  },
};

export default nextConfig;
