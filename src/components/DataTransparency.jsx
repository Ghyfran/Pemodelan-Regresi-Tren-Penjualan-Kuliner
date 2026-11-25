import React, { useState } from 'react';
import { 
  APP_INFO,
  VARIAN_DETAILS,
  EVALUATION_DETAILED 
} from '../data/churrosDataset';
import { 
  Database, 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Users, 
  Store, 
  GraduationCap, 
  Sparkles, 
  Code,
  Layers,
  Table,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function DataTransparency() {
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('sql'); // 'sql', 'schema', 'proposal'

  const sampleSqlSnippet = `-- ==========================================================
-- DATABASE SISTEM DATA MINING & PREDIKSI PENJUALAN CHURROS
-- Proposal Riset: ${APP_INFO.proposalCode}
-- Mitra: ${APP_INFO.mitra.nama} (${APP_INFO.mitra.alamat})
-- Tim Peneliti: Rizka Sufianty, Piky Al Piandi, Nurul Aida, Abdal Ghyfran KH, M. Rizky Anargya Sofyan
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`db_churros_mining\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`db_churros_mining\`;

-- 1. TABEL TRANSAKSI KASIR (2.209 BARIS TRANSAKSI WAKTU REAL)
DROP TABLE IF EXISTS \`transaksi_churros\`;
CREATE TABLE \`transaksi_churros\` (
  \`id_transaksi\` INT AUTO_INCREMENT PRIMARY KEY,
  \`no_nota\` VARCHAR(50) NOT NULL,
  \`tanggal\` DATE NOT NULL,
  \`waktu\` TIME DEFAULT '19:00:00',
  \`nama_produk\` VARCHAR(50) NOT NULL,
  \`jenis_saus\` VARCHAR(50) DEFAULT 'Saus Coklat',
  \`jumlah_terjual\` INT NOT NULL DEFAULT 1,
  \`harga\` DECIMAL(10,2) NOT NULL DEFAULT 22000.00,
  INDEX (\`tanggal\`),
  INDEX (\`nama_produk\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL AGREGASI MINGGUAN (DERET WAKTU 50 MINGGU)
DROP TABLE IF EXISTS \`agregasi_mingguan_churros\`;
CREATE TABLE \`agregasi_mingguan_churros\` (
  \`minggu_ke_t\` INT PRIMARY KEY,
  \`tanggal_mulai\` DATE NOT NULL,
  \`tanggal_selesai\` DATE NOT NULL,
  \`ori_terjual\` INT NOT NULL DEFAULT 0,
  \`oreo_terjual\` INT NOT NULL DEFAULT 0,
  \`icing_sugar_terjual\` INT NOT NULL DEFAULT 0,
  \`red_velvet_terjual\` INT NOT NULL DEFAULT 0,
  \`matcha_caramel_terjual\` INT NOT NULL DEFAULT 0,
  \`total_unit\` INT NOT NULL DEFAULT 0,
  \`fase_data\` ENUM('training', 'testing', 'parsial') NOT NULL DEFAULT 'training'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL EVALUASI MODEL REGRESI LINIER OLS PER VARIAN
DROP TABLE IF EXISTS \`evaluasi_model_regresi\`;
CREATE TABLE \`evaluasi_model_regresi\` (
  \`id_model\` INT AUTO_INCREMENT PRIMARY KEY,
  \`varian\` VARCHAR(50) NOT NULL,
  \`intercept_b0\` DECIMAL(10,4) NOT NULL,
  \`slope_b1\` DECIMAL(10,4) NOT NULL,
  \`r_squared\` DECIMAL(6,4) NOT NULL,
  \`mae_testing\` DECIMAL(10,4) NOT NULL,
  \`rmse_testing\` DECIMAL(10,4) NOT NULL,
  \`mae_baseline\` DECIMAL(10,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cuplikan Isi Transaksi:
INSERT INTO \`transaksi_churros\` (\`no_nota\`, \`tanggal\`, \`waktu\`, \`nama_produk\`, \`jenis_saus\`, \`jumlah_terjual\`, \`harga\`) VALUES
('CS/89/251023/0020', '2025-10-23', '19:37:00', 'Ori', 'Saus Coklat', 1, 22000),
('CS/89/251023/0057', '2025-10-23', '21:08:00', 'Oreo', 'Saus Tiramisu', 1, 25000),
('CS/89/251023/0061', '2025-10-23', '21:14:00', 'Ori', 'Saus Coklat', 1, 22000),
('CS/89/251023/0083', '2025-10-23', '21:45:00', 'Icing Sugar', 'Saus Coklat', 1, 22000),
('CS/89/251023/0086', '2025-10-23', '22:17:00', 'Ori', 'Saus Coklat', 1, 22000);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sampleSqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const tablesSchema = [
    {
      name: 'transaksi_churros',
      rows: '2.209 Transaksi Riil Kasir',
      desc: 'Menyimpan logbook data transaksi asli berdimensi waktu periode 23 Oktober 2025 s.d. 30 September 2026.',
      columns: [
        { col: 'id_transaksi', type: 'INT (PK, Auto Inc)', desc: 'Identitas unik transaksi' },
        { col: 'no_nota', type: 'VARCHAR(50)', desc: 'Nomor nota kasir fisik (e.g. CS/89/251023/0020)' },
        { col: 'tanggal', type: 'DATE', desc: 'Tanggal pembelian (YYYY-MM-DD)' },
        { col: 'waktu', type: 'TIME', desc: 'Jam operasional transaksi' },
        { col: 'nama_produk', type: 'VARCHAR(50)', desc: 'Varian menu (Ori, Oreo, Icing Sugar, Red Velvet, Matcha)' },
        { col: 'jenis_saus', type: 'VARCHAR(50)', desc: 'Saus pelengkap (Coklat, Tiramisu, Matcha, Tanpa Saus)' },
        { col: 'jumlah_terjual', type: 'INT', desc: 'Kuantitas porsi terjual' },
        { col: 'harga', type: 'DECIMAL(10,2)', desc: 'Harga satuan (Rp 22.000 / Rp 25.000)' }
      ]
    },
    {
      name: 'agregasi_mingguan_churros',
      rows: '50 Minggu Efektif (t = 0 s.d. 49)',
      desc: 'Hasil transformasi pre-processing berupa rekapitulasi penjualan per minggu untuk analisis deret waktu.',
      columns: [
        { col: 'minggu_ke_t', type: 'INT (PK)', desc: 'Indeks minggu linier deret waktu (t=1..48)' },
        { col: 'tanggal_mulai', type: 'DATE', desc: 'Awal pekan operasional (Sabtu/Selasa)' },
        { col: 'tanggal_selesai', type: 'DATE', desc: 'Akhir pekan operasional (Jumat/Minggu)' },
        { col: 'ori_terjual', type: 'INT', desc: 'Volume mingguan Churros Original' },
        { col: 'oreo_terjual', type: 'INT', desc: 'Volume mingguan Churros Oreo Crumbs' },
        { col: 'icing_sugar_terjual', type: 'INT', desc: 'Volume mingguan Churros Icing Sugar' },
        { col: 'red_velvet_terjual', type: 'INT', desc: 'Volume mingguan Churros Red Velvet' },
        { col: 'matcha_caramel_terjual', type: 'INT', desc: 'Volume mingguan Churros Matcha Caramel' },
        { col: 'fase_data', type: 'ENUM', desc: 'Fase: training (40 mg) atau testing (8 mg)' }
      ]
    },
    {
      name: 'evaluasi_model_regresi',
      rows: '5 Model OLS Parsial',
      desc: 'Menyimpan parameter matematis garis regresi linier OLS dan metrik akurasi terukur masing-masing varian.',
      columns: [
        { col: 'id_model', type: 'INT (PK)', desc: 'ID unik model varian' },
        { col: 'varian', type: 'VARCHAR(50)', desc: 'Nama varian produk kuliner' },
        { col: 'intercept_b0', type: 'DECIMAL(10,4)', desc: 'Konstanta estimasi awal penjualan' },
        { col: 'slope_b1', type: 'DECIMAL(10,4)', desc: 'Kemiringan/laju tren mingguan' },
        { col: 'r_squared', type: 'DECIMAL(6,4)', desc: 'Koefisien determinasi training' },
        { col: 'mae_testing', type: 'DECIMAL(10,4)', desc: 'Mean Absolute Error uji testing' },
        { col: 'rmse_testing', type: 'DECIMAL(10,4)', desc: 'Root Mean Square Error uji testing' }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title Banner */}
      <div className="glass-card rounded-3xl p-6 shadow-xs border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Modul 5: Basis Data MySQL Relasional & Dokumen Proposal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
            Arsitektur Basis Data & Dokumen Resmi Proposal {APP_INFO.proposalCode}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Menyediakan transparansi penuh terhadap struktur basis data SQL relasional (<code>database_churros.sql</code>), dataset kasir asli, serta rincian proposal penelitian penambangan data UMKM Churrostime.
          </p>
        </div>

        {/* Action Downloads */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          <a
            href="/PropPD_2401020053.pdf"
            download="PropPD_2401020053.pdf"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Unduh Proposal PDF</span>
          </a>

          <a
            href="/database_churros.sql"
            download="database_churros.sql"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Unduh SQL</span>
          </a>

          <a
            href="/SiapMining_2401020053.xlsx"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Unduh Excel</span>
          </a>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white p-1.5 rounded-2xl border gap-2 shadow-xs">
        <button
          onClick={() => setActiveSubTab('sql')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'sql'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Skrip SQL DDL (database_churros.sql)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schema')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'schema'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Skema 3 Tabel Basis Data</span>
        </button>

        <button
          onClick={() => setActiveSubTab('proposal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'proposal'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Rincian Proposal {APP_INFO.proposalCode}</span>
        </button>
      </div>

      {/* Sub-tab 1: SQL Code Viewer */}
      {activeSubTab === 'sql' && (
        <div className="glass-card rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold">database_churros.sql (Ukuran: 184 KB • 2.251 Baris)</span>
            </div>

            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Tersalin ke Clipboard!' : 'Salin Cuplikan SQL'}</span>
            </button>
          </div>

          <pre className="p-5 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
            <code>{sampleSqlSnippet}</code>
          </pre>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <span>
              File SQL lengkap memuat seluruh 2.209 INSERT INTO transaksi siap diimpor ke <strong>phpMyAdmin</strong> atau MySQL Workbench.
            </span>

            <a
              href="/database_churros.sql"
              download="database_churros.sql"
              className="font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>Download File SQL Utuh</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Sub-tab 2: 3 Tables Schema Overview */}
      {activeSubTab === 'schema' && (
        <div className="space-y-6">
          {tablesSchema.map((tbl, idx) => (
            <div key={idx} className="glass-card rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm text-slate-900">
                      Tabel: `{tbl.name}`
                    </h3>
                    <p className="text-[11px] text-slate-500">{tbl.desc}</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold bg-white text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                  {tbl.rows}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3.5 font-mono">Nama Kolom (Field)</th>
                      <th className="py-2.5 px-3 font-mono">Tipe Data</th>
                      <th className="py-2.5 px-3.5">Keterangan Atribut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {tbl.columns.map((c, cIdx) => (
                      <tr key={cIdx} className="hover:bg-slate-50">
                        <td className="py-2 px-3.5 font-bold text-slate-900">{c.col}</td>
                        <td className="py-2 px-3 text-amber-700">{c.type}</td>
                        <td className="py-2 px-3.5 font-sans text-slate-600 text-xs">{c.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab 3: Official Proposal Document Sheet */}
      {activeSubTab === 'proposal' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          
          {/* Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Dokumentasi Proposal Riset
              </span>
              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 mt-2">
                {APP_INFO.judulProposal}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Semester Ganjil 2026–2027 • Mata Kuliah Penambangan Data
              </p>
            </div>

            <div className="font-mono text-xs font-bold px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-300 text-slate-800">
              {APP_INFO.proposalCode}
            </div>
          </div>

          {/* Team Members Grid */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Susunan Tim Peneliti (5 Mahasiswa):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {APP_INFO.timPeneliti.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      {idx + 1}. {m.nama}
                    </span>
                    <span className="text-[11px] text-slate-500">{m.peran}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {m.nim}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mitra Info */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-600" />
              <span>Profil Mitra Pemilik Data:</span>
            </h4>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{APP_INFO.mitra.nama}</span>
                <span className="font-semibold text-amber-800 text-[11px]">Beroperasi sejak 2016</span>
              </div>
              <p className="text-slate-600">{APP_INFO.mitra.alamat} • {APP_INFO.mitra.operasional}</p>
              <div className="pt-2 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <p><strong>Narasumber Pembukuan:</strong> {APP_INFO.mitra.narasumber}</p>
                <p><strong>Pemilik Usaha (Owner):</strong> {APP_INFO.mitra.pemilik}</p>
              </div>
            </div>
          </div>

          {/* Objectives Summary */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tujuan & Ruang Lingkup Sistem:</span>
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                1. Menerapkan pemodelan regresi berbasis waktu secara parsial untuk 5 varian menu churros (Ori, Oreo, Icing Sugar, Red Velvet, dan Matcha Caramel).
              </p>
              <p>
                2. Melakukan evaluasi tren penjualan periode terbaru (Agustus – September 2026) dengan membandingkan nilai estimasi regresi vs catatan transaksi riil kasir.
              </p>
              <p>
                3. Menyediakan kalkulator perencanaan persediaan stok bahan baku (tepung terigu, minyak goreng, telur, margarin, dan aneka dipping sauce) guna mencegah kelebihan atau kekurangan stok.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
