import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Edge Middleware for Subdomain & Route Separation:
 * 1. User Website: (e.g., www.example.com or example.com)
 *    - Serves public landing page, trips, offers, booking flow, contact.
 *    - Has zero visible links to the Admin portal.
 *
 * 2. Admin Website / Subdomain: (e.g., admin.example.com)
 *    - When accessed via "admin." subdomain, automatically routes to /admin dashboard or /admin/login.
 *    - Isolates admin management from public customer navigation.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Check if current hostname is an admin subdomain (e.g., admin.example.com or admin.localhost:3000)
  const isAdminSubdomain =
    hostname.startsWith('admin.') ||
    hostname.startsWith('dashboard.') ||
    hostname.includes('admin-sama');

  // If on Admin Subdomain:
  if (isAdminSubdomain) {
    // If accessing root of admin subdomain (e.g. admin.example.com/), rewrite to /admin
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
