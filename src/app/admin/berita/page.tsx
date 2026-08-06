import { getBerita, createBerita, deleteBerita } from '@/server/actions/berita.action';
import { Image as ImageIcon, Trash2, PlusCircle, FileText } from 'lucide-react';
import BeritaFormClient from './BeritaFormClient';

export default async function BeritaPage() {
  const data = await getBerita();

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Manajemen Berita & Agenda</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Kelola publikasi berita, agenda kegiatan, dan galeri dokumentasi desa.</p>
      
      <BeritaFormClient />

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
