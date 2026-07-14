/**
 * Data Dinamis: UMKM
 *
 * Nanti saat koneksi ke database, file ini diganti dengan query ke tabel `umkm`.
 */

export interface UMKM {
  id: string;
  nama: string;
  kategori: string;
  foto: string;
  deskripsi: string;
  kontak: string;
  created_at?: string;
}

export const umkmList: UMKM[] = [
  {
    id: "umkm_001",
    nama: "Kopi Tubruk Pak Wawan",
    kategori: "Kuliner",
    foto: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600",
    deskripsi: "Kopi hitam khas desa yang diproses secara tradisional.",
    kontak: "081234567890",
  },
  {
    id: "umkm_002",
    nama: "Kerajinan Anyaman Bambu Lestari",
    kategori: "Kerajinan",
    foto: "https://images.unsplash.com/photo-1490216744889-eb39e4a86f9f?q=80&w=600",
    deskripsi: "Produk anyaman bambu ramah lingkungan berkualitas ekspor.",
    kontak: "089876543210",
  },
];
