'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Landmark, BarChart3, TrendingUp, Newspaper, HeartHandshake, Image, FileSearch, MapPin, Users, Wallet, ChevronRight, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

import { useState, useEffect } from 'react';
import { getPengaturan } from '@/server/actions/pengaturan.action';
import { getStatistikDB, getPostsDB, getUmkmDB, getWisataDB, getApbdesActiveDB, getInfrastrukturDB } from '@/server/queries/public.query';
import { getPerangkat } from '@/server/actions/struktur.action';
import OrgChart from '@/components/OrgChart';
import type { Post, UMKM, Wisata, Statistik } from '@/lib/api';

export default function Home() {
  const [pengaturan, setPengaturan] = useState<Record<string, string>>({});
  const [statistik, setStatistik] = useState<Statistik>({ penduduk: 0, kepala_keluarga: 0, luas_wilayah: 0, realisasi_anggaran: 0 });
  const [berita, setBerita] = useState<Post[]>([]);
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [wisataList, setWisataList] = useState<Wisata[]>([]);
  const [perangkat, setPerangkat] = useState<any[]>([]);
  const [apbdes, setApbdes] = useState<any>(null);
  const [infrastrukturList, setInfrastrukturList] = useState<any[]>([]);

  useEffect(() => {
    getPengaturan().then(setPengaturan);
    getStatistikDB().then(setStatistik);
    getPostsDB(3).then(setBerita);
    getUmkmDB(3).then(setUmkmList);
    getWisataDB(4).then(setWisataList);
    getPerangkat().then(setPerangkat);
    getApbdesActiveDB().then(setApbdes);
    getInfrastrukturDB(6).then(setInfrastrukturList);
  }, []);

  const kadesName = pengaturan.KADES_NAME || 'Nama Kepala Desa';
  const kadesWelcome = pengaturan.KADES_WELCOME || 'Sambutan belum tersedia.';

  let totalPendapatan = 0;
  let totalBelanja = 0;
  if (apbdes && apbdes.rincian) {
    totalPendapatan = apbdes.rincian.filter((r: any) => r.tipe === 'PENDAPATAN').reduce((acc: number, curr: any) => acc + curr.anggaran, 0);
    totalBelanja = apbdes.rincian.filter((r: any) => r.tipe === 'BELANJA').reduce((acc: number, curr: any) => acc + curr.anggaran, 0);
  }
  const pembiayaan = totalPendapatan - totalBelanja;

  const formatRp = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

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
          {/* Logo Desa di Hero */}
          <motion.img 
            variants={itemVariants} 
            src="/pic/logo-desa.jpeg" 
            alt="Logo Desa" 
            className={styles.heroLogo} 
          />

          <motion.div variants={itemVariants} className={styles.badge}>
            PORTAL RESMI PEMERINTAHAN DESA
          </motion.div>
          
          <motion.h1 variants={itemVariants} className={styles.mainTitle}>
            DESA BINANGA
          </motion.h1>

          <motion.h2 variants={itemVariants} className={styles.subTitle}>
            Kecamatan Sendana, Kabupaten Majene
          </motion.h2>
          
          <motion.p variants={itemVariants} className={styles.tagline}>
            "Membangun Desa Cerdas, Maju, dan Sejahtera"
          </motion.p>
          
          <motion.div variants={itemVariants} className={styles.ctaGroup}>
            <Link href="/profil-desa#sejarah" className={styles.primaryBtn}>
              Jelajahi Profil Desa
            </Link>
            <Link href="#layanan" className={styles.secondaryBtn}>
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
          viewport={{ once: true }}
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

          <motion.a variants={itemVariants} href="/data-statistik#idm" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><TrendingUp size={24} /></div>
            <h3 className={styles.serviceTitle}>IDM</h3>
          </motion.a>

          <motion.a variants={itemVariants} href="/berita-agenda" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><Newspaper size={24} /></div>
            <h3 className={styles.serviceTitle}>Berita</h3>
          </motion.a>


          <motion.a variants={itemVariants} href="/wisata#galeri-virtual-tour" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><Image size={24} /></div>
            <h3 className={styles.serviceTitle}>Galeri</h3>
          </motion.a>

          <motion.a variants={itemVariants} href="/profil-desa#ppid" className={styles.serviceCard}>
            <div className={styles.serviceIcon}><FileSearch size={24} /></div>
            <h3 className={styles.serviceTitle}>PPID</h3>
          </motion.a>
        </motion.div>
      </section>

      {/* SAMBUTAN KEPALA DESA */}
      <section className={styles.welcomeSection}>
        <div className={styles.welcomeContainer}>
          <motion.div 
            className={styles.welcomeImageWrapper}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.welcomeImage}>
              {pengaturan.KADES_FOTO ? (
                <img 
                  src={pengaturan.KADES_FOTO} 
                  alt={kadesName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  Foto Kepala Desa
                </div>
              )}
            </div>

            <div className={styles.welcomeNameplate}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{kadesName}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Kepala Desa Binanga</p>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.welcomeContent}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>
              <span>Sambutan</span> Kepala Desa
            </h2>
            
            <div className={styles.welcomeText}>
              <div 
                dangerouslySetInnerHTML={{ __html: pengaturan.KADES_WELCOME ? kadesWelcome : '<p>Sambutan dari Kepala Desa belum diatur di panel admin.</p>' }} 
              />

              <div style={{ marginTop: '30px' }}>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#64748b' }}>Sendana, 2026</p>
                <p style={{ margin: '8px 0 0 0', fontWeight: 600, color: '#0f172a' }}>{kadesName}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section className={styles.newsSection}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Berita & Agenda</h2>
            <p style={{ color: '#475569' }}>Kabar terbaru dari pemerintahan dan warga desa</p>
          </motion.div>

          {berita.length > 0 ? (
            <motion.div 
              className={styles.newsGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {berita.map((item) => (
                <motion.a variants={itemVariants} key={item.id} href={`/berita-agenda/${item.slug}`} style={{ textDecoration: 'none' }} className={styles.newsCard}>
                  <img src={item.cover || '/pic/kantor-desa.jpeg'} alt={item.judul} className={styles.newsImage} />
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
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Belum ada berita atau agenda yang ditambahkan oleh admin.</p>
            </div>
          )}
        </div>
      </section>
      {/* WISATA SECTION (MENGGUNAKAN DATA DATABASE) */}
      <section className={styles.potensiSection} style={{ background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Destinasi Wisata</h2>
            <p style={{ color: '#475569' }}>Jelajahi keindahan alam dan pesona budaya Desa Binanga</p>
          </motion.div>
          <motion.div 
            className={styles.potensiGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
          >
            {wisataList.length > 0 ? wisataList.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              >
                <Link href="/wisata" className={styles.potensiCard}>
                  <div className={styles.potensiImage} style={{backgroundImage: `url(${item.foto || '/pic/kantor-desa.jpeg'})`}}></div>
                  <div className={styles.potensiContent}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{item.nama}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                      {item.deskripsi.length > 80 ? item.deskripsi.substring(0, 80) + '...' : item.deskripsi}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Belum ada destinasi wisata yang ditambahkan.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* POTENSI DESA SECTION (MENGGUNAKAN DATA UMKM API) */}
      <section className={styles.potensiSection} style={{ background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>UMKM Lokal</h2>
            <p style={{ color: '#475569' }}>Dukung perekonomian dan kreativitas warga Desa Binanga</p>
          </motion.div>
          <motion.div 
            className={styles.potensiGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
          >
            {umkmList.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              >
                <Link href="/umkm" className={styles.potensiCard}>
                  <div className={styles.potensiImage} style={{backgroundImage: `url(${item.foto})`}}></div>
                  <div className={styles.potensiContent}>
                    <h3>{item.nama}</h3>
                    <p>{item.deskripsi}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FASILITAS & INFRASTRUKTUR DESA SECTION */}
      <section className={styles.potensiSection} style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span style={{ display: 'inline-block', padding: '6px 16px', background: '#eff6ff', color: '#2563eb', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', marginBottom: '12px' }}>
              SARANA & PRASARANA PUBLIK
            </span>
            <h2 className={styles.sectionTitle}>Fasilitas &amp; Infrastruktur Desa</h2>
            <p style={{ color: '#475569' }}>Fasilitas publik, pendidikan, kesehatan, peribadatan, dan sarana umum di Desa Binanga</p>
          </motion.div>

          {infrastrukturList.length > 0 ? (
            <motion.div 
              className={styles.potensiGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
                hidden: {}
              }}
            >
              {infrastrukturList.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                >
                  <div className={styles.potensiCard} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className={styles.potensiImage} style={{ backgroundImage: `url(${item.fotoUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'})`, position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                        {item.kategori}
                      </span>
                    </div>
                    <div className={styles.potensiContent} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, marginBottom: '6px' }}>
                          <MapPin size={13} /> Dusun {item.dusun}
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>{item.nama}</h3>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.deskripsi}</p>
                      </div>

                      {item.linkMaps && (
                        <a 
                          href={item.linkMaps} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.8rem',
                            color: '#2563eb',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            marginTop: '16px',
                            textDecoration: 'none',
                            width: 'fit-content',
                            transition: 'all 0.2s'
                          }}
                        >
                          <MapPin size={14} /> Lihat di Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
              Belum ada data fasilitas/infrastruktur yang diinputkan.
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link 
              href="/profil-desa#fasilitas" 
              className={styles.secondaryBtn} 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '10px', fontWeight: 600, textDecoration: 'none' }}
            >
              Lihat Selengkapnya di Profil Desa <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* APBDES SECTION (MENGGUNAKAN DATA DATABASE) */}
      <section className={styles.apbdesSection}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Transparansi APBDes {apbdes?.tahun || new Date().getFullYear()}</h2>
            <p style={{ color: '#475569' }}>Rincian Anggaran Pendapatan dan Belanja Desa Binanga</p>
          </motion.div>

          {apbdes ? (
          <div className={styles.apbdesGrid}>
            <motion.div className={styles.apbdesCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className={styles.apbdesIconWrapper} style={{ background: '#dcfce7', color: '#16a34a' }}>
                <Wallet size={24} />
              </div>
              <h4>Pendapatan Desa</h4>
              <h2 className={styles.apbdesAmount}>{formatRp(totalPendapatan)}</h2>
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressBar} style={{ width: '100%', background: '#16a34a' }}></div>
              </div>
            </motion.div>
            
            <motion.div className={styles.apbdesCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className={styles.apbdesIconWrapper} style={{ background: '#fee2e2', color: '#dc2626' }}>
                <BarChart3 size={24} />
              </div>
              <h4>Belanja Desa</h4>
              <h2 className={styles.apbdesAmount}>{formatRp(totalBelanja)}</h2>
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressBar} style={{ width: `${totalPendapatan ? (totalBelanja/totalPendapatan)*100 : 0}%`, background: '#dc2626' }}></div>
              </div>
            </motion.div>
            
            <motion.div className={styles.apbdesCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className={styles.apbdesIconWrapper} style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                <TrendingUp size={24} />
              </div>
              <h4>Pembiayaan Desa</h4>
              <h2 className={styles.apbdesAmount}>{formatRp(pembiayaan)}</h2>
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressBar} style={{ width: `${(pembiayaan/totalPendapatan)*100}%`, background: '#4f46e5' }}></div>
              </div>
            </motion.div>
          </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', marginTop: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Data APBDes belum diatur oleh admin.</p>
            </div>
          )}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className={styles.statsSection}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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

      {/* ADMINISTRASI SECTION */}
      <section className={styles.adminSection}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className={styles.adminContainer}>
            <motion.div 
              className={styles.adminContent}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={styles.sectionTitle}>Struktur Organisasi</h2>
              <p style={{ color: '#475569', marginBottom: '24px' }}>
                Pemerintah Desa Binanga berkomitmen memberikan pelayanan terbaik melalui susunan perangkat desa yang kompeten dan berdedikasi tinggi.
              </p>
              
              <ul className={styles.adminList}>
                <li><CheckCircle2 size={18} color="#2563eb" /> <strong>Kepala Desa:</strong> Memimpin penyelenggaraan pemerintahan</li>
                <li><CheckCircle2 size={18} color="#2563eb" /> <strong>Sekretaris Desa:</strong> Membantu manajemen administrasi</li>
                <li><CheckCircle2 size={18} color="#2563eb" /> <strong>Kasi & Kaur:</strong> Pelaksana teknis operasional</li>
                <li><CheckCircle2 size={18} color="#2563eb" /> <strong>Kepala Dusun:</strong> Pelaksana tugas kewilayahan</li>
              </ul>
              
              <Link href="/profil-desa#perangkat-desa" className={styles.primaryButton} style={{ display: 'inline-flex', marginTop: '24px' }}>
                Lihat Profil Lengkap <ChevronRight size={18} />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginTop: '20px' }}
          >
            <OrgChart data={perangkat} readOnly={true} compact={true} />
          </motion.div>
        </div>
      </section>

      {/* GALERI SECTION (MENGGUNAKAN DATA WISATA API) */}
      <section className={styles.galeriSection}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Galeri Pariwisata</h2>
            <p style={{ color: '#475569' }}>Dokumentasi keindahan alam dan destinasi Desa Binanga</p>
          </motion.div>
          <div className={styles.galeriGrid}>
            {wisataList.map((item) => (
              <div key={item.id} className={styles.galeriItem} style={{backgroundImage: `url(${item.foto})`}}></div>
            ))}
          </div>
        </div>
      </section>

      {/* PETA WILAYAH SECTION */}
      <section className={styles.mapSection}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Peta Wilayah Desa</h2>
            <p style={{ color: '#475569' }}>Lokasi geografis Desa Binanga, Kecamatan Sendana, Kabupaten Majene</p>
          </motion.div>
          
          <motion.div 
            className={styles.mapContainer}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63654.8973685671!2d118.84758778604975!3d-3.084196160565809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d93e15779abf513%3A0xeab49cc1437ccfa4!2sBinanga%2C%20Kec.%20Sendana%2C%20Kabupaten%20Majene%2C%20Sulawesi%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
            
            <div className={styles.mapOverlay}>
              <div className={styles.mapCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <MapPin color="#2563eb" size={24} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Kantor Desa Binanga</h3>
                </div>
                <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                  Jl. Poros Majene - Mamuju,<br/>
                  Kecamatan Sendana, Kabupaten Majene<br/>
                  Sulawesi Barat, 91452
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

