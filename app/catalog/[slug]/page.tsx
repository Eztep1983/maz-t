// app/catalog/[slug]/page.tsx

import CatalogWebsite from '@/components/CatalogWebsite';
import { Suspense } from 'react';
import Loading from '@/components/Loading';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ');

  return {
    title: `${name} | Tmaz Toners Especializados`,
    description: `Compra ${name} de alta calidad en Tmaz Toners. Envíos a toda Colombia.`,
    alternates: {
      canonical: `https://tmazqualitytoners.com.co/catalog/${slug}`,
    },
    openGraph: {
      title: `${name} | Tmaz Toners`,
      description: `Especificaciones técnicas y precios de ${name}`,
      url: `https://tmazqualitytoners.com.co/catalog/${slug}`,
      images: [{
        url: 'https://www.tmazqualitytoners.com.co/images/Logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Tmaz Quality Toners',
      }],
    },
    keywords: [
      `toner ${name}`,
      `repuestos ${name}`,
      `comprar ${name} en Colombia`,
    ],
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <CatalogWebsite initialProduct={slug} />
    </Suspense>
  );
}