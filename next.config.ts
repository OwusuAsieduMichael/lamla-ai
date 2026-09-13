import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/ask",
        destination: "/workspace?channel=text",
        permanent: false,
      },
      {
        source: "/voice",
        destination: "/workspace?channel=voice",
        permanent: false,
      },
      {
        source: "/vision",
        destination: "/workspace?channel=image",
        permanent: false,
      },
      {
        source: "/sources",
        destination: "/resources",
        permanent: false,
      },
      {
        source: "/account",
        destination: "/profile",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
