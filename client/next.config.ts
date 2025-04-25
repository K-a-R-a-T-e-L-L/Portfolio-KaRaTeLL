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
    ]
  },
};

export default nextConfig;
