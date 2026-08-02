import { getBerita, createBerita, deleteBerita } from '@/server/actions/berita.action';
import { Image as ImageIcon, Trash2, PlusCircle, FileText } from 'lucide-react';
import SubmitButton from '@/components/SubmitButton';

export default async function BeritaPage() {
  const data = await getBerita();

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Manajemen Berita & Agenda</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Kelola publikasi berita, agenda kegiatan, dan galeri dokumentasi desa.</p>
      
      <details style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '32px' }}>
        <summary style={{ padding: '24px', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', cursor: 'pointer', listStyle: 'none', outline: 'none' }}>
          <PlusCircle size={20} className="text-blue-500" /> Tambah Publikasi Baru
        </summary>
        
        <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
          <form action={createBerita} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Judul Publikasi</label>
              <input type="text" name="judul" required placeholder="Contoh: Penyaluran Bansos Tahap I" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Kategori</label>
              <select name="kategori" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                <option value="BERITA">Berita Umum</option>
                <option value="AGENDA">Agenda Kegiatan</option>
                <option value="PENGUMUMAN">Pengumuman</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Foto Utama (Cover)</label>
              <input type="file" name="foto" accept="image/*" required style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Konten Lengkap</label>
              <textarea name="konten" required placeholder="Tulis deskripsi atau isi berita di sini..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '120px', outline: 'none', resize: 'vertical' }} />
            </div>
            
            <div style={{ gridColumn: '1 / -1', background: '#f0f9ff', padding: '16px', borderRadius: '12px', border: '1px dashed #7dd3fc' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, color: '#0369a1' }}>
                <ImageIcon size={18} /> Galeri Dokumentasi (Opsional)
              </label>
              <p style={{ fontSize: '0.85rem', color: '#0284c7', margin: '0 0 12px 0' }}>Anda dapat memilih dan mengunggah beberapa gambar sekaligus untuk dijadikan album kegiatan.</p>
              <input type="file" name="galeri" accept="image/*" multiple={true} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #bae6fd', background: '#fff' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <SubmitButton label="Simpan & Publikasikan" />
            </div>
          </form>
        </div>
      </details>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <FileText size={20} className="text-slate-500" /> Daftar Berita & Agenda
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Info Berita</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Kategori</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Media</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{item.judul}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>/{item.slug}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.konten}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {item.kategori}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {item.fotoUrl && <img src={item.fotoUrl} alt="Cover" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />}
                      {item.galeri && item.galeri.length > 0 && (
                        <div style={{ fontSize: '0.8rem', color: '#0ea5e9', background: '#e0f2fe', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          +{item.galeri.length} Galeri
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <form action={async () => {
                      'use server';
                      await deleteBerita(item.id);
                    }}>
                      <button type="submit" style={{ padding: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Belum ada berita atau agenda yang diterbitkan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
