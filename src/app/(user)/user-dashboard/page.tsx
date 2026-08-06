import { Suspense } from 'react';
import UserDashboardClient from './UserDashboardClient';

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#64748b' }}>Memuat Dashboard...</div>}>
      <UserDashboardClient />
    </Suspense>
  );
}
