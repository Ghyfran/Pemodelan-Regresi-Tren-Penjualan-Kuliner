import React from 'react';
import { Database, LineChart, Calculator, Info } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenAbout }) {
  const navTabs = [
    { id: 'input', label: '1. Data Transaksi', icon: Database },
    { id: 'evaluation', label: '2. Evaluasi Model', icon: LineChart },
    { id: 'prediction', label: '3. Kalkulator Prediksi', icon: Calculator },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Simple Title & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-8 bg-slate-800 rounded-xs" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight">
                Sistem Analisis & Prediksi Tren Penjualan
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Pemodelan Regresi Berbasis Waktu Parsial
              </p>
            </div>
          </div>

          {/* Right: Clean, unadorned navigation tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <span className="w-px h-5 bg-gray-200 mx-1" />

            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-gray-500" />
              <span>Tentang</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
