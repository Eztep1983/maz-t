import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Advertencia: Esto permitirá que la compilación se complete aunque haya errores de ESLint.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  distDir: '.next', 
};

export default nextConfig;
