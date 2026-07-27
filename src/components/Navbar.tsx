'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronDown,
  CircleUser,
  Menu,
  X,
} from 'lucide-react';
import styles from './Navbar.module.css';

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
    title: 'Data & Statistik',
    items: [
      { title: 'Data Kependudukan', href: '/data-statistik#kependudukan' },
      { title: 'Transparansi APBDes', href: '/data-statistik#apbdes' },
    ],
  },
  {
    title: 'Berita & Agenda',
    href: '/berita-agenda',
  },
  {
    title: 'UMKM',
    href: '/umkm',
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
    title: 'Kontak',
    href: '/kontak',
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname.startsWith('/admin')) {
    return null;
  }

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

          <div className={styles.adminWrapper}>
            <button className={styles.adminButton}>
              <CircleUser size={22} />
            </button>

            <div className={styles.adminDropdown}>
              <Link href="/admin/login">Login Admin</Link>
              <Link href="/admin">Dashboard</Link>
            </div>
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

          <Link href="/admin/login" onClick={() => setMobileOpen(false)} className={styles.mobileMainLink}>
            Login Admin
          </Link>

        </div>
      )}
    </header>
  );
}