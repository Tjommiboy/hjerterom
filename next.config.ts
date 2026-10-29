import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This folder is the project root (there is another package-lock.json in the home folder).
  outputFileTracingRoot: process.cwd(),
  images: {
    // Sanity's image CDN already resizes and converts photos.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
