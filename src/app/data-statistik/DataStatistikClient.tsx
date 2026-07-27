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

/* ─── DATA NYATA — Sumber: Monografi Desa Binanga, LPPM IPB University ───── */

/* Kependudukan per dusun (Hal. 48) */
const dataPendudukDusun = [
  { name: "Bo'di",    kk: 65,  jiwa: 240, lakiLaki: 124, perempuan: 116 },
  { name: 'Butungan', kk: 49,  jiwa: 165, lakiLaki: 81,  perempuan: 84  },
  { name: 'Naulluyo', kk: 45,  jiwa: 193, lakiLaki: 84,  perempuan: 109 },
  { name: 'Binanga',  kk: 62,  jiwa: 251, lakiLaki: 121, perempuan: 130 },
];

/* Piramida penduduk - Dusun Bo'di (Hal. 49-50) */
const dataPiramidaBodi = [
  { usia: '>=65', lakiLaki: 8,  perempuan: 6  },
  { usia: '60-64', lakiLaki: 6, perempuan: 4  },
  { usia: '55-59', lakiLaki: 3, perempuan: 7  },
  { usia: '50-54', lakiLaki: 5, perempuan: 7  },
  { usia: '45-49', lakiLaki: 2, perempuan: 5  },
  { usia: '40-44', lakiLaki: 7, perempuan: 5  },
  { usia: '35-39', lakiLaki: 8, perempuan: 15 },
  { usia: '30-34', lakiLaki: 10, perempuan: 7 },
  { usia: '25-29', lakiLaki: 8, perempuan: 8  },
  { usia: '20-24', lakiLaki: 14, perempuan: 11 },
  { usia: '15-19', lakiLaki: 16, perempuan: 12 },
  { usia: '10-14', lakiLaki: 16, perempuan: 6  },
  { usia: '5-9',   lakiLaki: 10, perempuan: 10 },
  { usia: '0-4',   lakiLaki: 11, perempuan: 12 },
];

/* Status perkawinan KK (Tabel 7, Hal. 53) */
const dataPerkawinan = [
  { name: 'Kawin',       value: 166, color: '#10b981' },
  { name: 'Cerai Mati',  value: 39,  color: '#f59e0b' },
  { name: 'Cerai Hidup', value: 9,   color: '#ef4444' },
  { name: 'Belum Kawin', value: 7,   color: '#8b5cf6' },
];

/* Ijazah terakhir (Tabel 8, Hal. 57) */
const dataIjazah = [
  { name: 'Tidak\nBerijazah', value: 221, color: '#94a3b8' },
  { name: 'SD/\nSederajat',   value: 224, color: '#3b82f6' },
  { name: 'SMP/\nSederajat',  value: 122, color: '#10b981' },
  { name: 'SMA/\nSederajat',  value: 216, color: '#f59e0b' },
  { name: 'Diploma',          value: 22,  color: '#8b5cf6' },
  { name: 'S1',               value: 43,  color: '#ef4444' },
  { name: 'S2',               value: 1,   color: '#ec4899' },
];

/* KTP per dusun (Hal. 52) */
const dataKTP = [
  { name: "Bo'di",    punya: 159, tidakPunya: 81  },
  { name: 'Butungan', punya: 144, tidakPunya: 21  },
  { name: 'Naulluyo', punya: 135, tidakPunya: 58  },
  { name: 'Binanga',  punya: 206, tidakPunya: 45  },
];

/* Lama tinggal (Gambar 18, Hal. 53) */
const dataLamaTinggal = [
  { name: "Bo'di",    di_bawah_10: 12, di_atas_10: 53 },
  { name: 'Butungan', di_bawah_10: 11, di_atas_10: 38 },
  { name: 'Naulluyo', di_bawah_10: 5,  di_atas_10: 40 },
  { name: 'Binanga',  di_bawah_10: 8,  di_atas_10: 54 },
];

/* Fasilitas umum (Tabel 4, Hal. 41-42) */
const dataFasilitas = [
  { name: 'Barang & Jasa', value: 42, color: '#3b82f6' },
  { name: 'Sumber Air',    value: 6,  color: '#06b6d4' },
  { name: 'Pendidikan',    value: 4,  color: '#10b981' },
  { name: 'Peribadatan',   value: 3,  color: '#f59e0b' },
  { name: 'Keamanan',      value: 3,  color: '#8b5cf6' },
  { name: 'Kesehatan',     value: 2,  color: '#ef4444' },
  { name: 'Olahraga',      value: 2,  color: '#ec4899' },
  { name: 'Lainnya',       value: 6,  color: '#94a3b8' },
];

/* Penggunaan lahan (Tabel Lahan, Hal. 43) */
const dataPenggunaanLahan = [
  { name: "Bo'di",   perkebunan: 46.8, pemukiman: 2.8, lainnya: 1.4 },
  { name: 'Butungan', perkebunan: 6.9, pemukiman: 1.7, lainnya: 0.7 },
  { name: 'Naulluyo', perkebunan: 75.8, pemukiman: 1.9, lainnya: 14.8 },
  { name: 'Binanga',  perkebunan: 24.1, pemukiman: 2.5, lainnya: 11.6 },
];

export default function DataStatistik({ dbGlobalStats, dbDusunList, latestYear, dbApbdesList = [] }: { dbGlobalStats?: any, dbDusunList?: any[], latestYear?: number, dbApbdesList?: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [selectedDusun, setSelectedDusun] = useState<string | null>(null);

  // Default to active APBDes, or the first available
  const defaultApbdes = dbApbdesList.find(a => a.isAktif) || dbApbdesList[0];
  const [selectedApbdesId, setSelectedApbdesId] = useState<string | null>(defaultApbdes?.id || null);

  const currentApbdes = dbApbdesList.find(a => a.id === selectedApbdesId);

  useEffect(() => { setMounted(true); }, []);

  // ── PENGGABUNGAN DATA DATABASE vs HARDCODED ──
  // Jika dbDusunList memiliki data penduduk/pendidikan, kita gunakan itu. Jika tidak, gunakan hardcoded.
  
  let dynamicPendudukDusun = dataPendudukDusun;
  let dynamicIjazah = dataIjazah;
  
  let dynamicPiramida = dbGlobalStats?.piramidaUsia && Array.isArray(dbGlobalStats.piramidaUsia) && dbGlobalStats.piramidaUsia.length > 0 
    ? dbGlobalStats.piramidaUsia 
    : dataPiramidaBodi;

  let dynamicPerkawinan = dbGlobalStats?.kawin !== undefined 
    ? [
        { name: 'Kawin',       value: dbGlobalStats.kawin, color: '#10b981' },
        { name: 'Cerai Mati',  value: dbGlobalStats.ceraiMati,  color: '#f59e0b' },
        { name: 'Cerai Hidup', value: dbGlobalStats.ceraiHidup,   color: '#ef4444' },
        { name: 'Belum Kawin', value: dbGlobalStats.belumKawin,   color: '#8b5cf6' },
      ]
    : dataPerkawinan;

  let dynamicKTP = dataKTP;
  let dynamicLamaTinggal = dataLamaTinggal;
  let dynamicPenggunaanLahan = dataPenggunaanLahan;

  let etnisData = dbGlobalStats?.dataEtnis || [{nama: 'Mandar', jumlah: 693}];
  let agamaData = dbGlobalStats?.dataAgama || [{nama: 'Islam', jumlah: 848}];
  let bahasaData = dbGlobalStats?.dataBahasa || [{nama: 'Mandar', jumlah: 627}];

  if (dbDusunList && dbDusunList.length > 0) {
    const hasDbPenduduk = dbDusunList.some(d => d.penduduk && d.penduduk.length > 0);
    if (hasDbPenduduk) {
      dynamicPendudukDusun = dbDusunList.map(d => {
        const p = d.penduduk?.[0] || { lakiLaki: 0, perempuan: 0, totalJiwa: 0, totalKk: 0 };
        return { name: d.nama, kk: p.totalKk, jiwa: p.totalJiwa, lakiLaki: p.lakiLaki, perempuan: p.perempuan };
      });
      
      dynamicKTP = dbDusunList.map(d => {
        const p = d.penduduk?.[0] || { ktpPunya: 0, ktpBelum: 0 };
        return { name: d.nama, punya: p.ktpPunya, tidakPunya: p.ktpBelum };
      });

      dynamicLamaTinggal = dbDusunList.map(d => {
        const p = d.penduduk?.[0] || { tinggalDiBawah10: 0, tinggalDiAtas10: 0 };
        return { name: d.nama, di_bawah_10: p.tinggalDiBawah10, di_atas_10: p.tinggalDiAtas10 };
      });

      dynamicPenggunaanLahan = dbDusunList.map(d => {
        const p = d.penduduk?.[0] || { lahanPerkebunan: 0, lahanPemukiman: 0, lahanLainnya: 0 };
        return { name: d.nama, perkebunan: p.lahanPerkebunan, pemukiman: p.lahanPemukiman, lainnya: p.lahanLainnya };
      });
    }

    const hasDbPendidikan = dbDusunList.some(d => d.pendidikan && d.pendidikan.length > 0);
    if (hasDbPendidikan) {
      let t_tanpa = 0, t_sd = 0, t_smp = 0, t_sma = 0, t_dip = 0, t_s1 = 0, t_s2 = 0;
      dbDusunList.forEach(d => {
        const p = d.pendidikan?.[0];
        if (p) {
          t_tanpa += p.tanpaIjazah; t_sd += p.sd; t_smp += p.smp; t_sma += p.sma;
          t_dip += p.diploma; t_s1 += p.s1; t_s2 += p.s2;
        }
      });
      dynamicIjazah = [
        { name: 'Tidak\nBerijazah', value: t_tanpa, color: '#94a3b8' },
        { name: 'SD/\nSederajat',   value: t_sd, color: '#3b82f6' },
        { name: 'SMP/\nSederajat',  value: t_smp, color: '#10b981' },
        { name: 'SMA/\nSederajat',  value: t_sma, color: '#f59e0b' },
        { name: 'Diploma',          value: t_dip, color: '#8b5cf6' },
        { name: 'S1',               value: t_s1, color: '#ef4444' },
        { name: 'S2',               value: t_s2, color: '#ec4899' },
      ];
    }
  }

  const totalJiwa = dbGlobalStats?.totalPenduduk || dynamicPendudukDusun.reduce((s, d) => s + d.jiwa, 0);
  const totalKK   = dbGlobalStats?.totalKk || dynamicPendudukDusun.reduce((s, d) => s + d.kk, 0);
  const totalLaki = dbGlobalStats?.lakiLaki || dynamicPendudukDusun.reduce((s, d) => s + d.lakiLaki, 0);
  const totalPrp  = dbGlobalStats?.perempuan || dynamicPendudukDusun.reduce((s, d) => s + d.perempuan, 0);
  const pctPrp    = Math.round((totalPrp / totalJiwa) * 100) || 0;
  const luasDesa  = dbGlobalStats?.luasDesaHa || 191;
  const totalDusun = dbDusunList?.length || 4;

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
              Update Data Tahun {latestYear || 2022} Desa Binanga Kecamatan Sendana Kabupaten Majene
            </p>
          </div>
          <div className={styles.timeIndicator}>
            <Clock size={16} />
            Data Terbaru: {latestYear || 2022}
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
            <div className={stylesLocal.kpiIcon} style={{ background: '#fdf4ff', color: '#a855f7' }}>
              <Heart size={22} />
            </div>
            <div className={stylesLocal.kpiVal}>{pctPrp}%</div>
            <div className={stylesLocal.kpiLbl}>Proporsi Perempuan</div>
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
            <div className={stylesLocal.kpiVal}>{dbGlobalStats?.kepadatan || 575}</div>
            <div className={stylesLocal.kpiLbl}>Kepadatan Penduduk</div>
          </div>
        </div>

        <div className={styles.dashboardGrid}>

          {/* ── SIDEBAR ── */}
          <div className={styles.sidebar}>

            {/* BPS 2024 Update */}
            <div className={`${styles.card} ${styles.cardDark}`} style={{ background: '#0f172a', borderColor: '#334155' }}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitleDark} style={{ color: '#f8fafc' }}>Update BPS 2024</h2>
                <TrendingUp size={20} style={{ color: '#38bdf8' }} />
              </div>
              <div className={styles.statBig} style={{ color: '#f8fafc' }}>
                <span className={styles.statValue}>939</span>
                <span className={styles.statUnit} style={{ color: '#94a3b8' }}>Jiwa</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '12px' }}>
                Terjadi peningkatan dari data sensus sebelumnya (849 jiwa). Kepadatan penduduk mencapai 558,93 jiwa/km².
              </p>
              <div className={styles.listStat}>
                <div className={styles.listItem} style={{ borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
                  <div className={styles.listLabel} style={{ color: '#94a3b8' }}>Laki-laki</div>
                  <div className={styles.listValue} style={{ color: '#38bdf8' }}>477 jiwa</div>
                </div>
                <div className={styles.listItem} style={{ paddingTop: '8px' }}>
                  <div className={styles.listLabel} style={{ color: '#94a3b8' }}>Perempuan</div>
                  <div className={styles.listValue} style={{ color: '#f472b6' }}>462 jiwa</div>
                </div>
              </div>
              <div className={stylesLocal.sumberInlineDark} style={{ borderTopColor: '#334155', color: '#64748b' }}>
                Sumber: BPS Kab. Majene (2025). Kecamatan Sendana Dalam Angka 2025.
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
                Sumber: Data dari Admin Desa.
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
                Sumber: Data dari Admin Desa.
              </div>
            </div>
          </div>

          {/* ── MAIN AREA ── */}
          <div className={styles.mainArea}>

            {/* CHART 1: Penduduk per Dusun */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Kependudukan per Dusun</h2>
                <BarChart3 size={20} className={styles.cardIcon} />
              </div>
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
              <div className={stylesLocal.sumberInline}>
                Sumber: Data Desa Presisi, LPPM IPB University (2022). Monografi Desa Binanga. Total: 849 jiwa dalam 221 KK.
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
                  Sumber: Data Desa Presisi, LPPM IPB University (2022). Monografi Desa Binanga.
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
                  <h2 className={styles.cardTitle}>Fasilitas Desa (68 Unit)</h2>
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
                  Sumber: Data Desa Presisi, LPPM IPB University (2022). Monografi Desa Binanga.
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
                Sumber: Data Desa Presisi, LPPM IPB University (2022). Monografi Desa Binanga.
              </div>
            </div>

          </div>
        </div>

        {/* ── FOOTER SUMBER ── */}
        <div className={stylesLocal.footerSumber}>
          <BookOpen size={16} />
          <div>
            <strong>Referensi Lengkap:</strong><br />
            Monografi Desa Binanga, Kecamatan Sendana, Kabupaten Majene, Provinsi Sulawesi Barat.
            Diterbitkan oleh: <strong>Data Desa Presisi (DDP), LPPM IPB University</strong>, 2022.
            Metodologi: Sensus Partisipatif berbasis MERDESA Sensus App + Pemetaan Drone DJI Mavic 2 Pro + Citra Landsat (SAS Planet).
            Pengolahan data: ArcGIS 10.8. Jumlah parameter sensus: 176 variabel per rumah tangga.
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
                        <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
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

