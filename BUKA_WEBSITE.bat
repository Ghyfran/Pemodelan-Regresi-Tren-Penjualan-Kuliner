@echo off
title Churrostime Data Mining - PropPD_2401020053
cd /d "%~dp0"

echo ====================================================================
echo  SISTEM PREDIKSI & EVALUASI TREN PENJUALAN CHURROSTIME (DATA MINING)
echo  Proposal Riset: PropPD_2401020053 (Ganjil 2026-2027)
echo  Mitra: UMKM Churrostime, Jl. Hang Tuah No. 7, Tanjungpinang
echo ====================================================================
echo.

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Menjalankan Server Lokal Node.js...
    echo Buka di browser: http://localhost:4173
    start "" http://localhost:4173
    node server_datamining.js
) else (
    echo [Info] Node.js tidak terdeteksi. Membuka website langsung di browser...
    start "" "%~dp0dist\index.html"
)
pause
