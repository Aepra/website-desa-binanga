'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/api';
import { getPostsDB } from '@/server/queries/public.query';
import { 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Eye, 
  Bell, 
  Calendar, 
  MapPin, 
  ChevronRight as ArrowIcon 
} from 'lucide-react';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Animate';
import Link from 'next/link';
import styles from './berita.module.css';

export default function BeritaDanAgenda() {
  const [berita, setBerita] = useState<Post[]>([]);
  const [agenda, setAgenda] = useState<Post[]>([]);
  const [pengumuman, setPengumuman] = useState<Post[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    getPostsDB(10, 'BERITA').then(setBerita);
    getPostsDB(5, 'AGENDA').then(setAgenda);
    getPostsDB(3, 'PENGUMUMAN').then(setPengumuman);
  }, []);

  // Top stories for the hero carousel & thumbnails (up to 4 items)
  const featuredNews = berita.slice(0, 4);
  const currentHero = featuredNews[activeSlide] || featuredNews[0] || null;

  // Sidebar "TOP NEWS" (items after top 4 or all berita)
  const topNewsList = berita.slice(1, 6);

  const handleNextSlide = () => {
    if (featuredNews.length > 0) {
      setActiveSlide((prev) => (prev + 1) % featuredNews.length);
    }
  };

  const handlePrevSlide = () => {
    if (featuredNews.length > 0) {
      setActiveSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* Top Date & Category Header */}
        <FadeUp className={styles.header}>
          <div className={styles.titleWrap}>
            <span className={styles.categoryTag}>PORTAL BERITA & KABAR DESA</span>
            <h1 className={styles.title}>Berita & Agenda Desa Binanga</h1>
          </div>
          <div className={styles.dateNow}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </FadeUp>

        {/* Main News Layout */}
        <div className={styles.layout}>
          
          {/* LEFT / MAIN COLUMN: Featured Hero Carousel & Thumbnails */}
          <div className={styles.mainCol}>
            
            {/* HERO CAROUSEL BANNER */}
            {currentHero ? (
              <FadeUp className={styles.heroBannerContainer}>
                <div className={styles.heroImageWrapper}>
                  <img 
                    src={currentHero.cover || '/pic/hero-binanga.jpg'} 
                    alt={currentHero.judul} 
                    className={styles.heroImage} 
                  />
                  <div className={styles.heroOverlay} />

                  {/* Navigation Arrows */}
                  <button 
                    type="button"
                    onClick={handlePrevSlide} 
                    className={`${styles.navBtn} ${styles.prevBtn}`}
                    aria-label="Previous News"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button 
                    type="button"
                    onClick={handleNextSlide} 
                    className={`${styles.navBtn} ${styles.nextBtn}`}
                    aria-label="Next News"
                  >
                    <ChevronRight size={22} />
                  </button>

                  {/* Center Media Indicator Badge */}
                  <div className={styles.centerBadge}>
                    <ImageIcon size={20} color="#ffffff" />
                  </div>

                  {/* Hero News Caption */}
                  <div className={styles.heroCaption}>
                    <span className={styles.redCategoryBadge}>
                      {currentHero.kategori || 'BERITA'}
                    </span>
                    <Link 
                      href={`/berita-agenda/${currentHero.slug || currentHero.id}`}
                      className={styles.heroTitleLink}
                    >
                      <h2 className={styles.heroTitle}>{currentHero.judul}</h2>
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ) : (
              <div className={styles.skeletonHero}>Memuat Berita Utama...</div>
            )}

            {/* THUMBNAILS ROW (4 SMALL CARDS) */}
            {featuredNews.length > 0 && (
              <StaggerContainer className={styles.thumbnailRow}>
                {featuredNews.map((item, idx) => (
                  <StaggerItem key={item.id}>
                    <div 
                      className={`${styles.thumbCard} ${activeSlide === idx ? styles.thumbCardActive : ''}`}
                      onClick={() => setActiveSlide(idx)}
                    >
                      <div className={styles.thumbImageWrap}>
                        <img src={item.cover || '/pic/hero-binanga.jpg'} alt={item.judul} className={styles.thumbImg} />
                        <div className={styles.thumbIconBadge}>
                          <ImageIcon size={14} color="#ffffff" />
                        </div>
                      </div>
                      <h4 className={styles.thumbTitle}>{item.judul}</h4>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}

          </div>

          {/* RIGHT COLUMN: TOP NEWS SIDEBAR */}
          <div className={styles.sideCol}>
            
            {/* TOP NEWS SECTION */}
            <FadeUp delay={0.2} className={styles.topNewsSection}>
              <div className={styles.topNewsHeader}>
                <span className={styles.topNewsRedBadge}>TOP NEWS</span>
              </div>

              <StaggerContainer className={styles.topNewsList}>
                {topNewsList.length > 0 ? (
                  topNewsList.map((item, index) => (
                    <StaggerItem key={item.id}>
                      <Link 
                        href={`/berita-agenda/${item.slug || item.id}`} 
                        className={styles.topNewsItem}
                      >
                        <div className={styles.topNewsText}>
                          <h4 className={styles.topNewsItemTitle}>{item.judul}</h4>
                          <div className={styles.topNewsMeta}>
                            <span>
                              {new Date(item.tanggal || Date.now()).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                            </span>
                            <span className={styles.viewsMeta}>
                              <Eye size={12} style={{ display: 'inline', marginRight: '3px' }} />
                              {10 + index * 3}
                            </span>
                          </div>
                        </div>
                        <div className={styles.topNewsImgWrap}>
                          <img src={item.cover || '/pic/hero-binanga.jpg'} alt={item.judul} className={styles.topNewsImg} />
                        </div>
                      </Link>
                    </StaggerItem>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Belum ada data berita.</p>
                )}
              </StaggerContainer>
            </FadeUp>

          </div>

        </div>

        {/* BOTTOM SECTIONS: AGENDA & PENGUMUMAN */}
        <div className={styles.bottomSectionGrid}>
          
          {/* AGENDA DESA */}
          <FadeUp delay={0.3} className={styles.categoryBox}>
            <div className={styles.sectionHeaderRedLine}>
              <h3 className={styles.sectionTitle}>Agenda Desa</h3>
            </div>
            <div className={styles.agendaGrid}>
              {agenda.length > 0 ? (
                agenda.map(item => (
                  <Link href={`/berita-agenda/${item.slug || item.id}`} key={item.id} className={styles.agendaCard}>
                    <div className={styles.agendaDateBadge}>
                      <span className={styles.agendaDay}>{new Date(item.tanggal).getDate()}</span>
                      <span className={styles.agendaMonth}>{new Date(item.tanggal).toLocaleString('id-ID', { month: 'short' })}</span>
                    </div>
                    <div className={styles.agendaInfo}>
                      <h4 className={styles.agendaCardTitle}>{item.judul}</h4>
                      <div className={styles.agendaLoc}><MapPin size={13} /> {item.lokasi || 'Kantor Desa Binanga'}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Belum ada agenda terdekat.</p>
              )}
            </div>
          </FadeUp>

          {/* PENGUMUMAN RESMI */}
          <FadeUp delay={0.4} className={styles.categoryBox}>
            <div className={styles.sectionHeaderRedLine}>
              <h3 className={styles.sectionTitle}>Pengumuman Resmi</h3>
            </div>
            <div className={styles.announceGrid}>
              {pengumuman.length > 0 ? (
                pengumuman.map(item => (
                  <Link href={`/berita-agenda/${item.slug || item.id}`} key={item.id} className={styles.announceCard}>
                    <div className={styles.announceBellIcon}><Bell size={18} color="#e11d48" /></div>
                    <div>
                      <h4 className={styles.announceCardTitle}>{item.judul}</h4>
                      <span className={styles.announceDate}>
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Belum ada pengumuman resmi.</p>
              )}
            </div>
          </FadeUp>

        </div>

      </div>
    </div>
  );
}
