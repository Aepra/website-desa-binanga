import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth-edge';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin routes (except login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = await getSession(request);
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'KADES')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /user-dashboard routes
  if (pathname.startsWith('/user-dashboard')) {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user-dashboard/:path*'],
};
