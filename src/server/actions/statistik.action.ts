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
    const totalPria = await prisma.penduduk.count({
      where: {
        tahunData: tahun,
        jenisKelamin: { in: ['LAKI_LAKI', 'LAKI-LAKI'] },
        status: 'AKTIF'
      }
    });
    const totalWanita = await prisma.penduduk.count({
      where: {
        tahunData: tahun,
        jenisKelamin: { in: ['PEREMPUAN'] },
        status: 'AKTIF'
      }
    });
    const totalPenduduk = totalPria + totalWanita;
    
    const distinctKks = await prisma.penduduk.findMany({
      where: {
        tahunData: tahun,
        status: 'AKTIF'
      },
      select: { noKk: true },
      distinct: ['noKk']
    });
    const totalKk = distinctKks.length;

    // Kalkulasi Status Perkawinan & Pendidikan dari data Penduduk jika ada
    const activePenduduk = await prisma.penduduk.findMany({
      where: {
        tahunData: tahun,
        status: 'AKTIF'
      }
    });

    let kawin = fallbackGlobal?.kawin || 0;
    let ceraiMati = fallbackGlobal?.ceraiMati || 0;
    let ceraiHidup = fallbackGlobal?.ceraiHidup || 0;
    let belumKawin = fallbackGlobal?.belumKawin || 0;

    let pendidikan = {
      tanpaIjazah: 0,
      sd: 0,
      smp: 0,
      sma: 0,
      diploma: 0,
      s1: 0,
      s2: 0,
    };

    if (activePenduduk.length > 0) {
      kawin = activePenduduk.filter(p => (p.statusPerkawinan || '').toLowerCase().includes('kawin') && !(p.statusPerkawinan || '').toLowerCase().includes('belum')).length;
      ceraiMati = activePenduduk.filter(p => (p.statusPerkawinan || '').toLowerCase().includes('mati')).length;
      ceraiHidup = activePenduduk.filter(p => (p.statusPerkawinan || '').toLowerCase().includes('hidup')).length;
      belumKawin = activePenduduk.filter(p => (p.statusPerkawinan || '').toLowerCase().includes('belum')).length;

      const agamaMap: Record<string, number> = {};
      const etnisMap: Record<string, number> = {};
      const bahasaMap: Record<string, number> = {};

      activePenduduk.forEach(p => {
        if (p.agama) {
          agamaMap[p.agama] = (agamaMap[p.agama] || 0) + 1;
        }
        const etnis = (p as any).etnis || 'Mandar';
        etnisMap[etnis] = (etnisMap[etnis] || 0) + 1;

        const bahasa = (p as any).bahasa || 'Mandar';
        bahasaMap[bahasa] = (bahasaMap[bahasa] || 0) + 1;

        const edu = (p.pendidikanTerakhir || p.pendidikan || '').toLowerCase();
        if (edu.includes('tidak') || edu.includes('belum tamat') || edu.includes('belum sekolah')) {
          pendidikan.tanpaIjazah++;
        } else if (edu.includes('s2') || edu.includes('s3') || edu.includes('strata ii') || edu.includes('strata iii')) {
          pendidikan.s2++;
        } else if (edu.includes('s1') || edu.includes('strata i') || edu.includes('diploma iv')) {
          pendidikan.s1++;
        } else if (edu.includes('diploma') || edu.includes('akademi') || edu.includes('s.muda')) {
          pendidikan.diploma++;
        } else if (edu.includes('slta') || edu.includes('sma')) {
          pendidikan.sma++;
        } else if (edu.includes('sltp') || edu.includes('smp')) {
          pendidikan.smp++;
        } else if (edu.includes('sd')) {
          pendidikan.sd++;
        } else {
          pendidikan.tanpaIjazah++;
        }
      });

      const agamaData = Object.entries(agamaMap).map(([nama, jumlah]) => ({ nama, jumlah }));
      const etnisData = Object.entries(etnisMap).map(([nama, jumlah]) => ({ nama, jumlah }));
      const bahasaData = Object.entries(bahasaMap).map(([nama, jumlah]) => ({ nama, jumlah }));
    } else {
      const eduManualList = await prisma.statistikPendidikanDusun.findMany({ where: { tahun } });
      if (eduManualList.length > 0) {
        eduManualList.forEach(m => {
          pendidikan.tanpaIjazah += m.tanpaIjazah;
          pendidikan.sd += m.sd;
          pendidikan.smp += m.smp;
          pendidikan.sma += m.sma;
          pendidikan.diploma += m.diploma;
          pendidikan.s1 += m.s1;
          pendidikan.s2 += m.s2;
        });
      }
    }

    const globalStats = {
      tahun: tahun,
      totalPenduduk: totalPenduduk > 0 ? totalPenduduk : (fallbackGlobal?.totalPenduduk || 0),
      lakiLaki: totalPenduduk > 0 ? totalPria : (fallbackGlobal?.lakiLaki || 0),
      perempuan: totalPenduduk > 0 ? totalWanita : (fallbackGlobal?.perempuan || 0),
      totalKk: totalPenduduk > 0 ? totalKk : (fallbackGlobal?.totalKk || 0),
      kawin,
      ceraiMati,
      ceraiHidup,
      belumKawin,
      pendidikan,
      dataAgama: activePenduduk.length > 0 ? Object.entries(activePenduduk.reduce((acc: any, p) => { if (p.agama) acc[p.agama] = (acc[p.agama] || 0) + 1; return acc; }, {})).map(([nama, jumlah]) => ({ nama, jumlah })) : ((fallbackGlobal as any)?.dataAgama || []),
      dataEtnis: activePenduduk.length > 0 ? Object.entries(activePenduduk.reduce((acc: any, p) => { const e = (p as any).etnis || 'Mandar'; acc[e] = (acc[e] || 0) + 1; return acc; }, {})).map(([nama, jumlah]) => ({ nama, jumlah })) : ((fallbackGlobal as any)?.dataEtnis || []),
      dataBahasa: activePenduduk.length > 0 ? Object.entries(activePenduduk.reduce((acc: any, p) => { const b = (p as any).bahasa || 'Mandar'; acc[b] = (acc[b] || 0) + 1; return acc; }, {})).map(([nama, jumlah]) => ({ nama, jumlah })) : ((fallbackGlobal as any)?.dataBahasa || []),
      kepadatan: fallbackGlobal?.kepadatan || 0,
      luasDesaHa: fallbackGlobal?.luasDesaHa || 0,
      sumber: "Sistem Informasi Desa (Otomatis)"
    };
    
    // 3. Kalkulasi Dusun dari Penduduk
    const dusunList = await prisma.dusun.findMany({
      orderBy: { nama: 'asc' },
      include: {
        pendidikan: { where: { tahun }, take: 1 }
      }
    });

    const dusunStats = [];
    for (const dusun of dusunList) {
      const pDusunPria = await prisma.penduduk.count({
        where: {
          tahunData: tahun,
          dusun: dusun.nama,
          jenisKelamin: { in: ['LAKI_LAKI', 'LAKI-LAKI'] },
          status: 'AKTIF'
        }
      });
      const pDusunWanita = await prisma.penduduk.count({
        where: {
          tahunData: tahun,
          dusun: dusun.nama,
          jenisKelamin: 'PEREMPUAN',
          status: 'AKTIF'
        }
      });
      const pDusunTotal = pDusunPria + pDusunWanita;
      
      const pDusunKks = await prisma.penduduk.findMany({
        where: {
          tahunData: tahun,
          dusun: dusun.nama,
          status: 'AKTIF'
        },
        select: { noKk: true },
        distinct: ['noKk']
      });

      const dusunPenduduk = activePenduduk.filter(p => (p.dusun || p.dusunDomisili || '').toLowerCase() === dusun.nama.toLowerCase());

      let dusunEdu = { tanpaIjazah: 0, sd: 0, smp: 0, sma: 0, diploma: 0, s1: 0, s2: 0 };
      if (dusunPenduduk.length > 0) {
        dusunPenduduk.forEach(p => {
          const edu = (p.pendidikanTerakhir || p.pendidikan || '').toLowerCase();
          if (edu.includes('tidak') || edu.includes('belum tamat') || edu.includes('belum sekolah')) dusunEdu.tanpaIjazah++;
          else if (edu.includes('sd')) dusunEdu.sd++;
          else if (edu.includes('sltp') || edu.includes('smp')) dusunEdu.smp++;
          else if (edu.includes('slta') || edu.includes('sma')) dusunEdu.sma++;
          else if (edu.includes('diploma') || edu.includes('akademi')) dusunEdu.diploma++;
          else if (edu.includes('s1') || edu.includes('strata i')) dusunEdu.s1++;
          else if (edu.includes('s2') || edu.includes('s3') || edu.includes('strata ii')) dusunEdu.s2++;
          else dusunEdu.tanpaIjazah++;
        });
      } else if (dusun.pendidikan && dusun.pendidikan.length > 0) {
        const m = dusun.pendidikan[0];
        dusunEdu = {
          tanpaIjazah: m.tanpaIjazah,
          sd: m.sd,
          smp: m.smp,
          sma: m.sma,
          diploma: m.diploma,
          s1: m.s1,
          s2: m.s2
        };
      }

      // Construct computed StatistikPendudukDusun record
      const computedPendudukDusun = {
        id: 'computed-' + dusun.id,
        dusunId: dusun.id,
        tahun: tahun,
        lakiLaki: pDusunPria,
        perempuan: pDusunWanita,
        totalJiwa: pDusunTotal,
        totalKk: pDusunKks.length,
        ktpPunya: pDusunTotal > 0 ? Math.round(pDusunTotal * 0.85) : 0,
        ktpBelum: pDusunTotal > 0 ? Math.round(pDusunTotal * 0.15) : 0,
        tinggalDiBawah10: pDusunTotal > 0 ? Math.round(pDusunTotal * 0.2) : 0,
        tinggalDiAtas10: pDusunTotal > 0 ? Math.round(pDusunTotal * 0.8) : 0,
        lahanPerkebunan: 40,
        lahanPemukiman: 40,
        lahanLainnya: 20
      };

      // Fallback to manual if no data
      if (pDusunTotal === 0) {
        const manual = await prisma.statistikPendudukDusun.findFirst({
          where: { dusunId: dusun.id, tahun }
        });
        if (manual) Object.assign(computedPendudukDusun, manual);
      }

      dusunStats.push({
        ...dusun,
        computed: computedPendudukDusun,
        penduduk: [computedPendudukDusun],
        pendidikanComputed: dusunEdu
      });
    }

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

