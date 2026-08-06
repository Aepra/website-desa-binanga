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
  Filter,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { getAllLayananAdmin, deleteLayananAdmin } from '@/server/actions/user-dashboard.action';

export default function AdminLayananPage() {
  const [layananList, setLayananList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  async function loadData() {
    const data = await getAllLayananAdmin();
    setLayananList(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDeleteLayanan(id: string) {
    if (!window.confirm('Apakah Anda yakin ingin menghapus permohonan layanan ini dari sistem? Seluruh data percakapan dan berkas juga akan ikut terhapus.')) {
      return;
    }
    
    const res = await deleteLayananAdmin(id);
    if (res.success) {
      setLayananList(prev => prev.filter(l => l.id !== id));
    } else {
      alert('Gagal menghapus permohonan: ' + res.error);
    }
  }

  const filteredList = layananList.filter(l => {
    const matchStatus = filterStatus === 'SEMUA' || l.status === filterStatus;
    const matchSearch = l.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        l.namaPemohon.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <Clock className="animate-spin" size={32} style={{ margin: '0 auto 12px' }} />
        <p>Memuat Permohonan Layanan Masuk...</p>
      </div>
    );
  }

  return (
    <div className="admin-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .admin-container { font-size: 0.85rem; }
        .table-th { padding: 12px 16px !important; font-size: 0.7rem !important; }
        .table-td { padding: 10px 16px !important; }
        @media (max-width: 768px) {
          .admin-container { padding: 12px !important; }
          .header-title { font-size: 1.15rem !important; }
          .table-th, .table-td { padding: 8px 12px !important; font-size: 0.75rem !important; }
        }
      `}} />
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="header-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Layanan & Aduan Warga
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Kelola permohonan surat warga.
          </p>
        </div>

        {/* Filter Buttons & Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Cari nama atau layanan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', width: '220px' }}
          />

          <div style={{
            display: 'flex',
            gap: '4px',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '8px',
            overflowX: 'auto',
          }}>
            {['SEMUA', 'MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '4px 10px', borderRadius: '6px', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                  background: filterStatus === st ? '#ffffff' : 'transparent',
                  color: filterStatus === st ? '#2563eb' : '#64748b',
                  boxShadow: filterStatus === st ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table / Card List */}
      {filteredList.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Tidak Ada Permohonan</h4>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>Belum ada permohonan warga yang sesuai dengan filter ini.</p>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.04)', border: '1px solid #e2e8f0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '100px' }}>Tanggal</th>
                  <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '180px' }}>Pemohon</th>
                  <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Layanan / Perihal</th>
                  <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '120px', textAlign: 'center' }}>Status</th>
                  <th className="table-th" style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '90px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item, index) => (
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
                    <td className="table-td" style={{ color: '#0f172a', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                      {item.namaPemohon}
                    </td>
                    <td className="table-td" style={{ color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                      {item.judul}
                    </td>
                    <td className="table-td" style={{ textAlign: 'center' }}>
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="table-td" style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                        <Link
                          href={`/admin/layanan/${item.id}`}
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
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'SELESAI') {
    return <span style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800 }}>SELESAI</span>;
  }
  if (status === 'DIPROSES') {
    return <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800 }}>DIPROSES</span>;
  }
  if (status === 'DITOLAK') {
    return <span style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800 }}>DITOLAK</span>;
  }
  return <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800 }}>MENUNGGU</span>;
}
