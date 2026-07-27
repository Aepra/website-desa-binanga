'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// ==========================================
// STATISTIK GLOBAL
// ==========================================

export async function getStatistikGlobal() {
  try {
    const data = await prisma.statistikGlobal.findFirst({
      orderBy: { tahun: 'desc' },
    });
    return data;
  } catch (error) {
    console.error('Error fetching Statistik Global:', error);
    return null;
  }
}

export async function upsertStatistikGlobal(data: {
  tahun: number;
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  totalKk: number;
  kepadatan?: number;
  luasDesaHa?: number;
  sumber: string;
}) {
  try {
    const result = await prisma.statistikGlobal.upsert({
      where: { tahun: data.tahun },
      update: data,
      create: data,
    });
    revalidatePath('/admin/statistik');
    revalidatePath('/data-statistik');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error upserting Statistik Global:', error);
    return { success: false, error: 'Gagal menyimpan data statistik global.' };
  }
}

// ==========================================
// DUSUN
// ==========================================

export async function getDusunList() {
  try {
    const data = await prisma.dusun.findMany({
      orderBy: { nama: 'asc' },
      include: {
        penduduk: { orderBy: { tahun: 'desc' }, take: 1 },
        pendidikan: { orderBy: { tahun: 'desc' }, take: 1 },
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching Dusun List:', error);
    return [];
  }
}

export async function createDusun(data: { nama: string; luasHa: number }) {
  try {
    const result = await prisma.dusun.create({
      data,
    });
    revalidatePath('/admin/statistik');
    revalidatePath('/data-statistik');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating Dusun:', error);
    return { success: false, error: 'Gagal menambah Dusun. Nama mungkin sudah ada.' };
  }
}

export async function deleteDusun(id: string) {
  try {
    // Delete related stats first
    await prisma.statistikPendudukDusun.deleteMany({ where: { dusunId: id } });
    await prisma.statistikPendidikanDusun.deleteMany({ where: { dusunId: id } });
    
    await prisma.dusun.delete({
      where: { id },
    });
    revalidatePath('/admin/statistik');
    revalidatePath('/data-statistik');
    return { success: true };
  } catch (error) {
    console.error('Error deleting Dusun:', error);
    return { success: false, error: 'Gagal menghapus Dusun.' };
  }
}

// ==========================================
// STATISTIK PENDUDUK DUSUN
// ==========================================

export async function getStatistikPenduduk(dusunId: string, tahun: number) {
  try {
    return await prisma.statistikPendudukDusun.findUnique({
      where: {
        dusunId_tahun: { dusunId, tahun }
      }
    });
  } catch (error) {
    console.error('Error fetching Statistik Penduduk Dusun:', error);
    return null;
  }
}

export async function upsertStatistikPenduduk(data: {
  dusunId: string;
  tahun: number;
  lakiLaki: number;
  perempuan: number;
  totalJiwa: number;
  totalKk: number;
}) {
  try {
    const result = await prisma.statistikPendudukDusun.upsert({
      where: {
        dusunId_tahun: { dusunId: data.dusunId, tahun: data.tahun }
      },
      update: {
        lakiLaki: data.lakiLaki,
        perempuan: data.perempuan,
        totalJiwa: data.totalJiwa,
        totalKk: data.totalKk,
      },
      create: data,
    });
    revalidatePath('/admin/statistik');
    revalidatePath('/data-statistik');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error upserting Statistik Penduduk Dusun:', error);
    return { success: false, error: 'Gagal menyimpan data penduduk dusun.' };
  }
}

// ==========================================
// STATISTIK PENDIDIKAN DUSUN
// ==========================================

export async function upsertStatistikPendidikan(data: {
  dusunId: string;
  tahun: number;
  tanpaIjazah: number;
  sd: number;
  smp: number;
  sma: number;
  diploma: number;
  s1: number;
  s2: number;
}) {
  try {
    const result = await prisma.statistikPendidikanDusun.upsert({
      where: {
        dusunId_tahun: { dusunId: data.dusunId, tahun: data.tahun }
      },
      update: {
        tanpaIjazah: data.tanpaIjazah,
        sd: data.sd,
        smp: data.smp,
        sma: data.sma,
        diploma: data.diploma,
        s1: data.s1,
        s2: data.s2,
      },
      create: data,
    });
    revalidatePath('/admin/statistik');
    revalidatePath('/data-statistik');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error upserting Statistik Pendidikan Dusun:', error);
    return { success: false, error: 'Gagal menyimpan data pendidikan dusun.' };
  }
}

// ==========================================
// BULK OPERATIONS (TIME SERIES GRID)
// ==========================================

export async function getAllStatistikHistory() {
  try {
    const history = await prisma.statistikGlobal.findMany({
      orderBy: { tahun: 'desc' }
    });
    return history;
  } catch (error) {
    console.error('Error fetching statistik history:', error);
    return [];
  }
}

export async function getLatestStatistikTahun() {
  try {
    const latestPenduduk = await prisma.penduduk.findFirst({
      orderBy: { tahunData: 'desc' },
      select: { tahunData: true }
    });
    if (latestPenduduk) return latestPenduduk.tahunData;

    const latest = await prisma.statistikGlobal.findFirst({
      orderBy: { tahun: 'desc' },
      select: { tahun: true }
    });
    return latest?.tahun || new Date().getFullYear();
  } catch (error) {
    console.error('Error fetching latest tahun:', error);
    return new Date().getFullYear();
  }
}

export async function getStatistikByTahun(tahun: number) {
  try {
    // 1. Dapatkan fallback untuk luas
    const fallbackGlobal = await prisma.statistikGlobal.findUnique({
      where: { tahun }
    });

    // 2. Kalkulasi Global dari Penduduk
    const totalPria = await prisma.penduduk.count({ where: { tahunData: tahun, jenisKelamin: 'LAKI_LAKI', status: 'AKTIF' } });
    const totalWanita = await prisma.penduduk.count({ where: { tahunData: tahun, jenisKelamin: 'PEREMPUAN', status: 'AKTIF' } });
    const totalPenduduk = totalPria + totalWanita;
    
    const distinctKks = await prisma.penduduk.findMany({
      where: { tahunData: tahun, status: 'AKTIF' },
      select: { noKk: true },
      distinct: ['noKk']
    });
    const totalKk = distinctKks.length;

    const globalStats = {
      tahun: tahun,
      totalPenduduk: totalPenduduk > 0 ? totalPenduduk : (fallbackGlobal?.totalPenduduk || 0),
      lakiLaki: totalPenduduk > 0 ? totalPria : (fallbackGlobal?.lakiLaki || 0),
      perempuan: totalPenduduk > 0 ? totalWanita : (fallbackGlobal?.perempuan || 0),
      totalKk: totalPenduduk > 0 ? totalKk : (fallbackGlobal?.totalKk || 0),
      kepadatan: fallbackGlobal?.kepadatan || 0,
      luasDesaHa: fallbackGlobal?.luasDesaHa || 0,
      sumber: "Sistem Informasi Desa (Otomatis)"
    };
    
    // 3. Kalkulasi Dusun dari Penduduk
    const dusunList = await prisma.dusun.findMany({
      orderBy: { nama: 'asc' },
      include: {
        pendidikan: { where: { tahun }, take: 1 } // Pendidikan tetap manual dulu
      }
    });

    const dusunStats = await Promise.all(dusunList.map(async (dusun) => {
      const pDusunPria = await prisma.penduduk.count({ where: { tahunData: tahun, dusun: dusun.nama, jenisKelamin: 'LAKI_LAKI', status: 'AKTIF' } });
      const pDusunWanita = await prisma.penduduk.count({ where: { tahunData: tahun, dusun: dusun.nama, jenisKelamin: 'PEREMPUAN', status: 'AKTIF' } });
      const pDusunTotal = pDusunPria + pDusunWanita;
      
      const pDusunKks = await prisma.penduduk.findMany({
        where: { tahunData: tahun, dusun: dusun.nama, status: 'AKTIF' },
        select: { noKk: true },
        distinct: ['noKk']
      });

      // Construct a fake StatistikPendudukDusun record to satisfy frontend expectations
      const computedPendudukDusun = {
        id: 'computed',
        dusunId: dusun.id,
        tahun: tahun,
        lakiLaki: pDusunPria,
        perempuan: pDusunWanita,
        totalJiwa: pDusunTotal,
        totalKk: pDusunKks.length,
        ktpPunya: 0,
        ktpBelum: 0,
        tinggalDiBawah10: 0,
        tinggalDiAtas10: 0,
        lahanPerkebunan: 0,
        lahanPemukiman: 0,
        lahanLainnya: 0
      };

      // Fallback to manual if no data
      if (pDusunTotal === 0) {
        const manual = await prisma.statistikPendudukDusun.findFirst({
          where: { dusunId: dusun.id, tahun }
        });
        if (manual) Object.assign(computedPendudukDusun, manual);
      }

      return {
        ...dusun,
        penduduk: [computedPendudukDusun]
      };
    }));

    return { globalStats, dusunStats };
  } catch (error) {
    console.error('Error fetching statistik by tahun:', error);
    return { globalStats: null, dusunStats: [] };
  }
}

export async function upsertBulkStatistik(
  tahun: number, 
  globalPayload: any, 
  dusunPayload: { id: string; penduduk: any; pendidikan: any }[]
) {
  try {
    // 1. Upsert Global Stats
    await prisma.statistikGlobal.upsert({
      where: { tahun },
      update: globalPayload,
      create: { ...globalPayload, tahun },
    });

    // 2. Loop & Upsert Dusun Stats
    for (const d of dusunPayload) {
      if (d.penduduk) {
        await prisma.statistikPendudukDusun.upsert({
          where: { dusunId_tahun: { dusunId: d.id, tahun } },
          update: {
            lakiLaki: d.penduduk.lakiLaki,
            perempuan: d.penduduk.perempuan,
            totalJiwa: d.penduduk.totalJiwa,
            totalKk: d.penduduk.totalKk,
            ktpPunya: d.penduduk.ktpPunya,
            ktpBelum: d.penduduk.ktpBelum,
            tinggalDiBawah10: d.penduduk.tinggalDiBawah10,
            tinggalDiAtas10: d.penduduk.tinggalDiAtas10,
            lahanPerkebunan: d.penduduk.lahanPerkebunan,
            lahanPemukiman: d.penduduk.lahanPemukiman,
            lahanLainnya: d.penduduk.lahanLainnya,
          },
          create: {
            dusunId: d.id,
            tahun,
            lakiLaki: d.penduduk.lakiLaki,
            perempuan: d.penduduk.perempuan,
            totalJiwa: d.penduduk.totalJiwa,
            totalKk: d.penduduk.totalKk,
            ktpPunya: d.penduduk.ktpPunya,
            ktpBelum: d.penduduk.ktpBelum,
            tinggalDiBawah10: d.penduduk.tinggalDiBawah10,
            tinggalDiAtas10: d.penduduk.tinggalDiAtas10,
            lahanPerkebunan: d.penduduk.lahanPerkebunan,
            lahanPemukiman: d.penduduk.lahanPemukiman,
            lahanLainnya: d.penduduk.lahanLainnya,
          }
        });
      }
      
      if (d.pendidikan) {
        await prisma.statistikPendidikanDusun.upsert({
          where: { dusunId_tahun: { dusunId: d.id, tahun } },
          update: {
            tanpaIjazah: d.pendidikan.tanpaIjazah,
            sd: d.pendidikan.sd,
            smp: d.pendidikan.smp,
            sma: d.pendidikan.sma,
            diploma: d.pendidikan.diploma,
            s1: d.pendidikan.s1,
            s2: d.pendidikan.s2,
          },
          create: {
            dusunId: d.id,
            tahun,
            tanpaIjazah: d.pendidikan.tanpaIjazah,
            sd: d.pendidikan.sd,
            smp: d.pendidikan.smp,
            sma: d.pendidikan.sma,
            diploma: d.pendidikan.diploma,
            s1: d.pendidikan.s1,
            s2: d.pendidikan.s2,
          }
        });
      }
    }

    revalidatePath('/admin/statistik');
    revalidatePath('/data-statistik');
    return { success: true };
  } catch (error) {
    console.error('Error upserting bulk statistik:', error);
    return { success: false, error: 'Gagal melakukan update masal. Periksa log.' };
  }
}

