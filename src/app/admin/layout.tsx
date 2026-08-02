'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Users,
  Map,
  Settings,
  LogOut,
  Database,
  TreePine,
  Store,
  Newspaper,
  PieChart,
  Building2,
  ShieldCheck,
  FileText,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { logoutUserAction } from '@/server/actions/user-dashboard.action';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuGroups = [
    {
      group: 'Utama',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={16} /> },
      ]
    },
    {
      group: 'Layanan & Aduan Warga',
      items: [
        { name: 'Layanan & Permohonan', path: '/admin/layanan', icon: <FileText size={16} /> },
        { name: 'UMKM Desa', path: '/admin/umkm', icon: <Store size={16} /> },
      ]
    },
    {
      group: 'Data & Informasi Desa',
      items: [
        { name: 'Data Penduduk', path: '/admin/penduduk', icon: <Users size={16} /> },
        { name: 'Data Statistik', path: '/admin/statistik', icon: <Database size={16} /> },
        { name: 'Transparansi APBDes', path: '/admin/apbdes', icon: <PieChart size={16} /> },
        { name: 'Berita & Agenda', path: '/admin/berita', icon: <Newspaper size={16} /> },
        { name: 'Wisata & Potensi Desa', path: '/admin/wisata', icon: <TreePine size={16} /> },
      ]
    },
    {
      group: 'Pengaturan & Profil',
      items: [
        { name: 'Pengaturan Global', path: '/admin/pengaturan', icon: <Settings size={16} /> },
        { name: 'Kelola Admin', path: '/admin/kelola-admin', icon: <ShieldCheck size={16} /> },
        { name: 'Struktur Organisasi', path: '/admin/struktur', icon: <Users size={16} /> },
        { name: 'Infrastruktur & Fasilitas', path: '/admin/infrastruktur', icon: <Building2 size={16} /> },
      ]
    }
  ];

  async function handleLogout() {
    await logoutUserAction();
    router.push('/login');
  }

  return (
    <div className="admin-wrapper">
      <style>{`
        html, body {
          overflow-x: hidden !important;
          max-width: 100vw !important;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        *, *:before, *:after {
          box-sizing: inherit;
        }

        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          max-width: 100vw;
          overflow-x: hidden;
          background: #f8fafc;
          color: #0f172a;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ── DESKTOP SIDEBAR ── */
        .admin-sidebar {
          width: 220px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          color: #0f172a;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          box-shadow: 2px 0 12px rgba(15, 23, 42, 0.03);
          z-index: 40;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .admin-menu-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.15s ease;
          color: #475569;
          background: transparent;
        }

        .admin-menu-link:hover {
          color: #2563eb;
          background: #eff6ff;
        }

        .admin-menu-link.active {
          color: #2563eb;
          background: #eff6ff;
          font-weight: 700;
          border-left: 3px solid #2563eb;
          border-radius: 0 8px 8px 0;
        }

        /* ── TOPBAR MOBILE ── */
        .admin-mobile-header {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #ffffff;
          color: #0f172a;
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        }

        /* ── MAIN CONTENT AREA ── */
        .admin-main-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          max-width: 100%;
          overflow-x: hidden;
          background: #f8fafc;
        }

        .admin-content {
          width: 100%;
          max-width: 1250px;
          margin: 0 auto;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* FLEX CONTAINERS RESPONSIVE WRAPPING */
        .admin-content div[style*="display: flex"],
        .admin-content div[style*="display:flex"] {
          flex-wrap: wrap !important;
          max-width: 100% !important;
        }

        /* ── 3-TIER RESPONSIVE SCALING SYSTEM (PC: 6, TABLET: 4, HP MOBILE: 1) ── */

        /* 1. PC / DESKTOP (> 1024px) -> SCALE 6 (Full Size & Spacious) */
        @media (min-width: 1025px) {
          .admin-content {
            padding: 24px 28px !important;
          }
          .admin-content table th, .admin-content table td {
            padding: 10px 14px !important;
            font-size: 0.85rem !important;
          }
        }

        /* 2. TABLET (769px - 1024px) -> SCALE 4 (Medium Compact) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .admin-content {
            padding: 14px 18px !important;
          }
          .admin-content h1 { font-size: 1.12rem !important; }
          .admin-content h2 { font-size: 0.98rem !important; }
          .admin-content table th, .admin-content table td {
            padding: 7px 10px !important;
            font-size: 0.78rem !important;
          }
          .admin-content button, .admin-content input, .admin-content select {
            padding: 6px 10px !important;
            font-size: 0.78rem !important;
          }
        }

        /* 3. HP MOBILE (< 768px) -> SCALE 1 (Super Mini Text & Padding, No Sticky Column Overlaps) */
        @media (max-width: 768px) {
          .admin-wrapper {
            flex-direction: column;
          }

          .admin-sidebar {
            display: none;
          }

          .admin-mobile-header {
            display: flex;
          }

          .admin-content {
            padding: 4px 6px !important;
          }

          .admin-content h1 {
            font-size: 0.95rem !important;
            margin-bottom: 4px !important;
          }

          .admin-content h2 {
            font-size: 0.85rem !important;
            margin-bottom: 4px !important;
          }

          .admin-content h3 {
            font-size: 0.78rem !important;
          }

          .admin-content p, .admin-content span, .admin-content label {
            font-size: 0.7rem !important;
          }

          /* Table auto-scroll wrapper on HP Mobile */
          .admin-content div[style*="overflowX"],
          .admin-content div[style*="overflow-x"],
          .table-responsive {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 6px !important;
            margin-bottom: 6px !important;
          }

          /* Disable all sticky positioning inside tables on HP mobile to prevent overlaps */
          .admin-content table th,
          .admin-content table td,
          .admin-content table th[class*="sticky"],
          .admin-content table td[class*="sticky"] {
            position: static !important;
            right: auto !important;
            left: auto !important;
          }

          /* Scale 1 Micro Table Cell Styling */
          .admin-content table {
            width: 100% !important;
            font-size: 0.65rem !important;
          }

          .admin-content table th {
            padding: 3px 5px !important;
            font-size: 0.6rem !important;
            text-transform: uppercase !important;
            white-space: nowrap !important;
            background: #f1f5f9 !important;
            border-bottom: 1px solid #cbd5e1 !important;
          }

          .admin-content table td {
            padding: 3px 5px !important;
            font-size: 0.65rem !important;
            white-space: nowrap !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }

          /* Super compact mini action buttons inside tables */
          .admin-content table button,
          .admin-content table a,
          .admin-content table button[class*="btnIcon"] {
            padding: 2px 4px !important;
            font-size: 0.62rem !important;
            border-radius: 4px !important;
            min-width: 20px !important;
            height: 20px !important;
          }

          .admin-content table svg {
            width: 11px !important;
            height: 11px !important;
          }

          /* Compact form fields on HP Mobile */
          .admin-content input,
          .admin-content select,
          .admin-content textarea {
            padding: 4px 6px !important;
            font-size: 0.72rem !important;
            border-radius: 6px !important;
          }

          .admin-content button:not(table button) {
            padding: 4px 8px !important;
            font-size: 0.72rem !important;
            border-radius: 6px !important;
          }
        }
      `}</style>

      {/* ── TOPBAR MOBILE DENGAN TOMBOL GARIS 3 (HAMBURGER DROPDOWN KECIL & SIMPEL) ── */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#2563eb', padding: '5px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Map size={15} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Admin Desa Binanga</h2>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: mobileMenuOpen ? '#2563eb' : '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: mobileMenuOpen ? '#ffffff' : '#0f172a',
            padding: '5px 10px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 700,
            transition: 'all 0.15s ease'
          }}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
          <span>Menu</span>
        </button>

        {/* ── DROPDOWN POPUP KECIL & ELEGAN (TIDAK MENUTUPI LAYAR FULL) ── */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: '12px',
              width: '250px',
              maxHeight: '75vh',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
              zIndex: 100,
              padding: '10px',
              overflowY: 'auto',
              marginTop: '4px'
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {menuGroups.map((group, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', paddingLeft: '6px' }}>
                    {group.group}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {group.items.map(item => {
                      const isActive = pathname === item.path || (item.path === '/admin/dashboard' && pathname === '/admin');
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '0.78rem',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? '#2563eb' : '#334155',
                            background: isActive ? '#eff6ff' : 'transparent'
                          }}
                        >
                          <span style={{ color: isActive ? '#2563eb' : '#64748b' }}>{item.icon}</span>
                          <span style={{ flex: 1 }}>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div style={{ paddingTop: '8px', marginTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '6px',
                  width: '100%', borderRadius: '6px', color: '#dc2626', background: '#fef2f2',
                  border: '1px solid #fecaca', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                }}
              >
                <LogOut size={14} /> Keluar Admin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div style={{ padding: '16px 14px 12px 14px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <div style={{ background: '#2563eb', padding: '5px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Map size={15} color="#ffffff" />
            </div>
            <span>Admin Desa</span>
          </h2>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {menuGroups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', paddingLeft: '8px' }}>
                {group.group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {group.items.map(item => {
                  const isActive = pathname === item.path || (item.path === '/admin/dashboard' && pathname === '/admin');
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`admin-menu-link ${isActive ? 'active' : ''}`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 8px',
              width: '100%', borderRadius: '6px', color: '#dc2626', background: '#fef2f2',
              border: '1px solid #fecaca', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left'
            }}
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="admin-main-container">
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
