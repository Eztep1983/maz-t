import CatalogWebsite from '@/components/CatalogWebsite';
import { Suspense } from 'react';
import Loading from '@/components/Loading';

// Opción 1: Hacer el componente de página asíncrono
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { product?: string }
}) {
  return (
    <Suspense fallback={<Loading />}>
      <CatalogWebsite initialProduct={searchParams.product} />
    </Suspense>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { product?: string }
}) {
  return {
    title: searchParams.product 
      ? `Producto: ${searchParams.product}` 
      : 'Catálogo de Productos',
  };
}