'use client';

import { useState, useEffect } from 'react';
import { getBansos, addBansos, updateBansos, deleteBansos } from '@/server/actions/bansos.action';
import { Edit2, Trash2, Plus, Search, Check, X } from 'lucide-react';
import styles from '../Admin.module.css';

type BansosItem = {
  id: string;
  nik: string;
  nama: string;
  jenisBantuan: string;
  status: string;
  keterangan: string | null;
};

export default function BansosAdminPage() {
  const [items, setItems] = useState<BansosItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    jenisBantuan: 'PKH',
    status: 'AKTIF',
    keterangan: ''
  });

  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await getBansos();
    setItems(data as BansosItem[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenForm = (item?: BansosItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        nik: item.nik,
        nama: item.nama,
        jenisBantuan: item.jenisBantuan,
        status: item.status,
        keterangan: item.keterangan || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        nik: '',
        nama: '',
        jenisBantuan: 'PKH',
        status: 'AKTIF',
        keterangan: ''
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
      await updateBansos(editingId, formData);
    } else {
      await addBansos(formData);
    }
    handleCloseForm();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus data bansos ini?')) {
      await deleteBansos(id);
      loadData();
    }
  };

  const filteredItems = items.filter(item => 
    item.nik.includes(search) || item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminHeader}>
        <div className={styles.headerTitle}>
          <h2>Data Bantuan Sosial (Bansos)</h2>
          <p>Kelola data penerima bantuan sosial untuk pencarian warga.</p>
        </div>
        <button onClick={() => handleOpenForm()} className={styles.primaryBtn}>
          <Plus size={18} /> Tambah Data
        </button>
      </div>

      <div className={styles.card}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
          <Search size={20} color="#64748b" />
          <input 
            type="text" 
            placeholder="Cari NIK atau Nama..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
          />
        </div>
        
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Memuat data...</div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>NIK</th>
                  <th>Nama Penerima</th>
                  <th>Jenis Bantuan</th>
                  <th>Status</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Belum ada data bansos.</td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '500' }}>{item.nik}</td>
                      <td>{item.nama}</td>
                      <td>
                        <span style={{ 
                          background: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '500'
                        }}>
                          {item.jenisBantuan}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          background: item.status === 'AKTIF' ? '#dcfce7' : '#fee2e2',
                          color: item.status === 'AKTIF' ? '#16a34a' : '#ef4444',
                          padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '600'
                        }}>
                          {item.status === 'AKTIF' ? <Check size={14} /> : <X size={14} />}
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

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <div className={styles.modalHeader}>
              <h3>{editingId ? 'Edit Data Bansos' : 'Tambah Data Bansos'}</h3>
              <button onClick={handleCloseForm} className={styles.closeBtn}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalBody}>
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
                <label>Nama Penerima</label>
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
                  <label>Jenis Bantuan</label>
                  <select 
                    value={formData.jenisBantuan} 
                    onChange={(e) => setFormData({...formData, jenisBantuan: e.target.value})} 
                    className={styles.input}
                  >
                    <option value="PKH">PKH</option>
                    <option value="BLT Dana Desa">BLT Dana Desa</option>
                    <option value="BPNT">BPNT</option>
                    <option value="Bedah Rumah">Bedah Rumah</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Status Bantuan</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})} 
                    className={styles.input}
                  >
                    <option value="AKTIF">AKTIF</option>
                    <option value="SELESAI">SELESAI</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Keterangan Tambahan (Opsional)</label>
                <textarea 
                  value={formData.keterangan} 
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})} 
                  className={styles.textarea} 
                  rows={3}
                ></textarea>
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
