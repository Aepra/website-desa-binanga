import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function AdminDashboard() {
  // 1. Fetch KPI Counts from Real Database Tables
  const totalPendudukDB = await prisma.penduduk.count();
  const uniqueKKGroup = await prisma.penduduk.groupBy({
    by: ['noKk'],
    _count: true
  });
  const totalKkDB = uniqueKKGroup.length;

  const totalWisata = await prisma.wisata.count();
  const totalUmkm = await prisma.umkm.count();
  const totalInfrastruktur = await prisma.infrastruktur.count();
  const totalBerita = await prisma.berita.count();

  // 2. Fetch APBDes
  const apbdesActive = await prisma.apbdes.findFirst({
    where: { isAktif: true },
    include: { rincian: true }
  });

  let totalPendapatanApbdes = 0;
  let totalBelanjaApbdes = 0;
  if (apbdesActive && apbdesActive.rincian) {
    totalPendapatanApbdes = apbdesActive.rincian
      .filter((r: any) => r.tipe === 'PENDAPATAN')
      .reduce((sum: number, r: any) => sum + r.anggaran, 0);
    totalBelanjaApbdes = apbdesActive.rincian
      .filter((r: any) => r.tipe === 'BELANJA')
      .reduce((sum: number, r: any) => sum + r.anggaran, 0);
  }

  // 3. Fetch Dusun Data (Calculated dynamically from real Penduduk entries)
  const allPenduduk = await prisma.penduduk.findMany({
    select: {
      id: true,
      nik: true,
      namaLengkap: true,
      jenisKelamin: true,
      dusunDomisili: true,
      pekerjaanUtama: true,
    }
  });

  const dusunListDB = await prisma.dusun.findMany({ orderBy: { nama: 'asc' } });
  const dusunChartData = dusunListDB.map(dusun => {
    const listInDusun = allPenduduk.filter(
      p => p.dusunDomisili && p.dusunDomisili.toLowerCase().trim() === dusun.nama.toLowerCase().trim()
    );

    const pria = listInDusun.filter(p => p.jenisKelamin?.toUpperCase().includes('LAKI')).length;
    const wanita = listInDusun.filter(p => p.jenisKelamin?.toUpperCase().includes('PEREMPUAN') || p.jenisKelamin?.toUpperCase().includes('WANITA')).length;

    return {
      name: dusun.nama,
      pria,
      wanita,
      total: listInDusun.length
    };
  });

  // 4. Fetch Real Category Breakdown for Pie Chart
  const wisataCategories = await prisma.wisata.groupBy({
    by: ['kategori'],
    _count: true
  });
  const umkmCategories = await prisma.umkm.groupBy({
    by: ['kategori'],
    _count: true
  });
  const infraCategories = await prisma.infrastruktur.groupBy({
    by: ['kategori'],
    _count: true
  });

  const categoryColors: Record<string, string> = {
    'Wisata Alam': '#10b981',
    'Wisata Budaya': '#3b82f6',
    'Wisata Edukasi': '#0284c7',
    'Wisata Religi': '#8b5cf6',
    'Wisata Kuliner': '#f59e0b',
    'Kuliner': '#f59e0b',
    'Kerajinan': '#ec4899',
    'Jasa': '#0ea5e9',
    'Pendidikan': '#3b82f6',
    'Kesehatan': '#10b981',
    'Peribadatan': '#8b5cf6',
    'Pemerintahan': '#64748b',
    'Fasilitas Umum': '#6366f1'
  };

  const potensiChartDataRaw: Array<{ name: string; value: number; color: string }> = [];

  wisataCategories.forEach((w, idx) => {
    potensiChartDataRaw.push({
      name: `Wisata: ${w.kategori}`,
      value: w._count,
      color: categoryColors[w.kategori] || ['#10b981', '#3b82f6', '#8b5cf6'][idx % 3]
    });
  });

  umkmCategories.forEach((u, idx) => {
    potensiChartDataRaw.push({
      name: `UMKM: ${u.kategori}`,
      value: u._count,
      color: categoryColors[u.kategori] || ['#f59e0b', '#d97706', '#ec4899'][idx % 3]
    });
  });

  infraCategories.forEach((i, idx) => {
    potensiChartDataRaw.push({
      name: `Fasilitas: ${i.kategori}`,
      value: i._count,
      color: categoryColors[i.kategori] || ['#64748b', '#6366f1', '#0ea5e9'][idx % 3]
    });
  });

  const potensiChartData = potensiChartDataRaw.filter(p => p.value > 0);

  // 5. Recent News Records
  const recentBeritaList = await prisma.berita.findMany({
    take: 5,
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      judul: true,
      kategori: true,
      publishedAt: true,
    }
  });

  const stats = {
    totalPenduduk: totalPendudukDB,
    totalKk: totalKkDB,
    totalWisata,
    totalUmkm,
    totalInfrastruktur,
    totalBerita,
    totalPendapatanApbdes,
    totalBelanjaApbdes,
  };

  return (
    <DashboardClient
      stats={stats}
      dusunChartData={dusunChartData}
      potensiChartData={potensiChartData}
      recentPendudukList={allPenduduk.map(p => ({
        ...p,
        nik: p.nik || '-',
        namaLengkap: p.namaLengkap || '-',
        jenisKelamin: p.jenisKelamin || '-',
        dusunDomisili: p.dusunDomisili || '-',
        pekerjaanUtama: p.pekerjaanUtama || '-'
      }))}
      recentBeritaList={recentBeritaList.map(b => ({
        id: b.id,
        judul: b.judul,
        kategori: b.kategori,
        publishedAt: b.publishedAt.toISOString(),
      }))}
    />
  );
}
