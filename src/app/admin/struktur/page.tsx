import { getPerangkat, createPerangkat, deletePerangkat } from './actions';
import OrgChart from '@/components/OrgChart';

export default async function PerangkatPage() {
  const data = await getPerangkat();

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>Manajemen Struktur Organisasi</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Gunakan denah di bawah ini untuk menyusun hierarki pemerintahan desa.</p>
        </div>
      </div>
      
      <OrgChart data={data} onCreate={createPerangkat} onDelete={deletePerangkat} />
    </div>
  );
}
