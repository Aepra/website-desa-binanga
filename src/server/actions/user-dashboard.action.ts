'use server';

import { prisma } from '@/lib/prisma';
import { getSession, destroySession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { uploadImage, uploadMultipleImages } from '@/lib/cloudinary';
import { redirect } from 'next/navigation';

// ── GET CURRENT SESSION USER ──
export async function getCurrentUserSession() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function logoutUserAction() {
  await destroySession();
  redirect('/login');
}

// ── UMKM USER OPERATIONS ──

export async function createUmkmUser(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Anda harus login terlebih dahulu.' };
  }

  const nama = (formData.get('nama') as string)?.trim();
  const kategori = (formData.get('kategori') as string)?.trim();
  const pemilik = (formData.get('pemilik') as string)?.trim();
  let deskripsi = (formData.get('deskripsi') as string)?.trim() || '';
  const kontakWa = (formData.get('kontakWa') as string)?.trim();
  const linkMaps = (formData.get('linkMaps') as string)?.trim();
  const file = formData.get('foto') as File | null;

  if (!nama || !kategori || !pemilik || !deskripsi) {
    return { success: false, error: 'Nama UMKM, Kategori, Owner, dan Deskripsi wajib diisi.' };
  }

  // Enforce 500 characters limit on description
  if (deskripsi.length > 500) {
    deskripsi = deskripsi.substring(0, 500);
  }

  let uploadedUrl = '';
  if (file && file.size > 0) {
    try {
      uploadedUrl = await uploadImage(file, 'website-desa-binanga/umkm_potensi');
    } catch (e) {
      console.error('Error uploading UMKM photo:', e);
    }
  }

  await prisma.umkm.create({
    data: {
      nama,
      kategori,
      pemilik,
      deskripsi,
      kontakWa: kontakWa || null,
      linkMaps: linkMaps || null,
      fotoUrl: uploadedUrl || null,
      status: 'PENDING', // Menunggu persetujuan admin
      userEmail: session.username,
    },
  });

  revalidatePath('/user-dashboard');
  revalidatePath('/admin/umkm');
  return { success: true };
}

export async function getUmkmByUser() {
  const session = await getSession();
  if (!session) return [];

  const email = (session.username || '').trim();

  return await prisma.umkm.findMany({
    where: {
      userEmail: {
        equals: email,
        mode: 'insensitive'
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ── LAYANAN USER OPERATIONS ──

export async function createLayananUser(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Anda harus login terlebih dahulu.' };
  }

  const namaPemohon = (formData.get('namaPemohon') as string)?.trim() || session.name;
  const perihal = (formData.get('perihal') as string)?.trim();
  const judul = (formData.get('judul') as string)?.trim();
  const deskripsi = (formData.get('deskripsi') as string)?.trim();

  if (!perihal || !judul || !deskripsi) {
    return { success: false, error: 'Perihal, Judul, dan Deskripsi permohonan wajib diisi.' };
  }

  await prisma.layanan.create({
    data: {
      userEmail: session.username,
      namaPemohon,
      perihal,
      judul,
      deskripsi,
      status: 'MENUNGGU',
    },
  });

  revalidatePath('/user-dashboard');
  revalidatePath('/admin/layanan');
  return { success: true };
}

export async function getLayananByUser() {
  const session = await getSession();
  if (!session) return [];

  const email = (session.username || '').trim();

  return await prisma.layanan.findMany({
    where: {
      userEmail: {
        equals: email,
        mode: 'insensitive'
      }
    },
    include: {
      pesanList: { orderBy: { createdAt: 'asc' } }
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ── TWO-WAY MESSAGING & FILE ATTACHMENTS ──

export async function sendLayananPesanAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Anda harus login terlebih dahulu.' };
  }

  const layananId = (formData.get('layananId') as string)?.trim();
  const pesan = (formData.get('pesan') as string)?.trim();
  const files = formData.getAll('lampiranFiles') as File[];

  const validFiles = files.filter(f => f && f.size > 0);

  if (!layananId || (!pesan && validFiles.length === 0)) {
    return { success: false, error: 'Pesan atau file lampiran tidak boleh kosong.' };
  }

  const isAdmin = session.role === 'SUPER_ADMIN' || session.role === 'ADMIN' || session.role === 'KADES';
  const pengirim = isAdmin ? 'ADMIN' : 'WARGA';

  // Upload up to 5 files to Cloudinary
  let fileUrls: string[] = [];
  if (validFiles.length > 0) {
    fileUrls = await uploadMultipleImages(validFiles, 'website-desa-binanga/layanan_lampiran');
  }

  const fileUrlData = fileUrls.length === 1 ? fileUrls[0] : (fileUrls.length > 1 ? JSON.stringify(fileUrls) : null);

  // Create message in thread
  await prisma.layananPesan.create({
    data: {
      layananId,
      pengirim,
      namaPengirim: session.name || session.username,
      pesan: pesan || (fileUrls.length > 0 ? `[Mengirim ${fileUrls.length} Lampiran Berkas/Foto]` : ''),
      fileUrl: fileUrlData,
    },
  });

  // If message sent by admin, also update catatanAdmin and fileSuratUrl if provided
  if (isAdmin) {
    const updateData: any = {};
    if (pesan) updateData.catatanAdmin = pesan;
    if (fileUrls.length > 0) updateData.fileSuratUrl = fileUrlData;
    
    if (Object.keys(updateData).length > 0) {
      await prisma.layanan.update({
        where: { id: layananId },
        data: updateData,
      });
    }
  }

  revalidatePath('/user-dashboard');
  revalidatePath('/admin/layanan');
  return { success: true, count: fileUrls.length };
}

// ── ADMIN OPERATIONS FOR LAYANAN & UMKM ──

export async function getAllLayananAdmin() {
  return await prisma.layanan.findMany({
    include: {
      pesanList: { orderBy: { createdAt: 'asc' } }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateLayananAdmin(formData: FormData) {
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  const catatanAdmin = formData.get('catatanAdmin') as string;
  const files = formData.getAll('fileSurat') as File[];

  if (!id) return { success: false, error: 'ID tidak valid' };

  const validFiles = files.filter(f => f && f.size > 0);

  let fileUrls: string[] = [];
  if (validFiles.length > 0) {
    fileUrls = await uploadMultipleImages(validFiles, 'website-desa-binanga/layanan_surat');
  }

  const updateData: any = {
    status,
    catatanAdmin: catatanAdmin || null,
  };

  if (fileUrls.length > 0) {
    updateData.fileSuratUrl = fileUrls.length === 1 ? fileUrls[0] : JSON.stringify(fileUrls);
  }

  await prisma.layanan.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/admin/layanan');
  revalidatePath('/user-dashboard');
  return { success: true };
}

export async function updateUmkmStatusAdmin(id: string, status: 'DISETUJUI' | 'DITOLAK' | 'PENDING') {
  await prisma.umkm.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/umkm');
  revalidatePath('/user-dashboard');
  revalidatePath('/umkm');
  revalidatePath('/home');
  return { success: true };
}
