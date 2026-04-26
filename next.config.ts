import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // /api proxy is handled by nginx (see /etc/nginx/sites-available/alodev.vn).
  // rewrites() is incompatible with output:'export' so it lives in nginx instead.
}

export default nextConfig
