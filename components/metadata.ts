import { Metadata } from 'next';

/**
 * Metadata optimizada para SEO
 * Usar en app/layout.tsx o app/page.tsx
 */
export const metadata: Metadata = {
  // Basic SEO
  title: {
    default: 'Tmaz Quality Toner - Distribuidores de Tóner en Pasto, Nariño | Toshiba, Ricoh, Konica',
    template: '%s | Tmaz Quality Toner'
  },
  description: 'Distribuidores autorizados de tóner compatible en Pasto, Nariño. Tóner de alta calidad para Toshiba, Ricoh y Konica Minolta. Envíos a toda Colombia. 20 años de experiencia garantizan calidad y confiabilidad.',
  
  // Keywords
  keywords: [
    'toner Pasto',
    'tóner Pasto',
    'toner Nariño',
    'distribuidor toner Colombia',
    'toner Toshiba',
    'toner Ricoh',
    'toner Konica Minolta',
    'fotocopiadoras Pasto',
    'toner compatible',
    'venta toner Colombia',
    'repuestos fotocopiadoras',
    'toner multifuncional',
    'distribuidor autorizado toner',
    'toner económico Pasto',
    'toner calidad Nariño'
  ],

  // Authors & Publisher
  authors: [{ name: 'Tmaz Quality Toner' }],
  creator: 'Tmaz Quality Toner',
  publisher: 'Tmaz Quality Toner',

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://tmazqualitytoner.com',
    siteName: 'Tmaz Quality Toner',
    title: 'Tmaz Quality Toner - Distribuidores de Tóner en Pasto',
    description: 'Distribuidores autorizados de tóner compatible para Toshiba, Ricoh y Konica Minolta. 20 años de experiencia. Envíos a toda Colombia.',
    images: [
      {
        url: '/images/Logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Tmaz Quality Toner - Distribuidores de Tóner en Pasto',
      },
      {
        url: '/images/TonersCantidad.png',
        width: 1200,
        height: 630,
        alt: 'Variedad de tóner compatible - Tmaz Quality Toner',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Tmaz Quality Toner - Distribuidores de Tóner en Pasto',
    description: 'Distribuidores autorizados de tóner compatible. Toshiba, Ricoh, Konica Minolta. 20 años de experiencia.',
    images: ['/images/Logo.jpeg'],
    creator: '@TmazToner', // Actualizar si tienen Twitter
  },

  // Verification (agregar códigos reales)
  verification: {
    google: 'CODIGO_VERIFICACION_GOOGLE', // Obtener de Google Search Console
    // yandex: 'CODIGO_YANDEX',
    // bing: 'CODIGO_BING',
  },

  // Canonical URL
  alternates: {
    canonical: 'https://tmazqualitytoner.com',
  },

  // App-specific
  applicationName: 'Tmaz Quality Toner',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tmaz Quality Toner',
  },

  // Additional metadata
  category: 'Comercio',
  classification: 'Distribuidores de Suministros de Oficina',
  
  // Icons (si existen)
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Manifest
  manifest: '/manifest.json',
};

/**
 * Viewport configuration
 */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563EB', // Color Azul del brand
};

/**
 * Ejemplo de uso en app/layout.tsx:
 * 
 * import { metadata, viewport } from './metadata';
 * 
 * export { metadata, viewport };
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="es">
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 */

/**
 * Meta tags adicionales para páginas específicas
 */

// Para página de productos
export const productsMetadata: Metadata = {
  title: 'Catálogo de Tóner Compatible | Tmaz Quality Toner',
  description: 'Catálogo completo de tóner compatible para Toshiba, Ricoh y Konica Minolta. Precios competitivos y calidad garantizada. Envíos a toda Colombia.',
  openGraph: {
    title: 'Catálogo de Tóner Compatible | Tmaz Quality Toner',
    description: 'Descubre nuestra amplia variedad de tóner compatible de alta calidad.',
  },
};

// Para página de contacto
export const contactMetadata: Metadata = {
  title: 'Contacto - Cotización Gratuita | Tmaz Quality Toner',
  description: 'Contáctanos para una cotización gratuita. WhatsApp: +57 314-784-5883. Ubicados en Pasto, Nariño. Atención personalizada.',
  openGraph: {
    title: 'Contacto | Tmaz Quality Toner',
    description: 'Solicita tu cotización gratuita. Estamos en Pasto, Nariño.',
  },
};

// Para página de testimonios
export const testimonialsMetadata: Metadata = {
  title: 'Opiniones de Clientes | Tmaz Quality Toner',
  description: 'Lee las opiniones de nuestros clientes satisfechos. 20 años de experiencia respaldados por cientos de empresas en Pasto y Colombia.',
  openGraph: {
    title: 'Opiniones de Clientes | Tmaz Quality Toner',
    description: 'Descubre por qué somos la elección preferida en Pasto.',
  },
};

export default metadata;