
'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

export async function getUMKM() {
  return await prisma.umkm.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createUMKM(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  // Handle file upload
  const file = data.foto as File;
  let uploadedUrl = '';
  if (file && file.size > 0) {
    try {
      uploadedUrl = await uploadImage(file, 'website-desa-binanga/umkm_potensi');
    } catch (e) {
      console.error('Error uploading image:', e);
    }
  }

  await prisma.umkm.create({
    data: {
      nama: data.nama as string,
      kategori: data.kategori as string,
      pemilik: data.pemilik as string,
      deskripsi: data.deskripsi as string,
      kontakWa: data.kontakWa as string,
      fotoUrl: uploadedUrl || null
    }
  });
  revalidatePath('/admin/umkm');
  revalidatePath('/');
}

export async function deleteUMKM(id: string) {
  await prisma.umkm.delete({ where: { id } });
  revalidatePath('/admin/umkm');
  revalidatePath('/');
}
