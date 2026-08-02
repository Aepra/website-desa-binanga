import { getPengaturan, savePengaturan } from '@/server/actions/pengaturan.action';
import { Clock, UserCheck, Target, Save, Settings as SettingsIcon } from 'lucide-react';
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
      timeZoneName: 'short'
    }).format(date);
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={22} className="text-blue-600" /> Pengaturan Global Desa
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Kelola identitas utama, profil Kepala Desa, serta Visi & Misi Desa Binanga.</p>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284c7', background: '#e0f2fe', padding: '6px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
          <Clock size={14} />
          <span>Update Terakhir: {lastUpdatedText}</span>
        </div>
      </div>

      <form action={async (formData) => { 'use server'; await savePengaturan(formData); }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start', marginBottom: '24px' }}>
          
          {/* CARD 1: KEPALA DESA & SAMBUTAN */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#dbeafe', color: '#2563eb', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <UserCheck size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Profil & Sambutan Kepala Desa</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Foto resmi, nama lengkap, dan kata sambutan</p>
              </div>
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Foto Kepala Desa */}
              <KadesPhotoUploader existingUrl={settings['KADES_FOTO']} />

              {/* Nama Kepala Desa */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px', fontSize: '0.82rem' }}>Nama Kepala Desa</label>
                <input 
                  type="text" 
                  name="SET_KADES_NAME" 
                  defaultValue={settings['KADES_NAME'] || ''}
                  placeholder="Contoh: Budi Santoso, S.E."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>

              {/* Kata Sambutan */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px', fontSize: '0.82rem' }}>Kata Sambutan Kepala Desa</label>
                <RichTextEditor 
                  name="SET_KADES_WELCOME" 
                  defaultValue={settings['KADES_WELCOME'] || ''}
                  placeholder="Tuliskan kata sambutan kepala desa..."
                />
              </div>
            </div>
          </div>

          {/* CARD 2: VISI & MISI DESA */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#dcfce7', color: '#16a34a', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <Target size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Visi & Misi Desa</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Arah pembangunan dan misi kerja pemerintahan desa</p>
              </div>
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Visi Desa */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px', fontSize: '0.82rem' }}>Visi Desa</label>
                <RichTextEditor 
                  name="SET_VISI" 
                  defaultValue={settings['VISI'] || ''}
                  placeholder="Mewujudkan desa yang mandiri, cerdas, dan sejahtera..."
                />
              </div>

              {/* Misi Desa */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px', fontSize: '0.82rem' }}>Misi Desa</label>
                <RichTextEditor 
                  name="SET_MISI" 
                  defaultValue={settings['MISI'] || ''}
                  placeholder="1. Meningkatkan kualitas SDM dan pelayanan umum..."
                />
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ACTION BAR */}
        <div style={{ background: '#fff', padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Pastikan semua data sudah diperiksa sebelum menyimpan.</span>
          <SubmitButton />
        </div>

      </form>
    </div>
  );
}
