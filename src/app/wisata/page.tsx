'use client';

import { useState, useEffect } from 'react';
import { Wisata } from '@/lib/api';
import { getWisataDB } from '@/server/queries/public.query';
import { CloudSun, Navigation, Tent, Users, Map, Clock, Ticket, ZoomIn } from 'lucide-react';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/Animate';
import styles from './wisata.module.css';

export default function WisataDesa() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [activeTab, setActiveTab] = useState('bento');

  useEffect(() => {
    getWisataDB().then(setWisata);
  }, []);

  const destinasiList = wisata.filter(w => w.kategori.toLowerCase().includes('wisata'));
  const potensiList = wisata.filter(w => !w.kategori.toLowerCase().includes('wisata') || w.kategori === 'Potensi Wisata');

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.page}>
      
      {/* Sticky Sub-Navigation */}
      <div className={styles.subnav}>
        <button className={`${styles.navItem} ${activeTab === 'bento' ? styles.navItemActive : ''}`} onClick={() => scrollTo('bento')}>
          Ikhtisar
        </button>
        <button className={`${styles.navItem} ${activeTab === 'destinasi' ? styles.navItemActive : ''}`} onClick={() => scrollTo('destinasi')}>
          Destinasi
        </button>
        <button className={`${styles.navItem} ${activeTab === 'potensi' ? styles.navItemActive : ''}`} onClick={() => scrollTo('potensi')}>
          Potensi
        </button>
        <button className={`${styles.navItem} ${activeTab === 'peta' ? styles.navItemActive : ''}`} onClick={() => scrollTo('peta')}>
          Peta ArcGIS
        </button>
      </div>

      <div className={styles.container}>
        
        {/* Header Bersih */}
        <FadeUp className={styles.headerTitle} id="bento">
          <span className={styles.hBadge}>Pusat Informasi</span>
          <h1 className={styles.hMain}>Pariwisata & Potensi Desa</h1>
          <p className={styles.hDesc}>
            Temukan semua informasi lengkap mengenai destinasi unggulan, peta geografis terpadu, hingga kekayaan agrowisata Desa Binanga.
          </p>
        </FadeUp>

        {/* Bento Grid (Clean & Bright) */}
        <StaggerContainer className={styles.bentoGrid}>
          
          {/* Highlight Image (span 2x2) */}
          <StaggerItem className={`${styles.bentoCard} ${styles.bentoHighlight}`}>
            <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Pesona Binanga" className={styles.bImg} />
            <div className={styles.bOverlay}>
              <h3 className={styles.bTitle}>Pesona Alam Asri</h3>
              <p className={styles.bDesc}>Nikmati kesejukan udara pegunungan dan panorama hijau yang memanjakan mata.</p>
            </div>
          </StaggerItem>

          {/* Mini Cards */}
          <StaggerItem className={`${styles.bentoCard} ${styles.bentoMini}`}>
            <div className={styles.mIconWrap} style={{ background: '#dcfce7', color: '#16a34a' }}>
              <Tent size={24} />
            </div>
            <h4 className={styles.mTitle}>Camping Ground</h4>
            <p className={styles.mDesc}>Area perkemahan aman dan nyaman.</p>
          </StaggerItem>
          
          <StaggerItem className={`${styles.bentoCard} ${styles.bentoMini}`}>
            <div className={styles.mIconWrap} style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              <CloudSun size={24} />
            </div>
            <h4 className={styles.mTitle}>Cuaca Cerah</h4>
            <p className={styles.mDesc}>Cocok untuk aktivitas outdoor.</p>
          </StaggerItem>

          {/* Statistic/Info Card */}
          <StaggerItem className={`${styles.bentoCard} ${styles.bentoStat}`}>
            <div className={styles.sIconWrap} style={{ background: '#fee2e2', color: '#ef4444' }}>
              <Users size={24} />
            </div>
            <span className={styles.sVal}>12+</span>
            <span className={styles.sLbl}>Kelompok Sadar Wisata (Pokdarwis) Aktif</span>
          </StaggerItem>

          {/* Map Link Card */}
          <StaggerItem className={`${styles.bentoCard} ${styles.bentoMap}`} onClick={() => scrollTo('peta')}>
            <div className={styles.mapThumbWrap}>
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Peta ArcGIS Preview" />
            </div>
            <div className={styles.mapLabel}>
              <Map size={18} color="#3b82f6" />
              Lihat Peta ArcGIS
            </div>
          </StaggerItem>

          {/* Distance Info */}
          <StaggerItem className={`${styles.bentoCard} ${styles.bentoStat}`}>
            <div className={styles.sIconWrap} style={{ background: '#fef3c7', color: '#f59e0b' }}>
              <Navigation size={24} />
            </div>
            <span className={styles.sVal}>45</span>
            <span className={styles.sLbl}>Menit Berkendara dari Pusat Kota Majene</span>
          </StaggerItem>

        </StaggerContainer>

        {/* Destinasi Wisata */}
        <div id="destinasi" className={styles.section}>
          <FadeUp className={styles.secHeader}>
            <span className={styles.secSub}>Eksplorasi Keindahan</span>
            <h2 className={styles.secTitle}>Destinasi Wisata</h2>
          </FadeUp>
          
          <StaggerContainer className={styles.destGrid}>
            {destinasiList.length > 0 ? destinasiList.map(item => (
              <StaggerItem key={item.id} className={styles.destCard}>
                <div className={styles.dImgWrap}>
                  <img src={item.foto} alt={item.nama} className={styles.dImg} loading="lazy" />
                  <div className={styles.dBadge}>{item.kategori}</div>
                </div>
                <div className={styles.dBody}>
                  <h3 className={styles.dTitle}>{item.nama}</h3>
                  <p className={styles.dDesc}>{item.deskripsi}</p>
                  <div className={styles.dMeta}>
                    <div className={styles.mItem}>
                      <div className={styles.mIconWrap}><Clock size={16} /></div>
                      <span className={styles.mText}>08:00 - 17:00</span>
                    </div>
                    <div className={styles.mItem}>
                      <div className={styles.mIconWrap}><Ticket size={16} style={{ color: '#10b981' }} /></div>
                      <span className={styles.mText}>TBD</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            )) : <p style={{ color: '#64748b' }}>Belum ada data destinasi wisata.</p>}
          </StaggerContainer>
        </div>

        {/* Potensi Desa */}
        <div id="potensi" className={styles.section}>
          <FadeUp className={styles.secHeader}>
            <span className={styles.secSub}>Pemberdayaan Masyarakat</span>
            <h2 className={styles.secTitle}>Potensi & Agrowisata</h2>
          </FadeUp>
          
          <StaggerContainer className={styles.potensiList}>
            {potensiList.length > 0 ? potensiList.map(item => (
              <StaggerItem key={item.id} className={styles.potensiRow}>
                <div className={styles.pImgWrap}>
                  <img src={item.foto} alt={item.nama} className={styles.pImg} loading="lazy" />
                </div>
                <div className={styles.pContent}>
                  <h3 className={styles.pTitle}>{item.nama} <span style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#fef3c7', color: '#f59e0b', borderRadius: '4px', marginLeft: '12px', verticalAlign: 'middle' }}>{item.kategori}</span></h3>
                  <p className={styles.pDesc}>{item.deskripsi}</p>
                </div>
              </StaggerItem>
            )) : <p style={{ color: '#64748b' }}>Belum ada data potensi desa.</p>}
          </StaggerContainer>
        </div>

        {/* ArcGIS Map Container (Static) */}
        <FadeUp id="peta" className={styles.section} style={{ paddingBottom: '100px' }}>
          <div className={styles.secHeader}>
            <span className={styles.secSub}>Sistem Informasi Geografis</span>
            <h2 className={styles.secTitle}>Peta Wisata Terpadu (ArcGIS)</h2>
          </div>
          
          <div className={styles.mapContainer}>
            {/* GAMBAR PETA ARCGIS STATIS */}
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Peta ArcGIS Wisata" 
              className={styles.arcGisImg} 
            />
            
            <div className={styles.mapOverlay}>
              <button className={styles.btnMap}>
                <ZoomIn size={18} />
                Lihat Peta Resolusi Tinggi
              </button>
            </div>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}

