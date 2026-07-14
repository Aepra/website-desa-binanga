# 📄 PRD 05 — Smart Village Platform: Admin CMS & Core System

## Document Control
| Version | Date | Author | Status | Remarks |
|---------|------|--------|--------|---------|
| 1.0 | 2026-07-10 | Product Team | DRAFT | Initial Draft for PRD 05 |

---

## Chapter 1 — Product Overview

### 1.1 Executive Summary
PRD 05 mendefinisikan "Dapur" dari sistem ini. Semua konten, persetujuan surat, input data, dan konfigurasi platform dilakukan di Admin CMS (Content Management System). Bab ini juga mencakup arsitektur Database, perancangan API (REST/GraphQL), keamanan siber (Security), dan pengoptimalan performa.

### 1.2 Goals
- Membangun antarmuka admin yang intuitif, setara dengan UI modern seperti Vercel Dashboard atau Supabase.
- Menerapkan Role-Based Access Control (RBAC) yang sangat ketat untuk mencegah kebocoran data privasi warga.
- Memastikan sistem kebal terhadap eksploitasi web standar (OWASP Top 10).

---

## Chapter 2 — Dashboard Admin & UX

### 2.1 Layout System
- **Sidebar:** Navigasi bertingkat (nested) dengan icon, dapat dikollaps menjadi mini-sidebar.
- **Top Bar:** Global Search (mencari penduduk, no surat, nama artikel dengan cepat via `Ctrl+K`), Notifikasi, Profil, dan Theme Toggle (Dark/Light).
- **Data Tables:** Menggunakan komponen tabel performa tinggi (TanStack Table) yang mendukung pagination server-side, sorting, filtering, row selection, dan inline-editing.
- **Form Components:** Menggunakan React Hook Form + Zod untuk validasi skema yang ketat dan feedback error secara real-time.

### 2.2 Role & Permission Management (RBAC)
Sistem memiliki kontrol otorisasi granular.
- **Super Admin (Sekdes / IT Desa):** Akses penuh ke seluruh modul, pengaturan sistem, dan database backup.
- **Kepala Desa:** Akses View-Only untuk seluruh dashboard, dan akses Action khusus untuk validasi Surat dan Anggaran.
- **Operator Kependudukan:** Akses CRUD Data Kependudukan saja, tidak bisa mengedit konten Berita/Website.
- **Editor Berita/Web:** Akses ke CMS Artikel, Galeri, dan Profil. Tidak bisa melihat NIK/Data Penduduk.
- **Ketua RT/RW:** Akses terbatas hanya bisa melihat dan memvalidasi data warganya sendiri (Row-Level Security).

---

## Chapter 3 — CMS Web & Portal (Manajemen Konten)

### 3.1 Berita & Artikel
- Rich Text Editor modern (TipTap atau Editor.js).
- Mendukung fitur SEO Management (Meta Title, Description, OpenGraph Image per artikel).
- Sistem Status: Draft, Scheduled, Published.

### 3.2 Galeri & Media Library
- Sistem manajemen aset file terpusat.
- Mendukung drag-and-drop upload.
- Otomatis mengubah format gambar ke WebP dan membuat versi thumbnail, medium, dan large.

---

## Chapter 4 — Database Design (Core Tables)

Sistem menggunakan RDBMS relasional (PostgreSQL/MySQL).

### 4.1 Entities & Relasi (Overview ERD)
- `users`: (id, role_id, username, password_hash)
- `penduduk`: (id, nik (UNIQUE, INDEX), no_kk (FK), nama, tgl_lahir, ...)
- `keluarga`: (id, no_kk (UNIQUE), alamat, rt, rw, geom (Geometry))
- `surat_permohonan`: (id, penduduk_id, jenis_surat_id, status, tgl_pengajuan, file_url)
- `berita`: (id, title, slug, content, author_id, published_at)

### 4.2 Indexing & Optimasi
- B-Tree Indexing pada kolom pencarian utama (NIK, Nama, Status).
- Spasial Index (GIST) pada kolom geometri peta.

---

## Chapter 5 — API Design

- **Pendekatan:** RESTful API (atau GraphQL).
- **Format Response Standar:**
  ```json
  {
    "status": "success",
    "message": "Data retrieved successfully",
    "data": { ... },
    "meta": { "page": 1, "total": 50 } // untuk paginasi
  }
  ```
- **Keamanan API:** Menggunakan JWT (JSON Web Token) dengan HttpOnly Cookies untuk mencegah serangan XSS. Refresh token mechanism diimplementasikan.

---

## Chapter 6 — Security (Keamanan)

Sistem mengelola NIK masyarakat, sehingga keamanan adalah prioritas mutlak.
- **XSS & SQL Injection:** Sanitasi otomatis pada ORM (Prisma/Drizzle) dan DOM Escaping di frontend (React).
- **Rate Limiting:** Mencegah serangan brute-force login dan API spam (maks 100 req/menit per IP).
- **Audit Logs:** Setiap aksi (CREATE, UPDATE, DELETE) oleh Admin akan direkam ke tabel `audit_logs` (Siapa, Melakukan Apa, Kapan, IP Address, Nilai Lama, Nilai Baru).
- **Data Encryption:** Password disimpan dengan Bcrypt/Argon2. Data sensitif tambahan mungkin dienkripsi di level kolom.

---

## Chapter 7 — Performance & Future Dev

### 7.1 Performance
- Caching pada API endpoints yang sering diakses (seperti struktur desa) menggunakan Redis.
- Lazy Loading / Code Splitting di React untuk memastikan ukuran bundel JS (First Load) tetap kecil.

### 7.2 Future Development (V2.0 Roadmap)
- Integrasi IoT (Sensor Cuaca / Kualitas Udara di Balai Desa).
- Chatbot AI berbasis LLM lokal untuk menjawab pertanyaan warga mengenai syarat pembuatan surat 24/7.
- Sistem Pertanian Cerdas (Smart Agriculture Mapping).

---
*(Platform manajemen data ini didesain agar scalable, tangguh, dan dapat diadopsi tidak hanya oleh satu desa, namun bisa dipasarkan dalam model SaaS (Software as a Service) Multi-Tenant untuk banyak desa (Kabupaten)).*
