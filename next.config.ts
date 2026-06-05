import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  env: {
    API_BASE: process.env.API_BASE ?? "https://amadamia.com.ar/nortewalk/api/",
    SITE_URL: process.env.SITE_URL ?? "https://nortewalk.com.ar/",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/nortewalk_api/**" },
      { protocol: "https", hostname: "nortewalk.com", pathname: "/**" },
      { protocol: "https", hostname: "api.nortewalk.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
