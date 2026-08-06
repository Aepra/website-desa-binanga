'use client';

import { useState } from 'react';
import { UserPlus, Trash2, ShieldCheck, Mail, User as UserIcon, Search, AlertCircle, X, Loader2 } from 'lucide-react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { createAdminUser, deleteAdminUser } from '@/server/actions/admin-user.action';
import styles from '../Admin.module.css';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  role: string;
  createdAt: Date;
}

export default function KelolaAdminClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u.username && u.username.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleAddAdmin(formData: FormData) {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await createAdminUser(formData);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccessMsg('Admin baru berhasil ditambahkan!');
      setShowModal(false);
      setLoading(false);
      window.location.reload();
    }
  }

  async function handleDelete(id: string, email?: string | null, name?: string) {
    if (!confirm(`Apakah Anda yakin ingin menghapus akses admin untuk ${name} (${email || ''})?`)) {
      return;
    }

    const res = await deleteAdminUser(id);
    if (res.error) {
      alert(res.error);
    } else {
      setUsers(users.filter(u => u.id !== id));
    }
  }

  return (
    <div className={styles.adminPage}>
      {/* HEADER */}
      <div className={styles.adminHeader}>
        <div className={styles.headerTitle}>
          <h2>Manajemen Admin & Pengguna</h2>
          <p>Kelola daftar pengelola website desa dan berikan akses login via Google.</p>
        </div>

        <button 
          onClick={() => { setShowModal(true); setError(''); }} 
          className={styles.primaryBtn}
          style={{ background: '#10b981' }}
        >
          <UserPlus size={16} /> + Tambah Admin Baru
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '10px 14px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
          {successMsg}
        </div>
      )}

      {/* FILTER SEARCH BAR */}
      <div className={styles.card} style={{ padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={16} color="#64748b" />
        <input 
          type="text" 
          placeholder="Cari berdasarkan nama atau email admin..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
          style={{ border: 'none', background: 'transparent', padding: 0 }}
        />
      </div>

      {/* TABLE */}
      <div className={styles.card}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pengelola</th>
                <th>Email Google Authorized</th>
                <th>Role / Hak Akses</th>
                <th>Tanggal Terdaftar</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                      <Mail size={14} color="#64748b" />
                      <span>{user.email || 'Belum diatur'}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', 
                      fontSize: '0.75rem', fontWeight: 700, 
                      background: user.role === 'SUPER_ADMIN' ? '#dbeafe' : '#f1f5f9',
                      color: user.role === 'SUPER_ADMIN' ? '#1d4ed8' : '#475569'
                    }}>
                      {user.role === 'SUPER_ADMIN' && <ShieldCheck size={12} />}
                      {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Staff'}
                    </span>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {user.role !== 'SUPER_ADMIN' ? (
                      <button 
                        onClick={() => handleDelete(user.id, user.email, user.name)} 
                        className={`${styles.iconBtn} ${styles.danger}`}
                        title="Hapus Akses Admin"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>Utama</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Tidak ada data admin yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH ADMIN */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} color="#10b981" /> Tambah Admin Baru
              </h3>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <form action={handleAddAdmin}>
              <div className={styles.modalBody}>
                {error && (
                  <div style={{ padding: '10px', background: '#fef2f2', color: '#ef4444', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Nama Lengkap Admin</label>
                  <input type="text" name="name" required placeholder="Contoh: Keisya Aulia" className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <label>Email Google Resmi (Gmail)</label>
                  <input type="email" name="email" required placeholder="Contoh: staf.binanga@gmail.com" className={styles.input} />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', margin: 0 }}>
                    *Email ini akan diizinkan untuk login ke dashboard via Google Sign-In.
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label>Role / Jabatan Akses</label>
                  <select name="role" className={styles.input}>
                    <option value="ADMIN">Admin Staff</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }} disabled={loading}>
                  Batal
                </button>
                <button type="submit" disabled={loading} className={styles.primaryBtn} style={{ background: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  {loading ? 'Menyimpan...' : 'Simpan Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <LoadingOverlay show={loading} />
    </div>
  );
}
