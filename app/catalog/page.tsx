import CatalogWebsite from '@/components/CatalogWebsite';
import { Suspense } from 'react';
import Loading from '@/components/Loading';
import { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { product?: string }
}): Promise<Metadata> {
  const params = await searchParams; 
  const product = params.product;

  return {
    title: product 
      ? `${product.replace(/-/g, ' ')} | Tmaz Toners Especializados` 
      : 'Toners y Suministros | Tmaz Quality Toners',
    description: product
      ? `Compra ${product.replace(/-/g, ' ')} de alta calidad en Tmaz Toners. Envíos a toda Colombia.`
      : 'Explora nuestro catálogo de tóneres, tintas y repuestos originales para todas las marcas. Servicio técnico especializado.',
    alternates: {
      canonical: 'https://tmazqualitytoners.com.co/catalog'
    },
    openGraph: {
      title: product 
        ? `${product.replace(/-/g, ' ')} | Tmaz Toners` 
        : 'Catálogo Tmaz Quality Toners',
      description: product
        ? `Especificaciones técnicas y precios de ${product.replace(/-/g, ' ')}`
        : 'Productos profesionales para impresoras y fotocopiadoras',
      url: 'https://tmazqualitytoners.com.co/catalog',
      images: [{
        url: 'https://www.tmazqualitytoners.com.co/images/Logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Tmaz Quality Toners',
      }],
    },
    keywords: product
      ? [`toner ${product}`, `repuestos ${product}`, `comprar ${product} en Colombia`]
      : [
        'toner colombia', 'tinta impresoras', 'repuestos pasto',
        'suministros impresión', 'servicio técnico nariño'
      ]
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { product?: string }
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<Loading />}>
      <CatalogWebsite initialProduct={params.product} />
    </Suspense>
  );
}
