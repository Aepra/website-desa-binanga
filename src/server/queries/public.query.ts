'use server';

import { prisma } from '@/lib/prisma';

export interface Post {
  id: string;
  type: 'berita' | 'agenda';
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  cover: string;
  ringkasan: string;
  created_at: string;
}

export interface UMKM {
  id: string;
  nama: string;
  kategori: string;
  foto: string;
  deskripsi: string;
  kontak: string;
  created_at: string;
}

export interface Wisata {
  id: string;
  nama: string;
  kategori: string;
  foto: string;
  deskripsi: string;
  harga?: number | null;
  jamBuka?: string | null;
  linkMaps?: string | null;
}

export interface Statistik {
  penduduk: number;
  kepala_keluarga: number;
  luas_wilayah: number;
  realisasi_anggaran: number;
}

export interface PerangkatDesa {
  id: string;
  nama: string;
  jabatan: string;
  foto: string;
}

// ==============================
// 1. STATISTIK
// ==============================
export async function getStatistikDB(): Promise<Statistik> {
  // Ambil tahun terkini dari data penduduk
  const latestPenduduk = await prisma.penduduk.findFirst({
    orderBy: { tahunData: 'desc' },
    select: { tahunData: true }
  });

  let totalPenduduk = 0;
  let totalKk = 0;

  if (latestPenduduk) {
    const tahun = latestPenduduk.tahunData;
    totalPenduduk = await prisma.penduduk.count({
      where: {
        tahunData: tahun,
        status: 'AKTIF'
      }
    });
    
    // Total KK = jumlah unique KK
    const kks = await prisma.penduduk.findMany({
      where: {
        tahunData: tahun,
        status: 'AKTIF'
      },
      select: { noKk: true },
      distinct: ['noKk']
    });
    totalKk = kks.length;
  } else {
    // Fallback ke StatistikGlobal manual jika belum ada data penduduk
    const stat = await prisma.statistikGlobal.findFirst({
      orderBy: { tahun: 'desc' }
    });
    if (stat) {
      totalPenduduk = stat.totalPenduduk;
      totalKk = stat.totalKk;
    }
  }

  // Luas wilayah tetap ambil dari StatistikGlobal atau fallback ke data BPS resmi
  // Sumber: BPS Kab. Majene 2025 — Kecamatan Sendana Dalam Angka, Tabel 1.1.1
  const statGlobal = await prisma.statistikGlobal.findFirst({ orderBy: { tahun: 'desc' }});
  const LUAS_DESA_KM2_BPS = 1.68; // km² dari BPS BAPEDA Kab. Majene (tetap, tidak berubah)
  
  return {
    penduduk: totalPenduduk,
    kepala_keluarga: totalKk,
    luas_wilayah: statGlobal?.luasDesaHa ? statGlobal.luasDesaHa / 100 : LUAS_DESA_KM2_BPS,
    realisasi_anggaran: 0
  };
}

// ==============================
// 2. POSTS (Berita & Agenda)
// ==============================
export async function getPostsDB(limit?: number, kategori?: string): Promise<Post[]> {
  const filter = kategori ? { kategori } : {};
  const data = await prisma.berita.findMany({
    where: filter,
    orderBy: { publishedAt: 'desc' },
    take: limit
  });
  
  return data.map(b => ({
    id: b.id,
    type: (b.kategori === 'AGENDA' ? 'agenda' : 'berita') as any,
    judul: b.judul,
    slug: b.slug,
    kategori: b.kategori,
    tanggal: b.publishedAt.toISOString(),
    cover: b.fotoUrl || '',
    ringkasan: b.konten.substring(0, 100) + '...',
    created_at: b.createdAt.toISOString()
  }));
}

// ==============================
// 3. UMKM
// ==============================
export async function getUmkmDB(limit?: number): Promise<UMKM[]> {
  const data = await prisma.umkm.findMany({
    where: { status: 'DISETUJUI' },
    orderBy: { createdAt: 'desc' },
    take: limit
  });

  return data.map(u => ({
    id: u.id,
    nama: u.nama,
    kategori: u.kategori,
    foto: u.fotoUrl || '',
    deskripsi: u.deskripsi,
    kontak: u.kontakWa || '',
    created_at: u.createdAt.toISOString()
  }));
}

// ==============================
// 4. WISATA
// ==============================
export async function getWisataDB(limit?: number): Promise<Wisata[]> {
  const data = await prisma.wisataPotensi.findMany({
    orderBy: { createdAt: 'desc' },
    ...(limit ? { take: limit } : {})
  });

  return data.map(w => ({
    id: w.id,
    nama: w.nama,
    kategori: w.kategori,
    foto: w.fotoUrl || '',
    deskripsi: w.deskripsi,
    jamBuka: w.jamBuka,
    linkMaps: w.linkMaps,
  }));
}

// ==============================
// 5. PERANGKAT DESA
// ==============================
export async function getPerangkatDesaDB(): Promise<PerangkatDesa[]> {
  const data = await prisma.perangkatDesa.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return data.map(p => ({
    id: p.id,
    nama: p.nama,
    jabatan: p.jabatan,
    foto: p.fotoUrl || '',
  }));
}

// ==============================
// 6. APBDES (Aktif)
// ==============================
export async function getApbdesActiveDB(): Promise<any> {
  const active = await prisma.apbdes.findFirst({
    where: { isAktif: true },
    include: { rincian: true }
  });

  if (!active) return null;

  return {
    ...active,
    rincian: active.rincian.map(r => ({
      ...r,
      anggaran: Number(r.anggaran),
      realisasi: Number(r.realisasi)
    }))
  };
}

// ==============================
// 7. INFRASTRUKTUR / FASILITAS
// ==============================
export async function getInfrastrukturDB(limit?: number): Promise<any[]> {
  return await prisma.infrastruktur.findMany({
    orderBy: [{ kategori: 'asc' }, { nama: 'asc' }],
    take: limit
  });
}
