# 📄 PRD 03 — Smart Village Platform: Layanan Masyarakat & E-Government

## Document Control
| Version | Date | Author | Status | Remarks |
|---------|------|--------|--------|---------|
| 1.0 | 2026-07-10 | Product Team | DRAFT | Initial Draft for PRD 03 |

---

## Chapter 1 — Product Overview

### 1.1 Executive Summary
PRD 03 mengupas tuntas sistem birokrasi dan pelayanan publik digital (E-Government) di tingkat desa. Fokus utamanya adalah memangkas waktu pengurusan birokrasi dari hitungan hari menjadi hitungan menit, menghilangkan kebutuhan warga untuk datang ke balai desa hanya untuk urusan administrasi dasar, dan menciptakan jalur komunikasi pengaduan yang tertata dan dapat dilacak (trackable).

### 1.2 Goals
- Implementasi Zero-Paper (Paperless) untuk 80% pelayanan administrasi desa.
- Warga dapat melacak status permohonan secara real-time layaknya melacak paket e-commerce.
- Menyediakan Tanda Tangan Elektronik (TTE) tersertifikasi atau minimal QR-Code validation untuk keabsahan dokumen.

---

## Chapter 2 — Sistem Pelayanan Surat (E-Surat)

### 2.1 Daftar Layanan (Use Cases)
Sistem harus mengakomodasi pembuatan otomatis puluhan jenis surat, antara lain:
- Surat Keterangan Domisili
- Surat Keterangan Usaha (SKU)
- Surat Pengantar SKCK
- Surat Keterangan Tidak Mampu (SKTM)
- Surat Pengantar Nikah (N1-N4)
- Surat Keterangan Kelahiran / Kematian

### 2.2 User Flow (Warga - Frontend)
1. **Login/Autentikasi:** Warga login menggunakan NIK dan Password (atau OTP WhatsApp).
2. **Pilih Layanan:** Memilih jenis surat dari grid menu interaktif.
3. **Isi Form Dinamis:** Sistem otomatis mengisi (auto-fill) data dasar (Nama, Alamat, dll) berdasarkan database kependudukan (PRD 02). Warga hanya perlu mengisi field tambahan (contoh: Nama Usaha untuk SKU).
4. **Upload Berkas Syarat:** Upload foto KTP/KK, atau bukti pendukung. (Sistem melakukan auto-compression image pada client-side).
5. **Submit & Tracking:** Warga mendapatkan Resi/Nomor Tiket (misal: `SRT-202607-001`) dan bisa melihat status (Diajukan -> Verifikasi RT -> Verifikasi Kades -> Selesai).

### 2.3 User Flow (Admin/Operator - Backend)
1. **Notifikasi:** Admin menerima push notification (atau notifikasi UI) ada permohonan baru.
2. **Verifikasi:** Mengecek kesesuaian dokumen yang diupload warga.
3. **Approval Flow (Drafting):** Jika disetujui, sistem otomatis melakukan generate dokumen (PDF) menggunakan *Document Template Engine*.
4. **Tanda Tangan Kades:** Kepala Desa menyetujui dokumen melalui aplikasi, yang membubuhkan QR Code terenkripsi (Digital Signature) pada file PDF.
5. **Delivery:** Dokumen PDF jadi dikirimkan ke akun warga dan WhatsApp mereka.

### 2.4 QR Code Validation System
Setiap surat PDF yang dikeluarkan sistem memiliki QR Code unik di pojok bawah. Jika QR code ini di-scan oleh instansi lain (Polisi, Bank, Sekolah), akan mengarahkan ke halaman verifikasi di Smart Village Platform yang menunjukkan validitas surat (Data asli vs Dokumen cetak).

---

## Chapter 3 — Sistem Pengaduan Masyarakat (E-Lapor)

### 3.1 Objective
Membangun sistem pengaduan yang mirip dengan platform Qlue, di mana laporan tidak hanya ditampung, tapi dilacak penyelesaiannya secara publik.

### 3.2 Fitur Pengaduan
- **Geo-Tagging:** Warga bisa melapor infrastruktur rusak (misal: jalan berlubang) dengan mengunggah foto dan menentukan titik lokasi presisi di Map.
- **Kategori Laporan:** Infrastruktur, Ketertiban, Pelayanan Publik, Bencana Alam.
- **SLA (Service Level Agreement):** Dashboard akan memberikan flag warna merah jika laporan belum direspon admin dalam waktu 2x24 jam.
- **Komentar & Thread:** Warga pelapor dan pihak desa dapat berdiskusi pada tiket pelaporan tersebut.
- **Status Laporan:** Menunggu -> Diproses -> Selesai. Laporan yang selesai harus menyertakan foto bukti pengerjaan (Before-After).

---

## Chapter 4 — PPID (Pejabat Pengelola Informasi & Dokumentasi) Desa

Sesuai UU Keterbukaan Informasi Publik (KIP).
- **Katalog Informasi:** Daftar dokumen publik yang terstruktur (Informasi Berkala, Serta Merta, Setiap Saat).
- **Form Permohonan Informasi:** Jalur bagi masyarakat, mahasiswa, atau jurnalis untuk meminta data spesifik yang belum dipublikasikan secara umum. Terdapat flow persetujuan untuk pemberian data.

---

## Chapter 5 — Notifikasi & Integrasi Omnichannel

- **WhatsApp Gateway:** Mengingat penetrasi WhatsApp sangat tinggi di desa, integrasi WA API (Baileys/WATS) mutlak diperlukan.
  - Notifikasi saat surat selesai.
  - Notifikasi balasan pengaduan.
  - OTP Login.
- **Email Gateway:** (Opsional/Secondary) menggunakan SMTP konvensional (Resend/SendGrid).
- **In-App Notification:** Toast messages dan bell icon di navbar.

---
*(Integrasi layanan mandiri seperti ini memberikan dampak langsung ke warga, mengubah stigma birokrasi yang berbelit menjadi modern dan efisien).*
