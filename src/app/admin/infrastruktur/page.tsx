import { getInfrastrukturList } from '@/server/actions/infrastruktur.action';
import InfrastrukturClient from './InfrastrukturClient';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Manajemen Infrastruktur - Admin Desa',
};

export default async function AdminInfrastrukturPage() {
  const initialData = await getInfrastrukturList();
  const dusunList = await prisma.dusun.findMany({ orderBy: { nama: 'asc' } });
  
  return (
    <InfrastrukturClient initialData={initialData} dusunList={dusunList} />
  );
}
