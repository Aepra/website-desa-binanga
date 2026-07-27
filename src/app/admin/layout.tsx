'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Users, Map, Settings, LogOut, Database, TreePine, Store, Newspaper, PieChart } from 'lucide-react';

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
      group: 'Profil Desa',
      items: [
        { name: 'Pengaturan Global', path: '/admin/pengaturan', icon: <Settings size={20} /> },
        { name: 'Struktur Organisasi', path: '/admin/struktur', icon: <Users size={20} /> },
      ]
    },
    {
      group: 'Layanan & Bantuan',
      items: [
        { name: 'Data Bansos', path: '/admin/bansos', icon: <Database size={20} /> },
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
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          border-radius: 10px; text-decoration: none; font-size: 0.95rem; font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); color: #94a3b8; background: transparent;
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
          width: 280px; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          color: #fff; display: flex; flex-direction: column;
          box-shadow: 4px 0 24px rgba(0,0,0,0.05); z-index: 10;
        }
        .admin-main {
          flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;
        }
      `}</style>

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ padding: '32px 24px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#3b82f6', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
              <Map size={24} style={{ color: '#fff' }} />
            </div>
            Admin Panel
          </h2>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {menuGroups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', paddingLeft: '16px' }}>
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

        <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            width: '100%', borderRadius: '10px', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)',
            border: 'none', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top bar subtle gradient */}
        <div style={{ height: '240px', background: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0, pointerEvents: 'none' }}></div>
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
