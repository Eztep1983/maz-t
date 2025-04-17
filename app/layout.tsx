import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/components/CartContext'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Tmaz Quality Toner Pasto | Toner & Suministros para Impresoras",
  description: "Your trusted distributor of toner and printer supplies, including Toshiba, Ricoh, Lexmark, and Epson. Serving Pasto, Nariño, and all of Colombia with quality and reliability.",
  keywords: ["toner", "toner pasto", "toner nariño", "toner colombia", "repuestos impresoras", "fotocopiadoras toshiba", "kyocera", "Epson pasto", "Hp pasto", 
"Tintas impresora", "tintas originales", "tintas genericas", "toner generico", "toner original", "toner de calidad", "toner de alta calidad", 
"comprar tinta impresoras", "mantenimiento impresoras", "recarga de tinta", "recarga de toner", "servicio técnico especializado", 
"distribuidor autorizado de toner", "insumos impresoras", "fotocopiadoras", "Colombia", "Pasto", "Nariño", "servicio técnico", "repuestos impresoras",
"toner kilos", "toner color", "cilindros", "cuchillas fotocopiadoras", "impresoras hp"],
  authors: [{ name: "Tmaz Quality Toner", url: "https://www.tmazqualitytoners.com.co/" }],
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}

