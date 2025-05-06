import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_HOSTNAME_SERVER as string,
        pathname: '/uploads/**'
      }
    ],
    deviceSizes: [320, 640, 828, 1080, 1200], 
    imageSizes: [16, 32, 48, 64],
  },
};

export default nextConfig;
