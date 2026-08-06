'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateLayananAdmin } from '@/server/actions/user-dashboard.action';
import LayananChatThread from '@/components/features/LayananChatThread';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LayananDetailClient({ item }: { item: any }) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  async function handleUpdateStatus(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    const res = await updateLayananAdmin(formData);

    if (res.success) {
      setMessage({ type: 'success', text: 'Status permohonan & dokumen berhasil diperbarui!' });
      setShowEditModal(false);
      router.refresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Gagal memperbarui permohonan.' });
    }
    setSubmitting(false);
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link 
          href="/admin/layanan" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={18} /> Kembali ke Daftar Layanan
        </Link>
        <button
          onClick={() => setShowEditModal(true)}
          style={{
            padding: '8px 16px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '10px',
            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          ⚙️ Ubah Status & Upload PDF
        </button>
      </div>

      {message.text && (
        <div style={{
          padding: '14px 18px', borderRadius: '12px', marginBottom: '24px',
          background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: message.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
          color: message.type === 'success' ? '#15803d' : '#dc2626', fontWeight: 600
        }}>
          {message.text}
        </div>
      )}

      <LayananChatThread
        item={item}
        currentUserRole="ADMIN"
        onRefresh={() => router.refresh()}
      />

      {/* MODAL EDIT & UPLOAD SURAT */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '560px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Proses Permohonan Warga</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="hidden" name="id" value={item.id} />

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                <div><strong>Pemohon:</strong> {item.namaPemohon} ({item.userEmail})</div>
                <div style={{ marginTop: '4px' }}><strong>Perihal:</strong> {item.perihal}</div>
                <div style={{ marginTop: '4px' }}><strong>Judul:</strong> {item.judul}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Ubah Status Permohonan *</label>
                <select name="status" defaultValue={item.status} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', background: '#fff' }}>
                  <option value="MENUNGGU">MENUNGGU (Belum Diproses)</option>
                  <option value="DIPROSES">DIPROSES (Sedang Dikerjakan)</option>
                  <option value="SELESAI">SELESAI (Surat Siap Diunduh)</option>
                  <option value="DITOLAK">DITOLAK (Ditolak / Kurang Syarat)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Catatan / Balasan Admin untuk Warga</label>
                <textarea name="catatanAdmin" defaultValue={item.catatanAdmin || ''} rows={3} placeholder="Masukkan instruksi, pemberitahuan, atau alasan jika ditolak..." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Unggah File Surat / Berkas Resmi (Maksimal 5 File via Cloudinary)</label>
                <input type="file" name="fileSurat" multiple accept="application/pdf,image/*" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }} />
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0' }}>Anda dapat memilih hingga 5 file sekaligus. Berkas ini otomatis tersimpan di Cloudinary dan dapat diunduh oleh warga.</p>
              </div>

              {submitting && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚡ Memproses & Mengunggah Berkas Surat ke Cloudinary... Mohon tunggu.
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Batal</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', background: submitting ? '#94a3b8' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Mengunggah & Menyimpan...' : 'Simpan & Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
