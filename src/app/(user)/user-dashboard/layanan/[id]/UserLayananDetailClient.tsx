'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LayananChatThread from '@/components/features/LayananChatThread';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserLayananDetailClient({ item, role }: { item: any, role: string }) {
  const router = useRouter();

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link 
          href="/user-dashboard?tab=layanan" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={18} /> Kembali ke Dashboard
        </Link>
      </div>

      <LayananChatThread
        item={item}
        currentUserRole={role}
        onRefresh={() => router.refresh()}
      />
    </div>
  );
}
