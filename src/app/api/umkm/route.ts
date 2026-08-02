import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/cloudinary';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const umkms = await prisma.umkm.findMany({
    where: { pemilik: session.username },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(umkms);
}

export async function POST(request: Request) {
  const session2 = await getSession();
  if (!session2) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const form = await request.formData();
  const nama = form.get('nama')?.toString() ?? '';
  const kategori = form.get('kategori')?.toString() ?? '';
  const pemilik = (session2 as any).username ?? '';
  const deskripsi = form.get('deskripsi')?.toString() ?? '';
  const kontakWa = form.get('kontakWa')?.toString() ?? '';
  const file = form.get('foto') as File | null;

  let fotoUrl: string | undefined;
  if (file && file.size > 0) {
    try {
      fotoUrl = await uploadImage(file, 'website-desa-binanga/umkm');
    } catch (e) {
      console.error('Cloudinary upload error', e);
      return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
    }
  }

  const created = await prisma.umkm.create({
    data: {
      nama,
      kategori,
      pemilik,
      deskripsi,
      kontakWa,
      fotoUrl,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
