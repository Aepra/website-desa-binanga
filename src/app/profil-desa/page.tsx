import { getPerangkatDesa } from '@/lib/api';
import { Target, Lightbulb, Map, Compass, Mountain, CloudRain, MapPin, Ruler } from 'lucide-react';
import styles from './profil.module.css';

export default function ProfilDesa() {
  const perangkat = getPerangkatDesa();

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* SEJARAH DESA */}
        <section id="sejarah" style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#1e3a8a', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px' }}>Profil Desa</span>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', margin: '10px 0' }}>Sejarah Desa Binanga</h2>
            <div style={{ width: '60px', height: '4px', backgroundColor: '#1e3a8a', margin: '0 auto', borderRadius: '2px' }}></div>
          </div>

          <div style={{ width: '100%', height: '300px', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '30px', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1596700078832-6e279dfd9e26?q=80&w=800" 
              alt="Arsip Sejarah Desa"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#475569' }}>
            <p style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '3rem', float: 'left', lineHeight: '0.8', paddingTop: '8px', paddingRight: '12px', color: '#0f172a', fontWeight: 800 }}>B</span>
              inanga adalah sebuah desa di Kecamatan Sendana, Kabupaten Majene, Provinsi Sulawesi Barat, Indonesia. Desa ini merupakan salah satu dari 14 desa yang terdapat di Kecamatan Sendana, yang secara keseluruhan membawahi 16 Desa/Kelurahan (2 Kelurahan dan 14 Desa) serta 71 Dusun/Lingkungan.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Kecamatan Sendana sendiri memiliki luas wilayah total 138,87 km² dengan total penduduk mencapai 25.761 jiwa dan rata-rata kepadatan penduduk 185,50 jiwa/km². Desa-desa di bawah kecamatan ini meliputi Mosso Dhua, Bukit Samang, Mosso, Limbua, Pundau, Leppangan, Binanga, Sendana, Totolisi Sendana, Banua Sendana, Tallubanua, Tallubanua Utara, Limboro Rambu-Rambu, Puttada, Lalatedong, dan Paminggalan.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Desa Binanga memiliki luas daratan sebesar 1,68 km², yang hanya mengambil porsi 1,21% dari total luas Kecamatan Sendana. Dengan populasi sebanyak 956 jiwa yang menyumbang 3,71% dari total penduduk kecamatan, Desa Binanga memiliki kepadatan penduduk sebesar 569,05 jiwa/km².
            </p>
            <blockquote style={{ borderLeft: '4px solid #1e3a8a', paddingLeft: '20px', margin: '30px 0', fontSize: '1.25rem', fontStyle: 'italic', color: '#0f172a' }}>
              "Desa Binanga — bagian dari Kecamatan Sendana yang kaya akan nilai kekeluargaan dan kearifan lokal masyarakat Sulawesi Barat."
            </blockquote>
          </div>
        </section>

        {/* VISI & MISI */}
        <section id="visi-misi">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Visi & Misi</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Arah kebijakan dan tujuan pembangunan desa.</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px', border: '1px solid #e2e8f0', borderTop: '5px solid #1e3a8a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#f1f5f9', color: '#1e3a8a', padding: '10px', borderRadius: '8px' }}><Lightbulb size={24} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Visi</h3>
            </div>
            <p style={{ fontSize: '1.25rem', color: '#334155', fontStyle: 'italic', lineHeight: '1.8', borderLeft: '4px solid #1e3a8a', paddingLeft: '20px' }}>
              "Mewujudkan Desa Cerdas yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Transparan dan Partisipatif."
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', borderTop: '5px solid #3b82f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#f1f5f9', color: '#3b82f6', padding: '10px', borderRadius: '8px' }}><Target size={24} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Misi</h3>
            </div>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {['Meningkatkan kualitas pelayanan publik melalui digitalisasi dan e-government.',
                'Membangun infrastruktur desa yang memadai dan ramah lingkungan.',
                'Memberdayakan ekonomi kerakyatan melalui pengembangan UMKM dan potensi wisata.',
                'Meningkatkan kualitas kesehatan dan pendidikan masyarakat desa.',
                'Melestarikan nilai-nilai budaya dan kearifan lokal dalam kehidupan bermasyarakat.'].map((misi, i) => (
                  <li key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div style={{ backgroundColor: '#1e3a8a', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, marginTop: '2px' }}>
                      {i + 1}
                    </div>
                    <div style={{ color: '#475569', lineHeight: '1.6', fontSize: '1.1rem' }}>{misi}</div>
                  </li>
              ))}
            </ul>
          </div>
        </section>

        {/* WILAYAH & GEOGRAFIS */}
        <section id="wilayah-geografis">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Wilayah & Geografis</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Informasi letak geografis dan data wilayah Desa Binanga, Kecamatan Sendana.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Map size={32} color="#1e3a8a" style={{ margin: '0 auto 15px auto' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>1,68 km²</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Luas Wilayah</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Compass size={32} color="#1e3a8a" style={{ margin: '0 auto 15px auto' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>1,21%</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Proporsi Luas Kecamatan</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <MapPin size={32} color="#1e3a8a" style={{ margin: '0 auto 15px auto' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>3,7 km</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Jarak ke Ibukota Kecamatan</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Ruler size={32} color="#1e3a8a" style={{ margin: '0 auto 15px auto' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>26,7 km</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Jarak ke Ibukota Kabupaten</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Batas Wilayah Kecamatan Sendana</h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Sebelah Utara</span>
                <span style={{ color: '#0f172a' }}>Kecamatan Tammerodo</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Sebelah Selatan</span>
                <span style={{ color: '#0f172a' }}>Kecamatan Pamboang</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Sebelah Timur</span>
                <span style={{ color: '#0f172a' }}>Kabupaten Polewali Mandar</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Sebelah Barat</span>
                <span style={{ color: '#0f172a' }}>Selat Makassar</span>
              </li>
            </ul>
          </div>

          {/* DATA KEPENDUDUKAN RINGKAS */}
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Data Kependudukan</h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Total Penduduk</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>956 Jiwa</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Laki-Laki</span>
                <span style={{ color: '#0f172a' }}>485 Jiwa</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Perempuan</span>
                <span style={{ color: '#0f172a' }}>471 Jiwa</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Rasio Jenis Kelamin</span>
                <span style={{ color: '#0f172a' }}>103 (per 100 perempuan)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Kepadatan Penduduk</span>
                <span style={{ color: '#0f172a' }}>569,05 jiwa/km²</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '5px' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Proporsi terhadap Kecamatan</span>
                <span style={{ color: '#0f172a' }}>3,71% dari total penduduk</span>
              </li>
            </ul>
          </div>

          {/* SUMBER DATA */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px 25px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.8' }}>
            <strong style={{ color: '#475569' }}>Sumber Data (Tahun 2023):</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Luas Wilayah &amp; Persentase Luas — <em>Badan Perencanaan Daerah Kabupaten Majene, 2023</em></li>
              <li>Jarak ke Ibukota Kecamatan &amp; Kabupaten — <em>Kantor Camat Sendana, 2023</em></li>
              <li>Kependudukan, Kepadatan &amp; Rasio Jenis Kelamin — <em>Dinas Kependudukan dan Pencatatan Sipil Kabupaten Majene, 2023</em></li>
            </ul>
            <p style={{ margin: '12px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              Diterbitkan oleh Badan Pusat Statistik (BPS) Kabupaten Majene — <a href="https://majenekab.bps.go.id" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a', textDecoration: 'underline' }}>majenekab.bps.go.id</a>
            </p>
          </div>
        </section>

        {/* PERANGKAT DESA */}
        <section id="perangkat-desa">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Struktur Organisasi</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Pemerintahan Desa</p>
          </div>

          <div className={styles.grid}>
            {perangkat.map(p => (
              <div key={p.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={p.foto} alt={p.nama} className={styles.image} />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{p.nama}</h3>
                  <p className={styles.role}>{p.jabatan}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRESTASI PENGHARGAAN */}
        <section id="prestasi-penghargaan" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Prestasi & Penghargaan</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '30px' }}>Daftar pencapaian dan apresiasi yang telah diraih oleh desa kami.</p>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            Masih dalam tahap pembaruan data penghargaan.
          </div>
        </section>

      </div>
    </div>
  );
}
