import React, { useState, useMemo } from 'react';
import { VARIAN_DETAILS } from '../data/churrosDataset';
import { VARIANT_KEYS } from '../utils/dataProcessor';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceArea 
} from 'recharts';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  ArrowRight
} from 'lucide-react';

export default function ModelEvaluationModule({ 
  currentDataState,
  onProceedToPrediction 
}) {
  const [selectedVariant, setSelectedVariant] = useState('Ori');
  const [viewMode, setViewMode] = useState('single');
  const [openAccordions, setOpenAccordions] = useState({
    Ori: true,
    Oreo: false,
    'Icing Sugar': false,
    'Red Velvet': false,
    'Matcha Caramel': false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const weeklyList = currentDataState?.weeklyList || [];
  const models = currentDataState?.models || {};
  const evaluations = currentDataState?.evaluations || [];
  const isDefaultProposal = Boolean(currentDataState?.isDefaultProposal);

  const trainWeeks = useMemo(() => weeklyList.filter(w => w.fase === 'training' && !w.parsial), [weeklyList]);
  const testWeeks = useMemo(() => weeklyList.filter(w => w.fase === 'testing' && !w.parsial), [weeklyList]);
  const trainStartLabel = trainWeeks[0] ? `Mg ${trainWeeks[0].t}` : null;
  const trainEndLabel = trainWeeks[trainWeeks.length - 1] ? `Mg ${trainWeeks[trainWeeks.length - 1].t}` : null;
  const testStartLabel = testWeeks[0] ? `Mg ${testWeeks[0].t}` : null;
  const testEndLabel = testWeeks[testWeeks.length - 1] ? `Mg ${testWeeks[testWeeks.length - 1].t}` : null;
  const testPeriodStr = testWeeks.length > 0
    ? `${testWeeks[0].minggu_mulai} s.d ${testWeeks[testWeeks.length - 1].minggu_selesai}`
    : 'Periode Testing';

  // Compute dynamic sales share (%) for each variant from active weeklyList
  const dynamicShares = useMemo(() => {
    const sums = {};
    let grandTotal = 0;
    VARIANT_KEYS.forEach(k => { sums[k] = 0; });
    weeklyList.forEach(w => {
      VARIANT_KEYS.forEach(k => {
        const val = Number(w[k]) || 0;
        sums[k] += val;
        grandTotal += val;
      });
    });
    const shares = {};
    VARIANT_KEYS.forEach(k => {
      shares[k] = grandTotal > 0 ? Number(((sums[k] / grandTotal) * 100).toFixed(1)) : 0;
    });
    return shares;
  }, [weeklyList]);

  // Helper to evaluate model status dynamically vs baseline
  const getModelComparisonStatus = (evalRow) => {
    const mae = evalRow?.MAE;
    const baseMae = evalRow?.MAE_pembanding_rata2_training;
    if (mae === undefined || baseMae === undefined) return 'Model OLS Valid';
    if (mae < baseMae - 0.001) return 'Model Unggul';
    if (Math.abs(mae - baseMae) <= 0.001) return 'Seimbang';
    return 'Baseline Lebih Baik';
  };

  // Build dynamic diagnosis notes for every variant based on active dataset results
  const variantNotes = useMemo(() => {
    const proposalFieldDetails = {
      Ori: 'Pada September 2026 terjadi penurunan kunjungan fisik ke gerai di Jl. Hang Tuah (aktual 16–17 unit/minggu) yang belum terakomodasi garis linier sederhana.',
      Oreo: 'Penjualan riil meningkat tajam pada akhir pekan (weekend surge) dari konsumen remaja, sementara slope training bernilai negatif.',
      'Icing Sugar': 'Pada data training (Februari 2026) terjadi kekosongan pasokan gula halus salju selama 4 minggu (0 transaksi) yang menekan slope regresi, sementara di masa testing permintaan kembali normal.',
      'Red Velvet': 'Terdapat lonjakan musiman 7 unit pada pekan perayaan HUT RI 17 Agustus 2026 di Tanjungpinang di luar tren menurun linier.',
      'Matcha Caramel': 'Selama 8 minggu masa uji tidak ada transaksi Matcha Caramel (0 unit), sementara model memiliki slope positif kecil dari pesanan April–Mei 2026.'
    };

    const notes = {};
    const testCount = Math.max(1, testWeeks.length);

    VARIANT_KEYS.forEach(vKey => {
      const info = VARIAN_DETAILS[vKey];
      const m = models[vKey] || { b0: info.b0, b1: info.b1, r2: 0 };
      const ev = evaluations.find(e => e.Varian === vKey) || {};
      const act = ev['Total aktual testing'] ?? 0;
      const pred = Number(ev['Total prediksi testing'] ?? 0);
      const diff = pred - act;
      const mae = ev.MAE ?? 0;
      const baseMae = ev.MAE_pembanding_rata2_training;
      const statusLabel = getModelComparisonStatus(ev);

      const diffSign = diff > 0 ? '+' : '';
      const avgPredPerWeek = (pred / testCount).toFixed(1);
      const avgActPerWeek = (act / testCount).toFixed(1);
      const slopeDir = m.b1 > 0.0005 ? 'naik' : m.b1 < -0.0005 ? 'turun' : 'datar';

      let autoDetail = `Model OLS (${slopeDir}, b1 = ${m.b1 >= 0 ? '+' : ''}${Number(m.b1).toFixed(4)}, R² = ${Number(m.r2 || 0).toFixed(4)}) memproyeksikan rata-rata ${avgPredPerWeek} porsi/minggu vs realisasi aktual ${avgActPerWeek} porsi/minggu selama ${testWeeks.length} minggu uji. `;
      if (act === 0 && pred > 0) {
        autoDetail += 'Tidak tercatat transaksi aktual pada periode uji (zero sales), sehingga prediksi linier menghasilkan over-estimate. ';
      } else if (diff > 0.5) {
        autoDetail += `Terjadi over-estimate sebesar +${diff.toFixed(1)} porsi karena realisasi aktual berada di bawah proyeksi garis tren. `;
      } else if (diff < -0.5) {
        autoDetail += `Terjadi under-estimate sebesar ${diff.toFixed(1)} porsi karena lonjakan permintaan aktual melampaui garis tren linier. `;
      } else {
        autoDetail += 'Prediksi agregat sangat dekat dengan realisasi aktual di periode pengujian. ';
      }

      if (isDefaultProposal && proposalFieldDetails[vKey]) {
        autoDetail += proposalFieldDetails[vKey];
      }

      const maeText = baseMae !== undefined
        ? `MAE ${Number(mae).toFixed(2)} (${statusLabel} vs Baseline ${Number(baseMae).toFixed(2)})`
        : `MAE ${Number(mae).toFixed(2)} (${statusLabel})`;

      notes[vKey] = {
        title: `${info.name} (${vKey})`,
        summary: `Prediksi ${pred.toFixed(1)} unit vs Aktual ${act} unit (${diffSign}${diff.toFixed(1)} unit)`,
        detail: autoDetail.trim(),
        modelStatus: maeText
      };
    });

    return notes;
  }, [evaluations, models, testWeeks.length, isDefaultProposal]);

  // Single Variant Line Chart Data
  const singleChartData = useMemo(() => {
    const curModel = models[selectedVariant] || VARIAN_DETAILS[selectedVariant] || { b0: 0, b1: 0 };

    return weeklyList.map((item) => {
      const t = item.t;
      const actualVal = item[selectedVariant] || 0;
      const olsVal = Math.max(0, Number((curModel.b0 + curModel.b1 * t).toFixed(2)));

      let regresiTraining = null;
      let prediksiTesting = null;

      if (item.fase === 'training' && !item.parsial) {
        regresiTraining = olsVal;
      }
      if (item.fase === 'testing' && !item.parsial) {
        prediksiTesting = olsVal;
      }

      return {
        t,
        mingguLabel: `Mg ${t}`,
        tanggal: `${item.minggu_mulai} s.d ${item.minggu_selesai}`,
        fase: item.fase,
        aktual: actualVal,
        regresiTraining,
        prediksiTesting
      };
    });
  }, [weeklyList, models, selectedVariant]);

  // Multi Variant Comparison Chart Data
  const multiChartData = useMemo(() => {
    return weeklyList.map((item) => ({
      t: item.t,
      mingguLabel: `Mg ${item.t}`,
      tanggal: `${item.minggu_mulai} s.d ${item.minggu_selesai}`,
      fase: item.fase,
      Ori: item.Ori || 0,
      Oreo: item.Oreo || 0,
      'Icing Sugar': item['Icing Sugar'] || 0,
      'Red Velvet': item['Red Velvet'] || 0,
      'Matcha Caramel': item['Matcha Caramel'] || 0
    }));
  }, [weeklyList]);

  // Export Evaluation Metrics as CSV
  const exportMetricsCSV = () => {
    const headers = ['Varian', 'Total Aktual Testing', 'Total Prediksi Testing', 'Selisih', 'MAE Model', 'RMSE Model', 'MAE Baseline', 'RMSE Baseline', 'Status'];
    const rows = evaluations.map(r => [
      r.Varian,
      r['Total aktual testing'],
      r['Total prediksi testing'],
      (r['Total prediksi testing'] - r['Total aktual testing']).toFixed(1),
      (r.MAE ?? 0).toFixed(3),
      (r.RMSE ?? 0).toFixed(3),
      r.MAE_pembanding_rata2_training !== undefined ? r.MAE_pembanding_rata2_training.toFixed(3) : '-',
      r.RMSE_pembanding_rata2_training !== undefined ? r.RMSE_pembanding_rata2_training.toFixed(3) : '-',
      getModelComparisonStatus(r)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `evaluasi_model_regresi_churrostime.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const curVariantInfo = VARIAN_DETAILS[selectedVariant] || VARIAN_DETAILS['Ori'];
  const curModel = models[selectedVariant] || {
    b0: curVariantInfo.b0,
    b1: curVariantInfo.b1,
    r2: 0,
    formula: curVariantInfo.formula
  };

  const curEval = evaluations.find(e => e.Varian === selectedVariant) || {
    MAE: 0,
    RMSE: 0,
    MAE_pembanding_rata2_training: undefined,
    RMSE_pembanding_rata2_training: undefined
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Model Regresi Linier OLS & Evaluasi Akurasi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengukuran akurasi 5 model regresi linier per varian menu pada periode uji ({testPeriodStr}, {testWeeks.length} minggu).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportMetricsCSV}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onProceedToPrediction}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Kalkulator Prediksi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 Variant Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {VARIANT_KEYS.map((varKey) => {
          const v = VARIAN_DETAILS[varKey];
          const isSelected = selectedVariant === varKey;
          const vEval = evaluations.find(e => e.Varian === varKey);
          const maeVal = vEval?.MAE ?? 0;
          const shareVal = dynamicShares[varKey] ?? 0;

          return (
            <button
              key={varKey}
              onClick={() => setSelectedVariant(varKey)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs truncate">{v.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                  MAE: {Number(maeVal).toFixed(2)}
                </span>
                <span className={`font-mono font-semibold ${isSelected ? 'text-amber-400' : 'text-slate-800'}`}>
                  {shareVal}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Formula & Selected Variant Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Formula Box */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Persamaan Regresi OLS: {curVariantInfo.name}
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                t = minggu ({weeklyList[0]?.t !== undefined ? weeklyList[0].t : 1}..{weeklyList.slice(-1)[0]?.t !== undefined ? weeklyList.slice(-1)[0].t : 48})
              </span>
            </div>

            <div className="p-3.5 bg-slate-100 rounded-xl text-center my-2 font-mono">
              <span className="text-[11px] text-slate-500 block mb-0.5">Rumus Persamaan Regresi Linier</span>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                y = max(0, {Number(curModel.b0).toFixed(4)} {curModel.b1 >= 0 ? '+' : '-'} {Math.abs(Number(curModel.b1)).toFixed(4)} · t)
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-3 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Intercept (b0)</span>
                <span className="font-mono font-bold text-slate-900">{Number(curModel.b0).toFixed(3)}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Slope Waktu (b1)</span>
                <span className="font-mono font-bold text-slate-900">
                  {curModel.b1 >= 0 ? '+' : ''}{Number(curModel.b1).toFixed(4)}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Koefisien Det (R²)</span>
                <span className="font-mono font-bold text-slate-900">{Number(curModel.r2 ?? 0).toFixed(4)}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
            {curVariantInfo.description}
          </p>
        </div>

        {/* Right: Accuracy Metrics Box */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Hasil Uji Testing ({testWeeks.length} Minggu)
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{testWeeks.length} Minggu Uji</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">MAE Model OLS</span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                  {Number(curEval.MAE ?? 0).toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-500">porsi / minggu</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">MAE Baseline</span>
                <span className="text-xl font-bold font-mono text-slate-600 mt-1 block">
                  {curEval.MAE_pembanding_rata2_training !== undefined ? Number(curEval.MAE_pembanding_rata2_training).toFixed(3) : '–'}
                </span>
                <span className="text-[10px] text-slate-400">rata-rata training</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">RMSE Model OLS</span>
                <span className="text-base font-bold font-mono text-slate-900 mt-1 block">
                  {Number(curEval.RMSE ?? 0).toFixed(3)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">RMSE Baseline</span>
                <span className="text-base font-bold font-mono text-slate-600 mt-1 block">
                  {curEval.RMSE_pembanding_rata2_training !== undefined ? Number(curEval.RMSE_pembanding_rata2_training).toFixed(3) : '–'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
            <span className="text-slate-500 text-[11px] shrink-0">Status Evaluasi:</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] truncate">
              {variantNotes[selectedVariant]?.modelStatus || 'Model OLS Valid'}
            </span>
          </div>
        </div>

      </div>

      {/* Recharts Line Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        
        {/* Toggle Single vs Multi */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Kurva Penjualan & Garis Tren Regresi
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Aktual kasir historis, garis regresi pelatihan ({trainStartLabel || 'Mg awal'}..{trainEndLabel || 'Mg akhir'}), dan proyeksi pengujian ({testStartLabel || 'Mg awal'}..{testEndLabel || 'Mg akhir'})
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'single'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Varian Tunggal ({curVariantInfo.name})
            </button>

            <button
              onClick={() => setViewMode('multi')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'multi'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Komparasi 5 Varian
            </button>
          </div>
        </div>

        {/* Chart Legend */}
        {viewMode === 'single' && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <span>Aktual Kasir</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-blue-600 border-b border-dashed border-blue-600" />
              <span>Regresi Training ({trainStartLabel && trainEndLabel ? `${trainStartLabel}..${trainEndLabel}` : `${trainWeeks.length} Mg`})</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-amber-600" />
              <span>Proyeksi Testing ({testStartLabel && testEndLabel ? `${testStartLabel}..${testEndLabel}` : `${testWeeks.length} Mg`})</span>
            </div>
          </div>
        )}

        {/* Recharts Canvas */}
        <div className="h-80 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'single' ? (
              <LineChart data={singleChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                {trainStartLabel && trainEndLabel && (
                  <ReferenceArea x1={trainStartLabel} x2={trainEndLabel} fill="#3b82f6" fillOpacity={0.03} />
                )}
                {testStartLabel && testEndLabel && (
                  <ReferenceArea x1={testStartLabel} x2={testEndLabel} fill="#d97706" fillOpacity={0.06} />
                )}

                <XAxis dataKey="mingguLabel" tick={{ fontSize: 11, fill: '#64748b' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(val, name) => {
                    const labelMap = {
                      aktual: 'Aktual Terjual',
                      regresiTraining: 'Regresi Training',
                      prediksiTesting: 'Proyeksi Testing'
                    };
                    return [`${val} porsi`, labelMap[name] || name];
                  }}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '11px' }}
                />

                <Line 
                  type="monotone" 
                  dataKey="aktual" 
                  stroke="#1e293b" 
                  strokeWidth={2} 
                  dot={{ r: 2.5, fill: '#1e293b' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="regresiTraining" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="prediksiTesting" 
                  stroke="#d97706" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#d97706' }} 
                />
              </LineChart>
            ) : (
              <LineChart data={multiChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mingguLabel" tick={{ fontSize: 11, fill: '#64748b' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />

                <Line type="monotone" dataKey="Ori" name="Ori" stroke="#d97706" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Oreo" name="Oreo" stroke="#0f172a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Icing Sugar" name="Icing Sugar" stroke="#0284c7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Red Velvet" name="Red Velvet" stroke="#e11d48" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Matcha Caramel" name="Matcha" stroke="#059669" strokeWidth={2} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Tabel Rekapitulasi Metrik Evaluasi 5 Varian (Testing {testWeeks.length > 0 ? `${testWeeks.length} Minggu: ${testPeriodStr}` : ''})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Varian Menu</th>
                <th className="py-2.5 px-3 text-right font-mono">Aktual Testing</th>
                <th className="py-2.5 px-3 text-right font-mono">Prediksi Testing</th>
                <th className="py-2.5 px-3 text-right font-mono">Selisih</th>
                <th className="py-2.5 px-3 text-right font-mono">MAE Model</th>
                <th className="py-2.5 px-3 text-right font-mono">RMSE Model</th>
                <th className="py-2.5 px-3 text-right font-mono text-slate-500">MAE Baseline</th>
                <th className="py-2.5 px-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {evaluations.map((row) => {
                const selisih = (row['Total prediksi testing'] ?? 0) - (row['Total aktual testing'] ?? 0);
                const isSelected = selectedVariant === row.Varian;
                const statusLabel = getModelComparisonStatus(row);

                return (
                  <tr 
                    key={row.Varian} 
                    onClick={() => setSelectedVariant(row.Varian)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-50 font-semibold' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-2 px-3.5 font-sans font-semibold text-slate-900">{row.Varian}</td>
                    <td className="py-2 px-3 text-right text-slate-800">{row['Total aktual testing']} unit</td>
                    <td className="py-2 px-3 text-right text-slate-800">{Number(row['Total prediksi testing']).toFixed(1)} unit</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-700">
                      {selisih > 0 ? '+' : ''}{selisih.toFixed(1)} unit
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {Number(row.MAE ?? 0).toFixed(3)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600">
                      {Number(row.RMSE ?? 0).toFixed(3)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">
                      {row.MAE_pembanding_rata2_training !== undefined ? Number(row.MAE_pembanding_rata2_training).toFixed(3) : '–'}
                    </td>
                    <td className="py-2 px-3.5 text-center font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        statusLabel === 'Model Unggul'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : statusLabel === 'Seimbang'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accordion Diagnosis & Solusi Lapangan */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
          Diagnosis Selisih Prediksi vs Realisasi Aktual ({testPeriodStr})
        </h3>

        <div className="space-y-2 pt-1">
          {VARIANT_KEYS.map((vKey) => {
            const note = variantNotes[vKey];
            const isOpen = openAccordions[vKey];

            return (
              <div key={vKey} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/60">
                <button
                  onClick={() => toggleAccordion(vKey)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block">{note.title}</span>
                    <span className="text-[11px] text-slate-500 font-normal">{note.summary}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">{note.modelStatus}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 bg-white border-t border-slate-100 space-y-1.5">
                    <p className="leading-relaxed">{note.detail}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
