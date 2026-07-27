import { getSejarahList } from './actions';
import SejarahClient from './SejarahClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Sejarah - Admin Desa',
};

export default async function AdminSejarahPage() {
  const initialData = await getSejarahList();
  
  return (
    <SejarahClient initialData={initialData} />
  );
}
