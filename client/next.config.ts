import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_HOSTNAME_SERVER as string,
        port: '4000',
        pathname: '/uploads/**'
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_HOSTNAME_SERVER as string,
        pathname: '/uploads/**'
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

export default nextConfig;
