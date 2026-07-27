import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Calendar, Tag, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function BeritaDetail({ params }: { params: { slug: string } }) {
  // Wait for params in Next.js 15+ (if needed, but usually safe to await if async)
  const slug = (await params).slug || params.slug;

  const berita = await prisma.berita.findUnique({
    where: { slug: slug },
    include: { galeri: true }
  });

  if (!berita) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        
        {/* Back Link */}
        <div style={{ padding: '20px 32px' }}>
          <Link href="/berita-agenda" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
            <ChevronLeft size={18} /> Kembali ke Pusat Informasi
          </Link>
        </div>

        {/* Cover Image */}
        {berita.fotoUrl && (
          <img src={berita.fotoUrl} alt={berita.judul} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        )}

        <div style={{ padding: '32px' }}>
          {/* Meta */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', color: '#64748b', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, color: '#475569' }}>
              <Tag size={14} /> {berita.kategori}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> {berita.publishedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', lineHeight: 1.3 }}>
            {berita.judul}
          </h1>

          {/* Content */}
          <div style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {berita.konten}
          </div>

          {/* Gallery */}
          {berita.galeri && berita.galeri.length > 0 && (
            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                Galeri Dokumentasi
              </h3>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.9rem' }}>Klik pada gambar untuk melihat ukuran penuh.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {berita.galeri.map((g) => (
                  <a key={g.id} href={g.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                    <img 
                      src={g.url} 
                      alt="Galeri Dokumentasi" 
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }} 
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
