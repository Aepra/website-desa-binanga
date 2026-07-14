# 📄 PRD 04 — Smart Village Platform: GIS & Spasial Analytics

## Document Control
| Version | Date | Author | Status | Remarks |
|---------|------|--------|--------|---------|
| 1.0 | 2026-07-10 | Product Team | DRAFT | Initial Draft for PRD 04 |

---

## Chapter 1 — Product Overview

### 1.1 Executive Summary
PRD 04 merancang sistem **Geographic Information System (GIS)** yang mengubah data tabular menjadi kecerdasan spasial. Ini bukan sekadar menampilkan Google Maps dengan pin lokasi, melainkan platform Web-GIS profesional berkinerja tinggi yang mampu merender puluhan ribu poligon, heatmap, dan model 3D (Terrain/Building) menggunakan teknologi WebGL.

### 1.2 Technology Stack
- **Base Map:** MapLibre GL JS (Open-source, no API limit costs).
- **Data Visualization Layer:** Deck.gl (Oleh Uber) untuk rendering data spasial skala besar dengan performa 60FPS.
- **Vector Tiles:** Server penyedia MVT (Mapbox Vector Tiles) jika data sangat besar, atau GeoJSON terkompresi.
- **Database:** PostGIS (PostgreSQL) atau Spatialite.

---

## Chapter 2 — Map Architecture & Layers

### 2.1 Base Maps (Basemap)
Pengguna dapat beralih (Toggle) antara beberapa tipe peta dasar:
- **Satellite:** Citra satelit resolusi tinggi (dari ESRI atau penyedia lokal).
- **Street/Light/Dark:** Peta jalanan berformat vektor. Mode Dark wajib ada untuk overlay data bercahaya (neon heatmap).
- **3D Terrain:** Efek elevasi gunung/bukit menggunakan Raster DEM (Digital Elevation Model).

### 2.2 Operational Layers (Toggleable)
Admin atau Publik dapat mengaktifkan/menonaktifkan layer (layer control):
- **Batas Administrasi:** Poligon batas Desa, Dusun, RW, hingga tingkat RT dengan warna berbeda (Choropleth).
- **Bangunan/Persil Rumah:** Poligon setiap rumah penduduk. Membutuhkan data pemetaan drone (Ortophoto).
- **Fasilitas Umum (POI):** Pin 3D untuk Balai Desa, Sekolah, Masjid, Puskesmas.
- **Infrastruktur Jaringan:** Garis (LineString) untuk Jaringan Pipa Air Bersih, Tiang Listrik, Irigasi.
- **Lahan Pertanian/Perkebunan:** Poligon area persawahan, dilabeli jenis komoditas.

---

## Chapter 3 — Advanced Spatial Analytics (The "WOW" Factor)

### 3.1 Heatmap Kepadatan & Ekonomi
- Menggunakan layer Hexagon 3D dari Deck.gl. Tinggi dan warna hexagon merepresentasikan data.
- **Use Case:** "Tampilkan Hexagon merah menjulang di area dengan jumlah penerima Bansos tertinggi."

### 3.2 Spatio-Demographic Filtering
- Peta terhubung langsung dengan Dashboard Data (PRD 02). 
- Jika pengguna menggeser slider "Usia Lanjut > 60 Tahun" pada sidebar, peta secara real-time akan meredupkan rumah yang tidak memiliki lansia, dan menyalakan rumah yang memiliki lansia.

### 3.3 Rawan Bencana (Disaster Mitigation)
- Layer area rawan banjir atau rawan longsor (Polygon overlay).
- **Analisis:** Mengklik area rawan banjir akan otomatis memunculkan pop-up analitik: "Terdapat 145 Rumah, 3 Balita, dan 10 Lansia di area bahaya ini." Ini adalah data-driven policy untuk mitigasi bencana.

---

## Chapter 4 — GIS Tools & Interactions

### 4.1 Measurement Tools
- **Ruler:** Mengukur jarak rute jalan (Polyline distance).
- **Area:** Mengukur luas poligon (misal: menghitung luas lahan sawah dalam meter persegi / Hektare).

### 4.2 Draw & Edit (Admin Mode)
- Tool bagi admin (menggunakan Mapbox Draw/Nebula.gl) untuk membuat poligon rumah baru, atau mengubah batas wilayah langsung di atas peta (Digitasi Web).

### 4.3 3D Building Extrusion
- Merender bangunan secara 3D (ketinggian) jika data atribut `height` atau `jumlah_lantai` tersedia.

---

## Chapter 5 — Integrasi Modul Lain

### 5.1 GIS Wisata
- Rute interaktif menuju destinasi wisata.
- Fly-to animation (Kamera 3D menukik dan berputar ke lokasi air terjun/pantai) saat destinasi dipilih di sidebar.

### 5.2 GIS Pelaporan
- Menampilkan titik-titik heatmaps lokasi laporan jalan rusak dari sistem E-Lapor (PRD 03).

---
*(PRD 04 ini akan menjadi core portfolio yang membedakan proyek ini dengan 99% website desa lainnya. Keahlian WebGL, spatial database, dan rekayasa data sangat ditonjolkan di sini).*
