import React, { useMemo } from 'react';
import { 
  VARIAN_DETAILS, 
  EVALUATION_SUMMARY 
} from '../data/churrosDataset';
import { VARIANT_KEYS } from '../utils/dataProcessor';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function BusinessInsights({ currentDataState }) {
  const weeklyList = currentDataState?.weeklyList || [];
  const models = currentDataState?.models || {};
  const evals = currentDataState?.evaluations?.length > 0 ? currentDataState.evaluations : EVALUATION_SUMMARY;
  const isDefaultProposal = Boolean(currentDataState?.isDefaultProposal);

  const testWeeks = useMemo(
    () => weeklyList.filter(w => w.fase === 'testing' && !w.parsial),
    [weeklyList]
  );
  const testWeeksCount = testWeeks.length || currentDataState?.testWeeksCount || 8;
  const testPeriodStr = testWeeks.length > 0
    ? `${testWeeks[0].minggu_mulai} s.d ${testWeeks[testWeeks.length - 1].minggu_selesai}`
    : 'Periode Testing';

  const barComparisonData = evals.map(item => ({
    name: item.Varian,
    aktual: item['Total aktual testing'],
    prediksi: Number(item['Total prediksi testing']),
    selisih: Number((item['Total prediksi testing'] - item['Total aktual testing']).toFixed(1))
  }));

  // Compute dynamic total volume share per variant from active dataset
  const variantTotals = useMemo(() => {
    const totals = {};
    let grand = 0;
    VARIANT_KEYS.forEach(k => { totals[k] = 0; });
    weeklyList.forEach(w => {
      VARIANT_KEYS.forEach(k => {
        const v = Number(w[k]) || 0;
        totals[k] += v;
        grand += v;
      });
    });
    const ranked = VARIANT_KEYS.map(k => ({
      key: k,
      name: VARIAN_DETAILS[k]?.name || k,
      total: totals[k],
      share: grand > 0 ? Number(((totals[k] / grand) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.total - a.total);
    return { totals, grand, ranked };
  }, [weeklyList]);

  // Dynamic phenomena cards based on active evaluations & models
  const phenomena = useMemo(() => {
    const proposalFieldNotes = {
      Ori: {
        phenomenon: 'Model memproyeksikan rata-rata ±28.5 unit/minggu secara stabil. Pada September 2026 terjadi penurunan kunjungan fisik ke gerai di Jl. Hang Tuah (aktual 16–17 unit/minggu) yang belum terakomodasi garis linier sederhana.',
        solution: 'Terapkan penyiapan adonan bertahap (batching) harian agar tidak ada sisa adonan basah yang terbuang.'
      },
      Oreo: {
        phenomenon: 'Slope data training bernilai negatif (−0.109). Pada masa testing terjadi lonjakan pesanan akhir pekan (weekend surge) dari konsumen usia muda sehingga realisasi melebihi estimasi garis tren.',
        solution: 'Sediakan stok cadangan bubuk taburan biskuit Oreo ekstra 30% khusus untuk akhir pekan (Jumat–Minggu).'
      },
      'Icing Sugar': {
        phenomenon: 'Pada data training (Februari 2026) terjadi kekosongan pasokan gula halus selama 4 minggu (0 transaksi). Hal ini menekan slope regresi, sementara di masa testing permintaan kembali normal.',
        solution: 'Terapkan kebijakan persediaan pengaman (safety stock) minimal 2 karung gula halus di gudang outlet.'
      },
      'Red Velvet': {
        phenomenon: 'Tren training menurun linier konsisten (R² = 0.40). Namun terdapat lonjakan musiman 7 unit pada pekan perayaan HUT RI 17 Agustus 2026 di Tanjungpinang.',
        solution: 'Jadikan varian Red Velvet sebagai produk promosi tematik saat hari besar nasional.'
      },
      'Matcha Caramel': {
        phenomenon: 'Sepanjang 8 minggu masa uji coba testing tidak tercatat transaksi penjualan (0 unit), sementara model regresi memproyeksikan 20.2 unit karena slope positif kecil di masa training.',
        solution: 'Terapkan sistem saus Made-to-Order (masak saat ada pesanan) atau paket bundling hemat dengan varian Original.'
      }
    };

    return evals.map(item => {
      const vKey = item.Varian;
      const info = VARIAN_DETAILS[vKey] || { name: vKey };
      const m = models[vKey] || { b0: 0, b1: 0, r2: 0 };
      const act = item['Total aktual testing'] ?? 0;
      const pred = Number(item['Total prediksi testing'] ?? 0);
      const diff = pred - act;
      const diffSign = diff > 0 ? '+' : '';
      const mae = Number(item.MAE ?? 0);
      const baseMae = item.MAE_pembanding_rata2_training;

      let tag = `Akurat (${diffSign}${diff.toFixed(1)} unit)`;
      if (act === 0 && pred > 0) {
        tag = `Zero Sales (+${pred.toFixed(1)} unit)`;
      } else if (diff > 0.5) {
        tag = `Over-Estimate (+${diff.toFixed(1)} unit)`;
      } else if (diff < -0.5) {
        tag = `Under-Estimate (${diff.toFixed(1)} unit)`;
      }

      if (isDefaultProposal && proposalFieldNotes[vKey]) {
        return {
          variant: `${info.name} (${vKey})`,
          tag,
          actualVsPred: `Aktual: ${act} unit | Prediksi: ${pred.toFixed(1)} unit`,
          phenomenon: proposalFieldNotes[vKey].phenomenon,
          solution: proposalFieldNotes[vKey].solution
        };
      }

      const avgAct = (act / Math.max(1, testWeeksCount)).toFixed(1);
      const avgPred = (pred / Math.max(1, testWeeksCount)).toFixed(1);
      const slopeLabel = m.b1 > 0.0005 ? 'positif (naik)' : m.b1 < -0.0005 ? 'negatif (turun)' : 'datar';
      const maeCompare = baseMae !== undefined
        ? (mae < baseMae ? `MAE OLS (${mae.toFixed(2)}) lebih unggul dari baseline (${Number(baseMae).toFixed(2)}).` : `MAE OLS (${mae.toFixed(2)}) berada di atas baseline rata-rata (${Number(baseMae).toFixed(2)}).`)
        : `MAE OLS tercatat ${mae.toFixed(2)} porsi/minggu.`;

      let phenomenonText = `Model memiliki slope ${slopeLabel} (b1 = ${m.b1 >= 0 ? '+' : ''}${Number(m.b1).toFixed(4)}, R² = ${Number(m.r2 || 0).toFixed(4)}) dengan estimasi rata-rata ${avgPred} unit/minggu dibanding aktual ${avgAct} unit/minggu selama ${testWeeksCount} minggu uji. ${maeCompare}`;
      let solutionText = 'Pertahankan ritme produksi sesuai rata-rata proyeksi mingguan dan evaluasi stok secara berkala.';

      if (act === 0 && pred > 0) {
        solutionText = 'Terapkan sistem Made-to-Order (produksi saat ada pesanan) agar bahan topping dan saus tidak terbuang selama permintaan nol.';
      } else if (diff > 0.5) {
        solutionText = 'Terapkan penyiapan adonan dan topping bertahap (batching) harian agar tidak terjadi kelebihan stok di akhir operasional.';
      } else if (diff < -0.5) {
        solutionText = 'Siapkan stok cadangan (safety stock) ekstra terutama menjelang akhir pekan atau periode ramai agar tidak kehabisan bahan.';
      }

      return {
        variant: `${info.name} (${vKey})`,
        tag,
        actualVsPred: `Aktual: ${act} unit | Prediksi: ${pred.toFixed(1)} unit`,
        phenomenon: phenomenonText,
        solution: solutionText
      };
    });
  }, [evals, models, testWeeksCount, isDefaultProposal]);

  // Dynamic recommendations derived from active dataset
  const recommendations = useMemo(() => {
    const topVariant = variantTotals.ranked[0] || { key: 'Ori', name: 'Churros Original', share: 0 };
    const lowVariant = variantTotals.ranked[variantTotals.ranked.length - 1] || { key: 'Matcha Caramel', name: 'Churros Matcha Caramel', share: 0 };
    const underEstimated = evals
      .filter(e => (Number(e['Total prediksi testing']) - (e['Total aktual testing'] ?? 0)) < -0.5)
      .map(e => e.Varian);

    return [
      {
        title: `1. Prioritas Produksi Varian ${topVariant.key}`,
        desc: `Varian ${topVariant.name} mendominasi ${topVariant.share}% total volume penjualan pada dataset aktif (${topVariant.total.toLocaleString('id-ID')} porsi). Prioritaskan kesiapan adonan utama menjelang jam sibuk gerai.`
      },
      {
        title: `2. Efisiensi Varian Volume Rendah (${lowVariant.key})`,
        desc: `Varian ${lowVariant.name} memiliki porsi kontribusi terkecil (${lowVariant.share}%). Terapkan sistem Made-to-Order atau paket bundling agar kesegaran topping/saus terjaga dan mengurangi limbah.`
      },
      {
        title: '3. Pengendalian Safety Stock & Evaluasi Berkala',
        desc: underEstimated.length > 0
          ? `Varian ${underEstimated.join(', ')} mencatat permintaan aktual lebih tinggi dari proyeksi tren. Sediakan stok pengaman tambahan dan latih ulang model secara periodik dengan data kasir terbaru.`
          : 'Proyeksi tren cenderung berada di atas atau seimbang dengan realisasi aktual. Gunakan penyiapan adonan bertahap dan perbarui model setiap beberapa minggu.'
      }
    ];
  }, [variantTotals, evals]);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">
          Evaluasi Temuan Kasus & Rekomendasi Manajerial
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Analisis faktor penyebab perbedaan antara nilai prediksi model OLS dan realisasi transaksi aktual pada periode uji ({testPeriodStr}, {testWeeksCount} minggu).
        </p>
      </div>

      {/* Bar Chart Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Perbandingan Aktual Kasir vs Prediksi Model OLS ({testWeeksCount} Minggu Testing)
          </h3>
          <span className="text-[11px] text-slate-400">Total Porsi</span>
        </div>

        <div className="h-64 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                formatter={(val, name) => [`${val} unit`, name === 'aktual' ? 'Aktual Kasir' : 'Prediksi OLS']}
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
              <Bar dataKey="aktual" name="Aktual Kasir" fill="#1e293b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prediksi" name="Prediksi OLS" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5 Phenomenon Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Faktor Penyebab Dinamika Penjualan Antarvarian
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {phenomena.map((p, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{p.variant}</span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {p.tag}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{p.actualVsPred}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-7">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">Penjelasan & Analisis:</span>
                  <p className="text-slate-600 leading-relaxed">{p.phenomenon}</p>
                </div>
                <div className="md:col-span-5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block mb-0.5">Solusi Operasional:</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{p.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
          Rekomendasi Operasional Gerai UMKM Churrostime
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
          {recommendations.map((r, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">{r.title}</strong>
              <p className="text-slate-600 text-[11px]">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
