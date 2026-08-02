'use client';

import { useState, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import { createRincian } from '@/server/actions/apbdes.action';
import SubmitButton from '@/components/SubmitButton';

export default function ApbdesForm({ apbdesId }: { apbdesId: string }) {
  const [tipe, setTipe] = useState('PENDAPATAN');
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
        <PlusCircle size={20} className="text-blue-500" /> Tambah Item Rincian
      </h2>
      
      <form ref={formRef} action={async (formData) => {
        await createRincian(apbdesId, formData);
        formRef.current?.reset();
      }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* FIELD UTAMA */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Kategori Anggaran</label>
          <select 
            name="tipe" 
            value={tipe} 
            onChange={(e) => setTipe(e.target.value)}
            required 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}
          >
            <option value="PENDAPATAN">Pendapatan</option>
            <option value="BELANJA">Belanja</option>
          </select>
        </div>

        {/* JIKA PENDAPATAN */}
        {tipe === 'PENDAPATAN' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Sumber Pendapatan</label>
              <select name="sumberPendapatan" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                <option value="">-- Pilih Sumber --</option>
                <option value="Dana Desa">Dana Desa</option>
                <option value="Alokasi Dana Desa (ADD)">Alokasi Dana Desa (ADD)</option>
                <option value="BKK Provinsi">BKK Provinsi</option>
                <option value="Pendapatan Lain-Lain">Pendapatan Lain-Lain</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Nominal (Rp)</label>
              <input type="number" name="anggaran" required placeholder="Cth: 245577000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
          </div>
        )}

        {/* JIKA BELANJA */}
        {tipe === 'BELANJA' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Bidang Belanja (Level 1)</label>
              <select name="bidang" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                <option value="">-- Pilih Bidang --</option>
                <option value="I. Penyelenggaraan Pemerintahan Desa">I. Penyelenggaraan Pemerintahan Desa</option>
                <option value="II. Pelaksanaan Pembangunan Desa">II. Pelaksanaan Pembangunan Desa</option>
                <option value="III. Pembinaan Kemasyarakatan">III. Pembinaan Kemasyarakatan</option>
                <option value="IV. Pemberdayaan Masyarakat">IV. Pemberdayaan Masyarakat</option>
                <option value="V. Penanggulangan Bencana, Darurat dan Mendesak Desa">V. Penanggulangan Bencana, Darurat dan Mendesak Desa</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Sumber Dana / Kode (Level 2)</label>
              <select name="sumberDana" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                <option value="">-- Pilih Sumber Dana --</option>
                <option value="DDS (Dana Desa)">DDS (Dana Desa)</option>
                <option value="ADD (Alokasi Dana Desa)">ADD (Alokasi Dana Desa)</option>
                <option value="ADD/DLL / DLL (Dana Lain-Lain)">ADD/DLL / DLL (Dana Lain-Lain)</option>
                <option value="PBP / PB (Bantuan Keuangan Provinsi / Bagi Hasil)">PBP / PB (Bantuan Keuangan Provinsi / Bagi Hasil)</option>
                <option value="ADD/PBP (Kombinasi)">ADD/PBP (Kombinasi)</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Detail Kegiatan (Level 3)</label>
              <input type="text" name="namaKegiatan" required placeholder="Cth: Penghasilan Tetap dan Tunjangan Kepala Desa dan Perangkat Desa" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Volume</label>
              <input type="number" name="volume" required placeholder="Cth: 12" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Satuan</label>
              <select name="satuan" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                <option value="Bulan">Bulan</option>
                <option value="Ls">Ls (Lembar / Paket)</option>
                <option value="Unit">Unit</option>
                <option value="KPM">KPM</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Jumlah Anggaran (Rp)</label>
              <input type="number" name="anggaran" required placeholder="Cth: 336876720" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            
          </div>
        )}

        <div style={{ marginTop: '8px' }}>
          <SubmitButton label="Simpan Anggaran" />
        </div>
      </form>
    </div>
  );
}
