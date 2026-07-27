const fs = require('fs');
const path = require('path');

const adminDir = path.join(process.cwd(), 'src', 'app', 'admin');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ========================
// TEMPLATES
// ========================

const getActionsTemplate = (modelName, tableName, fields) => `
'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function get${modelName}() {
  return await prisma.${tableName}.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function create${modelName}(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  await prisma.${tableName}.create({
    data: {
      ${fields.map(f => `${f.name}: data.${f.name} as string`).join(',\n      ')}
    }
  });
  revalidatePath('/admin/${tableName.toLowerCase()}');
  revalidatePath('/');
}

export async function delete${modelName}(id: string) {
  await prisma.${tableName}.delete({ where: { id } });
  revalidatePath('/admin/${tableName.toLowerCase()}');
  revalidatePath('/');
}
`;

const getPageTemplate = (modelName, fields, title) => `
import { get${modelName}, create${modelName}, delete${modelName} } from './actions';

export default async function ${modelName}Page() {
  const data = await get${modelName}();

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>Manajemen ${title}</h1>
      
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Tambah ${title} Baru</h2>
        <form action={create${modelName}} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          ${fields.map(f => `
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>${f.label}</label>
            ${f.type === 'textarea' 
              ? `<textarea name="${f.name}" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px' }} />`
              : `<input type="${f.type}" name="${f.name}" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />`
            }
          </div>
          `).join('')}
          <button type="submit" style={{ padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
            Simpan
          </button>
        </form>
      </div>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Daftar ${title}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              ${fields.map(f => `<th style={{ padding: '12px' }}>${f.label}</th>`).join('')}
              <th style={{ padding: '12px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                ${fields.map(f => `<td style={{ padding: '12px' }}>{item.${f.name}}</td>`).join('')}
                <td style={{ padding: '12px' }}>
                  <form action={async () => {
                    'use server';
                    await delete${modelName}(item.id);
                  }}>
                    <button type="submit" style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={${fields.length + 1}} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Belum ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

// ========================
// GENERATOR
// ========================

const cruds = [
  {
    dir: 'berita',
    modelName: 'Berita',
    tableName: 'berita',
    title: 'Berita & Agenda',
    fields: [
      { name: 'judul', label: 'Judul', type: 'text' },
      { name: 'slug', label: 'Slug (URL)', type: 'text' },
      { name: 'kategori', label: 'Kategori (BERITA/AGENDA/PENGUMUMAN)', type: 'text' },
      { name: 'konten', label: 'Konten Lengkap', type: 'textarea' },
      { name: 'fotoUrl', label: 'URL Foto', type: 'text' },
      { name: 'penulisId', label: 'ID Penulis (Sementara isi sembarang)', type: 'text' },
    ]
  },
  {
    dir: 'umkm',
    modelName: 'UMKM',
    tableName: 'umkm',
    title: 'UMKM & Potensi',
    fields: [
      { name: 'nama', label: 'Nama UMKM', type: 'text' },
      { name: 'kategori', label: 'Kategori', type: 'text' },
      { name: 'pemilik', label: 'Nama Pemilik', type: 'text' },
      { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
      { name: 'kontakWa', label: 'No. WA', type: 'text' },
      { name: 'fotoUrl', label: 'URL Foto', type: 'text' },
    ]
  },
  {
    dir: 'wisata',
    modelName: 'Wisata',
    tableName: 'wisata',
    title: 'Destinasi Wisata',
    fields: [
      { name: 'nama', label: 'Nama Wisata', type: 'text' },
      { name: 'kategori', label: 'Kategori', type: 'text' },
      { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
      { name: 'fotoUrl', label: 'URL Foto', type: 'text' },
    ]
  },
  {
    dir: 'struktur',
    modelName: 'Perangkat',
    tableName: 'perangkatDesa',
    title: 'Struktur Organisasi',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text' },
      { name: 'jabatan', label: 'Jabatan', type: 'text' },
      { name: 'fotoUrl', label: 'URL Foto', type: 'text' },
    ]
  }
];

cruds.forEach(crud => {
  const targetDir = path.join(adminDir, crud.dir);
  ensureDir(targetDir);
  
  fs.writeFileSync(path.join(targetDir, 'actions.ts'), getActionsTemplate(crud.modelName, crud.tableName, crud.fields));
  fs.writeFileSync(path.join(targetDir, 'page.tsx'), getPageTemplate(crud.modelName, crud.fields, crud.title));
  
  console.log('Created CRUD for ' + crud.modelName);
});
