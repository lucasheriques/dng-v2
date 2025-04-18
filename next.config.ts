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
      {
        hostname: "substack-post-media.s3.amazonaws.com",
      },
    ],
  },
  transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
