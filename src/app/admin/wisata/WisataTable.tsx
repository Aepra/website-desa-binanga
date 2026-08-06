'use client';

import React, { useState } from 'react';
import { deleteWisata, updateWisata } from '@/server/actions/wisata.action';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, X, Map, Clock, Loader2 } from 'lucide-react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function WisataTable({ data }: { data: any[] }) {
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      await deleteWisata(id);
      router.refresh();
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    await updateWisata(editingItem.id, formData);
    
    setIsSaving(false);
    setEditingItem(null);
    router.refresh();
  };

  const kategoriWisata = ["Wisata Alam", "Wisata Budaya", "Wisata Edukasi", "Wisata Religi", "Wisata Kuliner", "Wisata Buatan"];
  const kategoriPotensi = ["Potensi Pertanian", "Potensi Peternakan", "Potensi Perikanan", "Potensi Wisata", "Kerajinan / Kesenian", "Sumber Daya Alam", "Industri Rumahan", "Lainnya"];
  
  const allKategori = [...new Set([...kategoriWisata, ...kategoriPotensi])];

  return (
    <>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}>
        <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Nama</th>
            <th style={{ padding: '12px' }}>Tipe</th>
            <th style={{ padding: '12px' }}>Kategori</th>
            <th style={{ padding: '12px' }}>Deskripsi</th>
            <th style={{ padding: '12px' }}>Info Tambahan</th>
            <th style={{ padding: '12px' }}>Foto</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px', fontWeight: '500' }}>{item.nama}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ 
                  background: item.tipe === 'POTENSI' ? '#dcfce7' : '#dbeafe', 
                  color: item.tipe === 'POTENSI' ? '#15803d' : '#1d4ed8', 
                  padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 
                }}>
                  {item.tipe === 'POTENSI' ? '🌾 POTENSI' : '🏖️ WISATA'}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                  {item.kategori}
                </span>
              </td>
              <td style={{ padding: '12px', fontSize: '0.9rem', color: '#475569', maxWidth: '300px' }}>{item.deskripsi}</td>
              <td style={{ padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                {item.jamBuka && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><Clock size={14} /> {item.jamBuka}</div>}
                {item.linkMaps && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6' }}><Map size={14} /> Ada Link Map</div>}
              </td>
              <td style={{ padding: '12px' }}>
                {item.fotoUrl ? <img src={item.fotoUrl} alt="Foto" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} /> : <span style={{ color: '#cbd5e1' }}>Tidak ada</span>}
              </td>
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => setEditingItem(item)} style={{ padding: '8px', background: '#f1f5f9', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <form action={async () => { await deleteWisata(item.id); }}>
                    <button type="submit" style={{ padding: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Belum ada data destinasi wisata atau potensi desa.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {editingItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '500px',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Edit Data Wisata/Potensi</h3>
              <button onClick={() => setEditingItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama</label>
                <input type="text" name="nama" defaultValue={editingItem.nama} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tipe Data</label>
                <select name="tipe" defaultValue={editingItem.tipe || 'WISATA'} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
                  <option value="WISATA">🏖️ Destinasi Wisata</option>
                  <option value="POTENSI">🌾 Potensi Unggulan Desa</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kategori</label>
                <select name="kategori" defaultValue={editingItem.kategori} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>
                  {allKategori.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Deskripsi</label>
                <textarea name="deskripsi" defaultValue={editingItem.deskripsi} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Foto (Biarkan kosong jika tidak ingin mengubah)</label>
                {editingItem.fotoUrl && <img src={editingItem.fotoUrl} alt="Current" style={{ width: '100px', borderRadius: '6px', marginBottom: '8px', display: 'block' }} />}
                <input type="file" name="foto" accept="image/*" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Link Google Maps (Opsional)</label>
                <input type="url" name="linkMaps" defaultValue={editingItem.linkMaps || ''} placeholder="https://maps.google.com/..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Jam Operasional (Opsional)</label>
                <input type="text" name="jamBuka" defaultValue={editingItem.jamBuka || ''} placeholder="08:00 - 17:00 / 24 Jam" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setEditingItem(null)} style={{ padding: '10px 16px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }} disabled={isSaving}>Batal</button>
                <button type="submit" disabled={isSaving} style={{ padding: '10px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {isSaving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <LoadingOverlay show={isSaving} />
    </>
  );
}
