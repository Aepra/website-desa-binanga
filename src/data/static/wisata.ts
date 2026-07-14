export interface Wisata {
  id: string;
  nama: string;
  kategori: string;
  foto: string;
  deskripsi: string;
}

export const wisata: Wisata[] = [
  {
    id: "w1",
    nama: "Air Terjun Curug Bidadari",
    kategori: "Alam",
    foto: "https://images.unsplash.com/photo-1432405972618-fc6080203c27?q=80&w=600",
    deskripsi:
      "Destinasi wisata alam yang sejuk dan asri dengan fasilitas lengkap.",
  },
  {
    id: "w2",
    nama: "Desa Budaya Kampung Adat",
    kategori: "Budaya",
    foto: "https://images.unsplash.com/photo-1617260580970-2e4eb9f3387a?q=80&w=600",
    deskripsi:
      "Mengenal lebih dekat kebudayaan dan tradisi leluhur masyarakat desa.",
  },
];
