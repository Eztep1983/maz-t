// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/components/CartContext'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://tmazqualitytoners.com.co'),
  
  title: {
    default: "Tmaz Quality Toners | Distribuidor Autorizado de Tóner en Pasto, Nariño",
    template: "%s | Tmaz Quality Toners"
  },
  
  description: "Distribuidor autorizado de tóner compatible de alta calidad para Toshiba, Ricoh y Konica Minolta en Pasto, Nariño. Envíos a todo Colombia. 20 años de experiencia garantizan calidad y confiabilidad.",
  
  keywords: [
    // Keywords principales
    "toner Pasto",
    "tóner Pasto",
    "toner Colombia",
    "distribuidor toner",
    
    // Marcas específicas
    "toner Toshiba",
    "toner Ricoh",
    "toner Konica Minolta",
    "toner compatible",
    "toner original",
    
    // Long-tail keywords
    "distribuidor toner Nariño",
    "venta toner Pasto",
    "toner fotocopiadoras",
    "tintas impresoras Pasto",
    "repuestos fotocopiadoras Colombia",
    
    // Geolocalización
    "toner Nariño",
    "distribuidor autorizado Colombia",
  ],
  
  authors: [{ name: 'Tmaz Quality Toners' }],
  creator: 'Tmaz Quality Toners',
  publisher: 'Tmaz Quality Toners',
  
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
    }
  },
  
  verification: {
    google: 'X03MSS_SFoigIinwKwaJxP_ybKa_g8NmUIx_pbSiq80',
  },
  
  alternates: {
    canonical: 'https://tmazqualitytoners.com.co',
  },
  
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://tmazqualitytoners.com.co',
    siteName: 'Tmaz Quality Toners',
    title: 'Tmaz Quality Toners | Distribuidor Autorizado de Tóner en Pasto',
    description: 'Distribuidor autorizado de tóner compatible de alta calidad para Toshiba, Ricoh y Konica Minolta. 20 años de experiencia. Envíos a todo Colombia.',
    images: [
      {
        url: 'https://www.tmazqualitytoners.com.co/images/Toners_consecutivo.png',
        width: 1200,
        height: 630,
        alt: 'Tmaz Quality Toners - Variedad de tóner compatible',
      },
      {
        url: 'https://www.tmazqualitytoners.com.co/images/Logo.jpeg',
        width: 800,
        height: 800,
        alt: 'Tmaz Quality Toners Logo',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Tmaz Quality Toners | Distribuidor de Tóner en Pasto',
    description: 'Distribuidor autorizado de tóner compatible. Toshiba, Ricoh, Konica Minolta. 20 años de experiencia.',
    images: ['https://www.tmazqualitytoners.com.co/images/Logo.jpeg'],
  },
  
  applicationName: 'Tmaz Quality Toners',
  
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tmaz Quality Toners',
  },
  
  category: 'Comercio',
  classification: 'Distribuidores de Suministros de Oficina',
  
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// Viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563EB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Schema.org JSON-LD para SEO mejorado
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tmaz Quality Toners",
    "description": "Distribuidor autorizado de tóner compatible para fotocopiadoras multifuncionales Toshiba, Ricoh y Konica Minolta en Pasto, Nariño",
    "image": "https://www.tmazqualitytoners.com.co/images/Logo.jpeg",
    "logo": "https://www.tmazqualitytoners.com.co/images/Logo.jpeg",
    "url": "https://tmazqualitytoners.com.co",
    "telephone": "+573147845883",
    "email": "tmazqualitytoner@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle 20 # 27-105, Las Cuadras",
      "addressLocality": "Pasto",
      "addressRegion": "Nariño",
      "postalCode": "520001",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "1.2182379",
      "longitude": "-77.2789939"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:30",
        "closes": "12:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "14:40",
        "closes": "18:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "13:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61559681797295"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Efectivo", "Tarjeta de Crédito", "Tarjeta de Débito", "Transferencia Bancaria", "Nequi"],
    "currenciesAccepted": "COP",
    "areaServed": {
      "@type": "State",
      "name": "Nariño"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tmaz Quality Toners",
    "alternateName": "Tmaz Toner",
    "url": "https://tmazqualitytoners.com.co",
    "logo": "https://www.tmazqualitytoners.com.co/images/Logo.jpeg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+573147845883",
      "contactType": "Servicio al Cliente",
      "areaServed": "CO",
      "availableLanguage": ["Spanish"]
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61559681797295"
    ]
  };

  return (
    <html lang="es-CO">
      <head>
        {/* Schema.org JSON-LD */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema)
          }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}