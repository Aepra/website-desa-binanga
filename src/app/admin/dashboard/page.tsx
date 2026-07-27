import { prisma } from '@/lib/prisma';
import { Users, TreePine, Database, Store, Building2, TrendingUp, ShieldCheck } from 'lucide-react';

export default async function AdminDashboard() {
  // Fetch dynamic data
  const globalStat = await prisma.statistikGlobal.findFirst({ orderBy: { tahun: 'desc' } });
  const totalPenduduk = globalStat?.totalPenduduk || 0;
  
  const totalWisata = await prisma.wisata.count();
  const totalUmkm = await prisma.umkm.count();
  const totalInfrastruktur = await prisma.infrastruktur.count();

  return (
    <div>
      <style>{`
        .widget-card {
          background: #fff; padding: 28px; border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative; overflow: hidden;
        }
        .widget-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
        }
        .widget-icon-bg {
          position: absolute; right: -20px; top: -20px;
          opacity: 0.04; transform: rotate(-15deg);
        }
      `}</style>

      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>Dashboard Admin</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#10b981" /> Selamat datang di Panel Kendali Website Desa Binanga.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Widget: Penduduk */}
        <div className="widget-card">
          <div className="widget-icon-bg"><Users size={160} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '12px', borderRadius: '14px', color: '#3b82f6' }}>
              <Users size={28} />
            </div>
            <h3 style={{ color: '#64748b', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontWeight: 700 }}>Penduduk</h3>
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
            {totalPenduduk.toLocaleString('id-ID')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#10b981', fontWeight: 600, marginTop: '16px' }}>
            <TrendingUp size={16} /> Data Statistik Terbaru
          </div>
        </div>

        {/* Widget: Wisata */}
        <div className="widget-card">
          <div className="widget-icon-bg"><TreePine size={160} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', padding: '12px', borderRadius: '14px', color: '#10b981' }}>
              <TreePine size={28} />
            </div>
            <h3 style={{ color: '#64748b', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontWeight: 700 }}>Destinasi Wisata</h3>
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
            {totalWisata}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '16px' }}>
            Lokasi wisata terdaftar
          </div>
        </div>

        {/* Widget: UMKM */}
        <div className="widget-card">
          <div className="widget-icon-bg"><Store size={160} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', padding: '12px', borderRadius: '14px', color: '#f59e0b' }}>
              <Store size={28} />
            </div>
            <h3 style={{ color: '#64748b', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontWeight: 700 }}>UMKM Aktif</h3>
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
            {totalUmkm}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '16px' }}>
            Unit usaha masyarakat
          </div>
        </div>

        {/* Widget: Infrastruktur */}
        <div className="widget-card">
          <div className="widget-icon-bg"><Building2 size={160} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', padding: '12px', borderRadius: '14px', color: '#8b5cf6' }}>
              <Building2 size={28} />
            </div>
            <h3 style={{ color: '#64748b', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontWeight: 700 }}>Infrastruktur</h3>
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
            {totalInfrastruktur}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '16px' }}>
            Fasilitas umum desa
          </div>
        </div>

      </div>
    </div>
  );
}
