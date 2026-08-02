import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
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

  const clientId = process.env.GOOGLE_CLIENT_ID?.replace(/"/g, '');
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.replace(/"/g, '');
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

    // 2. Fetch user profile from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();
    if (!userResponse.ok || !userData.email) {
      return NextResponse.redirect(new URL('/admin/login?error=profile_failed', request.url));
    }

    const userEmail = userData.email.toLowerCase();

    // 3. Determine Role & Destination
    let role = 'USER';
    let userId = userEmail;
    let userName = userData.name || userData.email;
    let targetUrl = '/user-dashboard';

    if (envSuperAdminEmails.includes(userEmail)) {
      role = 'SUPER_ADMIN';
      targetUrl = '/admin/dashboard';
    } else {
      const dbUser = await prisma.user.findFirst({ where: { username: userEmail } });
      if (dbUser) {
        role = dbUser.role || 'ADMIN';
        userId = dbUser.id;
        userName = dbUser.name;
        targetUrl = '/admin/dashboard';
      } else {
        // Create or update UserPublik for regular user
        const userPublik = await prisma.userPublik.upsert({
          where: { email: userEmail },
          update: {
            nama: userName,
            foto: userData.picture || null,
          },
          create: {
            email: userEmail,
            nama: userName,
            foto: userData.picture || null,
          },
        });
        userId = userPublik.id;
      }
    }

    // 4. Create session cookie
    await createSession({ id: userId, name: userName, username: userEmail, role });

    return NextResponse.redirect(new URL(targetUrl, request.url));
  } catch (error) {
    console.error('Google OAuth processing error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
