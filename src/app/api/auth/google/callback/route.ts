import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');

  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  if (errorParam || !code) {
    return NextResponse.redirect(new URL('/admin/login?error=oauth_denied', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const envSuperAdminEmails = (process.env.SUPER_ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/admin/login?error=missing_credentials', request.url));
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Google OAuth token exchange failed:', tokenData);
      return NextResponse.redirect(new URL('/admin/login?error=token_failed', request.url));
    }

    // 2. Fetch User Profile from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok || !userData.email) {
      return NextResponse.redirect(new URL('/admin/login?error=profile_failed', request.url));
    }

    const userEmail = userData.email.toLowerCase();

    // 3. Check authorization: .env SUPER_ADMIN_EMAIL OR Supabase database User
    let role = 'ADMIN';
    let isAuthorized = false;

    if (envSuperAdminEmails.includes(userEmail)) {
      isAuthorized = true;
      role = 'SUPER_ADMIN';
    } else {
      // Check Supabase DB User table
      const dbUser = await prisma.user.findFirst({
        where: {
          username: userEmail,
        },
      });

      if (dbUser) {
        isAuthorized = true;
        role = dbUser.role || 'ADMIN';
      }
    }

    if (!isAuthorized) {
      console.warn(`Unauthorized login attempt by ${userEmail}`);
      return NextResponse.redirect(
        new URL(`/admin/login?error=unauthorized_email&email=${encodeURIComponent(userData.email)}`, request.url)
      );
    }

    // 4. Create encrypted session cookie
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({
      user: userData.email,
      name: userData.name || userData.email,
      picture: userData.picture || null,
      time: Date.now(),
      role: role,
    });

    const cookieStore = await cookies();
    cookieStore.set('admin_session', session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  } catch (error) {
    console.error('Google OAuth processing error:', error);
    return NextResponse.redirect(new URL('/admin/login?error=server_error', request.url));
  }
}
