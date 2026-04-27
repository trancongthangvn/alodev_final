import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // Dev-only: allow `next dev` to be loaded from the LAN IP. Without this,
  // Next 16 blocks cross-origin RSC + HMR requests, and client components
  // never hydrate (e.g. HeroCube stays as SVG fallback).
  allowedDevOrigins: ["10.5.100.104", "localhost"],
  // /api proxy is handled by nginx (see /etc/nginx/sites-available/alodev.vn).
  // rewrites() is incompatible with output:'export' so it lives in nginx instead.
}

export default nextConfig
