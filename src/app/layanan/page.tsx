import { Construction } from 'lucide-react';
import styles from './layanan.module.css';

export const metadata = {
  title: 'Layanan Desa | Desa Binanga',
  description: 'Halaman Layanan Administrasi Desa Binanga',
};

export default function LayananPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#f0f9ff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Construction size={40} color="#0284c7" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Layanan Sedang Dikembangkan</h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Halaman Layanan Administrasi / E-Surat saat ini masih dalam tahap perancangan dan integrasi sistem. Silakan kunjungi kembali nanti!
          </p>
        </div>
      </div>
    </div>
  );
}
