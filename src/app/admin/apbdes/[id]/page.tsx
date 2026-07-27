import { getApbdesById, createRincian, deleteRincian } from '../actions';
import SubmitButton from '@/components/SubmitButton';
import { ArrowLeft, PlusCircle, Trash2, Tag, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import Link from 'next/link';

export default async function ApbdesDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const apbdes = await getApbdesById(resolvedParams.id);

  if (!apbdes) {
    return <div>Data APBDes tidak ditemukan.</div>;
  }

  // Calculate Totals
  const totalPendapatan = apbdes.rincian.filter(r => r.tipe === 'PENDAPATAN').reduce((acc, curr) => acc + curr.anggaran, 0n);
  const totalBelanja = apbdes.rincian.filter(r => r.tipe === 'BELANJA').reduce((acc, curr) => acc + curr.anggaran, 0n);
  const totalPembiayaan = apbdes.rincian.filter(r => r.tipe === 'PEMBIAYAAN').reduce((acc, curr) => acc + curr.anggaran, 0n);

  return (
    <div>
      <Link href="/admin/apbdes" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '16px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Kembali ke Daftar Tahun
      </Link>
      
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Rincian APBDes Tahun {apbdes.tahun}</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Tambahkan item-item rincian Pendapatan, Belanja, dan Pembiayaan untuk tahun ini.</p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#dcfce7', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
          <div style={{ color: '#166534', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowDownRight size={16} /> Total Pendapatan</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532d' }}>Rp {totalPendapatan.toLocaleString('id-ID')}</div>
        </div>
        <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ color: '#991b1b', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={16} /> Total Belanja</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7f1d1d' }}>Rp {totalBelanja.toLocaleString('id-ID')}</div>
        </div>
        <div style={{ background: '#e0e7ff', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ color: '#3730a3', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={16} /> Total Pembiayaan</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#312e81' }}>Rp {totalPembiayaan.toLocaleString('id-ID')}</div>
        </div>
      </div>
      
      {/* Input Form */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <PlusCircle size={20} className="text-blue-500" /> Tambah Item Rincian
        </h2>
        
        <form action={async (formData) => { 'use server'; await createRincian(apbdes.id, formData); }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Tipe Anggaran</label>
            <select name="tipe" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
              <option value="PENDAPATAN">Pendapatan (Pemasukan)</option>
              <option value="BELANJA">Belanja (Pengeluaran)</option>
              <option value="PEMBIAYAAN">Pembiayaan (SILPA/Penyertaan Modal)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Kategori / Nama Item</label>
            <input type="text" name="kategori" required placeholder="Cth: Dana Desa / Pembangunan" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Target Anggaran (Rp)</label>
            <input type="number" name="anggaran" required placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Realisasi Saat Ini (Rp)</label>
            <input type="number" name="realisasi" required placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <SubmitButton label="Tambahkan Item" />
          </div>
        </form>
      </div>

      {/* Item List */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <Tag size={20} className="text-slate-500" /> Daftar Rincian yang Disimpan
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Tipe</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Nama Item / Kategori</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Target Anggaran</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>Realisasi</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, textAlign: 'center' }}>%</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 600, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {apbdes.rincian.map(item => {
                const percent = Number(item.anggaran) > 0 ? Math.round((Number(item.realisasi) / Number(item.anggaran)) * 100) : 0;
                let typeColor = '#cbd5e1';
                let typeBg = '#f1f5f9';
                if (item.tipe === 'PENDAPATAN') { typeColor = '#166534'; typeBg = '#dcfce7'; }
                if (item.tipe === 'BELANJA') { typeColor = '#991b1b'; typeBg = '#fee2e2'; }
                if (item.tipe === 'PEMBIAYAAN') { typeColor = '#3730a3'; typeBg = '#e0e7ff'; }

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: typeBg, color: typeColor, padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {item.tipe}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#0f172a' }}>
                      {item.kategori}
                    </td>
                    <td style={{ padding: '16px', color: '#64748b' }}>
                      Rp {item.anggaran.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>
                      Rp {item.realisasi.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, color: percent >= 100 ? '#10b981' : percent > 50 ? '#f59e0b' : '#ef4444' }}>
                        {percent}%
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <form action={async () => { 'use server'; await deleteRincian(item.id, apbdes.id); }}>
                        <button type="submit" style={{ padding: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {apbdes.rincian.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Belum ada rincian item. Silakan tambahkan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
