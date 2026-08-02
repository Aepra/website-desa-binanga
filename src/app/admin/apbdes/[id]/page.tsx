import { getApbdesById, deleteRincian } from '@/server/actions/apbdes.action';
import { ArrowLeft, Tag, ArrowUpRight, ArrowDownRight, Wallet, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ApbdesForm from './ApbdesForm';

export default async function ApbdesDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const apbdes = await getApbdesById(resolvedParams.id);

  if (!apbdes) {
    return <div>Data APBDes tidak ditemukan.</div>;
  }

  const paguAnggaran = Number(apbdes.paguAnggaran || 999960247n);
  const totalPendapatan = apbdes.rincian.filter(r => r.tipe === 'PENDAPATAN').reduce((acc, curr) => acc + Number(curr.anggaran), 0);
  const totalBelanja = apbdes.rincian.filter(r => r.tipe === 'BELANJA').reduce((acc, curr) => acc + Number(curr.anggaran), 0);

  // Group belanja by bidang
  const belanjaByBidang: Record<string, typeof apbdes.rincian> = {};
  apbdes.rincian.filter(r => r.tipe === 'BELANJA').forEach(r => {
    const bidang = r.bidang || 'Tidak Diketahui';
    if (!belanjaByBidang[bidang]) belanjaByBidang[bidang] = [];
    belanjaByBidang[bidang].push(r);
  });

  return (
    <div>
      <Link href="/admin/apbdes" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '16px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Kembali ke Daftar Tahun
      </Link>
      
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Rincian APBDes Tahun {apbdes.tahun}</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Tambahkan item-item rincian Pendapatan dan Belanja. Target keseimbangan: <strong>Rp {paguAnggaran.toLocaleString('id-ID')}</strong></p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#dcfce7', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
          <div style={{ color: '#166534', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowDownRight size={16} /> Total Pendapatan</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{((totalPendapatan / paguAnggaran) * 100).toFixed(1)}%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532d' }}>Rp {totalPendapatan.toLocaleString('id-ID')}</div>
          <div style={{ width: '100%', height: '6px', background: '#bbf7d0', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min((totalPendapatan / paguAnggaran) * 100, 100)}%`, height: '100%', background: '#16a34a' }}></div>
          </div>
        </div>
        <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ color: '#991b1b', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={16} /> Total Belanja</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{((totalBelanja / paguAnggaran) * 100).toFixed(1)}%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7f1d1d' }}>Rp {totalBelanja.toLocaleString('id-ID')}</div>
          <div style={{ width: '100%', height: '6px', background: '#fecaca', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min((totalBelanja / paguAnggaran) * 100, 100)}%`, height: '100%', background: '#dc2626' }}></div>
          </div>
        </div>
        <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #94a3b8' }}>
          <div style={{ color: '#334155', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={16} /> Target Pagu Anggaran</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Rp {paguAnggaran.toLocaleString('id-ID')}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>Angka Keseimbangan Tetap</div>
        </div>
      </div>
      
      {/* Input Form Client Component */}
      <ApbdesForm apbdesId={apbdes.id} />

      {/* Item List: PENDAPATAN */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#166534' }}>
          <Tag size={20} /> Daftar PENDAPATAN
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Sumber Pendapatan</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Anggaran (Rp)</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {apbdes.rincian.filter(r => r.tipe === 'PENDAPATAN').map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#0f172a' }}>{item.sumberPendapatan || '-'}</td>
                  <td style={{ padding: '16px', color: '#64748b', textAlign: 'right' }}>{Number(item.anggaran).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <form action={async () => { 'use server'; await deleteRincian(item.id, apbdes.id); }}>
                      <button type="submit" style={{ padding: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item List: BELANJA (Grouped by Bidang) */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b' }}>
          <Tag size={20} /> Daftar BELANJA (Per Bidang)
        </h2>

        {Object.entries(belanjaByBidang).length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>Belum ada rincian belanja.</p>
        ) : (
          Object.entries(belanjaByBidang).map(([bidang, items]) => {
            const totalPerBidang = items.reduce((sum, item) => sum + Number(item.anggaran), 0);
            const percentage = totalBelanja > 0 ? ((totalPerBidang / totalBelanja) * 100).toFixed(2) : '0.00';

            return (
              <div key={bidang} style={{ marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#f8fafc', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{bidang}</h3>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total: Rp {totalPerBidang.toLocaleString('id-ID')}</div>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, marginTop: '2px' }}>{percentage}% dari Total Belanja</div>
                  </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Detail Kegiatan</th>
                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Sumber Dana</th>
                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>Volume</th>
                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Anggaran (Rp)</th>
                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600, textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{item.namaKegiatan || '-'}</td>
                          <td style={{ padding: '12px 16px', color: '#0ea5e9', fontWeight: 600 }}>{item.sumberDana || '-'}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b' }}>{item.volume} {item.satuan}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b', textAlign: 'right' }}>{Number(item.anggaran).toLocaleString('id-ID')}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <form action={async () => { 'use server'; await deleteRincian(item.id, apbdes.id); }}>
                              <button type="submit" style={{ padding: '6px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
