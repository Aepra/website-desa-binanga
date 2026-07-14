// ============================================================
// API Layer — Website Desa Binanga
// ============================================================
// Data statis  → import dari src/data/static/
// Data dinamis → import dari src/data/dynamic/
//
// Nanti saat integrasi database, cukup ganti isi file dynamic/
// dengan query ke database (Supabase, Prisma, dsb).
// ============================================================

// --- Data Statis ---
import { statistik, type Statistik } from "@/data/static/statistik";
import { demografi, type Demografi } from "@/data/static/demografi";
import { apbdes, type APBDes } from "@/data/static/apbdes";
import {
  perangkatDesa,
  type PerangkatDesa,
} from "@/data/static/perangkat-desa";
import { mapDesa, type MapDesa } from "@/data/static/map-desa";
import { wisata, type Wisata } from "@/data/static/wisata";

// --- Data Dinamis ---
import { posts, type Post, type PostType } from "@/data/dynamic/posts";
import { umkmList, type UMKM } from "@/data/dynamic/umkm";
import { bansosList, type Bansos } from "@/data/dynamic/bansos";

// ============================================================
// Re-export types agar halaman tetap import dari '@/lib/api'
// ============================================================
export type {
  Statistik,
  Demografi,
  APBDes,
  PerangkatDesa,
  MapDesa,
  Wisata,
  Post,
  PostType,
  UMKM,
  Bansos,
};

// Backward-compatible type alias
export type Berita = Post;
export type Agenda = Post;

// ============================================================
// Fungsi API — Data Statis
// ============================================================

export function getStatistik(): Statistik {
  return statistik;
}

export function getDemografi(): Demografi {
  return demografi;
}

export function getAPBDes(): APBDes {
  return apbdes;
}

export function getPerangkatDesa(): PerangkatDesa[] {
  return perangkatDesa;
}

export function getMapDesa(): MapDesa[] {
  return mapDesa;
}

export function getAllWisata(): Wisata[] {
  return wisata;
}

// ============================================================
// Fungsi API — Data Dinamis: Posts
// ============================================================

/** Ambil semua posts */
export function getAllPosts(): Post[] {
  return posts;
}

/** Ambil posts berdasarkan type */
export function getPostsByType(type: PostType): Post[] {
  return posts.filter((p) => p.type === type);
}

/** Ambil berita terbaru (backward-compatible) */
export function getLatestBerita(count: number = 3): Post[] {
  return getPostsByType("berita").slice(0, count);
}

/** Ambil semua berita (backward-compatible) */
export function getAllBerita(): Post[] {
  return getPostsByType("berita");
}

/** Ambil semua pengumuman */
export function getAllPengumuman(): Post[] {
  return getPostsByType("pengumuman");
}

/** Ambil agenda mendatang (backward-compatible) */
export function getUpcomingAgenda(count: number = 2): Post[] {
  return getPostsByType("agenda").slice(0, count);
}

// ============================================================
// Fungsi API — Data Dinamis: UMKM
// ============================================================

export function getAllUMKM(): UMKM[] {
  return umkmList;
}

// ============================================================
// Fungsi API — Data Dinamis: Bansos
// ============================================================

export function cekBansos(nik: string): Bansos | undefined {
  return bansosList.find((b) => b.nik === nik);
}
