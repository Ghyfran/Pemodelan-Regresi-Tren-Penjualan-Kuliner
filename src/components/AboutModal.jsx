import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Store, 
  BookOpen, 
  Calendar, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Download,
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { APP_INFO } from '../data/churrosDataset';

export default function AboutModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('proposal'); // 'proposal', 'team', 'partner'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                  {APP_INFO.proposalCode}
                </span>
                <span className="text-xs text-slate-300 font-medium">Ganjil 2026–2027</span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">
                Proposal Project Penambangan Data
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-xl p-2 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Nav Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('proposal')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'proposal'
                ? 'border-amber-600 text-amber-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tujuan & Solusi</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'team'
                ? 'border-amber-600 text-amber-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tim Peneliti (5 Mahasiswa)</span>
          </button>

          <button
            onClick={() => setActiveTab('partner')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'partner'
                ? 'border-amber-600 text-amber-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Mitra UMKM Churrostime</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 leading-relaxed">
          
          {activeTab === 'proposal' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Judul Riset Resmi
                </span>
                <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                  {APP_INFO.judulProposal}
                </h4>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  <span>Latar Belakang & Masalah Mitra</span>
                </h5>
                <p className="text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200">
                  Mitra pemilik data adalah <strong>UMKM Churrostime</strong> yang beroperasi di Jl. Hang Tuah No. 7 Tanjungpinang sejak tahun 2016. Catatan transaksi penjualan berdimensi waktu (Oktober 2025 – September 2026) memuat atribut nomor nota, tanggal, waktu, nama produk (5 varian menu), saus celup, kuantitas, dan harga. Selama ini catatan hanya menjadi arsip pembukuan dan belum pernah diolah. Pada periode transaksi terbaru (Agustus – September 2026), terjadi dinamika perubahan penjualan antarvarian yang belum dapat dievaluasi secara objektif, sehingga berisiko menimbulkan ketidaksesuaian perencanaan stok bahan baku dan strategi promosi produk.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Solusi yang Diusulkan & Dicapai Sistem</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">1. Pre-processing & Split 80:20</span>
                    <p className="text-slate-500 text-[11px]">
                      Data training 40 minggu (Okt 2025 – Jul 2026) untuk melatih pola historis; data testing 8 minggu (Agu – Sep 2026) untuk evaluasi buta tanpa kebocoran data.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">2. 5 Model Regresi Linier Parsial</span>
                    <p className="text-slate-500 text-[11px]">
                      Membangun fungsi regresi linier spesifik untuk tiap varian produk beserta pengukuran akurasi terukur (MAE dan RMSE vs Baseline).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">3. Evaluasi Gap Penjualan</span>
                    <p className="text-slate-500 text-[11px]">
                      Membandingkan hasil prediksi dengan transaksi riil Agustus–September 2026 untuk mengidentifikasi selisih dan faktor penyebab fenomena lapangan.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">4. Kalkulator Stok Bahan Baku</span>
                    <p className="text-slate-500 text-[11px]">
                      Mengkonversi peramalan porsi terjual ke kebutuhan riil tepung terigu, minyak, telur, margarin, dan dipping sauces siap saji.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-xs">
                  Daftar Anggota Kelompok Peneliti
                </span>
                <span className="text-[11px] text-slate-500">
                  Mata Kuliah Penambangan Data
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {APP_INFO.timPeneliti.map((m, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        idx === 0 
                          ? 'bg-amber-600 text-white shadow-sm' 
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {m.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{m.nama}</span>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              Ketua Tim
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">{m.peran}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 block">
                        {m.nim}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'partner' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <Store className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{APP_INFO.mitra.nama}</h4>
                  <p className="text-slate-600 text-xs mt-0.5">{APP_INFO.mitra.alamat}</p>
                  <p className="text-amber-800 font-semibold text-[11px] mt-1">
                    Beroperasi sejak tahun {APP_INFO.mitra.beroperasiSejak} • {APP_INFO.mitra.operasional}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Narasumber Lapangan</span>
                  <p className="font-bold text-slate-800">{APP_INFO.mitra.narasumber}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Pengelola pembukuan outlet harian</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Pemilik Usaha (Owner)</span>
                  <p className="font-bold text-slate-800">{APP_INFO.mitra.pemilik}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Pemberi persetujuan riset & olah data</p>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Produk & Menu Andalan</span>
                <p className="text-slate-700">
                  {APP_INFO.mitra.produkUtama} — Menyajikan 5 varian favorit: <em>Original (Ori), Oreo Crumbs, Icing Sugar, Red Velvet, dan Matcha Caramel</em> dengan pilihan saus celup Saus Coklat Belgia, Tiramisu Creamy, dan Matcha Greentea.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>Dokumentasi Resmi Proposal Penambangan Data</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/PropPD_2401020053.pdf"
              download="PropPD_2401020053.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF Proposal</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Tutup Modal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
