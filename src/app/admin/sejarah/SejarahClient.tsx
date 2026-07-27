'use client';

import React, { useState } from 'react';
import { createSejarah, updateSejarah, deleteSejarah } from './actions';
import { Plus, Edit2, Trash2, Save, X, BookOpen } from 'lucide-react';

export default function SejarahClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (item: any) => {
    setIsEditing(item.id);
    setEditForm(item);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    const res = await updateSejarah(id, {
      tahun: editForm.tahun,
      judul: editForm.judul,
      cerita: editForm.cerita,
      tipe: editForm.tipe,
      order: parseInt(editForm.order) || 0,
    });
    
    if (res.success) {
      setData(prev => prev.map(d => d.id === id ? res.data : d));
      setIsEditing(null);
    } else {
      alert(res.error);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    const res = await deleteSejarah(id);
    if (res.success) {
      setData(prev => prev.filter(d => d.id !== id));
    } else {
      alert(res.error);
    }
  };

  const handleAdd = async () => {
    const newEntry = {
      tahun: new Date().getFullYear().toString(),
      judul: 'Kejadian Baru',
      cerita: 'Deskripsi kejadian...',
      tipe: 'info',
      order: data.length + 1
    };
    
    const res = await createSejarah(newEntry);
    if (res.success) {
      setData([...data, res.data]);
      handleEdit(res.data);
    }
  };

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>Sejarah Desa</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Kelola kronologi sejarah dan peristiwa penting di desa.</p>
        </div>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> Tambah Sejarah
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '16px', color: '#0f172a', width: '80px' }}>Order</th>
              <th style={{ padding: '16px', color: '#0f172a', width: '120px' }}>Tahun</th>
              <th style={{ padding: '16px', color: '#0f172a', width: '200px' }}>Judul</th>
              <th style={{ padding: '16px', color: '#0f172a' }}>Cerita</th>
              <th style={{ padding: '16px', color: '#0f172a', width: '120px' }}>Tipe</th>
              <th style={{ padding: '16px', color: '#0f172a', textAlign: 'center', width: '150px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {isEditing === item.id ? (
                  <>
                    <td style={{ padding: '16px' }}>
                      <input type="number" value={editForm.order} onChange={e => setEditForm({...editForm, order: e.target.value})} style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input value={editForm.tahun} onChange={e => setEditForm({...editForm, tahun: e.target.value})} style={{ width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input value={editForm.judul} onChange={e => setEditForm({...editForm, judul: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <textarea value={editForm.cerita} onChange={e => setEditForm({...editForm, cerita: e.target.value})} rows={3} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <select value={editForm.tipe} onChange={e => setEditForm({...editForm, tipe: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}>
                        <option value="info">Info</option>
                        <option value="pembangunan">Pembangunan</option>
                        <option value="administrasi">Administrasi</option>
                        <option value="bencana">Bencana</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleSave(item.id)} disabled={isSaving} style={{ padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Save size={16} /></button>
                        <button onClick={handleCancel} style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><X size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>{item.order}</td>
                    <td style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>{item.tahun}</td>
                    <td style={{ padding: '16px', color: '#0f172a', fontWeight: 600 }}>{item.judul}</td>
                    <td style={{ padding: '16px', color: '#475569', fontSize: '0.9rem' }}>{item.cerita}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, background: item.tipe === 'bencana' ? '#fee2e2' : item.tipe === 'pembangunan' ? '#d1fae5' : item.tipe === 'administrasi' ? '#dbeafe' : '#f3e8ff', color: item.tipe === 'bencana' ? '#ef4444' : item.tipe === 'pembangunan' ? '#10b981' : item.tipe === 'administrasi' ? '#3b82f6' : '#8b5cf6' }}>
                        {item.tipe}
                      </span>
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
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  Belum ada data sejarah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
