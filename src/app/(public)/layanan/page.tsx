import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import {
  FileText,
  Send,
  ShieldCheck,
  CreditCard,
  Building2,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Download,
  Lock,
  UserCheck
} from 'lucide-react';
import styles from './layanan.module.css';

export const metadata = {
  title: 'Layanan Publik & E-Surat | Desa Binanga',
  description: 'Portal Pengajuan Surat Keterangan, Pengaduan Warga, dan Layanan Administrasi Desa Binanga secara Online.',
};

import { daftarLayanan } from '@/lib/layanan-config';

export default async function LayananPage() {
  const session = await getSession();
  const targetHref = session ? '/user-dashboard' : '/login?redirect=/user-dashboard';

  return (
    <div className={styles.page}>
      
      {/* ── HERO SECTION ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <span className={styles.heroBadge}>
            <Sparkles size={14} /> Portal Layanan E-Surat Desa Binanga
          </span>
          <h1 className={styles.heroTitle}>
            Pengurusan Surat Desa Jadi <span className={styles.highlight}>Lebih Cepat & Praktis</span>
          </h1>
          <p className={styles.heroDesc}>
            Ajukan surat keterangan, surat pengantar, dan pengaduan warga secara mandiri dari mana saja. Pantau progres pengerjaan dan unduh berkas resmi langsung dari HP Anda.
          </p>

          <div className={styles.heroActions}>
            <Link href={targetHref} className={styles.primaryBtn}>
              <UserCheck size={18} />
              <span>{session ? 'Ajukan Surat Sekarang' : 'Masuk / Ajukan Surat Sekarang'}</span>
            </Link>
            <a href="#alur" className={styles.secondaryBtn}>
              <HelpCircle size={18} />
              <span>Lihat Alur Pelayanan</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS / HIGHLIGHTS ── */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <Clock size={28} className={styles.statIcon} />
            <div>
              <h3>Pengurusan Online</h3>
              <p>Hemat waktu tanpa mengantre lama di kantor desa</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <Send size={28} className={styles.statIcon} />
            <div>
              <h3>Percakapan 2-Arah</h3>
              <p>Interaksi langsung dengan perangkat & admin desa</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <Download size={28} className={styles.statIcon} />
            <div>
              <h3>Unduh Berkas PDF</h3>
              <p>Surat resmi tersimpan aman & siap dicetak kapan saja</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALUR PELAYANAN (STEP BY STEP) ── */}
      <section id="alur" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Mudah & Terstruktur</span>
            <h2 className={styles.sectionTitle}>4 Langkah Mudah Pengajuan Surat</h2>
            <p className={styles.sectionSub}>Alur simpel dan transparan dari pengajuan hingga berkas siap diunduh.</p>
          </div>

          <div className={styles.stepGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Login Akun Google</h3>
              <p>Masuk dengan mudah menggunakan akun Google Anda ke Dashboard Warga.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Pilih Layanan & Isi Formulir</h3>
              <p>Pilih jenis surat yang dibutuhkan dan isi rincian permohonan beserta foto/berkas syarat.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Verifikasi Admin Desa</h3>
              <p>Admin desa memeriksa berkas dan memproses pembuatan surat resmi.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>4</div>
              <h3>Unduh Surat Jadi</h3>
              <p>Surat selesai diproses dan berkas PDF/Foto siap Anda unduh langsung dari HP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DAFTAR LAYANAN BENTO GRID ── */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Lengkap & Terintegrasi</span>
            <h2 className={styles.sectionTitle}>Daftar Layanan Administrasi Publik</h2>
            <p className={styles.sectionSub}>Berikut berbagai jenis pengurusan surat dan permohonan yang dapat diajukan secara online.</p>
          </div>

          <div className={styles.layananGrid}>
            {daftarLayanan.map((item) => (
              <div key={item.id} className={styles.layananCard}>
                <div className={styles.cardTop}>
                  <span className={styles.kategoriBadge}>{item.kategori}</span>
                  <span className={styles.featureBadge}>{item.badge}</span>
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>

                <div className={styles.syaratBox}>
                  <span className={styles.syaratLabel}>Persyaratan Berkas:</span>
                  <ul className={styles.syaratList}>
                    {item.syarat.map((s, i) => (
                      <li key={i}><CheckCircle2 size={14} color="#16a34a" /> {s}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.estimasiText}>
                    <Clock size={14} /> Estimasi: {item.estimasi}
                  </span>
                  <Link href={targetHref} className={styles.cardLinkBtn}>
                    Ajukan <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2>Butuh Surat Keterangan / Pengaduan Hari Ini?</h2>
          <p>Klik tombol di bawah untuk masuk ke Dashboard Warga dan mengajukan permohonan surat secara langsung.</p>
          <Link href={targetHref} className={styles.ctaBtn}>
            <UserCheck size={20} />
            <span>{session ? 'Buka Dashboard Warga' : 'Masuk ke Dashboard Warga'}</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
