'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/api';
import { getPostsDB } from '@/lib/data-actions';
import { Search, MapPin, Bell, Calendar, ChevronRight, Newspaper, ShieldAlert, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import styles from './berita.module.css';

export default function BeritaDanAgenda() {
  const [berita, setBerita] = useState<Post[]>([]);
  const [agenda, setAgenda] = useState<Post[]>([]);
  const [pengumuman, setPengumuman] = useState<Post[]>([]);

  useEffect(() => {
    getPostsDB(10, 'BERITA').then(setBerita);
    getPostsDB(5, 'AGENDA').then(setAgenda);
    getPostsDB(3, 'PENGUMUMAN').then(setPengumuman);
  }, []);

  // Pisahkan berita utama (top story)
  const topStory = berita.length > 0 ? berita[0] : null;
  const otherNews = berita.slice(1);



  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* Header Minimal */}
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <span className={styles.categoryTag}>Pusat Informasi</span>
            <h1 className={styles.title}>Berita & Agenda</h1>
          </div>
          <div className={styles.dateNow}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div className={styles.layout}>
          
          {/* MAIN COLUMN: Berita */}
          <div className={styles.mainCol}>
            
            {/* Top Story */}
            {topStory && (
              <div className={styles.topStory}>
                <img src={topStory.cover} alt={topStory.judul} className={styles.topStoryImage} />
                <div className={styles.topStoryContent}>
                  <div className={styles.topMeta}>Top Story • {topStory.kategori}</div>
                  <h2 className={styles.topTitle}>{topStory.judul}</h2>
                  <p className={styles.topDesc}>{topStory.ringkasan}</p>
                  <Link href={`/berita-agenda/${topStory.slug || topStory.id}`} className={styles.readMore}>Baca Selengkapnya <ChevronRight size={14} style={{ marginBottom: '-2px' }} /></Link>
                </div>
              </div>
            )}

            {/* Standard Grid News */}
            <div className={styles.newsGrid}>
              {otherNews.map(item => (
                <Link href={`/berita-agenda/${item.slug || item.id}`} key={item.id} className={styles.newsCard} style={{ display: 'block', textDecoration: 'none' }}>
                  <div className={styles.newsImageWrap}>
                    <img src={item.cover} alt={item.judul} className={styles.newsImage} />
                  </div>
                  <div className={styles.newsMeta}>
                    <span className={styles.newsKat}>{item.kategori}</span>
                    <span>
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className={styles.newsTitle}>{item.judul}</h3>
                </Link>
              ))}
            </div>

          </div>

          {/* SIDEBAR */}
          <div className={styles.sideCol}>
            


            {/* Pengumuman */}
            <div className={styles.sideSection}>
              <h3 className={styles.sideTitle}>
                <Bell size={18} color="#f59e0b" /> Pengumuman Resmi
              </h3>
              <div className={styles.announceList}>
                {pengumuman.length > 0 ? pengumuman.map((item) => (
                  <Link href={`/berita-agenda/${item.slug || item.id}`} key={item.id} className={styles.announceItem} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.announceIcon}><Bell size={16} /></div>
                    <div className={styles.announceContent}>
                      <h4 className={styles.aTitle}>{item.judul}</h4>
                      <div className={styles.aDate}>
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </Link>
                )) : <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Belum ada pengumuman.</p>}
              </div>
            </div>

            {/* Agenda Mendatang */}
            <div className={styles.sideSection}>
              <h3 className={styles.sideTitle}>
                <Calendar size={18} color="#10b981" /> Agenda Mendatang
              </h3>
              <div className={styles.agendaList}>
                {agenda.length > 0 ? agenda.map(item => (
                  <Link href={`/berita-agenda/${item.slug || item.id}`} key={item.id} className={styles.agendaItem} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.aDateBlock}>
                      <span className={styles.aDay}>{new Date(item.tanggal).getDate()}</span>
                      <span className={styles.aMonth}>{new Date(item.tanggal).toLocaleString('id-ID', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 className={styles.agTitle}>{item.judul}</h4>
                      <div className={styles.agLoc}><MapPin size={12} /> {item.lokasi || '-'}</div>
                    </div>
                  </Link>
                )) : <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Belum ada agenda terdekat.</p>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
