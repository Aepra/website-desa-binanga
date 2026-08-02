import { getUMKM, createUMKM, deleteUMKM } from '@/server/actions/umkm.action';
import { updateUmkmStatusAdmin } from '@/server/actions/user-dashboard.action';
import SubmitButton from '@/components/SubmitButton';

export default async function UMKMPage() {
  const data = await getUMKM();

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: '#0f172a' }}>
        Manajemen & Persetujuan UMKM Publik
      </h1>
      
      <details style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '32px' }}>
        <summary style={{ padding: '24px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', listStyle: 'none', outline: 'none', color: '#2563eb' }}>
          + Tambah UMKM Baru (Admin Direct)
        </summary>
        <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
          <form action={createUMKM} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama UMKM</label>
              <input type="text" name="nama" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kategori</label>
              <select name="kategori" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>
                <option value="">-- Pilih Kategori --</option>
                <option value="Kuliner">Kuliner (Makanan & Minuman)</option>
                <option value="Kerajinan">Kerajinan Tangan</option>
                <option value="Jasa">Jasa & Layanan</option>
                <option value="Fashion">Fashion & Pakaian</option>
                <option value="Agribisnis">Agribisnis (Pertanian/Peternakan)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Pemilik / Owner</label>
              <input type="text" name="pemilik" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Deskripsi (Maksimal 500 Karakter)</label>
              <textarea name="deskripsi" required maxLength={500} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>No. WA</label>
              <input type="text" name="kontakWa" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Foto</label>
              <input type="file" name="foto" accept="image/*" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }} />
            </div>
            
            <SubmitButton label="Simpan UMKM" style={{ marginTop: '8px' }} />
          </form>
        </div>
      </details>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Daftar Semua UMKM</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Nama UMKM</th>
                <th style={{ padding: '12px' }}>Kategori</th>
                <th style={{ padding: '12px' }}>Owner</th>
                <th style={{ padding: '12px' }}>Deskripsi</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Foto</th>
                <th style={{ padding: '12px', minWidth: '180px' }}>Aksi Persetujuan</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: 700 }}>{item.nama}</td>
                  <td style={{ padding: '12px' }}>{item.kategori}</td>
                  <td style={{ padding: '12px' }}>{item.pemilik}</td>
                  <td style={{ padding: '12px', maxWidth: '240px' }}>{item.deskripsi}</td>
                  <td style={{ padding: '12px' }}>
                    {item.status === 'DISETUJUI' ? (
                      <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem' }}>DISETUJUI</span>
                    ) : item.status === 'PENDING' ? (
                      <span style={{ background: '#fefce8', color: '#ca8a04', padding: '4px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem' }}>MENUNGGU (PENDING)</span>
                    ) : (
                      <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem' }}>DITOLAK</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {item.fotoUrl && <img src={item.fotoUrl} alt="Foto" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {item.status !== 'DISETUJUI' && (
                        <form action={async () => {
                          'use server';
                          await updateUmkmStatusAdmin(item.id, 'DISETUJUI');
                        }}>
                          <button type="submit" style={{ padding: '6px 10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}>
                            ✓ Setujui
                          </button>
                        </form>
                      )}
                      
                      {item.status !== 'DITOLAK' && (
                        <form action={async () => {
                          'use server';
                          await updateUmkmStatusAdmin(item.id, 'DITOLAK');
                        }}>
                          <button type="submit" style={{ padding: '6px 10px', background: '#eab308', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}>
                            ✕ Tolak
                          </button>
                        </form>
                      )}

                      <form action={async () => {
                        'use server';
                        await deleteUMKM(item.id);
                      }}>
                        <button type="submit" style={{ padding: '6px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Belum ada data UMKM</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
