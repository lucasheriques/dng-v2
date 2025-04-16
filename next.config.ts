import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "tailwindui.com",
      },
      {
        hostname: "midjourney.com",
      },
      {
        hostname: "substackcdn.com",
      },
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "img.logo.dev",
      },
    ],
  },
  transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
