import React from 'react';
import { APP_INFO } from '../data/churrosDataset';
import { BookOpen, Store, Users, Heart } from 'lucide-react';

export default function Footer({ onOpenAbout, setActiveTab }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Upper Footer: Branding & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          
          <div className="md:col-span-6 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black tracking-wide text-white text-base">
                CHURROSTIME DATA MINING
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {APP_INFO.proposalCode}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Sistem Analisis Tren & Peramalan Stok Bahan Baku Kuliner Berbasis Pemodelan Regresi Berbasis Waktu Parsial Varian Menu (Studi Kasus Transaksi Agustus – September 2026).
            </p>
            <p className="text-[11px] text-slate-500">
              Mitra Usaha: <strong>{APP_INFO.mitra.nama}</strong> ({APP_INFO.mitra.alamat})
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Modul Sistem
            </span>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-amber-400 transition-colors">
                  Dashboard & KPI Penjualan
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('input')} className="hover:text-amber-400 transition-colors">
                  Modul 1: Manajemen Data & Split
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('evaluation')} className="hover:text-amber-400 transition-colors">
                  Modul 2: Evaluasi Model OLS
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('prediction')} className="hover:text-amber-400 transition-colors">
                  Modul 3: Kalkulator Stok Bahan Baku
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('insights')} className="hover:text-amber-400 transition-colors">
                  Modul 4: Evaluasi Kasus
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('database')} className="hover:text-amber-400 transition-colors">
                  Modul 5: Basis Data MySQL & SQL DDL
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Tim Peneliti (Kelompok)
            </span>
            <ul className="space-y-1 text-[11px] text-slate-400">
              {APP_INFO.timPeneliti.map((m, idx) => (
                <li key={idx} className="truncate">
                  {idx + 1}. {m.nama} <span className="text-slate-500 font-mono">({m.nim})</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <button
                onClick={onOpenAbout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-medium transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Buka Rincian Proposal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Lower Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            © 2026–2027 Project Penambangan Data Ganjil • Proposal Code: <strong>{APP_INFO.proposalCode}</strong> • UMKM Churrostime Tanjungpinang
          </p>

          <p className="flex items-center gap-1">
            <span>Dikembangkan untuk Riset Akademik Penambangan Data</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
