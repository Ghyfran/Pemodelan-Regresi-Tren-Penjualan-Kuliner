# Pemodelan Regresi Berbasis Waktu secara Parsial Berdasarkan Varian Menu untuk Evaluasi Tren Penjualan Kuliner

Proyek akhir mata kuliah Penambangan Data (INF11121), Program Studi Teknik Informatika, Universitas Maritim Raja Ali Haji. Studi kasus: UMKM Churrostime, Tanjungpinang.

## Anggota

| NIM | Nama | Peran |
|---|---|---|
| 2401020053 | Rizka Sufianty | Ketua |
| 2401020062 | Piky Al Piandi | Anggota |
| 2401020072 | Nurul Aida | Anggota |
| 2401020078 | Abdal Ghyfran KH | Anggota |
| 2401020089 | M. Rizky Anargya Sofyan | Anggota |

## Latar Belakang

Churrostime menjual lima varian churros: Ori, Oreo, Icing Sugar, Red Velvet, dan Matcha Caramel. Catatan transaksi selama ini hanya disimpan sebagai arsip pembukuan. Proyek ini membangun satu model regresi linear untuk setiap varian, lalu mengukur selisih antara prediksi model dan penjualan aktual pada Agustus–September 2026.

## Data

- Sumber: struk dan rekapan harian mitra, didigitalkan ke Excel dengan satu baris untuk setiap item nota.
- Rentang: 23 Oktober 2025 sampai 30 September 2026.
- Ukuran: 2.209 baris, 2.253 unit terjual, 275 hari bertransaksi dari 343 hari kalender.
- Atribut: No Nota, Tanggal, Waktu, Nama Produk, Jenis Saus, Jumlah Terjual, Harga.

## Metode

1. Transaksi dijumlahkan per minggu (Sabtu–Jumat) untuk setiap varian.
2. Indeks waktu t = (tanggal awal minggu − 18 Oktober 2025) / 7. Variabel bebas model hanya t.
3. Data latih: t = 1 sampai 40 (25 Oktober 2025 – 31 Juli 2026). Data uji: t = 41 sampai 48 (1 Agustus – 25 September 2026). Pembagian mengikuti urutan waktu tanpa pengacakan. Dua minggu parsial di tepi data tidak dipakai.
4. Satu model OLS untuk setiap varian: ŷ = max(0, b0 + b1 · t).
5. Evaluasi dengan MAE dan RMSE, serta pembanding berupa rata-rata penjualan mingguan data latih.

## Hasil

Parameter model (data latih, 40 minggu):

| Varian | b0 | b1 | R² |
|---|---:|---:|---:|
| Ori | 33,8692 | −0,1217 | 0,0295 |
| Oreo | 8,4615 | −0,1091 | 0,1308 |
| Icing Sugar | 8,1731 | −0,1243 | 0,1292 |
| Red Velvet | 4,7577 | −0,0979 | 0,4010 |
| Matcha Caramel | 1,0385 | +0,0335 | 0,0490 |

Evaluasi pada data uji (8 minggu, 2.209 baris):

| Varian | Total aktual | Total prediksi | MAE | RMSE |
|---|---:|---:|---:|---:|
| Ori | 194 | 227,64 | 5,606 | 6,735 |
| Oreo | 47 | 28,85 | 2,711 | 3,205 |
| Icing Sugar | 46 | 21,14 | 3,191 | 3,504 |
| Red Velvet | 21 | 3,20 | 2,225 | 2,830 |
| Matcha Caramel | 0 | 20,23 | 2,529 | 2,530 |

MAE dan RMSE dalam unit per minggu, dan bukan persentase akurasi.

Temuan utama:

- Model regresi memiliki galat lebih kecil daripada rata-rata data latih hanya pada Ori (MAE 5,606 dibanding 7,781).
- Pada Oreo, Icing Sugar, Red Velvet, dan Matcha Caramel, rata-rata data latih memiliki galat lebih kecil.
- R² data latih berada pada 0,0295 sampai 0,4010, sehingga tren linear terhadap waktu belum dapat menjadi satu-satunya dasar perencanaan stok.

## Keterbatasan

- Data uji hanya delapan minggu dan data hanya mencakup satu tahun.
- Model hanya memakai waktu sebagai variabel bebas.
- Nilai nol pada data tidak dapat dibedakan antara stok habis, menu tidak ditawarkan, dan tidak diminati.

## Aplikasi Web CHURROSTIME

Aplikasi web memuat empat modul: data transaksi, model regresi OLS dan evaluasi akurasi, kalkulator prediksi, dan evaluasi kasus per varian.

## Laporan

Laporan akhir: FinPD_2401020053.pdf
