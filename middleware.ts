//middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Redirigir /catalog?product=slug → /catalog/slug (301 permanente)
  if (pathname === '/catalog' && searchParams.has('product')) {
    const slug = searchParams.get('product');
    return NextResponse.redirect(
      new URL(`/catalog/${slug}`, request.url),
      { status: 301 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/catalog'],
};