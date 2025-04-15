import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/components/CartContext'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Toners Y Suministros",
  description: "Distribuidores de toner en pasto y para toda colombia, fotocopiadoras, impresoras",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}

