'use client';

import { useState, useEffect } from 'react';
import { getSemuaPenduduk, addPenduduk, updatePenduduk, deletePenduduk, PendudukData } from '@/server/actions/penduduk.action';
import { Edit2, Trash2, Plus, Search, Check, X, FileText, Download, Loader2 } from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';
import styles from './penduduk.module.css';

type PendudukItem = PendudukData & { id: string };

const AGAMA_OPTIONS = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
const PENDIDIKAN_OPTIONS = ["Tidak/Belum Sekolah", "Belum Tamat SD/Sederajat", "Tamat SD/Sederajat", "SLTP/Sederajat", "SLTA/Sederajat", "Diploma I/II", "Akademi/Diploma III/S.Muda", "Diploma IV/Strata I", "Strata II", "Strata III"];
const GOLONGAN_DARAH_OPTIONS = ["A", "B", "AB", "O", "Tidak Tahu"];
const STATUS_KAWIN_OPTIONS = ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"];
const SHDK_OPTIONS = ["Kepala Keluarga", "Istri", "Anak", "Famili Lain"];
const DUSUN_OPTIONS = ["Naulluyo", "Butungan", "Binanga", "Bo'di"];
const STATUS_KENDUDUKAN_OPTIONS = ["AKTIF", "PINDAH", "MENINGGAL"];
const PEKERJAAN_OPTIONS = ["Belum/Tidak Bekerja", "Mengurus Rumah Tangga", "Pelajar/Mahasiswa", "Pensiunan", "PNS", "TNI", "POLRI", "Petani/Pekebun", "Nelayan", "Wiraswasta", "Karyawan Swasta", "Buruh Harian Lepas", "Lainnya"];

export default function PendudukAdminPage() {
  const [items, setItems] = useState<PendudukItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Filter state
  const [filterTahun, setFilterTahun] = useState<number>(new Date().getFullYear());
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialForm: PendudukData = {
    noKk: '',
    nik: '',
    namaLengkap: '',
    jenisKelamin: 'LAKI-LAKI',
    tempatLahir: '',
    tanggalLahir: '',
    agama: 'Islam',
    pendidikanTerakhir: 'Tidak/Belum Sekolah',
    pekerjaanUtama: 'Petani/Pekebun',
    golonganDarah: 'Tidak Tahu',
    statusPerkawinan: 'Belum Kawin',
    shdk: 'Kepala Keluarga',
    dusunDomisili: 'Naulluyo',
    statusKependudukan: 'AKTIF',
    tahunData: filterTahun,
  };
  
  const [formData, setFormData] = useState<PendudukData>(initialForm);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await getSemuaPenduduk(filterTahun);
    setItems(data as PendudukItem[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filterTahun]);

  const handleOpenForm = (item?: PendudukItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        noKk: item.noKk,
        nik: item.nik,
        namaLengkap: item.namaLengkap,
        jenisKelamin: item.jenisKelamin,
        tempatLahir: item.tempatLahir,
        tanggalLahir: item.tanggalLahir,
        agama: item.agama,
        pendidikanTerakhir: item.pendidikanTerakhir,
        pekerjaanUtama: item.pekerjaanUtama,
        golonganDarah: item.golonganDarah,
        statusPerkawinan: item.statusPerkawinan,
        shdk: item.shdk,
        dusunDomisili: item.dusunDomisili,
        statusKependudukan: item.statusKependudukan,
        tahunData: item.tahunData,
      });
    } else {
      setEditingId(null);
      setFormData({ ...initialForm, tahunData: filterTahun });
    }
    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await updatePenduduk(editingId, formData);
      } else {
        await addPenduduk(formData);
      }
      handleCloseForm();
      await loadData();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data penduduk ini?')) {
      await deletePenduduk(id);
      loadData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredItems = items.filter(item => 
    item.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
    item.nik.includes(search) || 
    item.noKk.includes(search)
  );

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminHeader}>
        <div>
          <h1 className={styles.adminTitle}>Data Penduduk (Individu)</h1>
          <p className={styles.adminSubtitle}>Kelola detail data penduduk berdasarkan NIK & KK secara lengkap.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={filterTahun} 
            onChange={(e) => setFilterTahun(parseInt(e.target.value))}
            className={styles.filterSelect}
          >
            {[new Date().getFullYear() + 1, new Date().getFullYear(), new Date().getFullYear() - 1].map(y => (
              <option key={y} value={y}>Tahun {y}</option>
            ))}
          </select>
          <button className={styles.btnPrimary} onClick={() => handleOpenForm()}>
            <Plus size={18} /> Tambah Data
          </button>
        </div>
      </div>

      <div className={styles.adminContent}>
        <div className={styles.searchBar}>
          <Search size={18} color="#64748b" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan NIK, No. KK, atau Nama..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className={styles.loading}>Memuat data...</div>
        ) : (
          <div className={styles.tableContainer} style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className={styles.table} style={{ minWidth: '800px', width: '100%' }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>No. KK</th>
                  <th>NIK</th>
                  <th>Nama Lengkap</th>
                  <th>L/P</th>
                  <th>Tempat Lahir</th>
                  <th>Tgl Lahir</th>
                  <th>Agama</th>
                  <th>Pendidikan</th>
                  <th>Pekerjaan</th>
                  <th>Gol. Darah</th>
                  <th>Status Kawin</th>
                  <th>SHDK</th>
                  <th>Dusun</th>
                  <th>Status</th>
                  <th className={styles.stickyRight}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={16} style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data.</td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.noKk}</td>
                      <td>{item.nik}</td>
                      <td style={{ fontWeight: 600 }}>{item.namaLengkap}</td>
                      <td>{item.jenisKelamin === 'LAKI-LAKI' ? 'L' : 'P'}</td>
                      <td>{item.tempatLahir}</td>
                      <td>{item.tanggalLahir}</td>
                      <td>{item.agama}</td>
                      <td>{item.pendidikanTerakhir}</td>
                      <td>{item.pekerjaanUtama}</td>
                      <td>{item.golonganDarah}</td>
                      <td>{item.statusPerkawinan}</td>
                      <td>{item.shdk}</td>
                      <td>{item.dusunDomisili}</td>
                      <td>
                        <span className={`${styles.badge} ${item.statusKependudukan === 'AKTIF' ? styles.badgeSuccess : styles.badgeDanger}`}>
                          {item.statusKependudukan}
                        </span>
                      </td>
                      <td className={styles.stickyRight}>
                        <div className={styles.actionButtons}>
                          <button className={styles.btnIcon} onClick={() => handleOpenForm(item)} title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button className={`${styles.btnIcon} ${styles.btnDanger}`} onClick={() => handleDelete(item.id)} title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingId ? 'Edit Data Penduduk' : 'Tambah Data Penduduk'}</h2>
              <button className={styles.modalClose} onClick={handleCloseForm}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nomor Kartu Keluarga (No. KK) *</label>
                  <input type="text" name="noKk" className={styles.formInput} value={formData.noKk} onChange={handleChange} required maxLength={16} minLength={16} placeholder="16 digit angka" />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>NIK *</label>
                  <input type="text" name="nik" className={styles.formInput} value={formData.nik} onChange={handleChange} required maxLength={16} minLength={16} placeholder="16 digit angka" />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nama Lengkap (Sesuai KTP) *</label>
                  <input type="text" name="namaLengkap" className={styles.formInput} value={formData.namaLengkap} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Jenis Kelamin *</label>
                  <select name="jenisKelamin" className={styles.formInput} value={formData.jenisKelamin} onChange={handleChange} required>
                    <option value="LAKI-LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tempat Lahir *</label>
                  <input type="text" name="tempatLahir" className={styles.formInput} value={formData.tempatLahir} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tanggal Lahir (DD/MM/YYYY) *</label>
                  <input type="text" name="tanggalLahir" className={styles.formInput} value={formData.tanggalLahir} onChange={handleChange} required placeholder="Contoh: 17/08/1945" />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Agama *</label>
                  <select name="agama" className={styles.formInput} value={formData.agama} onChange={handleChange} required>
                    {AGAMA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Pendidikan Terakhir *</label>
                  <select name="pendidikanTerakhir" className={styles.formInput} value={formData.pendidikanTerakhir} onChange={handleChange} required>
                    {PENDIDIKAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Pekerjaan Utama *</label>
                  <select name="pekerjaanUtama" className={styles.formInput} value={formData.pekerjaanUtama} onChange={handleChange} required>
                    {PEKERJAAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Golongan Darah *</label>
                  <select name="golonganDarah" className={styles.formInput} value={formData.golonganDarah} onChange={handleChange} required>
                    {GOLONGAN_DARAH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status Perkawinan *</label>
                  <select name="statusPerkawinan" className={styles.formInput} value={formData.statusPerkawinan} onChange={handleChange} required>
                    {STATUS_KAWIN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>SHDK (Status Hub. Dalam Keluarga) *</label>
                  <select name="shdk" className={styles.formInput} value={formData.shdk} onChange={handleChange} required>
                    {SHDK_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Dusun Domisili *</label>
                  <select name="dusunDomisili" className={styles.formInput} value={formData.dusunDomisili} onChange={handleChange} required>
                    {DUSUN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status Kependudukan *</label>
                  <select name="statusKependudukan" className={styles.formInput} value={formData.statusKependudukan} onChange={handleChange} required>
                    {STATUS_KENDUDUKAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              
              <div className={styles.modalFooter} style={{ marginTop: '24px' }}>
                <button type="button" className={styles.btnSecondary} onClick={handleCloseForm} disabled={isSaving}>Batal</button>
                <button type="submit" className={styles.btnPrimary} disabled={isSaving}>
                  {isSaving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={18} />}
                  {isSaving ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <LoadingOverlay show={isSaving} />
    </div>
  );
}
