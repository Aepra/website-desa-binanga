'use client';

import { useState, useRef } from 'react';
import { PlusCircle, Image as ImageIcon } from 'lucide-react';
import SubmitButton from '@/components/ui/SubmitButton';
import { createBerita } from '@/server/actions/berita.action';

export default function BeritaFormClient() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      await createBerita(formData);
      alert('Berita berhasil ditambahkan!');
      if (formRef.current) formRef.current.reset();
      setIsOpen(false);
    } catch (error) {
      alert('Gagal menambahkan berita: ' + error);
    }
  };

  return (
    <details 
      open={isOpen} 
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '32px' }}
    >
      <summary style={{ padding: '24px', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', cursor: 'pointer', listStyle: 'none', outline: 'none' }}>
        <PlusCircle size={20} className="text-blue-500" /> Tambah Publikasi Baru
      </summary>
      
      <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
        <form ref={formRef} action={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          
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
  );
}
