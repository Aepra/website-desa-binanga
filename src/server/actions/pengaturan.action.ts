'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

export async function getPengaturan() {
  const data = await prisma.pengaturan.findMany();
  const result: Record<string, string> = {};
  for (const item of data) {
    result[item.key] = item.value;
  }
  return result;
}

export async function savePengaturan(formData: FormData) {
  const entries = Array.from(formData.entries());
  
  for (const [key, value] of entries) {
    if (typeof value === 'string' && key.startsWith('SET_')) {
      const realKey = key.replace('SET_', '');
      await prisma.pengaturan.upsert({
        where: { key: realKey },
        update: { value },
        create: { key: realKey, value }
      });
    }
  }

  // Handle Foto Kades
  const fotoKades = formData.get('fotoKades') as File;
  if (fotoKades && fotoKades.size > 0) {
    try {
      const uploadedUrl = await uploadImage(fotoKades, 'website-desa-binanga/profil_desa');
      if (uploadedUrl) {
        await prisma.pengaturan.upsert({
          where: { key: 'KADES_FOTO' },
          update: { value: uploadedUrl },
          create: { key: 'KADES_FOTO', value: uploadedUrl }
        });
      }
    } catch (e) {
      console.error('Error uploading Kades foto:', e);
    }
  }

  revalidatePath('/admin/pengaturan');
  // Revalidate frontend pages later if needed
  revalidatePath('/');
  revalidatePath('/home');
  return { success: true };
}
