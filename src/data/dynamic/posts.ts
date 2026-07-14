/**
 * Data Dinamis: Posts (Berita + Pengumuman + Agenda)
 *
 * Tabel ini menggabungkan 3 entitas yang memiliki struktur mirip.
 * Gunakan field `type` untuk membedakan:
 * - 'berita'      → Berita Desa
 * - 'pengumuman'  → Pengumuman Resmi
 * - 'agenda'      → Agenda Kegiatan
 *
 * Nanti saat koneksi ke database, file ini diganti dengan query ke tabel `posts`.
 */

export type PostType = "berita" | "pengumuman" | "agenda";

export interface Post {
  id: string;
  type: PostType;
  judul: string;
  kategori?: string;
  tanggal: string;
  cover?: string;
  ringkasan?: string;
  lokasi?: string;
  created_at?: string;
}

export const posts: Post[] = [
  // === BERITA ===
  {
    id: "post_b1",
    type: "berita",
    judul: "Pembangunan Jalan Desa Tahap 2 Selesai",
    kategori: "Infrastruktur",
    tanggal: "2026-07-10",
    cover:
      "https://images.unsplash.com/photo-1541888056247-49787fb73b18?q=80&w=600",
    ringkasan:
      "Proyek pengaspalan jalan desa sepanjang 2 km telah selesai dikerjakan dengan dana desa.",
  },
  {
    id: "post_b2",
    type: "berita",
    judul: "Penyaluran BLT Tahap 3 Tahun 2026",
    kategori: "Sosial",
    tanggal: "2026-07-08",
    cover:
      "https://images.unsplash.com/photo-1593113580517-7422f281e285?q=80&w=600",
    ringkasan:
      "Bantuan Langsung Tunai (BLT) tahap ketiga resmi disalurkan kepada 150 KK yang berhak.",
  },
  {
    id: "post_b3",
    type: "berita",
    judul: "Pelatihan Digital Marketing UMKM",
    kategori: "Pemberdayaan",
    tanggal: "2026-07-05",
    cover:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600",
    ringkasan:
      "Lebih dari 30 pelaku UMKM lokal berpartisipasi dalam pelatihan pemasaran digital bersama dinas terkait.",
  },

  // === PENGUMUMAN ===
  {
    id: "post_p1",
    type: "pengumuman",
    judul: "Pengumuman Libur Pelayanan Balai Desa",
    tanggal: "2026-08-12",
    ringkasan:
      "Sehubungan dengan peringatan Hari Kemerdekaan RI, pelayanan administrasi di Balai Desa akan diliburkan pada tanggal 17 Agustus 2026. Pelayanan akan kembali normal pada hari berikutnya.",
  },
  {
    id: "post_p2",
    type: "pengumuman",
    judul: "Jadwal Vaksinasi Booster Tahap 2",
    tanggal: "2026-08-05",
    ringkasan:
      "Warga yang belum menerima vaksinasi booster dapat mendatangi Puskesmas Pembantu pada tanggal 10-12 Agustus 2026.",
  },
  {
    id: "post_p3",
    type: "pengumuman",
    judul: "Pendaftaran Pelatihan Keterampilan Desa",
    tanggal: "2026-07-28",
    ringkasan:
      "Dibuka pendaftaran pelatihan menjahit dan tata boga untuk warga desa. Kuota terbatas 25 peserta.",
  },

  // === AGENDA ===
  {
    id: "post_a1",
    type: "agenda",
    judul: "Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes)",
    tanggal: "2026-07-20",
    lokasi: "Balai Desa",
  },
  {
    id: "post_a2",
    type: "agenda",
    judul: "Kerja Bakti Massal Sambut HUT RI",
    tanggal: "2026-08-01",
    lokasi: "Seluruh RT/RW",
  },
];
