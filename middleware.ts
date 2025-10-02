import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const SITE_HOST = process.env.SITE_HOST;

export function middleware(req: NextRequest) {
  if (!SITE_HOST) return NextResponse.next();

  const { nextUrl } = req;
  if (nextUrl.hostname !== SITE_HOST) {
    const redirectUrl = new URL(`${nextUrl.protocol}//${SITE_HOST}${nextUrl.pathname}${nextUrl.search}`);
    return NextResponse.redirect(redirectUrl, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/account', '/auth/:path*', '/api/:path*'],
};