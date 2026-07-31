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

import { uploadImage } from '@/lib/cloudinary';

export async function createInfrastruktur(formData: FormData) {
  try {
    const data: any = {
      nama: formData.get('nama') as string,
      kategori: formData.get('kategori') as string,
      dusun: formData.get('dusun') as string,
      deskripsi: formData.get('deskripsi') as string,
      fotoUrl: formData.get('fotoUrl') as string || null,
      linkMaps: formData.get('linkMaps') as string || null
    };

    const fotoFile = formData.get('fotoFile') as File | null;
    if (fotoFile && fotoFile.size > 0) {
      data.fotoUrl = await uploadImage(fotoFile, 'website-desa-binanga/infrastruktur');
    }

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

export async function updateInfrastruktur(id: string, formData: FormData) {
  try {
    const data: any = {
      nama: formData.get('nama') as string,
      kategori: formData.get('kategori') as string,
      dusun: formData.get('dusun') as string,
      deskripsi: formData.get('deskripsi') as string,
      fotoUrl: formData.get('fotoUrl') as string || null,
      linkMaps: formData.get('linkMaps') as string || null
    };

    const fotoFile = formData.get('fotoFile') as File | null;
    if (fotoFile && fotoFile.size > 0) {
      data.fotoUrl = await uploadImage(fotoFile, 'website-desa-binanga/infrastruktur');
    }

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
