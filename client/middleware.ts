import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /en/* routes — rewrite to root path and pass locale in header
  if (pathname.startsWith('/en')) {
    const restPath = pathname.replace(/^\/en/, '') || '/';
    const url = request.nextUrl.clone();
    url.pathname = restPath;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-pathname', pathname);
    response.cookies.set('locale', 'en', { path: '/' });
    return response;
  }

  // Set x-pathname header for locale detection in layouts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|og-image.png|sitemap.xml|robots.txt).*)',
  ],
};
