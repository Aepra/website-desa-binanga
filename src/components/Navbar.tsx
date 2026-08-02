'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronDown,
  CircleUser,
  Menu,
  X,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import styles from './Navbar.module.css';
import { getCurrentUserSession, logoutUserAction } from '@/server/actions/user-dashboard.action';

const menuItems = [
  {
    title: 'Home',
    href: '/home',
  },
  {
    title: 'Profil Desa',
    href: '/profil-desa',
  },
  {
    title: 'Wisata & Potensi Desa',
    items: [
      { title: 'Ikhtisar', href: '/wisata#bento' },
      { title: 'Destinasi Wisata', href: '/wisata#destinasi' },
      { title: 'Potensi Agrowisata', href: '/wisata#potensi' },
      { title: 'Peta ArcGIS', href: '/wisata#peta' },
    ],
  },
  {
    title: 'UMKM',
    href: '/umkm',
  },
  {
    title: 'Berita & Agenda',
    href: '/berita-agenda',
  },
  {
    title: 'Data & Statistik',
    items: [
      { title: 'Data Kependudukan', href: '/data-statistik#kependudukan' },
      { title: 'Transparansi APBDes', href: '/data-statistik#apbdes' },
    ],
  },
  {
    title: 'Layanan',
    href: '/layanan',
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    getCurrentUserSession().then(s => setSession(s));
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await logoutUserAction();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        {/* Logo Placeholder */}

        <Link href="/home" className={styles.logo} title="Home">
          <img src="/pic/logo-desa.jpeg" alt="Logo Desa Binanga" className={styles.logoImage} />
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Desa Binanga</span>
            <span className={styles.logoSubtitle}>Kecamatan Sendana, Kabupaten Majene</span>
          </div>
        </Link>

        {/* Desktop Menu */}

        <nav className={styles.desktopMenu}>
          {menuItems.map((menu) => (
            <div key={menu.title} className={styles.menuItem}>

              {menu.href ? (
                <Link href={menu.href} className={styles.menuLink}>
                  {menu.title}
                </Link>
              ) : (
                <>
                  <button className={styles.menuButton}>
                    {menu.title}
                    <ChevronDown size={16} />
                  </button>

                  <div className={styles.dropdown}>
                    {menu.items?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.dropdownItem}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Right Side */}

        <div className={styles.rightSection}>

          <div className={styles.desktopProfileWrapper}>
            {session ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '4px 10px 4px 6px',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Akun Saya"
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.8rem', boxShadow: '0 2px 6px rgba(37,99,235,0.25)'
                  }}>
                    {session.name ? session.name[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.name}
                  </span>
                  <ChevronDown size={14} color="#64748b" />
                </button>

                {/* Profile Dropdown Popup */}
                {profileOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '210px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
                      zIndex: 1000,
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ padding: '4px 6px 8px 6px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{session.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', wordBreak: 'break-all' }}>{session.username}</div>
                    </div>

                    <Link
                      href={session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/user-dashboard'}
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px', borderRadius: '6px',
                        textDecoration: 'none', color: '#1e293b', fontWeight: 700,
                        fontSize: '0.8rem', background: '#eff6ff'
                      }}
                    >
                      <LayoutDashboard size={15} color="#2563eb" />
                      <span>{session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' ? 'Dashboard Admin' : 'Dashboard Warga'}</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px', borderRadius: '6px',
                        border: '1px solid #fecaca', background: '#fef2f2',
                        color: '#dc2626', fontWeight: 700, fontSize: '0.8rem',
                        cursor: 'pointer', width: '100%', textAlign: 'left'
                      }}
                    >
                      <LogOut size={15} />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={styles.adminButton} title="Login">
                <CircleUser size={22} />
              </Link>
            )}
          </div>

          <button
            className={styles.mobileButton}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X color="#0f172a" /> : <Menu color="#ffffff" />}
          </button>

        </div>

      </div>

      {/* Mobile */}

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {menuItems.map((menu) => (
            <div key={menu.title} className={styles.mobileItem}>

              {menu.href ? (
                <Link href={menu.href} onClick={() => setMobileOpen(false)} className={styles.mobileMainLink}>
                  {menu.title}
                </Link>
              ) : (
                <>
                  <div className={styles.mobileTitle}>
                    {menu.title}
                  </div>

                  <div className={styles.mobileDropdown}>
                    {menu.items?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={styles.mobileSubLink}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </>
              )}

            </div>
          ))}

          <hr className={styles.mobileDivider} />

          {session ? (
            <>
              <Link
                href={session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/user-dashboard'}
                onClick={() => setMobileOpen(false)}
                className={styles.mobileMainLink}
                style={{ color: '#2563eb', fontWeight: 700 }}
              >
                Dashboard {session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' ? 'Admin' : 'Warga'} ({session.name})
              </Link>
              <button
                onClick={handleLogout}
                className={styles.mobileMainLink}
                style={{ color: '#dc2626', background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', fontWeight: 700 }}
              >
                Keluar ({session.name})
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className={styles.mobileMainLink}>
              Login / Masuk Warga
            </Link>
          )}

        </div>
      )}
    </header>
  );
}