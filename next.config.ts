import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.15.5", "192.168.15.10", "127.0.0.1", "localhost"],
  async headers() {
    const noCache = {
      key: "Cache-Control",
      value: "no-cache, no-store, must-revalidate",
    } as const;

    return [
      {
        source: "/sw-dahora-atacadista.js",
        headers: [
          noCache,
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          noCache,
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest-dahora-atacadista.webmanifest",
        headers: [
          noCache,
          {
            key: "Content-Type",
            value: "application/manifest+json; charset=utf-8",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          noCache,
          {
            key: "Content-Type",
            value: "application/manifest+json; charset=utf-8",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
