'use client';

import { Target, Lightbulb, Map, Compass, MapPin, Ruler, Users, Award, Landmark, BookOpen, Clock, TreePine, Waves, Building2, Heart, GraduationCap, Home, AlertTriangle, CheckCircle2, Star, ChevronRight } from 'lucide-react';
import { FadeUp, FadeIn, StaggerContainer, StaggerItem } from '@/components/Animate';
import styles from './profil.module.css';
import fasStyles from './fasilitas.module.css';
import { useState } from 'react';

/* ─── DATA SEJARAH (sumber: Monografi Desa Binanga, Hal. 38–39) ─────────── */
const kronologiSejarah = [
  {
    tahun: '~1950an',
    judul: 'Wilayah Puttada yang Besar',
    cerita:
      'Binanga merupakan bagian dari Desa Puttada bersama Dusun Paminggalan, Lalattedong, Puttada, Pundau, dan Leppangan. Desa induk ini belum terpecah, masyarakat hidup berdampingan di pesisir Selat Makassar.',
    tipe: 'info',
  },
  {
    tahun: '1969',
    judul: 'Gempa Bumi & Tsunami Melanda',
    cerita:
      'Gempa bumi disertai tsunami menghantam kawasan Desa Puttada. Masjid hancur; air laut masuk jauh ke pemukiman. Banyak ikan terdampar di darat, namun ketakutan membuat warga tidak berani mengambilnya.',
    tipe: 'bencana',
  },
  {
    tahun: '1972',
    judul: 'Kemarau Panjang 10 Bulan',
    cerita:
      'Kemarau ekstrem selama sepuluh bulan menghancurkan hasil panen. Krisis pangan parah memaksa masyarakat bertahan hidup dengan memakan sagu dari pohon aren yang diproses secara tradisional.',
    tipe: 'bencana',
  },
  {
    tahun: '1982',
    judul: 'Kemarau Kedua (7 Bulan)',
    cerita:
      'Kemarau panjang kedua melanda. Pohon kelapa yang menjadi andalan ekonomi rakyat banyak yang mati. Petani merugi besar dan perekonomian desa terpuruk selama beberapa musim.',
    tipe: 'bencana',
  },
  {
    tahun: '1984',
    judul: 'Pengaspalan Jalan Poros',
    cerita:
      'Untuk pertama kalinya jalan poros selebar 3 meter diaspal. Akses mobilisasi warga menjadi jauh lebih mudah, membuka pintu bagi pertumbuhan ekonomi lokal dan akses ke pasar yang lebih luas.',
    tipe: 'pembangunan',
  },
  {
    tahun: '1987',
    judul: 'Banjir Besar',
    cerita:
      'Banjir besar menerjang pemukiman, mengakibatkan jalan putus dan kelangkaan pangan. Meski tidak ada korban jiwa, kejadian ini menggerakkan semangat gotong-royong masyarakat untuk saling membantu.',
    tipe: 'bencana',
  },
  {
    tahun: '2005',
    judul: 'Pemekaran Desa Puttada',
    cerita:
      'Desa Puttada secara resmi dimekarkan menjadi dua: Desa Puttada (Paminggalan, Lalattedong, Puttada) dan Desa Pundau (Pundau, Binanga, Leppangan). Pelayanan pemerintahan menjadi lebih terjangkau dan efektif.',
    tipe: 'administrasi',
  },
  {
    tahun: '2007–2009',
    judul: 'Hadirnya Sinyal Telkomsel',
    cerita:
      'Tower Telkomsel dibangun di kawasan ini, membuka era baru komunikasi digital bagi warga desa. Pertukaran informasi, akses berita, dan komunikasi jarak jauh menjadi mungkin dilakukan.',
    tipe: 'pembangunan',
  },
  {
    tahun: '2010',
    judul: 'Desa Binanga Berdiri Sendiri',
    cerita:
      'Dusun Binanga dimekarkan dari Desa Pundau dan resmi berdiri sebagai Desa Binanga yang mandiri, terdiri dari 4 dusun: Bo\'di, Butungan, Naulluyo, dan Binanga. Jalan tani sepanjang 10 km dibangun.',
    tipe: 'administrasi',
  },
  {
    tahun: '2016',
    judul: 'Wisata Mangrove Dikembangkan',
    cerita:
      'Potensi wisata alam mulai dikelola secara serius. Hutan mangrove di Dusun Bo\'di dikembangkan menjadi destinasi ekowisata yang menarik pengunjung dan mendatangkan pendapatan tambahan bagi warga.',
    tipe: 'pembangunan',
  },
  {
    tahun: '2020',
    judul: 'Gempa 6,2 SR',
    cerita:
      'Gempa berkekuatan 6,2 skala Richter mengguncang wilayah ini. Banyak rumah warga mengalami keretakan dan tower Telkomsel roboh, memutus komunikasi sementara. Tidak ada korban jiwa yang dilaporkan.',
    tipe: 'bencana',
  },
];

/* ─── DATA DUSUN (sumber: Monografi Desa Binanga, Hal. 48) ──────────────── */
const dataDusun = [
  { nama: "Dusun Bo'di",     kk: 65,  jiwa: 240, luas: 51.04,  lakiLaki: 124, perempuan: 116, highlight: 'Wisata Mangrove & Cekdam' },
  { nama: 'Dusun Butungan',  kk: 49,  jiwa: 165, luas: 9.29,   lakiLaki: 81,  perempuan: 84,  highlight: 'SDN 28 Inpres Puttada' },
  { nama: 'Dusun Naulluyo',  kk: 45,  jiwa: 193, luas: 92.49,  lakiLaki: 84,  perempuan: 109, highlight: 'Wilayah Terluas (92 ha)' },
  { nama: 'Dusun Binanga',   kk: 62,  jiwa: 251, luas: 38.18,  lakiLaki: 121, perempuan: 130, highlight: 'Pusat Pemerintahan Desa' },
];



/* ─── DATA BATAS WILAYAH DESA (sumber: Monografi Desa Binanga, Hal. 40) ─── */
const batasWilayah = [
  { arah: 'Utara',   nilai: 'Desa Totolisi Sendana', icon: '↑' },
  { arah: 'Barat',   nilai: 'Selat Makassar',         icon: '←' },
  { arah: 'Selatan', nilai: 'Desa Leppangan',          icon: '↓' },
  { arah: 'Timur',   nilai: 'Desa Pundau',             icon: '→' },
];

/* ─── DATA PENDIDIKAN per dusun (sumber: Monografi Desa Binanga, Tabel 8, Hal. 57) */
const dataIjazah = [
  { dusun: "Bo'di",    tidakPunya: 60, sd: 85, smp: 37, sma: 46, diploma: 3,  s1: 9,  s2: 0 },
  { dusun: 'Butungan', tidakPunya: 37, sd: 29, smp: 19, sma: 61, diploma: 9,  s1: 9,  s2: 1 },
  { dusun: 'Naulluyo', tidakPunya: 57, sd: 53, smp: 34, sma: 41, diploma: 1,  s1: 7,  s2: 0 },
  { dusun: 'Binanga',  tidakPunya: 67, sd: 57, smp: 32, sma: 68, diploma: 9,  s1: 18, s2: 0 },
  { dusun: 'TOTAL',    tidakPunya: 221, sd: 224, smp: 122, sma: 216, diploma: 22, s1: 43, s2: 1 },
];

const WARNA_TIPE: Record<string, string> = {
  bencana:       '#ef4444',
  administrasi:  '#3b82f6',
  pembangunan:   '#10b981',
  info:          '#8b5cf6',
};

import OrgChart from '@/components/OrgChart';

export default function ProfilDesaClient({ 
  dbSejarah, 
  dbInfrastruktur, 
  dbGlobalStats, 
  dbDusunList,
  dbPengaturan,
  dbPerangkat
}: { 
  dbSejarah?: any[], 
  dbInfrastruktur?: any[], 
  dbGlobalStats?: any, 
  dbDusunList?: any[],
  dbPengaturan?: Record<string, string>,
  dbPerangkat?: any[]
}) {
  const [perangkat, setPerangkat] = useState<any[]>(dbPerangkat || []);
  const [activeTab, setActiveTab] = useState<'dusun' | 'pendidikan' | 'sosial'>('dusun');
  const [expandedTimeline, setExpandedTimeline] = useState<Record<number, boolean>>({});

  const toggleTimeline = (idx: number) => {
    setExpandedTimeline(prev => ({ ...prev, [idx]: !prev[idx] }));
  };
  
  const kronologiData = dbSejarah && dbSejarah.length > 0 ? dbSejarah : kronologiSejarah;
  const infrastrukturData = dbInfrastruktur || [];

  const dynamicDataDusun = dbDusunList && dbDusunList.length > 0 ? dbDusunList.map((d: any) => {
    const comp = d.computed || d.penduduk?.[0] || {};
    const highlights: Record<string, string> = {
      "bo'di": 'Wisata Mangrove & Cekdam',
      'butungan': 'SDN 28 Inpres Puttada',
      'naulluyo': 'Wilayah Terluas (92 ha)',
      'binanga': 'Pusat Pemerintahan Desa'
    };
    const cleanName = d.nama.replace(/^Dusun\s+/i, '');
    return {
      nama: d.nama.toLowerCase().startsWith('dusun') ? d.nama : `Dusun ${d.nama}`,
      kk: comp.totalKk || 0,
      jiwa: comp.totalJiwa || 0,
      luas: d.luasHa || 40,
      lakiLaki: comp.lakiLaki || 0,
      perempuan: comp.perempuan || 0,
      highlight: highlights[cleanName.toLowerCase()] || 'Kawasan Pemukiman'
    };
  }) : dataDusun;

  const dynamicDataIjazah = dbDusunList && dbDusunList.length > 0 ? [
    ...dbDusunList.map((d: any) => {
      const edu = d.pendidikanComputed || {};
      return {
        dusun: d.nama,
        tidakPunya: edu.tanpaIjazah || 0,
        sd: edu.sd || 0,
        smp: edu.smp || 0,
        sma: edu.sma || 0,
        diploma: edu.diploma || 0,
        s1: edu.s1 || 0,
        s2: edu.s2 || 0
      };
    }),
    {
      dusun: 'TOTAL',
      tidakPunya: dbGlobalStats?.pendidikan?.tanpaIjazah || 0,
      sd: dbGlobalStats?.pendidikan?.sd || 0,
      smp: dbGlobalStats?.pendidikan?.smp || 0,
      sma: dbGlobalStats?.pendidikan?.sma || 0,
      diploma: dbGlobalStats?.pendidikan?.diploma || 0,
      s1: dbGlobalStats?.pendidikan?.s1 || 0,
      s2: dbGlobalStats?.pendidikan?.s2 || 0
    }
  ] : dataIjazah;

  const totalJiwa = dbGlobalStats?.totalPenduduk || dynamicDataDusun.reduce((s, d) => s + d.jiwa, 0) || 849;
  const luasDesa = dbGlobalStats?.luasDesaHa || 191;
  const totalKK = dbGlobalStats?.totalKk || dynamicDataDusun.reduce((s, d) => s + d.kk, 0) || 221;

  const pengaturan = dbPengaturan || {};

  const visi = pengaturan.VISI || 'Visi belum diatur di panel admin.';
  const misiHTML = pengaturan.MISI || 'Misi belum diatur di panel admin.';

  return (
    <div className={styles.page}>

      {/* ===== HERO ===== */}
      <section className={styles.hero} id="sejarah">
        <div className={`${styles.heroOrb} ${styles.heroOrb1}`} />
        <div className={`${styles.heroOrb} ${styles.heroOrb2}`} />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Landmark size={14} />
            Profil Resmi Desa
          </div>
          <h1 className={styles.heroTitle}>
            Desa{' '}
            <span className={styles.heroTitleAccent}>Binanga</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Kecamatan Sendana, Kabupaten Majene, Provinsi Sulawesi Barat — desa pesisir bersejarah di tepi Selat Makassar.
          </p>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>{totalJiwa}</div>
              <div className={styles.heroStatLabel}>Jiwa Penduduk</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>{luasDesa} ha</div>
              <div className={styles.heroStatLabel}>Luas Wilayah</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>4</div>
              <div className={styles.heroStatLabel}>Dusun</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>{totalKK}</div>
              <div className={styles.heroStatLabel}>Kepala Keluarga</div>
            </div>
          </div>
        </div>

        <div className={styles.heroScrollIndicator}>
          <span>Scroll</span>
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* ===== MENGENAL DESA ===== */}
      <section className={styles.section} id="mengenal-desa">
        <FadeUp className={styles.sectionInner}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionLabelDot} />
            Tentang Desa
          </div>
          <h2 className={styles.sectionTitle}>Mengenal Desa Binanga</h2>
          <p className={styles.sectionDesc}>
            Kisah, identitas, dan keunikan desa yang menjadi bagian tak terpisahkan dari sejarah Kecamatan Sendana.
          </p>

          <div className={styles.sejarahGrid}>
            <div className={styles.sejarahImageBlock}>
              <img
                src="https://images.unsplash.com/photo-1596700078832-6e279dfd9e26?q=80&w=800"
                alt="Desa Binanga, Kecamatan Sendana"
                className={styles.sejarahImage}
              />
              <div className={styles.sejarahImageOverlay}>
                <span className={styles.sejarahImageTag}>Pesisir Selat Makassar, Sulawesi Barat</span>
              </div>
            </div>

            <div className={styles.sejarahTextCard}>
              <div className={styles.sejarahTextContent}>
                <p>
                  <span className={styles.dropCap}>B</span>inanga adalah nama yang berasal dari bahasa
                  Mandar, berarti <em>"muara sungai"</em> — pertemuan antara sungai dan laut. Nama ini
                  mencerminkan posisi geografis desa yang tepat berada di bibir Selat Makassar.
                </p>
                <p>
                  Desa Binanga resmi berdiri pada tahun <strong>2010</strong> sebagai hasil pemekaran dari
                  Desa Pundau, setelah sebelumnya sempat menjadi bagian dari Desa Puttada sejak era 1950-an.
                  Desa ini mencakup wilayah seluas <strong>{luasDesa} hektare</strong> yang terbagi ke dalam
                  4 dusun: Bo'di, Butungan, Naulluyo, dan Binanga.
                </p>
                <p>
                  Masyarakat Desa Binanga mayoritas beretnis Mandar,
                  dengan ikatan adat dan bahasa daerah yang masih terjaga kuat. Hampir seluruh penduduk
                  menganut agama Islam dan menggunakan bahasa Mandar sebagai bahasa sehari-hari.
                </p>
              </div>

              {/* Sumber Resmi */}
              <div className={fasStyles.sumberBox}>
                <BookOpen size={14} />
                <div>
                  <strong>Sumber:</strong> Dokumen Pemerintahan & Catatan Sejarah Desa Binanga.
                </div>
              </div>
            </div>

            <div className={styles.sejarahQuoteCard}>
              <p className={styles.sejarahQuoteText}>
                &ldquo;Binanga — dari kata bahasa Mandar yang berarti <em>muara sungai</em>. Sebuah
                penamaan yang tepat untuk desa di tepi Selat Makassar yang telah berdiri sejak
                sebelum kemerdekaan Indonesia.&rdquo;
              </p>
              <span className={fasStyles.quoteSource}>— Catatan Sejarah Desa Binanga.</span>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ===== VISI & MISI ===== */}
      <section className={styles.sectionAlt} id="visi-misi">
        <FadeUp className={styles.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className={styles.sectionLabel} style={{ justifyContent: 'center' }}>
              <span className={styles.sectionLabelDot} />
              Arah Kebijakan
            </div>
            <h2 className={styles.sectionTitle}>Visi &amp; Misi</h2>
            <p className={styles.sectionDesc} style={{ margin: '0 auto' }}>
              Arah kebijakan dan tujuan pembangunan Desa Binanga menuju masa depan yang lebih cerah.
            </p>
          </div>

          <StaggerContainer className={styles.visiMisiGrid}>
            <StaggerItem className={styles.visiCard}>
              <div className={styles.visiIconWrapper}>
                <Lightbulb size={26} />
              </div>
              <div className={styles.visiLabel}>Visi</div>
              <div className={styles.visiText} dangerouslySetInnerHTML={{ __html: visi }} />
            </StaggerItem>

            <StaggerItem className={styles.misiCard}>
              <div className={styles.misiIconWrapper}>
                <Target size={26} />
              </div>
              <div className={styles.misiLabel}>Misi</div>
              <div className={styles.misiHTML} dangerouslySetInnerHTML={{ __html: misiHTML }} />
            </StaggerItem>
          </StaggerContainer>
        </FadeUp>
      </section>

      {/* ===== WILAYAH & GEOGRAFIS ===== */}
      <section className={styles.sectionDark} id="wilayah-geografis">
        <FadeUp className={styles.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className={`${styles.sectionLabel} ${styles.sectionLabelLight}`} style={{ justifyContent: 'center' }}>
              <span className={`${styles.sectionLabelDot} ${styles.sectionLabelDotLight}`} />
              Data Wilayah
            </div>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>Wilayah &amp; Geografis</h2>
            <p className={`${styles.sectionDesc} ${styles.sectionDescLight}`} style={{ margin: '0 auto' }}>
              Informasi letak geografis, batas administrasi, dan luas wilayah Desa Binanga berdasarkan data resmi.
            </p>
          </div>

          <StaggerContainer className={styles.geoBento}>
            {/* Stat cards */}
            <StaggerItem className={styles.geoStatCard}>
              <div className={styles.geoStatIcon}><Map size={24} /></div>
              <div className={styles.geoStatValue}>{luasDesa} ha</div>
              <div className={styles.geoStatLabel}>Luas Wilayah Desa</div>
            </StaggerItem>

            <StaggerItem className={styles.geoStatCard}>
              <div className={styles.geoStatIcon}><Waves size={24} /></div>
              <div className={styles.geoStatValue}>80%</div>
              <div className={styles.geoStatLabel}>Perkebunan</div>
            </StaggerItem>

            <StaggerItem className={styles.geoStatCard}>
              <div className={styles.geoStatIcon}><Home size={24} /></div>
              <div className={styles.geoStatValue}>20%</div>
              <div className={styles.geoStatLabel}>Pemukiman</div>
            </StaggerItem>

            <StaggerItem className={styles.geoStatCard}>
              <div className={styles.geoStatIcon}><Compass size={24} /></div>
              <div className={styles.geoStatValue}>4</div>
              <div className={styles.geoStatLabel}>Dusun</div>
            </StaggerItem>
            
            <StaggerItem className={styles.geoStatCard}>
              <div className={styles.geoStatIcon}><MapPin size={24} /></div>
              <div className={styles.geoStatValue}>3,7 km</div>
              <div className={styles.geoStatLabel}>Jarak ke Kec. Sendana</div>
            </StaggerItem>

            <StaggerItem className={styles.geoStatCard}>
              <div className={styles.geoStatIcon}><Building2 size={24} /></div>
              <div className={styles.geoStatValue}>26,7 km</div>
              <div className={styles.geoStatLabel}>Jarak ke Kab. Majene</div>
            </StaggerItem>

            {/* Batas Wilayah Desa */}
            <StaggerItem className={styles.geoBorderCard}>
              <div className={styles.geoBorderTitle}>
                <div className={styles.geoBorderTitleIcon}><Compass size={20} /></div>
                Batas Wilayah Desa Binanga
              </div>
              <ul className={styles.geoBorderList}>
                {batasWilayah.map((b) => (
                  <li key={b.arah} className={styles.geoBorderItem}>
                    <span className={styles.geoBorderDirection}>
                      <strong>{b.icon}</strong> {b.arah}
                    </span>
                    <span className={styles.geoBorderValue}>{b.nilai}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* Luas per dusun */}
            <StaggerItem className={styles.geoPopCard}>
              <div className={styles.geoPopTitle}>
                <div className={styles.geoBorderTitleIcon}><Ruler size={20} /></div>
                Luas Wilayah per Dusun
              </div>
              <div className={styles.geoPopGrid}>
                {dataDusun.map((d) => (
                  <div key={d.nama} className={styles.geoPopItem}>
                    <div className={styles.geoPopValue}>{d.luas} ha</div>
                    <div className={styles.geoPopLabel}>{d.nama}</div>
                  </div>
                ))}
              </div>
            </StaggerItem>

            {/* Sumber */}
            <StaggerItem className={styles.sourceCard}>
              <strong>Sumber Data Geografis:</strong>
              <ul>
                <li>Batas Wilayah &amp; Luas Dusun — <em>Dokumen Peta & Administrasi Desa Binanga.</em></li>
                <li>Jarak & Lokasi Administratif — <em>Pemerintah Kecamatan Sendana & Kabupaten Majene.</em></li>
              </ul>
            </StaggerItem>
          </StaggerContainer>
        </FadeUp>
      </section>

      {/* ===== PERANGKAT DESA ===== */}
      <section className={styles.section} id="perangkat-desa" style={{ overflowX: 'hidden' }}>
        <FadeUp className={styles.sectionInner} style={{ maxWidth: '100%', padding: '0' }}>
          <div className={styles.perangkatHeader}>
            <div className={styles.sectionLabel} style={{ justifyContent: 'center' }}>
              <span className={styles.sectionLabelDot} />
              Pemerintahan
            </div>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>
              Struktur Organisasi
            </h2>
            <p className={styles.sectionDesc} style={{ margin: '0 auto', textAlign: 'center' }}>
              Bagan lengkap susunan perangkat pemerintahan Desa Binanga.
            </p>
          </div>

          <div style={{ marginTop: '40px' }}>
            <OrgChart data={perangkat} readOnly={true} compact={false} />
          </div>
        </FadeUp>
      </section>

      {/* ===== DATA DUSUN — KARTU INTERAKTIF ===== */}
      <section className={styles.sectionAlt} id="data-dusun">
        <FadeUp className={styles.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className={styles.sectionLabel} style={{ justifyContent: 'center' }}>
              <span className={styles.sectionLabelDot} />
              Kependudukan
            </div>
            <h2 className={styles.sectionTitle}>Data Statistik Dusun</h2>
            <p className={styles.sectionDesc} style={{ margin: '0 auto' }}>
              Rincian data kependudukan, demografi, dan pendidikan per dusun di Desa Binanga.
            </p>
          </div>

          {/* Tab */}
          <div className={fasStyles.tabRow}>
            <button
              className={`${fasStyles.tabBtn} ${activeTab === 'dusun' ? fasStyles.tabActive : ''}`}
              onClick={() => setActiveTab('dusun')}
            >
              <Users size={16} /> Data Dusun
            </button>
            <button
              className={`${fasStyles.tabBtn} ${activeTab === 'pendidikan' ? fasStyles.tabActive : ''}`}
              onClick={() => setActiveTab('pendidikan')}
            >
              <GraduationCap size={16} /> Pendidikan
            </button>
            <button
              className={`${fasStyles.tabBtn} ${activeTab === 'sosial' ? fasStyles.tabActive : ''}`}
              onClick={() => setActiveTab('sosial')}
            >
              <Heart size={16} /> Sosial &amp; Budaya
            </button>
          </div>

          {/* Panel: Dusun */}
          {activeTab === 'dusun' && (
            <div className={fasStyles.tabPanel}>
              <div className={fasStyles.dusunGrid}>
                {dynamicDataDusun.map((d, idx) => (
                  <div key={idx} className={fasStyles.dusunCard}>
                    <div className={fasStyles.dusunHeader}>
                      <h3 className={fasStyles.dusunNama}>{d.nama}</h3>
                      <span className={fasStyles.dusunHighlight}>{d.highlight}</span>
                    </div>
                    <div className={fasStyles.dusunStats}>
                      <div className={fasStyles.dusunStat}>
                        <div className={fasStyles.dusunStatVal}>{d.kk}</div>
                        <div className={fasStyles.dusunStatLbl}>Kepala Keluarga</div>
                      </div>
                      <div className={fasStyles.dusunStat}>
                        <div className={fasStyles.dusunStatVal}>{d.jiwa}</div>
                        <div className={fasStyles.dusunStatLbl}>Jiwa</div>
                      </div>
                      <div className={fasStyles.dusunStat}>
                        <div className={fasStyles.dusunStatVal}>{d.luas}</div>
                        <div className={fasStyles.dusunStatLbl}>Hektare</div>
                      </div>
                    </div>
                    {/* Gender bar */}
                    <div className={fasStyles.genderBar}>
                      <div
                        className={fasStyles.genderBarLaki}
                        style={{ width: `${d.jiwa > 0 ? Math.round((d.lakiLaki / d.jiwa) * 100) : 50}%` }}
                      />
                      <div className={fasStyles.genderBarPerempuan} style={{ flex: 1 }} />
                    </div>
                    <div className={fasStyles.genderLegend}>
                      <span className={fasStyles.legendLaki}>♂ {d.lakiLaki} Laki-laki</span>
                      <span className={fasStyles.legendPerempuan}>♀ {d.perempuan} Perempuan</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={fasStyles.sumberBox} style={{ marginTop: '24px' }}>
                <BookOpen size={14} />
                <div>
                  <strong>Sumber:</strong> Database Penduduk — Sistem Informasi Desa (Real-time).
                </div>
              </div>
            </div>
          )}

          {/* Panel: Pendidikan */}
          {activeTab === 'pendidikan' && (
            <div className={fasStyles.tabPanel}>
              <div className={fasStyles.eduSummary}>
                <div className={fasStyles.eduSumItem}>
                  <GraduationCap size={24} className={fasStyles.eduIcon} />
                  <div className={fasStyles.eduSumVal}>{dbGlobalStats?.pendidikan?.s1 ?? 4}</div>
                  <div className={fasStyles.eduSumLbl}>Lulusan S1</div>
                </div>
                <div className={fasStyles.eduSumItem}>
                  <BookOpen size={24} className={fasStyles.eduIcon} />
                  <div className={fasStyles.eduSumVal}>{dbGlobalStats?.pendidikan?.tanpaIjazah ?? 1}</div>
                  <div className={fasStyles.eduSumLbl}>Tanpa Ijazah / Belum Sekolah</div>
                </div>
                <div className={fasStyles.eduSumItem}>
                  <Award size={24} className={fasStyles.eduIcon} />
                  <div className={fasStyles.eduSumVal}>{dbGlobalStats?.pendidikan?.s2 ?? 1}</div>
                  <div className={fasStyles.eduSumLbl}>Lulusan S2</div>
                </div>
                <div className={fasStyles.eduSumItem}>
                  <Users size={24} className={fasStyles.eduIcon} />
                  <div className={fasStyles.eduSumVal}>{dbGlobalStats?.totalPenduduk ?? 10}</div>
                  <div className={fasStyles.eduSumLbl}>Total Jiwa Penduduk</div>
                </div>
              </div>

              <div className={fasStyles.eduTableWrap}>
                <table className={fasStyles.eduTable}>
                  <thead>
                    <tr>
                      <th>Dusun</th>
                      <th>Tdk Ijazah</th>
                      <th>SD</th>
                      <th>SMP</th>
                      <th>SMA</th>
                      <th>Diploma</th>
                      <th>S1</th>
                      <th>S2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dynamicDataIjazah.map((row, i) => (
                      <tr key={i} className={row.dusun === 'TOTAL' ? fasStyles.totalRow : ''}>
                        <td><strong>{row.dusun}</strong></td>
                        <td>{row.tidakPunya}</td>
                        <td>{row.sd}</td>
                        <td>{row.smp}</td>
                        <td>{row.sma}</td>
                        <td>{row.diploma}</td>
                        <td>{row.s1}</td>
                        <td>{row.s2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={fasStyles.sumberBox} style={{ marginTop: '16px' }}>
                <BookOpen size={14} />
                <div>
                  <strong>Sumber:</strong> Database Penduduk — Sistem Informasi Desa (Real-time).
                </div>
              </div>
            </div>
          )}

          {/* Panel: Sosial & Budaya */}
          {activeTab === 'sosial' && (
            <div className={fasStyles.tabPanel}>
              <div className={fasStyles.sosialGrid}>
                <div className={fasStyles.sosialCard}>
                  <div className={fasStyles.sosialIcon} style={{ background: '#f59e0b20', color: '#f59e0b' }}>
                    <Users size={28} />
                  </div>
                  <h3>Etnis Dominan</h3>
                  <div className={fasStyles.sosialVal}>Mandar</div>
                  <div className={fasStyles.sosialSub}>Etnis Asli Desa Binanga</div>
                </div>
                <div className={fasStyles.sosialCard}>
                  <div className={fasStyles.sosialIcon} style={{ background: '#3b82f620', color: '#3b82f6' }}>
                    <Star size={28} />
                  </div>
                  <h3>Agama</h3>
                  <div className={fasStyles.sosialVal}>Islam</div>
                  <div className={fasStyles.sosialSub}>Mayoritas Penduduk Desa</div>
                </div>
                <div className={fasStyles.sosialCard}>
                  <div className={fasStyles.sosialIcon} style={{ background: '#10b98120', color: '#10b981' }}>
                    <BookOpen size={28} />
                  </div>
                  <h3>Bahasa Utama</h3>
                  <div className={fasStyles.sosialVal}>Mandar</div>
                  <div className={fasStyles.sosialSub}>Bahasa Komunikasi Sehari-hari</div>
                </div>
                <div className={fasStyles.sosialCard}>
                  <div className={fasStyles.sosialIcon} style={{ background: '#8b5cf620', color: '#8b5cf6' }}>
                    <Clock size={28} />
                  </div>
                  <h3>Ikatan Tempat Tinggal</h3>
                  <div className={fasStyles.sosialVal}>≥10 Tahun</div>
                  <div className={fasStyles.sosialSub}>Mayoritas Warga Menetap Lebih dari 10 Tahun</div>
                </div>
              </div>

              {/* Status Perkawinan */}
              <div className={fasStyles.perkawinanCard}>
                <h3 className={fasStyles.perkawinanTitle}>
                  <Heart size={18} /> Status Perkawinan Kepala Keluarga
                </h3>
                <div className={fasStyles.perkawinanGrid}>
                  {[
                    { label: 'Kawin',       val: dbGlobalStats?.kawin || 0, pct: 75, color: '#10b981' },
                    { label: 'Cerai Mati',  val: dbGlobalStats?.ceraiMati || 0,  pct: 18, color: '#f59e0b' },
                    { label: 'Cerai Hidup', val: dbGlobalStats?.ceraiHidup || 0,   pct: 4,  color: '#ef4444' },
                    { label: 'Belum Kawin', val: dbGlobalStats?.belumKawin || 0,   pct: 3,  color: '#8b5cf6' },
                  ].map((item) => (
                    <div key={item.label} className={fasStyles.perkawinanItem}>
                      <div className={fasStyles.perkawinanLabel}>{item.label}</div>
                      <div className={fasStyles.perkawinanBar}>
                        <div
                          className={fasStyles.perkawinanBarFill}
                          style={{ width: `${item.val > 0 ? Math.min(100, item.val * 10) : 0}%`, background: item.color }}
                        />
                      </div>
                      <div className={fasStyles.perkawinanVal} style={{ color: item.color }}>{item.val} KK</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={fasStyles.sumberBox} style={{ marginTop: '16px' }}>
                <BookOpen size={14} />
                <div>
                  <strong>Sumber:</strong> Database Penduduk — Sistem Informasi Desa (Real-time).
                </div>
              </div>
            </div>
          )}
        </FadeUp>
      </section>

      {/* ===== FASILITAS ===== */}
      <section className={styles.sectionDark} id="fasilitas-desa">
        <FadeUp className={styles.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className={`${styles.sectionLabel} ${styles.sectionLabelLight}`} style={{ justifyContent: 'center' }}>
              <span className={`${styles.sectionLabelDot} ${styles.sectionLabelDotLight}`} />
              Infrastruktur
            </div>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>
              Fasilitas Publik &amp; Bangunan Penting
            </h2>
            <p className={`${styles.sectionDesc} ${styles.sectionDescLight}`} style={{ margin: '0 auto' }}>
              Fasilitas umum tersebar di 4 dusun — termasuk sarana pendidikan, peribadatan, kesehatan, dan wisata.
            </p>
          </div>

          {/* Ringkasan fasilitas */}
          <div className={fasStyles.fasRingkasanGrid}>
            {[
              { 
                icon: <Building2 size={22} />, 
                val: `${infrastrukturData.length}`, 
                label: 'Total Fasilitas', 
                color: '#3b82f6' 
              },
              { 
                icon: <GraduationCap size={22} />, 
                val: `${infrastrukturData.filter(i => (i.kategori || '').toLowerCase().includes('pendidikan') || (i.kategori || '').toLowerCase().includes('sekolah')).length}`, 
                label: 'Pendidikan', 
                color: '#10b981' 
              },
              { 
                icon: <Heart size={22} />, 
                val: `${infrastrukturData.filter(i => (i.kategori || '').toLowerCase().includes('sehat') || (i.kategori || '').toLowerCase().includes('posyandu')).length}`, 
                label: 'Kesehatan & Posyandu', 
                color: '#ef4444' 
              },
              { 
                icon: <TreePine size={22} />, 
                val: `${infrastrukturData.filter(i => (i.kategori || '').toLowerCase().includes('wisata')).length}`, 
                label: 'Wisata', 
                color: '#f59e0b' 
              },
              { 
                icon: <Landmark size={22} />, 
                val: `${infrastrukturData.filter(i => (i.kategori || '').toLowerCase().includes('ibadah') || (i.kategori || '').toLowerCase().includes('peribadatan')).length}`, 
                label: 'Peribadatan', 
                color: '#8b5cf6' 
              },
              { 
                icon: <Home size={22} />, 
                val: `${infrastrukturData.filter(i => (i.kategori || '').toLowerCase().includes('pemerintah') || (i.kategori || '').toLowerCase().includes('usaha') || (i.kategori || '').toLowerCase().includes('umum') || (i.kategori || '').toLowerCase().includes('lain')).length}`, 
                label: 'Pemerintahan & Umum', 
                color: '#06b6d4' 
              },
            ].map((item, i) => (
              <div key={i} className={fasStyles.fasRingkasanItem}>
                <div className={fasStyles.fasRingkasanIcon} style={{ color: item.color }}>{item.icon}</div>
                <div className={fasStyles.fasRingkasanVal} style={{ color: item.color }}>{item.val}</div>
                <div className={fasStyles.fasRingkasanLbl}>{item.label}</div>
              </div>
            ))}
          </div>

          {infrastrukturData.length > 0 ? (
            <div className={fasStyles.fasilitasGrid}>
              {infrastrukturData.map((item: any) => (
                <div key={item.id} className={fasStyles.fasilitasCard}>
                  <div className={fasStyles.fasImgWrap}>
                    <img src={item.fotoUrl || item.foto || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'} alt={item.nama} className={fasStyles.fasImg} loading="lazy" />
                    <div className={fasStyles.fasBadge}>{item.kategori}</div>
                  </div>
                  <div className={fasStyles.fasBody}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div className={fasStyles.fasDusunTag}>
                        <MapPin size={12} /> Dusun {item.dusun}
                      </div>
                      {item.updatedAt && (
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {new Date(item.updatedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                    <h3 className={fasStyles.fasTitle}>{item.nama}</h3>
                    <p className={fasStyles.fasDesc}>{item.deskripsi}</p>
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
                          color: '#38bdf8', 
                          background: 'rgba(56, 189, 248, 0.12)', 
                          border: '1px solid rgba(56, 189, 248, 0.25)', 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontWeight: 600, 
                          marginTop: '12px', 
                          textDecoration: 'none' 
                        }}
                      >
                        <MapPin size={13} /> Petunjuk Lokasi Maps
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', margin: '20px 0' }}>
              Belum ada data fasilitas/infrastruktur yang diinputkan di database. Tambahkan data fasilitas melalui panel admin.
            </div>
          )}

          <div className={fasStyles.sumberBoxDark}>
            <BookOpen size={14} />
            <div>
              <strong>Sumber:</strong> Database Fasilitas & Infrastruktur Pemerintah Desa Binanga.
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ===== KRONOLOGI SEJARAH ===== */}
      <section className={styles.section} id="sejarah-kronologi">
        <FadeUp className={styles.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className={styles.sectionLabel} style={{ justifyContent: 'center' }}>
              <span className={styles.sectionLabelDot} />
              Sejarah
            </div>
            <h2 className={styles.sectionTitle}>Perjalanan Panjang Desa Binanga</h2>
            <p className={styles.sectionDesc} style={{ margin: '0 auto' }}>
              Dari bagian Desa Puttada hingga berdiri mandiri — rekam jejak peristiwa bersejarah yang membentuk identitas desa.
            </p>
          </div>

          {/* Sumber Header */}
          <div className={fasStyles.sumberBoxCenter}>
            <BookOpen size={14} />
            <span>
              <strong>Sumber:</strong> Catatan Sejarah & Dokumen Pemerintahan Desa Binanga.
            </span>
          </div>

          {/* Timeline */}
          <div className={fasStyles.timeline}>
            {kronologiData.map((item: any, idx: number) => (
              <div key={idx} className={fasStyles.timelineItem}>
                <div className={fasStyles.timelineLeft}>
                  <div
                    className={fasStyles.timelineYear}
                    style={{ color: WARNA_TIPE[item.tipe] }}
                  >
                    {item.tahun}
                  </div>
                  <div className={fasStyles.timelineDot} style={{ background: WARNA_TIPE[item.tipe] }} />
                </div>
                <div className={fasStyles.timelineCard} style={{ borderLeftColor: WARNA_TIPE[item.tipe] }}>
                  <div className={fasStyles.timelineBadge} style={{ background: `${WARNA_TIPE[item.tipe]}15`, color: WARNA_TIPE[item.tipe] }}>
                    {item.tipe === 'bencana'       && <AlertTriangle size={12} />}
                    {item.tipe === 'administrasi'  && <Landmark size={12} />}
                    {item.tipe === 'pembangunan'   && <CheckCircle2 size={12} />}
                    {item.tipe === 'info'          && <Star size={12} />}
                    <span>
                      {item.tipe === 'bencana'      && 'Bencana Alam'}
                      {item.tipe === 'administrasi' && 'Administrasi Desa'}
                      {item.tipe === 'pembangunan'  && 'Pembangunan'}
                      {item.tipe === 'info'         && 'Informasi'}
                    </span>
                  </div>
                  <h3 className={fasStyles.timelineTitle}>{item.judul}</h3>
                  <div className={`${fasStyles.timelineCeritaWrapper} ${expandedTimeline[idx] ? fasStyles.expanded : ''}`}>
                    <p className={fasStyles.timelineCerita}>{item.cerita}</p>
                  </div>
                  <button className={fasStyles.timelineToggle} onClick={() => toggleTimeline(idx)}>
                    {expandedTimeline[idx] ? 'Sembunyikan' : 'Baca Selengkapnya'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ===== PRESTASI ===== */}
      <section className={styles.sectionDark} id="prestasi-penghargaan">
        <FadeUp className={styles.sectionInner}>
          <div className={styles.prestasiContent}>
            <div className={`${styles.sectionLabel} ${styles.sectionLabelLight}`} style={{ justifyContent: 'center' }}>
              <span className={`${styles.sectionLabelDot} ${styles.sectionLabelDotLight}`} />
              Pencapaian
            </div>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>
              Prestasi &amp; Penghargaan
            </h2>
            <p className={`${styles.sectionDesc} ${styles.sectionDescLight}`} style={{ margin: '0 auto' }}>
              Daftar pencapaian dan apresiasi yang telah diraih oleh desa kami.
            </p>

            <div className={styles.prestasiEmpty}>
              <div className={styles.prestasiEmptyIcon}>
                <Award size={28} />
              </div>
              Masih dalam tahap pembaruan data penghargaan.
            </div>
          </div>
        </FadeUp>
      </section>

    </div>
  );
}
