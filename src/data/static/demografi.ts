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
    { name: "Laki-Laki", value: 485 },
    { name: "Perempuan", value: 471 },
  ],
  usia: [
    { rentang: "0-14 Tahun", jumlah: 215 },
    { rentang: "15-64 Tahun", jumlah: 620 },
    { rentang: "65+ Tahun", jumlah: 121 },
  ],
};
