'use client';

import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  ShieldCheck,
  User,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Clock,
  MessageSquare
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
        setSuccessMsg(`Pesan terkirim!`);
        formEl.reset();
        setSelectedFileNames([]);
        setTimeout(() => setSuccessMsg(''), 3000);
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
    <div className="chat-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start', margin: '0 auto', maxWidth: '1200px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .chat-container { font-size: 0.85rem; }
        .sidebar { flex: 1 1 300px; max-width: 400px; }
        .chat-area { flex: 2 1 450px; min-height: 500px; }
        @media (max-width: 768px) {
          .chat-container { flex-direction: column; gap: 12px; }
          .sidebar { max-width: 100%; flex: 1 1 auto; }
          .chat-area { flex: 1 1 auto; min-height: 400px; }
          h2 { font-size: 1.15rem !important; }
          .box-padding { padding: 16px !important; }
        }
      `}} />

      {/* ── LEFT SIDE: TICKET DETAILS ── */}
      <div className="sidebar" style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(15,23,42,0.03)'
      }}>
        <div className="box-padding" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <span style={{ display: 'inline-block', background: '#e0e7ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            {item.perihal}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', lineHeight: 1.3 }}>
            {item.judul}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.85rem' }}>
              <User size={16} />
              <span><strong>{item.namaPemohon}</strong> ({item.userEmail})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.85rem' }}>
              <Clock size={16} />
              <span>{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        <div className="box-padding" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Status Saat Ini</h4>
          <div style={{ marginBottom: '20px' }}>
            <StatusBadge status={item.status} />
          </div>

          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Deskripsi Permohonan</h4>
          <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, marginBottom: '20px', overflowX: 'auto' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{item.deskripsi}</pre>
          </div>

          {item.catatanAdmin && (
            <>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Catatan Admin</h4>
              <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.5, marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 700 }}>
                  <ShieldCheck size={16} /> Admin Desa
                </div>
                {item.catatanAdmin}
              </div>
            </>
          )}

          {item.fileSuratUrl && (
            <>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Berkas Resmi (Hasil)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {parseFileUrls(item.fileSuratUrl).map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: '#10b981', color: '#ffffff', padding: '12px 16px', borderRadius: '12px',
                      textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
                      boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} />
                      <span>Unduh Dokumen #{i+1}</span>
                    </div>
                    <Download size={18} />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT SIDE: CHAT INTERFACE ── */}
      <div className="chat-area" style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
        <div className="box-padding" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={20} color="#2563eb" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Ruang Diskusi & Berkas</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Kirim pesan dan dokumen tambahan di sini.</p>
          </div>
        </div>

        <div className="box-padding" style={{ flex: 1, background: '#f4f4f5', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pesanList.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', opacity: 0.6 }}>
              <MessageSquare size={48} style={{ marginBottom: '16px' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>Belum ada pesan.</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Mulai percakapan dengan mengirim pesan di bawah.</p>
            </div>
          ) : (
            pesanList.map((msg: any) => {
              const isAdminMsg = msg.pengirim === 'ADMIN';
              const attachedUrls = parseFileUrls(msg.fileUrl);

              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isAdminMsg ? 'flex-start' : 'flex-end', width: '100%' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                    {msg.namaPengirim} • {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div style={{
                    background: isAdminMsg ? '#eff6ff' : '#ffffff',
                    border: isAdminMsg ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                    color: '#0f172a',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    borderTopLeftRadius: isAdminMsg ? '4px' : '12px',
                    borderTopRightRadius: !isAdminMsg ? '4px' : '12px',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    position: 'relative'
                  }}>
                    {msg.pesan && (
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {msg.pesan}
                      </p>
                    )}

                    {attachedUrls.length > 0 && (
                      <div style={{ marginTop: msg.pesan ? '12px' : '0', paddingTop: msg.pesan ? '12px' : '0', borderTop: msg.pesan ? `1px solid ${isAdminMsg ? '#f1f5f9' : '#3b82f6'}` : 'none' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, display: 'block', marginBottom: '8px' }}>
                          Lampiran Berkas:
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
                                  background: isAdminMsg ? '#f8fafc' : '#1d4ed8',
                                  color: isAdminMsg ? '#2563eb' : '#ffffff',
                                  padding: '8px 12px', borderRadius: '8px',
                                  fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none',
                                  border: isAdminMsg ? '1px solid #e2e8f0' : '1px solid #1e40af'
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
                </div>
              );
            })
          )}
        </div>

        {/* ── CHAT INPUT FORM ── */}
        <div style={{ background: '#ffffff', padding: '20px 24px', borderTop: '1px solid #e2e8f0' }}>
          
          {successMsg && (
            <div style={{ background: '#f0fdf4', color: '#15803d', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}

          {selectedFileNames.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {selectedFileNames.map((name, i) => (
                <div key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Paperclip size={10} /> {name}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSendPesan} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                name="pesan"
                rows={2}
                placeholder="Tulis pesan Anda di sini..."
                style={{
                  width: '100%', padding: '12px 48px 12px 16px', borderRadius: '16px', border: '1px solid #cbd5e1',
                  fontSize: '0.95rem', outline: 'none', resize: 'none', background: '#f8fafc',
                  fontFamily: 'inherit', lineHeight: 1.5
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
              <label style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'} title="Lampirkan File">
                <Paperclip size={20} />
                <input type="file" name="lampiranFiles" multiple accept="image/*,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            </div>

            <button
              type="submit"
              disabled={sending}
              style={{
                width: '48px', height: '48px', borderRadius: '50%', border: 'none',
                background: sending ? '#94a3b8' : '#2563eb', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: sending ? 'not-allowed' : 'pointer', flexShrink: 0,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)', transition: 'transform 0.1s ease'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} style={{ marginLeft: '2px' }} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── STATUS BADGE HELPER ──
function StatusBadge({ status }: { status: string }) {
  if (status === 'SELESAI') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
        <CheckCircle size={16} /> SELESAI
      </div>
    );
  }
  if (status === 'DIPROSES') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
        <Loader2 className="animate-spin" size={16} /> DIPROSES
      </div>
    );
  }
  if (status === 'DITOLAK') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
        <XCircle size={16} /> DITOLAK
      </div>
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
      <Clock size={16} /> MENUNGGU
    </div>
  );
}
