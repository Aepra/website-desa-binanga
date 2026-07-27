import React from 'react';
import DataStatistikClient from './DataStatistikClient';
import { getLatestStatistikTahun, getStatistikByTahun } from '@/app/admin/statistik/actions';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Data & Statistik - Desa Binanga',
  description: 'Visualisasi data demografi, pendidikan, wilayah, dan transparansi APBDes Desa Binanga.',
};

export const dynamic = 'force-dynamic';

export default async function DataStatistikPage() {
  const latestYear = await getLatestStatistikTahun();
  const { globalStats, dusunStats } = await getStatistikByTahun(latestYear);
  
  // Fetch APBDes
  const apbdesData = await prisma.apbdes.findMany({
    orderBy: { tahun: 'desc' },
    include: { rincian: true }
  });
  
  const serializedApbdesList = apbdesData.map(apbdes => ({
    ...apbdes,
    rincian: apbdes.rincian.map(r => ({
      ...r,
      anggaran: Number(r.anggaran),
      realisasi: Number(r.realisasi)
    }))
  }));

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div id="kependudukan">
        <DataStatistikClient 
          dbGlobalStats={globalStats} 
          dbDusunList={dusunStats} 
          latestYear={latestYear}
          dbApbdesList={serializedApbdesList}
        />
      </div>
    </main>
  );
}
