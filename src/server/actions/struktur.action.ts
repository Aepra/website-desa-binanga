
'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

export async function getPerangkat() {
  return await prisma.perangkatDesa.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createPerangkat(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  // Handle file upload
  const file = data.foto as File;
  let uploadedUrl = '';
  if (file && file.size > 0) {
    try {
      uploadedUrl = await uploadImage(file, 'website-desa-binanga/profil_desa');
    } catch (e) {
      console.error('Error uploading image:', e);
    }
  }

  const atasanId = data.atasanId as string;
  
  await prisma.perangkatDesa.create({
    data: {
      nama: data.nama as string,
      kategoriJabatan: data.kategoriJabatan as string,
      jabatan: data.jabatan as string,
      atasanId: atasanId ? atasanId : null,
      fotoUrl: uploadedUrl || null
    }
  });
  revalidatePath('/admin/struktur');
  revalidatePath('/');
  revalidatePath('/home');
}

export async function deletePerangkat(id: string) {
  // Set subordinates' atasanId to null first to avoid FK constraint error
  await prisma.perangkatDesa.updateMany({
    where: { atasanId: id },
    data: { atasanId: null }
  });
  
  await prisma.perangkatDesa.delete({ where: { id } });
  revalidatePath('/admin/struktur');
  revalidatePath('/');
  revalidatePath('/home');
}
