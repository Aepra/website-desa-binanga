export const daftarLayanan = [
  {
    id: 'sku',
    title: 'Surat Keterangan Usaha (SKU)',
    kategori: 'Pelayanan Usaha',
    desc: 'Surat keterangan resmi untuk keperluan kelengkapan pengajuan kredit bank, izin usaha, atau bantuan UMKM.',
    syarat: ['Foto KTP Pemohon', 'Foto KK', 'Foto Tempat / Produk Usaha'],
    estimasi: '1 - 2 Hari Kerja',
    badge: 'Populer',
    fields: [
      { name: 'namaUsaha', label: 'Nama Usaha', type: 'text', placeholder: 'Contoh: Warung Sembako Makmur', required: true },
      { name: 'jenisUsaha', label: 'Jenis/Bidang Usaha', type: 'text', placeholder: 'Contoh: Perdagangan Eceran', required: true },
      { name: 'alamatUsaha', label: 'Alamat Tempat Usaha', type: 'textarea', placeholder: 'Alamat lengkap tempat usaha dijalankan...', required: true },
      { name: 'noWhatsapp', label: 'No. WhatsApp Aktif', type: 'text', placeholder: 'Contoh: 081234567890', required: true }
    ]
  },
  {
    id: 'ktp-kk',
    title: 'Surat Pengantar KTP / KK',
    kategori: 'Kependudukan',
    desc: 'Surat pengantar resmi dari desa untuk penerbitan/perubahan data KTP-el dan Kartu Keluarga di Disdukcapil.',
    syarat: ['Foto Kartu Keluarga (KK)', 'Foto KTP Lama / Surat Kehilangan dari Polisi'],
    estimasi: '1 Hari Kerja',
    badge: 'Utama',
    fields: [
      { name: 'keperluan', label: 'Keperluan Pengantar', type: 'text', placeholder: 'Contoh: Perubahan Data / Buat Baru / Hilang', required: true },
      { name: 'keteranganTambahan', label: 'Keterangan Tambahan', type: 'textarea', placeholder: 'Sebutkan data yang ingin diubah (jika ada)...', required: false }
    ]
  },
  {
    id: 'domisili',
    title: 'Surat Keterangan Domisili',
    kategori: 'Kependudukan',
    desc: 'Surat bukti tempat tinggal/domisili warga atau badan usaha di wilayah Desa Binanga.',
    syarat: ['Foto KTP Pemohon', 'Foto KK'],
    estimasi: '1 Hari Kerja',
    badge: 'Cepat',
    fields: [
      { name: 'alamatLengkap', label: 'Alamat Domisili Sekarang', type: 'textarea', placeholder: 'Dusun, RT/RW, beserta nama jalan...', required: true },
      { name: 'alasanPindah', label: 'Tujuan Pembuatan Domisili', type: 'text', placeholder: 'Contoh: Syarat Melamar Pekerjaan', required: true }
    ]
  },
  {
    id: 'sktm',
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    kategori: 'Bantuan Sosial & Pendidikan',
    desc: 'Surat keterangan untuk beasiswa sekolah/kuliah, keringanan biaya berobat rumah sakit, atau bantuan bansos.',
    syarat: ['Foto KTP Pemohon', 'Foto KK', 'Surat Pengantar RT/RW / Kepala Dusun'],
    estimasi: '1 - 2 Hari Kerja',
    badge: 'Sosial',
    fields: [
      { name: 'tujuan', label: 'Tujuan Penggunaan SKTM', type: 'text', placeholder: 'Contoh: Daftar KIP Kuliah / Keringanan RS', required: true },
      { name: 'namaTujuan', label: 'Nama Lengkap yang Membutuhkan (jika untuk anak)', type: 'text', placeholder: 'Opsional, isi jika SKTM ditujukan untuk anggota keluarga lain', required: false }
    ]
  },
  {
    id: 'aduan',
    title: 'Pengaduan & Aspirasi Warga',
    kategori: 'Layanan Publik',
    desc: 'Wadah penyampaian laporan kejadian, pengaduan infrastruktur jalan/fasilitas, atau aspirasi ke Pemerintah Desa.',
    syarat: ['Foto Bukti Kejadian / Lokasi (Wajib)'],
    estimasi: 'Ditanggapi 24 Jam',
    badge: 'Responsif',
    fields: [
      { name: 'lokasi', label: 'Lokasi Kejadian / Infrastruktur', type: 'text', placeholder: 'Contoh: Jalan Dusun X, dekat jembatan...', required: true },
      { name: 'kronologi', label: 'Uraian Pengaduan / Aspirasi', type: 'textarea', placeholder: 'Jelaskan secara lengkap pengaduan atau aspirasi Anda...', required: true }
    ]
  },
  {
    id: 'informasi',
    title: 'Permohonan Informasi Publik',
    kategori: 'Transparansi',
    desc: 'Permohonan data atau dokumen publik desa sesuai undang-undang keterbukaan informasi publik.',
    syarat: ['Foto KTP Pemohon / Surat Tugas'],
    estimasi: '2 - 3 Hari Kerja',
    badge: 'Publik',
    fields: [
      { name: 'informasiDiminta', label: 'Informasi/Data yang Diminta', type: 'textarea', placeholder: 'Sebutkan dengan jelas data atau dokumen yang dibutuhkan...', required: true },
      { name: 'tujuanPenggunaan', label: 'Tujuan Penggunaan Data', type: 'text', placeholder: 'Contoh: Penelitian Akademis / Tugas Kuliah', required: true }
    ]
  }
];
