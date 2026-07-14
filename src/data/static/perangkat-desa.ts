export interface PerangkatDesa {
  id: string;
  nama: string;
  jabatan: string;
  foto: string;
}

export const perangkatDesa: PerangkatDesa[] = [
  {
    id: "p1",
    nama: "Budi Santoso, S.E.",
    jabatan: "Kepala Desa",
    foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400",
  },
  {
    id: "p2",
    nama: "Siti Aminah, S.IP.",
    jabatan: "Sekretaris Desa",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400",
  },
  {
    id: "p3",
    nama: "Ahmad Fauzi",
    jabatan: "Kaur Keuangan",
    foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400",
  },
];
