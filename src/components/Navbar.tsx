'use client';

import { useState } from 'react';
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
    items: [
      { title: 'Sejarah', href: '/profil-desa#sejarah' },
      { title: 'Visi & Misi', href: '/profil-desa#visi-misi' },
      { title: 'Wilayah & Geografis', href: '/profil-desa#wilayah-geografis' },
      { title: 'Perangkat Desa', href: '/profil-desa#perangkat-desa' },
      { title: 'Prestasi & Penghargaan', href: '/profil-desa#prestasi-penghargaan' },
    ],
  },
  {
    title: 'Data & Statistik',
    items: [
      { title: 'Demografi Penduduk', href: '/data-statistik#demografi-penduduk' },
      { title: 'Pendidikan & Pekerjaan', href: '/data-statistik#pendidikan-pekerjaan' },
      { title: 'Transparansi APBDes', href: '/data-statistik#transparansi-apbdes' },
    ],
  },
  {
    title: 'Berita & Agenda',
    items: [
      { title: 'Berita Desa', href: '/berita-agenda#berita-desa' },
      { title: 'Pengumuman', href: '/berita-agenda#pengumuman' },
      { title: 'Agenda Kegiatan', href: '/berita-agenda#agenda-kegiatan' },
      { title: 'Cek Bansos', href: '/berita-agenda#cek-bansos' },
    ],
  },
  {
    title: 'UMKM & Potensi',
    items: [
      { title: 'Katalog Produk', href: '/umkm-potensi#katalog-produk' },
      { title: 'Profil Usaha', href: '/umkm-potensi#profil-usaha' },
    ],
  },
  {
    title: 'Wisata',
    items: [
      { title: 'Destinasi', href: '/wisata#destinasi' },
      { title: 'Galeri Virtual Tour', href: '/wisata#galeri-virtual-tour' },
      { title: 'Peta Wisata', href: '/wisata#peta-wisata' },
    ],
  },
  {
    title: 'Kontak',
    items: [
      { title: 'FAQ', href: '/kontak#faq' },
      { title: 'Form Kontak', href: '/kontak#form-kontak' },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>

        {/* Logo Placeholder */}

        <Link href="/home" className={styles.logo} title="Home">
          <div className={styles.logoPlaceholder}></div>
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
            {mobileOpen ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {/* Mobile */}

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {menuItems.map((menu) => (
            <div key={menu.title} className={styles.mobileItem}>

              {menu.href ? (
                <Link href={menu.href}>
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
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </>
              )}

            </div>
          ))}

          <hr />

          <Link href="/admin/login">
            Login Admin
          </Link>

        </div>
      )}
    </header>
  );
}