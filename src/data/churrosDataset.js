// Dataset and Analytical Models for UMKM Churrostime
// Project Penambangan Data Ganjil 2026-2027

export const APP_INFO = {
  title: 'Sistem Prediksi & Evaluasi Tren Penjualan Kuliner Berbasis Regresi Parsial',
  shortTitle: 'Churrostime Sales Mining & Forecasting',
  proposalCode: 'PropPD_2401020053',
  mataKuliah: 'Penambangan Data (Ganjil 2026-2027)',
  judulProposal: 'PEMODELAN REGRESI BERBASIS WAKTU SECARA PARSIAL BERDASARKAN VARIAN MENU UNTUK EVALUASI TREN PENJUALAN KULINER (STUDI KASUS: DATA TRANSAKSI AGUSTUS – SEPTEMBER 2026)',
  mitra: {
    nama: 'UMKM Churrostime',
    alamat: 'Jl. Hang Tuah No. 7, Tanjungpinang, Kepulauan Riau',
    beroperasiSejak: '2016',
    operasional: 'Selasa – Minggu (Senin Tutup / Libur Operasional)',
    narasumber: 'Muhammad Salman Faris Hermawan (Pembukuan Outlet)',
    pemilik: 'Adryan Dwi Putra Junior',
    produkUtama: 'Churros Spanyol Renyah dengan Aneka Topping & Dipping Sauces'
  },
  timPeneliti: [
    { nama: 'Rizka Sufianty', nim: '2401020053', peran: 'Ketua Tim / Analis Data' },
    { nama: 'Piky Al Piandi', nim: '2401020062', peran: 'Anggota / Pemodelan Regresi' },
    { nama: 'Nurul Aida', nim: '2401020072', peran: 'Anggota / Evaluasi Metrik' },
    { nama: 'Abdal Ghyfran KH', nim: '2401020078', peran: 'Anggota / Preprocessing & Sensitivitas' },
    { nama: 'M. Rizky Anargya Sofyan', nim: '2401020089', peran: 'Anggota / Algoritma Regresi & Kalkulator Stok' }
  ],
  periode: {
    rentangData: '23 Oktober 2025 – 30 September 2026 (2.209 Transaksi Riil Kasir)',
    training: '40 Minggu (25 Okt 2025 – 31 Jul 2026, t = 1 s.d. 40)',
    testing: '8 Minggu (1 Agu 2026 – 25 Sep 2026, t = 41 s.d. 48)',
    partialEdge: '2 Minggu Tepi Parsial (t=0 & t=49, untuk kontinuitas visual deret waktu)'
  }
};

export const VARIAN_DETAILS = {
  Ori: {
    id: 'Ori',
    name: 'Churros Original',
    color: '#D97706',
    bgLight: 'bg-amber-50',
    border: 'border-amber-500',
    text: 'text-amber-800',
    price: 22000,
    share: 65.3,
    b0: 33.8692,
    b1: -0.1217,
    formula: 'y = max(0, 33.8692 - 0.1217 * t)',
    mae: 5.606,
    rmse: 6.735,
    maeBaseline: 7.781,
    rmseBaseline: 8.983,
    description: 'Varian terpopuler mendominasi 65.3% transaksi. Churros renyah gurih dibalut gula pasir halus dan kayu manis.',
    sauceRecommended: 'Saus Coklat Belgia & Tiramisu'
  },
  Oreo: {
    id: 'Oreo',
    name: 'Churros Oreo Crumbs',
    color: '#0F172A',
    bgLight: 'bg-slate-100',
    border: 'border-slate-700',
    text: 'text-slate-800',
    price: 25000,
    share: 13.4,
    b0: 8.4615,
    b1: -0.1091,
    formula: 'y = max(0, 8.4615 - 0.1091 * t)',
    mae: 2.711,
    rmse: 3.205,
    maeBaseline: 1.875,
    rmseBaseline: 2.232,
    description: 'Varian favorit remaja dengan taburan biskuit coklat Oreo renyah dan filling lezat.',
    sauceRecommended: 'Saus Coklat & Saus Tiramisu'
  },
  'Icing Sugar': {
    id: 'Icing Sugar',
    name: 'Churros Icing Sugar',
    color: '#0284C7',
    bgLight: 'bg-sky-50',
    border: 'border-sky-500',
    text: 'text-sky-800',
    price: 22000,
    share: 12.2,
    b0: 8.1731,
    b1: -0.1243,
    formula: 'y = max(0, 8.1731 - 0.1243 * t)',
    mae: 3.191,
    rmse: 3.504,
    maeBaseline: 1.438,
    rmseBaseline: 1.790,
    description: 'Churros klasik dengan taburan gula halus salju (icing sugar) premium yang lembut di lidah.',
    sauceRecommended: 'Saus Coklat & Saus Matcha'
  },
  'Red Velvet': {
    id: 'Red Velvet',
    name: 'Churros Red Velvet',
    color: '#E11D48',
    bgLight: 'bg-rose-50',
    border: 'border-rose-500',
    text: 'text-rose-800',
    price: 25000,
    share: 5.9,
    b0: 4.7577,
    b1: -0.0979,
    formula: 'y = max(0, 4.7577 - 0.0979 * t)',
    mae: 2.225,
    rmse: 2.830,
    maeBaseline: 1.375,
    rmseBaseline: 1.871,
    description: 'Adonan khas red velvet berwarna merah marun dengan aroma coklat lembut dan vanila.',
    sauceRecommended: 'Saus Tiramisu & Coklat'
  },
  'Matcha Caramel': {
    id: 'Matcha Caramel',
    name: 'Churros Matcha Caramel',
    color: '#059669',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-500',
    text: 'text-emerald-800',
    price: 25000,
    share: 3.1,
    b0: 1.0385,
    b1: 0.0335,
    formula: 'y = max(0, 1.0385 + 0.0335 * t)',
    mae: 2.529,
    rmse: 2.530,
    maeBaseline: 1.725,
    rmseBaseline: 1.725,
    description: 'Varian fusion otentik teh hijau Jepang dipadukan saus karamel leleh gurih manis.',
    sauceRecommended: 'Saus Matcha & Tiramisu'
  }
};

export const SAUCE_DISTRIBUTION = [
  { name: 'Saus Coklat', count: 1605, percentage: 71.2, color: '#78350F' },
  { name: 'Saus Tiramisu', count: 307, percentage: 13.6, color: '#D97706' },
  { name: 'Saus Matcha', count: 214, percentage: 9.5, color: '#059669' },
  { name: 'Tanpa Saus / Original', count: 127, percentage: 5.6, color: '#64748B' }
];

export const INVENTORY_CONVERSION = {
  flourPerPortionGrams: 110, // gram tepung terigu per porsi
  oilPerPortionMl: 45,       // ml minyak goreng per porsi
  eggPerPortion: 0.5,        // butir telur per porsi
  butterPerPortionGrams: 25, // gram margarin per porsi
  saucePerPortionMl: 35      // ml saus dipping per porsi
};

export const MODEL_PARAMETERS = [
  {
    "Varian": "Ori",
    "Intercept_b0": 33.8692,
    "Slope_b1_per_minggu": -0.1217,
    "R2_training": 0.0295,
    "Rata2_training": 31.375,
    "Prediksi_negatif_diklip": 0
  },
  {
    "Varian": "Oreo",
    "Intercept_b0": 8.4615,
    "Slope_b1_per_minggu": -0.1091,
    "R2_training": 0.1308,
    "Rata2_training": 6.225,
    "Prediksi_negatif_diklip": 0
  },
  {
    "Varian": "Icing Sugar",
    "Intercept_b0": 8.1731,
    "Slope_b1_per_minggu": -0.1243,
    "R2_training": 0.1292,
    "Rata2_training": 5.625,
    "Prediksi_negatif_diklip": 0
  },
  {
    "Varian": "Red Velvet",
    "Intercept_b0": 4.7577,
    "Slope_b1_per_minggu": -0.0979,
    "R2_training": 0.401,
    "Rata2_training": 2.75,
    "Prediksi_negatif_diklip": 0
  },
  {
    "Varian": "Matcha Caramel",
    "Intercept_b0": 1.0385,
    "Slope_b1_per_minggu": 0.0335,
    "R2_training": 0.049,
    "Rata2_training": 1.725,
    "Prediksi_negatif_diklip": 0
  }
];

export const EVALUATION_SUMMARY = [
  {
    "Varian": "Ori",
    "Total aktual testing": 194,
    "Total prediksi testing": 227.6,
    "MAE": 5.606,
    "RMSE": 6.735
  },
  {
    "Varian": "Oreo",
    "Total aktual testing": 47,
    "Total prediksi testing": 28.9,
    "MAE": 2.711,
    "RMSE": 3.205
  },
  {
    "Varian": "Icing Sugar",
    "Total aktual testing": 46,
    "Total prediksi testing": 21.1,
    "MAE": 3.191,
    "RMSE": 3.504
  },
  {
    "Varian": "Red Velvet",
    "Total aktual testing": 21,
    "Total prediksi testing": 3.2,
    "MAE": 2.225,
    "RMSE": 2.83
  },
  {
    "Varian": "Matcha Caramel",
    "Total aktual testing": 0,
    "Total prediksi testing": 20.2,
    "MAE": 2.529,
    "RMSE": 2.53
  }
];

export const EVALUATION_DETAILED = [
  {
    "Varian": "Ori",
    "Total aktual testing": 194,
    "Total prediksi testing": 227.6,
    "MAE": 5.6058,
    "RMSE": 6.7346,
    "MAE_pembanding_rata2_training": 7.7812,
    "RMSE_pembanding_rata2_training": 8.9835,
    "MAE_training(bukan evaluasi)": 6.629
  },
  {
    "Varian": "Oreo",
    "Total aktual testing": 47,
    "Total prediksi testing": 28.9,
    "MAE": 2.711,
    "RMSE": 3.205,
    "MAE_pembanding_rata2_training": 1.875,
    "RMSE_pembanding_rata2_training": 2.232,
    "MAE_training(bukan evaluasi)": 2.721
  },
  {
    "Varian": "Icing Sugar",
    "Total aktual testing": 46,
    "Total prediksi testing": 21.1,
    "MAE": 3.1909,
    "RMSE": 3.5038,
    "MAE_pembanding_rata2_training": 1.4375,
    "RMSE_pembanding_rata2_training": 1.7897,
    "MAE_training(bukan evaluasi)": 2.9418
  },
  {
    "Varian": "Red Velvet",
    "Total aktual testing": 21,
    "Total prediksi testing": 3.2,
    "MAE": 2.2255,
    "RMSE": 2.8302,
    "MAE_pembanding_rata2_training": 1.375,
    "RMSE_pembanding_rata2_training": 1.8708,
    "MAE_training(bukan evaluasi)": 1.0505
  },
  {
    "Varian": "Matcha Caramel",
    "Total aktual testing": 0,
    "Total prediksi testing": 20.2,
    "MAE": 2.5288,
    "RMSE": 2.5299,
    "MAE_pembanding_rata2_training": 1.725,
    "RMSE_pembanding_rata2_training": 1.725,
    "MAE_training(bukan evaluasi)": 1.4516
  }
];

export const SENSITIVITY_DATA = [
  {
    "Varian": "Ori",
    "Total aktual testing": 182,
    "Total prediksi testing": 214.9,
    "MAE": 6.2715,
    "RMSE": 7.0063
  },
  {
    "Varian": "Oreo",
    "Total aktual testing": 45,
    "Total prediksi testing": 27.8,
    "MAE": 2.5588,
    "RMSE": 3.1329
  },
  {
    "Varian": "Icing Sugar",
    "Total aktual testing": 45,
    "Total prediksi testing": 18.1,
    "MAE": 3.3687,
    "RMSE": 3.7314
  },
  {
    "Varian": "Red Velvet",
    "Total aktual testing": 20,
    "Total prediksi testing": 3.3,
    "MAE": 2.0815,
    "RMSE": 2.7373
  },
  {
    "Varian": "Matcha Caramel",
    "Total aktual testing": 0,
    "Total prediksi testing": 19.4,
    "MAE": 2.4264,
    "RMSE": 2.4274
  }
];

export const WEEKLY_DATA_REVISI = [
  {
    "minggu_mulai": "2025-10-18",
    "Ori": 8,
    "Oreo": 3,
    "Icing Sugar": 2,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 2,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-10-24",
    "parsial": true,
    "t": 0,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-10-25",
    "Ori": 29,
    "Oreo": 9,
    "Icing Sugar": 6,
    "Red Velvet": 1,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-10-31",
    "parsial": false,
    "t": 1,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-01",
    "Ori": 23,
    "Oreo": 9,
    "Icing Sugar": 8,
    "Red Velvet": 5,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-11-07",
    "parsial": false,
    "t": 2,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-08",
    "Ori": 28,
    "Oreo": 10,
    "Icing Sugar": 8,
    "Red Velvet": 5,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-11-14",
    "parsial": false,
    "t": 3,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-15",
    "Ori": 20,
    "Oreo": 11,
    "Icing Sugar": 11,
    "Red Velvet": 7,
    "Matcha Caramel": 2,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-11-21",
    "parsial": false,
    "t": 4,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-22",
    "Ori": 21,
    "Oreo": 12,
    "Icing Sugar": 9,
    "Red Velvet": 8,
    "Matcha Caramel": 2,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-11-28",
    "parsial": false,
    "t": 5,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-29",
    "Ori": 37,
    "Oreo": 3,
    "Icing Sugar": 13,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-12-05",
    "parsial": false,
    "t": 6,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-12-06",
    "Ori": 42,
    "Oreo": 3,
    "Icing Sugar": 7,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-12-12",
    "parsial": false,
    "t": 7,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-12-13",
    "Ori": 42,
    "Oreo": 6,
    "Icing Sugar": 9,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-12-19",
    "parsial": false,
    "t": 8,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-12-20",
    "Ori": 39,
    "Oreo": 5,
    "Icing Sugar": 10,
    "Red Velvet": 4,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-12-26",
    "parsial": false,
    "t": 9,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-12-27",
    "Ori": 38,
    "Oreo": 6,
    "Icing Sugar": 7,
    "Red Velvet": 4,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-02",
    "parsial": false,
    "t": 10,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-03",
    "Ori": 38,
    "Oreo": 8,
    "Icing Sugar": 13,
    "Red Velvet": 4,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-09",
    "parsial": false,
    "t": 11,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-10",
    "Ori": 44,
    "Oreo": 5,
    "Icing Sugar": 7,
    "Red Velvet": 5,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-16",
    "parsial": false,
    "t": 12,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-17",
    "Ori": 42,
    "Oreo": 10,
    "Icing Sugar": 11,
    "Red Velvet": 4,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-23",
    "parsial": false,
    "t": 13,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-24",
    "Ori": 41,
    "Oreo": 8,
    "Icing Sugar": 8,
    "Red Velvet": 6,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-30",
    "parsial": false,
    "t": 14,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-31",
    "Ori": 32,
    "Oreo": 7,
    "Icing Sugar": 4,
    "Red Velvet": 2,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-02-06",
    "parsial": false,
    "t": 15,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-02-07",
    "Ori": 33,
    "Oreo": 8,
    "Icing Sugar": 0,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-02-13",
    "parsial": false,
    "t": 16,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-02-14",
    "Ori": 34,
    "Oreo": 8,
    "Icing Sugar": 0,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-02-20",
    "parsial": false,
    "t": 17,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-02-21",
    "Ori": 39,
    "Oreo": 7,
    "Icing Sugar": 0,
    "Red Velvet": 3,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-02-27",
    "parsial": false,
    "t": 18,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-02-28",
    "Ori": 40,
    "Oreo": 11,
    "Icing Sugar": 0,
    "Red Velvet": 3,
    "Matcha Caramel": 4,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-03-06",
    "parsial": false,
    "t": 19,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-03-07",
    "Ori": 30,
    "Oreo": 10,
    "Icing Sugar": 4,
    "Red Velvet": 2,
    "Matcha Caramel": 5,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-03-13",
    "parsial": false,
    "t": 20,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-03-14",
    "Ori": 15,
    "Oreo": 3,
    "Icing Sugar": 1,
    "Red Velvet": 0,
    "Matcha Caramel": 0,
    "hari_transaksi": 3,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-03-20",
    "parsial": false,
    "t": 21,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-03-21",
    "Ori": 15,
    "Oreo": 3,
    "Icing Sugar": 0,
    "Red Velvet": 2,
    "Matcha Caramel": 1,
    "hari_transaksi": 3,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-03-27",
    "parsial": false,
    "t": 22,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-03-28",
    "Ori": 31,
    "Oreo": 5,
    "Icing Sugar": 5,
    "Red Velvet": 4,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-04-03",
    "parsial": false,
    "t": 23,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-04-04",
    "Ori": 34,
    "Oreo": 10,
    "Icing Sugar": 7,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 34,
    "minggu_selesai": "2026-04-10",
    "parsial": false,
    "t": 24,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-04-11",
    "Ori": 23,
    "Oreo": 4,
    "Icing Sugar": 3,
    "Red Velvet": 1,
    "Matcha Caramel": 2,
    "hari_transaksi": 6,
    "baris_non_asli": 33,
    "minggu_selesai": "2026-04-17",
    "parsial": false,
    "t": 25,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-04-18",
    "Ori": 30,
    "Oreo": 2,
    "Icing Sugar": 0,
    "Red Velvet": 3,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-04-24",
    "parsial": false,
    "t": 26,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-04-25",
    "Ori": 24,
    "Oreo": 0,
    "Icing Sugar": 3,
    "Red Velvet": 1,
    "Matcha Caramel": 6,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-01",
    "parsial": false,
    "t": 27,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-02",
    "Ori": 35,
    "Oreo": 3,
    "Icing Sugar": 14,
    "Red Velvet": 4,
    "Matcha Caramel": 5,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-08",
    "parsial": false,
    "t": 28,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-09",
    "Ori": 48,
    "Oreo": 11,
    "Icing Sugar": 10,
    "Red Velvet": 1,
    "Matcha Caramel": 4,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-15",
    "parsial": false,
    "t": 29,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-16",
    "Ori": 26,
    "Oreo": 6,
    "Icing Sugar": 5,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-22",
    "parsial": false,
    "t": 30,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-23",
    "Ori": 18,
    "Oreo": 1,
    "Icing Sugar": 1,
    "Red Velvet": 2,
    "Matcha Caramel": 3,
    "hari_transaksi": 2,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-29",
    "parsial": false,
    "t": 31,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-30",
    "Ori": 23,
    "Oreo": 0,
    "Icing Sugar": 3,
    "Red Velvet": 2,
    "Matcha Caramel": 2,
    "hari_transaksi": 5,
    "baris_non_asli": 5,
    "minggu_selesai": "2026-06-05",
    "parsial": false,
    "t": 32,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-06-06",
    "Ori": 22,
    "Oreo": 1,
    "Icing Sugar": 2,
    "Red Velvet": 1,
    "Matcha Caramel": 2,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-06-12",
    "parsial": false,
    "t": 33,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-06-13",
    "Ori": 36,
    "Oreo": 12,
    "Icing Sugar": 3,
    "Red Velvet": 2,
    "Matcha Caramel": 5,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-06-19",
    "parsial": false,
    "t": 34,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-06-20",
    "Ori": 26,
    "Oreo": 4,
    "Icing Sugar": 2,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-06-26",
    "parsial": false,
    "t": 35,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-06-27",
    "Ori": 30,
    "Oreo": 8,
    "Icing Sugar": 4,
    "Red Velvet": 0,
    "Matcha Caramel": 4,
    "hari_transaksi": 6,
    "baris_non_asli": 10,
    "minggu_selesai": "2026-07-03",
    "parsial": false,
    "t": 36,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-07-04",
    "Ori": 36,
    "Oreo": 10,
    "Icing Sugar": 10,
    "Red Velvet": 1,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-07-10",
    "parsial": false,
    "t": 37,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-07-11",
    "Ori": 35,
    "Oreo": 5,
    "Icing Sugar": 6,
    "Red Velvet": 2,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-07-17",
    "parsial": false,
    "t": 38,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-07-18",
    "Ori": 27,
    "Oreo": 3,
    "Icing Sugar": 5,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-07-24",
    "parsial": false,
    "t": 39,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-07-25",
    "Ori": 29,
    "Oreo": 2,
    "Icing Sugar": 6,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-07-31",
    "parsial": false,
    "t": 40,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-08-01",
    "Ori": 26,
    "Oreo": 7,
    "Icing Sugar": 7,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 5,
    "minggu_selesai": "2026-08-07",
    "parsial": false,
    "t": 41,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-08-08",
    "Ori": 34,
    "Oreo": 4,
    "Icing Sugar": 6,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-08-14",
    "parsial": false,
    "t": 42,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-08-15",
    "Ori": 29,
    "Oreo": 2,
    "Icing Sugar": 7,
    "Red Velvet": 7,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-08-21",
    "parsial": false,
    "t": 43,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-08-22",
    "Ori": 21,
    "Oreo": 6,
    "Icing Sugar": 6,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-08-28",
    "parsial": false,
    "t": 44,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-08-29",
    "Ori": 24,
    "Oreo": 9,
    "Icing Sugar": 8,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-09-04",
    "parsial": false,
    "t": 45,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-09-05",
    "Ori": 26,
    "Oreo": 8,
    "Icing Sugar": 6,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 11,
    "minggu_selesai": "2026-09-11",
    "parsial": false,
    "t": 46,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-09-12",
    "Ori": 17,
    "Oreo": 7,
    "Icing Sugar": 2,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-09-18",
    "parsial": false,
    "t": 47,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-09-19",
    "Ori": 17,
    "Oreo": 4,
    "Icing Sugar": 4,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-09-25",
    "parsial": false,
    "t": 48,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-09-26",
    "Ori": 15,
    "Oreo": 4,
    "Icing Sugar": 2,
    "Red Velvet": 1,
    "Matcha Caramel": 1,
    "hari_transaksi": 4,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-10-02",
    "parsial": true,
    "t": 49,
    "fase": "testing"
  }
];

export const WEEKLY_DATA_ASLI = [
  {
    "minggu_mulai": "2025-10-18",
    "Ori": 8,
    "Oreo": 3,
    "Icing Sugar": 2,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 2,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-10-24",
    "parsial": true,
    "t": 0,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-10-25",
    "Ori": 29,
    "Oreo": 9,
    "Icing Sugar": 6,
    "Red Velvet": 1,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-10-31",
    "parsial": false,
    "t": 1,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-01",
    "Ori": 23,
    "Oreo": 9,
    "Icing Sugar": 8,
    "Red Velvet": 5,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-11-07",
    "parsial": false,
    "t": 2,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-08",
    "Ori": 28,
    "Oreo": 10,
    "Icing Sugar": 8,
    "Red Velvet": 5,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-11-14",
    "parsial": false,
    "t": 3,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-15",
    "Ori": 20,
    "Oreo": 11,
    "Icing Sugar": 11,
    "Red Velvet": 7,
    "Matcha Caramel": 2,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-11-21",
    "parsial": false,
    "t": 4,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-22",
    "Ori": 21,
    "Oreo": 12,
    "Icing Sugar": 9,
    "Red Velvet": 8,
    "Matcha Caramel": 2,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-11-28",
    "parsial": false,
    "t": 5,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-11-29",
    "Ori": 37,
    "Oreo": 3,
    "Icing Sugar": 13,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-12-05",
    "parsial": false,
    "t": 6,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-12-06",
    "Ori": 42,
    "Oreo": 3,
    "Icing Sugar": 7,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-12-12",
    "parsial": false,
    "t": 7,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-12-13",
    "Ori": 42,
    "Oreo": 6,
    "Icing Sugar": 9,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-12-19",
    "parsial": false,
    "t": 8,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-12-20",
    "Ori": 39,
    "Oreo": 5,
    "Icing Sugar": 10,
    "Red Velvet": 4,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2025-12-26",
    "parsial": false,
    "t": 9,
    "fase": "training"
  },
  {
    "minggu_mulai": "2025-12-27",
    "Ori": 38,
    "Oreo": 6,
    "Icing Sugar": 7,
    "Red Velvet": 4,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-02",
    "parsial": false,
    "t": 10,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-03",
    "Ori": 38,
    "Oreo": 8,
    "Icing Sugar": 13,
    "Red Velvet": 4,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-09",
    "parsial": false,
    "t": 11,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-10",
    "Ori": 44,
    "Oreo": 5,
    "Icing Sugar": 7,
    "Red Velvet": 5,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-16",
    "parsial": false,
    "t": 12,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-17",
    "Ori": 42,
    "Oreo": 10,
    "Icing Sugar": 11,
    "Red Velvet": 4,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-23",
    "parsial": false,
    "t": 13,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-24",
    "Ori": 41,
    "Oreo": 8,
    "Icing Sugar": 8,
    "Red Velvet": 6,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-01-30",
    "parsial": false,
    "t": 14,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-01-31",
    "Ori": 32,
    "Oreo": 7,
    "Icing Sugar": 4,
    "Red Velvet": 2,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-02-06",
    "parsial": false,
    "t": 15,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-02-07",
    "Ori": 33,
    "Oreo": 8,
    "Icing Sugar": 0,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-02-13",
    "parsial": false,
    "t": 16,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-02-14",
    "Ori": 34,
    "Oreo": 8,
    "Icing Sugar": 0,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-02-20",
    "parsial": false,
    "t": 17,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-02-21",
    "Ori": 39,
    "Oreo": 7,
    "Icing Sugar": 0,
    "Red Velvet": 3,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-02-27",
    "parsial": false,
    "t": 18,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-02-28",
    "Ori": 40,
    "Oreo": 11,
    "Icing Sugar": 0,
    "Red Velvet": 3,
    "Matcha Caramel": 4,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-03-06",
    "parsial": false,
    "t": 19,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-03-07",
    "Ori": 30,
    "Oreo": 10,
    "Icing Sugar": 4,
    "Red Velvet": 2,
    "Matcha Caramel": 5,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-03-13",
    "parsial": false,
    "t": 20,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-03-14",
    "Ori": 15,
    "Oreo": 3,
    "Icing Sugar": 1,
    "Red Velvet": 0,
    "Matcha Caramel": 0,
    "hari_transaksi": 3,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-03-20",
    "parsial": false,
    "t": 21,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-03-21",
    "Ori": 15,
    "Oreo": 3,
    "Icing Sugar": 0,
    "Red Velvet": 2,
    "Matcha Caramel": 1,
    "hari_transaksi": 3,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-03-27",
    "parsial": false,
    "t": 22,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-03-28",
    "Ori": 31,
    "Oreo": 5,
    "Icing Sugar": 5,
    "Red Velvet": 4,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-04-03",
    "parsial": false,
    "t": 23,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-04-04",
    "Ori": 11,
    "Oreo": 5,
    "Icing Sugar": 2,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-04-10",
    "parsial": false,
    "t": 24,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-04-11",
    "Ori": 0,
    "Oreo": 0,
    "Icing Sugar": 0,
    "Red Velvet": 0,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-04-17",
    "parsial": false,
    "t": 25,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-04-18",
    "Ori": 30,
    "Oreo": 2,
    "Icing Sugar": 0,
    "Red Velvet": 3,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-04-24",
    "parsial": false,
    "t": 26,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-04-25",
    "Ori": 24,
    "Oreo": 0,
    "Icing Sugar": 3,
    "Red Velvet": 1,
    "Matcha Caramel": 6,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-01",
    "parsial": false,
    "t": 27,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-02",
    "Ori": 35,
    "Oreo": 3,
    "Icing Sugar": 14,
    "Red Velvet": 4,
    "Matcha Caramel": 5,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-08",
    "parsial": false,
    "t": 28,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-09",
    "Ori": 48,
    "Oreo": 11,
    "Icing Sugar": 10,
    "Red Velvet": 1,
    "Matcha Caramel": 4,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-15",
    "parsial": false,
    "t": 29,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-16",
    "Ori": 26,
    "Oreo": 6,
    "Icing Sugar": 5,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-22",
    "parsial": false,
    "t": 30,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-23",
    "Ori": 18,
    "Oreo": 1,
    "Icing Sugar": 1,
    "Red Velvet": 2,
    "Matcha Caramel": 3,
    "hari_transaksi": 2,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-05-29",
    "parsial": false,
    "t": 31,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-05-30",
    "Ori": 19,
    "Oreo": 0,
    "Icing Sugar": 2,
    "Red Velvet": 2,
    "Matcha Caramel": 2,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-06-05",
    "parsial": false,
    "t": 32,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-06-06",
    "Ori": 22,
    "Oreo": 1,
    "Icing Sugar": 2,
    "Red Velvet": 1,
    "Matcha Caramel": 2,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-06-12",
    "parsial": false,
    "t": 33,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-06-13",
    "Ori": 36,
    "Oreo": 12,
    "Icing Sugar": 3,
    "Red Velvet": 2,
    "Matcha Caramel": 5,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-06-19",
    "parsial": false,
    "t": 34,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-06-20",
    "Ori": 26,
    "Oreo": 4,
    "Icing Sugar": 2,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-06-26",
    "parsial": false,
    "t": 35,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-06-27",
    "Ori": 23,
    "Oreo": 8,
    "Icing Sugar": 2,
    "Red Velvet": 0,
    "Matcha Caramel": 3,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-07-03",
    "parsial": false,
    "t": 36,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-07-04",
    "Ori": 36,
    "Oreo": 10,
    "Icing Sugar": 10,
    "Red Velvet": 1,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-07-10",
    "parsial": false,
    "t": 37,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-07-11",
    "Ori": 35,
    "Oreo": 5,
    "Icing Sugar": 6,
    "Red Velvet": 2,
    "Matcha Caramel": 1,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-07-17",
    "parsial": false,
    "t": 38,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-07-18",
    "Ori": 27,
    "Oreo": 3,
    "Icing Sugar": 5,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-07-24",
    "parsial": false,
    "t": 39,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-07-25",
    "Ori": 29,
    "Oreo": 2,
    "Icing Sugar": 6,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-07-31",
    "parsial": false,
    "t": 40,
    "fase": "training"
  },
  {
    "minggu_mulai": "2026-08-01",
    "Ori": 24,
    "Oreo": 5,
    "Icing Sugar": 7,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-08-07",
    "parsial": false,
    "t": 41,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-08-08",
    "Ori": 34,
    "Oreo": 4,
    "Icing Sugar": 6,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-08-14",
    "parsial": false,
    "t": 42,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-08-15",
    "Ori": 29,
    "Oreo": 2,
    "Icing Sugar": 7,
    "Red Velvet": 7,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-08-21",
    "parsial": false,
    "t": 43,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-08-22",
    "Ori": 21,
    "Oreo": 6,
    "Icing Sugar": 6,
    "Red Velvet": 3,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-08-28",
    "parsial": false,
    "t": 44,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-08-29",
    "Ori": 24,
    "Oreo": 9,
    "Icing Sugar": 8,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-09-04",
    "parsial": false,
    "t": 45,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-09-05",
    "Ori": 16,
    "Oreo": 8,
    "Icing Sugar": 5,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-09-11",
    "parsial": false,
    "t": 46,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-09-12",
    "Ori": 17,
    "Oreo": 7,
    "Icing Sugar": 2,
    "Red Velvet": 2,
    "Matcha Caramel": 0,
    "hari_transaksi": 6,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-09-18",
    "parsial": false,
    "t": 47,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-09-19",
    "Ori": 17,
    "Oreo": 4,
    "Icing Sugar": 4,
    "Red Velvet": 1,
    "Matcha Caramel": 0,
    "hari_transaksi": 5,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-09-25",
    "parsial": false,
    "t": 48,
    "fase": "testing"
  },
  {
    "minggu_mulai": "2026-09-26",
    "Ori": 15,
    "Oreo": 4,
    "Icing Sugar": 2,
    "Red Velvet": 1,
    "Matcha Caramel": 1,
    "hari_transaksi": 4,
    "baris_non_asli": 0,
    "minggu_selesai": "2026-10-02",
    "parsial": true,
    "t": 49,
    "fase": "testing"
  }
];

export const ACTUAL_VS_PREDICTED_MAP = {
  "2025-10-18": {
    "Ori": {
      "aktual": 8,
      "prediksi": 33.8692
    },
    "Oreo": {
      "aktual": 3,
      "prediksi": 8.4615
    },
    "Icing Sugar": {
      "aktual": 2,
      "prediksi": 8.1731
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 4.7577
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.0385
    }
  },
  "2025-10-25": {
    "Ori": {
      "aktual": 29,
      "prediksi": 33.7476
    },
    "Oreo": {
      "aktual": 9,
      "prediksi": 8.3524
    },
    "Icing Sugar": {
      "aktual": 6,
      "prediksi": 8.0488
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 4.6598
    },
    "Matcha Caramel": {
      "aktual": 1,
      "prediksi": 1.072
    }
  },
  "2025-11-01": {
    "Ori": {
      "aktual": 23,
      "prediksi": 33.6259
    },
    "Oreo": {
      "aktual": 9,
      "prediksi": 8.2433
    },
    "Icing Sugar": {
      "aktual": 8,
      "prediksi": 7.9245
    },
    "Red Velvet": {
      "aktual": 5,
      "prediksi": 4.5618
    },
    "Matcha Caramel": {
      "aktual": 1,
      "prediksi": 1.1054
    }
  },
  "2025-11-08": {
    "Ori": {
      "aktual": 28,
      "prediksi": 33.5042
    },
    "Oreo": {
      "aktual": 10,
      "prediksi": 8.1342
    },
    "Icing Sugar": {
      "aktual": 8,
      "prediksi": 7.8002
    },
    "Red Velvet": {
      "aktual": 5,
      "prediksi": 4.4639
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.1389
    }
  },
  "2025-11-15": {
    "Ori": {
      "aktual": 20,
      "prediksi": 33.3826
    },
    "Oreo": {
      "aktual": 11,
      "prediksi": 8.0251
    },
    "Icing Sugar": {
      "aktual": 11,
      "prediksi": 7.6759
    },
    "Red Velvet": {
      "aktual": 7,
      "prediksi": 4.3659
    },
    "Matcha Caramel": {
      "aktual": 2,
      "prediksi": 1.1724
    }
  },
  "2025-11-22": {
    "Ori": {
      "aktual": 21,
      "prediksi": 33.2609
    },
    "Oreo": {
      "aktual": 12,
      "prediksi": 7.916
    },
    "Icing Sugar": {
      "aktual": 9,
      "prediksi": 7.5516
    },
    "Red Velvet": {
      "aktual": 8,
      "prediksi": 4.268
    },
    "Matcha Caramel": {
      "aktual": 2,
      "prediksi": 1.2059
    }
  },
  "2025-11-29": {
    "Ori": {
      "aktual": 37,
      "prediksi": 33.1392
    },
    "Oreo": {
      "aktual": 3,
      "prediksi": 7.8069
    },
    "Icing Sugar": {
      "aktual": 13,
      "prediksi": 7.4273
    },
    "Red Velvet": {
      "aktual": 3,
      "prediksi": 4.1701
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.2394
    }
  },
  "2025-12-06": {
    "Ori": {
      "aktual": 42,
      "prediksi": 33.0175
    },
    "Oreo": {
      "aktual": 3,
      "prediksi": 7.6978
    },
    "Icing Sugar": {
      "aktual": 7,
      "prediksi": 7.303
    },
    "Red Velvet": {
      "aktual": 3,
      "prediksi": 4.0721
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.2729
    }
  },
  "2025-12-13": {
    "Ori": {
      "aktual": 42,
      "prediksi": 32.8959
    },
    "Oreo": {
      "aktual": 6,
      "prediksi": 7.5887
    },
    "Icing Sugar": {
      "aktual": 9,
      "prediksi": 7.1787
    },
    "Red Velvet": {
      "aktual": 3,
      "prediksi": 3.9742
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.3064
    }
  },
  "2025-12-20": {
    "Ori": {
      "aktual": 39,
      "prediksi": 32.7742
    },
    "Oreo": {
      "aktual": 5,
      "prediksi": 7.4796
    },
    "Icing Sugar": {
      "aktual": 10,
      "prediksi": 7.0544
    },
    "Red Velvet": {
      "aktual": 4,
      "prediksi": 3.8763
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.3399
    }
  },
  "2025-12-27": {
    "Ori": {
      "aktual": 38,
      "prediksi": 32.6525
    },
    "Oreo": {
      "aktual": 6,
      "prediksi": 7.3705
    },
    "Icing Sugar": {
      "aktual": 7,
      "prediksi": 6.9301
    },
    "Red Velvet": {
      "aktual": 4,
      "prediksi": 3.7783
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.3734
    }
  },
  "2026-01-03": {
    "Ori": {
      "aktual": 38,
      "prediksi": 32.5309
    },
    "Oreo": {
      "aktual": 8,
      "prediksi": 7.2614
    },
    "Icing Sugar": {
      "aktual": 13,
      "prediksi": 6.8058
    },
    "Red Velvet": {
      "aktual": 4,
      "prediksi": 3.6804
    },
    "Matcha Caramel": {
      "aktual": 3,
      "prediksi": 1.4068
    }
  },
  "2026-01-10": {
    "Ori": {
      "aktual": 44,
      "prediksi": 32.4092
    },
    "Oreo": {
      "aktual": 5,
      "prediksi": 7.1523
    },
    "Icing Sugar": {
      "aktual": 7,
      "prediksi": 6.6815
    },
    "Red Velvet": {
      "aktual": 5,
      "prediksi": 3.5825
    },
    "Matcha Caramel": {
      "aktual": 3,
      "prediksi": 1.4403
    }
  },
  "2026-01-17": {
    "Ori": {
      "aktual": 42,
      "prediksi": 32.2875
    },
    "Oreo": {
      "aktual": 10,
      "prediksi": 7.0432
    },
    "Icing Sugar": {
      "aktual": 11,
      "prediksi": 6.5572
    },
    "Red Velvet": {
      "aktual": 4,
      "prediksi": 3.4845
    },
    "Matcha Caramel": {
      "aktual": 1,
      "prediksi": 1.4738
    }
  },
  "2026-01-24": {
    "Ori": {
      "aktual": 41,
      "prediksi": 32.1659
    },
    "Oreo": {
      "aktual": 8,
      "prediksi": 6.9341
    },
    "Icing Sugar": {
      "aktual": 8,
      "prediksi": 6.4329
    },
    "Red Velvet": {
      "aktual": 6,
      "prediksi": 3.3866
    },
    "Matcha Caramel": {
      "aktual": 3,
      "prediksi": 1.5073
    }
  },
  "2026-01-31": {
    "Ori": {
      "aktual": 32,
      "prediksi": 32.0442
    },
    "Oreo": {
      "aktual": 7,
      "prediksi": 6.825
    },
    "Icing Sugar": {
      "aktual": 4,
      "prediksi": 6.3086
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 3.2886
    },
    "Matcha Caramel": {
      "aktual": 1,
      "prediksi": 1.5408
    }
  },
  "2026-02-07": {
    "Ori": {
      "aktual": 33,
      "prediksi": 31.9225
    },
    "Oreo": {
      "aktual": 8,
      "prediksi": 6.7159
    },
    "Icing Sugar": {
      "aktual": 0,
      "prediksi": 6.1843
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 3.1907
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.5743
    }
  },
  "2026-02-14": {
    "Ori": {
      "aktual": 34,
      "prediksi": 31.8008
    },
    "Oreo": {
      "aktual": 8,
      "prediksi": 6.6068
    },
    "Icing Sugar": {
      "aktual": 0,
      "prediksi": 6.06
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 3.0928
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.6078
    }
  },
  "2026-02-21": {
    "Ori": {
      "aktual": 39,
      "prediksi": 31.6792
    },
    "Oreo": {
      "aktual": 7,
      "prediksi": 6.4977
    },
    "Icing Sugar": {
      "aktual": 0,
      "prediksi": 5.9357
    },
    "Red Velvet": {
      "aktual": 3,
      "prediksi": 2.9948
    },
    "Matcha Caramel": {
      "aktual": 3,
      "prediksi": 1.6413
    }
  },
  "2026-02-28": {
    "Ori": {
      "aktual": 40,
      "prediksi": 31.5575
    },
    "Oreo": {
      "aktual": 11,
      "prediksi": 6.3886
    },
    "Icing Sugar": {
      "aktual": 0,
      "prediksi": 5.8114
    },
    "Red Velvet": {
      "aktual": 3,
      "prediksi": 2.8969
    },
    "Matcha Caramel": {
      "aktual": 4,
      "prediksi": 1.6748
    }
  },
  "2026-03-07": {
    "Ori": {
      "aktual": 30,
      "prediksi": 31.4358
    },
    "Oreo": {
      "aktual": 10,
      "prediksi": 6.2795
    },
    "Icing Sugar": {
      "aktual": 4,
      "prediksi": 5.6871
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 2.799
    },
    "Matcha Caramel": {
      "aktual": 5,
      "prediksi": 1.7083
    }
  },
  "2026-03-14": {
    "Ori": {
      "aktual": 15,
      "prediksi": 31.3142
    },
    "Oreo": {
      "aktual": 3,
      "prediksi": 6.1705
    },
    "Icing Sugar": {
      "aktual": 1,
      "prediksi": 5.5629
    },
    "Red Velvet": {
      "aktual": 0,
      "prediksi": 2.701
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.7417
    }
  },
  "2026-03-21": {
    "Ori": {
      "aktual": 15,
      "prediksi": 31.1925
    },
    "Oreo": {
      "aktual": 3,
      "prediksi": 6.0614
    },
    "Icing Sugar": {
      "aktual": 0,
      "prediksi": 5.4386
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 2.6031
    },
    "Matcha Caramel": {
      "aktual": 1,
      "prediksi": 1.7752
    }
  },
  "2026-03-28": {
    "Ori": {
      "aktual": 31,
      "prediksi": 31.0708
    },
    "Oreo": {
      "aktual": 5,
      "prediksi": 5.9523
    },
    "Icing Sugar": {
      "aktual": 5,
      "prediksi": 5.3143
    },
    "Red Velvet": {
      "aktual": 4,
      "prediksi": 2.5052
    },
    "Matcha Caramel": {
      "aktual": 1,
      "prediksi": 1.8087
    }
  },
  "2026-04-04": {
    "Ori": {
      "aktual": 34,
      "prediksi": 30.9492
    },
    "Oreo": {
      "aktual": 10,
      "prediksi": 5.8432
    },
    "Icing Sugar": {
      "aktual": 7,
      "prediksi": 5.19
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 2.4072
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 1.8422
    }
  },
  "2026-04-11": {
    "Ori": {
      "aktual": 23,
      "prediksi": 30.8275
    },
    "Oreo": {
      "aktual": 4,
      "prediksi": 5.7341
    },
    "Icing Sugar": {
      "aktual": 3,
      "prediksi": 5.0657
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 2.3093
    },
    "Matcha Caramel": {
      "aktual": 2,
      "prediksi": 1.8757
    }
  },
  "2026-04-18": {
    "Ori": {
      "aktual": 30,
      "prediksi": 30.7058
    },
    "Oreo": {
      "aktual": 2,
      "prediksi": 5.625
    },
    "Icing Sugar": {
      "aktual": 0,
      "prediksi": 4.9414
    },
    "Red Velvet": {
      "aktual": 3,
      "prediksi": 2.2114
    },
    "Matcha Caramel": {
      "aktual": 3,
      "prediksi": 1.9092
    }
  },
  "2026-04-25": {
    "Ori": {
      "aktual": 24,
      "prediksi": 30.5841
    },
    "Oreo": {
      "aktual": 0,
      "prediksi": 5.5159
    },
    "Icing Sugar": {
      "aktual": 3,
      "prediksi": 4.8171
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 2.1134
    },
    "Matcha Caramel": {
      "aktual": 6,
      "prediksi": 1.9427
    }
  },
  "2026-05-02": {
    "Ori": {
      "aktual": 35,
      "prediksi": 30.4625
    },
    "Oreo": {
      "aktual": 3,
      "prediksi": 5.4068
    },
    "Icing Sugar": {
      "aktual": 14,
      "prediksi": 4.6928
    },
    "Red Velvet": {
      "aktual": 4,
      "prediksi": 2.0155
    },
    "Matcha Caramel": {
      "aktual": 5,
      "prediksi": 1.9762
    }
  },
  "2026-05-09": {
    "Ori": {
      "aktual": 48,
      "prediksi": 30.3408
    },
    "Oreo": {
      "aktual": 11,
      "prediksi": 5.2977
    },
    "Icing Sugar": {
      "aktual": 10,
      "prediksi": 4.5685
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 1.9175
    },
    "Matcha Caramel": {
      "aktual": 4,
      "prediksi": 2.0097
    }
  },
  "2026-05-16": {
    "Ori": {
      "aktual": 26,
      "prediksi": 30.2191
    },
    "Oreo": {
      "aktual": 6,
      "prediksi": 5.1886
    },
    "Icing Sugar": {
      "aktual": 5,
      "prediksi": 4.4442
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 1.8196
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.0432
    }
  },
  "2026-05-23": {
    "Ori": {
      "aktual": 18,
      "prediksi": 30.0975
    },
    "Oreo": {
      "aktual": 1,
      "prediksi": 5.0795
    },
    "Icing Sugar": {
      "aktual": 1,
      "prediksi": 4.3199
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 1.7217
    },
    "Matcha Caramel": {
      "aktual": 3,
      "prediksi": 2.0766
    }
  },
  "2026-05-30": {
    "Ori": {
      "aktual": 23,
      "prediksi": 29.9758
    },
    "Oreo": {
      "aktual": 0,
      "prediksi": 4.9704
    },
    "Icing Sugar": {
      "aktual": 3,
      "prediksi": 4.1956
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 1.6237
    },
    "Matcha Caramel": {
      "aktual": 2,
      "prediksi": 2.1101
    }
  },
  "2026-06-06": {
    "Ori": {
      "aktual": 22,
      "prediksi": 29.8541
    },
    "Oreo": {
      "aktual": 1,
      "prediksi": 4.8613
    },
    "Icing Sugar": {
      "aktual": 2,
      "prediksi": 4.0713
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 1.5258
    },
    "Matcha Caramel": {
      "aktual": 2,
      "prediksi": 2.1436
    }
  },
  "2026-06-13": {
    "Ori": {
      "aktual": 36,
      "prediksi": 29.7325
    },
    "Oreo": {
      "aktual": 12,
      "prediksi": 4.7522
    },
    "Icing Sugar": {
      "aktual": 3,
      "prediksi": 3.947
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 1.4279
    },
    "Matcha Caramel": {
      "aktual": 5,
      "prediksi": 2.1771
    }
  },
  "2026-06-20": {
    "Ori": {
      "aktual": 26,
      "prediksi": 29.6108
    },
    "Oreo": {
      "aktual": 4,
      "prediksi": 4.6431
    },
    "Icing Sugar": {
      "aktual": 2,
      "prediksi": 3.8227
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 1.3299
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.2106
    }
  },
  "2026-06-27": {
    "Ori": {
      "aktual": 30,
      "prediksi": 29.4891
    },
    "Oreo": {
      "aktual": 8,
      "prediksi": 4.534
    },
    "Icing Sugar": {
      "aktual": 4,
      "prediksi": 3.6984
    },
    "Red Velvet": {
      "aktual": 0,
      "prediksi": 1.232
    },
    "Matcha Caramel": {
      "aktual": 4,
      "prediksi": 2.2441
    }
  },
  "2026-07-04": {
    "Ori": {
      "aktual": 36,
      "prediksi": 29.3674
    },
    "Oreo": {
      "aktual": 10,
      "prediksi": 4.4249
    },
    "Icing Sugar": {
      "aktual": 10,
      "prediksi": 3.5741
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 1.1341
    },
    "Matcha Caramel": {
      "aktual": 1,
      "prediksi": 2.2776
    }
  },
  "2026-07-11": {
    "Ori": {
      "aktual": 35,
      "prediksi": 29.2458
    },
    "Oreo": {
      "aktual": 5,
      "prediksi": 4.3158
    },
    "Icing Sugar": {
      "aktual": 6,
      "prediksi": 3.4498
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 1.0361
    },
    "Matcha Caramel": {
      "aktual": 1,
      "prediksi": 2.3111
    }
  },
  "2026-07-18": {
    "Ori": {
      "aktual": 27,
      "prediksi": 29.1241
    },
    "Oreo": {
      "aktual": 3,
      "prediksi": 4.2067
    },
    "Icing Sugar": {
      "aktual": 5,
      "prediksi": 3.3255
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 0.9382
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.3446
    }
  },
  "2026-07-25": {
    "Ori": {
      "aktual": 29,
      "prediksi": 29.0024
    },
    "Oreo": {
      "aktual": 2,
      "prediksi": 4.0976
    },
    "Icing Sugar": {
      "aktual": 6,
      "prediksi": 3.2012
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 0.8402
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.378
    }
  },
  "2026-08-01": {
    "Ori": {
      "aktual": 26,
      "prediksi": 28.8808
    },
    "Oreo": {
      "aktual": 7,
      "prediksi": 3.9885
    },
    "Icing Sugar": {
      "aktual": 7,
      "prediksi": 3.0769
    },
    "Red Velvet": {
      "aktual": 3,
      "prediksi": 0.7423
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.4115
    }
  },
  "2026-08-08": {
    "Ori": {
      "aktual": 34,
      "prediksi": 28.7591
    },
    "Oreo": {
      "aktual": 4,
      "prediksi": 3.8794
    },
    "Icing Sugar": {
      "aktual": 6,
      "prediksi": 2.9526
    },
    "Red Velvet": {
      "aktual": 3,
      "prediksi": 0.6444
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.445
    }
  },
  "2026-08-15": {
    "Ori": {
      "aktual": 29,
      "prediksi": 28.6374
    },
    "Oreo": {
      "aktual": 2,
      "prediksi": 3.7703
    },
    "Icing Sugar": {
      "aktual": 7,
      "prediksi": 2.8283
    },
    "Red Velvet": {
      "aktual": 7,
      "prediksi": 0.5464
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.4785
    }
  },
  "2026-08-22": {
    "Ori": {
      "aktual": 21,
      "prediksi": 28.5158
    },
    "Oreo": {
      "aktual": 6,
      "prediksi": 3.6612
    },
    "Icing Sugar": {
      "aktual": 6,
      "prediksi": 2.704
    },
    "Red Velvet": {
      "aktual": 3,
      "prediksi": 0.4485
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.512
    }
  },
  "2026-08-29": {
    "Ori": {
      "aktual": 24,
      "prediksi": 28.3941
    },
    "Oreo": {
      "aktual": 9,
      "prediksi": 3.5521
    },
    "Icing Sugar": {
      "aktual": 8,
      "prediksi": 2.5797
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 0.3506
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.5455
    }
  },
  "2026-09-05": {
    "Ori": {
      "aktual": 26,
      "prediksi": 28.2724
    },
    "Oreo": {
      "aktual": 8,
      "prediksi": 3.443
    },
    "Icing Sugar": {
      "aktual": 6,
      "prediksi": 2.4554
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 0.2526
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.579
    }
  },
  "2026-09-12": {
    "Ori": {
      "aktual": 17,
      "prediksi": 28.1508
    },
    "Oreo": {
      "aktual": 7,
      "prediksi": 3.3339
    },
    "Icing Sugar": {
      "aktual": 2,
      "prediksi": 2.3311
    },
    "Red Velvet": {
      "aktual": 2,
      "prediksi": 0.1547
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.6125
    }
  },
  "2026-09-19": {
    "Ori": {
      "aktual": 17,
      "prediksi": 28.0291
    },
    "Oreo": {
      "aktual": 4,
      "prediksi": 3.2248
    },
    "Icing Sugar": {
      "aktual": 4,
      "prediksi": 2.2068
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 0.0568
    },
    "Matcha Caramel": {
      "aktual": 0,
      "prediksi": 2.646
    }
  },
  "2026-09-26": {
    "Ori": {
      "aktual": 15,
      "prediksi": 27.9074
    },
    "Oreo": {
      "aktual": 4,
      "prediksi": 3.1157
    },
    "Icing Sugar": {
      "aktual": 2,
      "prediksi": 2.0826
    },
    "Red Velvet": {
      "aktual": 1,
      "prediksi": 0
    },
    "Matcha Caramel": {
      "aktual": 1,
      "prediksi": 2.6795
    }
  }
};
