'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

// ---------------------------
// TAHUN APBDES (MASTER)
// ---------------------------

export async function getSemuaApbdes() {
  return await prisma.apbdes.findMany({ 
    orderBy: { tahun: 'desc' },
    include: { rincian: true }
  });
}

export async function getApbdesById(id: string) {
  return await prisma.apbdes.findUnique({
    where: { id },
    include: {
      rincian: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

export async function createApbdes(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const file = data.foto as File;
  let uploadedUrl = '';
  if (file && file.size > 0) {
    try {
      uploadedUrl = await uploadImage(file, 'website-desa-binanga/apbdes');
    } catch (e) {
      console.error('Error uploading image:', e);
    }
  }

  const existingCount = await prisma.apbdes.count();
  const isAktif = existingCount === 0;

  await prisma.apbdes.create({
    data: {
      tahun: data.tahun as string,
      fotoUrl: uploadedUrl || null,
      isAktif: isAktif
    }
  });
  
  revalidatePath('/admin/apbdes');
  revalidatePath('/data-statistik');
  revalidatePath('/');
}

export async function deleteApbdes(id: string) {
  await prisma.apbdes.delete({ where: { id } });
  revalidatePath('/admin/apbdes');
  revalidatePath('/data-statistik');
  revalidatePath('/');
}

export async function setActiveApbdes(id: string) {
  await prisma.apbdes.updateMany({
    where: { isAktif: true },
    data: { isAktif: false }
  });
  
  await prisma.apbdes.update({
    where: { id },
    data: { isAktif: true }
  });
  
  revalidatePath('/admin/apbdes');
  revalidatePath('/data-statistik');
  revalidatePath('/');
}

// ---------------------------
// RINCIAN APBDES (ITEMS)
// ---------------------------

const parseBigInt = (val: FormDataEntryValue) => {
  const num = parseInt((val as string).replace(/[^0-9]/g, ''));
  return isNaN(num) ? 0n : BigInt(num);
}

export async function createRincian(apbdesId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  await prisma.apbdesRincian.create({
    data: {
      apbdesId,
      tipe: data.tipe as string, // 'PENDAPATAN', 'BELANJA', 'PEMBIAYAAN'
      kategori: data.kategori as string,
      anggaran: parseBigInt(data.anggaran),
      realisasi: parseBigInt(data.realisasi)
    }
  });

  revalidatePath(`/admin/apbdes/${apbdesId}`);
  revalidatePath('/data-statistik');
  revalidatePath('/');
}

export async function deleteRincian(id: string, apbdesId: string) {
  await prisma.apbdesRincian.delete({ where: { id } });
  revalidatePath(`/admin/apbdes/${apbdesId}`);
  revalidatePath('/data-statistik');
  revalidatePath('/');
}
