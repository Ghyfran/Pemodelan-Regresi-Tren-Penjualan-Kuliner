import React, { useState, useMemo } from 'react';
import { 
  VARIAN_DETAILS, 
  INVENTORY_CONVERSION,
  SAUCE_DISTRIBUTION 
} from '../data/churrosDataset';
import { 
  Calculator, 
  Calendar, 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Package, 
  CookingPot, 
  UtensilsCrossed,
  Droplets,
  DollarSign,
  Info,
  Clock,
  ArrowRight,
  Layers,
  Printer,
  ChevronRight,
  SlidersHorizontal,
  CloudRain,
  Flame,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import confetti from 'canvas-confetti';

export default function PredictionTool() {
  const [selectedVariant, setSelectedVariant] = useState('ALL');
  const [weekIndex, setWeekIndex] = useState(50); // Default to Week 50 (Early October 2026)
  const [horizonWeeks, setHorizonWeeks] = useState(4); // 4 weeks ahead
  const [inputDate, setInputDate] = useState('2026-10-03');
  const [scenarioMultiplier, setScenarioMultiplier] = useState(1.0); // 1.0 (Normal), 1.25 (Weekend/Holiday Rush), 0.8 (Rainy Season)
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Helper date conversions
  const baseStartDate = new Date('2025-10-18T00:00:00');

  const getWeekRange = (t) => {
    const start = new Date(baseStartDate.getTime() + t * 7 * 86400000);
    const end = new Date(start.getTime() + 6 * 86400000);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return {
      startStr: start.toLocaleDateString('id-ID', options),
      endStr: end.toLocaleDateString('id-ID', options),
      startDate: start.toISOString().split('T')[0],
      label: `Mg ${t} (${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' })})`
    };
  };

  const handleDateChange = (dateStr) => {
    setInputDate(dateStr);
    const picked = new Date(dateStr + 'T00:00:00');
    if (!isNaN(picked.getTime())) {
      const diffDays = Math.floor((picked.getTime() - baseStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const calculatedT = Math.max(49, Math.floor(diffDays / 7));
      setWeekIndex(calculatedT);
    }
  };

  const handleWeekChange = (newT) => {
    const validT = Math.max(49, parseInt(newT) || 49);
    setWeekIndex(validT);
    const range = getWeekRange(validT);
    setInputDate(range.startDate);
  };

  // Formula computation for a single variant at week t with scenario
  const calculatePrediction = (varKey, t) => {
    const v = VARIAN_DETAILS[varKey];
    if (!v) return 0;
    const raw = v.b0 + v.b1 * t;
    const bounded = Math.max(0, raw);
    return bounded * scenarioMultiplier;
  };

  // Forecast for all horizon weeks
  const multiWeekForecast = useMemo(() => {
    const result = [];
    const variantsToCalculate = selectedVariant === 'ALL' 
      ? Object.keys(VARIAN_DETAILS) 
      : [selectedVariant];

    for (let i = 0; i < horizonWeeks; i++) {
      const currentT = weekIndex + i;
      const range = getWeekRange(currentT);
      const weekItem = {
        t: currentT,
        weekLabel: range.label,
        shortLabel: `Mg ${currentT}`,
        dateRange: `${range.startStr} - ${range.endStr}`,
        totalUnits: 0,
        totalRaw: 0,
        variants: {}
      };

      variantsToCalculate.forEach(vKey => {
        const v = VARIAN_DETAILS[vKey];
        const val = calculatePrediction(vKey, currentT);
        weekItem.variants[vKey] = {
          raw: val,
          rounded: Math.round(val),
          minTol: Math.max(0, Number((val - v.mae).toFixed(1))),
          maxTol: Number((val + v.mae).toFixed(1)),
          mae: v.mae,
          revenue: Math.round(val) * v.price
        };
        weekItem.totalRaw += val;
        weekItem.totalUnits += Math.round(val);
      });

      result.push(weekItem);
    }
    return result;
  }, [selectedVariant, weekIndex, horizonWeeks, scenarioMultiplier]);

  // Aggregate totals for the selected period
  const totalStats = useMemo(() => {
    let units = 0;
    let revenue = 0;
    let flourKg = 0;
    let oilL = 0;
    let eggs = 0;
    let butterKg = 0;

    multiWeekForecast.forEach(week => {
      Object.keys(week.variants).forEach(vKey => {
        const vData = week.variants[vKey];
        units += vData.rounded;
        revenue += vData.revenue;
      });
    });

    flourKg = (units * INVENTORY_CONVERSION.flourPerPortionGrams) / 1000;
    oilL = (units * INVENTORY_CONVERSION.oilPerPortionMl) / 1000;
    eggs = Math.round(units * INVENTORY_CONVERSION.eggPerPortion);
    butterKg = (units * INVENTORY_CONVERSION.butterPerPortionGrams) / 1000;

    // Dipping sauce portioning estimates
    const sauceCupsTotal = units;
    const sauceCoklatCups = Math.round(sauceCupsTotal * 0.709);
    const sauceTiramisuCups = Math.round(sauceCupsTotal * 0.139);
    const sauceMatchaCups = Math.round(sauceCupsTotal * 0.096);

    return {
      units,
      revenue,
      flourKg: flourKg.toFixed(1),
      oilL: oilL.toFixed(1),
      eggs,
      butterKg: butterKg.toFixed(1),
      sauceCoklatCups,
      sauceTiramisuCups,
      sauceMatchaCups
    };
  }, [multiWeekForecast]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D97706', '#F59E0B', '#B45309', '#FFFBEB']
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm border border-caramel-300/80 bg-gradient-to-br from-cream-100/90 via-white to-amber-50/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel-100 text-caramel-900 border border-caramel-300 text-xs font-bold">
              <Calculator className="w-3.5 h-3.5 text-caramel-700" />
              <span>Modul 2: Kalkulator Prediksi Penjualan & Perencanaan Stok</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-darkslate-900">
              Simulasi Permintaan Stok Mingguan Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Gunakan formula OLS terlatih untuk memproyeksikan penjualan mingguan ke depan (Oktober 2026 dst.). Dilengkapi interval toleransi berbasis MAE, skenario kondisi operasional, dan konversi bahan baku adonan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-darkslate-900 font-semibold text-xs border border-caramel-300 shadow-sm flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-caramel-600" />
              <span>Cetak Daftar Belanja</span>
            </button>

            <button
              onClick={() => {
                triggerConfetti();
              }}
              className="px-4 py-2 rounded-xl bg-caramel-600 hover:bg-caramel-700 text-white font-semibold text-xs shadow-md shadow-caramel-600/30 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Kalkulasi Ulang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel: Variant, Horizon, Week Index, Scenario */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-sm border border-caramel-200/90 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Variant Selector */}
          <div className="md:col-span-4 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Pilih Varian Menu
            </label>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-caramel-300 text-darkslate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-caramel-500 shadow-sm"
            >
              <option value="ALL">✨ Semua Varian (Total Toko)</option>
              <option value="Ori">Churros Original (Ori)</option>
              <option value="Oreo">Churros Oreo Crumbs</option>
              <option value="Icing Sugar">Churros Icing Sugar</option>
              <option value="Red Velvet">Churros Red Velvet</option>
              <option value="Matcha Caramel">Churros Matcha Caramel</option>
            </select>
            <span className="text-[11px] text-slate-500 block truncate">
              {selectedVariant === 'ALL' 
                ? 'Agregasi gabungan ke-5 varian menu Churrostime' 
                : `Formula: ${VARIAN_DETAILS[selectedVariant]?.formula}`}
            </span>
          </div>

          {/* Week Index / Date Picker */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Horizon Awal Prediksi
              </label>
              <span className="text-[11px] font-mono text-caramel-700 font-bold">
                t = {weekIndex} ({getWeekRange(weekIndex).startStr})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="49"
                  max="104"
                  value={weekIndex}
                  onChange={(e) => handleWeekChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-caramel-300 text-darkslate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-caramel-500"
                  placeholder="Minggu ke-t"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">Idx t</span>
              </div>

              <div className="relative">
                <input
                  type="date"
                  min="2026-09-26"
                  value={inputDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-caramel-300 text-darkslate-900 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-caramel-500"
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Pilih indeks minggu (dimulai dari t=49, Oktober 2026) atau input tanggal kalender target.
            </span>
          </div>

          {/* Horizon Slider */}
          <div className="md:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Rentang Minggu
              </label>
              <span className="text-xs font-bold text-caramel-800 bg-caramel-100 px-2 py-0.5 rounded-md font-mono">
                {horizonWeeks} Minggu
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={horizonWeeks}
              onChange={(e) => setHorizonWeeks(parseInt(e.target.value))}
              className="w-full accent-caramel-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 mg</span>
              <span>6 mg</span>
              <span>12 mg (1 Qtr)</span>
            </div>
          </div>
        </div>

        {/* Operational Scenario Presets */}
        <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-caramel-600" />
            <span>Skenario Penyesuaian Operasional Toko:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setScenarioMultiplier(1.0)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                scenarioMultiplier === 1.0
                  ? 'bg-darkslate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>Normal (Tren OLS 100%)</span>
            </button>

            <button
              onClick={() => setScenarioMultiplier(1.25)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                scenarioMultiplier === 1.25
                  ? 'bg-caramel-600 text-white shadow-sm shadow-caramel-600/30'
                  : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Weekend / Libur Panjang (+25%)</span>
            </button>

            <button
              onClick={() => setScenarioMultiplier(0.8)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                scenarioMultiplier === 0.8
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-blue-300" />
              <span>Musim Hujan / Low Traffic (−20%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Forecast Summary Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated Volume Card */}
        <div className="glass-card rounded-2xl p-5 border border-caramel-300 shadow-sm bg-gradient-to-br from-white to-amber-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Proyeksi Penjualan</span>
            <div className="p-2 rounded-xl bg-caramel-100 text-caramel-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-caramel-700 font-serif">
              {totalStats.units.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-medium text-slate-500">porsi total</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            Estimasi akumulasi untuk rentang <strong>{horizonWeeks} minggu</strong> ke depan
          </p>
        </div>

        {/* Estimated Revenue Card */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-300 shadow-sm bg-gradient-to-br from-white to-emerald-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimasi Omzet Kotor</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-serif">
              Rp {totalStats.revenue.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            Berdasarkan harga menu Rp 22.000 (Ori & Icing) / Rp 25.000 (Topping)
          </p>
        </div>

        {/* Weekly Pace */}
        <div className="glass-card rounded-2xl p-5 border border-blue-300 shadow-sm bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rata-Rata Mingguan</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-800 font-serif">
              {(totalStats.units / horizonWeeks).toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-500">porsi / minggu</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            Target operasional toko per 6 hari kerja aktif (tanpa Senin)
          </p>
        </div>

        {/* Model Confidence / Margin */}
        <div className="glass-card rounded-2xl p-5 border border-purple-300 shadow-sm bg-gradient-to-br from-white to-purple-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Margin Toleransi Error</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-800 font-mono">
              ± {(selectedVariant === 'ALL' ? 3.25 : VARIAN_DETAILS[selectedVariant]?.mae)}
            </span>
            <span className="text-xs font-medium text-slate-500">unit MAE</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            Batas atas & bawah fluktuasi permintaan wajar
          </p>
        </div>
      </div>

      {/* Week-by-Week Forecast Breakdown & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Multi-Week Projection Chart */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 border border-caramel-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-darkslate-900 font-serif">
                Grafik Tren Proyeksi {horizonWeeks} Minggu ke Depan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedVariant === 'ALL' ? 'Proyeksi total gabungan' : `Proyeksi varian ${VARIAN_DETAILS[selectedVariant]?.name}`} {scenarioMultiplier !== 1.0 && `(Skenario x${scenarioMultiplier})`}
              </p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-semibold border border-amber-300">
              t = {weekIndex} s.d. {weekIndex + horizonWeeks - 1}
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={multiWeekForecast}>
                <defs>
                  <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="shortLabel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val, name) => [`${val} Unit`, name === 'totalUnits' ? 'Estimasi Penjualan' : name]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="totalUnits" 
                  name="Estimasi Penjualan (Porsi)" 
                  stroke="#D97706" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#forecastFill)" 
                  dot={{ r: 4, fill: '#D97706' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Detail Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Periode (t)</th>
                  <th className="py-2.5 px-3">Rentang Tanggal</th>
                  <th className="py-2.5 px-3 text-right">Estimasi Desimal</th>
                  <th className="py-2.5 px-3 text-right">Pembulatan Unit</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Interval Toleransi (±MAE)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {multiWeekForecast.map((week) => (
                  <tr key={week.t} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-2 px-3 font-mono font-bold text-darkslate-900">
                      Minggu ke-{week.t}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {week.dateRange}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700">
                      {week.totalRaw.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-caramel-700 font-mono text-sm">
                      {week.totalUnits} unit
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600 font-mono">
                      {Math.max(0, Math.round(week.totalRaw - (selectedVariant === 'ALL' ? 3.25 : VARIAN_DETAILS[selectedVariant]?.mae)))} – {Math.round(week.totalRaw + (selectedVariant === 'ALL' ? 3.25 : VARIAN_DETAILS[selectedVariant]?.mae))} unit
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Inventory Recommendations (Mitra Guide) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-caramel-300 shadow-sm bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-darkslate-900 font-serif flex items-center gap-2">
                <CookingPot className="w-5 h-5 text-caramel-600" />
                <span>Rekomendasi Operasional & Bahan Baku</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Konversi otomatis dari estimasi {totalStats.units} porsi churros untuk periode {horizonWeeks} minggu
            </p>

            {/* Dough Ingredient Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-caramel-600" />
                <span>Kebutuhan Adonan Churros Utama</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white border border-caramel-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">Tepung Terigu Pro Sedang</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-extrabold text-darkslate-900 font-mono">{totalStats.flourKg}</span>
                    <span className="text-xs text-slate-500">kg</span>
                  </div>
                  <span className="text-[10px] text-caramel-700">~110g per porsi</span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-caramel-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">Minyak Goreng Sawit</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-extrabold text-darkslate-900 font-mono">{totalStats.oilL}</span>
                    <span className="text-xs text-slate-500">liter</span>
                  </div>
                  <span className="text-[10px] text-caramel-700">Deep fry absorpsi</span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-caramel-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">Telur Ayam Segar</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-extrabold text-darkslate-900 font-mono">{totalStats.eggs}</span>
                    <span className="text-xs text-slate-500">butir</span>
                  </div>
                  <span className="text-[10px] text-caramel-700">~0.5 butir / porsi</span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-caramel-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">Margarin / Mentega</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-extrabold text-darkslate-900 font-mono">{totalStats.butterKg}</span>
                    <span className="text-xs text-slate-500">kg</span>
                  </div>
                  <span className="text-[10px] text-caramel-700">Aroma & tekstur</span>
                </div>
              </div>
            </div>

            {/* Sauce Portions */}
            <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cinnamon-600" />
                <span>Rekomendasi Takaran Saus Celup</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-900" />
                    <span className="font-semibold text-slate-800">Saus Coklat Belgia (70.9%)</span>
                  </div>
                  <span className="font-bold text-amber-950 font-mono">{totalStats.sauceCoklatCups} cup (~{(totalStats.sauceCoklatCups * 0.035).toFixed(1)} L)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-700" />
                    <span className="font-semibold text-slate-800">Saus Tiramisu (13.9%)</span>
                  </div>
                  <span className="font-bold text-orange-950 font-mono">{totalStats.sauceTiramisuCups} cup (~{(totalStats.sauceTiramisuCups * 0.035).toFixed(1)} L)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                    <span className="font-semibold text-slate-800">Saus Matcha (9.6%)</span>
                  </div>
                  <span className="font-bold text-emerald-950 font-mono">{totalStats.sauceMatchaCups} cup (~{(totalStats.sauceMatchaCups * 0.035).toFixed(1)} L)</span>
                </div>
              </div>
            </div>

            {/* Practical Advice Alert */}
            <div className="mt-5 p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700" />
                <span>Petunjuk Khusus Mitra Churrostime</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-950/90">
                Untuk varian <strong>Matcha Caramel</strong> dan <strong>Red Velvet</strong>, buat adonan dasar tanpa warna terlebih dahulu, lalu tambahkan perisa hanya saat ada pesanan masuk (*made-by-order*) guna menghindari adonan terbuang sia-sia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Shopping List Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-caramel-300 text-darkslate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-caramel-500 text-white">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-base font-serif">Daftar Belanja Bahan Baku</h4>
                  <p className="text-[11px] text-slate-500">UMKM Churrostime, Jl. Hang Tuah No. 7</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                <span>Horizon: <strong>{horizonWeeks} Minggu</strong> (Mulai Mg {weekIndex})</span>
                <span className="font-bold text-caramel-800">Target: {totalStats.units} Porsi</span>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Bahan Pokok Adonan:</h5>
                <ul className="space-y-1.5">
                  <li className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span>1. Tepung Terigu Protein Sedang</span>
                    <strong className="font-mono">{totalStats.flourKg} Kg</strong>
                  </li>
                  <li className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span>2. Minyak Goreng Deep Fry</span>
                    <strong className="font-mono">{totalStats.oilL} Liter</strong>
                  </li>
                  <li className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span>3. Telur Ayam Ras</span>
                    <strong className="font-mono">{totalStats.eggs} Butir</strong>
                  </li>
                  <li className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span>4. Margarin / Mentega Baker's</span>
                    <strong className="font-mono">{totalStats.butterKg} Kg</strong>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Saus Celup & Packaging:</h5>
                <ul className="space-y-1.5">
                  <li className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span>5. Saus Coklat Belgia</span>
                    <strong className="font-mono">{totalStats.sauceCoklatCups} Cup (~{(totalStats.sauceCoklatCups * 0.035).toFixed(1)} L)</strong>
                  </li>
                  <li className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span>6. Saus Tiramisu</span>
                    <strong className="font-mono">{totalStats.sauceTiramisuCups} Cup (~{(totalStats.sauceTiramisuCups * 0.035).toFixed(1)} L)</strong>
                  </li>
                  <li className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span>7. Saus Matcha</span>
                    <strong className="font-mono">{totalStats.sauceMatchaCups} Cup (~{(totalStats.sauceMatchaCups * 0.035).toFixed(1)} L)</strong>
                  </li>
                  <li className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span>8. Paper Bag & Cup Saus 35ml</span>
                    <strong className="font-mono">{totalStats.units} Set</strong>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-caramel-600 hover:bg-caramel-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Print Sekarang</span>
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
