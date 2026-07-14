import db from '../data/dummy-db.json';

export interface Statistik {
  penduduk: number;
  kepala_keluarga: number;
  luas_wilayah: number;
  realisasi_anggaran: number;
}

export interface Berita {
  id: string;
  judul: string;
  kategori: string;
  tanggal: string;
  cover: string;
  ringkasan: string;
}

export interface Agenda {
  id: string;
  judul: string;
  tanggal: string;
  lokasi: string;
}

export interface UMKM {
  id: string;
  nama: string;
  kategori: string;
  foto: string;
  deskripsi: string;
  kontak: string;
}

export interface Wisata {
  id: string;
  nama: string;
  kategori: string;
  foto: string;
  deskripsi: string;
}

export interface PerangkatDesa {
  id: string;
  nama: string;
  jabatan: string;
  foto: string;
}

export function getStatistik(): Statistik {
  return db.statistik;
}

export function getLatestBerita(count: number = 3): Berita[] {
  return db.berita.slice(0, count);
}

export function getAllBerita(): Berita[] {
  return db.berita;
}

export function getUpcomingAgenda(count: number = 2): Agenda[] {
  return db.agenda.slice(0, count);
}

export function getAllUMKM(): UMKM[] {
  return db.umkm;
}

export function getAllWisata(): Wisata[] {
  return db.wisata;
}

export function getPerangkatDesa(): PerangkatDesa[] {
  return db.perangkat_desa;
}

export interface Bansos {
  nik: string;
  nama: string;
  program: string;
  status: string;
  tanggal_terima: string;
}

export function cekBansos(nik: string): Bansos | undefined {
  return db.bansos.find(b => b.nik === nik);
}

export function getAPBDes() {
  return db.apbdes;
}

export function getDemografi() {
  return db.demografi;
}

export interface MapDesa {
  id: string;
  nama: string;
  kategori: string;
  lat: number;
  lng: number;
}

export function getMapDesa(): MapDesa[] {
  return db.map_desa;
}
