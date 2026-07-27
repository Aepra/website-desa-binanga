'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import PhotoUploader from './PhotoUploader';

interface Perangkat {
  id: string;
  nama: string;
  jabatan: string;
  kategoriJabatan: string;
  fotoUrl: string | null;
  atasanId: string | null;
}

interface OrgChartProps {
  data: Perangkat[];
  onCreate?: (formData: FormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  readOnly?: boolean;
  compact?: boolean;
  compactWithPhoto?: boolean;
}

export default function OrgChart({ data, onCreate, onDelete, readOnly = false, compact = false, compactWithPhoto = false }: OrgChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAtasan, setModalAtasan] = useState<{ id: string | null; defaultKategori: string }>({ id: null, defaultKategori: 'KADES' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleZoomReset = () => setZoom(1);

  // Hardcoded layout categories
  const kades = data.find(d => d.kategoriJabatan === 'KADES');
  const sekdes = data.filter(d => d.kategoriJabatan === 'SEKDES');
  const kaur = data.filter(d => d.kategoriJabatan === 'KAUR');
  const kasi = data.filter(d => d.kategoriJabatan === 'KASI');
  const kadus = data.filter(d => d.kategoriJabatan === 'KADUS');
  const staf = data.filter(d => d.kategoriJabatan === 'STAF');

  const getStaf = (parentId: string) => staf.filter(d => d.atasanId === parentId);

  const openModal = (atasanId: string | null, defaultKategori: string) => {
    setModalAtasan({ id: atasanId, defaultKategori });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    if (modalAtasan.id) {
      formData.append('atasanId', modalAtasan.id);
    }
    if (onCreate) await onCreate(formData);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const renderCard = (node: Perangkat, nextKategori: string, isRoot = false) => {
    return (
      <div className={`org-node ${isRoot ? 'org-root' : ''}`}>
        {node.fotoUrl ? (
          <img src={node.fotoUrl} alt={node.nama} className="org-photo" />
        ) : (
          <div className="org-photo-placeholder">Foto</div>
        )}
        <div className="org-name">{node.nama}</div>
        <div className="org-role">{node.jabatan}</div>
        
        {!readOnly && onDelete && (
          <div className="org-actions">
            <button type="button" onClick={() => onDelete(node.id)} className="danger" title="Hapus"><Trash2 size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  const renderGroupTitle = (title: string, addKategori: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', zIndex: 2, position: 'relative' }}>
      <div className="org-group-node">
        <div className="org-group-title">{title}</div>
      </div>
    </div>
  );

  return (
    <div className={`org-wrapper ${compact || compactWithPhoto ? 'org-compact-mode' : ''} ${compactWithPhoto ? 'org-compact-photo' : ''}`}>
      <style>{`
        .org-wrapper {
          position: relative;
          width: 100%;
          background: transparent;
        }
        .org-canvas-container {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 500px;
          max-height: 800px;
          overflow: auto;
          background: #f8fafc;
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 20px 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
          cursor: grab;
        }
        .org-canvas-container:active {
          cursor: grabbing;
        }
        .org-canvas-container::-webkit-scrollbar {
          width: 8px; height: 8px;
        }
        .org-canvas-container::-webkit-scrollbar-thumb {
          background: #94a3b8; border-radius: 4px;
        }
        .org-canvas-content {
          padding: 40px;
          min-width: max-content;
          min-height: max-content;
        }
        .org-tree ul {
          padding-top: 20px; position: relative;
          display: flex; justify-content: center;
          transition: all 0.5s;
          list-style: none;
          padding-left: 0;
        }
        .org-tree li {
          float: left; text-align: center;
          list-style-type: none;
          position: relative;
          padding: 20px clamp(2px, 0.5cqi, 10px) 0 clamp(2px, 0.5cqi, 10px);
          transition: all 0.5s;
        }
        .org-tree li::before, .org-tree li::after {
          content: ''; position: absolute; top: 0; right: 50%;
          border-top: 2px solid #94a3b8;
          width: 50%; height: 20px;
        }
        .org-tree li::after {
          right: auto; left: 50%;
          border-left: 2px solid #94a3b8;
        }
        .org-tree li:only-child::after, .org-tree li:only-child::before {
          display: none;
        }
        .org-tree li:only-child { padding-top: 0; }
        .org-tree li:first-child::before, .org-tree li:last-child::after {
          border: 0 none;
        }
        .org-tree li:last-child::before {
          border-right: 2px solid #94a3b8;
          border-radius: 0 5px 0 0;
        }
        .org-tree li:first-child::after {
          border-radius: 5px 0 0 0;
        }
        .org-tree ul ul::before {
          content: '';
          position: absolute; top: 0; left: 50%;
          border-left: 2px solid #94a3b8;
          width: 0; height: 20px;
        }
        
        .org-group-node {
          background: #1e293b; color: #fff;
          padding: clamp(8px, 1.5cqi, 12px) clamp(12px, 2cqi, 20px); border-radius: 8px;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.15);
          border-bottom: 3px solid #3b82f6;
          position: relative; z-index: 2;
          text-align: center;
          min-width: clamp(140px, 18cqi, 200px);
        }
        .org-group-title { font-weight: 700; font-size: clamp(0.7rem, 1.5cqi, 0.9rem); letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.4; }

        .org-photo {
          width: 90px;
          height: 120px;
          border-radius: 6px;
          object-fit: cover;
          margin: 0 auto 12px auto;
          border: 1px solid #cbd5e1;
          display: block;
        }

        .org-node {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 12px 8px;
          border-radius: 10px;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          width: 120px;
          white-space: normal;
          word-wrap: break-word;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          z-index: 2;
        }

        .org-node:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .org-name {
          font-weight: 700;
          font-size: 0.75rem;
          color: #0f172a;
          margin-bottom: 4px;
          line-height: 1.2;
        }
        
        .org-role {
          font-size: 0.65rem;
          color: #64748b;
          font-weight: 500;
          line-height: 1.2;
        }

        .org-photo-placeholder {
          width: 90px; height: 120px; border-radius: 6px;
          background: #f1f5f9; display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; color: #94a3b8; margin-bottom: 12px;
        }
        
        .org-actions {
          margin-top: 12px; display: flex; gap: 8px;
        }
        .org-actions button {
          background: #f1f5f9; border: none; border-radius: 6px; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center; color: #475569; cursor: pointer; transition: 0.2s;
        }
        .org-actions button:hover { background: #3b82f6; color: #fff; }
        .org-actions button.danger:hover { background: #ef4444; color: #fff; }

        .org-add-root {
          display: flex; align-items: center; justify-content: center; flex-direction: column;
          padding: 40px; border: 2px dashed #cbd5e1; border-radius: 12px; cursor: pointer;
          color: #64748b; background: #fff; transition: 0.2s; max-width: 300px; margin: 0 auto;
        }
        .org-add-root:hover { border-color: #f59e0b; color: #f59e0b; background: #fffbeb; }

        /* Advanced Layout Classes */
        .org-branch-li {
          display: flex !important;
          flex-direction: column;
        }
        .org-branch-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        .org-dynamic-spacer {
          flex: 1;
          width: 2px;
          background: #94a3b8;
          min-height: 20px;
        }
        .zoom-btn {
          padding: 8px; background: #fff; border: none; borderRadius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #475569; transition: 0.2s;
        }
        .zoom-btn:hover { background: #e2e8f0; color: #0f172a; }

        /* Compact Mode Overrides */
        .org-compact-mode {
          padding: 0 !important; background: transparent !important; border: none !important; min-height: auto !important;
        }
        .org-compact-mode:not(.org-compact-photo) .org-photo { display: none; }
        .org-compact-photo .org-photo { width: 90px !important; height: 120px !important; border-radius: 6px !important; margin: 0 auto 8px auto !important; border: 1px solid #cbd5e1 !important; object-fit: cover !important; display: block; }
        
        .org-compact-mode .org-node { padding: 6px; min-width: 90px; }
        .org-compact-photo .org-node { padding: 10px 8px; width: 110px; white-space: normal; }
        .org-compact-mode .org-name { font-size: 0.75rem; margin-top: 0; }
        .org-compact-photo .org-name { font-size: 0.65rem; line-height: 1.2; word-wrap: break-word; }
        .org-compact-mode .org-role { font-size: 0.65rem; }
        .org-compact-photo .org-role { font-size: 0.55rem; line-height: 1.2; margin-top: 2px; }
        .org-compact-mode .zoom-panel { display: none !important; }
        .org-compact-mode .org-tree li { padding: 15px 4px 0 4px; }
        .org-compact-mode .org-tree ul { padding-top: 15px; }
        .org-compact-mode .org-group-node { font-size: 0.55rem !important; padding: 4px 8px !important; margin-bottom: 8px !important; white-space: normal !important; max-width: 140px !important; line-height: 1.2 !important; }
        .org-compact-mode .org-dynamic-spacer { min-height: 10px !important; }
      `}</style>

      {!compact && (
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="zoom-panel">
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '6px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <button type="button" onClick={handleZoomOut} className="zoom-btn" title="Perkecil (Zoom Out)"><ZoomOut size={18} /></button>
            <div style={{ width: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
              {Math.round(zoom * 100)}%
            </div>
            <button type="button" onClick={handleZoomIn} className="zoom-btn" title="Perbesar (Zoom In)"><ZoomIn size={18} /></button>
            <div style={{ width: '1px', background: '#cbd5e1', margin: '0 4px' }}></div>
            <button type="button" onClick={handleZoomReset} className="zoom-btn" title="Reset Ukuran"><RotateCcw size={18} /></button>
          </div>

          {!readOnly && (
            <button 
              onClick={() => openModal(kades?.id || null, 'STAF')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59,130,246,0.5)' }}
            >
              <Plus size={18} /> Tambah Aparat
            </button>
          )}
        </div>
      )}

      <div className="org-canvas-container">
        <div className="org-canvas-content" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            zoom: compact || compactWithPhoto ? 0.8 : zoom, 
            width: 'max-content', 
            margin: '0 auto' 
          }}>
        <div className="org-tree">
          <ul>
            {kades ? (
            <li>
              {renderCard(kades, 'SEKDES', true)}
              
              {(sekdes.length > 0 || kaur.length > 0 || kasi.length > 0 || kadus.length > 0) && (
                <ul>
                  {/* 1. PELAKSANA TEKNIS BRANCH (KASI) - KIRI */}
                  <li className="org-branch-li">
                    <div className="org-branch-content">
                      <div className="org-dynamic-spacer"></div>
                      {renderGroupTitle('Kepala Seksi (KASI) / Pelaksana Teknis', 'KASI')}
                    </div>
                    {kasi.length > 0 && (
                      <ul>
                        {kasi.map(k => (
                          <li key={k.id}>{renderCard(k, 'STAF')}</li>
                        ))}
                      </ul>
                    )}
                  </li>

                  {/* 2. PELAKSANA KEWILAYAHAN BRANCH (KADUS) - TENGAH */}
                  <li className="org-branch-li">
                    <div className="org-branch-content">
                      <div className="org-dynamic-spacer" style={{ minHeight: '120px' }}></div>
                      {renderGroupTitle('Kepala Dusun (KADUS) / Pel. Kewilayahan', 'KADUS')}
                    </div>
                    {kadus.length > 0 && (
                      <ul>
                        {kadus.map(k => (
                          <li key={k.id}>{renderCard(k, 'STAF')}</li>
                        ))}
                      </ul>
                    )}
                  </li>

                  {/* 3. SEKRETARIAT BRANCH - KANAN */}
                  <li className="org-branch-li">
                    <div className="org-branch-content">
                      {renderGroupTitle('Sekretariat Desa', 'SEKDES')}
                      {sekdes.map(s => (
                        <div key={s.id} style={{ marginBottom: '16px' }}>
                          {renderCard(s, 'KAUR')}
                        </div>
                      ))}
                      <div className="org-dynamic-spacer"></div>
                      
                      {kaur.length > 0 && (
                        renderGroupTitle('Kepala Urusan (KAUR)', 'KAUR')
                      )}
                    </div>
                    {kaur.length > 0 && (
                      <ul>
                        {kaur.map(k => (
                          <li key={k.id}>{renderCard(k, 'STAF')}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <li>
              {!readOnly ? (
                <div className="org-add-root" onClick={() => openModal(null, 'KADES')}>
                  <Plus size={40} style={{ marginBottom: '12px' }} />
                  <strong style={{ fontSize: '1.2rem' }}>Tambah Kepala Desa</strong>
                  <span style={{ fontSize: '0.9rem', marginTop: '8px' }}>Mulai buat struktur dari puncak</span>
                </div>
              ) : (
                <div className="org-add-root" style={{ cursor: 'default' }}>
                  <strong style={{ fontSize: '1.2rem' }}>Struktur Belum Tersedia</strong>
                  <span style={{ fontSize: '0.9rem', marginTop: '8px' }}>Admin belum mengatur susunan aparatur desa.</span>
                </div>
              )}
            </li>
          )}
          </ul>
        </div>

      {staf.length > 0 && (
        <div style={{ marginTop: '60px', borderTop: '2px dashed #cbd5e1', paddingTop: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ 
              background: '#1e293b', color: '#fff', padding: '12px 24px', 
              borderRadius: '8px', fontWeight: 700, letterSpacing: '1px', 
              textTransform: 'uppercase', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
            }}>
              Staf / Petugas
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px' }}>
            {staf.map(st => (
              <div key={st.id}>
                {renderCard(st, 'STAF')}
              </div>
            ))}
          </div>
        </div>
      )}
      
      </div>
      </div>
      </div>

      {/* Modal ... */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Tambah Perangkat Desa
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Nama Lengkap</label>
                <input type="text" name="nama" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Cth: Budi Santoso" />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Bagian (Kategori)</label>
                  <select name="kategoriJabatan" defaultValue={modalAtasan.defaultKategori} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                    <option value="KADES">Kepala Desa</option>
                    <option value="SEKDES">Sekretaris Desa</option>
                    <option value="KAUR">Kepala Urusan (KAUR)</option>
                    <option value="KASI">Kepala Seksi (KASI)</option>
                    <option value="KADUS">Kepala Dusun (KADUS)</option>
                    <option value="STAF">Staf / Petugas</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Jabatan Spesifik</label>
                  <input type="text" name="jabatan" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Cth: Staf Keuangan" />
                </div>
              </div>

              <PhotoUploader name="foto" label="Foto Pegawai (Rasio 3:4 disarankan)" aspect={3/4} />

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
