import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint configuration
  eslint: {
    // Ignorar eslint durante builds
    ignoreDuringBuilds: true,
  },

  // TypeScript durante build
  typescript: {
    // No fallar build por errores leves (consistente con eslint)
    ignoreBuildErrors: false,
  },

  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'tmazqualitytoners.com.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tmazqualitytoners.com.co',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Directorio de build
  distDir: '.next',

  // Compresión
  compress: true,

  // React strict mode
  reactStrictMode: true,

  // Ocultar header "powered by Next.js" por seguridad
  poweredByHeader: false,

  // Headers de seguridad y performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
      // Cache optimizado para imágenes
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache optimizado para assets estáticos
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache optimizado para imágenes de Cloudinary
      {
        source: '/cloudinary/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects (descomenta y ajusta según necesites)
  async redirects() {
    return [
      // Ejemplo: Redireccionar www a non-www (o viceversa)
      // Descomenta si quieres forzar www o non-www
      // {
      //   source: '/:path*',
      //   has: [
      //     {
      //       type: 'host',
      //       value: 'www.tmazqualitytoners.com.co',
      //     },
      //   ],
      //   destination: 'https://tmazqualitytoners.com.co/:path*',
      //   permanent: true,
      // },
    ];
  },

  // Webpack optimizations para mejor performance
  webpack: (config, { dev, isServer }) => {
    // Optimizar bundle size en producción
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separar React y React-DOM en su propio chunk
            react: {
              name: 'react-vendors',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 40,
              reuseExistingChunk: true,
            },
            // Separar Framer Motion (animaciones)
            motion: {
              name: 'motion',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // React Icons
            icons: {
              name: 'icons',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            // Librerías comunes compartidas
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Experimental features (opcional, descomenta si quieres probar)
  // experimental: {
  //   optimisticClientCache: true,
  //   optimizeCss: true, // Requiere 'critters' package
  // },
};

export default nextConfig;