'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSejarahList() {
  try {
    return await prisma.sejarah.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });
  } catch (error) {
    console.error('Error fetching sejarah:', error);
    return [];
  }
}

export async function createSejarah(data: { tahun: string; judul: string; cerita: string; tipe: string; order: number }) {
  try {
    const result = await prisma.sejarah.create({ data });
    revalidatePath('/admin/sejarah');
    revalidatePath('/profil-desa');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating sejarah:', error);
    return { success: false, error: 'Gagal menambahkan sejarah.' };
  }
}

export async function updateSejarah(id: string, data: { tahun: string; judul: string; cerita: string; tipe: string; order: number }) {
  try {
    const result = await prisma.sejarah.update({
      where: { id },
      data
    });
    revalidatePath('/admin/sejarah');
    revalidatePath('/profil-desa');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating sejarah:', error);
    return { success: false, error: 'Gagal memperbarui sejarah.' };
  }
}

export async function deleteSejarah(id: string) {
  try {
    await prisma.sejarah.delete({ where: { id } });
    revalidatePath('/admin/sejarah');
    revalidatePath('/profil-desa');
    return { success: true };
  } catch (error) {
    console.error('Error deleting sejarah:', error);
    return { success: false, error: 'Gagal menghapus sejarah.' };
  }
}
