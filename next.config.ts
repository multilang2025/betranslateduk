import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The copy is never meant to compete with the live site in search. See also robots in app/layout.tsx.
  poweredByHeader: false,
};

export default nextConfig;
