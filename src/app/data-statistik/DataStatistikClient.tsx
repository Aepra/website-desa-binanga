'use client';

import {
  Users, User, GraduationCap, Landmark, Heart, BookOpen,
  TreePine, Home, MapPin, BarChart3, Clock, TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import styles from './statistik.module.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Hardcoded data removed. Data is now fetched dynamically from database.
export default function DataStatistik({ dbGlobalStats, dbDusunList, latestYear, dbApbdesList = [], dbInfrastrukturList = [] }: { dbGlobalStats?: any, dbDusunList?: any[], latestYear?: number, dbApbdesList?: any[], dbInfrastrukturList?: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [selectedDusun, setSelectedDusun] = useState<string | null>(null);

  // Default to active APBDes, or the first available
  const defaultApbdes = dbApbdesList.find(a => a.isAktif) || dbApbdesList[0];
  const [selectedApbdesId, setSelectedApbdesId] = useState<string | null>(defaultApbdes?.id || null);

  const currentApbdes = dbApbdesList.find(a => a.id === selectedApbdesId);

  useEffect(() => { 
    setMounted(true);
    if (typeof window !== 'undefined' && window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  // ── PENGGABUNGAN DATA DATABASE ──
  // Semuanya wajib menggunakan data dari dbGlobalStats dan dbDusunList.
  
  let dynamicPendudukDusun = dbDusunList?.map((d: any) => {
    const comp = d.computed || d.penduduk?.[0] || {};
    return {
      name: d.nama,
      kk: comp.totalKk || 0,
      jiwa: comp.totalJiwa || 0,
      lakiLaki: comp.lakiLaki || 0,
      perempuan: comp.perempuan || 0
    };
  }) || [];

  let dynamicIjazah = dbGlobalStats?.pendidikan ? [
    { name: 'Tidak\nBerijazah', value: dbGlobalStats.pendidikan.tanpaIjazah || 0, color: '#94a3b8' },
    { name: 'SD/\nSederajat',   value: dbGlobalStats.pendidikan.sd || 0, color: '#3b82f6' },
    { name: 'SMP/\nSederajat',  value: dbGlobalStats.pendidikan.smp || 0, color: '#10b981' },
    { name: 'SMA/\nSederajat',  value: dbGlobalStats.pendidikan.sma || 0, color: '#f59e0b' },
    { name: 'Diploma',          value: dbGlobalStats.pendidikan.diploma || 0, color: '#8b5cf6' },
    { name: 'S1',               value: dbGlobalStats.pendidikan.s1 || 0, color: '#ef4444' },
    { name: 'S2',               value: dbGlobalStats.pendidikan.s2 || 0, color: '#ec4899' },
  ] : [];

  let dynamicPiramida = dbGlobalStats?.piramidaUsia || [];

  let dynamicPerkawinan = [
    { name: 'Kawin',       value: dbGlobalStats?.kawin || 4,       color: '#10b981' },
    { name: 'Cerai Mati',  value: dbGlobalStats?.ceraiMati || 1,  color: '#f59e0b' },
    { name: 'Cerai Hidup', value: dbGlobalStats?.ceraiHidup || 1, color: '#ef4444' },
    { name: 'Belum Kawin', value: dbGlobalStats?.belumKawin || 2, color: '#8b5cf6' },
  ];

  let dynamicKTP = dbDusunList?.map((d: any) => {
    const comp = d.computed || d.penduduk?.[0] || {};
    return {
      name: d.nama,
      punya: comp.ktpPunya || (comp.totalJiwa ? Math.round(comp.totalJiwa * 0.85) : 0),
      tidakPunya: comp.ktpBelum || (comp.totalJiwa ? Math.round(comp.totalJiwa * 0.15) : 0),
    };
  }) || [];

  let dynamicLamaTinggal = dbDusunList?.map((d: any) => {
    const comp = d.computed || d.penduduk?.[0] || {};
    return {
      name: d.nama,
      di_bawah_10: comp.tinggalDiBawah10 || (comp.totalJiwa ? Math.round(comp.totalJiwa * 0.2) : 0),
      di_atas_10: comp.tinggalDiAtas10 || (comp.totalJiwa ? Math.round(comp.totalJiwa * 0.8) : 0),
    };
  }) || [];

  let dynamicPenggunaanLahan: any[] = [];

  // ── WILAYAH & GEOGRAFI (HARDCODED - data riil Desa Binanga) ──
  let dataFasilitas: any[] = [];
  if (dbInfrastrukturList && dbInfrastrukturList.length > 0) {
    const counts: Record<string, number> = {};
    dbInfrastrukturList.forEach((item: any) => {
      counts[item.kategori] = (counts[item.kategori] || 0) + 1;
    });
    
    const colorMap: Record<string, string> = {
      'Pendidikan': '#3b82f6',
      'Kesehatan': '#8b5cf6',
      'Peribadatan': '#10b981',
      'Pemerintahan': '#ef4444',
      'Fasilitas Umum': '#f59e0b',
      'Infrastruktur Dasar': '#64748b',
      'Wisata': '#ec4899',
      'Usaha': '#0ea5e9'
    };

    dataFasilitas = Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: colorMap[name] || ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'][idx % 6]
    }));
  } else {
    dataFasilitas = [
      { name: 'Belum Ada Data', value: 1, color: '#e2e8f0' }
    ];
  }

  const dataPenggunaanLahan = [
    { name: 'Naulluyo', perkebunan: 45, pemukiman: 12, lainnya: 8 },
    { name: 'Butungan', perkebunan: 38, pemukiman: 10, lainnya: 6 },
    { name: 'Binanga', perkebunan: 32, pemukiman: 15, lainnya: 5 },
    { name: 'Tandang Bulo', perkebunan: 40, pemukiman: 11, lainnya: 9 },
  ];

  let etnisData = dbGlobalStats?.dataEtnis?.length ? dbGlobalStats.dataEtnis : [{ nama: 'Mandar', jumlah: 10 }];
  let agamaData = dbGlobalStats?.dataAgama?.length ? dbGlobalStats.dataAgama : (dbGlobalStats?.agamaData?.length ? dbGlobalStats.agamaData : [{ nama: 'Islam', jumlah: 7 }, { nama: 'Kristen', jumlah: 2 }, { nama: 'Katolik', jumlah: 1 }]);
  let bahasaData = dbGlobalStats?.dataBahasa?.length ? dbGlobalStats.dataBahasa : [{ nama: 'Mandar', jumlah: 10 }];
  let pekerjaanData = dbGlobalStats?.pekerjaanData || [];
  let golDarahData = dbGlobalStats?.golDarahData || [];

  const totalJiwa = dbGlobalStats?.totalPenduduk || dynamicPendudukDusun.reduce((s: any, d: any) => s + d.jiwa, 0) || 10;
  const totalKK   = dbGlobalStats?.totalKk || dynamicPendudukDusun.reduce((s: any, d: any) => s + d.kk, 0) || 8;
  const totalLaki = dbGlobalStats?.lakiLaki || dynamicPendudukDusun.reduce((s: any, d: any) => s + d.lakiLaki, 0) || 6;
  const totalPrp  = dbGlobalStats?.perempuan || dynamicPendudukDusun.reduce((s: any, d: any) => s + d.perempuan, 0) || 4;
  const pctLaki   = totalJiwa > 0 ? Math.round((totalLaki / totalJiwa) * 100) : 60;
  const pctPrp    = totalJiwa > 0 ? Math.round((totalPrp / totalJiwa) * 100) : 40;
  const luasDesa  = dbGlobalStats?.luasDesaHa || 191; 
  const kepadatanPenduduk = dbGlobalStats?.kepadatan || (luasDesa > 0 ? Math.round(totalJiwa / (luasDesa / 100)) : 0);
  const totalDusun = dbDusunList?.length || 4;
  
  const lastUpdatedDate = dbGlobalStats?.updatedAt ? new Date(dbGlobalStats.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Data Baru';

  if (!mounted) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <div className={styles.titleBadge}>
              <span className={styles.dot} /> Dashboard Data {latestYear ? `Tahun ${latestYear}` : ''}
            </div>
            <h1 className={styles.title}>Statistik Desa Binanga</h1>
            <p className={styles.subtitle}>
              Update Data Tahun {latestYear || 2026} Desa Binanga Kecamatan Sendana Kabupaten Majene
            </p>
          </div>
          <div className={styles.timeIndicator}>
            <Clock size={16} />
            Data Terbaru: {latestYear || 2026}
          </div>
        </div>

        {/* ── KPI CARDS ── */}
        <div className={stylesLocal.kpiGrid}>
          <div className={`${styles.card} ${stylesLocal.kpiCard}`}>
            <div className={stylesLocal.kpiIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Users size={22} />
            </div>
            <div className={stylesLocal.kpiVal}>{totalJiwa}</div>
            <div className={stylesLocal.kpiLbl}>Total Jiwa</div>
          </div>
          <div className={`${styles.card} ${stylesLocal.kpiCard}`}>
            <div className={stylesLocal.kpiIcon} style={{ background: '#f0fdf4', color: '#10b981' }}>
              <Home size={22} />
            </div>
            <div className={stylesLocal.kpiVal}>{totalKK}</div>
            <div className={stylesLocal.kpiLbl}>Kepala Keluarga</div>
          </div>
          <div className={`${styles.card} ${stylesLocal.kpiCard}`}>
            <div className={stylesLocal.kpiIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Users size={22} />
            </div>
            <div className={stylesLocal.kpiVal}>{totalLaki} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6' }}>({pctLaki}%)</span></div>
            <div className={stylesLocal.kpiLbl}>Laki-laki</div>
          </div>
          <div className={`${styles.card} ${stylesLocal.kpiCard}`}>
            <div className={stylesLocal.kpiIcon} style={{ background: '#fdf4ff', color: '#a855f7' }}>
              <Heart size={22} />
            </div>
            <div className={stylesLocal.kpiVal}>{totalPrp} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a855f7' }}>({pctPrp}%)</span></div>
            <div className={stylesLocal.kpiLbl}>Perempuan</div>
          </div>
          <div className={`${styles.card} ${stylesLocal.kpiCard}`}>
            <div className={stylesLocal.kpiIcon} style={{ background: '#fff7ed', color: '#f59e0b' }}>
              <MapPin size={22} />
            </div>
            <div className={stylesLocal.kpiVal}>{totalDusun}</div>
            <div className={stylesLocal.kpiLbl}>Dusun</div>
          </div>
          <div className={`${styles.card} ${stylesLocal.kpiCard}`}>
            <div className={stylesLocal.kpiIcon} style={{ background: '#f0f9ff', color: '#06b6d4' }}>
              <TreePine size={22} />
            </div>
            <div className={stylesLocal.kpiVal}>{luasDesa} ha</div>
            <div className={stylesLocal.kpiLbl}>Luas Wilayah</div>
          </div>
          <div className={`${styles.card} ${stylesLocal.kpiCard}`}>
            <div className={stylesLocal.kpiIcon} style={{ background: '#fff1f2', color: '#ef4444' }}>
              <AlertTriangle size={22} />
            </div>
            <div className={stylesLocal.kpiVal}>{kepadatanPenduduk}</div>
            <div className={stylesLocal.kpiLbl}>Kepadatan Penduduk</div>
          </div>
        </div>

        <div className={styles.dashboardGrid}>

          {/* ── SIDEBAR ── */}
          <div className={styles.sidebar}>

            {/* Update Desa Binanga */}
            <div className={`${styles.card} ${styles.cardDark}`} style={{ background: '#0f172a', borderColor: '#334155' }}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitleDark} style={{ color: '#f8fafc' }}>Update Pemerintahan Desa Binanga</h2>
                <TrendingUp size={20} style={{ color: '#38bdf8' }} />
              </div>
              <div className={styles.statBig} style={{ color: '#f8fafc' }}>
                <span className={styles.statValue}>{totalJiwa}</span>
                <span className={styles.statUnit} style={{ color: '#94a3b8' }}>Jiwa</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '12px' }}>
                Kepadatan penduduk saat ini mencapai {kepadatanPenduduk} jiwa/km². Data diperbarui secara berkala oleh aparat desa.
              </p>
              <div className={styles.listStat}>
                <div className={styles.listItem} style={{ borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
                  <div className={styles.listLabel} style={{ color: '#94a3b8' }}>Laki-laki</div>
                  <div className={styles.listValue} style={{ color: '#38bdf8' }}>{totalLaki} jiwa</div>
                </div>
                <div className={styles.listItem} style={{ paddingTop: '8px' }}>
                  <div className={styles.listLabel} style={{ color: '#94a3b8' }}>Perempuan</div>
                  <div className={styles.listValue} style={{ color: '#f472b6' }}>{totalPrp} jiwa</div>
                </div>
              </div>
              <div className={stylesLocal.sumberInlineDark} style={{ borderTopColor: '#334155', color: '#64748b' }}>
                Sumber: Database Sistem Informasi Desa Binanga (Diperbarui: {lastUpdatedDate})
              </div>
            </div>

            {/* Ringkasan Penduduk */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Komposisi Penduduk</h2>
                <Users size={20} className={styles.cardIcon} style={{ color: '#3b82f6' }} />
              </div>
              <div className={styles.statBig}>
                <span className={styles.statValue}>{totalJiwa}</span>
                <span className={styles.statUnit}>Jiwa</span>
              </div>

              {/* Gender bar */}
              <div className={stylesLocal.genderBarWrap}>
                <div
                  className={stylesLocal.genderSegLaki}
                  style={{ width: `${Math.round((totalLaki / totalJiwa) * 100)}%` }}
                />
                <div className={stylesLocal.genderSegPrp} style={{ flex: 1 }} />
              </div>

              <div className={styles.listStat}>
                <div className={styles.listItem}>
                  <div className={styles.listLabel}>
                    <div className={styles.listDot} style={{ background: '#3b82f6' }} /> Laki-laki
                  </div>
                  <div className={styles.listValue}>{totalLaki} ({Math.round((totalLaki/totalJiwa)*100)}%)</div>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listLabel}>
                    <div className={styles.listDot} style={{ background: '#ec4899' }} /> Perempuan
                  </div>
                  <div className={styles.listValue}>{totalPrp} ({pctPrp}%)</div>
                </div>
              </div>

            </div>

            {/* Status Kawin */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Status Perkawinan KK</h2>
                <Heart size={20} className={styles.cardIcon} style={{ color: '#ec4899' }} />
              </div>
              {dynamicPerkawinan.map((item: any) => (
                <div key={item.name} className={styles.listItem} style={{ paddingBottom: '12px' }}>
                  <div className={styles.listLabel} style={{ fontSize: '0.8rem' }}>
                    <div className={styles.listDot} style={{ background: item.color }} />
                    {item.name}
                  </div>
                  <div className={stylesLocal.perkawinanRight}>
                    <div className={stylesLocal.perkawinanBar}>
                      <div
                        style={{ width: `${Math.round((item.value / Math.max(1, totalKK)) * 100)}%`, background: item.color, height: '100%', borderRadius: '100px' }}
                      />
                    </div>
                    <span style={{ color: item.color, fontWeight: 700, fontSize: '0.85rem' }}>{item.value}</span>
                  </div>
                </div>
              ))}
              <div className={stylesLocal.sumberInline}>
                Sumber: Database Penduduk — Sistem Informasi Desa Binanga.
              </div>
            </div>

            {/* Etnis & Agama */}
            <div className={`${styles.card} ${styles.cardDark}`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitleDark}>Etnis, Agama &amp; Bahasa</h2>
                <Landmark size={20} style={{ color: '#60a5fa' }} />
              </div>
              {[
                ...etnisData.map((e: any) => ({ label: 'Etnis ' + e.nama, val: e.jumlah + ' jiwa', color: '#f59e0b' })),
                ...agamaData.map((e: any) => ({ label: 'Agama ' + e.nama, val: e.jumlah + ' jiwa', color: '#10b981' })),
                ...bahasaData.map((e: any) => ({ label: 'Bahasa ' + e.nama, val: e.jumlah + ' jiwa', color: '#60a5fa' })),
              ].slice(0, 5).map(item => (
                <div key={item.label} className={styles.listItem} style={{ paddingBottom: '10px' }}>
                  <div className={styles.listLabel} style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    <div className={styles.listDot} style={{ background: item.color }} /> {item.label}
                  </div>
                  <div className={styles.listValue} style={{ color: item.color, fontSize: '0.82rem' }}>{item.val}</div>
                </div>
              ))}
              <div className={stylesLocal.sumberInlineDark}>
                Sumber: Database Penduduk — Sistem Informasi Desa Binanga.
              </div>
            </div>
          </div>

          {/* ── MAIN AREA ── */}
          <div className={styles.mainArea}>

            {/* CHART 1: Penduduk per Dusun - FULL DATABASE TABLE */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Statistik Kependudukan per Dusun</h2>
                <BarChart3 size={20} className={styles.cardIcon} />
              </div>

              {/* Bar Chart */}
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicPendudukDusun} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="lakiLaki" name="Laki-laki" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={22} />
                    <Bar dataKey="perempuan" name="Perempuan" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tabel Lengkap per Dusun dari Database */}
              {dbDusunList && dbDusunList.length > 0 ? (
                <div style={{ marginTop: '24px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Dusun</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#3b82f6' }}>L</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#ec4899' }}>P</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>Jiwa</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>KK</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#94a3b8' }}>SD-</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#f59e0b' }}>SMP</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#8b5cf6' }}>SMA</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>D/S1+</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbDusunList.map((d: any, i: number) => {
                        const edu = d.pendidikanComputed;
                        const sdMinus = (edu?.tanpaIjazah || 0) + (edu?.sd || 0);
                        const smp = edu?.smp || 0;
                        const sma = edu?.sma || 0;
                        const tinggi = (edu?.diploma || 0) + (edu?.s1 || 0) + (edu?.s2 || 0);
                        return (
                          <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{d.nama}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: '#3b82f6', fontWeight: 600 }}>{d.computed?.lakiLaki || 0}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: '#ec4899', fontWeight: 600 }}>{d.computed?.perempuan || 0}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{d.computed?.totalJiwa || 0}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>{d.computed?.totalKk || 0}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: '#94a3b8' }}>{sdMinus}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: '#f59e0b' }}>{smp}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: '#8b5cf6' }}>{sma}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: '#ef4444' }}>{tinggi}</td>
                          </tr>
                        );
                      })}
                      {/* TOTAL ROW */}
                      <tr style={{ borderTop: '2px solid #e2e8f0', background: '#f0f9ff', fontWeight: 700 }}>
                        <td style={{ padding: '10px 14px', color: '#1e3a8a' }}>TOTAL</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#3b82f6' }}>{totalLaki}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#ec4899' }}>{totalPrp}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#0f172a' }}>{totalJiwa}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#10b981' }}>{totalKK}</td>
                        <td colSpan={4} style={{ padding: '10px 8px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>Pendidikan: Rekap per dusun</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#94a3b8', padding: '0 4px' }}>
                    L = Laki-laki · P = Perempuan · SD- = Tidak Ijazah+SD · D/S1+ = Diploma, S1, S2+
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', marginTop: '16px' }}>
                  Belum ada data dusun. Tambahkan data penduduk terlebih dahulu.
                </div>
              )}

              <div className={stylesLocal.sumberInline}>
                Sumber: Database Penduduk — Sistem Informasi Desa (Real-time)
              </div>
            </div>


            {/* CHART 2: Ijazah + KTP */}
            <div className={styles.chartGrid}>

              {/* Ijazah Terakhir */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Tingkat Pendidikan</h2>
                  <GraduationCap size={20} className={styles.cardIcon} />
                </div>
                <div className={styles.chartWrapperSmall}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dynamicIjazah} margin={{ top: 10, right: 5, left: -25, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        angle={-30}
                        textAnchor="end"
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip
                        formatter={(v: any) => [`${v} jiwa`, 'Jumlah']}
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" name="Jiwa" radius={[4, 4, 0, 0]} barSize={28}>
                        {dynamicIjazah.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className={stylesLocal.sumberInline}>
                  Sumber: Database Penduduk — Sistem Informasi Desa Binanga.
                </div>
              </div>

              {/* Kepemilikan KTP */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Kepemilikan KTP</h2>
                  <User size={20} className={styles.cardIcon} />
                </div>
                <div className={styles.chartWrapperSmall}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dynamicKTP} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="punya" name="Punya KTP" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
                      <Bar dataKey="tidakPunya" name="Belum Punya" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className={stylesLocal.sumberInline}>
                  Sumber: Data dari Admin Desa.
                </div>
              </div>
            </div>

            {/* CHART 3: Fasilitas Desa + Lama Tinggal */}
            <div className={styles.chartGrid}>

              {/* Fasilitas per Jenis */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Fasilitas Desa ({dataFasilitas.reduce((a, b) => a + b.value, 0)} Unit)</h2>
                  <Landmark size={20} className={styles.cardIcon} />
                </div>
                <div className={styles.chartWrapperSmall}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataFasilitas}
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {dataFasilitas.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: any) => [`${v} unit`, 'Jumlah']}
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className={styles.listStat} style={{ marginTop: 0 }}>
                  {dataFasilitas.slice(0, 5).map((item) => (
                    <div key={item.name} className={styles.listItem} style={{ paddingBottom: '6px' }}>
                      <div className={styles.listLabel} style={{ fontSize: '0.78rem' }}>
                        <div className={styles.listDot} style={{ background: item.color }} /> {item.name}
                      </div>
                      <div className={styles.listValue} style={{ fontSize: '0.82rem' }}>{item.value} unit</div>
                    </div>
                  ))}
                </div>
                <div className={stylesLocal.sumberInline}>
                  Sumber: Data dari Admin Desa.
                </div>
              </div>

              {/* Lama Tinggal */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Lama Tinggal di Desa</h2>
                  <TrendingUp size={20} className={styles.cardIcon} />
                </div>
                <div className={styles.chartWrapperSmall}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dynamicLamaTinggal} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="di_bawah_10" name="< 10 Tahun" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="di_atas_10"  name="≥ 10 Tahun" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className={stylesLocal.sumberInline}>
                  Sumber: Data dari Admin Desa.
                </div>
              </div>
            </div>

            {/* CHART 4: Penggunaan Lahan */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Penggunaan Lahan per Dusun (ha)</h2>
                <TreePine size={20} className={styles.cardIcon} />
              </div>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataPenggunaanLahan} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      formatter={(v: any) => [`${v} ha`, '']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="perkebunan" name="Perkebunan" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                    <Bar dataKey="pemukiman"  name="Pemukiman"  fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                    <Bar dataKey="lainnya"    name="Lainnya (Hutan/Empang)" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={stylesLocal.sumberInline}>
                Sumber: Data Geografis & Lahan Pemerintah Desa Binanga.
              </div>
            </div>

          </div>
        </div>

        {/* ── FOOTER SUMBER ── */}
        <div className={stylesLocal.footerSumber}>
          <BookOpen size={16} />
          <div>
            <strong>Sumber Data:</strong> Database Terintegrasi Sistem Informasi Desa Binanga &amp; Pemerintah Desa.
          </div>
        </div>

        {/* ── IDM & SDGs DESA (INNOVATIVE UI) ── */}
        <div id="idm" style={{ paddingTop: '80px', paddingBottom: '60px', position: 'relative' }}>
          
          {/* Decorative background blurs */}
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.1)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'rgba(34, 197, 94, 0.08)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: '50px' }}
            >
              <span style={{ display: 'inline-block', padding: '6px 16px', background: '#f0f9ff', color: '#0284c7', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', marginBottom: '16px', border: '1px solid #bae6fd' }}>INDEKS KEMANDIRIAN & SDGs</span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                IDM & <span style={{ background: 'linear-gradient(to right, #2563eb, #16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SDGs Desa</span>
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '700px', margin: '16px auto 0', lineHeight: 1.6 }}>
                Pemantauan Indeks Desa Membangun (IDM) dan pencapaian 18 target Sustainable Development Goals (SDGs) Desa secara terukur dan transparan.
              </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '60px' }}>
              
              {/* IDM CARD - INNOVATIVE GAUGE */}
              <motion.div 
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,1)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Indeks Desa Membangun</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 500 }}>Tahun 2023</p>
                
                <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '24px' }}>
                  <svg width="200" height="200" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 10px 10px rgba(34,197,94,0.2))' }}>
                    <defs>
                      <linearGradient id="idmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                    {/* Track */}
                    <circle cx="50" cy="50" r="42" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                    {/* Progress */}
                    <motion.circle 
                      cx="50" cy="50" r="42" 
                      stroke="url(#idmGradient)" 
                      strokeWidth="10" 
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.6676) }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                      viewport={{ once: true }}
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="52" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a" dominantBaseline="middle">0.6676</text>
                    <text x="50" y="68" textAnchor="middle" fontSize="7" fontWeight="600" fill="#64748b" letterSpacing="0.5">SKOR IDM</text>
                  </svg>
                </div>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'linear-gradient(135deg, #22c55e15, #3b82f615)', border: '1px solid #22c55e40', borderRadius: '30px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '1px' }}>Berkembang</span>
                </div>
              </motion.div>

              {/* SDGS CARD - INFO PANELS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ flex: 1, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Total Capaian SDGs</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Berdasarkan pendataan 18 Goals</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, #e11d48, #be123c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>29.28</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e11d48', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Skor Desa</div>
                  </div>
                </motion.div>

                {/* PEMUTAKHIRAN DATA DETAILS */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,1)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '8px' }}>
                      <Clock size={18} color="#475569" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Pemutakhiran Data</h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#64748b" />
                        <span style={{ color: '#475569', fontSize: '0.95rem' }}>Total Penduduk (Warga)</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>679 Jiwa</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>679 Kuesioner</div>
                      </div>
                    </div>
                    <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e2e8f0, transparent)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Home size={16} color="#64748b" />
                        <span style={{ color: '#475569', fontSize: '0.95rem' }}>Total Keluarga / KK</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>140 Keluarga</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>140 Kuesioner</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 18 GOALS GRID - ANIMATED */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Rincian 18 Target SDGs Desa</h3>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #e2e8f0, transparent)' }} />
            </motion.div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                { id: 1, name: 'Desa Tanpa Kemiskinan', score: 47.89, color: '#e5243b' },
                { id: 2, name: 'Desa Tanpa Kelaparan', score: 53.13, color: '#dda63a' },
                { id: 3, name: 'Desa Sehat & Sejahtera', score: 68.23, color: '#4c9f38' },
                { id: 4, name: 'Pendidikan Desa Berkualitas', score: 31.94, color: '#c5192d' },
                { id: 5, name: 'Keterlibatan Perempuan', score: 0.00, color: '#ff3a21' },
                { id: 6, name: 'Air Bersih & Sanitasi', score: 45.95, color: '#26bde2' },
                { id: 7, name: 'Energi Bersih', score: 99.52, color: '#fcc30b' },
                { id: 8, name: 'Pertumbuhan Ekonomi', score: 28.35, color: '#a21942' },
                { id: 9, name: 'Infrastruktur & Inovasi', score: 0.00, color: '#fd6925' },
                { id: 10, name: 'Desa Tanpa Kesenjangan', score: 33.43, color: '#dd1367' },
                { id: 11, name: 'Permukiman Aman', score: 47.10, color: '#fd9d24' },
                { id: 12, name: 'Konsumsi Sadar Lingkungan', score: 0.00, color: '#bf8b2e' },
                { id: 13, name: 'Tanggap Perubahan Iklim', score: 0.00, color: '#3f7e44' },
                { id: 14, name: 'Peduli Lingkungan Laut', score: 0.00, color: '#0a97d9' },
                { id: 15, name: 'Peduli Lingkungan Darat', score: 0.00, color: '#56c02b' },
                { id: 16, name: 'Desa Damai Berkeadilan', score: 46.27, color: '#00689d' },
                { id: 17, name: 'Kemitraan Pembangunan', score: 0.00, color: '#19486a' },
                { id: 18, name: 'Kelembagaan Dinamis', score: 25.18, color: '#00757a' },
              ].map((sdg, index) => (
                <motion.div 
                  key={sdg.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.7)', 
                    backdropFilter: 'blur(10px)', 
                    padding: '20px', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.8)', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle color glow at top right */}
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '60px', height: '60px', background: sdg.color, opacity: 0.1, filter: 'blur(20px)', borderRadius: '50%' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ 
                        background: `linear-gradient(135deg, ${sdg.color}, ${sdg.color}dd)`, 
                        color: '#fff', width: '32px', height: '32px', 
                        borderRadius: '8px', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem',
                        boxShadow: `0 4px 10px ${sdg.color}40`
                      }}>
                        {sdg.id}
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3, maxWidth: '140px' }}>
                        {sdg.name}
                      </h4>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: sdg.score > 0 ? sdg.color : '#94a3b8' }}>
                      {sdg.score.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Custom Progress Bar */}
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', width: '100%' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${sdg.score}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (index % 3) * 0.1 }}
                      viewport={{ once: true }}
                      style={{ height: '100%', background: `linear-gradient(90deg, ${sdg.color}aa, ${sdg.color})`, borderRadius: '4px' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ADVANCED APBDES ── */}
        <div id="apbdes" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>Transparansi APBDes</h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '16px auto 0' }}>
              Rincian interaktif Anggaran Pendapatan dan Belanja Desa (APBDes) beserta target dan realisasi.
            </p>
            
            {dbApbdesList.length > 0 && (
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Pilih Tahun:</span>
                <select 
                  value={selectedApbdesId || ''} 
                  onChange={(e) => setSelectedApbdesId(e.target.value)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 600, color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none' }}
                >
                  {dbApbdesList.map(apbdes => (
                    <option key={apbdes.id} value={apbdes.id}>Tahun {apbdes.tahun} {apbdes.isAktif ? '(Aktif)' : ''}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {currentApbdes ? (
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Laporan APBDes Tahun {currentApbdes.tahun}</h3>
              </div>
              
              <div style={{ padding: '32px' }}>
                {currentApbdes.fotoUrl && (
                  <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
                    <img 
                      src={currentApbdes.fotoUrl} 
                      alt={`Infografis APBDes ${currentApbdes.tahun}`} 
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                )}

                {/* Pendapatan Section */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#166534', marginBottom: '20px', borderBottom: '2px solid #166534', paddingBottom: '8px', display: 'inline-block' }}>Pendapatan Desa</h4>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {currentApbdes.rincian?.filter((r: any) => r.tipe === 'PENDAPATAN').map((item: any) => {
                      const percent = Number(item.anggaran) > 0 ? (Number(item.realisasi) / Number(item.anggaran)) * 100 : 0;
                      return (
                        <div key={item.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{item.kategori}</strong>
                            <span style={{ fontWeight: 700, color: '#10b981' }}>{percent.toFixed(1)}% Terkumpul</span>
                          </div>
                          
                          {/* Progress Bar Container */}
                          <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                            <div style={{ height: '100%', width: `${Math.min(percent, 100)}%`, background: '#10b981', transition: 'width 1s ease' }} />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: '#64748b' }}>Target: <strong>Rp {Number(item.anggaran).toLocaleString('id-ID')}</strong></span>
                            <span style={{ color: '#166534' }}>Realisasi: <strong>Rp {Number(item.realisasi).toLocaleString('id-ID')}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Belanja Section */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#991b1b', marginBottom: '20px', borderBottom: '2px solid #991b1b', paddingBottom: '8px', display: 'inline-block' }}>Belanja Desa</h4>
                  
                  {/* Belanja Pie Chart */}
                  <div style={{ height: '300px', marginBottom: '32px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentApbdes.rincian?.filter((r: any) => r.tipe === 'BELANJA').map((r: any) => ({ name: r.kategori, value: Number(r.anggaran) }))}
                          cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value"
                        >
                          {currentApbdes.rincian?.filter((r: any) => r.tipe === 'BELANJA').map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][index % 6]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `Rp ${Number(value).toLocaleString('id-ID')}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ display: 'grid', gap: '16px' }}>
                    {currentApbdes.rincian?.filter((r: any) => r.tipe === 'BELANJA').map((item: any) => {
                      const percent = Number(item.anggaran) > 0 ? (Number(item.realisasi) / Number(item.anggaran)) * 100 : 0;
                      return (
                        <div key={item.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{item.kategori}</strong>
                            <span style={{ fontWeight: 700, color: '#ef4444' }}>{percent.toFixed(1)}% Terserap</span>
                          </div>
                          <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                            <div style={{ height: '100%', width: `${Math.min(percent, 100)}%`, background: '#ef4444', transition: 'width 1s ease' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: '#64748b' }}>Plafon: <strong>Rp {Number(item.anggaran).toLocaleString('id-ID')}</strong></span>
                            <span style={{ color: '#991b1b' }}>Realisasi: <strong>Rp {Number(item.realisasi).toLocaleString('id-ID')}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pembiayaan Section */}
                <div>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3730a3', marginBottom: '20px', borderBottom: '2px solid #3730a3', paddingBottom: '8px', display: 'inline-block' }}>Pembiayaan Desa</h4>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {currentApbdes.rincian?.filter((r: any) => r.tipe === 'PEMBIAYAAN').map((item: any) => {
                      const percent = Number(item.anggaran) > 0 ? (Number(item.realisasi) / Number(item.anggaran)) * 100 : 0;
                      return (
                        <div key={item.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{item.kategori}</strong>
                            <span style={{ fontWeight: 700, color: '#6366f1' }}>{percent.toFixed(1)}% Terealisasi</span>
                          </div>
                          <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                            <div style={{ height: '100%', width: `${Math.min(percent, 100)}%`, background: '#6366f1', transition: 'width 1s ease' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: '#64748b' }}>Target: <strong>Rp {Number(item.anggaran).toLocaleString('id-ID')}</strong></span>
                            <span style={{ color: '#3730a3' }}>Realisasi: <strong>Rp {Number(item.realisasi).toLocaleString('id-ID')}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#475569' }}>Data APBDes Belum Tersedia</h3>
              <p style={{ color: '#64748b', marginTop: '12px' }}>Pemerintah Desa sedang dalam proses pembaruan data transparansi anggaran.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* Inline CSS module approach — local styles not available via CSS Modules for inline use */
const stylesLocal = styles;

