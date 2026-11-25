import * as XLSX from 'xlsx';

export const VARIANT_KEYS = ['Ori', 'Oreo', 'Icing Sugar', 'Red Velvet', 'Matcha Caramel'];

// Clean date formatting to YYYY-MM-DD using local calendar numbers
export function formatDateOnly(d) {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Helper to construct a validated local Date (prevents silent JS rollover like Feb 30 -> Mar 2)
function makeValidLocalDate(year, monthIdx, day) {
  if (year < 1900 || year > 2200 || monthIdx < 0 || monthIdx > 11 || day < 1 || day > 31) {
    return null;
  }
  const d = new Date(year, monthIdx, day);
  if (
    isNaN(d.getTime()) ||
    d.getFullYear() !== year ||
    d.getMonth() !== monthIdx ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

// Robust date parser supporting Date, Excel serial number (UTC-safe), ISO, DMY/MDY, and Indonesian month names
export function parseAnyDate(val) {
  if (val === null || val === undefined || val === '') return null;

  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    // Add 30 seconds to compensate for Excel floating point date imprecision (e.g. 23:59:48 -> 00:00:00 next day)
    const adjusted = new Date(val.getTime() + 30000);
    return new Date(adjusted.getFullYear(), adjusted.getMonth(), adjusted.getDate());
  }

  // Excel serial number (days since Dec 30 1899) using UTC components to avoid negative-timezone shifts
  if (typeof val === 'number' && isFinite(val) && val > 0) {
    const ms = Math.round((val - 25569) * 86400 * 1000) + 30000;
    const utcDate = new Date(ms);
    if (isNaN(utcDate.getTime())) return null;
    return makeValidLocalDate(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate()
    );
  }

  if (typeof val === 'string') {
    const s = val.trim();
    if (!s) return null;

    // Check YYYY-MM-DD or YYYY/MM/DD
    const ymdMatch = s.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      return makeValidLocalDate(year, month, day);
    }

    // Check DD/MM/YYYY or MM/DD/YYYY (prefer DMY for Indonesia, fallback to MDY only if second part > 12)
    const dmyMatch = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (dmyMatch) {
      const p1 = parseInt(dmyMatch[1], 10);
      const p2 = parseInt(dmyMatch[2], 10);
      const year = parseInt(dmyMatch[3], 10);
      if (p2 >= 1 && p2 <= 12) {
        const dmy = makeValidLocalDate(year, p2 - 1, p1);
        if (dmy) return dmy;
      }
      if (p1 >= 1 && p1 <= 12 && p2 > 12) {
        const mdy = makeValidLocalDate(year, p1 - 1, p2);
        if (mdy) return mdy;
      }
      return null;
    }

    // Check Indonesian / English month names: e.g. "23 Oktober 2025" or "23 Okt 2025"
    const indoMonths = {
      jan: 0, januari: 0,
      feb: 1, februari: 1,
      mar: 2, maret: 2,
      apr: 3, april: 3,
      mei: 4, may: 4,
      jun: 5, juni: 5,
      jul: 6, juli: 6,
      agu: 7, agustus: 7, aug: 7,
      sep: 8, september: 8,
      okt: 9, oktober: 9, oct: 9,
      nov: 10, november: 10,
      des: 11, desember: 11, dec: 11
    };

    const textMatch = s.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
    if (textMatch) {
      const day = parseInt(textMatch[1], 10);
      const mStr = textMatch[2].toLowerCase().slice(0, 3);
      const year = parseInt(textMatch[3], 10);
      if (indoMonths[mStr] !== undefined) {
        return makeValidLocalDate(year, indoMonths[mStr], day);
      }
    }

    const standard = new Date(s);
    if (!isNaN(standard.getTime())) {
      const adjusted = new Date(standard.getTime() + 30000);
      return new Date(adjusted.getFullYear(), adjusted.getMonth(), adjusted.getDate());
    }
  }

  return null;
}

// Strict variant name matcher for the 5 Churrostime menu variants (returns null if unrecognized)
export function matchVariantName(rawName) {
  if (!rawName) return null;
  const s = String(rawName).toLowerCase().trim();
  if (!s) return null;
  if (s.includes('oreo')) return 'Oreo';
  if (s.includes('icing') || s.includes('sugar') || s.includes('gula')) return 'Icing Sugar';
  if (s.includes('velvet') || s.includes('red')) return 'Red Velvet';
  if (s.includes('matcha') || s.includes('caramel') || s.includes('karamel')) return 'Matcha Caramel';
  if (s === 'ori' || s.includes('ori') || s.includes('original') || s.includes('klasik') || s.includes('classic')) return 'Ori';
  return null;
}

// Linear regression calculator: y = b0 + b1 * x
export function calculateOLS(xValues, yValues) {
  const n = xValues.length;
  if (n === 0) return { b0: 0, b1: 0, r2: 0, yMean: 0 };
  if (n === 1) return { b0: yValues[0] || 0, b1: 0, r2: 0, yMean: yValues[0] || 0 };

  const xMean = xValues.reduce((a, b) => a + b, 0) / n;
  const yMean = yValues.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  let ssTot = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += (xValues[i] - xMean) ** 2;
    ssTot += (yValues[i] - yMean) ** 2;
  }

  const b1 = denominator !== 0 ? numerator / denominator : 0;
  const b0 = yMean - b1 * xMean;

  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const yPred = b0 + b1 * xValues[i];
    ssRes += (yValues[i] - yPred) ** 2;
  }

  const r2 = ssTot !== 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;

  return { b0, b1, r2, yMean };
}

// Compute MAE and RMSE
export function computeMetrics(actuals, predictions) {
  const n = actuals.length;
  if (n === 0) return { mae: 0, rmse: 0 };

  let absSum = 0;
  let sqSum = 0;

  for (let i = 0; i < n; i++) {
    const diff = predictions[i] - actuals[i];
    absSum += Math.abs(diff);
    sqSum += diff ** 2;
  }

  return {
    mae: absSum / n,
    rmse: Math.sqrt(sqSum / n)
  };
}

// Parse raw physical matrix/tally sheets (e.g. logbook bulanan)
export function parseMatrixSheet(sheet, sheetName) {
  const grid = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  if (!grid || grid.length === 0) return [];

  let dateRowIdx = -1;
  for (let i = 0; i < Math.min(12, grid.length); i++) {
    if (grid[i] && grid[i].some(c => String(c || '').trim().toUpperCase() === 'TANGGAL')) {
      dateRowIdx = i;
      break;
    }
  }
  if (dateRowIdx === -1) return [];

  const dateRow = grid[dateRowIdx];
  const dayCols = [];
  for (let c = 0; c < dateRow.length; c++) {
    const val = parseInt(dateRow[c], 10);
    if (!isNaN(val) && val >= 1 && val <= 31) {
      dayCols.push({ col: c, day: val });
    }
  }
  if (dayCols.length === 0) return [];

  const indoMonths = {
    jan: 0, januari: 0, feb: 1, februari: 1, mar: 2, maret: 2, apr: 3, april: 3, mei: 4, may: 4,
    jun: 5, juni: 5, jul: 6, juli: 6, agu: 7, agustus: 7, aug: 7, sep: 8, september: 8, okt: 9,
    oktober: 9, oct: 9, nov: 10, november: 10, des: 11, desember: 11, dec: 11
  };

  let monthIdx = null;
  let year = null;

  // 1. Try sheetName for month and 4-digit year
  const sheetYearMatch = String(sheetName).match(/\b(19\d{2}|20\d{2}|21\d{2})\b/);
  if (sheetYearMatch) year = parseInt(sheetYearMatch[1], 10);

  const sheetWords = String(sheetName).match(/[a-zA-Z]+/g) || [];
  for (const w of sheetWords) {
    const key = w.toLowerCase().slice(0, 3);
    if (indoMonths[key] !== undefined) {
      monthIdx = indoMonths[key];
      break;
    }
  }

  // 2. Scan top rows above dateRowIdx for missing year/month in title headers
  if (year === null || monthIdx === null) {
    for (let r = 0; r <= dateRowIdx; r++) {
      const rowText = (grid[r] || []).map(c => String(c || '')).join(' ');
      if (year === null) {
        const yMatch = rowText.match(/\b(19\d{2}|20\d{2}|21\d{2})\b/);
        if (yMatch) year = parseInt(yMatch[1], 10);
      }
      if (monthIdx === null) {
        const words = rowText.match(/[a-zA-Z]+/g) || [];
        for (const w of words) {
          const key = w.toLowerCase().slice(0, 3);
          if (indoMonths[key] !== undefined) {
            monthIdx = indoMonths[key];
            break;
          }
        }
      }
    }
  }

  if (monthIdx === null) monthIdx = 0;
  if (year === null) year = new Date().getFullYear();

  const rows = [];

  for (let r = dateRowIdx + 1; r < grid.length; r++) {
    const row = grid[r];
    if (!row || !row[0]) continue;
    const matched = matchVariantName(row[0]);
    if (!matched) continue;

    dayCols.forEach(({ col, day }) => {
      const qty = parseInt(row[col], 10) || 0;
      if (qty > 0) {
        const d = makeValidLocalDate(year, monthIdx, day);
        if (!d) return;
        rows.push({
          Tanggal: formatDateOnly(d),
          'Nama Produk': matched,
          'Jumlah Terjual': qty,
          'No Nota': `LOG-${String(sheetName).replace(/\s+/g, '')}-${day}`,
          'Jenis Saus': 'Saus Coklat',
          'Sumber Data': 'Logbook Fisik'
        });
      }
    });
  }
  return rows;
}

// Multi-sheet intelligent workbook parser (flat tables, multi-sheets, weekly models, and matrix sheets)
export function smartParseWorkbook(workbook) {
  let allTransactionRows = [];
  let usedSheets = [];
  let weeklyRows = null;
  let weeklySheetName = '';

  for (const sName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sName];
    if (!sheet) continue;

    const grid = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    if (!grid || grid.length === 0) continue;

    let headerIdx = -1;
    let isWeekly = false;
    let isTx = false;

    // Scan first 15 rows for header row
    for (let r = 0; r < Math.min(15, grid.length); r++) {
      const row = grid[r];
      if (!row || !Array.isArray(row)) continue;
      const strCells = row.map(c => String(c || '').trim());
      const hasDate = strCells.some(c => /tanggal|tgl|date|waktu|periode/i.test(c));
      const hasProd = strCells.some(c => /produk|product|varian|menu|item|barang/i.test(c));
      const hasWeek = strCells.some(c => /^t$/i.test(c) || /minggu|week/i.test(c));
      const hasOri = strCells.some(c => /^ori$/i.test(c) || /^original$/i.test(c));
      const hasOreo = strCells.some(c => /^oreo$/i.test(c));

      // Check if weekly model header (contains week and at least Ori and Oreo columns)
      if (hasWeek && hasOri && hasOreo) {
        headerIdx = r;
        isWeekly = true;
        break;
      }

      // Check if transaction header (contains both date and product in the SAME header row)
      if (hasDate && hasProd) {
        headerIdx = r;
        isTx = true;
        break;
      }
    }

    if (isWeekly && !weeklyRows) {
      const headers = grid[headerIdx].map(c => String(c || '').trim());
      const rows = [];
      for (let r = headerIdx + 1; r < grid.length; r++) {
        const rowData = grid[r];
        if (!rowData || rowData.length === 0) continue;
        const obj = {};
        let valid = false;
        headers.forEach((h, colIdx) => {
          if (h) {
            obj[h] = rowData[colIdx] !== undefined ? rowData[colIdx] : null;
            if (obj[h] !== null && obj[h] !== '') valid = true;
          }
        });
        if (valid) rows.push(obj);
      }
      if (rows.length > 0) {
        weeklyRows = rows;
        weeklySheetName = sName;
      }
    } else if (isTx) {
      const headers = grid[headerIdx].map(c => String(c || '').trim());
      const rows = [];
      for (let r = headerIdx + 1; r < grid.length; r++) {
        const rowData = grid[r];
        if (!rowData || rowData.length === 0) continue;
        const obj = {};
        let valid = false;
        headers.forEach((h, colIdx) => {
          if (h) {
            obj[h] = rowData[colIdx] !== undefined ? rowData[colIdx] : null;
            if (obj[h] !== null && obj[h] !== '') valid = true;
          }
        });
        if (valid) rows.push(obj);
      }
      if (rows.length > 0) {
        usedSheets.push(sName);
        allTransactionRows = allTransactionRows.concat(rows);
      }
    } else {
      // Check if matrix format
      const matrixRows = parseMatrixSheet(sheet, sName);
      if (matrixRows.length > 0) {
        usedSheets.push(sName);
        allTransactionRows = allTransactionRows.concat(matrixRows);
      }
    }
  }

  if (weeklyRows && weeklyRows.length > 0) {
    return {
      type: 'weekly',
      rows: weeklyRows,
      sheetName: weeklySheetName
    };
  }

  if (allTransactionRows.length > 0) {
    return {
      type: 'transactions',
      rows: allTransactionRows,
      usedSheets
    };
  }

  return null;
}

// Helper to extract options whether passed as object or string
function normalizeSplitOptions(options, defaultCutOff = '2026-08-01') {
  if (typeof options === 'string') {
    return { splitMode: 'date', splitRatio: 80, cutOffDate: options };
  }
  return {
    splitMode: options?.splitMode || 'ratio',
    splitRatio: options?.splitRatio !== undefined ? Number(options.splitRatio) : 80,
    cutOffDate: options?.cutOffDate || defaultCutOff
  };
}

// Shared partitioning helper for both initial upload and re-splitting
export function applyPartitioningToWeeklyList(weeklyList, options, isDefaultProposal = false) {
  const { splitMode, splitRatio, cutOffDate: rawCutOff } = normalizeSplitOptions(options);
  const totalWeeks = weeklyList.length;
  let effectiveCutOff = rawCutOff || '2026-08-01';

  if (isDefaultProposal) {
    const updated = weeklyList.map(w => {
      const isPartial = (w.t === 0 || w.t === 49);
      let fase = 'training';
      if (splitMode === 'date') {
        fase = w.minggu_selesai < effectiveCutOff ? 'training' : 'testing';
      } else if (splitRatio === 80) {
        fase = w.t <= 40 ? 'training' : 'testing';
      } else {
        const coreWeeks = 48;
        const trainLimit = Math.max(1, Math.min(coreWeeks - 1, Math.round((splitRatio / 100) * coreWeeks)));
        fase = w.t <= trainLimit ? 'training' : 'testing';
      }
      return { ...w, parsial: isPartial, fase };
    });

    const hasTest = updated.some(w => w.fase === 'testing' && !w.parsial);
    const hasTrain = updated.some(w => w.fase === 'training' && !w.parsial);
    if ((!hasTest || !hasTrain) && totalWeeks > 2) {
      const coreWeeks = 48;
      const trainLimit = Math.max(1, Math.min(coreWeeks - 1, Math.round((splitRatio / 100) * coreWeeks)));
      updated.forEach(w => {
        w.fase = w.t <= trainLimit ? 'training' : 'testing';
      });
    }

    const firstTest = updated.find(w => w.fase === 'testing' && !w.parsial);
    if (splitMode !== 'date' && firstTest) {
      effectiveCutOff = firstTest.minggu_mulai;
    }

    return { weeklyList: updated, effectiveCutOff };
  }

  // Non-default dataset: partition based on non-partial core weeks (preserve existing partial flags)
  const coreIndices = [];
  weeklyList.forEach((w, idx) => {
    if (!w.parsial) coreIndices.push(idx);
  });
  const effectiveCoreCount = coreIndices.length > 1 ? coreIndices.length : totalWeeks;
  const trainCoreTarget = Math.max(1, Math.min(effectiveCoreCount - 1, Math.round((splitRatio / 100) * effectiveCoreCount)));

  if (splitMode === 'date') {
    const minWeekStart = weeklyList[0]?.minggu_mulai || '';
    const maxWeekEnd = weeklyList[totalWeeks - 1]?.minggu_selesai || '';
    if (!effectiveCutOff || effectiveCutOff <= minWeekStart || effectiveCutOff >= maxWeekEnd) {
      const fallbackIdx = coreIndices.length > 1 ? coreIndices[trainCoreTarget] : trainCoreTarget;
      effectiveCutOff = weeklyList[fallbackIdx]?.minggu_mulai || weeklyList[0]?.minggu_mulai || '';
    }
  }

  let coreSeen = 0;
  let updated = weeklyList.map((w, idx) => {
    let fase = 'training';
    if (splitMode === 'date') {
      fase = w.minggu_selesai < effectiveCutOff ? 'training' : 'testing';
    } else if (coreIndices.length > 1) {
      if (w.parsial) {
        fase = idx === 0 ? 'training' : 'testing';
      } else {
        fase = coreSeen < trainCoreTarget ? 'training' : 'testing';
        coreSeen++;
      }
    } else {
      fase = idx < trainCoreTarget ? 'training' : 'testing';
    }
    return { ...w, fase };
  });

  // Guarantee at least 1 training and 1 testing non-partial week when possible
  const activeTrain = updated.filter(w => w.fase === 'training' && !w.parsial).length;
  const activeTest = updated.filter(w => w.fase === 'testing' && !w.parsial).length;
  if ((activeTrain === 0 || activeTest === 0) && totalWeeks > 1) {
    let cSeen = 0;
    updated = updated.map((w, idx) => {
      let fase = 'training';
      if (coreIndices.length > 1) {
        if (w.parsial) fase = idx === 0 ? 'training' : 'testing';
        else {
          fase = cSeen < trainCoreTarget ? 'training' : 'testing';
          cSeen++;
        }
      } else {
        fase = idx < trainCoreTarget ? 'training' : 'testing';
      }
      return { ...w, fase };
    });
  }

  const firstTest = updated.find(w => w.fase === 'testing' && !w.parsial) || updated.find(w => w.fase === 'testing');
  if (splitMode !== 'date' && firstTest) {
    effectiveCutOff = firstTest.minggu_mulai;
  }

  return { weeklyList: updated, effectiveCutOff };
}

// Process raw transaction rows into contiguous Saturday-Friday weekly bins
export function processRawTransactions(rawRows, splitConfig = '2026-08-01') {
  if (!rawRows || rawRows.length === 0) return null;

  const parsed = [];
  let unmatchedCount = 0;
  const unmatchedSamples = new Set();

  rawRows.forEach((row, idx) => {
    const keys = Object.keys(row);
    const dateKey = keys.find(k => /tanggal|tgl|date|waktu/i.test(k));
    const prodKey = keys.find(k => /produk|product|varian|menu|item|barang/i.test(k));
    const qtyKey = keys.find(k => /jumlah|qty|quantity|terjual|porsi|pcs|kuantitas/i.test(k));
    const notaKey = keys.find(k => /nota|invoice|transaksi|id|faktur/i.test(k));
    const sausKey = keys.find(k => /saus|sauce|topping/i.test(k));
    const sourceKey = keys.find(k => /sumber|source/i.test(k));
    const priceKey = keys.find(k => /harga|price|tarif|satuan/i.test(k));
    const waktuKey = keys.find(k => /^waktu$|^jam$|^time$/i.test(k));

    if (!dateKey || !prodKey) return;

    const d = parseAnyDate(row[dateKey]);
    if (!d) return;

    const rawProd = row[prodKey];
    const matchedProd = matchVariantName(rawProd);
    if (!matchedProd) {
      if (rawProd !== null && rawProd !== undefined && String(rawProd).trim() !== '') {
        unmatchedCount++;
        if (unmatchedSamples.size < 5) unmatchedSamples.add(String(rawProd).trim());
      }
      return;
    }

    let qty = 1;
    if (qtyKey && row[qtyKey] !== undefined && row[qtyKey] !== null && String(row[qtyKey]).trim() !== '') {
      const qNum = parseInt(String(row[qtyKey]).replace(/[^\d.-]/g, ''), 10);
      if (!isNaN(qNum)) {
        if (qNum <= 0) return; // Ignore zero or negative quantity rows instead of forcing 1
        qty = qNum;
      }
    }

    let price = (matchedProd === 'Ori' || matchedProd === 'Icing Sugar') ? 22000 : 25000;
    if (priceKey && row[priceKey] !== undefined && row[priceKey] !== null) {
      const pNum = parseFloat(String(row[priceKey]).replace(/[^\d.-]/g, ''));
      if (!isNaN(pNum) && pNum > 0) price = pNum;
    }

    let waktuStr = '19:30:00';
    if (waktuKey && row[waktuKey] !== undefined && row[waktuKey] !== null) {
      if (typeof row[waktuKey] === 'number') {
        const totalSec = Math.round(row[waktuKey] * 86400);
        const hr = String(Math.floor(totalSec / 3600)).padStart(2, '0');
        const mn = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
        const sc = String(totalSec % 60).padStart(2, '0');
        waktuStr = `${hr}:${mn}:${sc}`;
      } else {
        waktuStr = String(row[waktuKey]).trim();
      }
    }

    const nota = notaKey && row[notaKey] ? String(row[notaKey]) : `TRX-${idx + 1}`;
    const saus = sausKey && row[sausKey] ? String(row[sausKey]) : 'Saus Coklat';
    const source = sourceKey ? row[sourceKey] : null;

    parsed.push({
      nota,
      date: d,
      dateStr: formatDateOnly(d),
      product: matchedProd,
      qty,
      price,
      waktu: waktuStr,
      saus,
      source
    });
  });

  if (parsed.length === 0) return null;

  parsed.sort((a, b) => a.date - b.date);

  const minDate = parsed[0].date;
  const maxDate = parsed[parsed.length - 1].date;
  const minDateStr = formatDateOnly(minDate);
  const maxDateStr = formatDateOnly(maxDate);

  // Check if standard proposal dataset (2209 tx, 2025-10-23 to 2026-09-30)
  const isDefaultProposal = parsed.length === 2209 && minDateStr === '2025-10-23' && maxDateStr === '2026-09-30';

  // Find the starting Saturday on or before minDate
  const minDayOfWeek = minDate.getDay();
  const daysSinceSaturday = (minDayOfWeek + 1) % 7;
  const anchorMidnight = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() - daysSinceSaturday);
  const anchorTime = anchorMidnight.getTime();

  const maxMidnight = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()).getTime();
  const maxWeekIndex = Math.floor((maxMidnight - anchorTime) / (7 * 86400000));

  // Pre-create ALL contiguous weekly bins from week 0..maxWeekIndex (fills empty/holiday weeks with 0!)
  const weeklyMap = {};
  for (let wi = 0; wi <= maxWeekIndex; wi++) {
    const wStart = new Date(anchorMidnight.getFullYear(), anchorMidnight.getMonth(), anchorMidnight.getDate() + wi * 7);
    const wEnd = new Date(wStart.getFullYear(), wStart.getMonth(), wStart.getDate() + 6);
    weeklyMap[wi] = {
      t: isDefaultProposal ? wi : (wi + 1),
      minggu_mulai: formatDateOnly(wStart),
      minggu_selesai: formatDateOnly(wEnd),
      Ori: 0,
      Oreo: 0,
      'Icing Sugar': 0,
      'Red Velvet': 0,
      'Matcha Caramel': 0,
      total: 0,
      hariSet: new Set(),
      nonAsliCount: 0
    };
  }

  parsed.forEach(trx => {
    const trxMidnight = new Date(trx.date.getFullYear(), trx.date.getMonth(), trx.date.getDate()).getTime();
    const diffDays = Math.round((trxMidnight - anchorTime) / 86400000);
    const weekIndex = Math.floor(diffDays / 7);
    const wItem = weeklyMap[weekIndex];
    if (!wItem) return;

    if (wItem[trx.product] !== undefined) {
      wItem[trx.product] += trx.qty;
    }
    wItem.total += trx.qty;
    wItem.hariSet.add(trx.dateStr);
    if (trx.source) {
      wItem.nonAsliCount++;
    }
  });

  const rawWeeklyList = Object.values(weeklyMap)
    .sort((a, b) => a.t - b.t)
    .map(w => {
      const hari_transaksi = w.hariSet ? w.hariSet.size : 0;
      const baris_non_asli = w.nonAsliCount || 0;
      return {
        t: w.t,
        minggu_mulai: w.minggu_mulai,
        minggu_selesai: w.minggu_selesai,
        Ori: w.Ori,
        Oreo: w.Oreo,
        'Icing Sugar': w['Icing Sugar'],
        'Red Velvet': w['Red Velvet'],
        'Matcha Caramel': w['Matcha Caramel'],
        total: w.total,
        hari_transaksi,
        baris_non_asli,
        parsial: false
      };
    });

  // Detect partial edge weeks automatically for non-default datasets (only if >= 4 weeks total)
  if (!isDefaultProposal && rawWeeklyList.length >= 4) {
    const firstW = rawWeeklyList[0];
    const lastW = rawWeeklyList[rawWeeklyList.length - 1];
    // A full operating week is Saturday..Friday (6 days open, Monday closed).
    // If data starts after Sunday (minDateStr > Saturday+1) or ends before Thursday, or has < 4 active days, mark edge as partial.
    if (firstW.hari_transaksi < 4 && minDateStr > firstW.minggu_mulai) {
      firstW.parsial = true;
    }
    if (lastW.hari_transaksi < 4 && maxDateStr < lastW.minggu_selesai) {
      lastW.parsial = true;
    }
    // Re-index t so first non-partial week starts at t = 1 (and leading partial week is t = 0, matching proposal convention!)
    const offset = firstW.parsial ? 0 : 1;
    rawWeeklyList.forEach((w, idx) => {
      w.t = idx + offset;
    });
  }

  const { weeklyList, effectiveCutOff } = applyPartitioningToWeeklyList(
    rawWeeklyList,
    splitConfig,
    isDefaultProposal
  );

  // Map each individual transaction to its week and phase
  const rawTransactions = parsed.map((trx, idx) => {
    const week = weeklyList.find(wk => trx.dateStr >= wk.minggu_mulai && trx.dateStr <= wk.minggu_selesai);
    let fase = 'training';
    let weekT = weeklyList[0]?.t ?? 1;

    if (week) {
      fase = week.fase;
      weekT = week.t;
    } else {
      const firstTestingWeek = weeklyList.find(w => w.fase === 'testing');
      fase = (firstTestingWeek && trx.dateStr >= firstTestingWeek.minggu_mulai) ? 'testing' : 'training';
    }

    return {
      'No Nota': trx.nota || `TRX-${idx + 1}`,
      'Tanggal': trx.dateStr,
      'Waktu': trx.waktu || '19:30:00',
      'Nama Produk': trx.product,
      'Jenis Saus': trx.saus || 'Saus Coklat',
      'Jumlah Terjual': trx.qty,
      'Harga': trx.price,
      'Sumber Data': trx.source || null,
      'fase': fase,
      'weekT': weekT
    };
  });

  const trainWeeksCount = weeklyList.filter(w => w.fase === 'training' && !w.parsial).length;
  const testWeeksCount = weeklyList.filter(w => w.fase === 'testing' && !w.parsial).length;
  const trainTrxCount = rawTransactions.filter(r => r.fase === 'training').length;
  const testTrxCount = rawTransactions.filter(r => r.fase === 'testing').length;

  return {
    rawCount: rawTransactions.length,
    minDateStr,
    maxDateStr,
    trainWeeksCount,
    testWeeksCount,
    trainTrxCount,
    testTrxCount,
    weeklyList,
    rawTransactions,
    effectiveCutOffDate: effectiveCutOff,
    isDefaultProposal,
    isWeeklySource: false,
    unmatchedCount,
    unmatchedSamples: Array.from(unmatchedSamples)
  };
}

// Helper for case-insensitive key lookup in weekly rows
function getRowValByRegex(row, regex) {
  const key = Object.keys(row).find(k => regex.test(k.trim()));
  return key !== undefined ? row[key] : undefined;
}

// Process pre-aggregated weekly dataset (e.g. from hasil_pemodelan_churros.xlsx)
export function processWeeklyDataset(rawRows, splitConfig = '2026-08-01') {
  if (!rawRows || rawRows.length === 0) return null;

  const rawWeeklyList = rawRows.map((r, idx) => {
    const tVal = getRowValByRegex(r, /^t$|^minggu$|^week$|^minggu\s*\(t\)$/i);
    const t = tVal !== undefined && tVal !== null && tVal !== '' && !isNaN(Number(tVal))
      ? Number(tVal)
      : (idx + 1);

    let startRaw = getRowValByRegex(r, /minggu_mulai|mulai|start/i);
    let endRaw = getRowValByRegex(r, /minggu_selesai|selesai|end/i);

    let startStr = startRaw instanceof Date ? formatDateOnly(startRaw) : (parseAnyDate(startRaw) ? formatDateOnly(parseAnyDate(startRaw)) : String(startRaw || ''));
    let endStr = endRaw instanceof Date ? formatDateOnly(endRaw) : (parseAnyDate(endRaw) ? formatDateOnly(parseAnyDate(endRaw)) : String(endRaw || ''));

    const oriVal = Number(getRowValByRegex(r, /^ori$|^original$/i)) || 0;
    const oreoVal = Number(getRowValByRegex(r, /^oreo$/i)) || 0;
    const icingVal = Number(getRowValByRegex(r, /icing|sugar|gula/i)) || 0;
    const redVal = Number(getRowValByRegex(r, /red\s*velvet|velvet/i)) || 0;
    const matchaVal = Number(getRowValByRegex(r, /matcha|caramel|karamel/i)) || 0;
    const hariVal = getRowValByRegex(r, /hari_transaksi|hari/i);
    const nonAsliVal = getRowValByRegex(r, /baris_non_asli|non_asli/i);
    const parsialVal = getRowValByRegex(r, /parsial|partial/i);

    return {
      t,
      minggu_mulai: startStr,
      minggu_selesai: endStr,
      Ori: oriVal,
      Oreo: oreoVal,
      'Icing Sugar': icingVal,
      'Red Velvet': redVal,
      'Matcha Caramel': matchaVal,
      total: oriVal + oreoVal + icingVal + redVal + matchaVal,
      hari_transaksi: hariVal !== undefined && hariVal !== null ? Number(hariVal) : 6,
      baris_non_asli: nonAsliVal !== undefined && nonAsliVal !== null ? Number(nonAsliVal) : 0,
      parsial: Boolean(parsialVal === true || String(parsialVal).toLowerCase() === 'true' || parsialVal === 1)
    };
  });

  const totalWeeks = rawWeeklyList.length;
  const isDefaultProposal = totalWeeks === 50 && rawWeeklyList[0]?.minggu_mulai === '2025-10-18';

  const { weeklyList, effectiveCutOff } = applyPartitioningToWeeklyList(
    rawWeeklyList,
    splitConfig,
    isDefaultProposal
  );

  const trainWeeksCount = weeklyList.filter(w => w.fase === 'training' && !w.parsial).length;
  const testWeeksCount = weeklyList.filter(w => w.fase === 'testing' && !w.parsial).length;

  return {
    rawCount: weeklyList.reduce((s, w) => s + w.Ori + w.Oreo + w['Icing Sugar'] + w['Red Velvet'] + w['Matcha Caramel'], 0),
    minDateStr: weeklyList[0]?.minggu_mulai || '',
    maxDateStr: weeklyList[weeklyList.length - 1]?.minggu_selesai || '',
    trainWeeksCount,
    testWeeksCount,
    trainTrxCount: null,
    testTrxCount: null,
    weeklyList,
    rawTransactions: [],
    effectiveCutOffDate: effectiveCutOff,
    isDefaultProposal,
    isWeeklySource: true,
    unmatchedCount: 0,
    unmatchedSamples: []
  };
}

// Compute dynamic models for the 5 variants from weeklyList
export function trainModelsFromWeekly(weeklyList) {
  let trainingWeeks = weeklyList.filter(w => w.fase === 'training' && !w.parsial);
  let testingWeeks = weeklyList.filter(w => w.fase === 'testing' && !w.parsial);

  // Fallback if no filtered weeks
  if (trainingWeeks.length === 0) {
    trainingWeeks = weeklyList.slice(0, Math.max(1, Math.floor(weeklyList.length * 0.8)));
  }
  if (testingWeeks.length === 0) {
    testingWeeks = weeklyList.slice(Math.max(1, Math.floor(weeklyList.length * 0.8)));
  }

  const models = {};
  const evaluations = [];

  const xTrain = trainingWeeks.map(w => w.t);
  const xTest = testingWeeks.map(w => w.t);

  VARIANT_KEYS.forEach(vKey => {
    const yTrain = trainingWeeks.map(w => w[vKey] || 0);
    const yTestAct = testingWeeks.map(w => w[vKey] || 0);

    const ols = calculateOLS(xTrain, yTrain);

    // Predict testing
    const yTestPred = xTest.map(t => Math.max(0, ols.b0 + ols.b1 * t));
    const metrics = computeMetrics(yTestAct, yTestPred);

    // Baseline: simple mean of training
    const yBaselinePred = xTest.map(() => Math.max(0, ols.yMean));
    const baselineMetrics = computeMetrics(yTestAct, yBaselinePred);

    const totalAct = yTestAct.reduce((a, b) => a + b, 0);
    const totalPred = Number(yTestPred.reduce((a, b) => a + b, 0).toFixed(1));

    models[vKey] = {
      b0: Number(ols.b0.toFixed(4)),
      b1: Number(ols.b1.toFixed(4)),
      r2: Number(ols.r2.toFixed(4)),
      yMean: Number(ols.yMean.toFixed(3)),
      formula: `y = max(0, ${ols.b0.toFixed(4)} ${ols.b1 >= 0 ? '+' : '-'} ${Math.abs(ols.b1).toFixed(4)} * t)`
    };

    evaluations.push({
      Varian: vKey,
      'Total aktual testing': totalAct,
      'Total prediksi testing': totalPred,
      MAE: Number(metrics.mae.toFixed(3)),
      RMSE: Number(metrics.rmse.toFixed(3)),
      MAE_pembanding_rata2_training: Number(baselineMetrics.mae.toFixed(3)),
      RMSE_pembanding_rata2_training: Number(baselineMetrics.rmse.toFixed(3))
    });
  });

  return { models, evaluations };
}
