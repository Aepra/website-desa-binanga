'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Users, Map, Settings, LogOut, Database, TreePine, Store, Newspaper, PieChart, Building2, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuGroups = [
    {
      group: 'Home',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={20} /> },
      ]
    },
    {
      group: 'Profil & Keamanan',
      items: [
        { name: 'Pengaturan Global', path: '/admin/pengaturan', icon: <Settings size={18} /> },
        { name: 'Kelola Admin', path: '/admin/kelola-admin', icon: <ShieldCheck size={18} /> },
        { name: 'Struktur Organisasi', path: '/admin/struktur', icon: <Users size={18} /> },
        { name: 'Infrastruktur & Fasilitas', path: '/admin/infrastruktur', icon: <Building2 size={18} /> },
      ]
    },

    {
      group: 'Data & Statistik',
      items: [
        { name: 'Data Penduduk', path: '/admin/penduduk', icon: <Users size={20} /> },
        { name: 'Data Statistik', path: '/admin/statistik', icon: <Database size={20} /> },
        { name: 'Transparansi APBDes', path: '/admin/apbdes', icon: <PieChart size={20} /> },
      ]
    },
    {
      group: 'Kabar & Informasi',
      items: [
        { name: 'Berita & Agenda', path: '/admin/berita', icon: <Newspaper size={20} /> },
      ]
    },
    {
      group: 'Ekonomi & Pariwisata',
      items: [
        { name: 'UMKM', path: '/admin/umkm', icon: <Store size={20} /> },
        { name: 'Wisata & Potensi Desa', path: '/admin/wisata', icon: <TreePine size={20} /> },
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', color: '#0f172a', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      <style>{`
        .admin-menu-link {
          display: flex; align-items: center; gap: 10px; padding: 8px 12px;
          border-radius: 8px; text-decoration: none; font-size: 0.85rem; font-weight: 500;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); color: #94a3b8; background: transparent;
        }
        .admin-menu-link:hover {
          color: #fff; background: rgba(255,255,255,0.05); transform: translateX(6px);
        }
        .admin-menu-link.active {
          color: #fff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          font-weight: 600; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }
        .admin-menu-link.active:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
        }
        .admin-sidebar {
          width: 230px; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          color: #fff; display: flex; flex-direction: column;
          box-shadow: 4px 0 24px rgba(0,0,0,0.05); z-index: 10;
        }
        .admin-main {
          flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;
        }
        .admin-main h1 { font-size: 1.3rem !important; margin-bottom: 14px !important; font-weight: 800 !important; }
        .admin-main h2 { font-size: 1.15rem !important; margin-bottom: 10px !important; font-weight: 700 !important; }
        .admin-main h3 { font-size: 0.95rem !important; margin-bottom: 6px !important; font-weight: 600 !important; }
        .admin-main p, .admin-main span, .admin-main td, .admin-main div { font-size: 0.85rem; }
        .admin-main input:not([type="checkbox"]):not([type="radio"]), 
        .admin-main select, 
        .admin-main textarea {
          padding: 7px 10px !important;
          font-size: 0.82rem !important;
          border-radius: 6px !important;
        }
        .admin-main label {
          font-size: 0.8rem !important;
          margin-bottom: 4px !important;
        }
        .admin-main button:not(.iconBtn) {
          padding: 7px 14px !important;
          font-size: 0.82rem !important;
        }
        .admin-main table th,
        .admin-main table td {
          padding: 8px 12px !important;
          font-size: 0.82rem !important;
        }
        .admin-main summary {
          padding: 12px 16px !important;
          font-size: 0.9rem !important;
        }
        .admin-main form {
          gap: 12px !important;
        }
        .admin-main details > div {
          padding: 14px 16px !important;
        }
      `}</style>

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ padding: '20px 16px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#3b82f6', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
              <Map size={18} style={{ color: '#fff' }} />
            </div>
            Admin Panel
          </h2>
        </div>
        
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {menuGroups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', paddingLeft: '12px' }}>
                {group.group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {group.items.map(item => {
                  const isActive = pathname.startsWith(item.path) || (item.path === '/admin/dashboard' && pathname === '/admin');
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className={`admin-menu-link ${isActive ? 'active' : ''}`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
            width: '100%', borderRadius: '8px', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)',
            border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top bar subtle gradient */}
        <div style={{ height: '120px', background: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0, pointerEvents: 'none' }}></div>
        <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
