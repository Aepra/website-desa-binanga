'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, HeartHandshake, Map, MessageSquareWarning } from 'lucide-react';
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
            Portal Resmi Pemerintahan Desa
          </motion.div>
          
          <motion.h1 variants={itemVariants} className={styles.title}>
            Membangun Desa Cerdas, Maju, dan Sejahtera
          </motion.h1>
          
          <motion.p variants={itemVariants} className={styles.description}>
            Selamat datang di Smart Village Platform. Pusat informasi, layanan publik digital, dan transparansi data untuk seluruh warga desa.
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
          <motion.a variants={itemVariants} href="/layanan/surat" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><FileText size={24} /></div>
            <h3 className={styles.serviceTitle}>Buat Surat</h3>
          </motion.a>
          
          <motion.a variants={itemVariants} href="/layanan/bansos" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><HeartHandshake size={24} /></div>
            <h3 className={styles.serviceTitle}>Cek Bansos</h3>
          </motion.a>
          
          <motion.a variants={itemVariants} href="/layanan/lapor" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><MessageSquareWarning size={24} /></div>
            <h3 className={styles.serviceTitle}>Lapor Warga</h3>
          </motion.a>
          
          <motion.a variants={itemVariants} href="/wisata/peta-wisata" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><Map size={24} /></div>
            <h3 className={styles.serviceTitle}>Peta Desa</h3>
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
            <h2 className={styles.sectionTitle} style={{ color: 'white' }}>Statistik Desa</h2>
            <p style={{ color: '#94a3b8' }}>Data real-time kependudukan dan transparansi</p>
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
