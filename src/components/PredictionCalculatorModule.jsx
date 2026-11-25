import React, { useState, useMemo, useEffect } from 'react';
import { 
  VARIAN_DETAILS, 
  APP_INFO 
} from '../data/churrosDataset';
import { VARIANT_KEYS } from '../utils/dataProcessor';
import { 
  Calculator, 
  Calendar, 
  Printer, 
  X,
  PieChart,
  Layers
} from 'lucide-react';

export default function PredictionCalculatorModule({ currentDataState }) {
  const weeklyList = currentDataState?.weeklyList || [];
  const models = currentDataState?.models || {};
  const evaluations = currentDataState?.evaluations || [];

  const baseWeek = weeklyList[0];
  const lastWeek = weeklyList[weeklyList.length - 1];
  const baseT = baseWeek?.t ?? 0;
  const initialNextT = lastWeek ? (lastWeek.t + 1) : 49;
  const maxAllowedT = Math.max(500, (lastWeek?.t ?? 50) + 104);

  const [selectedVariant, setSelectedVariant] = useState('ALL');
  const [horizonWeeks, setHorizonWeeks] = useState(4); // 1..8 minggu
  const [startWeek, setStartWeek] = useState(initialNextT);
  const [targetDate, setTargetDate] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Format date helper (tanpa isu timezone UTC)
  const formatDateLocal = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Dynamic Anchor date from first week or fallback
  const anchorDate = useMemo(() => {
    if (baseWeek?.minggu_mulai) {
      const parts = baseWeek.minggu_mulai.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
    return new Date(2025, 9, 18);
  }, [baseWeek?.minggu_mulai]);

  // Helper mendapatkan rentang tanggal minggu ke-t (relatif terhadap baseT agar akurat untuk t mulai 0 maupun 1)
  const getWeekRange = (t) => {
    const offsetWeeks = t - baseT;
    const start = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate() + offsetWeeks * 7);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return {
      startStr: start.toLocaleDateString('id-ID', options),
      endStr: end.toLocaleDateString('id-ID', options),
      startDate: formatDateLocal(start),
      label: `Minggu ke-${t}`
    };
  };

  // Sync default starting week and date whenever dataset changes
  useEffect(() => {
    if (lastWeek) {
      const nextT = lastWeek.t + 1;
      setStartWeek(nextT);
      const offsetWeeks = nextT - baseT;
      const nextStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate() + offsetWeeks * 7);
      setTargetDate(formatDateLocal(nextStart));
    }
  }, [
    currentDataState?.sourceName,
    currentDataState?.minDateStr,
    currentDataState?.maxDateStr,
    weeklyList.length,
    lastWeek?.t,
    baseT,
    anchorDate
  ]);

  // Handler saat user memilih tanggal kalender
  const handleDateChange = (dStr) => {
    setTargetDate(dStr);
    const parts = dStr.split('-');
    if (parts.length === 3) {
      const picked = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const diffMs = picked.getTime() - anchorDate.getTime();
      const diffDays = Math.round(diffMs / 86400000);
      const calculatedT = Math.max(1, Math.min(maxAllowedT, baseT + Math.floor(diffDays / 7)));
      setStartWeek(calculatedT);
    }
  };

  // Handler saat user mengubah minggu langsung
  const handleWeekChange = (newT) => {
    const clampedT = Math.max(1, Math.min(maxAllowedT, newT));
    setStartWeek(clampedT);
    const range = getWeekRange(clampedT);
    setTargetDate(range.startDate);
  };

  // Menghitung prediksi OLS untuk varian tertentu pada minggu t
  const getPrediction = (varKey, t) => {
    const m = models[varKey] || VARIAN_DETAILS[varKey] || { b0: 0, b1: 0 };
    const raw = m.b0 + (m.b1 * t);
    return Math.max(0, raw);
  };

  // Perhitungan proyeksi deret waktu mingguan
  const projections = useMemo(() => {
    const list = [];
    const activeVariants = selectedVariant === 'ALL' ? VARIANT_KEYS : [selectedVariant];

    for (let i = 0; i < horizonWeeks; i++) {
      const curT = startWeek + i;
      const range = getWeekRange(curT);

      let totalRaw = 0;
      let totalRounded = 0;
      let totalMae = 0;
      const breakdown = {};

      VARIANT_KEYS.forEach((vKey) => {
        const val = getPrediction(vKey, curT);
        const evalItem = evaluations.find(e => e.Varian === vKey);
        const mae = evalItem?.MAE ?? VARIAN_DETAILS[vKey]?.mae ?? 2.5;

        breakdown[vKey] = {
          raw: val,
          rounded: Math.round(val),
          mae
        };

        if (activeVariants.includes(vKey)) {
          totalRaw += val;
          totalRounded += Math.round(val);
          totalMae += mae;
        }
      });

      // Rentang toleransi berdasarkan MAE
      const tolerance = selectedVariant === 'ALL' 
        ? Math.round(totalMae) 
        : Math.round(breakdown[selectedVariant]?.mae ?? 2.5);

      list.push({
        t: curT,
        dateRange: `${range.startStr} – ${range.endStr}`,
        raw: totalRaw,
        rounded: totalRounded,
        minTol: Math.max(0, totalRounded - tolerance),
        maxTol: totalRounded + tolerance,
        breakdown
      });
    }

    return list;
  }, [selectedVariant, horizonWeeks, startWeek, models, evaluations, anchorDate, baseT]);

  // Ringkasan total proyeksi
  const summaryTotals = useMemo(() => {
    const totalUnits = projections.reduce((sum, p) => sum + p.rounded, 0);
    const avgPerWeek = horizonWeeks > 0 ? (totalUnits / horizonWeeks).toFixed(1) : '0';

    const minTolTotal = projections.reduce((sum, p) => sum + p.minTol, 0);
    const maxTolTotal = projections.reduce((sum, p) => sum + p.maxTol, 0);

    // Hitung rincian per varian di seluruh horizon
    const variantBreakdown = {};

    let allVariantsSum = 0;
    VARIANT_KEYS.forEach((k) => {
      const vUnits = projections.reduce((sum, p) => sum + (p.breakdown[k]?.rounded || 0), 0);
      variantBreakdown[k] = vUnits;
      allVariantsSum += vUnits;
    });

    return {
      totalUnits,
      avgPerWeek,
      minTolTotal,
      maxTolTotal,
      variantBreakdown,
      allVariantsSum: Math.max(1, allVariantsSum)
    };
  }, [projections, horizonWeeks]);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Kalkulator Simulasi Prediksi Penjualan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulasi estimasi penjualan porsi churros ke depan berdasarkan pemodelan fungsi regresi linier OLS mingguan.
          </p>
        </div>

        <button
          onClick={() => setShowPrintModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Lembar Prediksi</span>
        </button>
      </div>

      {/* Simulator Inputs & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Forecast Controls */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-slate-500" />
              <span>Parameter Simulasi</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              t ≥ {startWeek}
            </span>
          </div>

          {/* Variant Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-2">
              Pilihan Varian Produk:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedVariant('ALL')}
                className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all col-span-2 ${
                  selectedVariant === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Semua Varian (Total Penjualan)
              </button>
              {VARIANT_KEYS.map((vKey) => (
                <button
                  type="button"
                  key={vKey}
                  onClick={() => setSelectedVariant(vKey)}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                    selectedVariant === vKey
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {vKey}
                </button>
              ))}
            </div>
          </div>

          {/* Horizon Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-700">Horizon Prediksi:</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {horizonWeeks} Minggu ({horizonWeeks <= 4 ? `${horizonWeeks * 7} Hari` : `${Math.round(horizonWeeks / 4)} Bulan`})
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="8"
              value={horizonWeeks}
              onChange={(e) => setHorizonWeeks(parseInt(e.target.value, 10))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 Mg</span>
              <span>4 Mg (1 Bulan)</span>
              <span>8 Mg</span>
            </div>
          </div>

          {/* Target Starting Date & Week */}
          <div className="pt-2 grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Tanggal Mulai:
              </label>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input 
                  type="date"
                  value={targetDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="bg-transparent border-0 p-0 text-slate-800 text-xs w-full focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Minggu ke- (t):
              </label>
              <div className="flex items-center gap-1">
                <input 
                  type="number"
                  min="1"
                  max={maxAllowedT}
                  value={startWeek}
                  onChange={(e) => handleWeekChange(parseInt(e.target.value, 10) || 1)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono w-full focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold block text-slate-800">Keterangan Model:</span>
            <p className="leading-relaxed">
              Prediksi dihitung dari persamaan OLS mingguan: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">y = max(0, b0 + b1 * t)</code>.
            </p>
          </div>

        </div>

        {/* Right Column: Prediction Summaries & Variant Distribution */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top 3 KPI Cards */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Ringkasan Estimasi Penjualan ({horizonWeeks} Minggu)
              </h3>
              <span className="text-[11px] text-slate-400">
                Varian: <strong>{selectedVariant === 'ALL' ? 'Semua Varian' : selectedVariant}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block mb-1">Total Estimasi</span>
                <span className="font-mono font-bold text-2xl text-slate-900 block">
                  {summaryTotals.totalUnits}
                </span>
                <span className="text-[10px] text-slate-400">porsi</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block mb-1">Rata-rata Mingguan</span>
                <span className="font-mono font-bold text-2xl text-slate-900 block">
                  {summaryTotals.avgPerWeek}
                </span>
                <span className="text-[10px] text-slate-400">porsi / minggu</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block mb-1">Rentang Toleransi (±MAE)</span>
                <span className="font-mono font-bold text-lg text-slate-800 block mt-1">
                  {summaryTotals.minTolTotal} – {summaryTotals.maxTolTotal}
                </span>
                <span className="text-[10px] text-slate-400">porsi batas estimasi</span>
              </div>
            </div>
          </div>

          {/* Variant Sales Contribution Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <PieChart className="w-3.5 h-3.5 text-slate-500" />
                <span>Distribusi Proyeksi 5 Varian Menu</span>
              </h4>
              <span className="text-[11px] text-slate-400">Akumulasi {horizonWeeks} Minggu</span>
            </div>

            <div className="space-y-3">
              {VARIANT_KEYS.map((vKey) => {
                const units = summaryTotals.variantBreakdown[vKey] || 0;
                const percentage = ((units / summaryTotals.allVariantsSum) * 100).toFixed(1);
                const isFocused = selectedVariant === 'ALL' || selectedVariant === vKey;

                return (
                  <div 
                    key={vKey} 
                    className={`p-2.5 rounded-xl border transition-all ${
                      isFocused ? 'bg-slate-50/80 border-slate-200' : 'opacity-40 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-slate-800 shrink-0">{vKey}</span>
                        <span className="text-[10px] text-slate-400 truncate">({VARIAN_DETAILS[vKey].name})</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono shrink-0">
                        <span className="font-bold text-slate-900">{units} porsi</span>
                        <span className="text-slate-500 text-[11px] w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-slate-800 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(units > 0 ? 2 : 0, parseFloat(percentage)))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Forecast Details Table per Week */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Rincian Proyeksi per Minggu (t = {startWeek} s.d {startWeek + horizonWeeks - 1})</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">{horizonWeeks} Minggu Simulasi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Minggu ke-</th>
                <th className="py-2.5 px-3.5">Rentang Tanggal</th>
                <th className="py-2.5 px-3 text-right font-mono">Nilai Hitung (OLS)</th>
                <th className="py-2.5 px-3.5 text-right font-bold text-slate-900 font-mono">Rekomendasi Porsi</th>
                <th className="py-2.5 px-3 text-right font-mono text-slate-500">Batas Bawah</th>
                <th className="py-2.5 px-3 text-right font-mono text-slate-500">Batas Atas</th>
                {selectedVariant === 'ALL' && (
                  <th className="py-2.5 px-3 text-center text-slate-500">Rincian Varian (Ori / Oreo / Icing / Red / Matcha)</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {projections.map((p) => (
                <tr key={p.t} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3.5 font-bold text-slate-900">Minggu {p.t}</td>
                  <td className="py-2.5 px-3.5 text-slate-600 font-sans text-xs">{p.dateRange}</td>
                  <td className="py-2.5 px-3 text-right text-slate-500">{p.raw.toFixed(2)}</td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-slate-900 text-sm">
                    {p.rounded} porsi
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{p.minTol}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{p.maxTol}</td>
                  {selectedVariant === 'ALL' && (
                    <td className="py-2.5 px-3 text-center text-[10px] text-slate-600 font-sans">
                      <span className="font-mono font-semibold text-slate-800">{p.breakdown.Ori?.rounded}</span> / {' '}
                      <span className="font-mono text-slate-700">{p.breakdown.Oreo?.rounded}</span> / {' '}
                      <span className="font-mono text-slate-700">{p.breakdown['Icing Sugar']?.rounded}</span> / {' '}
                      <span className="font-mono text-slate-700">{p.breakdown['Red Velvet']?.rounded}</span> / {' '}
                      <span className="font-mono text-slate-700">{p.breakdown['Matcha Caramel']?.rounded}</span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Projections Sheet Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-xl max-w-xl w-full flex flex-col overflow-hidden text-slate-900">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
              <span className="font-bold text-xs">Lembar Proyeksi Penjualan Mingguan</span>
              <button 
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs text-slate-800">
              
              <div className="border-b border-slate-300 pb-3">
                <h2 className="text-base font-bold">{APP_INFO.mitra.nama}</h2>
                <p className="text-slate-500 text-[11px]">{APP_INFO.mitra.alamat}</p>
                <p className="text-slate-400 text-[10px] mt-0.5">Dokumen Rencana Target Penjualan • Sistem Data Mining</p>
              </div>

              <div className="flex justify-between bg-slate-50 p-2.5 rounded border border-slate-200">
                <span>Periode: <strong>{horizonWeeks} Minggu (Mulai Minggu ke-{startWeek})</strong></span>
                <span>Total Estimasi: <strong>{summaryTotals.totalUnits} Porsi</strong></span>
              </div>

              <table className="w-full text-xs text-left border border-slate-200">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-1.5 px-2">Minggu</th>
                    <th className="py-1.5 px-2">Rentang Tanggal</th>
                    <th className="py-1.5 px-2 text-right">Target (Porsi)</th>
                    <th className="py-1.5 px-2 text-right">Batas Toleransi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projections.map((p) => (
                    <tr key={p.t}>
                      <td className="py-1.5 px-2 font-mono font-bold">Mg {p.t}</td>
                      <td className="py-1.5 px-2">{p.dateRange}</td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold">{p.rounded} porsi</td>
                      <td className="py-1.5 px-2 text-right font-mono text-slate-600">{p.minTol} – {p.maxTol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-4 border-t border-slate-200 flex justify-between text-center text-[11px]">
                <div>
                  <p className="mb-8 text-slate-400">Disiapkan Oleh:</p>
                  <p className="font-semibold border-t border-slate-300 pt-1">Petugas Pembukuan Outlet</p>
                </div>
                <div>
                  <p className="mb-8 text-slate-400">Disetujui Oleh:</p>
                  <p className="font-semibold border-t border-slate-300 pt-1">{APP_INFO.mitra.pemilik}</p>
                </div>
              </div>

            </div>

            {/* Modal Footer Buttons */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 no-print">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
              >
                Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
