import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
