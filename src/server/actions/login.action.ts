'use server';

import { loginAdmin } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const username = (formData.get('username') as string)?.trim();
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' };
  }

  const result = await loginAdmin(username, password);
  if (!result.success) {
    return { error: result.error || 'Username atau password salah.' };
  }

  return { success: true };
}
