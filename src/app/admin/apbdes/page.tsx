import { getSemuaApbdes, createApbdes, deleteApbdes, setActiveApbdes } from '@/server/actions/apbdes.action';
import SubmitButton from '@/components/ui/SubmitButton';
import { PieChart, PlusCircle, Trash2, CheckCircle, Image as ImageIcon, Settings } from 'lucide-react';
import Link from 'next/link';

export default async function ApbdesPage() {
  const data = await getSemuaApbdes();

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Transparansi APBDes</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Kelola daftar Tahun Anggaran APBDes. Klik "Atur Rincian" untuk memasukkan data Pendapatan, Belanja, dan Pembiayaan.</p>
      
      <details style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '32px' }}>
        <summary style={{ padding: '24px', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', cursor: 'pointer', listStyle: 'none', outline: 'none' }}>
          <PlusCircle size={20} className="text-blue-500" /> Buat Tahun Anggaran Baru
        </summary>
        
        <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
          <form action={createApbdes} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Tahun Anggaran</label>
              <input type="text" name="tahun" required placeholder="Contoh: 2024" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Gambar Infografis (Opsional)</label>
              <input type="file" name="foto" accept="image/*" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <SubmitButton label="Buat Tahun Anggaran" />
            </div>
          </form>
        </div>
      </details>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <PieChart size={20} className="text-slate-500" /> Daftar Tahun APBDes
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Tahun</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Total Rincian (Item)</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Infografis</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Status Tampil</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
                    {item.tahun}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: '#e2e8f0', color: '#334155', padding: '4px 10px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {item.rincian.length} Item Tersimpan
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {item.fotoUrl ? (
                      <img src={item.fotoUrl} alt="APBDes" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tidak ada gambar</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {item.isAktif ? (
                      <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> Aktif (Ditampilkan)
                      </span>
                    ) : (
                      <form action={async () => { 'use server'; await setActiveApbdes(item.id); }}>
                        <button type="submit" style={{ padding: '6px 12px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                          Jadikan Aktif
                        </button>
                      </form>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link href={`/admin/apbdes/${item.id}`} style={{ padding: '8px 12px', background: '#eff6ff', color: '#3b82f6', textDecoration: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Settings size={16} /> Atur Rincian
                      </Link>
                      <form action={async () => { 'use server'; await deleteApbdes(item.id); }}>
                        <button type="submit" style={{ padding: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Belum ada data Tahun APBDes. Silakan buat baru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
