'use client';

import { useState, useEffect } from 'react';
import { UMKM } from '@/lib/api';
import { getUmkmDB } from '@/server/queries/public.query';
import { ShoppingBag, MessageCircle, Star } from 'lucide-react';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/Animate';
import styles from './umkm.module.css';

export default function UMKMPotensi() {
  const [umkmData, setUmkmData] = useState<UMKM[]>([]);
  const [activeCat, setActiveCat] = useState('Semua');

  useEffect(() => {
    getUmkmDB().then(setUmkmData);
  }, []);
  
  // Extract unique categories
  const categories = ['Semua', ...Array.from(new Set(umkmData.map(item => item.kategori)))];

  const filteredData = activeCat === 'Semua' ? umkmData : umkmData.filter(item => item.kategori === activeCat);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* Spotlight Banner (Mini Hero) */}
        <FadeUp className={styles.spotlight}>
          <div className={styles.spotlightOverlay} />
          <div className={styles.spotlightContent}>
            <span className={styles.sBadge}>100% Produk Lokal</span>
            <h1 className={styles.sTitle}>Pasar Desa Binanga</h1>
            <p className={styles.sDesc}>
              Dukung perekonomian lokal dengan membeli produk unggulan langsung dari para pengrajin dan pembuatnya.
            </p>
          </div>
          <ShoppingBag size={120} color="#fff" opacity={0.2} style={{ position: 'absolute', right: '-20px', bottom: '-20px', transform: 'rotate(-15deg)' }} />
        </FadeUp>

        {/* Categories Horizontal Scroll */}
        <FadeUp delay={0.2} className={styles.catWrapper}>
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveCat(cat)}
              className={`${styles.catBtn} ${activeCat === cat ? styles.catBtnActive : ''}`}
            >
              {cat}
            </button>
          ))}
        </FadeUp>

        {/* Product Grid */}
        <StaggerContainer className={styles.productGrid}>
          {filteredData.map(item => (
            <StaggerItem key={item.id} className={styles.productCard}>
              <div className={styles.productImageWrap}>
                <img src={item.foto} alt={item.nama} className={styles.productImage} />
                <span className={styles.productKat}>{item.kategori}</span>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{item.nama}</h3>
                <p className={styles.productDesc}>{item.deskripsi}</p>
                <a
                  href={`https://wa.me/${item.kontak}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.buyBtn}
                >
                  <MessageCircle size={16} />
                  <span>Pesan Sekarang</span>
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filteredData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <ShoppingBag size={48} opacity={0.3} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Belum ada produk di kategori ini.
          </div>
        )}

      </div>
    </div>
  );
}

