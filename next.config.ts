import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  distDir: 'build', // Cambia '.next' a 'build' o cualquier otro directorio local
};

export default nextConfig;
