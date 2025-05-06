import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_HOSTNAME_SERVER as string,
        pathname: '/projects/uploads/**'
      }
    ],
    unoptimized: true
  },
};

export default nextConfig;
