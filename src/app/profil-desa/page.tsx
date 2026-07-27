import ProfilDesaClient from './ProfilDesaClient';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil Desa - Binanga',
};

export default async function ProfilDesaPage() {
  const dbSejarah = await prisma.sejarah.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  const dbInfrastruktur = await prisma.infrastruktur.findMany({ orderBy: [{ kategori: 'asc' }, { nama: 'asc' }] });
  
  // Get latest global stats for Angka Dasar
  const dbGlobalStats = await prisma.statistikGlobal.findFirst({
    orderBy: { tahun: 'desc' }
  });

  return (
    <ProfilDesaClient 
      dbSejarah={dbSejarah} 
      dbInfrastruktur={dbInfrastruktur}
      dbGlobalStats={dbGlobalStats}
    />
  );
}
