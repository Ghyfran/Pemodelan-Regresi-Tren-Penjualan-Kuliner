import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  LineChart, 
  Calculator, 
  Lightbulb, 
  FileSpreadsheet, 
  RotateCcw, 
  BookOpen, 
  Flame, 
  Sparkles, 
  Menu, 
  X,
  FileCheck2
} from 'lucide-react';
import { APP_INFO } from '../data/churrosDataset';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAbout, 
  onResetData, 
  currentDataState 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Ringkasan & KPI',
      icon: LayoutDashboard,
      badge: 'Overview'
    },
    {
      id: 'input',
      label: '1. Manajemen Data',
      subtitle: 'Upload & Split Time-Series',
      icon: Database,
      badge: `${currentDataState?.rawCount || 2209} Nota`
    },
    {
      id: 'evaluation',
      label: '2. Evaluasi Regresi OLS',
      subtitle: 'Grafik & Metrik Akurasi',
      icon: LineChart,
      badge: '5 Varian'
    },
    {
      id: 'prediction',
      label: '3. Kalkulator & Stok',
      subtitle: 'Simulasi Forecast & Resep',
      icon: Calculator,
      badge: 'Bahan Baku',
      highlight: true
    },
    {
      id: 'insights',
      label: '4. Temuan Kasus',
      subtitle: 'Evaluasi Gap Proposal',
      icon: Lightbulb,
      badge: 'Studi Kasus'
    },
    {
      id: 'database',
      label: '5. Basis Data & SQL',
      subtitle: 'MySQL & Dokumen Riset',
      icon: FileSpreadsheet,
      badge: 'Relasional'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Upper Brand Ribbon */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white border-b border-amber-500/20 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Left Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30 font-black">
              <Flame className="w-4 h-4 fill-amber-950 text-amber-950" />
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black tracking-wide text-white text-sm sm:text-base">
                  CHURROSTIME
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Data Mining
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Pemodelan Regresi Berbasis Waktu Parsial Varian Menu (Studi Kasus Transaksi Agustus–September 2026)
              </p>
            </div>
          </div>

          {/* Right Proposal Code & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Proposal Pill Button */}
            <button
              onClick={onOpenAbout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-bold transition-all"
              title="Lihat Detail Proposal Riset"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{APP_INFO.proposalCode}</span>
            </button>

            {/* Quick Reset Data Button */}
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-[11px] font-medium border border-white/10 transition-all"
              title="Kembalikan dataset ke 2.209 transaksi default"
            >
              <RotateCcw className="w-3 h-3 text-slate-300" />
              <span className="hidden md:inline">Reset Default</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-white/10 text-slate-200 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden lg:block">
        <div className="flex items-center justify-between gap-1 py-1.5 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 group relative ${
                  isActive
                    ? tab.highlight
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/25 ring-2 ring-amber-500/40'
                      : 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : tab.highlight
                      ? 'bg-amber-100 text-amber-700 group-hover:bg-amber-200'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : tab.highlight
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] block font-normal leading-none mt-0.5 ${
                    isActive ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    {tab.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div className="text-left">
                    <span className="block">{tab.label}</span>
                    <span className={`text-[10px] block ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                      {tab.subtitle}
                    </span>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
