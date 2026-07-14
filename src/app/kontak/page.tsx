'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Phone, Mail } from 'lucide-react';

export default function KontakDesa() {
  const faqs = [
    {
      q: "Apa itu Smart Village Platform?",
      a: "Smart Village Platform adalah inisiatif digitalisasi desa yang mencakup layanan publik online, transparansi data, dan sistem informasi desa terpadu."
    },
    {
      q: "Bagaimana cara mengecek Bantuan Sosial (Bansos)?",
      a: "Anda dapat mengakses menu 'Cek Bansos' di bagian bawah halaman utama atau melalui menu Layanan. Cukup masukkan NIK Anda untuk melihat status bantuan."
    },
    {
      q: "Berapa lama proses pembuatan surat pengantar secara online?",
      a: "Proses pembuatan surat secara online memakan waktu maksimal 1x24 jam hari kerja. Anda akan menerima notifikasi jika surat sudah ditandatangani dan siap diunduh."
    },
    {
      q: "Bagaimana jika saya lupa NIK atau data tidak ditemukan?",
      a: "Silakan hubungi operator balai desa melalui form kontak atau WhatsApp resmi desa untuk pembaruan dan sinkronisasi data kependudukan."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        
        {/* FAQ */}
        <section id="faq">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Tanya Jawab (FAQ)</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Pertanyaan yang sering diajukan terkait layanan desa digital.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{faq.q}</span>
                  <span style={{ color: '#64748b' }}>
                    {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                
                {openIndex === index && (
                  <div style={{ padding: '0 25px 25px 25px', color: '#475569', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FORM KONTAK */}
        <section id="form-kontak">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Hubungi Kami</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Sampaikan aspirasi, pertanyaan, atau laporan Anda langsung kepada perangkat desa.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Contact Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <MapPin size={32} color="#1e3a8a" style={{ margin: '0 auto 15px auto' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '5px' }}>Alamat Kantor</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Jl. Balai Desa No. 1, Kecamatan Maju Jaya</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Phone size={32} color="#1e3a8a" style={{ margin: '0 auto 15px auto' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '5px' }}>Telepon / WA</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>+62 812-3456-7890</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Mail size={32} color="#1e3a8a" style={{ margin: '0 auto 15px auto' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '5px' }}>Email Resmi</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>layanan@desa.id</p>
              </div>
            </div>

            {/* Form */}
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>Nama Lengkap</label>
                    <input type="text" placeholder="Masukkan nama..." style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>Email / No. Telepon</label>
                    <input type="text" placeholder="Masukkan kontak..." style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>Pesan / Pengaduan</label>
                  <textarea rows={5} placeholder="Tuliskan pesan Anda di sini..." style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}></textarea>
                </div>
                <button type="submit" style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '15px', borderRadius: '4px', fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
