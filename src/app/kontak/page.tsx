'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './kontak.module.css';

export default function KontakDesa() {
  const faqs = [
    { q: "Apa itu Smart Village Platform?", a: "Smart Village Platform adalah inisiatif digitalisasi desa yang mencakup layanan publik online, transparansi data, dan sistem informasi desa terpadu." },
    { q: "Bagaimana cara mengecek Bantuan Sosial (Bansos)?", a: "Anda dapat mengakses menu 'Cek Bansos' di halaman Berita & Agenda. Cukup masukkan NIK Anda untuk melihat status bantuan." },
    { q: "Berapa lama proses pembuatan surat pengantar secara online?", a: "Proses pembuatan surat secara online memakan waktu maksimal 1x24 jam hari kerja. Anda akan menerima notifikasi jika surat sudah siap." }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      
      <div className={styles.splitLayout}>
        
        {/* Left Side: Info & FAQ */}
        <div className={styles.leftPanel}>
          <div className={styles.badge}>
            <Clock size={14} /> Layanan 24 Jam
          </div>
          <h1 className={styles.title}>Mari Terhubung Dengan Kami</h1>
          <p className={styles.desc}>
            Punya pertanyaan, masukan, atau laporan untuk perangkat desa? Silakan hubungi kami melalui kontak di bawah ini atau isi formulir pengaduan resmi.
          </p>

          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <div className={styles.cIconWrap}><MapPin size={24} /></div>
              <div>
                <h3 className={styles.cTitle}>Alamat Balai Desa</h3>
                <p className={styles.cValue}>Jl. Poros Majene-Mamuju, Kec. Sendana, Sulawesi Barat</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.cIconWrap}><Phone size={24} /></div>
              <div>
                <h3 className={styles.cTitle}>Telepon / WhatsApp</h3>
                <p className={styles.cValue}>+62 811-2233-4455</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.cIconWrap}><Mail size={24} /></div>
              <div>
                <h3 className={styles.cTitle}>Email Resmi</h3>
                <p className={styles.cValue}>halo@binanga.desa.id</p>
              </div>
            </div>
          </div>

          <h2 className={styles.faqTitle}>Pertanyaan Populer</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  className={styles.faqBtn}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className={styles.faqQuestion}>{faq.q}</span>
                  {openIndex === index ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                </button>
                {openIndex === index && (
                  <div className={styles.faqAnswer}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formBox}>
            <h2 className={styles.formTitle}>Kirim Pesan / Pengaduan</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan nama Anda..." className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Kontak (WA/Email)</label>
                  <input type="text" placeholder="No. WA atau Email..." className={styles.formInput} />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className={styles.formLabel}>Pesan</label>
                <textarea rows={5} placeholder="Tuliskan pesan atau detail pengaduan Anda di sini..." className={styles.formTextarea} />
              </div>
              <button type="submit" className={styles.formSubmit}>
                Kirim Pesan Sekarang
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
