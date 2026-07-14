'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Landmark, BarChart3, TrendingUp, Newspaper, HeartHandshake, Image, FileSearch } from 'lucide-react';
import styles from './page.module.css';
import { getStatistik, getLatestBerita } from '@/lib/api';

export default function Home() {
  const statistik = getStatistik();
  const berita = getLatestBerita(3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className={styles.main}>
      
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className={styles.badge}>
            Portal Resmi Pemerintahan Desa Binanga
          </motion.div>
          
          <motion.h1 variants={itemVariants} className={styles.title}>
            Membangun Desa Cerdas, Maju, dan Sejahtera
          </motion.h1>
          
          <motion.p variants={itemVariants} className={styles.description}>
            Selamat datang di portal resmi Desa Binanga, Kecamatan Sendana, Kabupaten Majene, Sulawesi Barat. Pusat informasi, layanan publik digital, dan transparansi data untuk seluruh warga desa.
          </motion.p>
          
          <motion.div variants={itemVariants} className={styles.ctaGroup}>
            <Link href="/profil-desa#sejarah" className="btn btn-primary" style={{ padding: '12px 24px', background: '#1e3a8a', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 500 }}>
              Jelajahi Profil Desa
            </Link>
            <Link href="#layanan" className="btn btn-secondary" style={{ padding: '12px 24px', background: 'transparent', color: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', textDecoration: 'none', fontWeight: 500 }}>
              Layanan Publik
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* QUICK SERVICES */}
      <section id="layanan" className={styles.servicesSection}>
        <motion.div 
          className={styles.servicesGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.a variants={itemVariants} href="/profil-desa" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><Landmark size={24} /></div>
            <h3 className={styles.serviceTitle}>Profil Desa</h3>
          </motion.a>

          <motion.a variants={itemVariants} href="/data-statistik" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><BarChart3 size={24} /></div>
            <h3 className={styles.serviceTitle}>Infografis</h3>
          </motion.a>

          <motion.a variants={itemVariants} href="/data-statistik#transparansi-apbdes" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><TrendingUp size={24} /></div>
            <h3 className={styles.serviceTitle}>IDM</h3>
          </motion.a>

          <motion.a variants={itemVariants} href="/berita-agenda" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><Newspaper size={24} /></div>
            <h3 className={styles.serviceTitle}>Berita</h3>
          </motion.a>

          <motion.a variants={itemVariants} href="/berita-agenda#cek-bansos" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><HeartHandshake size={24} /></div>
            <h3 className={styles.serviceTitle}>Bansos</h3>
          </motion.a>

          <motion.a variants={itemVariants} href="/wisata#galeri-virtual-tour" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><Image size={24} /></div>
            <h3 className={styles.serviceTitle}>Galeri</h3>
          </motion.a>

          <motion.a variants={itemVariants} href="#" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><FileSearch size={24} /></div>
            <h3 className={styles.serviceTitle}>PPID</h3>
          </motion.a>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section className={styles.statsSection}>
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle} style={{ color: 'white' }}>Statistik Desa Binanga</h2>
            <p style={{ color: '#94a3b8' }}>Data kependudukan dan wilayah Desa Binanga, Kecamatan Sendana</p>
          </motion.div>

          <motion.div 
            className={styles.statsGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className={styles.statItem}>
              <div className={styles.statValue}>{statistik.penduduk}</div>
              <div className={styles.statLabel}>Jiwa Penduduk</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className={styles.statItem}>
              <div className={styles.statValue}>{statistik.kepala_keluarga}</div>
              <div className={styles.statLabel}>Kepala Keluarga</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className={styles.statItem}>
              <div className={styles.statValue}>{statistik.luas_wilayah} km²</div>
              <div className={styles.statLabel}>Luas Wilayah</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className={styles.statItem}>
              <div className={styles.statValue}>{statistik.realisasi_anggaran}%</div>
              <div className={styles.statLabel}>Realisasi APBDes</div>
            </motion.div>
          </motion.div>

          {/* SUMBER DATA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '30px', padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: '1.6', margin: 0 }}>
              Sumber: Badan Pusat Statistik (BPS) Kabupaten Majene, 2023 — 
              Dinas Kependudukan dan Pencatatan Sipil Kab. Majene &amp; Badan Perencanaan Daerah Kab. Majene
            </p>
          </motion.div>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section className={styles.newsSection}>
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Berita & Agenda</h2>
            <p style={{ color: '#475569' }}>Kabar terbaru dari pemerintahan dan warga desa</p>
          </motion.div>

          <motion.div 
            className={styles.newsGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {berita.map((item) => (
              <motion.a variants={itemVariants} key={item.id} href={`/berita-agenda#berita-desa`} style={{ textDecoration: 'none' }} className={styles.newsCard}>
                <img src={item.cover} alt={item.judul} className={styles.newsImage} />
                <div className={styles.newsContent}>
                  <div className={styles.newsMeta}>
                    <span style={{ color: '#1e3a8a', fontWeight: 600 }}>{item.kategori}</span>
                    <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h3 className={styles.newsTitle}>{item.judul}</h3>
                  <p className={styles.newsSummary}>{item.ringkasan}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
      
    </div>
  );
}
