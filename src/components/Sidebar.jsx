import React from 'react';
import { 
  Database, 
  LineChart, 
  Calculator, 
  BarChart2, 
  RotateCcw
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onResetData, 
  currentDataState 
}) {
  const menuItems = [
    {
      id: 'input',
      label: 'Data Transaksi',
      sublabel: 'Upload & Partisi Waktu',
      icon: Database
    },
    {
      id: 'evaluation',
      label: 'Model Regresi OLS',
      sublabel: 'Evaluasi 5 Varian & Grafik',
      icon: LineChart
    },
    {
      id: 'prediction',
      label: 'Kalkulator Prediksi',
      sublabel: 'Simulasi Proyeksi Penjualan',
      icon: Calculator
    },
    {
      id: 'insights',
      label: 'Evaluasi Kasus',
      sublabel: 'Analisis Gap & Fenomena',
      icon: BarChart2
    }
  ];

  const unitLabel = currentDataState?.isWeeklySource ? 'Porsi' : 'Nota';
  const countVal = currentDataState?.rawCount ?? 2209;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      
      {/* Top Brand & Menu List */}
      <div className="p-5 flex flex-col h-full overflow-y-auto">
        
        {/* Brand Header */}
        <div className="pb-5 mb-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              CT
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-900 tracking-tight leading-none">
                CHURROSTIME
              </h1>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Data Mining & Regresi Waktu
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
            Menu Sistem
          </span>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <div className="truncate">
                  <span className="block leading-tight">{item.label}</span>
                  <span className={`text-[10px] block font-normal mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    {item.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 mt-auto border-t border-slate-200 space-y-2.5">
          <div className="text-[11px] text-slate-500 px-1 flex items-center justify-between">
            <span>Status Data:</span>
            <span className="font-mono font-bold text-slate-800">
              {countVal.toLocaleString('id-ID')} {unitLabel}
            </span>
          </div>

          <button
            onClick={onResetData}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Data Default</span>
          </button>

          <div className="px-1 pt-1 text-[10px] text-slate-400 text-center">
            UMKM Churrostime • Tanjungpinang
          </div>
        </div>

      </div>

    </aside>
  );
}
