import React, { useState } from 'react';
import { 
  VARIAN_DETAILS, 
  SAUCE_DISTRIBUTION, 
  APP_INFO 
} from '../data/churrosDataset';
import { 
  ShoppingBag, 
  Flame, 
  Database, 
  TestTube2, 
  Target, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PieChart as PieIcon,
  HelpCircle,
  Store,
  Layers,
  ArrowRight,
  Calculator,
  BookOpen,
  Calendar,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

export default function Dashboard({ 
  currentDataState, 
  setActiveTab, 
  onOpenAbout 
}) {
  const [selectedVariant, setSelectedVariant] = useState('Ori');

  const rawCount = currentDataState?.rawCount || 2209;
  const trainWeeksCount = currentDataState?.trainWeeksCount || 40;
  const testWeeksCount = currentDataState?.testWeeksCount || 8;
  const evaluations = currentDataState?.evaluations || [];

  // Compute dynamic average MAE
  const avgMae = evaluations.length > 0
    ? (evaluations.reduce((sum, e) => sum + (e.MAE || 0), 0) / evaluations.length).toFixed(2)
    : '3.25';

  // Variant share data for charts
  const variantData = Object.values(VARIAN_DETAILS).map(v => ({
    name: v.id,
    fullName: v.name,
    share: v.share,
    value: v.share,
    color: v.color,
    price: v.price
  }));

  // KPI cards
  const kpis = [
    {
      title: 'Total Transaksi Riil',
      value: rawCount.toLocaleString('id-ID'),
      unit: 'baris nota',
      subtitle: `${currentDataState?.minDateStr || '2025-10-23'} s.d ${currentDataState?.maxDateStr || '2026-09-30'}`,
      icon: Database,
      color: 'from-amber-500 to-amber-600',
      badge: 'Basis Data Kasir',
      tooltip: 'Catatan transaksi penjualan time-series lengkap dari outlet UMKM Churrostime'
    },
    {
      title: 'Varian Menu Terlaris',
      value: 'Original (Ori)',
      unit: '65.3% share',
      subtitle: '1.431 porsi terjual',
      icon: Flame,
      color: 'from-orange-500 to-amber-600',
      badge: 'Produk Unggulan',
      tooltip: 'Varian original menjadi kontributor omzet terbesar UMKM Churrostime sepanjang tahun'
    },
    {
      title: 'Dataset Training',
      value: `${trainWeeksCount} Minggu`,
      unit: 't = 1 s.d. 40',
      subtitle: 'Okt 2025 – Jul 2026',
      icon: ShoppingBag,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Fase Pembelajaran',
      tooltip: 'Data latih 40 minggu untuk melatih koefisien intercept (b0) dan laju tren waktu (b1)'
    },
    {
      title: 'Dataset Testing',
      value: `${testWeeksCount} Minggu`,
      unit: 't = 41 s.d. 48',
      subtitle: 'Agu 2026 – Sep 2026',
      icon: TestTube2,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Fase Evaluasi Buta',
      tooltip: 'Periode studi kasus transaksi riil Agustus–September 2026 untuk menguji akurasi model'
    },
    {
      title: 'Rata-Rata MAE',
      value: avgMae,
      unit: 'porsi / minggu',
      subtitle: 'Akurasi 5 varian OLS',
      icon: Target,
      color: 'from-rose-500 to-red-600',
      badge: 'Akurasi Tinggi',
      tooltip: 'Rata-rata selisih mutlak antara proyeksi regresi linier vs realisasi transaksi aktual'
    }
  ];

  // Methodology steps from the proposal
  const methodologySteps = [
    {
      step: '01',
      title: 'Pengumpulan & Pre-proses Data',
      desc: 'Pembersihan 2.209 transaksi kasir, eliminasi anomali, penanganan logbook hari operasional (Selasa–Minggu).'
    },
    {
      step: '02',
      title: 'Transformasi Fitur Waktu',
      desc: 'Agregasi harian ke deret waktu 48 minggu efektif per 5 varian menu (Ori, Oreo, Icing Sugar, Red Velvet, Matcha Caramel).'
    },
    {
      step: '03',
      title: 'Pemisahan Training & Testing (80:20)',
      desc: 'Data latih 40 minggu (Okt 2025–Jul 2026) dan data uji 8 minggu (Agu–Sep 2026) tanpa kebocoran data (leak-free).'
    },
    {
      step: '04',
      title: '5 Model Regresi Linier OLS Parsial',
      desc: 'Membangun persamaan regresi terpisah untuk tiap varian menu kuliner untuk menangkap dinamika permintaan masing-masing.'
    },
    {
      step: '05',
      title: 'Evaluasi Gap & Perencanaan Stok',
      desc: 'Membandingkan prediksi vs aktual Agustus–September 2026, analisis faktor lapangan, dan kalkulasi kebutuhan bahan baku.'
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Hero Banner with Warm Modern Styling & Food Branding */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white border border-amber-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center relative z-20">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proposal Riset: {APP_INFO.proposalCode}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Store className="w-3.5 h-3.5" />
                <span>{APP_INFO.mitra.nama} • Jl. Hang Tuah No. 7</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-amber-50 leading-tight">
              Pemodelan Regresi Berbasis Waktu Parsial untuk Evaluasi Tren Penjualan Kuliner
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Platform pendukung keputusan operasional berbasis data mining untuk UMKM Churrostime Tanjungpinang. Mengolah <strong>2.209 catatan transaksi kasir</strong> secara objektif melalui 5 model regresi linier spesifik varian guna mengevaluasi dinamika penjualan periode <strong>Agustus – September 2026</strong> dan memproyeksikan kebutuhan persediaan stok bahan baku secara presisi.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('prediction')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-900/40 transition-all transform hover:-translate-y-0.5"
              >
                <Calculator className="w-4 h-4 text-slate-950" />
                <span>Buka Kalkulator Prediksi Stok</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('evaluation')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/10 transition-all"
              >
                <TestTube2 className="w-4 h-4 text-amber-400" />
                <span>Evaluasi Model Regresi OLS</span>
              </button>

              <button
                onClick={onOpenAbout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-950/60 text-amber-300 font-semibold text-xs sm:text-sm border border-amber-500/30 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Rincian Proposal</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-64 sm:h-80 lg:h-full relative overflow-hidden flex items-center justify-center p-4 lg:p-6">
            <div className="relative w-full h-full max-h-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 group">
              <img 
                src="/churros.jpg" 
                alt="Churrostime Tanjungpinang"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-mono text-amber-300 font-bold tracking-wider uppercase">
                  Mitra Riset UMKM Kuliner
                </span>
                <p className="text-sm font-serif font-bold text-white">
                  Churrostime Tanjungpinang
                </p>
                <p className="text-[11px] text-slate-300">
                  Jl. Hang Tuah No. 7, Tanjungpinang, Kepulauan Riau (Beroperasi sejak 2016)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="glass-card rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 border border-slate-200/90 hover:border-amber-400 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.color} text-white shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {kpi.badge}
                  </span>
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{kpi.title}</h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900 font-serif tracking-tight">{kpi.value}</span>
                  <span className="text-xs font-medium text-slate-500">{kpi.unit}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{kpi.subtitle}</span>
                <div className="relative cursor-help" title={kpi.tooltip}>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-amber-600 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section: Variant Composition & Dipping Sauces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Variant Distribution Donut */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-amber-600" />
                <span>Proporsi Volume Penjualan 5 Varian Menu</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pangsa pasar dari total {rawCount.toLocaleString('id-ID')} transaksi kasir tervalidasi
              </p>
            </div>

            <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full font-semibold border border-amber-200">
              5 Varian Kuliner
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Recharts Pie */}
            <div className="md:col-span-6 h-60 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={variantData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="share"
                    onClick={(entry) => setSelectedVariant(entry.name)}
                    cursor="pointer"
                  >
                    {variantData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="#fff" 
                        strokeWidth={entry.name === selectedVariant ? 3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val, name) => [`${val}% (${VARIAN_DETAILS[name]?.name})`, 'Pangsa Penjualan']}
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-medium">Terlaris</span>
                <span className="text-xl font-black text-amber-700 font-serif">65.3%</span>
                <span className="text-[10px] text-slate-600 font-bold uppercase">Varian Ori</span>
              </div>
            </div>

            {/* List breakdown */}
            <div className="md:col-span-6 space-y-2">
              {variantData.map((item) => (
                <div 
                  key={item.name}
                  onClick={() => setSelectedVariant(item.name)}
                  className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all border ${
                    selectedVariant === item.name 
                      ? 'bg-amber-50/80 border-amber-400 shadow-xs' 
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{item.fullName}</span>
                      <span className="text-[10px] text-slate-400">Rp {item.price.toLocaleString('id-ID')} / porsi</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono">{item.share}%</span>
                    <span className="text-[10px] text-slate-400 block">
                      {Math.round((item.share / 100) * rawCount)} porsi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dipping Sauce Addon Bar */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center justify-between">
              <span>Distribusi Saus Celup (Dipping Sauce Preference)</span>
              <span className="text-[11px] text-slate-400 font-normal">Pilihan rasa pelengkap pelanggan</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAUCE_DISTRIBUTION.map((sauce) => (
                <div key={sauce.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sauce.color }} />
                    <span className="text-xs font-semibold text-slate-800 truncate">{sauce.name}</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base font-extrabold text-slate-900 font-mono">{sauce.percentage}%</span>
                    <span className="text-[10px] text-slate-400 font-mono">{sauce.count} cup</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Proposal Problem & Solution Summary */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="glass-card rounded-3xl p-6 shadow-xs border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Tujuan Riset Sesuai Proposal
                </h4>
                <p className="text-[11px] text-slate-500">
                  Kode Berkas: {APP_INFO.proposalCode}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Permasalahan Utama Mitra</span>
                <p>
                  Catatan transaksi hanya disimpan sebagai arsip pembukuan tanpa diolah. Pada periode transaksi terbaru (Agustus–September 2026), terjadi perubahan laju penjualan antarvarian yang tidak dapat dievaluasi objektif secara kasat mata, berisiko menyebabkan salah perhitungan stok dan strategi promosi.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Solusi Penambangan Data</span>
                <p className="text-amber-900/90">
                  Membangun 5 model regresi berbasis waktu secara parsial untuk memetakan tren tiap varian produk, menguji akurasi (MAE/RMSE), dan membandingkan prediksi vs realisasi riil untuk merumuskan perencanaan persediaan bahan baku secara tepat.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('insights')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <span>Lihat Analisis Temuan Kasus</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab('input')}
              className="p-4 rounded-2xl glass-card hover:bg-amber-50/40 border border-slate-200 hover:border-amber-300 transition-all text-left group"
            >
              <Database className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 text-xs block">Modul 1: Manajemen Data</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Upload XLSX/CSV & Split</span>
            </button>

            <button
              onClick={() => setActiveTab('prediction')}
              className="p-4 rounded-2xl glass-card hover:bg-amber-50/40 border border-slate-200 hover:border-amber-300 transition-all text-left group"
            >
              <Calculator className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 text-xs block">Modul 3: Kalkulator Stok</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Simulasi Forecast & Belanja</span>
            </button>
          </div>

        </div>

      </div>

      {/* Methodology Flowchart Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90">
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Alur Riset Penambangan Data
          </span>
          <h3 className="text-base font-bold text-slate-900 font-serif mt-2">
            Metodologi Pemodelan Regresi Berbasis Deret Waktu Parsial
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tahapan sistematis dari data mentah kasir hingga menjadi sistem pendukung keputusan operasional UMKM
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {methodologySteps.map((m, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-xs transition-all relative"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center mb-2 shadow-xs">
                {m.step}
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">{m.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
