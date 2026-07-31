'use client';

import { useFormStatus } from 'react-dom';
import { Save, Loader2 } from 'lucide-react';

export default function SubmitButton({ 
  label = "Simpan Perubahan", 
  pendingLabel = "Menyimpan...", 
  style 
}: { 
  label?: string, 
  pendingLabel?: string, 
  style?: React.CSSProperties 
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <button 
        type="submit" 
        disabled={pending}
        style={{ 
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
          gap: '8px', background: pending ? '#9ca3af' : '#3b82f6', color: '#fff', 
          padding: '12px 24px', borderRadius: '8px', border: 'none', 
          fontWeight: 600, fontSize: '1rem', cursor: pending ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          ...style
        }}
      >
        {pending ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={20} />}
        {pending ? pendingLabel : label}
      </button>

      {pending && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)', zIndex: 99999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: '32px 36px', borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex',
            flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '360px', width: '90%'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
            }}>
              <Loader2 size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Menyimpan Data...</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.4 }}>Mohon tunggu sebentar, data sedang diproses.</p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}
