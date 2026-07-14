# 📄 PRD 01 — Smart Village Platform: Landing Page & Public Portal

## Document Control
| Version | Date | Author | Status | Remarks |
|---------|------|--------|--------|---------|
| 1.0 | 2026-07-10 | Product Team | DRAFT | Initial Draft for PRD 01 |

---

## Chapter 1 — Product Overview

### 1.1 Executive Summary
Smart Village Platform adalah inisiatif digitalisasi desa yang komprehensif, bertujuan untuk mentransformasi desa tradisional menjadi ekosistem cerdas yang terhubung. Platform ini tidak hanya sekadar website profil, melainkan portal terintegrasi yang mencakup transparansi data (dashboard), pelayanan publik digital, Sistem Informasi Geografis (GIS), manajemen bantuan sosial, serta pengembangan potensi lokal (UMKM & Wisata). Dokumen PRD 01 ini secara spesifik mendefinisikan ruang lingkup untuk **Landing Page & Public Portal**.

### 1.2 Vision
Menjadi standar emas platform desa digital di Indonesia yang mewujudkan tata kelola pemerintahan desa yang transparan, responsif, dan berbasis data.

### 1.3 Mission
1. Meningkatkan aksesibilitas informasi dan layanan desa bagi seluruh masyarakat.
2. Mendorong transparansi pemerintahan desa, khususnya dalam pengelolaan dana desa dan bantuan sosial.
3. Memajukan ekonomi lokal dengan mendigitalkan sektor UMKM dan pariwisata desa.

### 1.4 Goals
- **Q3 2026:** Meluncurkan MVP (Minimum Viable Product) untuk Public Portal & Landing Page.
- **Q4 2026:** Mencapai 10.000+ kunjungan organik per bulan dan 80% adopsi warga untuk akses informasi.
- **Q1 2027:** Integrasi penuh layanan publik digital di seluruh lapisan masyarakat desa.

### 1.5 Background
Banyak desa di Indonesia masih mengandalkan sistem manual atau memiliki website profil yang statis dan tidak interaktif. Hal ini menyebabkan lambatnya pelayanan, rendahnya partisipasi masyarakat, dan tidak optimalnya pemanfaatan potensi desa (UMKM/Wisata). Diperlukan sebuah lompatan dari "Website Profil" menjadi "Smart Village Platform".

### 1.6 Problems
- **Kurangnya Transparansi:** Warga kesulitan mengakses informasi terkait APBDes, proyek pembangunan, dan distribusi bantuan sosial.
- **Pelayanan Konvensional:** Proses birokrasi surat-menyurat masih manual dan memakan waktu.
- **Potensi Terpendam:** Produk UMKM lokal dan destinasi wisata desa kurang terekspos ke dunia luar.
- **Data Tidak Terpusat:** Data kependudukan, demografi, dan statistik desa tersebar dan tidak real-time.

### 1.7 Solutions
Membangun platform terpusat berbasis web yang menyediakan:
- Akses real-time ke data dan statistik desa (Live Dashboard).
- Portal promosi interaktif untuk UMKM dan Wisata desa (Virtual Tour, GIS).
- Portal informasi yang responsif, cepat, dan mudah diakses dari perangkat mobile.

### 1.8 Scope
- Landing Page interaktif dengan animasi dan integrasi 3D/Map.
- Halaman Profil Desa, Pemerintahan, dan Informasi Demografi Dasar.
- Portal Berita, Artikel, dan Pengumuman.
- Portal Publik untuk UMKM dan Wisata Desa.
- SEO Optimization & Mobile-First Design.

### 1.9 Out of Scope (Covered in other PRDs)
- Sistem Informasi Desa & Dashboard Internal (PRD 02).
- Layanan Surat Menyurat & Pengaduan (PRD 03).
- GIS & Data Analytics Lanjutan (PRD 04).
- Admin CMS & Manajemen Data Internal (PRD 05).

### 1.10 Success Metrics
- **Page Load Time:** < 2 detik (LCP under 2.5s).
- **Bounce Rate:** < 40% pada Landing Page.
- **SEO Score:** 95+ (Lighthouse).
- **Accessibility Score:** 90+ (WCAG 2.1 AA compliant).

### 1.11 Stakeholders
- **Kepala Desa:** Sponsor utama, membutuhkan visibilitas kinerja.
- **Sekretaris Desa & Perangkat:** Pengguna operasional (Admin).
- **Masyarakat Desa:** Pengguna akhir, pencari informasi.
- **Investor & Wisatawan:** Pengguna eksternal, target audiens untuk fitur ekonomi.

---

## Chapter 2 — User Research

### 2.1 Masyarakat Desa
- **Goals:** Mendapatkan informasi terbaru tentang desa, mengecek transparansi dana, dan mengetahui jadwal agenda desa.
- **Pain Points:** Website desa saat ini lambat, membosankan, dan tidak memiliki informasi yang relevan/update. Sering kali sulit diakses lewat HP.
- **Behavior:** Mengakses informasi melalui smartphone, lebih menyukai konten visual (grafik, foto, video) daripada teks panjang.
- **Needs:** Antarmuka mobile-friendly, navigasi yang jelas (Quick Services), dan akses instan ke pengumuman penting.

### 2.2 Wisatawan
- **Goals:** Mencari destinasi wisata alternatif yang autentik, mengecek fasilitas, harga tiket, dan rute perjalanan.
- **Pain Points:** Kurangnya informasi resmi, foto resolusi rendah, dan tidak adanya integrasi peta (GIS) yang akurat.
- **Needs:** Galeri interaktif (Drone/Virtual Tour), peta lokasi yang terintegrasi (MapLibre/Deck.gl), dan ulasan wisata.

### 2.3 Investor
- **Goals:** Melihat potensi desa (pertanian, peternakan, pariwisata) untuk peluang investasi.
- **Pain Points:** Data statistik desa tidak valid, sulit menemukan kontak resmi, tidak ada peta potensi (Heatmap).
- **Needs:** Dashboard data real-time, GIS Preview untuk pemetaan lahan, dan portofolio produk UMKM.

---

## Chapter 3 — Information Architecture (Public Portal)

### 3.1 Sitemap
```text
🌐 Public Portal
├── 🏠 Home (Landing Page)
├── 📖 Profil Desa
│   ├── Sejarah
│   ├── Visi & Misi
│   ├── Wilayah & Geografis
│   ├── Perangkat Desa & Struktur
│   └── Prestasi & Penghargaan
├── 📊 Data & Statistik (Preview)
│   ├── Demografi Penduduk
│   ├── Pendidikan & Pekerjaan
│   └── Transparansi APBDes
├── 📰 Berita & Agenda
│   ├── Berita Desa
│   ├── Pengumuman
│   └── Agenda Kegiatan
├── 🛍️ UMKM & Potensi
│   ├── Katalog Produk
│   └── Profil Usaha
├── 🏖️ Wisata
│   ├── Destinasi
│   ├── Galeri (Virtual Tour)
│   └── Peta Wisata
└── 📞 Kontak & Bantuan
    ├── FAQ
    └── Form Kontak
```

---

## Chapter 4 — Landing Page

Landing Page harus memberikan efek **"WOW"** sejak detik pertama. Menggabungkan estetika modern (Glassmorphism, animasi halus) dengan fungsionalitas tinggi.

### 4.1 Hero Section
- **Objective:** Memberikan kesan pertama yang menakjubkan, merepresentasikan desa sebagai entitas modern namun tetap berakar pada budaya lokal.
- **Components:**
  - **Background:** Video loop kualitas tinggi (drone shot desa) atau 3D Interactive Map (menggunakan Deck.gl/MapLibre) di latar belakang.
  - **Headline:** Typography tebal, modern (misal: Font 'Inter' atau 'Outfit').
  - **Sub-headline:** Penjelasan singkat visi desa.
  - **CTA (Call to Action):** Primary button ("Jelajahi Desa"), Secondary button ("Layanan Publik").
- **Data Source:** CMS Settings untuk teks, URL video/model.
- **Responsive Behavior:** Teks mengecil dan video disesuaikan crop-nya untuk tampilan mobile. CTA menjadi block (full-width) di mobile.
- **Animation:** Fade-in dari bawah dengan stagger (Framer Motion). Parallax effect saat scroll.
- **Accessibility:** Kontras warna teks terhadap video background (menggunakan overlay gelap), ARIA labels pada tombol.

### 4.2 Quick Services (Layanan Cepat)
- **Objective:** Jalan pintas ke fitur-fitur yang paling sering dicari.
- **Components:** Grid (4-6 item) dengan ikon modern (Lucide Icons atau Heroicons).
  - *Buat Surat* (Link ke PRD 03)
  - *Cek Bansos* (Link ke PRD 02)
  - *Lapor* (Pengaduan)
  - *Peta Desa* (GIS)
- **Hover Effect:** Ikon membesar (scale 1.1), bayangan (box-shadow) menyala dengan aksen warna utama.

### 4.3 Live Dashboard & Statistics
- **Objective:** Menunjukkan bahwa desa ini transparan dan digerakkan oleh data (data-driven).
- **Components:** 
  - Angka yang berputar (Counter animation) saat di-scroll ke area ini.
  - Menampilkan: Jumlah Penduduk, Luas Wilayah, Jumlah UMKM, Realisasi Anggaran (%).
- **Data Source:** Fetch data dari API Statistik (DuckDB WASM cache).

### 4.4 APBDes Dashboard Preview
- **Objective:** Transparansi dana desa secara sekilas.
- **Components:** Mini chart (Donut Chart atau Bar Chart sederhana menggunakan Recharts/Chart.js). Menampilkan proporsi Pendapatan vs Belanja.

### 4.5 GIS Preview (Interactive Map)
- **Objective:** Menggoda pengguna untuk mengeksplorasi peta desa secara mendalam.
- **Components:** 
  - Peta embed berukuran sedang (MapLibre GL). 
  - Menampilkan marker 3D (Deck.gl) dari beberapa landmark penting (Balai Desa, Pusat Wisata).
- **Animation:** Peta otomatis berputar perlahan (flyTo/rotate) jika tidak diinteraksi.

### 4.6 Berita & Agenda Terkini
- **Components:** Carousel/Grid dari 3 berita terbaru dan 2 agenda terdekat.
- **Card Design:** Image cover, tag kategori, judul, tanggal, dan efek hover (gambar zoom-in dalam container).

### 4.7 Footer
- **Components:** Logo, Alamat lengkap, Peta Statis, Link Navigasi Cepat, Social Media Icons, Copyright. 
- **Style:** Dark mode dengan warna kontras yang elegan.

---

## Chapter 5 — Profil Desa & Pemerintahan

### 5.1 Sejarah, Visi, Misi
- Menggunakan layout editorial (seperti majalah digital). Tipografi besar, pull-quotes, dan gambar arsip historis dengan efek sepia atau modern filter.

### 5.2 Struktur Organisasi Pemerintahan
- **Visualisasi:** Bagan hierarki interaktif. Bukan sekadar gambar statis.
- **Interaksi:** Jika foto/kartu perangkat desa diklik, akan muncul modal (dialog) berisi profil singkat, tugas pokok, dan kontak dinas.

### 5.3 Prestasi & Dokumen Publik
- **Prestasi:** Timeline view atau Masonry grid untuk sertifikat dan piala.
- **Dokumen Publik:** Tabel interaktif (RPJMDes, RKPDes) yang bisa dicari (searchable) dan diunduh (PDF).

---

## Chapter 6 — UMKM & Potensi Desa (Public Portal)

### 6.1 Direktori UMKM
- **Layout:** Grid cards (Mirip e-commerce modern).
- **Fitur Card:** Foto produk kualitas tinggi, Nama Usaha, Kategori (Kuliner, Kerajinan, Pertanian), Badge Verifikasi Desa, dan Tombol "Hubungi via WhatsApp".
- **Filter & Search:** Berbasis kategori dan pencarian real-time (Debounced search).

---

## Chapter 7 — Wisata Desa (Public Portal)

### 7.1 Landing Page Wisata
- Halaman tematik dengan dominasi visual yang memanjakan mata.
- **Virtual Tour / Drone View:** Integrasi panorama 360 derajat (menggunakan Pannellum atau Marzipano).
- **Detail Destinasi:** Lokasi (GIS map), Harga Tiket, Fasilitas (Ikon-ikon kecil), Galeri Foto, dan Ulasan Warga/Pengunjung.

---

*(Catatan: PRD ini akan menjadi acuan pengembangan untuk sprint fase pertama. Desain UI/UX harus merujuk pada standar estetika premium dengan micro-animations dan performa tinggi yang direpresentasikan melalui metrik lighthouse > 95).*
