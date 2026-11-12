import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  async redirects() {
    return [{ source: "/about", destination: "/ecosystem", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        //https://nextjs.org/docs/messages/next-image-unconfigured-host
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
