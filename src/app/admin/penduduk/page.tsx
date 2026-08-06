'use client';

import { useState, useEffect, useRef } from 'react';
import { getSemuaPenduduk, addPenduduk, updatePenduduk, deletePenduduk, importPendudukBatch, PendudukData } from '@/server/actions/penduduk.action';
import * as XLSX from 'xlsx';
import { Edit2, Trash2, Plus, Search, Check, X, FileText, Download, Loader2 } from 'lucide-react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
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
  const [formError, setFormError] = useState<string | null>(null);

  // Excel Import States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importData, setImportData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    try {
      let res;
      if (editingId) {
        res = await updatePenduduk(editingId, formData);
      } else {
        res = await addPenduduk(formData);
      }
      
      if (res && res.success === false) {
        setFormError(res.error || 'Terjadi kesalahan');
      } else {
        handleCloseForm();
        await loadData();
      }
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

  const REQUIRED_COLUMNS = [
    'NIK', 'No KK', 'Nama Lengkap', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir',
    'Agama', 'Pendidikan Terakhir', 'Pekerjaan Utama', 'Golongan Darah',
    'Status Perkawinan', 'SHDK', 'Dusun Domisili', 'Status Kependudukan'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportErrors([]);
    setImportData([]);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        if (data.length === 0) {
          setImportErrors(['File Excel kosong.']);
          return;
        }

        const headers = (data[0] || []).map((h: any) => h?.toString().trim());
        const errors: string[] = [];

        // Cek jumlah kolom
        if (headers.length < REQUIRED_COLUMNS.length) {
          errors.push(`Jumlah kolom kurang. Diharapkan ${REQUIRED_COLUMNS.length} kolom, tetapi hanya ada ${headers.length}.`);
        } else if (headers.length > REQUIRED_COLUMNS.length) {
          errors.push(`Jumlah kolom berlebih. Diharapkan ${REQUIRED_COLUMNS.length} kolom, tetapi ada ${headers.length}.`);
        }

        // Cek nama kolom (case-insensitive & exact match checks)
        const missingCols = REQUIRED_COLUMNS.filter(req => !headers.includes(req));
        if (missingCols.length > 0) {
          errors.push(`Kolom yang hilang / salah nama: ${missingCols.join(', ')}`);
        }
        
        const extraCols = headers.filter(h => !REQUIRED_COLUMNS.includes(h));
        if (extraCols.length > 0 && headers.length >= REQUIRED_COLUMNS.length) {
          errors.push(`Kolom tidak dikenal: ${extraCols.join(', ')}`);
        }

        if (errors.length > 0) {
          setImportErrors(errors);
        } else {
          // Parse as objects
          const jsonData = XLSX.utils.sheet_to_json(ws);
          setImportData(jsonData);
        }
      } catch (error) {
        setImportErrors(['Gagal membaca file Excel. Pastikan formatnya benar (.xlsx atau .csv).']);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImportSubmit = async () => {
    if (importData.length === 0) return;
    setIsImporting(true);
    try {
      const plainData = JSON.parse(JSON.stringify(importData));
      const res = await importPendudukBatch(plainData, filterTahun);
      if (res.success) {
        setIsImportModalOpen(false);
        setImportData([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await loadData();
        alert(`Berhasil mengimpor ${res.count} data penduduk.`);
      } else {
        const errorList = res.duplicates && res.duplicates.length > 0 
          ? [`${res.error}`, `NIK Duplikat: ${res.duplicates.join(', ')}`] 
          : [res.error || 'Terjadi kesalahan validasi di server.'];
        setImportErrors(errorList);
      }
    } catch (error) {
      setImportErrors(['Terjadi kesalahan sistem saat menyimpan data ke database.']);
    } finally {
      setIsImporting(false);
    }
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
          <button 
            className={styles.btnSecondary} 
            onClick={() => setIsImportModalOpen(true)}
            style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <Download size={18} /> Import Excel
          </button>
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
              <h2 className={styles.modalTitle}>{editingId ? 'Edit Data Penduduk' : 'Tambah Penduduk Baru'}</h2>
              <button className={styles.modalClose} onClick={handleCloseForm}><X size={24} /></button>
            </div>
            
            {formError && (
              <div style={{ margin: '20px 24px 0', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={16} /> {formError}
              </div>
            )}

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

      {isImportModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Import Data Penduduk</h2>
              <button className={styles.closeBtn} onClick={() => { setIsImportModalOpen(false); setImportErrors([]); setImportData([]); }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
                Unggah file Excel (.xlsx atau .csv) yang berisi data penduduk. <strong>Format kolom harus sama persis</strong> dengan standar sistem.
              </p>
              
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#0f172a' }}>Daftar Kolom Wajib:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {REQUIRED_COLUMNS.map(col => (
                    <span key={col} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#334155' }}>
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileUpload} 
                  ref={fileInputRef}
                  style={{ display: 'block', width: '100%', padding: '10px', border: '1px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}
                />
              </div>

              {importErrors.length > 0 && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  <h4 style={{ color: '#dc2626', margin: '0 0 8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <X size={16} /> Gagal Membaca File
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#b91c1c', fontSize: '0.85rem' }}>
                    {importErrors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}

              {importData.length > 0 && importErrors.length === 0 && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Check size={24} color="#16a34a" />
                  <div>
                    <h4 style={{ color: '#166534', margin: 0, fontSize: '0.95rem' }}>File Valid!</h4>
                    <p style={{ color: '#15803d', margin: '4px 0 0', fontSize: '0.85rem' }}>Ditemukan {importData.length} baris data yang siap diunggah.</p>
                  </div>
                </div>
              )}

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => { setIsImportModalOpen(false); setImportErrors([]); setImportData([]); }} disabled={isImporting}>Batal</button>
                <button 
                  type="button" 
                  className={styles.btnPrimary} 
                  disabled={importData.length === 0 || importErrors.length > 0 || isImporting}
                  onClick={handleImportSubmit}
                >
                  {isImporting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={18} />}
                  {isImporting ? 'Menyimpan Data...' : 'Upload & Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoadingOverlay show={isSaving || isImporting} />
    </div>
  );
}
