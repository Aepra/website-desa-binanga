
'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

export async function getWisata() {
  return await prisma.wisataPotensi.findMany({ orderBy: { createdAt: 'desc' } });
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

  await prisma.wisataPotensi.create({
    data: {
      nama: data.nama as string,
      tipe: data.tipe as string || 'WISATA',
      kategori: data.kategori as string,
      deskripsi: data.deskripsi as string,
      jamBuka: data.jamBuka as string || null,
      linkMaps: data.linkMaps as string || null,
      fotoUrl: uploadedUrl || null
    }
  });
  revalidatePath('/admin/wisata');
  revalidatePath('/');
  revalidatePath('/home');
}

export async function updateWisata(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const file = data.foto as File;
  
  let updateData: any = {
    nama: data.nama as string,
    tipe: data.tipe as string || 'WISATA',
    kategori: data.kategori as string,
    deskripsi: data.deskripsi as string,
    jamBuka: data.jamBuka as string || null,
    linkMaps: data.linkMaps as string || null,
  };

  if (file && file.size > 0) {
    try {
      updateData.fotoUrl = await uploadImage(file, 'website-desa-binanga/wisata');
    } catch (e) {
      console.error('Error uploading image:', e);
    }
  }

  await prisma.wisataPotensi.update({
    where: { id },
    data: updateData
  });
  
  revalidatePath('/admin/wisata');
  revalidatePath('/');
  revalidatePath('/home');
  return { success: true };
}

export async function deleteWisata(id: string) {
  await prisma.wisataPotensi.delete({ where: { id } });
  revalidatePath('/admin/wisata');
  revalidatePath('/');
  revalidatePath('/home');
}
