'use client';

import { useState } from 'react';
import { getAllBerita, getUpcomingAgenda, cekBansos, Bansos } from '@/lib/api';
import { Search, ShieldAlert, CheckCircle, Clock, Calendar, MapPin, Bell } from 'lucide-react';
import styles from './berita.module.css';

export default function BeritaDanAgenda() {
  const berita = getAllBerita();
  const agenda = getUpcomingAgenda(10);
  
  // Bansos State
  const [nik, setNik] = useState('');
  const [result, setResult] = useState<Bansos | null | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik) return;
    setHasSearched(true);
    const data = cekBansos(nik);
    setResult(data || null);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        
        {/* BERITA DESA */}
        <section id="berita-desa">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Berita Desa</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Informasi dan kabar terbaru dari desa</p>
          </div>
          <div className={styles.grid}>
            {berita.map(item => (
              <div key={item.id} className={styles.card}>
                <img src={item.cover} alt={item.judul} className={styles.image} />
                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span className={styles.kategori}>{item.kategori}</span>
                    <span className={styles.tanggal}>
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className={styles.judul}>{item.judul}</h3>
                  <p className={styles.ringkasan}>{item.ringkasan}</p>
                  <button className={styles.btnReadMore}>Baca Selengkapnya</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PENGUMUMAN */}
        <section id="pengumuman" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Pengumuman Desa</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Informasi resmi dan edaran dari pemerintah desa.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1, 2, 3].map((item) => (
              <div key={item} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', borderLeft: '4px solid #1e3a8a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ color: '#1e3a8a', marginTop: '3px' }}><Bell size={24} /></div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '5px', fontWeight: 600 }}>12 Agustus 2026</div>
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 10px 0' }}>Pengumuman Libur Pelayanan Balai Desa</h3>
                    <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>Sehubungan dengan peringatan Hari Kemerdekaan RI, pelayanan administrasi di Balai Desa akan diliburkan pada tanggal 17 Agustus 2026. Pelayanan akan kembali normal pada hari berikutnya.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AGENDA KEGIATAN */}
        <section id="agenda-kegiatan" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Agenda Kegiatan</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Jadwal acara dan kegiatan penting di lingkungan desa.</p>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            {agenda.map(item => (
              <div key={item.id} style={{ display: 'flex', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '120px' }}>
                  <Calendar size={28} style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    {new Date(item.tanggal).getDate()}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {new Date(item.tanggal).toLocaleString('id-ID', { month: 'short' })}
                  </span>
                </div>
                <div style={{ padding: '25px', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0' }}>{item.judul}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.95rem' }}>
                    <MapPin size={16} />
                    {item.lokasi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CEK BANSOS */}
        <section id="cek-bansos" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Cek Bantuan Sosial</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Portal transparansi penyaluran bantuan sosial desa. Masukkan Nomor Induk Kependudukan (NIK) Anda untuk melihat status penerimaan.
            </p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }} size={20} />
                <input 
                  type="text" 
                  placeholder="Masukkan 16 digit NIK..." 
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '15px 15px 15px 45px', 
                    borderRadius: '4px', 
                    border: '1px solid #e2e8f0',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '0 30px', borderRadius: '4px', fontSize: '1rem', fontWeight: 600, border: 'none' }}
              >
                Cari Data
              </button>
            </form>
          </div>

          {hasSearched && (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              {result ? (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', borderLeft: '5px solid #10b981', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ backgroundColor: '#d1fae5', padding: '10px', borderRadius: '50%', color: '#10b981' }}>
                      <CheckCircle size={28} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Data Ditemukan</h3>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>NIK terdaftar sebagai penerima bantuan.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Nama Penerima</div>
                      <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '1.1rem' }}>{result.nama}</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Program Bantuan</div>
                      <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '1.1rem' }}>{result.program}</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: result.status === 'Tersalurkan' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                        {result.status === 'Tersalurkan' ? <CheckCircle size={16} /> : <Clock size={16} />}
                        {result.status}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Tanggal Penyaluran</div>
                      <div style={{ color: '#0f172a', fontWeight: 600 }}>{result.tanggal_terima}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#fef2f2', borderRadius: '8px', padding: '30px', borderLeft: '5px solid #ef4444', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ color: '#ef4444' }}><ShieldAlert size={40} /></div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#991b1b', margin: '0 0 5px 0' }}>Data Tidak Ditemukan</h3>
                    <p style={{ color: '#b91c1c', margin: 0 }}>NIK <strong>{nik}</strong> tidak terdaftar sebagai penerima bantuan sosial pada periode ini. Pastikan Anda memasukkan NIK dengan benar.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
