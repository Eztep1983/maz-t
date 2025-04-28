import { usePathname, useSearchParams } from 'next/navigation';

export function useModalUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (slug) {
      params.set('product', slug);
    } else {
      params.delete('product');
    }

    // Método que no causa scroll
    window.history.replaceState(
      { scroll: false },
      '',
      `${pathname}?${params.toString()}`
    );
  };

  return { updateUrl };
}