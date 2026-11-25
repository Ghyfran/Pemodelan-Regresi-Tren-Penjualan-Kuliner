import React, { useState, useMemo } from 'react';
import { 
  VARIAN_DETAILS, 
  WEEKLY_DATA_REVISI, 
  EVALUATION_SUMMARY,
  EVALUATION_DETAILED,
  MODEL_PARAMETERS 
} from '../data/churrosDataset';
import { 
  LineChart as LineChartIcon, 
  BarChart3, 
  Filter, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Percent,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceArea, 
  ReferenceLine 
} from 'recharts';

export default function ModelEvaluation() {
  const [selectedVariant, setSelectedVariant] = useState('Ori');
  const [showAllVariants, setShowAllVariants] = useState(false);

  // Prepare time series chart data
  const chartData = useMemo(() => {
    return WEEKLY_DATA_REVISI.map((item) => {
      const t = item.t;
      const isTraining = item.fase === 'training';
      const isTesting = item.fase === 'testing';
      const isPartial = item.parsial;
      const hasSynthetic = item.baris_non_asli > 0;

      // Current variant calculation
      const v = VARIAN_DETAILS[selectedVariant];
      const actualVal = item[selectedVariant];
      const olsRegressionVal = Number((v.b0 + v.b1 * t).toFixed(2));

      // Separate lines according to requirements:
      // 1. Aktual Historis (titik bulat biru)
      // 2. Garis Regresi Training (garis putus-putus abu/biru muda di fase training)
      // 3. Garis Prediksi Testing (garis merah/oranye tebal dengan titik kotak di fase testing)
      let regresiTraining = null;
      let prediksiTesting = null;

      if (t >= 1 && t <= 40) {
        regresiTraining = olsRegressionVal;
      }
      if (t >= 41 && t <= 48) {
        prediksiTesting = olsRegressionVal;
      }

      return {
        t,
        mingguLabel: `Mg ${t}`,
        tanggal: `${item.minggu_mulai} s.d ${item.minggu_selesai}`,
        fase: item.fase,
        isTraining,
        isTesting,
        isPartial,
        hasSynthetic,
        syntheticCount: item.baris_non_asli,
        aktual: actualVal,
        regresiTraining,
        prediksiTesting,
        olsFull: olsRegressionVal
      };
    });
  }, [selectedVariant]);

  // Bar chart metric data (MAE & RMSE across all 5 variants)
  const metricBarData = useMemo(() => {
    return EVALUATION_DETAILED.map((item) => {
      const v = VARIAN_DETAILS[item.Varian];
      return {
        varian: item.Varian,
        fullName: v?.name || item.Varian,
        mae: item.MAE,
        rmse: item.RMSE,
        maeBaseline: item.MAE_pembanding_rata2_training,
        rmseBaseline: item.RMSE_pembanding_rata2_training,
        isOri: item.Varian === 'Ori'
      };
    });
  }, []);

  const currentVariantInfo = VARIAN_DETAILS[selectedVariant];
  const currentEvalDetailed = EVALUATION_DETAILED.find(e => e.Varian === selectedVariant);

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Introduction Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm border border-caramel-300/80 bg-gradient-to-br from-cream-100/90 via-white to-blue-50/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold">
              <LineChartIcon className="w-3.5 h-3.5 text-blue-700" />
              <span>Modul 3: Evaluasi & Visualisasi Model (Agustus – September 2026)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-darkslate-900">
              Pengujian Out-of-Sample 8 Minggu Periode Testing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Model OLS yang dilatih pada 40 minggu pertama (t=1..40) diuji secara objektif pada 8 minggu independen (t=41..48, 1 Agustus – 25 September 2026). Bandingkan akurasi model terhadap realitas aktual kasir.
            </p>
          </div>

          {/* Variant Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-caramel-300 shadow-sm">
            {Object.keys(VARIAN_DETAILS).map((varKey) => {
              const isSelected = selectedVariant === varKey;
              return (
                <button
                  key={varKey}
                  onClick={() => setSelectedVariant(varKey)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected 
                      ? 'bg-caramel-600 text-white shadow-sm shadow-caramel-600/30' 
                      : 'text-slate-600 hover:text-caramel-700 hover:bg-caramel-50'
                  }`}
                >
                  {varKey}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Line Chart */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-caramel-200/90 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-darkslate-900 font-serif flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: currentVariantInfo.color }} />
              <span>Dinamika Penjualan: {currentVariantInfo.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan 3 garis visual: Aktual Historis (Biru), Regresi Training (Garis Putus-Putus Abu), dan Prediksi Testing (Merah Tebal)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Fase Training: Okt 2025 – Jul 2026 (40 Mg)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" />
              Fase Testing: Agu – Sep 2026 (8 Mg)
            </span>
          </div>
        </div>

        {/* The Chart */}
        <div className="h-80 sm:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 25, bottom: 25, left: 0 }}>
              <defs>
                <linearGradient id="trainingBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.06}/>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="testingBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.12}/>
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0.02}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="mingguLabel" 
                tick={{ fontSize: 10, fill: '#64748B' }}
                interval={3}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748B' }} 
                label={{ value: 'Unit Terjual / Minggu', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94A3B8' }}
              />

              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-darkslate-950 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 text-xs space-y-1.5 min-w-[220px]">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                          <span className="font-bold text-caramel-400 font-mono">{label}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            data.isTesting ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
                          }`}>
                            Fase {data.fase}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{data.tanggal}</p>
                        
                        <div className="pt-1 space-y-1 font-mono">
                          <div className="flex justify-between items-center text-blue-300">
                            <span>Aktual Riil:</span>
                            <span className="font-bold text-sm">{data.aktual} unit</span>
                          </div>
                          {data.regresiTraining !== null && (
                            <div className="flex justify-between items-center text-slate-400">
                              <span>Regresi Training:</span>
                              <span className="font-bold">{data.regresiTraining} unit</span>
                            </div>
                          )}
                          {data.prediksiTesting !== null && (
                            <div className="flex justify-between items-center text-rose-400">
                              <span>Prediksi Testing:</span>
                              <span className="font-bold text-sm">{data.prediksiTesting} unit</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }}
                verticalAlign="bottom"
              />

              {/* Shaded vertical areas for training vs testing */}
              <ReferenceArea 
                x1="Mg 1" 
                x2="Mg 40" 
                fill="url(#trainingBg)" 
                stroke="#3B82F6" 
                strokeDasharray="2 2"
                strokeOpacity={0.3}
              />
              <ReferenceArea 
                x1="Mg 41" 
                x2="Mg 48" 
                fill="url(#testingBg)" 
                stroke="#EF4444" 
                strokeDasharray="2 2"
                strokeOpacity={0.4}
              />

              {/* 1. Garis Aktual Historis (titik bulat biru) */}
              <Line 
                type="monotone" 
                dataKey="aktual" 
                name="1. Garis Aktual Historis" 
                stroke="#2563EB" 
                strokeWidth={2.5} 
                dot={{ r: 3.5, fill: '#2563EB', strokeWidth: 1.5, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#1D4ED8' }}
              />

              {/* 2. Garis Regresi Training (garis putus-putus abu/biru muda di t=1..40) */}
              <Line 
                type="monotone" 
                dataKey="regresiTraining" 
                name="2. Garis Regresi Training (t=1..40)" 
                stroke="#94A3B8" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
              />

              {/* 3. Garis Prediksi Testing (garis merah/oranye tebal dengan titik kotak di t=41..48) */}
              <Line 
                type="monotone" 
                dataKey="prediksiTesting" 
                name="3. Garis Prediksi Testing (t=41..48)" 
                stroke="#DC2626" 
                strokeWidth={3.5} 
                dot={{ r: 4.5, fill: '#DC2626', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#B91C1C' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Chart Legend Callout */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Formula Terlatih: <code className="font-mono font-bold text-darkslate-900">{currentVariantInfo.formula}</code></span>
          </div>
          <div className="flex items-center gap-4">
            <span>R² Training: <strong className="font-mono text-darkslate-900">{MODEL_PARAMETERS.find(p => p.Varian === selectedVariant)?.R2_training}</strong></span>
            <span>Rata-Rata Training: <strong className="font-mono text-darkslate-900">{MODEL_PARAMETERS.find(p => p.Varian === selectedVariant)?.Rata2_training} unit/mg</strong></span>
          </div>
        </div>
      </div>

      {/* Bar Chart Metrics: MAE & RMSE Comparison Across 5 Variants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 border border-caramel-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-darkslate-900 font-serif flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-caramel-600" />
                <span>Perbandingan Metrik Evaluasi: MAE vs RMSE</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nilai kesalahan pada 8 minggu periode testing (1 Agu – 25 Sep 2026)
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-caramel-800 bg-caramel-100 px-2.5 py-1 rounded-full">
              Satuan: Produk / Minggu
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricBarData} margin={{ top: 15, right: 15, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="varian" tick={{ fontSize: 11, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val, name) => [`${val} produk/minggu`, name]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="mae" name="MAE (Mean Absolute Error)" fill="#D97706" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rmse" name="RMSE (Root Mean Square Error)" fill="#0F172A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>*Ori memiliki error nominal tertinggi karena skala volume penjualannya 5–10x lipat varian lain.</span>
            <span className="font-medium text-darkslate-900">Rata-rata MAE Toko: 3,25</span>
          </div>
        </div>

        {/* Metric Insights Spotlight */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-7 border border-caramel-300 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-caramel-700 mb-3">
              <Award className="w-5 h-5 text-caramel-600" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Temuan Utama Evaluasi Model</h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kemenangan Model Regresi pada Varian Ori</span>
                </span>
                <p className="leading-relaxed">
                  Pada varian utama <strong>Ori</strong>, regresi linear parsial mencatatkan <strong>MAE 5.61</strong>, jauh lebih akurat dibanding model acuan rata-rata historis (<strong>MAE 7.78</strong>). Ini membuktikan model regresi memberi nilai prediksi signifikan bagi 65% perputaran omzet toko.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <span className="font-bold flex items-center gap-1.5 text-amber-800 mb-1">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Karakteristik Varian Minor (Red Velvet & Matcha)</span>
                </span>
                <p className="leading-relaxed">
                  <strong>Red Velvet</strong> mencatat MAE terkecil (<strong>2.23</strong>) semata-mata karena skala unitnya kecil. Sementara <strong>Matcha Caramel</strong> memiliki MAE ≈ RMSE (<strong>2.53</strong>) karena kesalahan model yang seragam (memprediksi ~2.5 unit/mg, namun realisasi testing 0 unit).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-500">
            <span className="font-medium text-darkslate-800">Prinsip Akademik:</span> Seluruh evaluasi 8 minggu bersifat <em>out-of-sample</em> murni tanpa ada data testing yang dibocorkan ke proses kalkulasi parameter regresi.
          </div>
        </div>
      </div>

      {/* Comprehensive Evaluation Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-caramel-200/90 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-darkslate-900 font-serif">
              Tabel Komparasi Evaluasi Lengkap (8 Minggu Testing, Agu – Sep 2026)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Komparasi metrik model OLS terhadap baseline rata-rata training untuk membuktikan efektivitas pemodelan
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-darkslate-900 text-white uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3.5 rounded-l-xl">Varian Menu</th>
                <th className="py-3 px-3 text-right">Total Aktual (8 mg)</th>
                <th className="py-3 px-3 text-right">Total Prediksi</th>
                <th className="py-3 px-3 text-right">Selisih (Error)</th>
                <th className="py-3 px-3 text-right font-bold text-caramel-400">MAE Model</th>
                <th className="py-3 px-3 text-right font-bold text-caramel-400">RMSE Model</th>
                <th className="py-3 px-3 text-right text-slate-300">MAE Rata2 Baseline</th>
                <th className="py-3 px-3 text-right text-slate-300">RMSE Rata2 Baseline</th>
                <th className="py-3 px-3.5 text-center rounded-r-xl">Status Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EVALUATION_DETAILED.map((row) => {
                const diff = (row['Total prediksi testing'] - row['Total aktual testing']).toFixed(1);
                const isModelBetter = row.MAE < row.MAE_pembanding_rata2_training;
                const v = VARIAN_DETAILS[row.Varian];

                return (
                  <tr key={row.Varian} className="hover:bg-amber-50/60 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-darkslate-900 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: v?.color }} />
                      <span>{v?.name || row.Varian}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-darkslate-800">
                      {row['Total aktual testing']} unit
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-caramel-800">
                      {row['Total prediksi testing']} unit
                    </td>
                    <td className={`py-3 px-3 text-right font-mono font-bold ${
                      Number(diff) > 0 ? 'text-rose-600' : 'text-blue-600'
                    }`}>
                      {Number(diff) > 0 ? `+${diff}` : diff}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-caramel-900 bg-amber-50/50">
                      {row.MAE.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-darkslate-900 bg-amber-50/50">
                      {row.RMSE.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      {row.MAE_pembanding_rata2_training.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      {row.RMSE_pembanding_rata2_training.toFixed(3)}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      {isModelBetter ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Regresi Unggul (+28%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                          Baseline Seimbang
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

