import React from 'react';
import DataStatistikClient from './DataStatistikClient';
import { getLatestStatistikTahun, getStatistikByTahun } from '@/server/actions/statistik.action';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Data & Statistik - Desa Binanga',
  description: 'Visualisasi data demografi, pendidikan, wilayah, dan transparansi APBDes Desa Binanga.',
};

export const dynamic = 'force-dynamic';

export default async function DataStatistikPage() {
  console.log('[SSR] DataStatistikPage started');
  const latestYear = await getLatestStatistikTahun();
  console.log('[SSR] latestYear:', latestYear);
  
  const { globalStats, dusunStats } = await getStatistikByTahun(latestYear);
  console.log('[SSR] getStatistikByTahun finished');
  
  // Fetch APBDes
  const apbdesData = await prisma.apbdes.findMany({
    orderBy: { tahun: 'desc' },
    include: { rincian: true }
  });
  console.log('[SSR] apbdes fetched');
  
  const serializedApbdesList = apbdesData.map(apbdes => ({
    ...apbdes,
    rincian: apbdes.rincian.map(r => ({
      ...r,
      anggaran: Number(r.anggaran),
      realisasi: Number(r.realisasi)
    }))
  }));

  const infrastrukturData = await prisma.infrastruktur.findMany();

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div id="kependudukan">
        <DataStatistikClient 
          dbGlobalStats={globalStats} 
          dbDusunList={dusunStats} 
          latestYear={latestYear}
          dbApbdesList={serializedApbdesList}
          dbInfrastrukturList={infrastrukturData}
        />
      </div>
    </main>
  );
}
