import { getDemografi, getAPBDes } from '@/lib/api';
import { Users, User, UserCheck, Landmark, Wallet } from 'lucide-react';

export default function DataStatistik() {
  const demografi = getDemografi();
  const totalLaki = demografi.jenis_kelamin[0].value;
  const totalPerempuan = demografi.jenis_kelamin[1].value;
  const totalPenduduk = totalLaki + totalPerempuan;

  const apbdes = getAPBDes();
  const totalPendapatan = apbdes.pendapatan.dana_desa + apbdes.pendapatan.alokasi_dana_desa + apbdes.pendapatan.pendapatan_asli_desa;
  const totalBelanja = apbdes.belanja.penyelenggaraan_pemerintahan + apbdes.belanja.pembangunan_desa + apbdes.belanja.pembinaan_kemasyarakatan + apbdes.belanja.pemberdayaan_masyarakat;
  
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* DEMOGRAFI PENDUDUK */}
        <section id="demografi-penduduk">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Demografi Penduduk</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Statistik kependudukan desa berdasarkan jenis kelamin dan usia.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#0ea5e9', marginBottom: '15px' }}><Users size={40} style={{ margin: '0 auto' }}/></div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{totalPenduduk}</div>
              <div style={{ color: '#64748b', fontWeight: 600 }}>Total Penduduk</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#3b82f6', marginBottom: '15px' }}><User size={40} style={{ margin: '0 auto' }}/></div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{totalLaki}</div>
              <div style={{ color: '#64748b', fontWeight: 600 }}>Laki - Laki</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#ec4899', marginBottom: '15px' }}><UserCheck size={40} style={{ margin: '0 auto' }}/></div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{totalPerempuan}</div>
              <div style={{ color: '#64748b', fontWeight: 600 }}>Perempuan</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '30px' }}>Distribusi Kelompok Usia</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {demografi.usia.map((item, index) => {
                const percentage = Math.round((item.jumlah / totalPenduduk) * 100);
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#475569' }}>{item.rentang}</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.jumlah} Jiwa ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#0ea5e9', borderRadius: '8px' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PENDIDIKAN & PEKERJAAN */}
        <section id="pendidikan-pekerjaan" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Pendidikan & Pekerjaan</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>Data analitik mengenai demografi pendidikan dan pekerjaan masyarakat desa.</p>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            Masih dalam tahap pembaruan data pendidikan dan pekerjaan.
          </div>
        </section>

        {/* TRANSPARANSI APBDES */}
        <section id="transparansi-apbdes">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Transparansi APBDes {apbdes.tahun}</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Realisasi Anggaran Pendapatan dan Belanja Desa (APBDes).</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', borderTop: '5px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '10px', borderRadius: '10px' }}><Landmark size={24} /></div>
                <div style={{ color: '#64748b', fontWeight: 600 }}>Total Pendapatan</div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{formatRupiah(totalPendapatan)}</div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', borderTop: '5px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '10px' }}><Wallet size={24} /></div>
                <div style={{ color: '#64748b', fontWeight: 600 }}>Total Belanja</div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{formatRupiah(totalBelanja)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Pendapatan Detail */}
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Rincian Pendapatan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#475569' }}>Dana Desa (DD)</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatRupiah(apbdes.pendapatan.dana_desa)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#475569' }}>Alokasi Dana Desa (ADD)</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatRupiah(apbdes.pendapatan.alokasi_dana_desa)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#475569' }}>Pendapatan Asli Desa (PADes)</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatRupiah(apbdes.pendapatan.pendapatan_asli_desa)}</span>
                </div>
              </div>
            </div>

            {/* Belanja Detail */}
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Rincian Belanja</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#475569' }}>Penyelenggaraan Pemerintahan</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatRupiah(apbdes.belanja.penyelenggaraan_pemerintahan)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#475569' }}>Pembangunan Desa</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatRupiah(apbdes.belanja.pembangunan_desa)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#475569' }}>Pembinaan Kemasyarakatan</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatRupiah(apbdes.belanja.pembinaan_kemasyarakatan)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#475569' }}>Pemberdayaan Masyarakat</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatRupiah(apbdes.belanja.pemberdayaan_masyarakat)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
