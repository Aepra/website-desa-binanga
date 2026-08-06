'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  LogOut,
  FileText,
  Store,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  MapPin,
  Phone,
  Building2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
  Image as ImageIcon,
  Loader2,
  Trash2
} from 'lucide-react';
import LayananChatThread from '@/components/features/LayananChatThread';
import {
  getCurrentUserSession,
  logoutUserAction,
  getUmkmByUser,
  createUmkmUser,
  getLayananByUser,
  createLayananUser,
  deleteLayananUser
} from '@/server/actions/user-dashboard.action';
import { daftarLayanan } from '@/lib/layanan-config';

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Memuat...</div>}>
      <UserDashboardContent />
    </Suspense>
  );
}

function UserDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'layanan' | 'umkm'>(
    (tabParam as 'overview' | 'layanan' | 'umkm') || 'overview'
  );

  // Data states
  const [umkmList, setUmkmList] = useState<any[]>([]);
  const [layananList, setLayananList] = useState<any[]>([]);

  // Modals & forms
  const [showLayananModal, setShowLayananModal] = useState(false);
  const [showUmkmModal, setShowUmkmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Character counter for UMKM description
  const [umkmDeskripsi, setUmkmDeskripsi] = useState('');
  
  // Dynamic Layanan Form State
  const [selectedLayananId, setSelectedLayananId] = useState(daftarLayanan[0].id);
  const selectedLayanan = daftarLayanan.find(l => l.id === selectedLayananId) || daftarLayanan[0];
  const [layananFiles, setLayananFiles] = useState<File[]>([]);

  useEffect(() => {
    async function loadData() {
      const sess = await getCurrentUserSession();
      if (!sess) {
        router.push('/login');
        return;
      }
      setSession(sess);

      const [umkms, layanans] = await Promise.all([
        getUmkmByUser(),
        getLayananByUser()
      ]);
      setUmkmList(umkms);
      setLayananList(layanans);
      setLoading(false);
    }
    loadData();
  }, [router]);

  async function handleLogout() {
    await logoutUserAction();
  }

  async function handleLayananSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    setFormSuccess('');

    const service = daftarLayanan.find(l => l.id === selectedLayananId);
    if (service && layananFiles.length < service.syarat.length) {
      setFormError(`Mohon unggah minimal ${service.syarat.length} berkas syarat (Anda baru mengunggah ${layananFiles.length} berkas).`);
      setSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.delete('lampiranFiles'); // Hapus input file default
    layananFiles.forEach(file => {
      formData.append('lampiranFiles', file);
    });

    // Format dynamic fields into deskripsi
    if (service) {
      formData.set('perihal', service.title);
      if (service.fields && service.fields.length > 0) {
        const parts = service.fields.map(f => {
          const val = formData.get(f.name);
          return `**${f.label}:**\n${val}`;
        });
        formData.set('deskripsi', parts.join('\n\n'));
      }
    }
    
    const res = await createLayananUser(formData);

    if (res.success) {
      setFormSuccess('Permohonan layanan berhasil dikirim! Admin akan memproses permohonan Anda.');
      setShowLayananModal(false);
      setLayananFiles([]);
      const updated = await getLayananByUser();
      setLayananList(updated);
    } else {
      setFormError(res.error || 'Gagal mengirim permohonan.');
    }
    setSubmitting(false);
  }

  async function handleDeleteLayanan(id: string) {
    if (!window.confirm('Apakah Anda yakin ingin menghapus permohonan layanan ini? Data percakapan dan berkas juga akan terhapus secara permanen.')) {
      return;
    }
    
    // Optional: show a loading state here if desired, but since it's just a row deletion, an optimistic or simple await is fine.
    const res = await deleteLayananUser(id);
    if (res.success) {
      setLayananList(prev => prev.filter(l => l.id !== id));
    } else {
      alert('Gagal menghapus permohonan: ' + res.error);
    }
  }

  async function handleUmkmSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    setFormSuccess('');

    const formData = new FormData(e.currentTarget);
    const res = await createUmkmUser(formData);

    if (res.success) {
      setFormSuccess('UMKM Anda berhasil didaftarkan! Saat ini menunggu peninjauan & persetujuan dari Admin Desa.');
      setShowUmkmModal(false);
      setUmkmDeskripsi('');
      const updated = await getUmkmByUser();
      setUmkmList(updated);
    } else {
      setFormError(res.error || 'Gagal mendaftarkan UMKM.');
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <Clock className="animate-spin" size={36} color="#2563eb" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: 600 }}>Memuat Dashboard Warga...</p>
        </div>
      </div>
    );
  }

  const pendingLayanan = layananList.filter(l => l.status === 'MENUNGGU' || l.status === 'DIPROSES').length;
  const selesaiLayanan = layananList.filter(l => l.status === 'SELESAI').length;
  const approvedUmkm = umkmList.filter(u => u.status === 'DISETUJUI').length;
  const pendingUmkm = umkmList.filter(u => u.status === 'PENDING').length;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'sans-serif' }}>
      
      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* Banner Alert Messages */}
        {formSuccess && (
          <div style={{ padding: '14px 18px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formSuccess}</span>
            </div>
            <button onClick={() => setFormSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', fontWeight: 700 }}>✕</button>
          </div>
        )}

        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
          color: '#0f172a',
          borderRadius: '16px',
          padding: '18px 20px',
          marginBottom: '24px',
          border: '1px solid #dbeafe',
          boxShadow: '0 4px 16px rgba(37,99,235,0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Warga Desa Binanga
            </span>
            <h1 className="header-title" style={{ fontSize: '1.25rem', fontWeight: 800, margin: '8px 0 4px', color: '#0f172a' }}>
              Halo, {session?.name || 'Warga'}! 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.82rem', maxWidth: '600px', lineHeight: 1.5, margin: 0 }}>
              Ajukan permohonan surat & layanan publik, atau daftarkan usaha UMKM Anda secara online langsung ke Kantor Desa Binanga.
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '24px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          paddingBottom: '2px'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 20px', fontWeight: 700, fontSize: '0.95rem', border: 'none', background: 'none', cursor: 'pointer',
              color: activeTab === 'overview' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'overview' ? '3px solid #2563eb' : '3px solid transparent',
              marginBottom: '-2px', transition: 'all 0.2s'
            }}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('layanan')}
            style={{
              padding: '12px 20px', fontWeight: 700, fontSize: '0.95rem', border: 'none', background: 'none', cursor: 'pointer',
              color: activeTab === 'layanan' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'layanan' ? '3px solid #2563eb' : '3px solid transparent',
              marginBottom: '-2px', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <FileText size={18} />
            <span>Permohonan Layanan ({layananList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('umkm')}
            style={{
              padding: '12px 20px', fontWeight: 700, fontSize: '0.95rem', border: 'none', background: 'none', cursor: 'pointer',
              color: activeTab === 'umkm' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'umkm' ? '3px solid #2563eb' : '3px solid transparent',
              marginBottom: '-2px', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <Store size={18} />
            <span>UMKM Saya ({umkmList.length})</span>
          </button>
        </div>

        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="stat-card" style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={24} />
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{layananList.length}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>Permohonan Layanan</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px' }}>{pendingLayanan} Sedang Diproses • {selesaiLayanan} Selesai</p>
                <button
                  onClick={() => setShowLayananModal(true)}
                  style={{
                    width: '100%', padding: '10px', background: '#2563eb', color: '#ffffff', border: 'none',
                    borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  <span>Kirim Permohonan Baru</span>
                </button>
              </div>

              <div className="stat-card" style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Store size={24} />
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{umkmList.length}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>UMKM Saya</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px' }}>{approvedUmkm} Disetujui • {pendingUmkm} Menunggu</p>
                <button
                  onClick={() => setShowUmkmModal(true)}
                  style={{
                    width: '100%', padding: '10px', background: '#16a34a', color: '#ffffff', border: 'none',
                    borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  <span>Daftarkan UMKM Baru</span>
                </button>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Riwayat Permohonan & Balasan Admin</h3>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      const [u, l] = await Promise.all([getUmkmByUser(), getLayananByUser()]);
                      setUmkmList(u);
                      setLayananList(l);
                      setLoading(false);
                    }}
                    title="Perbarui Data"
                    style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}
                  >
                    🔄 Segarkan Data
                  </button>
                </div>
                <button onClick={() => setActiveTab('layanan')} style={{ color: '#2563eb', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Lihat Semua →</button>
              </div>

              {layananList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>Belum ada permohonan layanan yang diajukan.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', width: '120px' }}>Tanggal</th>
                        <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Layanan / Perihal</th>
                        <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', width: '120px', textAlign: 'center' }}>Status</th>
                        <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', width: '90px', textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {layananList.slice(0, 3).map((item, index) => (
                        <tr key={item.id} style={{ 
                          background: index % 2 === 0 ? '#ffffff' : '#fafafb', 
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.2s ease'
                        }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#fafafb'}>
                          <td className="table-td" style={{ whiteSpace: 'nowrap' }}>
                            <span style={{ color: '#0f172a', fontWeight: 700, display: 'block' }}>
                              {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="table-td" style={{ color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                            {item.judul}
                          </td>
                          <td className="table-td" style={{ textAlign: 'center' }}>
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="table-td" style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                              <Link
                                href={`/user-dashboard/layanan/${item.id}`}
                                style={{
                                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '4px 14px',
                                  borderRadius: '20px',
                                  cursor: 'pointer',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
                                  textDecoration: 'none',
                                  display: 'inline-block'
                                }}
                              >
                                Buka
                              </Link>
                              <button 
                                onClick={() => handleDeleteLayanan(item.id)}
                                title="Hapus Permohonan"
                                style={{
                                  background: '#fef2f2',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  padding: '6px',
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB CONTENT 2: PERMOHONAN LAYANAN ── */}
        {activeTab === 'layanan' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Daftar Permohonan Layanan & Aduan</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>Pantau status pengurusan surat dan aduan Anda di bawah ini.</p>
              </div>
              <button
                onClick={() => setShowLayananModal(true)}
                style={{
                  padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Plus size={18} />
                <span>Buat Permohonan Baru</span>
              </button>
            </div>

            {layananList.length === 0 ? (
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Belum ada permohonan</h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 20px' }}>Klik tombol di atas untuk mengajukan permohonan surat atau pengaduan.</p>
              </div>
            ) : (
              <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.04)', border: '1px solid #e2e8f0' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '140px' }}>Tanggal</th>
                        <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Layanan / Perihal</th>
                        <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '140px', textAlign: 'center' }}>Status</th>
                        <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '100px', textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {layananList.map((item, index) => (
                        <tr key={item.id} style={{ 
                          background: index % 2 === 0 ? '#ffffff' : '#fafafb', 
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.2s ease'
                        }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#fafafb'}>
                          <td className="table-td" style={{ whiteSpace: 'nowrap' }}>
                            <span style={{ color: '#0f172a', fontWeight: 700, display: 'block' }}>
                              {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                              {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="table-td" style={{ color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                            {item.judul}
                          </td>
                          <td className="table-td" style={{ textAlign: 'center' }}>
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="table-td" style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                              <Link
                                href={`/user-dashboard/layanan/${item.id}`}
                                style={{
                                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '6px 16px',
                                  borderRadius: '20px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                                  transition: 'transform 0.1s ease',
                                  textDecoration: 'none',
                                  display: 'inline-block'
                                }}
                              >
                                Buka
                              </Link>
                              <button 
                                onClick={() => handleDeleteLayanan(item.id)}
                                title="Hapus Permohonan"
                                style={{
                                  background: '#fef2f2',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  padding: '8px',
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB CONTENT 3: UMKM SAYA ── */}
        {activeTab === 'umkm' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Kelola Usaha UMKM Anda</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>Daftarkan usaha Anda agar tampil di direktori UMKM resmi Desa Binanga.</p>
              </div>
              <button
                onClick={() => setShowUmkmModal(true)}
                style={{
                  padding: '10px 18px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '12px',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Plus size={18} />
                <span>Daftarkan UMKM Baru</span>
              </button>
            </div>

            {umkmList.length === 0 ? (
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <Store size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Belum Ada UMKM Terdaftar</h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 20px' }}>Daftarkan produk atau usaha UMKM Anda untuk menjangkau lebih banyak pembeli.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {umkmList.map((item) => (
                  <div key={item.id} style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '180px', background: '#f1f5f9', position: 'relative' }}>
                      {item.fotoUrl ? (
                        <img src={item.fotoUrl} alt={item.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <ImageIcon size={40} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <StatusBadge status={item.status} />
                      </div>
                      <span style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15,23,42,0.75)', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                        {item.kategori}
                      </span>
                    </div>

                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{item.nama}</h4>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 12px', fontWeight: 600 }}>Pemilik: {item.pemilik}</p>
                      
                      <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, flex: 1, margin: '0 0 16px' }}>
                        {item.deskripsi}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.82rem' }}>
                        {item.kontakWa && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 600 }}>
                            <Phone size={14} />
                            <span>WA: {item.kontakWa}</span>
                          </div>
                        )}
                        {item.linkMaps && (
                          <a href={item.linkMaps} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                            <MapPin size={14} />
                            <span>Lihat di Google Maps</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── MODAL 1: FORM PERMOHONAN LAYANAN DINAMIS ── */}
      {showLayananModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '640px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Ajukan Permohonan Layanan</h3>
              <button onClick={() => setShowLayananModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <form onSubmit={handleLayananSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Nama Pemohon</label>
                  <input type="text" name="namaPemohon" defaultValue={session?.name} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', background: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Pilih Jenis Layanan</label>
                  <select 
                    value={selectedLayananId} 
                    onChange={(e) => setSelectedLayananId(e.target.value)}
                    required 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', background: '#fff' }}
                  >
                    {daftarLayanan.map(l => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '4px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#1e3a8a', lineHeight: 1.5 }}>
                  {selectedLayanan.desc}
                </p>
                <div style={{ fontSize: '0.82rem', color: '#1d4ed8' }}>
                  <strong>Syarat Berkas yang Wajib Diunggah:</strong>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {selectedLayanan.syarat.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Judul Permohonan</label>
                <input type="text" name="judul" defaultValue={`Permohonan ${selectedLayanan.title}`} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }} />
              </div>

              {/* Dynamic Fields */}
              {selectedLayanan.fields && selectedLayanan.fields.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#334155' }}>Detail Permohonan</h4>
                  {selectedLayanan.fields.map((field, idx) => (
                    <div key={idx}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        {field.label} {field.required && '*'}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea name={field.name} placeholder={field.placeholder} required={field.required} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', resize: 'none' }} />
                      ) : (
                        <input type={field.type} name={field.name} placeholder={field.placeholder} required={field.required} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Default Deskripsi if no fields are specified */}
              {(!selectedLayanan.fields || selectedLayanan.fields.length === 0) && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Deskripsi / Keterangan</label>
                  <textarea name="deskripsi" required rows={4} placeholder="Jelaskan kebutuhan Anda secara lengkap..." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', resize: 'none' }} />
                </div>
              )}

              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Unggah Berkas Syarat (KTP/KK/Foto)</label>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: layananFiles.length >= selectedLayanan.syarat.length ? '#16a34a' : '#dc2626' }}>
                    {layananFiles.length} / {selectedLayanan.syarat.length} Berkas (Min. {selectedLayanan.syarat.length})
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  {layananFiles.map((file, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={URL.createObjectURL(file)} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => setLayananFiles(prev => prev.filter((_, i) => i !== idx))}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(15,23,42,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '12px', border: '1px dashed #cbd5e1', background: '#f8fafc', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}>
                    <Plus size={24} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, marginTop: '4px' }}>Tambah</span>
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      multiple 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setLayananFiles(prev => [...prev, ...files]);
                      }}
                    />
                  </label>
                </div>
              </div>

              {formError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} /> {formError}
                </div>
              )}

              {submitting && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 className="animate-spin" size={16} /> Sedang mengunggah berkas & memproses permohonan...
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowLayananModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Batal</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {submitting ? <><Loader2 className="animate-spin" size={16} /> Memproses...</> : 'Kirim Permohonan & Berkas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: FORM TAMBAH UMKM ── */}
      {showUmkmModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '560px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Daftarkan Usaha UMKM</h3>
              <button onClick={() => setShowUmkmModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <form onSubmit={handleUmkmSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Nama Usaha UMKM *</label>
                <input type="text" name="nama" required placeholder="Contoh: Keripik Pisang Mandar Binanga" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Kategori Usaha *</label>
                  <select name="kategori" required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', background: '#fff' }}>
                    <option value="Kuliner">Kuliner & Makanan</option>
                    <option value="Kerajinan">Kerajinan & Tangan</option>
                    <option value="Jasa">Jasa & Servis</option>
                    <option value="Pertanian & Perkebunan">Pertanian & Perkebunan</option>
                    <option value="Perdagangan">Perdagangan & Toko</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Nama Pemilik (Owner) *</label>
                  <input type="text" name="pemilik" defaultValue={session?.name} required placeholder="Nama Pemilik" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }} />
                </div>
              </div>

              {/* Deskripsi dengan Maksimal 500 Karakter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Deskripsi Produk / Usaha *</label>
                  <span style={{ fontSize: '0.78rem', color: umkmDeskripsi.length > 500 ? '#dc2626' : '#64748b', fontWeight: 700 }}>
                    {umkmDeskripsi.length} / 500 Huruf Maksimal
                  </span>
                </div>
                <textarea
                  name="deskripsi"
                  required
                  rows={4}
                  maxLength={500}
                  value={umkmDeskripsi}
                  onChange={(e) => setUmkmDeskripsi(e.target.value)}
                  placeholder="Jelaskan produk unggulan, harga, atau keunikan usaha Anda (Maksimal 500 karakter)..."
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: umkmDeskripsi.length >= 500 ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>No. WhatsApp Contact</label>
                  <input type="text" name="kontakWa" placeholder="Contoh: 081234567890" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Link Google Maps</label>
                  <input type="url" name="linkMaps" placeholder="https://maps.google.com/..." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Foto Usaha / Produk (Opsional)</label>
                <input type="file" name="foto" accept="image/*" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }} />
              </div>

              {submitting && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 className="animate-spin" size={16} /> Sedang mendaftarkan UMKM Anda...
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowUmkmModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Batal</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {submitting ? <><Loader2 className="animate-spin" size={16} /> Menyimpan...</> : 'Daftarkan UMKM Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ── STATUS BADGE HELPER COMPONENT ──
function StatusBadge({ status }: { status: string }) {
  if (status === 'SELESAI' || status === 'DISETUJUI') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
        <CheckCircle size={14} />
        <span>{status === 'DISETUJUI' ? 'Disetujui' : 'Selesai'}</span>
      </span>
    );
  }
  if (status === 'MENUNGGU' || status === 'PENDING') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
        <Clock size={14} />
        <span>{status === 'PENDING' ? 'Menunggu Persetujuan' : 'Menunggu Diproses'}</span>
      </span>
    );
  }
  if (status === 'DIPROSES') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
        <Sparkles size={14} />
        <span>Sedang Diproses</span>
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
      <XCircle size={14} />
      <span>Ditolak</span>
    </span>
  );
}
