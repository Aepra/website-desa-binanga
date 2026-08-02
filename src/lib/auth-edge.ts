/**
 * auth-edge.ts — Edge-safe JWT session helper
 * Gunakan di proxy.ts (tidak boleh import prisma/next-auth/next/headers)
 * Baca cookie langsung dari NextRequest
 */
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

const SESSION_SECRET = process.env.SESSION_SECRET?.replace(/"/g, '') || 'fallback-secret';
const SESSION_COOKIE = 'admin-session';

export async function getSession(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
