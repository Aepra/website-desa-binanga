import { getAdminUsers } from '@/server/actions/admin-user.action';
import KelolaAdminClient from './KelolaAdminClient';

export default async function KelolaAdminPage() {
  const users = await getAdminUsers();
  return <KelolaAdminClient initialUsers={users} />;
}
