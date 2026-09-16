import * as XLSX from 'xlsx';

/**
 * Export visits data to a formatted Excel (.xlsx) file
 * with BMS Besmindo branding and styled header row.
 */
export function exportToExcel(visits, filename = 'buku_tamu_besmindo') {
  if (!visits || visits.length === 0) return false;

  const today = new Date().toISOString().slice(0, 10);

  // Build rows
  const header = [
    'ID Kunjungan',
    'Nama Tamu',
    'Instansi / Perusahaan',
    'No. Telepon',
    'Jam Kunjungan (Masuk)',
    'Jam Keluar',
    'Durasi',
    'Status',
    'Keterangan / Keperluan',
  ];

  const rows = visits.map((v) => [
    v.idKunjungan || '',
    v.nama || '',
    v.instansi || '',
    v.telepon || '',
    v.jamKunjungan ? new Date(v.jamKunjungan).toLocaleString('id-ID') : '',
    v.jamKeluar ? new Date(v.jamKeluar).toLocaleString('id-ID') : '-',
    v.durasi || '-',
    v.status || '',
    v.keterangan || '',
  ]);

  // Title rows (metadata)
  const titleRows = [
    ['REKAP BUKU TAMU DIGITAL'],
    ['Buku Tamu Digital'],
    [`Tanggal Export: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`],
    [`Total Data: ${visits.length} Kunjungan`],
    [], // blank row
    header,
    ...rows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(titleRows);

  // === Column Widths ===
  ws['!cols'] = [
    { wch: 24 }, // ID Kunjungan
    { wch: 26 }, // Nama Tamu
    { wch: 30 }, // Instansi
    { wch: 18 }, // Telepon
    { wch: 22 }, // Jam Masuk
    { wch: 22 }, // Jam Keluar
    { wch: 14 }, // Durasi
    { wch: 20 }, // Status
    { wch: 40 }, // Keterangan
  ];

  // === Cell Styles ===
  // Title cell styling (A1)
  const titleStyle = {
    font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '073B5C' } },
    alignment: { horizontal: 'center', vertical: 'center' },
  };

  // Company name cell (A2)
  const subtitleStyle = {
    font: { bold: true, sz: 12, color: { rgb: 'E0F2FE' } },
    fill: { fgColor: { rgb: '0E689B' } },
    alignment: { horizontal: 'center' },
  };

  // Metadata cells (A3, A4)
  const metaStyle = {
    font: { sz: 10, color: { rgb: '0F2942' } },
    fill: { fgColor: { rgb: 'EFF6FF' } },
  };

  // Header row styling (row 6 = index 5)
  const headerStyle = {
    font: { bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '073B5C' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      bottom: { style: 'medium', color: { rgb: '0E689B' } },
    },
  };

  // Data row — even
  const evenRowStyle = {
    font: { sz: 10, color: { rgb: '0F2942' } },
    fill: { fgColor: { rgb: 'F8FAFC' } },
    alignment: { vertical: 'center' },
  };

  // Data row — odd
  const oddRowStyle = {
    font: { sz: 10, color: { rgb: '0F2942' } },
    fill: { fgColor: { rgb: 'EFF6FF' } },
    alignment: { vertical: 'center' },
  };

  // ID Kunjungan cell style (navy monospace)
  const idStyle = {
    font: { bold: true, sz: 10, color: { rgb: '073B5C' } },
    fill: { fgColor: { rgb: 'DBEAFE' } },
  };

  // Apply title styles
  if (ws['A1']) ws['A1'].s = titleStyle;
  if (ws['A2']) ws['A2'].s = subtitleStyle;
  if (ws['A3']) ws['A3'].s = metaStyle;
  if (ws['A4']) ws['A4'].s = metaStyle;

  // Merge title cells across all 9 columns (A–I)
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Row 1: REKAP BUKU TAMU
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }, // Row 2: PT Besmindo
    { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } }, // Row 3: Tanggal
    { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } }, // Row 4: Total Data
  ];

  // Apply header row styles (row index 5 = "row 6")
  const headerRowIdx = 5;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  cols.forEach((col) => {
    const cellRef = `${col}${headerRowIdx + 1}`;
    if (ws[cellRef]) ws[cellRef].s = headerStyle;
  });

  // Apply data row styles
  rows.forEach((row, rowIdx) => {
    const sheetRowIdx = headerRowIdx + 1 + rowIdx; // 0-based row in sheet
    const isEven = rowIdx % 2 === 0;
    cols.forEach((col, colIdx) => {
      const cellRef = `${col}${sheetRowIdx + 1}`;
      if (ws[cellRef]) {
        if (colIdx === 0) {
          ws[cellRef].s = idStyle; // ID column
        } else {
          ws[cellRef].s = isEven ? evenRowStyle : oddRowStyle;
        }
      }
    });
  });

  // Freeze header row
  ws['!freeze'] = { xSplit: 0, ySplit: headerRowIdx + 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Kunjungan');

  // Write file
  XLSX.writeFile(wb, `${filename}_${today}.xlsx`);
  return true;
}
