export interface DemografiJenisKelamin {
  name: string;
  value: number;
}

export interface DemografiUsia {
  rentang: string;
  jumlah: number;
}

export interface Demografi {
  jenis_kelamin: DemografiJenisKelamin[];
  usia: DemografiUsia[];
}

export const demografi: Demografi = {
  jenis_kelamin: [
    { name: "Laki-Laki", value: 2810 },
    { name: "Perempuan", value: 2610 },
  ],
  usia: [
    { rentang: "0-14 Tahun", jumlah: 1200 },
    { rentang: "15-64 Tahun", jumlah: 3500 },
    { rentang: "65+ Tahun", jumlah: 720 },
  ],
};
