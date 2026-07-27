'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSemuaPenduduk(tahun?: number) {
  return await prisma.penduduk.findMany({
    where: tahun ? { tahunData: tahun } : undefined,
    orderBy: { createdAt: 'desc' }
  });
}

export async function addPenduduk(data: { nik: string, noKk: string, nama: string, jenisKelamin: string, dusun: string, tahunData: number, pendidikan?: string, pekerjaan?: string, status: string }) {
  await prisma.penduduk.create({
    data: {
      nik: data.nik,
      noKk: data.noKk,
      nama: data.nama,
      jenisKelamin: data.jenisKelamin,
      dusun: data.dusun,
      tahunData: data.tahunData,
      pendidikan: data.pendidikan || null,
      pekerjaan: data.pekerjaan || null,
      status: data.status
    }
  });
  revalidatePath('/admin/penduduk');
  revalidatePath('/data-statistik');
  revalidatePath('/home');
}

export async function updatePenduduk(id: string, data: { nik: string, noKk: string, nama: string, jenisKelamin: string, dusun: string, tahunData: number, pendidikan?: string, pekerjaan?: string, status: string }) {
  await prisma.penduduk.update({
    where: { id },
    data: {
      nik: data.nik,
      noKk: data.noKk,
      nama: data.nama,
      jenisKelamin: data.jenisKelamin,
      dusun: data.dusun,
      tahunData: data.tahunData,
      pendidikan: data.pendidikan || null,
      pekerjaan: data.pekerjaan || null,
      status: data.status
    }
  });
  revalidatePath('/admin/penduduk');
  revalidatePath('/data-statistik');
  revalidatePath('/home');
}

export async function deletePenduduk(id: string) {
  await prisma.penduduk.delete({
    where: { id }
  });
  revalidatePath('/admin/penduduk');
  revalidatePath('/data-statistik');
  revalidatePath('/home');
}
