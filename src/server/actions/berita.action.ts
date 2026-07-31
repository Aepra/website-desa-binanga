'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

export async function getBerita() {
  return await prisma.berita.findMany({ 
    orderBy: { createdAt: 'desc' },
    include: { galeri: true }
  });
}

export async function createBerita(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  // Auto-generate slug from judul
  const judul = data.judul as string;
  const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
  
  // Ensure a default user exists since we don't have auth wired up yet
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'admin',
        password: 'hashed_password_here',
        name: 'Administrator',
      }
    });
  }

  // Handle main file upload
  const file = data.foto as File;
  let uploadedUrl = '';
  if (file && file.size > 0) {
    try {
      uploadedUrl = await uploadImage(file, 'website-desa-binanga/berita_agenda');
    } catch (e) {
      console.error('Error uploading main image:', e);
    }
  }

  // Handle gallery files upload
  const galeriFiles = formData.getAll('galeri') as File[];
  const galeriData: { url: string }[] = [];
  
  for (const gFile of galeriFiles) {
    if (gFile && gFile.size > 0) {
      try {
        const gUrl = await uploadImage(gFile, 'website-desa-binanga/berita_galeri');
        galeriData.push({ url: gUrl });
      } catch (e) {
        console.error('Error uploading gallery image:', e);
      }
    }
  }

  // Save to DB
  await prisma.berita.create({
    data: {
      judul: judul,
      slug: slug,
      kategori: data.kategori as string,
      konten: data.konten as string,
      fotoUrl: uploadedUrl || null,
      penulisId: user.id,
      galeri: {
        create: galeriData
      }
    }
  });
  
  revalidatePath('/admin/berita');
  revalidatePath('/');
  revalidatePath('/home');
}

export async function deleteBerita(id: string) {
  await prisma.berita.delete({ where: { id } });
  revalidatePath('/admin/berita');
  revalidatePath('/');
  revalidatePath('/home');
}
