/**
 * Data Dinamis: Bansos (Bantuan Sosial)
 *
 * Nanti saat koneksi ke database, file ini diganti dengan query ke tabel `bansos`.
 */

export interface Bansos {
  id?: number;
  nik: string;
  nama: string;
  program: string;
  status: "Tersalurkan" | "Proses Verifikasi";
  tanggal_terima: string;
  created_at?: string;
}

export const bansosList: Bansos[] = [
  {
    nik: "1234567890123456",
    nama: "Slamet Riyadi",
    program: "BLT Dana Desa",
    status: "Tersalurkan",
    tanggal_terima: "2026-07-01",
  },
  {
    nik: "3201012345678901",
    nama: "Nining Suningsih",
    program: "Program Keluarga Harapan (PKH)",
    status: "Proses Verifikasi",
    tanggal_terima: "-",
  },
];
