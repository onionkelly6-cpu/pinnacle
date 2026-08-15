import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enables React's <ViewTransition> for animated route/page switches.
    viewTransition: true,
  },
  images: {
    // Remote stock imagery (placeholder demo imagery — replace with properly
    // licensed assets before any real launch). Scoped to the Unsplash CDN.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
    // Next.js 16 requires the qualities allowlist if any quality != 75.
    qualities: [50, 75, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
