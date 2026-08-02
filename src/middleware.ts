import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth-edge';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getSession(request);

  // 1. Protect /admin routes (except /admin/login page itself)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role = (session.role as string)?.toUpperCase();
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'KADES') {
      // Non-admin user trying to access Admin route -> Redirect to user dashboard
      return NextResponse.redirect(new URL('/user-dashboard', request.url));
    }
  }

  // 2. Protect /user-dashboard routes
  if (pathname.startsWith('/user-dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Redirect authenticated users away from login pages if session is valid
  if (pathname === '/login' || pathname === '/admin/login') {
    if (session) {
      const role = (session.role as string)?.toUpperCase();
      if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'KADES') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/user-dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user-dashboard/:path*',
    '/login',
    '/admin/login'
  ],
};
