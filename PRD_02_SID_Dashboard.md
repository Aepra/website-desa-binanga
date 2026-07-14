# 📄 PRD 02 — Smart Village Platform: Sistem Informasi Desa & Dashboard Data

## Document Control
| Version | Date | Author | Status | Remarks |
|---------|------|--------|--------|---------|
| 1.0 | 2026-07-10 | Product Team | DRAFT | Initial Draft for PRD 02 |

---

## Chapter 1 — Product Overview

### 1.1 Executive Summary
PRD 02 fokus pada mesin utama dari Smart Village Platform, yaitu **Sistem Informasi Desa (SID) dan Dashboard Data**. Bagian ini merupakan fondasi "Smart" dari desa, yang mentransformasi tumpukan data kertas dan Excel menjadi analitik visual interaktif berkecepatan tinggi, memfasilitasi pengambilan keputusan (Data-Driven Policy) oleh Kepala Desa dan transparansi bagi masyarakat.

### 1.2 Goals
- Mendigitalkan 100% data demografi, sosial, dan ekonomi desa.
- Menyediakan arsitektur data performa tinggi (memanfaatkan DuckDB WASM di client untuk query kilat).
- Menghadirkan visualisasi data yang sekelas dengan dashboard Business Intelligence (BI) profesional.

---

## Chapter 2 — Arsitektur Data & Dashboard

### 2.1 The "Control Room" Concept
Dashboard didesain layaknya "Command Center" atau Control Room. Menggunakan Dark Mode yang premium (tema warna slate/zinc dengan aksen neon seperti teal atau electric blue) agar data terlihat kontras, elegan, dan menonjol.

### 2.2 Teknologi Utama (Rekomendasi)
- **Frontend Framework:** React (Vite) atau Next.js.
- **State & Data Processing:** DuckDB WASM untuk analitik data besar di browser tanpa membebani server, Apache Arrow untuk transfer data.
- **Visualization:** Recharts, Nivo, atau ECharts untuk chart kompleks.
- **Map:** MapLibre GL JS + Deck.gl.

---

## Chapter 3 — Modul Data Demografi & Kependudukan (Detail)

Ini adalah inti dari SID. Data yang dikelola harus mencakup ratusan variabel yang dinormalisasi.

### 3.1 Data Penduduk (Individu)
- NIK, No KK, Nama Lengkap, Tempat/Tgl Lahir.
- Jenis Kelamin, Agama, Golongan Darah.
- Pendidikan (Sedang Ditempuh vs Terakhir).
- Pekerjaan Utama, Penghasilan Rata-rata.
- Status Perkawinan, Status Hubungan Dalam Keluarga (SHDK).
- Kewarganegaraan, Etnis/Suku (Opsional untuk analisis sosial).
- Kondisi Kesehatan Khusus (Disabilitas, Riwayat Penyakit Kronis, Stunting).

### 3.2 Data Keluarga (KK)
- Nomor KK, Kepala Keluarga, Alamat Lengkap (Jalan, RT, RW, Dusun).
- Status Kepemilikan Rumah (Milik sendiri, Sewa, Menumpang).
- Titik Koordinat Rumah (Latitude, Longitude) -> *Krusial untuk GIS*.
- Indikator Kesejahteraan (Akses Listrik, Sumber Air Bersih, Sanitasi/Jamban).

### 3.3 Dashboard Demografi Penduduk
Halaman visualisasi interaktif yang bisa diakses publik (dengan masking data sensitif) dan admin (full data).
- **Piramida Penduduk:** Visualisasi interaktif berbasis umur dan jenis kelamin.
- **Heatmap Persebaran:** Integrasi dengan Deck.gl untuk melihat kepadatan penduduk per RT/RW dalam bentuk 3D Hexagon layer.
- **Trend Pertumbuhan:** Line chart kelahiran vs kematian, mutasi masuk vs keluar.

---

## Chapter 4 — Transparansi APBDes (Anggaran Desa)

### 4.1 Objective
Membuat data keuangan desa yang biasanya membosankan menjadi interaktif, mudah dipahami masyarakat awam, dan membangun kepercayaan.

### 4.2 Fitur & Visualisasi
- **Sankey Diagram:** Menggambarkan aliran dana dari sumber Pendapatan (Dana Desa, PADes, Bantuan Provinsi) mengalir ke bidang-bidang Belanja (Penyelenggaraan Pemerintahan, Pembangunan, Pembinaan Kemasyarakatan).
- **Real-time Progress Bar:** Menunjukkan persentase realisasi anggaran vs target per bulan/kuartal.
- **Rincian Proyek:** Tabel interaktif yang berisi daftar proyek fisik (misal: Pembangunan Jalan Beton), lokasi (Pin map), anggaran, foto *Before-After*, dan status pengerjaan.

---

## Chapter 5 — Dashboard Bantuan Sosial (Bansos)

### 5.1 Permasalahan Saat Ini
Distribusi bansos sering kali tumpang tindih (satu KK mendapat 3 bantuan, KK lain tidak mendapat sama sekali) dan kurang transparan.

### 5.2 Fitur Utama Dashboard Bansos
- **Data Integrasi:** Memetakan program (PKH, BLT Dana Desa, BPNT, Bantuan Bedah Rumah).
- **Venn Diagram Analytics:** Menampilkan irisan penerima antar program (mendeteksi duplikasi/overlap).
- **Matriks Kemiskinan vs Distribusi:** Scatter plot antara tingkat ekonomi (sumbu X) dan nilai bantuan yang diterima (sumbu Y) untuk melihat ketepatan sasaran.
- **Pencarian Cek Bansos Publik:** Form di mana warga bisa memasukkan NIK/No KK untuk melihat status penerimaan mereka (dengan enkripsi/masking).

---

## Chapter 6 — Kesehatan & Pendidikan (Smart Analytics)

### 6.1 Dashboard Stunting & Gizi Anak
- Tracking berat/tinggi badan balita (Posyandu).
- Visualisasi zona rawan stunting berdasarkan lokasi (RT/RW).
- Prediksi tren menggunakan regresi linear sederhana (Data Science dasar).

### 6.2 Dashboard Pendidikan
- Angka Putus Sekolah per dusun.
- Tingkat literasi dan akses ke fasilitas pendidikan.
- Korelasi antara tingkat pendidikan kepala keluarga dengan kesejahteraan ekonomi (Interactive Bubble Chart).

---

## Chapter 7 — UX & Interactivity Requirements

### 7.1 Cross-Filtering
Jika pengguna mengklik batang "RT 01" pada Bar Chart populasi, seluruh dashboard (Piramida penduduk, Map, Tabel) harus secara instan (real-time, <100ms) ter-filter hanya untuk data RT 01. Ini dicapai dengan menggunakan DuckDB WASM.

### 7.2 Export & Reporting
- Fitur *Export to PDF* (Generate Laporan Resmi dengan kop surat desa).
- Fitur *Export to Excel/CSV* untuk kebutuhan audit.

---
*(PRD 02 ini merinci bagian analitik dan data. Keberhasilan implementasi ini akan membuktikan bahwa aplikasi ini bukan sekadar website, melainkan sebuah platform Enterprise-grade untuk skala desa).*
