# PRD: Database Website Desa Binanga

> **Versi:** 1.0  
> **Tanggal:** 14 Juli 2026  
> **Penulis:** Tim Pengembang  
> **Repositori:** https://github.com/Aepra/website-desa-binanga

---

## 1. Ringkasan Eksekutif

Website Desa Binanga membutuhkan sistem penyimpanan data yang **sederhana dan mudah dikelola** oleh operator desa. Dokumen ini mendefinisikan skema database yang optimal dengan memisahkan **data statis** (yang jarang berubah) dari **data dinamis** (yang dikelola admin secara rutin).

### Prinsip Desain
- **Minimalis:** Hanya 3 tabel database, selebihnya file statis.
- **Mudah dikelola:** Operator desa cukup mengelola data berita, UMKM, dan bansos.
- **Backward-compatible:** Struktur API tidak berubah saat migrasi ke database.
- **Scalable:** Bisa dimulai dari JSON, lalu migrasi ke Supabase/PostgreSQL tanpa ubah kode frontend.

---

## 2. Arsitektur Data

### 2.1 Klasifikasi Data

```
┌─────────────────────────────────────────────────────┐
│                    WEBSITE DESA                      │
├──────────────────────┬──────────────────────────────┤
│   DATA STATIS (JSON) │   DATA DINAMIS (DATABASE)    │
│   Jarang berubah     │   Dikelola admin rutin       │
├──────────────────────┼──────────────────────────────┤
│ • Profil Desa        │ • Berita / Pengumuman /      │
│ • Statistik Ringkas  │   Agenda (tabel: posts)      │
│ • Demografi          │ • Katalog UMKM (tabel: umkm) │
│ • APBDes             │ • Bantuan Sosial             │
│ • Perangkat Desa     │   (tabel: bansos)            │
│ • Peta Lokasi        │                              │
│ • Destinasi Wisata   │                              │
└──────────────────────┴──────────────────────────────┘
```

### 2.2 Struktur Folder

```
src/data/
├── static/                     ← Data statis (TypeScript)
│   ├── statistik.ts            ← Angka ringkasan homepage
│   ├── demografi.ts            ← Data kependudukan
│   ├── apbdes.ts               ← Anggaran tahunan
│   ├── perangkat-desa.ts       ← Daftar pejabat desa
│   ├── map-desa.ts             ← Koordinat lokasi penting
│   └── wisata.ts               ← Daftar destinasi wisata
│
├── dynamic/                    ← Data dinamis (dummy saat ini)
│   ├── posts.ts                ← Berita + Pengumuman + Agenda
│   ├── umkm.ts                 ← Katalog UMKM
│   └── bansos.ts               ← Data penerima bansos
│
src/lib/
└── api.ts                      ← API layer (baca dari static + dynamic)
```

---

## 3. Skema Database (3 Tabel)

### 3.1 Tabel `posts`

Menggabungkan 3 entitas yang memiliki struktur serupa: **Berita**, **Pengumuman**, dan **Agenda Kegiatan**.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | `TEXT` | PRIMARY KEY | ID unik, format: `post_xxxxx` |
| `type` | `TEXT` | NOT NULL, CHECK | `berita` \| `pengumuman` \| `agenda` |
| `judul` | `TEXT` | NOT NULL | Judul konten |
| `kategori` | `TEXT` | — | Kategori (Infrastruktur, Sosial, dll.) |
| `tanggal` | `TEXT` | NOT NULL | Tanggal publikasi, format: `YYYY-MM-DD` |
| `cover` | `TEXT` | — | URL gambar cover (khusus berita) |
| `ringkasan` | `TEXT` | — | Isi ringkasan / deskripsi konten |
| `lokasi` | `TEXT` | — | Lokasi kegiatan (khusus agenda) |
| `created_at` | `TEXT` | DEFAULT now | Timestamp pembuatan record |

**SQL:**
```sql
CREATE TABLE posts (
  id         TEXT PRIMARY KEY,
  type       TEXT NOT NULL CHECK(type IN ('berita', 'pengumuman', 'agenda')),
  judul      TEXT NOT NULL,
  kategori   TEXT,
  tanggal    TEXT NOT NULL,
  cover      TEXT,
  ringkasan  TEXT,
  lokasi     TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Index untuk query berdasarkan type
CREATE INDEX idx_posts_type ON posts(type);

-- Index untuk sorting berdasarkan tanggal
CREATE INDEX idx_posts_tanggal ON posts(tanggal DESC);
```

**Contoh Data:**
```sql
INSERT INTO posts (id, type, judul, kategori, tanggal, cover, ringkasan) VALUES
('post_b1', 'berita', 'Pembangunan Jalan Desa Tahap 2 Selesai', 'Infrastruktur', '2026-07-10', 'https://...', 'Proyek pengaspalan jalan desa sepanjang 2 km telah selesai.'),
('post_p1', 'pengumuman', 'Pengumuman Libur Pelayanan Balai Desa', NULL, '2026-08-12', NULL, 'Pelayanan administrasi diliburkan pada 17 Agustus 2026.'),
('post_a1', 'agenda', 'Musrenbangdes', NULL, '2026-07-20', NULL, NULL);
```

**Query Umum:**
```sql
-- Ambil semua berita, terbaru dulu
SELECT * FROM posts WHERE type = 'berita' ORDER BY tanggal DESC;

-- Ambil 3 berita terbaru untuk homepage
SELECT * FROM posts WHERE type = 'berita' ORDER BY tanggal DESC LIMIT 3;

-- Ambil semua pengumuman
SELECT * FROM posts WHERE type = 'pengumuman' ORDER BY tanggal DESC;

-- Ambil agenda mendatang
SELECT * FROM posts WHERE type = 'agenda' AND tanggal >= date('now') ORDER BY tanggal ASC;
```

---

### 3.2 Tabel `umkm`

Menyimpan katalog produk UMKM yang dijual oleh warga desa.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | `TEXT` | PRIMARY KEY | ID unik, format: `umkm_xxxxx` |
| `nama` | `TEXT` | NOT NULL | Nama produk/usaha |
| `kategori` | `TEXT` | NOT NULL | Kategori (Kuliner, Kerajinan, dll.) |
| `foto` | `TEXT` | — | URL foto produk |
| `deskripsi` | `TEXT` | — | Deskripsi singkat produk |
| `kontak` | `TEXT` | — | Nomor WhatsApp penjual |
| `created_at` | `TEXT` | DEFAULT now | Timestamp pembuatan record |

**SQL:**
```sql
CREATE TABLE umkm (
  id         TEXT PRIMARY KEY,
  nama       TEXT NOT NULL,
  kategori   TEXT NOT NULL,
  foto       TEXT,
  deskripsi  TEXT,
  kontak     TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Index untuk filter berdasarkan kategori
CREATE INDEX idx_umkm_kategori ON umkm(kategori);
```

**Contoh Data:**
```sql
INSERT INTO umkm (id, nama, kategori, foto, deskripsi, kontak) VALUES
('umkm_001', 'Kopi Tubruk Pak Wawan', 'Kuliner', 'https://...', 'Kopi hitam khas desa yang diproses secara tradisional.', '081234567890'),
('umkm_002', 'Kerajinan Anyaman Bambu Lestari', 'Kerajinan', 'https://...', 'Produk anyaman bambu ramah lingkungan.', '089876543210');
```

**Query Umum:**
```sql
-- Ambil semua UMKM
SELECT * FROM umkm ORDER BY created_at DESC;

-- Filter UMKM berdasarkan kategori
SELECT * FROM umkm WHERE kategori = 'Kuliner';
```

---

### 3.3 Tabel `bansos`

Menyimpan data penerima bantuan sosial untuk fitur "Cek Bansos".

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | `INTEGER` | PRIMARY KEY, AUTOINCREMENT | ID unik otomatis |
| `nik` | `TEXT` | NOT NULL, UNIQUE | 16 digit NIK penerima |
| `nama` | `TEXT` | NOT NULL | Nama lengkap penerima |
| `program` | `TEXT` | NOT NULL | Nama program bantuan |
| `status` | `TEXT` | NOT NULL, CHECK | `Tersalurkan` \| `Proses Verifikasi` |
| `tanggal_terima` | `TEXT` | — | Tanggal penerimaan bantuan |
| `created_at` | `TEXT` | DEFAULT now | Timestamp pembuatan record |

**SQL:**
```sql
CREATE TABLE bansos (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  nik             TEXT NOT NULL UNIQUE,
  nama            TEXT NOT NULL,
  program         TEXT NOT NULL,
  status          TEXT NOT NULL CHECK(status IN ('Tersalurkan', 'Proses Verifikasi')),
  tanggal_terima  TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

-- Index untuk pencarian berdasarkan NIK (fitur Cek Bansos)
CREATE INDEX idx_bansos_nik ON bansos(nik);
```

**Contoh Data:**
```sql
INSERT INTO bansos (nik, nama, program, status, tanggal_terima) VALUES
('1234567890123456', 'Slamet Riyadi', 'BLT Dana Desa', 'Tersalurkan', '2026-07-01'),
('3201012345678901', 'Nining Suningsih', 'Program Keluarga Harapan (PKH)', 'Proses Verifikasi', NULL);
```

**Query Umum:**
```sql
-- Cek bansos berdasarkan NIK (fitur utama)
SELECT * FROM bansos WHERE nik = '1234567890123456';

-- Lihat semua penerima yang sudah tersalurkan
SELECT * FROM bansos WHERE status = 'Tersalurkan' ORDER BY tanggal_terima DESC;

-- Hitung total penerima per program
SELECT program, COUNT(*) as jumlah FROM bansos GROUP BY program;
```

---

## 4. Diagram Relasi (ERD)

```
┌──────────────────────┐
│       POSTS          │
├──────────────────────┤
│ PK id         TEXT   │
│    type       TEXT   │  ← 'berita' | 'pengumuman' | 'agenda'
│    judul      TEXT   │
│    kategori   TEXT   │
│    tanggal    TEXT   │
│    cover      TEXT   │
│    ringkasan  TEXT   │
│    lokasi     TEXT   │
│    created_at TEXT   │
└──────────────────────┘

┌──────────────────────┐
│       UMKM           │
├──────────────────────┤
│ PK id         TEXT   │
│    nama       TEXT   │
│    kategori   TEXT   │
│    foto       TEXT   │
│    deskripsi  TEXT   │
│    kontak     TEXT   │
│    created_at TEXT   │
└──────────────────────┘

┌──────────────────────────┐
│       BANSOS             │
├──────────────────────────┤
│ PK id              INT   │  (AUTOINCREMENT)
│ UK nik             TEXT  │  (UNIQUE — untuk pencarian)
│    nama            TEXT  │
│    program         TEXT  │
│    status          TEXT  │
│    tanggal_terima  TEXT  │
│    created_at      TEXT  │
└──────────────────────────┘
```

> **Catatan:** Ketiga tabel ini **independen** (tidak saling berelasi). Ini disengaja agar sederhana dan mudah dikelola.

---

## 5. Data Statis (Bukan Database)

Data berikut **tidak masuk database** karena jarang berubah. Disimpan sebagai file TypeScript di `src/data/static/`.

| File | Isi | Kapan Diupdate |
|---|---|---|
| `statistik.ts` | Jumlah penduduk, KK, luas wilayah, realisasi APBDes | Setahun sekali |
| `demografi.ts` | Distribusi jenis kelamin dan kelompok usia | Setahun sekali |
| `apbdes.ts` | Rincian pendapatan dan belanja desa per tahun | Setahun sekali |
| `perangkat-desa.ts` | Daftar nama dan jabatan pejabat desa | Saat ada pergantian |
| `map-desa.ts` | Koordinat lokasi penting (balai desa, puskesmas, pasar) | Sangat jarang |
| `wisata.ts` | Daftar destinasi wisata desa | Saat ada destinasi baru |

**Cara update:** Edit file `.ts` langsung, commit, dan deploy ulang.

---

## 6. Mapping API → Database

Tabel berikut menunjukkan fungsi API mana yang membaca dari database dan mana yang membaca file statis.

| Fungsi API | Sumber Data | Tabel/File |
|---|---|---|
| `getStatistik()` | Statis | `static/statistik.ts` |
| `getDemografi()` | Statis | `static/demografi.ts` |
| `getAPBDes()` | Statis | `static/apbdes.ts` |
| `getPerangkatDesa()` | Statis | `static/perangkat-desa.ts` |
| `getMapDesa()` | Statis | `static/map-desa.ts` |
| `getAllWisata()` | Statis | `static/wisata.ts` |
| `getAllBerita()` | **Database** | `posts` WHERE type='berita' |
| `getLatestBerita(n)` | **Database** | `posts` WHERE type='berita' LIMIT n |
| `getAllPengumuman()` | **Database** | `posts` WHERE type='pengumuman' |
| `getUpcomingAgenda(n)` | **Database** | `posts` WHERE type='agenda' LIMIT n |
| `getAllUMKM()` | **Database** | `umkm` |
| `cekBansos(nik)` | **Database** | `bansos` WHERE nik=? |

---

## 7. Rekomendasi Teknologi Database

| Opsi | Hosting | Harga | Kelebihan | Cocok Untuk |
|---|---|---|---|---|
| **Supabase** | Cloud (PostgreSQL) | Gratis (tier free) | REST API otomatis, dashboard admin, auth bawaan | ⭐ **Paling direkomendasikan** |
| **SQLite + Prisma** | Server sendiri | Gratis | Ringan, file-based, tanpa server terpisah | Skala kecil, 1 operator |
| **PlanetScale** | Cloud (MySQL) | Gratis (hobby tier) | Serverless, branching | Tim kecil |
| **Turso (libSQL)** | Edge | Gratis (starter) | Ultra ringan, edge-native | Performa tinggi |

### Rekomendasi: **Supabase**
- Gratis untuk proyek kecil (500 MB database, 1 GB storage)
- Dashboard visual untuk operator desa (tanpa perlu coding)
- REST API otomatis — cukup ganti file `dynamic/*.ts` dengan `supabase.from('posts').select()`
- Built-in Authentication untuk halaman admin

---

## 8. Rencana Migrasi

Saat siap migrasi ke database (contoh: Supabase):

### Langkah-langkah:
1. Buat proyek Supabase baru
2. Jalankan SQL CREATE TABLE dari Bagian 3 di atas
3. Insert data dummy dari file `dynamic/*.ts`
4. Install `@supabase/supabase-js`
5. Buat file `src/lib/supabase.ts` untuk koneksi
6. Update `src/lib/api.ts` — ganti import `dynamic/*` dengan query Supabase
7. Test semua halaman
8. Deploy

### Estimasi Waktu: **2-3 jam**

---

## 9. Ringkasan

| Metrik | Nilai |
|---|---|
| Total tabel database | **3** |
| Total file data statis | **6** |
| Total kolom di semua tabel | **21** |
| Relasi antar tabel | **0** (independen) |
| Estimasi migrasi ke Supabase | **2-3 jam** |
