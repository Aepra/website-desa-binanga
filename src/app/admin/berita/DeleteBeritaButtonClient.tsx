'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteBerita } from '@/server/actions/berita.action';

export default function DeleteBeritaButtonClient({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini? Aksi ini tidak dapat dibatalkan.')) {
      startTransition(async () => {
        try {
          await deleteBerita(id);
        } catch (error) {
          alert('Gagal menghapus berita: ' + error);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      title="Hapus Berita"
      style={{ 
        padding: '8px', 
        background: '#fee2e2', 
        color: '#ef4444', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: isPending ? 'not-allowed' : 'pointer', 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        opacity: isPending ? 0.7 : 1,
        transition: 'all 0.2s'
      }}
    >
      <Trash2 size={16} />
    </button>
  );
}
