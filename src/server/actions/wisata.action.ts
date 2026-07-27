
'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

export async function getWisata() {
  return await prisma.wisata.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createWisata(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  // Handle file upload
  const file = data.foto as File;
  let uploadedUrl = '';
  if (file && file.size > 0) {
    try {
      uploadedUrl = await uploadImage(file, 'website-desa-binanga/wisata');
    } catch (e) {
      console.error('Error uploading image:', e);
    }
  }

  await prisma.wisata.create({
    data: {
      nama: data.nama as string,
      kategori: data.kategori as string,
      deskripsi: data.deskripsi as string,
      fotoUrl: uploadedUrl || null
    }
  });
  revalidatePath('/admin/wisata');
  revalidatePath('/');
}

export async function deleteWisata(id: string) {
  await prisma.wisata.delete({ where: { id } });
  revalidatePath('/admin/wisata');
  revalidatePath('/');
}
