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

  const existing = await prisma.penduduk.findUnique({
    where: {
      nik_tahunData: { nik: data.nik, tahunData: data.tahunData }
    }
  });

  if (existing) {
    return { success: false, error: `NIK ${data.nik} sudah terdaftar pada tahun ${data.tahunData}.` };
  }

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
  return { success: true };
}

export async function updatePenduduk(id: string, data: PendudukData) {
  const nama = data.namaLengkap || '';
  const dusun = data.dusunDomisili || '';
  const status = data.statusKependudukan || 'AKTIF';
  const pendidikan = data.pendidikanTerakhir || '';
  const pekerjaan = data.pekerjaanUtama || '';

  // Check for existing NIK in the same year, but exclude the current record ID
  const existing = await prisma.penduduk.findFirst({
    where: {
      nik: data.nik,
      tahunData: data.tahunData,
      id: { not: id } // exclude self
    }
  });

  if (existing) {
    return { success: false, error: `Gagal memperbarui: NIK ${data.nik} sudah digunakan oleh penduduk lain pada tahun ${data.tahunData}.` };
  }

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
  return { success: true };
}
export async function deletePenduduk(id: string) {
  await prisma.penduduk.delete({
    where: { id }
  });
  revalidatePath('/admin/penduduk');
  revalidatePath('/data-statistik');
  revalidatePath('/home');
}

export async function importPendudukBatch(data: any[], tahunData: number) {
  const mappedData = data.map((item) => {
    return {
      nik: item['NIK']?.toString() || '',
      noKk: item['No KK']?.toString() || '',
      namaLengkap: item['Nama Lengkap']?.toString() || '',
      nama: item['Nama Lengkap']?.toString() || '',
      jenisKelamin: item['Jenis Kelamin']?.toString() || 'LAKI-LAKI',
      tempatLahir: item['Tempat Lahir']?.toString() || '',
      tanggalLahir: item['Tanggal Lahir']?.toString() || '',
      agama: item['Agama']?.toString() || 'Islam',
      pendidikanTerakhir: item['Pendidikan Terakhir']?.toString() || '',
      pendidikan: item['Pendidikan Terakhir']?.toString() || '',
      pekerjaanUtama: item['Pekerjaan Utama']?.toString() || '',
      pekerjaan: item['Pekerjaan Utama']?.toString() || '',
      golonganDarah: item['Golongan Darah']?.toString() || 'Tidak Tahu',
      statusPerkawinan: item['Status Perkawinan']?.toString() || 'Belum Kawin',
      shdk: item['SHDK']?.toString() || 'Kepala Keluarga',
      dusunDomisili: item['Dusun Domisili']?.toString() || '',
      dusun: item['Dusun Domisili']?.toString() || '',
      statusKependudukan: item['Status Kependudukan']?.toString() || 'AKTIF',
      status: item['Status Kependudukan']?.toString() || 'AKTIF',
      tahunData: tahunData,
    };
  });

  // Pengecekan NIK duplikat
  const niksToImport = mappedData.map(d => d.nik).filter(Boolean);
  const existingRecords = await prisma.penduduk.findMany({
    where: {
      tahunData,
      nik: { in: niksToImport }
    },
    select: { nik: true }
  });

  if (existingRecords.length > 0) {
    const existingNiks = existingRecords.map(r => r.nik);
    return {
      success: false,
      error: 'Ditemukan NIK yang sudah terdaftar di database pada tahun tersebut.',
      duplicates: existingNiks
    };
  }

  let successCount = 0;
  for (const record of mappedData) {
    if (!record.nik) continue; 
    await prisma.penduduk.create({
      data: record
    });
    successCount++;
  }

  revalidatePath('/admin/penduduk');
  revalidatePath('/data-statistik');
  revalidatePath('/home');
  return { success: true, count: successCount };
}
