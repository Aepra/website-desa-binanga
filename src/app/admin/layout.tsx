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
  X
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
        { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={18} /> },
      ]
    },
    {
      group: 'Layanan & Aduan Warga',
      items: [
        { name: 'Layanan & Permohonan', path: '/admin/layanan', icon: <FileText size={18} /> },
        { name: 'UMKM Desa', path: '/admin/umkm', icon: <Store size={18} /> },
      ]
    },
    {
      group: 'Data & Informasi Desa',
      items: [
        { name: 'Data Penduduk', path: '/admin/penduduk', icon: <Users size={18} /> },
        { name: 'Data Statistik', path: '/admin/statistik', icon: <Database size={18} /> },
        { name: 'Transparansi APBDes', path: '/admin/apbdes', icon: <PieChart size={18} /> },
        { name: 'Berita & Agenda', path: '/admin/berita', icon: <Newspaper size={18} /> },
        { name: 'Wisata & Potensi Desa', path: '/admin/wisata', icon: <TreePine size={18} /> },
      ]
    },
    {
      group: 'Pengaturan & Profil',
      items: [
        { name: 'Pengaturan Global', path: '/admin/pengaturan', icon: <Settings size={18} /> },
        { name: 'Kelola Admin', path: '/admin/kelola-admin', icon: <ShieldCheck size={18} /> },
        { name: 'Struktur Organisasi', path: '/admin/struktur', icon: <Users size={18} /> },
        { name: 'Infrastruktur & Fasilitas', path: '/admin/infrastruktur', icon: <Building2 size={18} /> },
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
        *, *:before, *:after {
          box-sizing: border-box;
        }

        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #f8fafc;
          color: #0f172a;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ── DESKTOP SIDEBAR ── */
        .admin-sidebar {
          width: 240px;
          background: #0F5C2E;
          border-right: 1px solid #0B4824;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          box-shadow: 2px 0 12px rgba(15, 23, 42, 0.05);
          z-index: 40;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .admin-menu-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.15s ease;
          color: rgba(255, 255, 255, 0.85);
          background: transparent;
        }

        .admin-menu-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .admin-menu-link.active {
          color: #ffffff;
          background: #16803C;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        /* ── TOPBAR MOBILE ── */
        .admin-mobile-header {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
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
          background: #f8fafc;
        }

        .admin-content {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 28px;
          box-sizing: border-box;
        }

        /* ── RESPONSIVE SCALING & ADAPTABILITY ── */
        @media (max-width: 1024px) {
          .admin-wrapper {
            flex-direction: column;
            overflow-x: hidden;
          }

          .admin-sidebar {
            display: none;
          }

          .admin-mobile-header {
            display: flex;
            width: 100%;
          }

          .admin-content {
            padding: 16px 16px;
          }
        }

        @media (max-width: 640px) {
          .admin-content {
            padding: 12px 16px;
          }

          .admin-content h1 {
            font-size: 1.25rem !important;
          }

          .admin-content h2 {
            font-size: 1.05rem !important;
          }
        }
      `}</style>

      {/* ── TOPBAR MOBILE DENGAN HAMBURGER DRAWER + OVERLAY ── */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#16803C', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Map size={18} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Admin Desa Binanga</h2>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: mobileMenuOpen ? '#16803C' : '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: mobileMenuOpen ? '#ffffff' : '#0f172a',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            minHeight: '44px',
            transition: 'all 0.15s ease'
          }}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          <span>Menu</span>
        </button>

        {/* ── MOBILE OFF-CANVAS DRAWER WITH BACKDROP OVERLAY ── */}
        {mobileMenuOpen && (
          <>
            <div
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(3px)',
                zIndex: 998
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                width: '280px',
                maxWidth: '85vw',
                background: '#0F5C2E',
                color: '#ffffff',
                boxShadow: '-10px 0 30px rgba(15, 23, 42, 0.2)',
                zIndex: 999,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.15)', marginBottom: '16px' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>Navigasi Admin</div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} color="#ffffff" />
                </button>
              </div>

              <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {menuGroups.map((group, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', paddingLeft: '6px' }}>
                      {group.group}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              fontSize: '0.85rem',
                              fontWeight: isActive ? 700 : 500,
                              color: '#ffffff',
                              background: isActive ? '#16803C' : 'transparent',
                              minHeight: '44px'
                            }}
                          >
                            <span style={{ color: '#ffffff' }}>{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px',
                    width: '100%', borderRadius: '8px', color: '#ffffff', background: '#D64545',
                    border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', minHeight: '44px'
                  }}
                >
                  <LogOut size={16} /> Keluar Admin
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── DESKTOP PERSISTENT SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div style={{ padding: '20px 16px 14px 16px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
            <div style={{ background: '#16803C', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Map size={18} color="#ffffff" />
            </div>
            <span>Admin Desa</span>
          </h2>
        </div>

        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {menuGroups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', paddingLeft: '8px' }}>
                {group.group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
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

        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px',
              width: '100%', borderRadius: '8px', color: '#ffffff', background: '#D64545',
              border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left'
            }}
          >
            <LogOut size={16} /> Keluar
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
