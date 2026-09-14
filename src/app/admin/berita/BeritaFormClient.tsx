'use client';

import { useState, useRef, useEffect } from 'react';
import { PlusCircle, Image as ImageIcon } from 'lucide-react';
import SubmitButton from '@/components/ui/SubmitButton';
import { createBerita } from '@/server/actions/berita.action';

export default function BeritaFormClient() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [coverPreview, galleryPreviews]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview(null);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFilesArray = Array.from(files);
      
      const totalFutureFiles = galleryFiles.length + newFilesArray.length;
      if (totalFutureFiles > 3) {
        alert('Maksimal hanya 3 gambar yang diperbolehkan untuk galeri.');
        // Slice to only take what's allowed to reach exactly 3
        const allowedNewFiles = newFilesArray.slice(0, 3 - galleryFiles.length);
        if (allowedNewFiles.length === 0) {
          e.target.value = '';
          return;
        }
        setGalleryFiles(prev => [...prev, ...allowedNewFiles]);
        const newPreviews = allowedNewFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
      } else {
        setGalleryFiles(prev => [...prev, ...newFilesArray]);
        const newPreviews = newFilesArray.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
      }
    }
    // Kosongkan value agar bisa memilih file yang sama lagi
    e.target.value = '';
  };

  const removeGalleryItem = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (formData: FormData) => {
    formData.delete('galeri');
    galleryFiles.forEach(file => {
      formData.append('galeri', file);
    });

    try {
      await createBerita(formData);
      alert('Berita berhasil ditambahkan!');
      if (formRef.current) formRef.current.reset();
      setCoverPreview(null);
      setGalleryPreviews([]);
      setGalleryFiles([]);
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
            <input type="file" name="foto" accept="image/*" required onChange={handleCoverChange} style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
            {coverPreview && (
              <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', width: 'fit-content' }}>
                <img src={coverPreview} alt="Cover Preview" style={{ width: '100%', maxWidth: '200px', height: 'auto', display: 'block', objectFit: 'cover' }} />
              </div>
            )}
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Konten Lengkap</label>
            <textarea name="konten" required placeholder="Tulis deskripsi atau isi berita di sini..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '120px', outline: 'none', resize: 'vertical' }} />
          </div>
          
          <div style={{ gridColumn: '1 / -1', background: '#f0f9ff', padding: '16px', borderRadius: '12px', border: '1px dashed #7dd3fc' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, color: '#0369a1' }}>
              <ImageIcon size={18} /> Galeri Dokumentasi (Opsional) <span style={{ background: '#0284c7', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{galleryPreviews.length} / 3</span>
            </label>
            <p style={{ fontSize: '0.85rem', color: '#0284c7', margin: '0 0 12px 0' }}>Anda dapat mengunggah maksimal 3 gambar untuk dijadikan album kegiatan.</p>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px', maxWidth: '340px' }}>
              {galleryPreviews.map((url, index) => (
                <div key={index} style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#e2e8f0', position: 'relative' }}>
                  <img src={url} alt={`Gallery preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    type="button"
                    onClick={() => removeGalleryItem(index)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                    title="Hapus gambar ini"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {galleryPreviews.length < 3 && (
                <label style={{ 
                  width: '100px', height: '100px', 
                  borderRadius: '8px', border: '2px dashed #0ea5e9', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                  cursor: 'pointer', background: '#e0f2fe', color: '#0369a1',
                  transition: 'all 0.2s'
                }} title="Tambah Gambar">
                  <PlusCircle size={24} />
                  <span style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>Tambah</span>
                  <input type="file" name="galeri" accept="image/*" multiple={true} onChange={handleGalleryChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <SubmitButton label="Simpan & Publikasikan" />
          </div>
        </form>
      </div>
    </details>
  );
}
