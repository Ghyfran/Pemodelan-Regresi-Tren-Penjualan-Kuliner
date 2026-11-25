import React, { useState, useRef, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Sliders, 
  Calendar, 
  RefreshCw, 
  Database,
  ArrowRight,
  Search,
  AlertCircle,
  FileCheck,
  Download,
  Table,
  Receipt
} from 'lucide-react';
import { 
  smartParseWorkbook, 
  processRawTransactions, 
  processWeeklyDataset, 
  applyPartitioningToWeeklyList,
  trainModelsFromWeekly 
} from '../utils/dataProcessor';
import rawSampleTransactions from '../data/rawSampleTransactions.json';

export default function DataInputModule({ 
  currentDataState, 
  onDataProcessed, 
  onLoadSampleData,
  onProceedToEvaluation
}) {
  const [fileLoading, setFileLoading] = useState(false);
  const [fileName, setFileName] = useState(currentDataState?.sourceName || 'SiapMining_2401020053.xlsx');
  const [splitMode, setSplitMode] = useState(currentDataState?.splitMode || 'ratio');
  const [cutOffDate, setCutOffDate] = useState(currentDataState?.effectiveCutOffDate || '2026-08-01');
  const [splitRatio, setSplitRatio] = useState(currentDataState?.splitRatio ?? 80);
  const [activeTableView, setActiveTableView] = useState('weekly'); // 'weekly' or 'raw'
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [rawPhaseFilter, setRawPhaseFilter] = useState('ALL');
  const [rawVariantFilter, setRawVariantFilter] = useState('ALL');
  const [rawPage, setRawPage] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Sync local controls whenever currentDataState is reset from Sidebar or updated externally
  useEffect(() => {
    if (currentDataState?.sourceName) {
      setFileName(currentDataState.sourceName);
    }
    if (currentDataState?.effectiveCutOffDate) {
      setCutOffDate(currentDataState.effectiveCutOffDate);
    }
    if (currentDataState?.splitMode) {
      setSplitMode(currentDataState.splitMode);
    }
    if (currentDataState?.splitRatio !== undefined) {
      setSplitRatio(currentDataState.splitRatio);
    }
  }, [
    currentDataState?.sourceName,
    currentDataState?.effectiveCutOffDate,
    currentDataState?.splitMode,
    currentDataState?.splitRatio
  ]);

  // Parse raw file buffer
  const parseFileBuffer = (buffer, name) => {
    try {
      const data = new Uint8Array(buffer);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });

      const parsedWb = smartParseWorkbook(workbook);
      if (!parsedWb) {
        setFeedback({
          type: 'error',
          message: 'Format tidak dikenali. Pastikan file memuat kolom Tanggal & Nama Produk, atau lembar Data Mingguan.'
        });
        setFileLoading(false);
        return;
      }

      let processed = null;
      if (parsedWb.type === 'weekly') {
        processed = processWeeklyDataset(parsedWb.rows, { splitMode, splitRatio, cutOffDate });
      } else {
        processed = processRawTransactions(parsedWb.rows, { splitMode, splitRatio, cutOffDate });
      }

      if (processed && processed.weeklyList.length > 0) {
        if (processed.effectiveCutOffDate) {
          setCutOffDate(processed.effectiveCutOffDate);
        }

        const { models, evaluations } = trainModelsFromWeekly(processed.weeklyList);

        onDataProcessed({
          sourceName: name,
          rawCount: processed.rawCount,
          trainWeeksCount: processed.trainWeeksCount,
          testWeeksCount: processed.testWeeksCount,
          trainTrxCount: processed.trainTrxCount,
          testTrxCount: processed.testTrxCount,
          minDateStr: processed.minDateStr,
          maxDateStr: processed.maxDateStr,
          effectiveCutOffDate: processed.effectiveCutOffDate,
          splitMode,
          splitRatio,
          isDefaultProposal: processed.isDefaultProposal,
          isWeeklySource: processed.isWeeklySource,
          unmatchedCount: processed.unmatchedCount || 0,
          unmatchedSamples: processed.unmatchedSamples || [],
          weeklyList: processed.weeklyList,
          rawTransactions: processed.rawTransactions || [],
          models,
          evaluations
        });

        setFileName(name);
        setRawPage(1);
        const unitLabel = processed.isWeeklySource ? 'porsi' : 'baris transaksi';
        const unmatchedNote = processed.unmatchedCount > 0
          ? ` (${processed.unmatchedCount} baris nama produk di luar 5 varian Churrostime diabaikan: ${processed.unmatchedSamples.join(', ')})`
          : '';
        setFeedback({
          type: 'success',
          message: `Berhasil membaca berkas "${name}" (${processed.rawCount.toLocaleString('id-ID')} ${unitLabel}, ${processed.weeklyList.length} minggu: ${processed.trainWeeksCount} Training & ${processed.testWeeksCount} Testing). Model OLS otomatis diperbarui.${unmatchedNote}`
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Kolom tidak sesuai atau tidak ada baris yang cocok dengan 5 varian menu Churrostime (Ori, Oreo, Icing Sugar, Red Velvet, Matcha Caramel).'
        });
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setFeedback({
        type: 'error',
        message: `Gagal membaca file: ${err.message || 'Format tidak didukung'}`
      });
    } finally {
      setFileLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileLoading(true);
    setFeedback(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      parseFileBuffer(evt.target.result, file.name);
    };
    reader.onerror = () => {
      setFeedback({ type: 'error', message: 'Gagal membaca berkas dari disk.' });
      setFileLoading(false);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileLoading(true);
    setFeedback(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      parseFileBuffer(evt.target.result, file.name);
    };
    reader.onerror = () => {
      setFeedback({ type: 'error', message: 'Gagal membaca berkas.' });
      setFileLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleReprocess = () => {
    const currentList = currentDataState?.weeklyList || [];
    if (currentList.length === 0) return;

    setFileLoading(true);
    const isDefaultProposal = Boolean(
      currentDataState?.isDefaultProposal ??
      (currentList.length === 50 && currentList[0]?.minggu_mulai === '2025-10-18')
    );

    const { weeklyList: updatedWeekly, effectiveCutOff } = applyPartitioningToWeeklyList(
      currentList,
      { splitMode, splitRatio, cutOffDate },
      isDefaultProposal
    );

    if (effectiveCutOff) {
      setCutOffDate(effectiveCutOff);
    }

    // Re-map raw transactions fase & weekT to match updated weekly list
    const currentRaw = currentDataState?.rawTransactions || [];
    const updatedRaw = currentRaw.map(trx => {
      const week = updatedWeekly.find(wk => trx.Tanggal >= wk.minggu_mulai && trx.Tanggal <= wk.minggu_selesai);
      let fase = 'training';
      let weekT = trx.weekT ?? (updatedWeekly[0]?.t ?? 1);
      if (week) {
        fase = week.fase;
        weekT = week.t;
      } else {
        const firstTestingWeek = updatedWeekly.find(w => w.fase === 'testing');
        fase = (firstTestingWeek && trx.Tanggal >= firstTestingWeek.minggu_mulai) ? 'testing' : 'training';
      }
      return {
        ...trx,
        fase,
        weekT
      };
    });

    const { models, evaluations } = trainModelsFromWeekly(updatedWeekly);
    const trainWeeksCount = updatedWeekly.filter(w => w.fase === 'training' && !w.parsial).length;
    const testWeeksCount = updatedWeekly.filter(w => w.fase === 'testing' && !w.parsial).length;
    const trainTrxCount = currentDataState?.isWeeklySource ? null : updatedRaw.filter(r => r.fase === 'training').length;
    const testTrxCount = currentDataState?.isWeeklySource ? null : updatedRaw.filter(r => r.fase === 'testing').length;

    onDataProcessed({
      ...currentDataState,
      weeklyList: updatedWeekly,
      rawTransactions: updatedRaw,
      trainWeeksCount,
      testWeeksCount,
      trainTrxCount,
      testTrxCount,
      effectiveCutOffDate: effectiveCutOff,
      splitMode,
      splitRatio,
      models,
      evaluations
    });

    setFileLoading(false);
    setFeedback({
      type: 'success',
      message: `Model dilatih ulang (${trainWeeksCount} Minggu Training : ${testWeeksCount} Minggu Testing)`
    });
  };

  const weeklyList = currentDataState?.weeklyList || [];
  const rawTransactions = currentDataState?.rawTransactions ?? rawSampleTransactions;
  const trainWeeksDisplay = currentDataState?.trainWeeksCount ?? weeklyList.filter(w => w.fase === 'training' && !w.parsial).length;
  const testWeeksDisplay = currentDataState?.testWeeksCount ?? weeklyList.filter(w => w.fase === 'testing' && !w.parsial).length;
  const trainTrxDisplay = currentDataState?.trainTrxCount ?? rawTransactions.filter(r => r.fase === 'training').length;
  const testTrxDisplay = currentDataState?.testTrxCount ?? rawTransactions.filter(r => r.fase === 'testing').length;

  const filteredWeeklyList = useMemo(() => {
    return weeklyList.filter(row => {
      if (phaseFilter === 'training' && row.fase !== 'training') return false;
      if (phaseFilter === 'testing' && row.fase !== 'testing') return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchDate = (row.minggu_mulai || '').toLowerCase().includes(term) || (row.minggu_selesai || '').toLowerCase().includes(term);
        const matchWeek = `minggu ${row.t}`.includes(term) || `mg ${row.t}`.includes(term);
        if (!matchDate && !matchWeek) return false;
      }
      return true;
    });
  }, [weeklyList, phaseFilter, searchTerm]);

  // Filtered raw invoices
  const filteredRawLogs = useMemo(() => {
    return rawTransactions.filter(item => {
      if (rawPhaseFilter === 'training' && item.fase !== 'training') return false;
      if (rawPhaseFilter === 'testing' && item.fase !== 'testing') return false;
      if (rawVariantFilter !== 'ALL' && item['Nama Produk'] !== rawVariantFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchNota = (item['No Nota'] || '').toLowerCase().includes(term);
        const matchDate = (item['Tanggal'] || '').toLowerCase().includes(term);
        const matchSauce = (item['Jenis Saus'] || '').toLowerCase().includes(term);
        const matchProd = (item['Nama Produk'] || '').toLowerCase().includes(term);
        const matchFase = (item.fase || '').toLowerCase().includes(term);
        if (!matchNota && !matchDate && !matchSauce && !matchProd && !matchFase) return false;
      }
      return true;
    });
  }, [rawTransactions, rawPhaseFilter, rawVariantFilter, searchTerm]);

  // Raw pagination
  const rawPageSize = 12;
  const totalRawPages = Math.ceil(filteredRawLogs.length / rawPageSize);
  const paginatedRawLogs = filteredRawLogs.slice((rawPage - 1) * rawPageSize, rawPage * rawPageSize);
  const testingWeeksForLabel = weeklyList.filter(w => w.fase === 'testing' && !w.parsial);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Manajemen Data & Partisi Deret Waktu
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Unggah file transaksi (.xlsx / .csv) dari periode mana pun atau gunakan data standar kasir (2.209 transaksi).
          </p>
        </div>

        <button
          onClick={onProceedToEvaluation}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          <span>Lanjut ke Evaluasi Model</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Upload Feedback Alert */}
      {feedback && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid: Upload & Splitting Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Drag & Drop File Upload */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Sumber Data Transaksi</span>
              </h3>
              <span className="text-[11px] text-slate-400">Excel / CSV</span>
            </div>

            {/* Dropzone */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv" 
                className="hidden" 
              />
              <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                {fileLoading ? 'Sedang Memproses...' : 'Klik untuk Pilih File atau Drag & Drop ke Sini'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mendukung berkas Excel harian atau agregasi mingguan
              </p>
            </div>

            {/* Active file status */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="truncate flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>File aktif: <strong className="text-slate-800">{fileName}</strong></span>
              </span>
              {fileLoading && <span className="text-blue-600 font-semibold animate-pulse">Memproses...</span>}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Gunakan data standar:</span>
            <button
              onClick={() => {
                onLoadSampleData();
                setFileName('SiapMining_2401020053.xlsx');
                setCutOffDate('2026-08-01');
                setSplitRatio(80);
                setSplitMode('ratio');
                setPhaseFilter('ALL');
                setRawPhaseFilter('ALL');
                setRawVariantFilter('ALL');
                setRawPage(1);
                setFeedback({
                  type: 'success',
                  message: 'Dataset 2.209 transaksi UMKM Churrostime berhasil dimuat.'
                });
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Muat Data Standar</span>
            </button>
          </div>
        </div>

        {/* Right: Splitting Configuration Panel */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-500" />
                <span>Pengaturan Partisi Waktu (Split)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Training : Testing</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${
                  splitMode === 'date' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <input 
                    type="radio" 
                    name="splitMode" 
                    checked={splitMode === 'date'} 
                    onChange={() => setSplitMode('date')}
                    className="accent-slate-900"
                  />
                  <span className="font-bold block">Batas Tanggal Cut-Off</span>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${
                  splitMode === 'ratio' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <input 
                    type="radio" 
                    name="splitMode" 
                    checked={splitMode === 'ratio'} 
                    onChange={() => setSplitMode('ratio')}
                    className="accent-slate-900"
                  />
                  <span className="font-bold block">Rasio Persentase</span>
                </label>
              </div>

              {splitMode === 'ratio' ? (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">Proporsi Rasio Partisi Waktu</span>
                      <span className="text-[10px] text-slate-500">
                        {splitRatio}% Training : {100 - splitRatio}% Testing
                      </span>
                    </div>
                    <span className="font-mono font-bold text-xs bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg">
                      {splitRatio}:{100 - splitRatio}
                    </span>
                  </div>

                  <input 
                    type="range" 
                    min="60" 
                    max="90" 
                    step="5"
                    value={splitRatio}
                    onChange={(e) => setSplitRatio(parseInt(e.target.value, 10))}
                    className="w-full accent-slate-900 cursor-pointer"
                  />

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {[70, 75, 80, 85].map(ratioVal => (
                      <button
                        key={ratioVal}
                        type="button"
                        onClick={() => setSplitRatio(ratioVal)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                          splitRatio === ratioVal 
                            ? 'bg-slate-900 text-white ring-1 ring-slate-900' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {ratioVal}:{100 - ratioVal}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Mulai Periode Testing (Data Uji):
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <input 
                      type="date" 
                      value={cutOffDate}
                      onChange={(e) => setCutOffDate(e.target.value)}
                      className="bg-white px-2.5 py-1 rounded border border-slate-300 text-xs text-slate-800"
                    />
                    <span className="text-[11px] text-slate-500 truncate">
                      (Periode Uji: <strong>{testingWeeksForLabel.length > 0 ? `${testingWeeksForLabel[0]?.minggu_mulai} s.d ${testingWeeksForLabel[testingWeeksForLabel.length - 1]?.minggu_selesai}` : '–'}</strong>)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Perbarui model regresi dengan partisi ini:
            </span>

            <button
              onClick={handleReprocess}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fileLoading ? 'animate-spin' : ''}`} />
              <span>Proses Partisi Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Statistics Pill Summary */}
      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-700">
          <div>
            Total {currentDataState?.isWeeklySource ? 'Porsi' : 'Transaksi'}: <strong className="text-slate-900 font-mono text-sm">{(currentDataState?.rawCount ?? rawTransactions.length).toLocaleString('id-ID')}</strong> {currentDataState?.isWeeklySource ? 'porsi' : 'baris'}
          </div>
          <span className="text-slate-300">|</span>
          <div>
            Data Training: <strong className="text-blue-700 font-mono text-sm">{trainWeeksDisplay}</strong> minggu
            {!currentDataState?.isWeeklySource && trainTrxDisplay > 0 && (
              <span className="text-slate-500 text-[11px] ml-1 font-mono">
                ({trainTrxDisplay.toLocaleString('id-ID')} nota)
              </span>
            )}
          </div>
          <span className="text-slate-300">|</span>
          <div>
            Data Testing: <strong className="text-emerald-700 font-mono text-sm">{testWeeksDisplay}</strong> minggu
            {!currentDataState?.isWeeklySource && testTrxDisplay > 0 && (
              <span className="text-slate-500 text-[11px] ml-1 font-mono">
                ({testTrxDisplay.toLocaleString('id-ID')} nota)
              </span>
            )}
          </div>
          <span className="text-slate-300">|</span>
          <div className="text-slate-500 text-[11px]">
            Rentang: {currentDataState?.minDateStr} s.d {currentDataState?.maxDateStr}
          </div>
        </div>

        <a
          href="./SiapMining_2401020053.xlsx"
          download
          className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Unduh Excel</span>
        </a>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        
        {/* Table View Switcher Header */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTableView('weekly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTableView === 'weekly'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Data Mingguan ({filteredWeeklyList.length} Mg)</span>
            </button>

            <button
              onClick={() => setActiveTableView('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTableView === 'raw'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Catatan Transaksi Kasir ({filteredRawLogs.length} Nota)</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input 
                type="text"
                placeholder={activeTableView === 'weekly' ? 'Cari minggu/tanggal...' : 'Cari no nota/tgl/produk...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white w-44 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {activeTableView === 'weekly' ? (
              <select
                value={phaseFilter}
                onChange={(e) => setPhaseFilter(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
              >
                <option value="ALL">Semua Fase ({weeklyList.length} Mg)</option>
                <option value="training">Training ({trainWeeksDisplay} Mg)</option>
                <option value="testing">Testing ({testWeeksDisplay} Mg)</option>
              </select>
            ) : (
              <div className="flex items-center gap-1.5">
                <select
                  value={rawPhaseFilter}
                  onChange={(e) => { setRawPhaseFilter(e.target.value); setRawPage(1); }}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
                >
                  <option value="ALL">Semua Fase ({rawTransactions.length} Nota)</option>
                  <option value="training">Training ({trainTrxDisplay} Nota)</option>
                  <option value="testing">Testing ({testTrxDisplay} Nota)</option>
                </select>

                <select
                  value={rawVariantFilter}
                  onChange={(e) => { setRawVariantFilter(e.target.value); setRawPage(1); }}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
                >
                  <option value="ALL">Semua Varian</option>
                  <option value="Ori">Ori</option>
                  <option value="Oreo">Oreo</option>
                  <option value="Icing Sugar">Icing Sugar</option>
                  <option value="Red Velvet">Red Velvet</option>
                  <option value="Matcha Caramel">Matcha Caramel</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* View A: Weekly Table */}
        {activeTableView === 'weekly' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Minggu (t)</th>
                  <th className="py-2.5 px-3">Periode Tanggal</th>
                  <th className="py-2.5 px-2 text-center">Fase</th>
                  <th className="py-2.5 px-3 text-right">Ori</th>
                  <th className="py-2.5 px-3 text-right">Oreo</th>
                  <th className="py-2.5 px-3 text-right">Icing Sugar</th>
                  <th className="py-2.5 px-3 text-right">Red Velvet</th>
                  <th className="py-2.5 px-3 text-right">Matcha</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-slate-50">Total</th>
                  <th className="py-2.5 px-2 text-center">Hari Buka</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filteredWeeklyList.map((row) => {
                  const total = row.Ori + row.Oreo + row['Icing Sugar'] + row['Red Velvet'] + row['Matcha Caramel'];
                  const isTesting = row.fase === 'testing';

                  return (
                    <tr key={row.t} className={`hover:bg-slate-50 ${row.parsial ? 'opacity-65 bg-slate-50/70' : isTesting ? 'bg-amber-50/40' : ''}`}>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        Mg {row.t}
                        {row.parsial && <span className="ml-1 text-[9px] font-sans font-normal text-slate-400">(parsial)</span>}
                      </td>
                      <td className="py-2 px-3 text-slate-600 font-sans text-xs">{row.minggu_mulai} s.d {row.minggu_selesai}</td>
                      <td className="py-2 px-2 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.parsial
                            ? 'bg-slate-100 text-slate-500 border border-slate-200'
                            : isTesting 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {row.parsial ? 'parsial' : row.fase}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-slate-800">{row.Ori}</td>
                      <td className="py-2 px-3 text-right text-slate-800">{row.Oreo}</td>
                      <td className="py-2 px-3 text-right text-slate-800">{row['Icing Sugar']}</td>
                      <td className="py-2 px-3 text-right text-slate-800">{row['Red Velvet']}</td>
                      <td className="py-2 px-3 text-right text-slate-800">{row['Matcha Caramel']}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 bg-slate-50">{total}</td>
                      <td className="py-2 px-2 text-center text-slate-500 font-sans">{row.hari_transaksi} hr</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* View B: Raw Invoices Table */}
        {activeTableView === 'raw' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">No Nota</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-2 text-center">Waktu</th>
                    <th className="py-2.5 px-2 text-center">Minggu (t)</th>
                    <th className="py-2.5 px-2 text-center">Fase</th>
                    <th className="py-2.5 px-3">Nama Produk</th>
                    <th className="py-2.5 px-3">Jenis Saus</th>
                    <th className="py-2.5 px-2 text-center font-mono">Qty</th>
                    <th className="py-2.5 px-3 text-right font-mono">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">Total Bayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {paginatedRawLogs.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="py-8 text-center text-slate-400 font-sans">
                        {currentDataState?.isWeeklySource
                          ? 'File yang diunggah berformat agregasi mingguan (tidak memuat rincian nota kasir harian).'
                          : 'Tidak ada data transaksi yang cocok dengan filter.'}
                      </td>
                    </tr>
                  ) : paginatedRawLogs.map((row, idx) => {
                    const price = row['Harga'] || (row['Nama Produk'] === 'Ori' || row['Nama Produk'] === 'Icing Sugar' ? 22000 : 25000);
                    const qty = row['Jumlah Terjual'] || 1;
                    const total = price * qty;
                    const isTesting = row.fase === 'testing';

                    return (
                      <tr key={idx} className={`hover:bg-slate-50 ${isTesting ? 'bg-amber-50/40' : ''}`}>
                        <td className="py-2 px-3 font-semibold text-slate-800">{row['No Nota']}</td>
                        <td className="py-2 px-3 text-slate-600 font-sans text-xs">{row['Tanggal']}</td>
                        <td className="py-2 px-2 text-center text-slate-500 font-sans">{row['Waktu'] || '19:30:00'}</td>
                        <td className="py-2 px-2 text-center font-bold text-slate-700">Mg {row.weekT !== undefined ? row.weekT : '–'}</td>
                        <td className="py-2 px-2 text-center font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isTesting 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {row.fase || 'training'}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans font-semibold text-slate-800">{row['Nama Produk']}</td>
                        <td className="py-2 px-3 text-slate-600 font-sans">{row['Jenis Saus'] || 'Saus Coklat'}</td>
                        <td className="py-2 px-2 text-center text-slate-800">{qty}</td>
                        <td className="py-2 px-3 text-right text-slate-600">Rp {price.toLocaleString('id-ID')}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">Rp {total.toLocaleString('id-ID')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>
                Menampilkan {filteredRawLogs.length > 0 ? ((rawPage - 1) * rawPageSize) + 1 : 0} – {Math.min(rawPage * rawPageSize, filteredRawLogs.length)} dari {filteredRawLogs.length.toLocaleString('id-ID')} nota
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={rawPage <= 1}
                  onClick={() => setRawPage(prev => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                >
                  Sebelumnya
                </button>
                <span className="font-mono font-bold text-slate-800">
                  {rawPage} / {Math.max(1, totalRawPages)}
                </span>
                <button
                  disabled={rawPage >= totalRawPages}
                  onClick={() => setRawPage(prev => Math.min(totalRawPages, prev + 1))}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
