import { getPerangkatDesa } from '@/lib/api';
import { Target, Lightbulb, Map, Compass, Mountain, CloudRain } from 'lucide-react';
import styles from './profil.module.css';

export default function ProfilDesa() {
  const perangkat = getPerangkatDesa();

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* SEJARAH DESA */}
        <section id="sejarah" style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#0ea5e9', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px' }}>Profil Desa</span>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', margin: '10px 0' }}>Sejarah Desa</h2>
            <div style={{ width: '60px', height: '4px', backgroundColor: '#0ea5e9', margin: '0 auto', borderRadius: '2px' }}></div>
          </div>

          <div style={{ width: '100%', height: '300px', backgroundColor: '#e2e8f0', borderRadius: '12px', marginBottom: '30px', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1596700078832-6e279dfd9e26?q=80&w=800" 
              alt="Arsip Sejarah Desa"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#475569' }}>
            <p style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '3rem', float: 'left', lineHeight: '0.8', paddingTop: '8px', paddingRight: '12px', color: '#0f172a', fontWeight: 800 }}>D</span>
              esa kita telah berdiri sejak ratusan tahun yang lalu, diawali oleh sekelompok masyarakat agraris yang mencari lahan subur di lembah perbukitan. Nama desa ini diambil dari kata sansekerta yang melambangkan kemakmuran dan kedamaian.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Pada masa kolonial, desa ini menjadi salah satu pusat lumbung padi yang penting di wilayah kabupaten. Gotong royong dan kearifan lokal selalu menjadi pondasi kuat yang mempersatukan warga menghadapi berbagai zaman.
            </p>
            <blockquote style={{ borderLeft: '4px solid #0ea5e9', paddingLeft: '20px', margin: '30px 0', fontSize: '1.25rem', fontStyle: 'italic', color: '#0f172a' }}>
              "Kekuatan utama desa kita bukanlah pada hasil buminya semata, melainkan pada eratnya persaudaraan warganya."
            </blockquote>
          </div>
        </section>

        {/* VISI & MISI */}
        <section id="visi-misi">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Visi & Misi</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Arah kebijakan dan tujuan pembangunan desa.</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', marginBottom: '30px', border: '1px solid #e2e8f0', borderTop: '5px solid #0ea5e9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9', padding: '10px', borderRadius: '10px' }}><Lightbulb size={24} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Visi</h3>
            </div>
            <p style={{ fontSize: '1.25rem', color: '#334155', fontStyle: 'italic', lineHeight: '1.8', borderLeft: '4px solid #0ea5e9', paddingLeft: '20px' }}>
              "Mewujudkan Desa Cerdas yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Transparan dan Partisipatif."
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', borderTop: '5px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '10px', borderRadius: '10px' }}><Target size={24} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Misi</h3>
            </div>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {['Meningkatkan kualitas pelayanan publik melalui digitalisasi dan e-government.',
                'Membangun infrastruktur desa yang memadai dan ramah lingkungan.',
                'Memberdayakan ekonomi kerakyatan melalui pengembangan UMKM dan potensi wisata.',
                'Meningkatkan kualitas kesehatan dan pendidikan masyarakat desa.',
                'Melestarikan nilai-nilai budaya dan kearifan lokal dalam kehidupan bermasyarakat.'].map((misi, i) => (
                  <li key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div style={{ backgroundColor: '#10b981', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, marginTop: '2px' }}>
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
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Informasi letak geografis, topografi, dan kondisi iklim desa.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Map size={32} color="#0ea5e9" style={{ margin: '0 auto 15px auto' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>45.2 Ha</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Luas Wilayah</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Compass size={32} color="#10b981" style={{ margin: '0 auto 15px auto' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>250 mdpl</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Ketinggian</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Mountain size={32} color="#f59e0b" style={{ margin: '0 auto 15px auto' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Perbukitan</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Topografi</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <CloudRain size={32} color="#8b5cf6" style={{ margin: '0 auto 15px auto' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>2.000 mm</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Curah Hujan / Tahun</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Batas Wilayah</h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Sebelah Utara</span>
                <span style={{ color: '#0f172a' }}>Desa Sukamakmur</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Sebelah Selatan</span>
                <span style={{ color: '#0f172a' }}>Hutan Lindung Gunung Salak</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Sebelah Timur</span>
                <span style={{ color: '#0f172a' }}>Sungai Ciliwung</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '5px' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Sebelah Barat</span>
                <span style={{ color: '#0f172a' }}>Desa Karanganyar</span>
              </li>
            </ul>
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
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            Masih dalam tahap pembaruan data penghargaan.
          </div>
        </section>

      </div>
    </div>
  );
}
