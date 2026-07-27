'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, Globe, MessageCircle, Play, ChevronRight } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Kolom 1: Tentang Desa */}
          <div className={styles.col}>
            <Link href="/home" className={styles.logo}>
              <img src="/pic/logo-desa.jpeg" alt="Logo Desa Binanga" className={styles.logoImage} />
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>Desa Binanga</span>
                <span className={styles.logoSubtitle}>Kec. Sendana, Kab. Majene</span>
              </div>
            </Link>
            <p className={styles.desc}>
              Portal resmi Pemerintah Desa Binanga. Menghadirkan layanan publik yang cerdas, transparan, dan terhubung langsung dengan masyarakat desa.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Website"><Globe size={18} /></a>
              <a href="#" className={styles.socialLink} aria-label="WhatsApp"><MessageCircle size={18} /></a>
              <a href="#" className={styles.socialLink} aria-label="Media"><Play size={18} /></a>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div className={styles.col}>
            <h3 className={styles.title}>Tautan Cepat</h3>
            <ul className={styles.links}>
              <li><Link href="/home"><ChevronRight size={14} /> Beranda</Link></li>
              <li><Link href="/profil-desa"><ChevronRight size={14} /> Profil Desa</Link></li>
              <li><Link href="/data-statistik"><ChevronRight size={14} /> Data &amp; Statistik</Link></li>
              <li><Link href="/berita-agenda"><ChevronRight size={14} /> Berita &amp; Agenda</Link></li>
              <li><Link href="/umkm"><ChevronRight size={14} /> Potensi UMKM</Link></li>
              <li><Link href="/wisata"><ChevronRight size={14} /> Pariwisata Desa</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Layanan */}
          <div className={styles.col}>
            <h3 className={styles.title}>Hubungi Kami</h3>
            <ul className={styles.contactList}>
              <li>
                <MapPin size={18} className={styles.contactIcon} />
                <span>Kantor Desa Binanga, Kec. Sendana, Kabupaten Majene, Sulawesi Barat 91452</span>
              </li>
              <li>
                <Phone size={18} className={styles.contactIcon} />
                <span>+62 812-3456-7890</span>
              </li>
              <li>
                <Mail size={18} className={styles.contactIcon} />
                <span>pemerintah@binanga.desa.id</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Jam Operasional */}
          <div className={styles.col}>
            <h3 className={styles.title}>Jam Pelayanan</h3>
            <div className={styles.scheduleCard}>
              <Clock size={20} className={styles.scheduleIcon} />
              <div className={styles.scheduleDetails}>
                <div className={styles.scheduleRow}>
                  <span>Senin - Kamis</span>
                  <span>08:00 - 15:00</span>
                </div>
                <div className={styles.scheduleRow}>
                  <span>Jumat</span>
                  <span>08:00 - 11:30</span>
                </div>
                <div className={styles.scheduleRow}>
                  <span>Sabtu - Minggu</span>
                  <span className={styles.closed}>Tutup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Pemerintah Desa Binanga. Seluruh Hak Cipta Dilindungi.
          </div>
          <div className={styles.creator}>
            Dikelola oleh Pemerintah Desa Binanga
          </div>
        </div>
      </div>
    </footer>
  );
}
