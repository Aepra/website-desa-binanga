'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getInfrastrukturList() {
  try {
    return await prisma.infrastruktur.findMany({
      orderBy: [
        { kategori: 'asc' },
        { nama: 'asc' }
      ]
    });
  } catch (error) {
    console.error('Error fetching infrastruktur:', error);
    return [];
  }
}

export async function createInfrastruktur(data: { nama: string; kategori: string; dusun: string; deskripsi?: string; fotoUrl?: string }) {
  try {
    const result = await prisma.infrastruktur.create({ data });
    revalidatePath('/admin/infrastruktur');
    revalidatePath('/profil-desa');
    revalidatePath('/data-statistik');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating infrastruktur:', error);
    return { success: false, error: 'Gagal menambahkan infrastruktur.' };
  }
}

export async function updateInfrastruktur(id: string, data: { nama: string; kategori: string; dusun: string; deskripsi?: string; fotoUrl?: string }) {
  try {
    const result = await prisma.infrastruktur.update({
      where: { id },
      data
    });
    revalidatePath('/admin/infrastruktur');
    revalidatePath('/profil-desa');
    revalidatePath('/data-statistik');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating infrastruktur:', error);
    return { success: false, error: 'Gagal memperbarui infrastruktur.' };
  }
}

export async function deleteInfrastruktur(id: string) {
  try {
    await prisma.infrastruktur.delete({ where: { id } });
    revalidatePath('/admin/infrastruktur');
    revalidatePath('/profil-desa');
    revalidatePath('/data-statistik');
    return { success: true };
  } catch (error) {
    console.error('Error deleting infrastruktur:', error);
    return { success: false, error: 'Gagal menghapus infrastruktur.' };
  }
}
