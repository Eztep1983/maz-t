import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins:["http://localhost:3000", "http://192.168.20.69"]
  },
  eslint: {
    //Ignorar eslint
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  distDir: '.next', 
};

export default nextConfig;
