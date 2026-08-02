import ProfilDesaClient from './ProfilDesaClient';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { getLatestStatistikTahun, getStatistikByTahun } from '@/server/actions/statistik.action';
import { getPengaturan } from '@/server/actions/pengaturan.action';
import { getPerangkat } from '@/server/actions/struktur.action';

export const metadata: Metadata = {
  title: 'Profil Desa - Binanga',
};

export const revalidate = 60;

export default async function ProfilDesaPage() {
  const dbSejarah = await prisma.sejarah.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  const dbInfrastruktur = await prisma.infrastruktur.findMany({ orderBy: [{ kategori: 'asc' }, { nama: 'asc' }] });
  
  const latestYear = await getLatestStatistikTahun();
  const { globalStats, dusunStats } = await getStatistikByTahun(latestYear);

  const pengaturan = await getPengaturan();
  const perangkat = await getPerangkat();

  return (
    <ProfilDesaClient 
      dbSejarah={dbSejarah} 
      dbInfrastruktur={dbInfrastruktur}
      dbGlobalStats={globalStats}
      dbDusunList={dusunStats}
      dbPengaturan={pengaturan}
      dbPerangkat={perangkat}
    />
  );
}
