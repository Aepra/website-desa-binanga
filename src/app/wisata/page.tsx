'use client';

import { getAllWisata, getMapDesa } from '@/lib/api';
import { MapPin } from 'lucide-react';

export default function WisataDesa() {
  const wisata = getAllWisata();
  const mapData = getMapDesa();

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        
        {/* DESTINASI WISATA */}
        <section id="destinasi">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Destinasi Wisata</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Temukan pesona alam dan kekayaan budaya di desa kami.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {wisata.map((item) => (
              <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.foto} alt={item.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: '#0ea5e9' }}>
                    {item.kategori}
                  </div>
                </div>
                <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0' }}>{item.nama}</h3>
                  <p style={{ color: '#475569', margin: '0 0 20px 0', lineHeight: '1.6', flex: 1 }}>{item.deskripsi}</p>
                  <button style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'transparent', color: '#0f172a', fontWeight: 600, cursor: 'pointer' }}>
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PETA WISATA */}
        <section id="peta-wisata">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Peta Wisata & Lokasi Penting</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Jelajahi lokasi fasilitas umum, pusat ekonomi, dan destinasi wisata di desa kami.</p>
          </div>

          <div style={{ display: 'flex', height: '600px', backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            {/* Sidebar List */}
            <div style={{ width: '350px', backgroundColor: 'white', borderRight: '1px solid #e2e8f0', padding: '20px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {mapData.map(item => (
                  <div key={item.id} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: 'white' }} 
                       onMouseOver={(e) => e.currentTarget.style.borderColor = '#0ea5e9'}
                       onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ color: '#0ea5e9', marginTop: '2px' }}><MapPin size={20} /></div>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#0f172a' }}>{item.nama}</h4>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                          {item.kategori}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Area */}
            <div style={{ flex: 1, backgroundColor: '#e2e8f0', position: 'relative' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24009384566!2d106.75883651703623!3d-6.229746497746487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                Mode Preview (Dummy Map)
              </div>
            </div>
          </div>
        </section>

        {/* GALERI VIRTUAL TOUR */}
        <section id="galeri-virtual-tour" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Galeri Virtual Tour</h2>
          <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1.1rem' }}>Jelajahi keindahan desa kami dalam tampilan 360 derajat interaktif.</p>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
            Masih dalam tahap pembaruan sistem Galeri Virtual Tour 360.
          </div>
        </section>

      </div>
    </div>
  );
}
