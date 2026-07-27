import { getPengaturan, savePengaturan } from './actions';
import { Save, Clock } from 'lucide-react';
import KadesPhotoUploader from '@/components/KadesPhotoUploader';
import SubmitButton from '@/components/SubmitButton';
import RichTextEditor from '@/components/RichTextEditor';
import { prisma } from '@/lib/prisma';

export default async function PengaturanPage() {
  const settings = await getPengaturan();
  const latestSetting = await prisma.pengaturan.findFirst({
    orderBy: { updatedAt: 'desc' }
  });

  let lastUpdatedText = 'Belum ada data';
  if (latestSetting?.updatedAt) {
    const date = new Date(latestSetting.updatedAt);
    lastUpdatedText = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>Pengaturan Global</h1>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Atur profil dasar, visi misi, dan kata sambutan Kepala Desa.</p>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', background: '#e0f2fe', padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
        <Clock size={18} />
        <span>Terakhir diperbarui: {lastUpdatedText}</span>
      </div>

      <form action={async (formData) => { 'use server'; await savePengaturan(formData); }} style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        
        {/* Foto Kepala Desa */}
        <KadesPhotoUploader existingUrl={settings['KADES_FOTO']} />

        {/* Kepala Desa */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Nama Kepala Desa</label>
          <input 
            type="text" 
            name="SET_KADES_NAME" 
            defaultValue={settings['KADES_NAME'] || ''}
            placeholder="Contoh: Budi Santoso, S.E."
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Kata Sambutan</label>
          <RichTextEditor 
            name="SET_KADES_WELCOME" 
            defaultValue={settings['KADES_WELCOME'] || ''}
            placeholder="Tuliskan kata sambutan kepala desa..."
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />

        {/* Visi Misi */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Visi Desa</label>
          <RichTextEditor 
            name="SET_VISI" 
            defaultValue={settings['VISI'] || ''}
            placeholder="Mewujudkan desa yang mandiri..."
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Misi Desa</label>
          <RichTextEditor 
            name="SET_MISI" 
            defaultValue={settings['MISI'] || ''}
            placeholder="1. Meningkatkan kualitas SDM..."
          />
        </div>

        <SubmitButton />

      </form>
    </div>
  );
}
