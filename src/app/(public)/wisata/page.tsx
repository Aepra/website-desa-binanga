'use client';

import { useState, useEffect } from 'react';
import { Wisata } from '@/lib/api';
import { getWisataDB } from '@/server/queries/public.query';
import { CloudSun, Navigation, Tent, Users, Map, Clock, Ticket, ZoomIn } from 'lucide-react';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Animate';
import GeographicDashboard from './GeographicDashboard';
import styles from './wisata.module.css';

const ExpandableText = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const shouldTruncate = text.length > 100;
  return (
    <div style={{ marginBottom: '12px' }}>
      <p className={styles.dDesc} style={{ display: 'inline', marginBottom: 0 }}>
        {expanded || !shouldTruncate ? text : `${text.substring(0, 100)}... `}
      </p>
      {shouldTruncate && (
        <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: '#16803C', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
          {expanded ? 'Tutup' : 'Lihat Selengkapnya'}
        </button>
      )}
    </div>
  );
};

export default function WisataDesa() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [activeTab, setActiveTab] = useState('bento');

  useEffect(() => {
    getWisataDB().then(setWisata);
  }, []);

  const destinasiList = wisata.filter(w => w.tipe === 'WISATA');
  const potensiList = wisata.filter(w => w.tipe === 'POTENSI');

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
          Destinasi Wisata
        </button>
        <button className={`${styles.navItem} ${activeTab === 'potensi' ? styles.navItemActive : ''}`} onClick={() => scrollTo('potensi')}>
          Potensi Desa
        </button>
      </div>

      <div className={styles.container}>
        
        {/* Header Bersih */}
        <FadeUp className={styles.headerTitle} id="bento">
          <span className={styles.hBadge}>Pusat Informasi</span>
          <h1 className={styles.hMain}>Pariwisata & Potensi Desa</h1>
          <p className={styles.hDesc}>
            Temukan informasi mengenai kondisi alam, wisata unggulan, hingga kekayaan agrowisata Desa Binanga.
          </p>
        </FadeUp>
        
        {/* Geographic Information Bento Grid */}
        <GeographicDashboard />

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
                  <ExpandableText text={item.deskripsi || ''} />
                  <div className={styles.dMeta}>
                    <div className={styles.mItem}>
                      <div className={styles.mIconWrap}><Clock size={16} /></div>
                      <span className={styles.mText}>{item.jamBuka || '08:00 - 17:00'}</span>
                    </div>
                    <div className={styles.mItem}>
                      <div className={styles.mIconWrap}><Ticket size={16} style={{ color: '#10b981' }} /></div>
                      <span className={styles.mText}>TBD</span>
                    </div>
                  </div>
                  {item.linkMaps && (
                    <a href={item.linkMaps} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#3b82f6', textDecoration: 'none', fontWeight: 600, marginTop: '12px' }}>
                      <Map size={16} /> Lihat di Peta
                    </a>
                  )}
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
                  <ExpandableText text={item.deskripsi || ''} />
                  {item.linkMaps && (
                    <a href={item.linkMaps} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#f59e0b', textDecoration: 'none', fontWeight: 600, marginTop: '8px' }}>
                      <Map size={16} /> Lokasi Potensi
                    </a>
                  )}
                </div>
              </StaggerItem>
            )) : <p style={{ color: '#64748b' }}>Belum ada data potensi desa.</p>}
          </StaggerContainer>
        </div>

      </div>
    </div>
  );
}

