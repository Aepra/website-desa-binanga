'use client';

import React, { useState, useRef } from 'react';
import { Plus, X, Trash2, Loader2, Pencil } from 'lucide-react';
import PhotoUploader from '@/components/ui/PhotoUploader';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export type Perangkat = {
  id: string;
  nama: string;
  jabatan: string;
  kategoriJabatan: string;
  fotoUrl?: string | null;
  atasanId: string | null;
  subordinates?: Perangkat[];
};

interface OrgChartProps {
  data: Perangkat[];
  onCreate?: (formData: FormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, formData: FormData) => Promise<void>;
  readOnly?: boolean;
  compact?: boolean;
  compactWithPhoto?: boolean;
}

const OrgNode = ({ node, onAdd, onDelete, onEdit, readOnly, compact, isRoot = false }: { node: Perangkat, onAdd: (id: string) => void, onDelete?: (id: string) => void, onEdit: (node: Perangkat) => void, readOnly: boolean, compact?: boolean, isRoot?: boolean }) => {
  const isKades = node.kategoriJabatan === 'KADES' || isRoot;

  if (node.id.startsWith('title-')) {
    return (
      <div className="dept-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="org-node-wrapper" style={{ padding: '0 10px' }}>
          <div style={{ 
            background: '#f8fafc', padding: '8px 24px', borderRadius: '9999px', 
            fontWeight: 800, color: '#334155', fontSize: '11px', 
            border: '2px solid #e2e8f0', letterSpacing: '0.5px', textTransform: 'uppercase',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative', zIndex: 2
          }}>
            {node.nama}
          </div>
        </div>
        {node.subordinates && node.subordinates.length > 0 && (
          <ul className="org-children">
            {node.subordinates.map((child) => (
              <OrgNode key={child.id} node={child} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} readOnly={readOnly} compact={compact} />
            ))}
          </ul>
        )}
      </div>
    );
  }

  let renderChildren = null;

  if (node.subordinates && node.subordinates.length > 0) {
    if (isKades) {
      // Pisahkan staf dari departemen lain
      const regularDepts = node.subordinates.filter(s => s.id !== 'title-staf-isolated');
      const stafDept = node.subordinates.find(s => s.id === 'title-staf-isolated');

      // Chunk subordinates into arrays of 2
      const rows = [];
      for (let i = 0; i < regularDepts.length; i += 2) {
        rows.push(regularDepts.slice(i, i + 2));
      }

      renderChildren = (
        <div className="kades-rows-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Trunk line from Kades */}
          {rows.length > 0 && (
            <div style={{ width: '2px', height: '20px', background: '#e2e8f0' }}></div>
          )}

          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="kades-tier-row" style={{ display: 'flex', position: 'relative', justifyContent: 'center', width: '100%', marginTop: rowIndex > 0 ? '20px' : '0' }}>
              
              {row.map((dept, deptIndex) => (
                <React.Fragment key={dept.id}>
                  {/* Department Wrapper */}
                  <div className={`dept-wrapper ${row.length === 1 ? 'single-dept' : (deptIndex === 0 ? 'left-dept' : 'right-dept')}`} style={{ position: 'relative', flex: '1 1 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Horizontal connector line */}
                    {row.length > 1 && (
                      <div className="dept-horizontal-line" style={{ 
                        position: 'absolute', top: 0, height: '2px', background: '#e2e8f0',
                        left: deptIndex === 0 ? '50%' : '0',
                        right: deptIndex === 0 ? '0' : '50%',
                      }}></div>
                    )}
                    
                    {/* Vertical drop to title */}
                    <div style={{ position: 'absolute', top: 0, left: '50%', width: '2px', height: '20px', background: '#e2e8f0', marginLeft: '-1px' }}></div>
                    
                    <div style={{ paddingTop: '20px' }}>
                      <OrgNode node={dept} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} readOnly={readOnly} compact={compact} />
                    </div>
                  </div>

                  {/* Central Trunk Connector (if this is the left dept and there is a right dept) */}
                  {deptIndex === 0 && row.length === 2 && (
                    <div className="trunk-connector" style={{ width: '60px', position: 'relative', flexShrink: 0 }}>
                      {/* Horizontal bridge across the connector */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#e2e8f0' }}></div>
                      
                      {/* Only drop a line if there is another row below! */}
                      {rowIndex < rows.length - 1 && (
                        <div style={{ position: 'absolute', top: 0, bottom: '-20px', left: '50%', width: '2px', background: '#e2e8f0', marginLeft: '-1px', zIndex: 0 }}></div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}

          {/* Render Staf yang diisolasi di paling bawah tanpa garis */}
          {stafDept && (
            <div className="staf-isolated-container" style={{ marginTop: rows.length > 0 ? '60px' : '20px', display: 'flex', justifyContent: 'center', width: '100%' }}>
              <OrgNode node={stafDept} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} readOnly={readOnly} compact={compact} />
            </div>
          )}
        </div>
      );
    } else {
      renderChildren = (
        <ul className="org-children">
          {node.subordinates.map((child) => (
            <OrgNode key={child.id} node={child} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} readOnly={readOnly} compact={compact} />
          ))}
        </ul>
      );
    }
  }

  return (
    <li className="org-node-li">
      {/* Konten Kotak Jabatan */}
      <div className="org-node-wrapper">
        <div className="org-node-card">
          
          {/* Avatar Area */}
          <div className="org-avatar">
            {node.fotoUrl ? (
              <img src={node.fotoUrl} alt={node.nama} className="org-avatar-img" />
            ) : (
              // Fallback Icon
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            )}
          </div>
          
          {/* Nama & Jabatan */}
          <div className="org-text-area">
            <h4 className="org-name">{node.nama}</h4>
            <span className="org-badge">
              {node.jabatan}
            </span>
          </div>

          {/* Actions (Muncul saat tidak readOnly) */}
          {!readOnly && (
            <div className="org-actions-row">
              <button type="button" onClick={() => onAdd(node.id)} className="org-btn-add" title="Tambah Bawahan"><Plus size={14} /></button>
              <button type="button" onClick={() => onEdit(node)} className="org-btn-edit" title="Edit Data"><Pencil size={12} /></button>
              {onDelete && (
                <button type="button" onClick={() => onDelete(node.id)} className="org-btn-delete" title="Hapus"><Trash2 size={14} /></button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Render Anak (Bawahan) */}
      {renderChildren}
    </li>
  );
};

// ==========================================
// KOMPONEN UTAMA (CHART WRAPPER)
// ==========================================
export default function OrgChart({ data, onCreate, onDelete, onUpdate, readOnly = false, compact = false, compactWithPhoto = false }: OrgChartProps) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAtasan, setModalAtasan] = useState<{ id: string | null; defaultKategori: string }>({ id: null, defaultKategori: 'STAF' });
  const [editingNode, setEditingNode] = useState<Perangkat | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const openModal = (atasanId: string | null, defaultKategori: string = 'STAF') => {
    setEditingNode(null);
    setModalAtasan({ id: atasanId, defaultKategori });
    setIsModalOpen(true);
  };

  const openEditModal = (node: Perangkat) => {
    setEditingNode(node);
    setModalAtasan({ id: node.atasanId, defaultKategori: node.kategoriJabatan });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    if (editingNode) {
      if (onUpdate) await onUpdate(editingNode.id, formData);
    } else {
      if (modalAtasan.id) {
        formData.append('atasanId', modalAtasan.id);
      }
      if (onCreate) await onCreate(formData);
    }
    
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const buildTree = (staff: Perangkat[]): Perangkat[] => {
    const map = new Map<string, Perangkat>();
    const roots: Perangkat[] = [];

    staff.forEach(s => {
      map.set(s.id, { ...s, subordinates: [] });
    });

    const kades = staff.find(s => s.kategoriJabatan === 'KADES');
    const sekdes = staff.find(s => s.kategoriJabatan === 'SEKDES');

    staff.forEach(s => {
      const node = map.get(s.id);
      if (!node) return;

      let effectiveAtasanId = s.atasanId;
      
      if (!effectiveAtasanId && s.kategoriJabatan !== 'KADES') {
        if (['SEKDES', 'KASI', 'KADUS'].includes(s.kategoriJabatan)) {
          effectiveAtasanId = kades?.id || null;
        } else if (s.kategoriJabatan === 'KAUR') {
          effectiveAtasanId = sekdes?.id || kades?.id || null;
        } else if (s.kategoriJabatan === 'STAF') {
          effectiveAtasanId = kades?.id || null;
        }
      }

      node.atasanId = effectiveAtasanId;

      if (effectiveAtasanId) {
        const parent = map.get(effectiveAtasanId);
        if (parent) {
          parent.subordinates!.push(node);
        } else {
          roots.push(node); 
        }
      } else {
        roots.push(node);
      }
    });

    // Mengelompokkan bawahan Kades ke dalam Judul (Title Nodes)
    const kadesNodes = roots.filter(r => r.kategoriJabatan === 'KADES');
    kadesNodes.forEach(kades => {
      if (!kades.subordinates || kades.subordinates.length === 0) return;

      const groups: { [key: string]: Perangkat[] } = {
        'Sekretariat': kades.subordinates.filter(s => s.kategoriJabatan === 'SEKDES' || s.kategoriJabatan === 'KAUR'),
        'Kepala Dusun': kades.subordinates.filter(s => s.kategoriJabatan === 'KADUS'),
        'Pelaksana Teknis (Seksi)': kades.subordinates.filter(s => s.kategoriJabatan === 'KASI')
      };
      
      const stafMembers = kades.subordinates.filter(s => !['SEKDES', 'KAUR', 'KADUS', 'KASI'].includes(s.kategoriJabatan));

      let rootSubordinates: Perangkat[] = [];

      Object.entries(groups).forEach(([title, members]) => {
        if (members.length > 0) {
          rootSubordinates.push({
            id: `title-${title}`,
            nama: title,
            jabatan: '',
            kategoriJabatan: 'TITLE',
            atasanId: kades.id,
            subordinates: members
          });
        }
      });
      
      if (stafMembers.length > 0) {
        rootSubordinates.push({
          id: `title-staf-isolated`,
          nama: 'Staf & Lainnya',
          jabatan: '',
          kategoriJabatan: 'TITLE',
          atasanId: kades.id,
          subordinates: stafMembers
        });
      }

      kades.subordinates = rootSubordinates;
    });

    return roots;
  };

  const tree = buildTree(data);

  // Group data for List View
  const groupedData = data.reduce((acc, curr) => {
    const key = curr.kategoriJabatan;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, Perangkat[]>);

  const kategoriOrder = ['KADES', 'SEKDES', 'KADUS', 'KASI', 'KAUR', 'STAF'];

  return (
    <div className="org-chart-container">
      {!readOnly && (
        <div className="org-top-actions">
          <button 
            onClick={() => openModal(null, 'KADES')} 
            className="org-btn-primary"
          >
            <Plus size={16} /> Tambah Pucuk Pimpinan
          </button>
        </div>
      )}

      {tree.length > 0 ? (
        <div className="org-scroll-area custom-scrollbar">
          <style>{`
            .org-chart-container {
              width: 100%;
            }
            .org-top-actions {
              margin-bottom: 1rem;
            }
            .org-btn-primary {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 16px;
              background-color: #2563eb;
              color: white;
              border-radius: 8px;
              border: none;
              font-weight: 500;
              font-size: 14px;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            .org-btn-primary:hover {
              background-color: #1d4ed8;
            }
            .org-scroll-area {
              width: 100%;
              overflow-x: auto;
              padding-bottom: 40px;
            }
            .org-empty-state {
              padding: 40px;
              border: 2px dashed #e2e8f0;
              border-radius: 12px;
              text-align: center;
            }
            .org-empty-text {
              color: #64748b;
              margin-bottom: 12px;
            }
            .org-btn-outline {
              padding: 8px 16px;
              background-color: #eff6ff;
              color: #2563eb;
              border-radius: 8px;
              border: none;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            .org-btn-outline:hover {
              background-color: #dbeafe;
            }

            /* --- NODE STYLES --- */
            .org-node-wrapper {
              display: inline-block;
              position: relative;
            }
            .org-node-card {
              background-color: #ffffff;
              border: 1px solid #f1f5f9;
              box-shadow: 0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04);
              border-radius: 16px;
              padding: 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-width: 120px;
              max-width: 180px;
              transition: all 0.3s;
              position: relative;
              z-index: 10;
            }
            .org-node-card:hover {
              box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            }
            .org-avatar {
              width: 64px;
              height: 64px;
              border-radius: 50%;
              overflow: hidden;
              background-color: #f8fafc;
              border: 2px solid #ffffff;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
              margin-bottom: 12px;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #cbd5e1;
            }
            .org-avatar-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .org-text-area {
              text-align: center;
              width: 100%;
            }
            .org-name {
              font-size: 13px;
              font-weight: 700;
              color: #1e293b;
              line-height: 1.2;
              margin: 0 0 8px 0;
              word-wrap: break-word;
            }
            .org-badge {
              font-size: 10px;
              font-weight: 700;
              color: #10b981;
              background-color: #ecfdf5;
              padding: 4px 12px;
              border-radius: 9999px;
              display: inline-block;
              word-wrap: break-word;
              max-width: 100%;
            }
            .org-actions-row {
              margin-top: 16px;
              display: flex;
              gap: 8px;
              justify-content: center;
              width: 100%;
            }
            .org-btn-add, .org-btn-delete, .org-btn-edit {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background-color: #f8fafc;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #64748b;
              border: none;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }
            .org-btn-add:hover {
              background-color: #10b981;
              color: #ffffff;
            }
            .org-btn-edit:hover {
              background-color: #f59e0b;
              color: #ffffff;
            }
            .org-btn-delete:hover {
              background-color: #ef4444;
              color: #ffffff;
            }

            /* --- TREE STYLES --- */
            .org-tree {
              min-width: max-content;
              width: 100%;
            }
            .org-tree > ul {
              display: inline-flex;
              width: 100%;
              justify-content: center;
            }
            .org-tree ul, .org-children {
              padding-top: 20px; 
              position: relative;
              transition: all 0.5s;
              display: flex;
              justify-content: center;
              flex-wrap: nowrap;
              margin: 0;
              padding-left: 0;
            }

            .org-node-li {
              text-align: center;
              list-style-type: none;
              position: relative;
              padding: 20px 5px 0 5px;
              transition: all 0.5s;
              flex: 0 0 auto;
            }

            .org-node-li::before, .org-node-li::after {
              content: '';
              position: absolute; top: 0; right: 50%;
              border-top: 2px solid #e2e8f0;
              width: 50%; height: 20px;
            }
            
            .org-node-li::after {
              right: auto; left: 50%;
              border-left: 2px solid #e2e8f0;
            }

            .org-node-li:only-child::after, .org-node-li:only-child::before {
              display: none !important;
            }

            .org-node-li:only-child { 
              padding-top: 0;
            }

            .org-node-li:first-child::before, .org-node-li:last-child::after {
              display: none !important;
            }

            .org-node-li:last-child::before {
              border-right: 2px solid #e2e8f0;
              border-radius: 0 8px 0 0;
            }
            .org-node-li:first-child::after {
              border-radius: 8px 0 0 0;
            }

            .org-children::before {
              content: '';
              position: absolute; top: 0; left: 50%;
              border-left: 2px solid #e2e8f0;
              width: 0; height: 20px;
              margin-left: -1px;
            }

            .custom-scrollbar::-webkit-scrollbar {
              height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #cbd5e1;
              border-radius: 20px;
            }

            /* --- RESPONSIVE STYLES (MOBILE) --- */
            @media (max-width: 768px) {
              .org-node-card {
                min-width: 100px;
                max-width: 130px;
                padding: 12px 8px;
              }
              .org-avatar {
                width: 48px;
                height: 48px;
                margin-bottom: 8px;
              }
              .org-name {
                font-size: 11px;
                margin-bottom: 4px;
              }
              .org-badge {
                font-size: 9px;
                padding: 3px 8px;
              }
              .org-actions-row {
                margin-top: 10px;
                gap: 4px;
              }
              .org-btn-add, .org-btn-delete, .org-btn-edit {
                width: 28px;
                height: 28px;
              }
              .org-btn-add svg, .org-btn-delete svg, .org-btn-edit svg {
                width: 12px;
                height: 12px;
              }
              .trunk-connector {
                width: 30px !important;
              }
              .org-node-li {
                padding-left: 2px;
                padding-right: 2px;
              }
              .org-scroll-area {
                -webkit-overflow-scrolling: touch;
                box-shadow: inset -15px 0 15px -15px rgba(0,0,0,0.1);
              }
              .dept-wrapper {
                padding: 0 2px !important;
              }
            }
          `}</style>

          <div className="org-tree">
            <ul>
              {tree.map(rootNode => (
                <OrgNode 
                  key={rootNode.id} 
                  node={rootNode} 
                  onAdd={(id) => openModal(id, 'STAF')}
                  onDelete={onDelete}
                  onEdit={openEditModal}
                  readOnly={readOnly}
                  compact={compact}
                  isRoot={true}
                />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="org-empty-state">
          <p className="org-empty-text">Belum ada struktur organisasi.</p>
          {!readOnly && (
            <button 
              onClick={() => openModal(null, 'KADES')} 
              className="org-btn-outline"
            >
              Mulai Buat Struktur
            </button>
          )}
        </div>
      )}

      {/* Daftar Pegawai dalam bentuk List */}
      {data.length > 0 && (
        <div className="org-list-view" style={{ marginTop: '60px', borderTop: '2px dashed #e2e8f0', paddingTop: '40px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
            Daftar Susunan Organisasi
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {kategoriOrder.map(kategori => {
              if (!groupedData[kategori] || groupedData[kategori].length === 0) return null;
              
              return (
                <div key={kategori} className="org-list-group" style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {kategori === 'KADES' ? 'Pucuk Pimpinan' : kategori}
                  </h4>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {groupedData[kategori].map(pegawai => (
                      <li key={pegawai.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {pegawai.fotoUrl ? (
                            <img src={pegawai.fotoUrl} alt={pegawai.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ color: '#94a3b8' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '14px' }}>{pegawai.nama}</div>
                          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{pegawai.jabatan}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Perangkat */}
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
                {editingNode ? 'Edit Pegawai' : 'Tambah Pegawai'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Atasan Langsung</label>
                <select name="atasanId" defaultValue={editingNode?.atasanId || modalAtasan.id || ""} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                  <option value="">-- Pucuk Pimpinan Tertinggi (Root) --</option>
                  {data.map(d => (
                    (!editingNode || editingNode.id !== d.id) && (
                      <option key={d.id} value={d.id}>{d.nama} ({d.jabatan})</option>
                    )
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Nama Lengkap</label>
                <input type="text" name="nama" defaultValue={editingNode?.nama} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Cth: Budi Santoso" />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Bagian (Kategori)</label>
                  <select name="kategoriJabatan" defaultValue={editingNode?.kategoriJabatan || modalAtasan.defaultKategori} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
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
                  <input type="text" name="jabatan" defaultValue={editingNode?.jabatan} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Cth: Staf Keuangan" />
                </div>
              </div>

              <PhotoUploader name="foto" label="Foto Pegawai (Rasio 3:4 disarankan)" aspect={3/4} />

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }} disabled={isSubmitting}>Batal</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {isSubmitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <LoadingOverlay show={isSubmitting} />
    </div>
  );
}
