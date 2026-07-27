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
        {pending ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        {pending ? pendingLabel : label}
      </button>

      {pending && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: '32px', borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: '16px'
          }}>
            <Loader2 size={48} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            <h2 style={{ margin: 0, color: '#0f172a' }}>Menyimpan Data...</h2>
            <p style={{ margin: 0, color: '#64748b' }}>Mohon tunggu sebentar, foto dan data sedang diunggah.</p>
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
