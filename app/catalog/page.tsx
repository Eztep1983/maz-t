import CatalogWebsite from '@/components/CatalogWebsite';
import { Suspense } from 'react';
import Loading from '@/components/Loading';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toners y Suministros | Tmaz Quality Toners',
  description: 'Explora nuestro catálogo de tóneres, tintas y repuestos originales para todas las marcas. Servicio técnico especializado.',
  alternates: {
    canonical: 'https://tmazqualitytoners.com.co/catalog'
  },
  openGraph: {
    title: 'Catálogo Tmaz Quality Toners',
    description: 'Productos profesionales para impresoras y fotocopiadoras',
    url: 'https://tmazqualitytoners.com.co/catalog',
    images: [{
      url: 'https://www.tmazqualitytoners.com.co/images/Logo.jpeg',
      width: 1200,
      height: 630,
      alt: 'Tmaz Quality Toners',
    }],
  },
  keywords: [
    'toner colombia', 'tinta impresoras', 'repuestos pasto',
    'suministros impresión', 'servicio técnico nariño'
  ]
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CatalogWebsite />
    </Suspense>
  );
}