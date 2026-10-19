import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // (site) and (legacy) are separate root layouts, so 404 needs its own document
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
      {
        protocol: "https",
        hostname: "medium.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/contacts", destination: "/contact", permanent: true },
      { source: "/projects", destination: "/#projects", permanent: true },
    ];
  },
};

export default nextConfig;
