'use client';

import React from 'react';
import Link from 'next/link';
import { Database, Calendar, Users, Home, BookOpen } from 'lucide-react';
import styles from '../Admin.module.css';

type StatistikClientProps = {
  initialTahun: number;
  initialGlobal: any;
  initialDusun: any[];
  initialHistory?: any[];
};

export default function StatistikClient({ initialTahun, initialGlobal, initialDusun }: StatistikClientProps) {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Dashboard Statistik Desa</h1>
        <p style={{ margin: 0, color: '#64748b' }}>Menampilkan data riil dari database Penduduk ({initialTahun})</p>
      </div>

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <Database size={24} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e3a8a', fontSize: '1.1rem' }}>Statistik Sepenuhnya Otomatis</h3>
          <p style={{ margin: 0, color: '#3b82f6', lineHeight: 1.5 }}>
            Sistem sekarang menggunakan data riil yang dikalkulasi otomatis dari <strong>Data Penduduk</strong>. 
            Anda tidak perlu lagi menginput data statistik secara manual. 
            Untuk menambah atau mengurangi jumlah warga, silakan kelola melalui menu Data Penduduk.
          </p>
          <Link href="/admin/penduduk" style={{ display: 'inline-block', marginTop: '12px', background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
            Kelola Data Penduduk
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#475569' }}>
            <Users size={24} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: '#0f172a' }}>{initialGlobal?.totalPenduduk || 0}</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Total Jiwa</p>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#475569' }}>
            <Home size={24} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: '#0f172a' }}>{initialGlobal?.totalKk || 0}</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Kepala Keluarga</p>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#2563eb' }}>
            <Users size={24} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: '#0f172a' }}>{initialGlobal?.lakiLaki || 0}</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Laki-laki</p>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: '#fdf4ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#c026d3' }}>
            <Users size={24} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: '#0f172a' }}>{initialGlobal?.perempuan || 0}</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Perempuan</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={20} color="#0f172a" />
          <h3 style={{ margin: 0, color: '#0f172a' }}>Rekap Demografi Dusun</h3>
        </div>
        <div style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', background: '#f1f5f9', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Nama Dusun</th>
                <th style={{ padding: '12px', background: '#f1f5f9', color: '#475569', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Laki-Laki</th>
                <th style={{ padding: '12px', background: '#f1f5f9', color: '#475569', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Perempuan</th>
                <th style={{ padding: '12px', background: '#f1f5f9', color: '#475569', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Total Jiwa</th>
                <th style={{ padding: '12px', background: '#f1f5f9', color: '#475569', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Total KK</th>
              </tr>
            </thead>
            <tbody>
              {initialDusun?.length > 0 ? (
                initialDusun.map((d: any) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 500, color: '#0f172a' }}>{d.nama}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{d.computed?.lakiLaki || 0}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{d.computed?.perempuan || 0}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{d.computed?.totalJiwa || 0}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{d.computed?.totalKk || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Belum ada data dusun/penduduk</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
