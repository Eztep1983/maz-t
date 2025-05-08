import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const productSlug = searchParams.get("product");

  // Redirige solo si estamos en la raíz y hay parámetro product
  if (pathname === "/" && productSlug) {
    const url = request.nextUrl.clone();
    url.pathname = "/catalog";
    url.searchParams.set("product", productSlug);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};