import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Advertencia: Esto permitirá que la compilación se complete aunque haya errores de ESLint.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  distDir: 'build', // Cambia '.next' a 'build' o cualquier otro directorio local
};

export default nextConfig;
