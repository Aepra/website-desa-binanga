'use server';

import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const user = formData.get('username') as string;
  const pass = formData.get('password') as string;

  // Simple hardcoded login for now
  if (user === 'super' && pass === 'admin123') {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user, time: Date.now() });

    const cookieStore = await cookies();
    cookieStore.set('admin_session', session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { success: true };
  }

  return { error: 'Username atau password salah!' };
}
