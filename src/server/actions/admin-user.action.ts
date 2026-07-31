'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function getAdminUsers() {
  const envSuperAdminEmails = (process.env.SUPER_ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  // Auto-seed Super Admin emails from .env into Supabase DB if missing
  for (const superEmail of envSuperAdminEmails) {
    try {
      const existing = await prisma.user.findFirst({
        where: { username: superEmail }
      });

      if (!existing) {
        await prisma.user.create({
          data: {
            name: 'Super Admin Utama',
            username: superEmail,
            role: 'SUPER_ADMIN',
            password: '',
          }
        });
      } else if (existing.role !== 'SUPER_ADMIN') {
        await prisma.user.update({
          where: { id: existing.id },
          data: { role: 'SUPER_ADMIN' }
        });
      }
    } catch (err) {
      console.error('Error auto-seeding Super Admin:', err);
    }
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });
  return users.map(u => ({ ...u, email: u.username }));
}

export async function createAdminUser(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: 'Anda harus login untuk melakukan tindakan ini.' };
  }

  const name = formData.get('name') as string;
  const email = (formData.get('email') as string || '').trim().toLowerCase();
  const role = (formData.get('role') as string) || 'ADMIN';

  if (!email || !name) {
    return { error: 'Nama dan Email wajib diisi!' };
  }

  // Check if user or email already exists
  const existingUser = await prisma.user.findFirst({
    where: { username: email },
  });

  if (existingUser) {
    return { error: `Admin dengan email/username ${email} sudah terdaftar!` };
  }

  await prisma.user.create({
    data: {
      name,
      username: email, // Use email as username for simplicity
      role,
      password: '', // OAuth user doesn't need password
    },
  });

  revalidatePath('/admin/kelola-admin');
  return { success: true };
}

export async function deleteAdminUser(id: string) {
  const session = await getSession();
  if (!session) {
    return { error: 'Anda harus login!' };
  }

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    return { error: 'Admin tidak ditemukan!' };
  }

  // Enforce protection for SUPER_ADMIN
  const superAdminEmails = (process.env.SUPER_ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim().toLowerCase());

  if (targetUser.username && superAdminEmails.includes(targetUser.username.toLowerCase())) {
    return { error: 'Akun Super Admin Utama tidak dapat dihapus!' };
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath('/admin/kelola-admin');
  return { success: true };
}
