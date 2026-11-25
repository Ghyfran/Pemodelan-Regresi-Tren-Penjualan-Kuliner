import React from 'react';
import { 
  FileText, 
  Download, 
  Users, 
  Store, 
  Target, 
  CheckCircle2, 
  Database, 
  FileSpreadsheet 
} from 'lucide-react';
import { APP_INFO } from '../data/churrosDataset';

export default function ProposalView() {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Dokumentasi Riset Akademik Penambangan Data
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1 leading-snug">
              {APP_INFO.judulProposal}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Semester Ganjil 2026–2027 • Bidang Keilmuan Penambangan Data (Data Mining)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/PropPD_2401020053.pdf"
              download="PropPD_2401020053.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Proposal PDF</span>
            </a>

            <a
              href="/SiapMining_2401020053.xlsx"
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh Dataset Excel</span>
            </a>

            <a
              href="/database_churros.sql"
              download="database_churros.sql"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh SQL</span>
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Tim Peneliti & Profil Mitra */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Tim Peneliti */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Users className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Tim Peneliti (5 Mahasiswa)
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {APP_INFO.timPeneliti.map((m, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">
                    {idx + 1}. {m.nama}
                  </span>
                  {idx === 0 && (
                    <span className="ml-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Ketua Tim
                    </span>
                  )}
                  <p className="text-[11px] text-slate-500 mt-0.5">{m.peran}</p>
                </div>
                <span className="font-mono text-slate-700 font-bold bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  {m.nim}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Profil Mitra */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Mitra Pemilik Data
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 text-sm block">{APP_INFO.mitra.nama}</span>
              <p className="text-slate-600">{APP_INFO.mitra.alamat}</p>
              <p className="text-slate-500 text-[11px]">
                Beroperasi sejak {APP_INFO.mitra.beroperasiSejak} • {APP_INFO.mitra.operasional}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 border border-slate-200 rounded-lg">
                <span className="text-slate-400 block font-medium">Narasumber Pembukuan:</span>
                <strong className="text-slate-800">{APP_INFO.mitra.narasumber}</strong>
              </div>
              <div className="p-2.5 border border-slate-200 rounded-lg">
                <span className="text-slate-400 block font-medium">Pemilik Usaha (Owner):</span>
                <strong className="text-slate-800">{APP_INFO.mitra.pemilik}</strong>
              </div>
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              Produk utama: Churros dengan 5 varian rasa (Ori, Oreo, Icing Sugar, Red Velvet, Matcha Caramel) dan 3 pilihan saus celup (Coklat, Tiramisu, Matcha).
            </p>
          </div>
        </div>

      </div>

      {/* Rangkuman Fokus Penelitian */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-slate-600" />
          <span>Fokus Penelitian Penambangan Data</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">1. Partisi Waktu (80:20)</strong>
            <p className="text-slate-600 text-[11px]">
              Data training (Oktober 2025 – Juli 2026, 40 minggu) untuk melatih pola deret waktu; data testing (Agustus – September 2026, 8 minggu) untuk evaluasi buta.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">2. 5 Model Regresi OLS Parsial</strong>
            <p className="text-slate-600 text-[11px]">
              Membangun fungsi regresi linier secara parsial untuk masing-masing varian menu kuliner beserta pengukuran akurasi MAE dan RMSE.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">3. Evaluasi Gap Penjualan</strong>
            <p className="text-slate-600 text-[11px]">
              Membandingkan estimasi vs transaksi aktual kasir di lapangan untuk mengidentifikasi penyebab selisih tren dan memberikan rekomendasi operasional gerai.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
