'use client';

import React, { useState } from 'react';
import { createInfrastruktur, updateInfrastruktur, deleteInfrastruktur } from '@/server/actions/infrastruktur.action';
import { Plus, Edit2, Trash2, Save, X, Building2, Loader2 } from 'lucide-react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function InfrastrukturClient({ initialData, dusunList }: { initialData: any[], dusunList: any[] }) {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (item: any) => {
    setIsEditing(item.id);
    setEditForm(item);
    setFotoFile(null);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditForm({});
    setFotoFile(null);
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append('nama', editForm.nama || '');
    formData.append('kategori', editForm.kategori || '');
    formData.append('dusun', editForm.dusun || '');
    formData.append('deskripsi', editForm.deskripsi || '');
    formData.append('fotoUrl', editForm.fotoUrl || '');
    formData.append('linkMaps', editForm.linkMaps || '');
    
    if (fotoFile) {
      formData.append('fotoFile', fotoFile);
    }

    const res = await updateInfrastruktur(id, formData);
    
    if (res.success) {
      setData(prev => prev.map(d => d.id === id ? res.data : d));
      setIsEditing(null);
    } else {
      alert(res.error);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus fasilitas ini?')) return;
    const res = await deleteInfrastruktur(id);
    if (res.success) {
      setData(prev => prev.filter(d => d.id !== id));
    } else {
      alert(res.error);
    }
  };

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append('nama', 'Fasilitas Baru');
    formData.append('kategori', 'Keperluan Umum');
    formData.append('dusun', dusunList.length > 0 ? dusunList[0].nama : 'Dusun 1');
    formData.append('deskripsi', 'Deskripsi fasilitas...');
    formData.append('fotoUrl', '');
    formData.append('linkMaps', '');
    
    const res = await createInfrastruktur(formData);
    if (res.success) {
      setData([...data, res.data]);
      handleEdit(res.data);
    }
  };

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>Infrastruktur & Fasilitas Publik</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Kelola daftar bangunan penting, sekolah, tempat ibadah, dan fasilitas lainnya.</p>
        </div>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> Tambah Fasilitas
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '16px', color: '#0f172a', width: '70px' }}>Foto</th>
              <th style={{ padding: '16px', color: '#0f172a', width: '180px' }}>Nama Fasilitas</th>
              <th style={{ padding: '16px', color: '#0f172a', width: '140px' }}>Kategori</th>
              <th style={{ padding: '16px', color: '#0f172a', width: '120px' }}>Dusun</th>
              <th style={{ padding: '16px', color: '#0f172a' }}>Deskripsi</th>
              <th style={{ padding: '16px', color: '#0f172a', width: '150px' }}>Google Maps</th>
              <th style={{ padding: '16px', color: '#0f172a', width: '130px' }}>Diperbarui</th>
              <th style={{ padding: '16px', color: '#0f172a', textAlign: 'center', width: '100px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {isEditing === item.id ? (
                  <>
                    <td style={{ padding: '16px' }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files && e.target.files.length > 0) {
                            setFotoFile(e.target.files[0]);
                          }
                        }} 
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                      />
                      {(fotoFile || editForm.fotoUrl) && (
                        <img 
                          src={fotoFile ? URL.createObjectURL(fotoFile) : editForm.fotoUrl} 
                          alt="Preview" 
                          style={{ width: '60px', height: '40px', objectFit: 'cover', marginTop: '8px', borderRadius: '4px' }} 
                        />
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <select value={editForm.kategori} onChange={e => setEditForm({...editForm, kategori: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}>
                        <option value="Pendidikan">Pendidikan</option>
                        <option value="Usaha & Ekonomi">Usaha & Ekonomi</option>
                        <option value="Wisata">Wisata</option>
                        <option value="Keperluan Umum">Keperluan Umum</option>
                        <option value="Kesehatan & Posyandu">Kesehatan & Posyandu</option>
                        <option value="Peribadatan">Peribadatan</option>
                        <option value="Pemerintahan">Pemerintahan</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <select value={editForm.dusun} onChange={e => setEditForm({...editForm, dusun: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}>
                        {dusunList.map(d => (
                          <option key={d.id} value={d.nama}>{d.nama}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <textarea value={editForm.deskripsi} maxLength={225} onChange={e => setEditForm({...editForm, deskripsi: e.target.value})} rows={3} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
                        Maks 225 karakter
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input 
                        type="text" 
                        value={editForm.linkMaps || ''} 
                        onChange={e => setEditForm({...editForm, linkMaps: e.target.value})} 
                        placeholder="Link Maps"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                      />
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.8rem', color: '#64748b' }}>
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleSave(item.id)} disabled={isSaving} style={{ padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                          {isSaving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                        </button>
                        <button onClick={handleCancel} style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><X size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '16px' }}>
                      {item.fotoUrl ? (
                        <img src={item.fotoUrl} alt={item.nama} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <div style={{ width: '60px', height: '40px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <Building2 size={16} />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px', color: '#0f172a', fontWeight: 600 }}>{item.nama}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, background: '#e0f2fe', color: '#0284c7' }}>
                        {item.kategori}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>{item.dusun}</td>
                    <td style={{ padding: '16px', color: '#475569', fontSize: '0.9rem' }}>
                      <div>{item.deskripsi}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {item.linkMaps ? (
                        <a href={item.linkMaps} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#2563eb', textDecoration: 'none', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          Lihat Maps
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.8rem', color: '#64748b' }}>
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleEdit(item)} style={{ padding: '8px', background: '#f1f5f9', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} style={{ padding: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  Belum ada data infrastruktur/fasilitas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <LoadingOverlay show={isSaving} />
    </div>
  );
}
