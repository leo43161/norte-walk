import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  env: {
    API_BASE: "https://amadamia.com.ar/nortewalk/api/",
    SITE_URL: process.env.SITE_URL ?? "https://nortewalk.com.ar/",
    CLARITY_ID: 'x7yj6acput',
    // GA4 Measurement ID. El componente Analytics sólo lo usa en builds de
    // producción (guard por NODE_ENV), así que no contamina las métricas en dev.
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID ?? "G-MH8YVEKB39",
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
