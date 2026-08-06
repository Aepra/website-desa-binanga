'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ 
  show, 
  title = "Menyimpan Data...", 
  subtitle = "Mohon tunggu sebentar, data sedang diproses." 
}: { 
  show: boolean; 
  title?: string; 
  subtitle?: string; 
}) {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeInOverlay 0.2s ease-out'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '32px 36px',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '360px',
        width: '90%'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <Loader2 size={32} color="#3b82f6" style={{ animation: 'spinOverlay 1s linear infinite' }} />
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.4 }}>
          {subtitle}
        </p>
        <style>{`
          @keyframes spinOverlay {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeInOverlay {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
