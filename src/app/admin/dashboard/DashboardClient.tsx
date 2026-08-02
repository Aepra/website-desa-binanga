'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, TreePine, Store, Building2, ShieldCheck,
  Search, Plus, ArrowRight, PieChart as PieIcon, BarChart2,
  Home, Sparkles, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardProps {
  stats: {
    totalPenduduk: number;
    totalKk: number;
    totalWisata: number;
    totalUmkm: number;
    totalInfrastruktur: number;
    totalBerita: number;
    totalPendapatanApbdes: number;
    totalBelanjaApbdes: number;
  };
  dusunChartData: Array<{ name: string; pria: number; wanita: number; total: number }>;
  potensiChartData: Array<{ name: string; value: number; color: string }>;
  recentPendudukList: Array<{
    id: string;
    nik: string;
    namaLengkap: string;
    jenisKelamin: string;
    dusunDomisili: string;
    pekerjaanUtama: string;
  }>;
  recentBeritaList: Array<{
    id: string;
    judul: string;
    kategori: string;
    publishedAt: string;
  }>;
}

export default function DashboardClient({
  stats,
  dusunChartData,
  potensiChartData,
  recentPendudukList
}: DashboardProps) {
  const [residentSearch, setResidentSearch] = useState('');
  const [selectedDusunFilter, setSelectedDusunFilter] = useState('SEMUA');

  const filteredPenduduk = recentPendudukList.filter((item) => {
    const matchesSearch =
      item.namaLengkap.toLowerCase().includes(residentSearch.toLowerCase()) ||
      item.nik.includes(residentSearch) ||
      item.pekerjaanUtama.toLowerCase().includes(residentSearch.toLowerCase());
    const matchesDusun =
      selectedDusunFilter === 'SEMUA' || item.dusunDomisili.toLowerCase() === selectedDusunFilter.toLowerCase();
    return matchesSearch && matchesDusun;
  });

  const formatRp = (num: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <style>{`
        .admin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 8px;
        }
        .admin-chart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
        }
        @media (max-width: 640px) {
          .admin-chart-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .admin-kpi-grid {
            grid-template-columns: 1fr;
          }
        }
        .kpi-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
      
      {/* ── HEADER BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '16px 20px',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(15,23,42,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} /> SYSTEM ONLINE
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Portal Resmi Desa Binanga</span>
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, letterSpacing: '-0.2px' }}>
            Dashboard Kendali Admin
          </h1>
          <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>
            Ringkasan data riil kependudukan, pariwisata, UMKM, dan keuangan APBDes.
          </p>
        </div>

        {/* QUICK ACTIONS BUTTONS */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <Link href="/admin/wisata" style={{ background: '#059669', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={13} /> Wisata
          </Link>
          <Link href="/admin/umkm" style={{ background: '#d97706', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={13} /> UMKM
          </Link>
          <Link href="/admin/berita" style={{ background: '#2563eb', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={13} /> Berita
          </Link>
          <Link href="/admin/penduduk" style={{ background: '#475569', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={13} /> Warga
          </Link>
        </div>
      </div>

      {/* ── KPI METRICS CARDS (6 GRID) ── */}
      <div className="admin-kpi-grid">
        
        {/* Total Penduduk */}
        <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '4px' }}>
            <span className="kpi-title" title="Penduduk">Penduduk</span>
            <div style={{ background: '#eff6ff', color: '#2563eb', padding: '5px', borderRadius: '6px' }}><Users size={15} /></div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalPenduduk.toLocaleString('id-ID')}</div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>Data Riil Terdaftar</div>
        </div>

        {/* Total KK */}
        <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '4px' }}>
            <span className="kpi-title" title="Kepala Keluarga">Total KK</span>
            <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '5px', borderRadius: '6px' }}><Home size={15} /></div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalKk.toLocaleString('id-ID')}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Total KK Riil Terhitung</div>
        </div>

        {/* Wisata */}
        <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '4px' }}>
            <span className="kpi-title" title="Destinasi Wisata">Wisata</span>
            <div style={{ background: '#ecfdf5', color: '#059669', padding: '5px', borderRadius: '6px' }}><TreePine size={15} /></div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalWisata}</div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>Lokasi Terdaftar</div>
        </div>

        {/* UMKM */}
        <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '4px' }}>
            <span className="kpi-title" title="UMKM Lokal">UMKM</span>
            <div style={{ background: '#fffbeb', color: '#d97706', padding: '5px', borderRadius: '6px' }}><Store size={15} /></div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalUmkm}</div>
          <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600, marginTop: '2px' }}>Usaha Warga</div>
        </div>

        {/* APBDes Pendapatan */}
        <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '4px' }}>
            <span className="kpi-title" title="Pendapatan APBDes">APBDes</span>
            <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '5px', borderRadius: '6px' }}><PieIcon size={15} /></div>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a' }}>{formatRp(stats.totalPendapatanApbdes)}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Tahun Aktif</div>
        </div>

        {/* Infrastruktur */}
        <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '4px' }}>
            <span className="kpi-title" title="Infrastruktur">Fasilitas</span>
            <div style={{ background: '#f8fafc', color: '#475569', padding: '5px', borderRadius: '6px' }}><Building2 size={15} /></div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalInfrastruktur}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Fasilitas Umum</div>
        </div>

      </div>

      {/* ── CHARTS SECTION (2 COLUMNS) ── */}
      <div className="admin-chart-grid">
        
        {/* CHART 1: DEMOGRAFI DUSUN */}
        <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Grafik Demografi Penduduk per Dusun</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Jumlah Laki-Laki & Perempuan (Total: {stats.totalPenduduk} Jiwa)</p>
            </div>
            <BarChart2 size={16} color="#3b82f6" />
          </div>

          <div style={{ width: '100%', height: '210px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dusunChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.78rem' }} />
                <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: '6px' }} />
                <Bar dataKey="pria" name="Laki-Laki" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="wanita" name="Perempuan" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: POTENSI DESA (WISATA & UMKM & INFRASTRUKTUR) */}
        <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Komposisi Potensi & Fasilitas Desa</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Rincian Kategori Terdaftar di Database</p>
            </div>
            <Sparkles size={16} color="#10b981" />
          </div>

          {potensiChartData.length > 0 ? (
            <div style={{ width: '100%', height: '210px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={potensiChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {potensiChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.78rem' }} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '6px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '210px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '8px' }}>
              <AlertCircle size={24} />
              <p style={{ margin: 0, fontSize: '0.8rem' }}>Belum ada rincian potensi/fasilitas yang diinput.</p>
            </div>
          )}
        </div>

      </div>

      {/* ── MODUL PENCARIAN CEPAT WARGA / DATA KEPENDUDUKAN ── */}
      <div style={{ background: '#fff', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} color="#3b82f6" /> Modul Pencarian Cepat Warga Desa
            </h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
              Cari data 849 warga desa secara langsung berdasarkan Nama, NIK, atau Dusun.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Filter Dusun */}
            <select
              value={selectedDusunFilter}
              onChange={(e) => setSelectedDusunFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem', outline: 'none', background: '#f8fafc', fontWeight: 600 }}
            >
              <option value="SEMUA">Semua Dusun</option>
              <option value="Bo'di">Dusun Bo'di</option>
              <option value="Butungan">Dusun Butungan</option>
              <option value="Binanga">Dusun Binanga</option>
              <option value="Tandang Bulo">Dusun Tandang Bulo</option>
            </select>

            {/* Input Search */}
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={13} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Cari Nama / NIK..."
                value={residentSearch}
                onChange={(e) => setResidentSearch(e.target.value)}
                style={{ width: '100%', padding: '6px 8px 6px 28px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* TABLE WARGA */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '7px 10px' }}>Nama Lengkap</th>
                <th style={{ padding: '7px 10px' }}>NIK</th>
                <th style={{ padding: '7px 10px' }}>Dusun</th>
                <th style={{ padding: '7px 10px' }}>Jenis Kelamin</th>
                <th style={{ padding: '7px 10px' }}>Pekerjaan</th>
              </tr>
            </thead>
            <tbody>
              {filteredPenduduk.length > 0 ? (
                filteredPenduduk.slice(0, 5).map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '7px 10px', fontWeight: 600, color: '#0f172a' }}>{item.namaLengkap}</td>
                    <td style={{ padding: '7px 10px', color: '#64748b', fontFamily: 'monospace' }}>{item.nik}</td>
                    <td style={{ padding: '7px 10px', color: '#2563eb', fontWeight: 600 }}>{item.dusunDomisili}</td>
                    <td style={{ padding: '7px 10px' }}>
                      <span style={{
                        padding: '2px 7px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700,
                        background: item.jenisKelamin === 'LAKI-LAKI' ? '#dbeafe' : '#ffe4e6',
                        color: item.jenisKelamin === 'LAKI-LAKI' ? '#1d4ed8' : '#e11d48'
                      }}>
                        {item.jenisKelamin}
                      </span>
                    </td>
                    <td style={{ padding: '7px 10px', color: '#475569' }}>{item.pekerjaanUtama}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                    Data warga tidak ditemukan. Coba ketik nama lain di kolom pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <Link href="/admin/penduduk" style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Lihat Semua Data Penduduk <ArrowRight size={13} />
          </Link>
        </div>

      </div>

    </div>
  );
}
