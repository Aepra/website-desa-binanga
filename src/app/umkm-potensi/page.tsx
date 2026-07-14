import { getAllUMKM } from '@/lib/api';
import styles from './umkm.module.css';

export default function UMKMPotensi() {
  const umkm = getAllUMKM();

  return (
    <div className={styles.container}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        
        {/* KATALOG PRODUK */}
        <section id="katalog-produk">
          <div className={styles.header}>
            <h2 className={styles.title}>Katalog UMKM Desa</h2>
            <p className={styles.subtitle}>Mendukung dan memajukan produk unggulan lokal</p>
          </div>

          <div className={styles.grid}>
            {umkm.map(item => (
              <div key={item.id} className={styles.card}>
                <img src={item.foto} alt={item.nama} className={styles.image} />
                <div className={styles.content}>
                  <span className={styles.kategori}>{item.kategori}</span>
                  <h3 className={styles.nama}>{item.nama}</h3>
                  <p className={styles.deskripsi}>{item.deskripsi}</p>
                  
                  <div className={styles.actionArea}>
                    <a 
                      href={`https://wa.me/${item.kontak}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.btnWhatsapp}
                    >
                      Hubungi Penjual (WA)
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROFIL USAHA */}
        <section id="profil-usaha" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Profil Usaha Desa</h2>
          <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1.1rem' }}>Informasi mengenai badan usaha milik desa dan ekosistem UMKM lokal.</p>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', maxWidth: '800px', margin: '0 auto', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            Masih dalam tahap pembaruan data profil usaha.
          </div>
        </section>

      </div>
    </div>
  );
}
