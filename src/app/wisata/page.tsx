'use client';

import { useState, useEffect } from 'react';
import { Wisata } from '@/lib/api';
import { getWisataDB } from '@/lib/data-actions';
import { CloudSun, Navigation, Tent, Users, Map, Clock, Ticket, ZoomIn } from 'lucide-react';
import styles from './wisata.module.css';

export default function WisataDesa() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [activeTab, setActiveTab] = useState('bento');

  useEffect(() => {
    getWisataDB().then(setWisata);
  }, []);

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
        <div className={styles.headerTitle} id="bento">
          <span className={styles.hBadge}>Pusat Informasi</span>
          <h1 className={styles.hMain}>Pariwisata & Potensi Desa</h1>
          <p className={styles.hDesc}>
            Temukan semua informasi lengkap mengenai destinasi unggulan, peta geografis terpadu, hingga kekayaan agrowisata Desa Binanga.
          </p>
        </div>

        {/* Bento Grid (Clean & Bright) */}
        <div className={styles.bentoGrid}>
          
          {/* Highlight Image (span 2x2) */}
          <div className={`${styles.bentoCard} ${styles.bentoHighlight}`}>
            <img src="https://images.unsplash.com/photo-1542662565-7e4fd56f5604?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Pesona Binanga" className={styles.bBg} />
            <div className={styles.bOverlay}>
              <h2 className={styles.bTitleBig}>Pesona Alam Binanga</h2>
              <p className={styles.bDesc}>Menikmati udara pegunungan segar dan hamparan lanskap hijau di Sulawesi Barat.</p>
            </div>
          </div>

          {/* Weather / Climate */}
          <div className={`${styles.bentoCard} ${styles.bentoWeather}`}>
            <div className={styles.wTop}>
              <CloudSun size={48} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a' }}>Hari Ini</span>
            </div>
            <div>
              <h3 className={styles.wTemp}>22°C</h3>
              <p className={styles.wDesc}>Cerah Berawan • Sejuk</p>
            </div>
          </div>

          {/* Quick Stats (Tent/Fasilitas) */}
          <div className={`${styles.bentoCard} ${styles.bentoStat}`}>
            <div className={styles.sIconWrap} style={{ background: '#d1fae5', color: '#10b981' }}>
              <Tent size={24} />
            </div>
            <span className={styles.sVal}>12</span>
            <span className={styles.sLbl}>Homestay & Camping Ground Terdaftar</span>
          </div>

          {/* Quick Stats (Pemandu) */}
          <div className={`${styles.bentoCard} ${styles.bentoStat}`}>
            <div className={styles.sIconWrap} style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Users size={24} />
            </div>
            <span className={styles.sVal}>25+</span>
            <span className={styles.sLbl}>Pemandu Wisata Lokal Tersertifikasi</span>
          </div>

          {/* Map Preview (span 1x2 vertical) */}
          <div className={`${styles.bentoCard} ${styles.bentoMap}`} onClick={() => scrollTo('peta')}>
            <div className={styles.mapThumbWrap}>
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Peta ArcGIS Preview" />
            </div>
            <div className={styles.mapLabel}>
              <Map size={18} color="#3b82f6" />
              Lihat Peta ArcGIS
            </div>
          </div>

          {/* Distance Info */}
          <div className={`${styles.bentoCard} ${styles.bentoStat}`}>
            <div className={styles.sIconWrap} style={{ background: '#fef3c7', color: '#f59e0b' }}>
              <Navigation size={24} />
            </div>
            <span className={styles.sVal}>45</span>
            <span className={styles.sLbl}>Menit Berkendara dari Pusat Kota Majene</span>
          </div>

        </div>

        {/* Destinasi Wisata */}
        <div id="destinasi" className={styles.section}>
          <div className={styles.secHeader}>
            <span className={styles.secSub}>Eksplorasi Keindahan</span>
            <h2 className={styles.secTitle}>Destinasi Wisata</h2>
          </div>
          
          <div className={styles.destGrid}>
            {wisata.length > 0 ? wisata.map(item => (
              <div key={item.id} className={styles.destCard}>
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
              </div>
            )) : <p style={{ color: '#64748b' }}>Belum ada data destinasi wisata.</p>}
          </div>
        </div>

        {/* Potensi Desa */}
        <div id="potensi" className={styles.section}>
          <div className={styles.secHeader}>
            <span className={styles.secSub}>Pemberdayaan Masyarakat</span>
            <h2 className={styles.secTitle}>Potensi & Agrowisata</h2>
          </div>
          
          <div className={styles.potensiList}>
            <div className={styles.potensiRow}>
              <div className={styles.pImgWrap}>
                <img src="https://images.unsplash.com/photo-1596727262306-38435d03e5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kopi Khas Binanga" className={styles.pImg} loading="lazy" />
              </div>
              <div className={styles.pContent}>
                <h3 className={styles.pTitle}>Agrowisata Perkebunan Kopi & Kakao</h3>
                <p className={styles.pDesc}>
                  Selain pesona alamnya, Desa Binanga terkenal dengan hamparan kebun kopi dan kakao yang dikelola langsung oleh kelompok tani lokal. Pengunjung dapat mengikuti tur edukasi, mulai dari proses pemetikan biji kopi hingga menyeduh dan menikmati hasil panen segar langsung dari kebunnya.
                </p>
              </div>
            </div>
            
            <div className={styles.potensiRow}>
              <div className={styles.pImgWrap}>
                <img src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kerajinan Tangan" className={styles.pImg} loading="lazy" />
              </div>
              <div className={styles.pContent}>
                <h3 className={styles.pTitle}>Pusat Kerajinan Anyaman Lokal</h3>
                <p className={styles.pDesc}>
                  Temukan cendera mata khas berupa kerajinan tangan berbahan dasar bambu dan rotan. Produk-produk ini merupakan hasil dari pemberdayaan masyarakat dan UMKM desa yang tidak hanya estetik, tetapi juga mendukung keberlanjutan ekonomi warga.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ArcGIS Map Container (Static) */}
        <div id="peta" className={styles.section} style={{ paddingBottom: '100px' }}>
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
        </div>

      </div>
    </div>
  );
}
