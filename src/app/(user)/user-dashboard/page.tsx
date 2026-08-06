import dynamic from 'next/dynamic';

export const revalidate = 0;

const UserDashboardClient = dynamic(
  () => import('./UserDashboardClient'),
  { 
    ssr: false,
    loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#64748b' }}>Memuat Dashboard...</div>
  }
);

export default function UserDashboardPage() {
  return <UserDashboardClient />;
}
