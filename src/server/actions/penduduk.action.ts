'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type PendudukData = {
  noKk: string;
  nik: string;
  namaLengkap: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  pendidikanTerakhir: string;
  pekerjaanUtama: string;
  golonganDarah: string;
  statusPerkawinan: string;
  shdk: string;
  dusunDomisili: string;
  statusKependudukan: string;
  tahunData: number;
};

export async function getSemuaPenduduk(tahun?: number) {
  const records = await prisma.penduduk.findMany({
    where: tahun ? { tahunData: tahun } : undefined,
    orderBy: { createdAt: 'desc' }
  });

  return records.map((item) => ({
    ...item,
    namaLengkap: item.namaLengkap || item.nama || '',
    nama: item.nama || item.namaLengkap || '',
    dusunDomisili: item.dusunDomisili || item.dusun || '',
    dusun: item.dusun || item.dusunDomisili || '',
    statusKependudukan: item.statusKependudukan || item.status || 'AKTIF',
    status: item.status || item.statusKependudukan || 'AKTIF',
    pendidikanTerakhir: item.pendidikanTerakhir || item.pendidikan || '',
    pendidikan: item.pendidikan || item.pendidikanTerakhir || '',
    pekerjaanUtama: item.pekerjaanUtama || item.pekerjaan || '',
    pekerjaan: item.pekerjaan || item.pekerjaanUtama || '',
    tempatLahir: item.tempatLahir || '',
    tanggalLahir: item.tanggalLahir || '',
    agama: item.agama || 'Islam',
    golonganDarah: item.golonganDarah || 'Tidak Tahu',
    statusPerkawinan: item.statusPerkawinan || 'Belum Kawin',
    shdk: item.shdk || 'Kepala Keluarga',
  }));
}

export async function addPenduduk(data: PendudukData) {
  const nama = data.namaLengkap || '';
  const dusun = data.dusunDomisili || '';
  const status = data.statusKependudukan || 'AKTIF';
  const pendidikan = data.pendidikanTerakhir || '';
  const pekerjaan = data.pekerjaanUtama || '';

  await prisma.penduduk.create({
    data: {
      ...data,
      nama,
      dusun,
      status,
      pendidikan,
      pekerjaan
    }
  });
  revalidatePath('/admin/penduduk');
  revalidatePath('/data-statistik');
  revalidatePath('/home');
}

export async function updatePenduduk(id: string, data: PendudukData) {
  const nama = data.namaLengkap || '';
  const dusun = data.dusunDomisili || '';
  const status = data.statusKependudukan || 'AKTIF';
  const pendidikan = data.pendidikanTerakhir || '';
  const pekerjaan = data.pekerjaanUtama || '';

  await prisma.penduduk.update({
    where: { id },
    data: {
      ...data,
      nama,
      dusun,
      status,
      pendidikan,
      pekerjaan
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
