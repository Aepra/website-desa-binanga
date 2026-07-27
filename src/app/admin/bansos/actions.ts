'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getBansos() {
  return await prisma.bansos.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function addBansos(data: { nik: string, nama: string, jenisBantuan: string, status: string, keterangan?: string }) {
  await prisma.bansos.create({
    data: {
      nik: data.nik,
      nama: data.nama,
      jenisBantuan: data.jenisBantuan,
      status: data.status,
      keterangan: data.keterangan || null
    }
  });
  revalidatePath('/admin/bansos');
  revalidatePath('/berita-agenda');
}

export async function updateBansos(id: string, data: { nik: string, nama: string, jenisBantuan: string, status: string, keterangan?: string }) {
  await prisma.bansos.update({
    where: { id },
    data: {
      nik: data.nik,
      nama: data.nama,
      jenisBantuan: data.jenisBantuan,
      status: data.status,
      keterangan: data.keterangan || null
    }
  });
  revalidatePath('/admin/bansos');
  revalidatePath('/berita-agenda');
}

export async function deleteBansos(id: string) {
  await prisma.bansos.delete({
    where: { id }
  });
  revalidatePath('/admin/bansos');
  revalidatePath('/berita-agenda');
}

export async function cekBansosDB(nik: string) {
  const bansos = await prisma.bansos.findUnique({
    where: { nik }
  });
  return bansos;
}
