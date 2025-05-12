import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Redirige la raíz a /catalog con 301 (permanente)
  if (url.pathname === '/') {
    const newUrl = new URL('/catalog', request.url);
    // Preserva parámetros de búsqueda
    url.searchParams.forEach((value, key) => {
      newUrl.searchParams.append(key, value);
    });
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};