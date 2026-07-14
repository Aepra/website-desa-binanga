export interface MapDesa {
  id: string;
  nama: string;
  kategori: string;
  lat: number;
  lng: number;
}

export const mapDesa: MapDesa[] = [
  {
    id: "m1",
    nama: "Balai Desa",
    kategori: "Pemerintahan",
    lat: -6.2,
    lng: 106.816666,
  },
  {
    id: "m2",
    nama: "Puskesmas Pembantu",
    kategori: "Kesehatan",
    lat: -6.201,
    lng: 106.817666,
  },
  {
    id: "m3",
    nama: "Pasar Tradisional",
    kategori: "Ekonomi",
    lat: -6.199,
    lng: 106.815666,
  },
];
