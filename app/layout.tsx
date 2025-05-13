import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/components/CartContext'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  metadataBase: new URL('https://tmazqualitytoners.com.co'),
  title: {
    default: "Tmaz Quality Toners | Especialistas en Suministros para Impresión",
    template: "%s | Tmaz Quality Toners"
  },
  description: "Distribuidor autorizado de tóneres, tintas y repuestos para impresoras y fotocopiadoras. Envíos a todo Colombia desde Pasto, Nariño.",
  keywords: [
    "toners en colombia","toners pasto","toners colombia", 
    "toner original", "tinta impresora", "repuestos pasto",
    "mantenimiento impresoras", "servicio técnico nariño",
    "distribuidor toner colombia", "suministros impresión"
  ],
  robots: {
    index: true,
    follow: true,
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
    title: "Tmaz Quality Toners | Soluciones en Impresión",
    description: "Toners y Productos profesionales para impresoras y fotocopiadoras",
    url: "https://tmazqualitytoners.com.co",
    siteName: "Tmaz Quality Toners",
    images: [
      {
        url: "https://www.tmazqualitytoners.com.co/images/Toners_consecutivo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html lang="es-CO">
      <body className="min-h-screen bg-gray-50">
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}