'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Download,
  AlertCircle,
  Filter
} from 'lucide-react';
import { getAllLayananAdmin, updateLayananAdmin } from '@/server/actions/user-dashboard.action';
import LayananChatThread from '@/components/LayananChatThread';

export default function AdminLayananPage() {
  const [layananList, setLayananList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('SEMUA');

  // Selected item for action
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  async function loadData() {
    const data = await getAllLayananAdmin();
    setLayananList(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpdateStatus(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    const res = await updateLayananAdmin(formData);

    if (res.success) {
      setMessage({ type: 'success', text: 'Status permohonan & dokumen berhasil diperbarui!' });
      setSelectedItem(null);
      await loadData();
    } else {
      setMessage({ type: 'error', text: res.error || 'Gagal memperbarui permohonan.' });
    }
    setSubmitting(false);
  }

  const filteredList = filterStatus === 'SEMUA'
    ? layananList
    : layananList.filter(l => l.status === filterStatus);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <Clock className="animate-spin" size={32} style={{ margin: '0 auto 12px' }} />
        <p>Memuat Permohonan Layanan Masuk...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Kelola Permohonan Layanan & Aduan Warga
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Tinjau permohonan surat dari warga, perbarui status, dan unggah berkas surat yang siap diunduh.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          {['SEMUA', 'MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                background: filterStatus === st ? '#ffffff' : 'transparent',
                color: filterStatus === st ? '#2563eb' : '#64748b',
                boxShadow: filterStatus === st ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {st}
            </button>
          ))}
        </div>
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

      {/* Main Table / Card List */}
      {filteredList.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Tidak Ada Permohonan</h4>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>Belum ada permohonan warga yang sesuai dengan filter ini.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredList.map((item) => (
            <div key={item.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginBottom: '8px' }}>
                <button
                  onClick={() => setSelectedItem(item)}
                  style={{
                    padding: '8px 16px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '10px',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <span>⚙️ Ubah Status & Upload Surat PDF</span>
                </button>
              </div>

              <LayananChatThread
                item={item}
                currentUserRole="ADMIN"
                onRefresh={loadData}
              />
            </div>
          ))}
        </div>
      )}

      {/* MODAL EDIT & UPLOAD SURAT */}
      {selectedItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '560px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Proses Permohonan Warga</h3>
              <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="hidden" name="id" value={selectedItem.id} />

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                <div><strong>Pemohon:</strong> {selectedItem.namaPemohon} ({selectedItem.userEmail})</div>
                <div style={{ marginTop: '4px' }}><strong>Perihal:</strong> {selectedItem.perihal}</div>
                <div style={{ marginTop: '4px' }}><strong>Judul:</strong> {selectedItem.judul}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Ubah Status Permohonan *</label>
                <select name="status" defaultValue={selectedItem.status} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', background: '#fff' }}>
                  <option value="MENUNGGU">MENUNGGU (Belum Diproses)</option>
                  <option value="DIPROSES">DIPROSES (Sedang Dikerjakan)</option>
                  <option value="SELESAI">SELESAI (Surat Siap Diunduh)</option>
                  <option value="DITOLAK">DITOLAK (Ditolak / Kurang Syarat)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Catatan / Balasan Admin untuk Warga</label>
                <textarea name="catatanAdmin" defaultValue={selectedItem.catatanAdmin || ''} rows={3} placeholder="Masukkan instruksi, pemberitahuan, atau alasan jika ditolak..." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }} />
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
                <button type="button" onClick={() => setSelectedItem(null)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Batal</button>
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

function StatusBadge({ status }: { status: string }) {
  if (status === 'SELESAI') {
    return <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>SELESAI</span>;
  }
  if (status === 'DIPROSES') {
    return <span style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>DIPROSES</span>;
  }
  if (status === 'DITOLAK') {
    return <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>DITOLAK</span>;
  }
  return <span style={{ background: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>MENUNGGU</span>;
}
