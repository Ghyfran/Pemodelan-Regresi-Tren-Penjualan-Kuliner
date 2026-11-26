import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DataInputModule from './components/DataInputModule';
import ModelEvaluationModule from './components/ModelEvaluationModule';
import PredictionCalculatorModule from './components/PredictionCalculatorModule';
import BusinessInsights from './components/BusinessInsights';

import { 
  WEEKLY_DATA_REVISI, 
  EVALUATION_DETAILED, 
  MODEL_PARAMETERS
} from './data/churrosDataset';
import rawSampleTransactions from './data/rawSampleTransactions.json';
import { Menu, X } from 'lucide-react';

const getInitialChurrosState = () => {
  const models = {};
  MODEL_PARAMETERS.forEach(p => {
    models[p.Varian] = {
      b0: p.Intercept_b0,
      b1: p.Slope_b1_per_minggu,
      r2: p.R2_training,
      yMean: p.Rata2_training,
      formula: `y = max(0, ${p.Intercept_b0.toFixed(4)} ${p.Slope_b1_per_minggu >= 0 ? '+' : '-'} ${Math.abs(p.Slope_b1_per_minggu).toFixed(4)} * t)`
    };
  });

  // Enrich rawSampleTransactions with weekT so column "Minggu (t)" displays accurately on initial load
  const enrichedRaw = rawSampleTransactions.map(trx => {
    const wk = WEEKLY_DATA_REVISI.find(
      w => trx.Tanggal >= w.minggu_mulai && trx.Tanggal <= w.minggu_selesai
    );
    return {
      ...trx,
      weekT: wk ? wk.t : (trx.weekT ?? 0),
      fase: wk ? wk.fase : (trx.fase || 'training')
    };
  });

  return {
    sourceName: 'DATA CHURROSTIME.xlsx',
    rawCount: 2209,
    trainWeeksCount: 40,
    testWeeksCount: 8,
    trainTrxCount: 1884,
    testTrxCount: 325,
    minDateStr: '2025-10-23',
    maxDateStr: '2026-09-30',
    effectiveCutOffDate: '2026-08-01',
    splitMode: 'ratio',
    splitRatio: 80,
    isDefaultProposal: true,
    isWeeklySource: false,
    unmatchedCount: 0,
    unmatchedSamples: [],
    weeklyList: WEEKLY_DATA_REVISI,
    rawTransactions: enrichedRaw,
    models,
    evaluations: EVALUATION_DETAILED
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('input'); // 'input', 'evaluation', 'prediction', 'insights'
  const [dataState, setDataState] = useState(getInitialChurrosState);
  const [resetNotification, setResetNotification] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleResetData = () => {
    setDataState(getInitialChurrosState());
    setResetNotification(true);
    setTimeout(() => setResetNotification(false), 2500);
  };

  const tabTitles = {
    input: '1. Data Transaksi & Partisi Waktu',
    evaluation: '2. Pemodelan Regresi Linier OLS',
    prediction: '3. Kalkulator Simulasi Prediksi Penjualan',
    insights: '4. Evaluasi Kasus'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      
      {/* 1. Left Sidebar Navigation (Desktop) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onResetData={handleResetData}
          currentDataState={dataState}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="relative z-10 w-64 bg-white h-full shadow-2xl">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              onResetData={handleResetData}
              currentDataState={dataState}
            />
          </div>
        </div>
      )}

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Minimal Clean Top Bar */}
        <header className="bg-white border-b border-slate-200 px-5 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div>
              <h2 className="text-xs font-bold text-slate-900 leading-none">
                {tabTitles[activeTab]}
              </h2>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Studi Kasus UMKM Churrostime Tanjungpinang
              </span>
            </div>
          </div>
        </header>

        {/* Reset Notification Toast */}
        {resetNotification && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs animate-in fade-in duration-150">
            Dataset telah dikembalikan ke data standar proposal.
          </div>
        )}

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'input' && (
            <DataInputModule 
              currentDataState={dataState}
              onDataProcessed={(newState) => setDataState(newState)}
              onLoadSampleData={handleResetData}
              onProceedToEvaluation={() => setActiveTab('evaluation')}
            />
          )}

          {activeTab === 'evaluation' && (
            <ModelEvaluationModule 
              currentDataState={dataState}
              onProceedToPrediction={() => setActiveTab('prediction')}
            />
          )}

          {activeTab === 'prediction' && (
            <PredictionCalculatorModule 
              currentDataState={dataState}
            />
          )}

          {activeTab === 'insights' && (
            <BusinessInsights currentDataState={dataState} />
          )}
        </main>

        {/* Clean, Simple 1-Line Footer */}
        <footer className="py-5 text-center text-[11px] text-slate-400 border-t border-slate-200/80 bg-white">
          © 2026–2027 Tim Peneliti Penambangan Data • UMKM Churrostime Tanjungpinang
        </footer>

      </div>

    </div>
  );
}
