'use client';

import { useState, useEffect } from 'react';
import { getSemuaPenduduk, addPenduduk, updatePenduduk, deletePenduduk } from './actions';
import { Edit2, Trash2, Plus, Search, Check, X, FileText, Download } from 'lucide-react';
import styles from '../Admin.module.css';

type PendudukItem = {
  id: string;
  nik: string;
  noKk: string;
  nama: string;
  jenisKelamin: string;
  dusun: string;
  tahunData: number;
  pendidikan: string | null;
  pekerjaan: string | null;
  status: string;
};

export default function PendudukAdminPage() {
  const [items, setItems] = useState<PendudukItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [filterTahun, setFilterTahun] = useState<number>(new Date().getFullYear());
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nik: '',
    noKk: '',
    nama: '',
    jenisKelamin: 'LAKI_LAKI',
    dusun: 'Naulluyo',
    tahunData: new Date().getFullYear(),
    pendidikan: '',
    pekerjaan: '',
    status: 'AKTIF'
  });

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
        nik: item.nik,
        noKk: item.noKk,
        nama: item.nama,
        jenisKelamin: item.jenisKelamin,
        dusun: item.dusun,
        tahunData: item.tahunData,
        pendidikan: item.pendidikan || '',
        pekerjaan: item.pekerjaan || '',
        status: item.status
      });
    } else {
      setEditingId(null);
      setFormData({
        nik: '',
        noKk: '',
        nama: '',
        jenisKelamin: 'LAKI_LAKI',
        dusun: 'Naulluyo',
        tahunData: filterTahun,
        pendidikan: '',
        pekerjaan: '',
        status: 'AKTIF'
      });
    }
    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updatePenduduk(editingId, formData);
    } else {
      await addPenduduk(formData);
    }
    handleCloseForm();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus data penduduk ini? (Tindakan ini akan mempengaruhi total statistik)')) {
      await deletePenduduk(id);
      loadData();
    }
  };

  const filteredItems = items.filter(item => 
    item.nik.includes(search) || 
    item.nama.toLowerCase().includes(search.toLowerCase()) || 
    item.noKk.includes(search)
  );

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminHeader}>
        <div className={styles.headerTitle}>
          <h2>Database Penduduk ({filterTahun})</h2>
          <p>Data individual warga yang menjadi sumber kalkulasi total statistik demografi desa.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={filterTahun} 
            onChange={(e) => setFilterTahun(Number(e.target.value))}
            className={styles.input}
            style={{ padding: '8px 16px', width: 'auto' }}
          >
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>Tahun {year}</option>;
            })}
          </select>
          <button onClick={() => handleOpenForm()} className={styles.primaryBtn}>
            <Plus size={18} /> Tambah Warga
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
          <Search size={20} color="#64748b" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan NIK, No. KK, atau Nama Warga..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
          />
        </div>
        
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Memuat data penduduk...</div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>NIK / KK</th>
                  <th>Nama Lengkap</th>
                  <th>L/P</th>
                  <th>Dusun</th>
                  <th>Status</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      Belum ada data penduduk yang tersimpan untuk tahun {filterTahun}.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{item.nik}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>KK: {item.noKk}</div>
                      </td>
                      <td style={{ fontWeight: '500', color: '#1e3a8a' }}>{item.nama}</td>
                      <td>{item.jenisKelamin === 'LAKI_LAKI' ? 'L' : 'P'}</td>
                      <td>{item.dusun}</td>
                      <td>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          background: item.status === 'AKTIF' ? '#dcfce7' : (item.status === 'PINDAH' ? '#fef3c7' : '#fee2e2'),
                          color: item.status === 'AKTIF' ? '#16a34a' : (item.status === 'PINDAH' ? '#d97706' : '#ef4444'),
                          padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button onClick={() => handleOpenForm(item)} className={styles.iconBtn} title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className={`${styles.iconBtn} ${styles.danger}`} title="Hapus">
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

      {/* FOOTER STATISTIK */}
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className={styles.card} style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Penduduk</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{items.length}</div>
        </div>
        <div className={styles.card} style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total KK</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{new Set(items.map(i => i.noKk)).size}</div>
        </div>
        <div className={styles.card} style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Laki-laki</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{items.filter(i => i.jenisKelamin === 'LAKI_LAKI').length}</div>
        </div>
        <div className={styles.card} style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Perempuan</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{items.filter(i => i.jenisKelamin === 'PEREMPUAN').length}</div>
        </div>
      </div>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
            <div className={styles.modalHeader}>
              <h3>{editingId ? 'Edit Data Penduduk' : 'Tambah Data Penduduk Baru'}</h3>
              <button onClick={handleCloseForm} className={styles.closeBtn}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nomor Induk Kependudukan (NIK)</label>
                  <input 
                    type="text" 
                    value={formData.nik} 
                    onChange={(e) => setFormData({...formData, nik: e.target.value})} 
                    className={styles.input} 
                    required 
                    minLength={16}
                    maxLength={16}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Nomor Kartu Keluarga (KK)</label>
                  <input 
                    type="text" 
                    value={formData.noKk} 
                    onChange={(e) => setFormData({...formData, noKk: e.target.value})} 
                    className={styles.input} 
                    required 
                    minLength={16}
                    maxLength={16}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.nama} 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})} 
                  className={styles.input} 
                  required 
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Jenis Kelamin</label>
                  <select 
                    value={formData.jenisKelamin} 
                    onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value})} 
                    className={styles.input}
                  >
                    <option value="LAKI_LAKI">Laki-Laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Dusun (Pilih/Ketik Baru)</label>
                  <input 
                    type="text" 
                    value={formData.dusun} 
                    onChange={(e) => setFormData({...formData, dusun: e.target.value})} 
                    className={styles.input} 
                    list="dusun-list"
                    required 
                  />
                  <datalist id="dusun-list">
                    <option value="Naulluyo" />
                    <option value="Butungan" />
                    <option value="Binanga" />
                    <option value="Bo'di" />
                  </datalist>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Pendidikan Terakhir</label>
                  <input 
                    type="text" 
                    value={formData.pendidikan} 
                    onChange={(e) => setFormData({...formData, pendidikan: e.target.value})} 
                    className={styles.input} 
                    placeholder="Contoh: SMA/Sederajat"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Pekerjaan</label>
                  <input 
                    type="text" 
                    value={formData.pekerjaan} 
                    onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})} 
                    className={styles.input} 
                    placeholder="Contoh: Petani/Pekebun"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Status Kependudukan</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})} 
                    className={styles.input}
                  >
                    <option value="AKTIF">Aktif / Menetap</option>
                    <option value="PINDAH">Pindah Domisili</option>
                    <option value="MENINGGAL">Meninggal Dunia</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Tahun Sensus</label>
                  <input 
                    type="number" 
                    value={formData.tahunData} 
                    onChange={(e) => setFormData({...formData, tahunData: Number(e.target.value)})} 
                    className={styles.input} 
                    readOnly
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={handleCloseForm} className={styles.outlineBtn}>Batal</button>
                <button type="submit" className={styles.primaryBtn}>Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
