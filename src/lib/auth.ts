/**
 * auth.ts — Server-side Auth (BUKAN edge/middleware)
 * Gunakan di: server actions, API routes, page components
 * Jangan gunakan di: middleware.ts / proxy.ts
 */
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const SESSION_SECRET = process.env.SESSION_SECRET?.replace(/"/g, '') || 'fallback-secret';
const SESSION_COOKIE = 'admin-session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ── SESSION ──────────────────────────────────────────────────────────────────

export async function getSession(): Promise<{ id: string; name: string; username: string; role: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}

export async function createSession(user: { id: string; name: string; username: string; role: string }) {
  const secret = new TextEncoder().encode(SESSION_SECRET);
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────

export async function loginAdmin(username: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { username: username.trim().toLowerCase() },
    });

    if (!user) return { success: false, error: 'Username atau password salah.' };

    // Support plain text password (legacy) and bcrypt hash
    let passwordMatch = false;
    if (user.password?.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      passwordMatch = user.password === password;
    }

    if (!passwordMatch) return { success: false, error: 'Username atau password salah.' };

    await createSession({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });

    return { success: true };
  } catch (e) {
    console.error('loginAdmin error:', e);
    return { success: false, error: 'Terjadi kesalahan server.' };
  }
}
