export interface APBDes {
  tahun: number;
  pendapatan: {
    dana_desa: number;
    alokasi_dana_desa: number;
    pendapatan_asli_desa: number;
  };
  belanja: {
    penyelenggaraan_pemerintahan: number;
    pembangunan_desa: number;
    pembinaan_kemasyarakatan: number;
    pemberdayaan_masyarakat: number;
  };
}

export const apbdes: APBDes = {
  tahun: 2026,
  pendapatan: {
    dana_desa: 1200000000,
    alokasi_dana_desa: 450000000,
    pendapatan_asli_desa: 150000000,
  },
  belanja: {
    penyelenggaraan_pemerintahan: 500000000,
    pembangunan_desa: 850000000,
    pembinaan_kemasyarakatan: 250000000,
    pemberdayaan_masyarakat: 200000000,
  },
};
