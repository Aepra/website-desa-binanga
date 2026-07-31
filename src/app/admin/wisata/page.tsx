
import { getWisata, createWisata } from '@/server/actions/wisata.action';
import SubmitButton from '@/components/SubmitButton';
import WisataTable from './WisataTable';

export default async function WisataPage() {
  const data = await getWisata();

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>Manajemen Wisata & Potensi Desa</h1>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <details style={{ flex: 1, background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <summary style={{ padding: '24px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', listStyle: 'none', outline: 'none', color: '#10b981' }}>
            + Tambah Destinasi Wisata
          </summary>
          <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <form action={createWisata} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Item / Wisata / Potensi</label>
                <input type="text" name="nama" required placeholder="Contoh: Pantai Binanga / Kerajinan Tenun" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tipe Data</label>
                <select name="tipe" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
                  <option value="WISATA">🏖️ Destinasi Wisata</option>
                  <option value="POTENSI">🌾 Potensi Unggulan Desa</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kategori Wisata / Potensi</label>
                <select name="kategori" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>
                  <option value="">-- Pilih Kategori --</option>
                  <optgroup label="Destinasi Wisata">
                    <option value="Wisata Alam">Wisata Alam</option>
                    <option value="Wisata Budaya">Wisata Budaya</option>
                    <option value="Wisata Edukasi">Wisata Edukasi</option>
                    <option value="Wisata Religi">Wisata Religi</option>
                    <option value="Wisata Kuliner">Wisata Kuliner</option>
                    <option value="Wisata Buatan">Wisata Buatan</option>
                  </optgroup>
                  <optgroup label="Potensi Unggulan Desa">
                    <option value="Sumber Daya Alam">Sumber Daya Alam</option>
                    <option value="Industri Rumahan">Industri Rumahan</option>
                    <option value="Kerajinan / Kesenian">Kerajinan / Kesenian</option>
                    <option value="Potensi Pertanian">Potensi Pertanian</option>
                    <option value="Potensi Peternakan">Potensi Peternakan</option>
                    <option value="Potensi Perikanan">Potensi Perikanan</option>
                    <option value="Potensi Agrowisata">Potensi Agrowisata</option>
                    <option value="Lainnya">Lainnya</option>
                  </optgroup>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Deskripsi</label>
                <textarea name="deskripsi" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Foto</label>
                <input type="file" name="foto" accept="image/*" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Link Google Maps (Opsional)</label>
                <input type="url" name="linkMaps" placeholder="https://maps.google.com/..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Jam Operasional (Opsional)</label>
                <input type="text" name="jamBuka" placeholder="08:00 - 17:00 / 24 Jam" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <SubmitButton label="Simpan Wisata" style={{ marginTop: '8px', background: '#10b981' }} />
            </form>
          </div>
        </details>

        <details style={{ flex: 1, background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <summary style={{ padding: '24px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', listStyle: 'none', outline: 'none', color: '#f59e0b' }}>
            + Tambah Potensi Desa
          </summary>
          <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <form action={createWisata} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nama Potensi</label>
                <input type="text" name="nama" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Kategori Potensi</label>
                <select name="kategori" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>
                  <option value="">-- Pilih Kategori --</option>
                  <option value="Potensi Pertanian">Potensi Pertanian</option>
                  <option value="Potensi Peternakan">Potensi Peternakan</option>
                  <option value="Potensi Perikanan">Potensi Perikanan</option>
                  <option value="Potensi Wisata">Potensi Wisata</option>
                  <option value="Kerajinan / Kesenian">Kerajinan / Kesenian</option>
                  <option value="Sumber Daya Alam">Sumber Daya Alam</option>
                  <option value="Industri Rumahan">Industri Rumahan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Deskripsi</label>
                <textarea name="deskripsi" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Foto</label>
                <input type="file" name="foto" accept="image/*" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Link Google Maps (Opsional)</label>
                <input type="url" name="linkMaps" placeholder="https://maps.google.com/..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Jam Operasional (Opsional)</label>
                <input type="text" name="jamBuka" placeholder="08:00 - 17:00 / 24 Jam" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <SubmitButton label="Simpan Potensi" style={{ marginTop: '8px', background: '#f59e0b' }} />
            </form>
          </div>
        </details>
      </div>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Daftar Destinasi Wisata & Potensi</h2>
        <WisataTable data={data} />
      </div>
    </div>
  );
}
