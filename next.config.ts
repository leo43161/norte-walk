import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
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
