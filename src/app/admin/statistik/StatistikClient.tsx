'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getStatistikByTahun, upsertBulkStatistik, getAllStatistikHistory } from './actions';
import { Save, AlertCircle, Database, Calendar, Users, BookOpen } from 'lucide-react';

type StatistikClientProps = {
  initialTahun: number;
  initialGlobal: any;
  initialDusun: any[];
  initialHistory?: any[];
};

export default function StatistikClient({ initialTahun, initialGlobal, initialDusun, initialHistory = [] }: StatistikClientProps) {
  const [selectedTahun, setSelectedTahun] = useState<number | 'all'>(initialTahun);
  const [historyData, setHistoryData] = useState(initialHistory);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Global Stats State
  const [globalStats, setGlobalStats] = useState(initialGlobal || {
    totalPenduduk: 0, lakiLaki: 0, perempuan: 0,
    totalKk: 0, kepadatan: 0, luasDesaHa: 0, sumber: '',
    kawin: 0, ceraiMati: 0, ceraiHidup: 0, belumKawin: 0,
    dataEtnis: null, dataAgama: null, dataBahasa: null, piramidaUsia: null
  });

  // Dusun Stats State (combining Penduduk and Pendidikan into one flattened model for the grid)
  const [dusunGrid, setDusunGrid] = useState<any[]>([]);

  // Initialize the grid when props change (on first load)
  useEffect(() => {
    initDusunGrid(initialDusun);
  }, [initialDusun]);

  const initDusunGrid = (dusunData: any[]) => {
    const grid = dusunData.map(d => {
      const p = d.penduduk?.[0] || { lakiLaki: 0, perempuan: 0, totalJiwa: 0, totalKk: 0 };
      const e = d.pendidikan?.[0] || { tanpaIjazah: 0, sd: 0, smp: 0, sma: 0, diploma: 0, s1: 0, s2: 0 };
      return {
        id: d.id,
        nama: d.nama,
        luasHa: d.luasHa,
        lakiLaki: p.lakiLaki,
        perempuan: p.perempuan,
        totalJiwa: p.totalJiwa,
        totalKk: p.totalKk,
        tanpaIjazah: e.tanpaIjazah,
        sd: e.sd,
        smp: e.smp,
        sma: e.sma,
        diploma: e.diploma,
        s1: e.s1,
        s2: e.s2,
        ktpPunya: p.ktpPunya || 0,
        ktpBelum: p.ktpBelum || 0,
        tinggalDiBawah10: p.tinggalDiBawah10 || 0,
        tinggalDiAtas10: p.tinggalDiAtas10 || 0,
        lahanPerkebunan: p.lahanPerkebunan || 0,
        lahanPemukiman: p.lahanPemukiman || 0,
        lahanLainnya: p.lahanLainnya || 0,
      };
    });
    setDusunGrid(grid);
  };

  // Auto-calculate Total Jiwa and auto-update Global Stats based on the grid
  useEffect(() => {
    let tJiwa = 0, tLaki = 0, tPrp = 0, tKk = 0;
    dusunGrid.forEach(d => {
      tJiwa += (d.lakiLaki + d.perempuan); // derived
      tLaki += d.lakiLaki;
      tPrp += d.perempuan;
      tKk += d.totalKk;
    });

    setGlobalStats((prev: any) => ({
      ...prev,
      totalPenduduk: tJiwa,
      lakiLaki: tLaki,
      perempuan: tPrp,
      totalKk: tKk
    }));
  }, [dusunGrid]);

  const fetchTahunData = async (tahun: number) => {
    setIsFetching(true);
    const { globalStats: gStats, dusunStats: dStats } = await getStatistikByTahun(tahun);
    setGlobalStats(gStats || {
      totalPenduduk: 0, lakiLaki: 0, perempuan: 0,
      totalKk: 0, kepadatan: 0, luasDesaHa: 0, sumber: '',
      kawin: 0, ceraiMati: 0, ceraiHidup: 0, belumKawin: 0,
      dataEtnis: null, dataAgama: null, dataBahasa: null, piramidaUsia: null
    });
    initDusunGrid(dStats);
    setIsFetching(false);
  };

  const handleTahunChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      setSelectedTahun('all');
      setIsEditMode(false);
    } else {
      const t = parseInt(val);
      setSelectedTahun(t);
      setIsEditMode(false);
      fetchTahunData(t);
    }
  };

  const selectTahunNumber = (t: number) => {
    setSelectedTahun(t);
    setIsEditMode(false);
    fetchTahunData(t);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (selectedTahun !== 'all') {
      fetchTahunData(selectedTahun);
    }
  };

  const handleGridChange = (index: number, field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setDusunGrid(prev => {
      const newGrid = [...prev];
      newGrid[index] = { ...newGrid[index], [field]: numValue };
      return newGrid;
    });
  };

  const handleSaveBulk = async () => {
    setIsSaving(true);
    
    // Prepare payload
    const dusunPayload = dusunGrid.map(d => ({
      id: d.id,
      penduduk: {
        lakiLaki: d.lakiLaki,
        perempuan: d.perempuan,
        totalJiwa: d.lakiLaki + d.perempuan, // derived
        totalKk: d.totalKk
      },
      pendidikan: {
        tanpaIjazah: d.tanpaIjazah,
        sd: d.sd,
        smp: d.smp,
        sma: d.sma,
        diploma: d.diploma,
        s1: d.s1,
        s2: d.s2
      }
    }));

    if (selectedTahun === 'all') return;
    
    const res = await upsertBulkStatistik(selectedTahun, globalStats, dusunPayload);
    if (res.success) {
      alert(`Data Statistik Tahun ${selectedTahun} berhasil disimpan!`);
      setIsEditMode(false);
      // Refresh history data just in case a new year was created
      const newHistory = await getAllStatistikHistory();
      setHistoryData(newHistory);
    } else {
      alert(res.error);
    }
    setIsSaving(false);
  };

  // Generate Year Options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + 2 - i); // From +2 years to -7 years

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '100%', overflowX: 'hidden' }}>
      
      {/* HEADER & FILTER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>Manajemen Data & Statistik</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Input data secara masal berdasarkan tahun (Time Series).</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <Calendar size={20} style={{ color: '#3b82f6' }} />
          <label style={{ fontWeight: 600 }}>Tahun Data:</label>
          <select 
            value={selectedTahun} 
            onChange={handleTahunChange}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '1rem', background: '#f8fafc', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">Semua Tahun</option>
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {isFetching ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Memuat data...</div>
      ) : selectedTahun === 'all' ? (
        /* ── 0. ALL YEARS OVERVIEW ── */
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} className="text-blue-500" /> Rekapitulasi Historis Semua Tahun
            </h2>
            <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Berikut adalah rekam jejak pertumbuhan angka demografi desa dari tahun ke tahun.
            </p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px', color: '#0f172a' }}>Tahun</th>
                <th style={{ padding: '16px', color: '#0f172a' }}>Total Penduduk</th>
                <th style={{ padding: '16px', color: '#0f172a' }}>Laki-laki</th>
                <th style={{ padding: '16px', color: '#0f172a' }}>Perempuan</th>
                <th style={{ padding: '16px', color: '#0f172a' }}>Total KK</th>
                <th style={{ padding: '16px', color: '#0f172a', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((h, i) => (
                <tr key={h.tahun} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', fontWeight: 700, color: '#0f172a' }}>{h.tahun}</td>
                  <td style={{ padding: '16px', color: '#475569' }}>{h.totalPenduduk} Jiwa</td>
                  <td style={{ padding: '16px', color: '#475569' }}>{h.lakiLaki}</td>
                  <td style={{ padding: '16px', color: '#475569' }}>{h.perempuan}</td>
                  <td style={{ padding: '16px', color: '#475569' }}>{h.totalKk} KK</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button onClick={() => selectTahunNumber(h.tahun)} style={{ padding: '8px 16px', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                      Kelola Dusun
                    </button>
                  </td>
                </tr>
              ))}
              {historyData.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Belum ada data sejarah.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* ── 1. GLOBAL STATS GRID ── */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} className="text-blue-500" /> Pengaturan Global (Tahun {selectedTahun})
            </h2>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sumber Data</label>
                {isEditMode ? (
                  <input type="text" placeholder="Cth: BPS 2024" value={globalStats.sumber || ''} onChange={e => setGlobalStats({...globalStats, sumber: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                ) : (
                  <div style={{ padding: '10px 0', fontSize: '1rem', color: '#0f172a' }}>{globalStats.sumber || '-'}</div>
                )}
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Luas Wilayah (Ha)</label>
                {isEditMode ? (
                  <input type="number" step="0.01" value={globalStats.luasDesaHa || ''} onChange={e => setGlobalStats({...globalStats, luasDesaHa: parseFloat(e.target.value)})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                ) : (
                  <div style={{ padding: '10px 0', fontSize: '1rem', color: '#0f172a' }}>{globalStats.luasDesaHa || 0}</div>
                )}
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Kepadatan (Jiwa/km²)</label>
                {isEditMode ? (
                  <input type="number" step="0.01" value={globalStats.kepadatan || ''} onChange={e => setGlobalStats({...globalStats, kepadatan: parseFloat(e.target.value)})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                ) : (
                  <div style={{ padding: '10px 0', fontSize: '1rem', color: '#0f172a' }}>{globalStats.kepadatan || 0}</div>
                )}
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', marginTop: '20px', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Status Perkawinan Kepala Keluarga</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Kawin</label>
                {isEditMode ? <input type="number" value={globalStats.kawin || 0} onChange={e => setGlobalStats({...globalStats, kawin: parseInt(e.target.value)})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px 0', fontWeight: 600 }}>{globalStats.kawin || 0}</div>}
              </div>
              <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Cerai Mati</label>
                {isEditMode ? <input type="number" value={globalStats.ceraiMati || 0} onChange={e => setGlobalStats({...globalStats, ceraiMati: parseInt(e.target.value)})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px 0', fontWeight: 600 }}>{globalStats.ceraiMati || 0}</div>}
              </div>
              <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Cerai Hidup</label>
                {isEditMode ? <input type="number" value={globalStats.ceraiHidup || 0} onChange={e => setGlobalStats({...globalStats, ceraiHidup: parseInt(e.target.value)})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px 0', fontWeight: 600 }}>{globalStats.ceraiHidup || 0}</div>}
              </div>
              <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Belum Kawin</label>
                {isEditMode ? <input type="number" value={globalStats.belumKawin || 0} onChange={e => setGlobalStats({...globalStats, belumKawin: parseInt(e.target.value)})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px 0', fontWeight: 600 }}>{globalStats.belumKawin || 0}</div>}
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', marginTop: '20px', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Data JSON Tingkat Lanjut (Etnis, Agama, Bahasa, Piramida)</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Piramida Usia</label>
                {isEditMode ? <textarea rows={3} value={globalStats.piramidaUsia ? JSON.stringify(globalStats.piramidaUsia) : ''} onChange={e => { try { setGlobalStats({...globalStats, piramidaUsia: JSON.parse(e.target.value)}) } catch(err){} }} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.8rem' }} placeholder='[{"usia":"0-4","lakiLaki":10,"perempuan":12}]' /> : <div style={{ padding: '8px 0', fontSize: '0.8rem', fontFamily: 'monospace', background: '#f8fafc', overflowX: 'auto', maxHeight: '100px' }}>{JSON.stringify(globalStats.piramidaUsia || [])}</div>}
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Data Etnis</label>
                {isEditMode ? <textarea rows={3} value={globalStats.dataEtnis ? JSON.stringify(globalStats.dataEtnis) : ''} onChange={e => { try { setGlobalStats({...globalStats, dataEtnis: JSON.parse(e.target.value)}) } catch(err){} }} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.8rem' }} placeholder='[{"nama":"Mandar","jumlah":693}]' /> : <div style={{ padding: '8px 0', fontSize: '0.8rem', fontFamily: 'monospace', background: '#f8fafc', overflowX: 'auto', maxHeight: '100px' }}>{JSON.stringify(globalStats.dataEtnis || [])}</div>}
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Data Agama</label>
                {isEditMode ? <textarea rows={3} value={globalStats.dataAgama ? JSON.stringify(globalStats.dataAgama) : ''} onChange={e => { try { setGlobalStats({...globalStats, dataAgama: JSON.parse(e.target.value)}) } catch(err){} }} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.8rem' }} placeholder='[{"nama":"Islam","jumlah":848}]' /> : <div style={{ padding: '8px 0', fontSize: '0.8rem', fontFamily: 'monospace', background: '#f8fafc', overflowX: 'auto', maxHeight: '100px' }}>{JSON.stringify(globalStats.dataAgama || [])}</div>}
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Data Bahasa</label>
                {isEditMode ? <textarea rows={3} value={globalStats.dataBahasa ? JSON.stringify(globalStats.dataBahasa) : ''} onChange={e => { try { setGlobalStats({...globalStats, dataBahasa: JSON.parse(e.target.value)}) } catch(err){} }} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.8rem' }} placeholder='[{"nama":"Mandar","jumlah":627}]' /> : <div style={{ padding: '8px 0', fontSize: '0.8rem', fontFamily: 'monospace', background: '#f8fafc', overflowX: 'auto', maxHeight: '100px' }}>{JSON.stringify(globalStats.dataBahasa || [])}</div>}
              </div>
            </div>
          </div>

          {/* ── 2. DUSUN MASSIVE GRID ── */}
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} className="text-blue-500" /> Data Kependudukan & Pendidikan per Dusun
              </h2>
              <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                <AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Total Jiwa akan dihitung otomatis dari (Laki-laki + Perempuan).
              </p>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1200px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th rowSpan={2} style={{ padding: '12px 16px', color: '#0f172a' }}>Nama Dusun</th>
                    <th colSpan={3} style={{ padding: '12px', textAlign: 'center', background: '#eff6ff', color: '#1d4ed8' }}>Populasi Dasar</th>
                    <th colSpan={7} style={{ padding: '12px', textAlign: 'center', background: '#f0fdf4', color: '#15803d' }}>Pendidikan Terakhir</th>
                    <th colSpan={2} style={{ padding: '12px', textAlign: 'center', background: '#fef3c7', color: '#b45309' }}>Kepemilikan KTP</th>
                    <th colSpan={2} style={{ padding: '12px', textAlign: 'center', background: '#f3e8ff', color: '#7e22ce' }}>Lama Tinggal</th>
                    <th colSpan={3} style={{ padding: '12px', textAlign: 'center', background: '#ffedd5', color: '#c2410c' }}>Penggunaan Lahan (%)</th>
                  </tr>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                    {/* Populasi */}
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>Laki-laki</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>Perempuan</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569', borderRight: '1px solid #e2e8f0' }}>Total KK</th>
                    {/* Pendidikan */}
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>Tdk Ijazah</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>SD</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>SMP</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>SMA</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>Diploma</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>S1</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569', borderRight: '1px solid #e2e8f0' }}>S2</th>
                    {/* KTP */}
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>Punya</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569', borderRight: '1px solid #e2e8f0' }}>Belum</th>
                    {/* Lama Tinggal */}
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>&lt;10 Thn</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569', borderRight: '1px solid #e2e8f0' }}>&ge;10 Thn</th>
                    {/* Lahan */}
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>Kebun</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>Mukim</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#475569' }}>Lainnya</th>
                  </tr>
                </thead>
                <tbody>
                  {dusunGrid.map((d, idx) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a', position: 'sticky', left: 0, background: '#fff', zIndex: 10, borderRight: '1px solid #e2e8f0' }}>
                        {d.nama}
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>Total Jiwa: {d.lakiLaki + d.perempuan}</div>
                      </td>
                      
                      {/* Penduduk */}
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.lakiLaki} onChange={e => handleGridChange(idx, 'lakiLaki', e.target.value)} style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.lakiLaki}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.perempuan} onChange={e => handleGridChange(idx, 'perempuan', e.target.value)} style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.perempuan}</div>}
                      </td>
                      <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0' }}>
                        {isEditMode ? <input type="number" value={d.totalKk} onChange={e => handleGridChange(idx, 'totalKk', e.target.value)} style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.totalKk}</div>}
                      </td>

                      {/* Pendidikan */}
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.tanpaIjazah} onChange={e => handleGridChange(idx, 'tanpaIjazah', e.target.value)} style={{ width: '70px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.tanpaIjazah}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.sd} onChange={e => handleGridChange(idx, 'sd', e.target.value)} style={{ width: '70px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.sd}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.smp} onChange={e => handleGridChange(idx, 'smp', e.target.value)} style={{ width: '70px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.smp}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.sma} onChange={e => handleGridChange(idx, 'sma', e.target.value)} style={{ width: '70px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.sma}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.diploma} onChange={e => handleGridChange(idx, 'diploma', e.target.value)} style={{ width: '70px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.diploma}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.s1} onChange={e => handleGridChange(idx, 's1', e.target.value)} style={{ width: '70px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.s1}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.s2} onChange={e => handleGridChange(idx, 's2', e.target.value)} style={{ width: '50px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.s2}</div>}
                      </td>

                      {/* KTP */}
                      <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>
                        {isEditMode ? <input type="number" value={d.ktpPunya} onChange={e => handleGridChange(idx, 'ktpPunya', e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.ktpPunya}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.ktpBelum} onChange={e => handleGridChange(idx, 'ktpBelum', e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.ktpBelum}</div>}
                      </td>

                      {/* Lama Tinggal */}
                      <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>
                        {isEditMode ? <input type="number" value={d.tinggalDiBawah10} onChange={e => handleGridChange(idx, 'tinggalDiBawah10', e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.tinggalDiBawah10}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" value={d.tinggalDiAtas10} onChange={e => handleGridChange(idx, 'tinggalDiAtas10', e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.tinggalDiAtas10}</div>}
                      </td>

                      {/* Lahan */}
                      <td style={{ padding: '8px', borderLeft: '1px solid #e2e8f0' }}>
                        {isEditMode ? <input type="number" step="0.1" value={d.lahanPerkebunan} onChange={e => handleGridChange(idx, 'lahanPerkebunan', e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.lahanPerkebunan}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" step="0.1" value={d.lahanPemukiman} onChange={e => handleGridChange(idx, 'lahanPemukiman', e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.lahanPemukiman}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {isEditMode ? <input type="number" step="0.1" value={d.lahanLainnya} onChange={e => handleGridChange(idx, 'lahanLainnya', e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} /> : <div style={{ padding: '8px', textAlign: 'center' }}>{d.lahanLainnya}</div>}
                      </td>
                    </tr>
                  ))}
                  {dusunGrid.length === 0 && (
                    <tr>
                      <td colSpan={11} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                        Belum ada data dusun. Silakan tambah Dusun terlebih dahulu di database (atau Anda bisa mengelola dusun di halaman lain jika ini khusus input grid).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── BOTTOM FLOATING ACTION BAR ── */}
      {selectedTahun !== 'all' && (
        <div style={{ position: 'fixed', bottom: 0, left: '280px', right: 0, background: '#fff', borderTop: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)', zIndex: 100 }}>
        <div>
          <strong style={{ color: '#0f172a' }}>Total Rekapitulasi (Otomatis):</strong>
          <span style={{ marginLeft: '12px', color: '#64748b' }}>Jiwa: {globalStats.totalPenduduk}</span>
          <span style={{ marginLeft: '12px', color: '#64748b' }}>Laki: {globalStats.lakiLaki}</span>
          <span style={{ marginLeft: '12px', color: '#64748b' }}>Prp: {globalStats.perempuan}</span>
          <span style={{ marginLeft: '12px', color: '#64748b' }}>KK: {globalStats.totalKk}</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isEditMode ? (
            <button onClick={() => setIsEditMode(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
              Edit Data {selectedTahun}
            </button>
          ) : (
            <>
              <button onClick={handleCancelEdit} disabled={isSaving || isFetching} style={{ padding: '14px 24px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
                Batal
              </button>
              <button onClick={handleSaveBulk} disabled={isSaving || isFetching} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', opacity: (isSaving || isFetching) ? 0.7 : 1 }}>
                <Save size={20} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </>
          )}
        </div>
        </div>
      )}

    </div>
  );
}
