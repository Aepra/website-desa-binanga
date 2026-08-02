'use client';

import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Download,
  ShieldCheck,
  User,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { sendLayananPesanAction } from '@/server/actions/user-dashboard.action';

function parseFileUrls(fileUrlStr?: string): string[] {
  if (!fileUrlStr) return [];
  if (fileUrlStr.startsWith('[')) {
    try {
      return JSON.parse(fileUrlStr);
    } catch {
      return [fileUrlStr];
    }
  }
  return [fileUrlStr];
}

export default function LayananChatThread({
  item,
  currentUserRole = 'WARGA',
  onRefresh
}: {
  item: any;
  currentUserRole?: string;
  onRefresh?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 5); // Max 5 files
    if (files.length > 5) {
      setErrorMsg('Maksimal hanya dapat memilih 5 file/gambar sekaligus.');
    } else {
      setErrorMsg('');
    }
    setSelectedFileNames(files.map(f => f.name));
  }

  async function handleSendPesan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    formData.append('layananId', item.id);

    try {
      const res = await sendLayananPesanAction(formData);

      if (res.success) {
        setSuccessMsg(`✓ Pesan & ${res.count ? res.count + ' berkas' : 'lampiran'} berhasil diunggah ke Cloudinary!`);
        formEl.reset();
        setSelectedFileNames([]);
        if (onRefresh) onRefresh();
      } else {
        setErrorMsg(res.error || 'Gagal mengirim pesan.');
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kesalahan saat mengunggah berkas.');
    } finally {
      setSending(false);
    }
  }

  const pesanList = item.pesanList || [];

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '18px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 16px rgba(15,23,42,0.03)',
      overflow: 'hidden',
      marginBottom: '16px'
    }}>
      {/* ── HEADER CARD ── */}
      <div style={{ padding: '20px 24px', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                {item.perihal}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Pemohon: <strong>{item.namaPemohon}</strong> ({item.userEmail})
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                • {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.judul}</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <StatusBadge status={item.status} />
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', color: '#334155',
                border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
              }}
            >
              <span>{expanded ? 'Tutup Percakapan' : `Percakapan (${pesanList.length})`}</span>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* ── STEP PROGRESS TRACKER BAR ── */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          <ProgressStepTracker status={item.status} />
        </div>
      </div>

      {/* ── EXPANDABLE CHAT THREAD SECTION ── */}
      {expanded && (
        <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '24px' }}>
          
          {/* Deskripsi Awal Warga */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#475569', fontSize: '0.82rem', fontWeight: 700 }}>
              <User size={16} color="#2563eb" />
              <span>Deskripsi Pengajuan Awal Warga:</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.6, whitespace: 'pre-wrap' }}>
              {item.deskripsi}
            </p>
          </div>

          {/* Catatan Ringkas Admin (Jika ada) */}
          {item.catatanAdmin && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                <ShieldCheck size={18} />
                <span>Pesan Resmi Admin Desa:</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e3a8a', lineHeight: 1.6 }}>
                {item.catatanAdmin}
              </p>
            </div>
          )}

          {/* Download File Surat Hasil (jika ada) */}
          {item.fileSuratUrl && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d' }}>
                <CheckCircle size={22} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700 }}>Surat / Berkas Resmi Siap Diunduh</h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#16a34a' }}>Diunggah via Cloudinary oleh Kantor Desa Binanga</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {parseFileUrls(item.fileSuratUrl).map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px', background: '#16a34a', color: '#ffffff',
                      padding: '8px 14px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem',
                      boxShadow: '0 4px 12px rgba(22,163,74,0.25)'
                    }}
                  >
                    <Download size={15} />
                    <span>Unduh Berkas {parseFileUrls(item.fileSuratUrl).length > 1 ? `#${i+1}` : ''}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── THREAD CHAT MESSAGES LIST ── */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Riwayat Diskusi & Lampiran Berkas ({pesanList.length})</span>
          </h4>

          {pesanList.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', textAlign: 'center', color: '#94a3b8', border: '1px border-dashed #cbd5e1', fontSize: '0.85rem' }}>
              Belum ada balasan tambahan. Gunakan form di bawah untuk mengirim pesan atau mengunggah hingga 5 gambar/berkas kelengkapan.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {pesanList.map((msg: any) => {
                const isAdminMsg = msg.pengirim === 'ADMIN';
                const attachedUrls = parseFileUrls(msg.fileUrl);

                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isAdminMsg ? 'flex-start' : 'flex-end',
                      maxWidth: '85%',
                      width: '100%',
                      background: isAdminMsg ? '#eff6ff' : '#ffffff',
                      border: isAdminMsg ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isAdminMsg ? (
                          <span style={{ background: '#1d4ed8', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ShieldCheck size={12} /> Admin Desa
                          </span>
                        ) : (
                          <span style={{ background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={12} /> {msg.namaPengirim || 'Warga'}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {msg.pesan && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.5, whitespace: 'pre-wrap' }}>
                        {msg.pesan}
                      </p>
                    )}

                    {/* Multi Lampiran File / Foto (Maksimal 5) */}
                    {attachedUrls.length > 0 && (
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                          📷 {attachedUrls.length} File Lampiran (Cloudinary):
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {attachedUrls.map((url, i) => {
                            const isImage = url.match(/\.(jpeg|jpg|png|webp|gif)/i) || url.includes('/image/upload/');
                            return (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                                  background: isAdminMsg ? '#dbeafe' : '#f1f5f9',
                                  color: '#1d4ed8', padding: '6px 12px', borderRadius: '8px',
                                  fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none',
                                  border: '1px solid #cbd5e1'
                                }}
                              >
                                {isImage ? <ImageIcon size={14} /> : <Paperclip size={14} />}
                                <span>Berkas #{i + 1}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── FORM BALAS PESAN & MULTI UPLOAD LAMPIRAN (MAX 5) ── */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '18px' }}>
            <h5 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
              Kirim Balasan atau Upload s/d 5 Foto/Berkas (KTP, KK, Bukti Foto):
            </h5>

            {/* Notification Alerts */}
            {sending && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 className="animate-spin" size={16} />
                <span>Memproses & Mengunggah Berkas ke Cloudinary... Mohon tunggu.</span>
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendPesan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <textarea
                name="pesan"
                rows={3}
                placeholder="Ketik pesan atau instruksi kelengkapan berkas di sini..."
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />

              {/* Selected Files Badge Display */}
              {selectedFileNames.length > 0 && (
                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#475569' }}>
                  <strong>📷 {selectedFileNames.length} Berkas Terpilih (Maks 5):</strong>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {selectedFileNames.map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                  <Paperclip size={16} />
                  <span>Pilih Berkas/Foto (Maks 5 Gambar)</span>
                  <input
                    type="file"
                    name="lampiranFiles"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', background: sending ? '#94a3b8' : '#2563eb', color: '#ffffff',
                    padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: sending ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                  }}
                >
                  {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  <span>{sending ? 'Mengirim...' : 'Kirim Balasan & Berkas'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}

// ── PROGRESS TRACKER STEP BAR ──
function ProgressStepTracker({ status }: { status: string }) {
  const steps = [
    { label: 'Terkirim', active: true },
    { label: 'Sedang Diproses', active: status === 'DIPROSES' || status === 'SELESAI' },
    { label: 'Selesai & Unduh', active: status === 'SELESAI' },
  ];

  if (status === 'DITOLAK') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontSize: '0.82rem', fontWeight: 700 }}>
        <XCircle size={16} />
        <span>Status Permohonan: Ditolak oleh Admin Desa. Silakan periksa pesan balasan admin di atas.</span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      maxWidth: '100%',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      whiteSpace: 'nowrap',
      paddingBottom: '4px'
    }}>
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: step.active ? '#16a34a' : '#cbd5e1',
              color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.72rem'
            }}>
              {step.active ? '✓' : idx + 1}
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: step.active ? 700 : 500, color: step.active ? '#0f172a' : '#94a3b8' }}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div style={{ width: '30px', height: '2px', background: steps[idx + 1].active ? '#16a34a' : '#e2e8f0', flexShrink: 0 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── STATUS BADGE HELPER ──
function StatusBadge({ status }: { status: string }) {
  if (status === 'SELESAI') {
    return <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>SELESAI</span>;
  }
  if (status === 'DIPROSES') {
    return <span style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>DIPROSES</span>;
  }
  if (status === 'DITOLAK') {
    return <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>DITOLAK</span>;
  }
  return <span style={{ background: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>MENUNGGU</span>;
}
