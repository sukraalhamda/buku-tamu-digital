import React, { useState, useMemo } from 'react';
import { History, Search, Download, RefreshCw, Calendar, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';
import Input from '../components/Input';
import Button from '../components/Button';
import GuestTable from '../components/GuestTable';
import DetailKunjunganPage from './DetailKunjunganPage';
import Loading from '../components/Loading';

export default function HistoryPage({
  visits = [],
  loading = false,
  refreshVisits,
  onNavigate,
  showToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [exportMonth, setExportMonth] = useState(() => new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredVisits = useMemo(() => {
    return visits.filter(visit => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = visit.nama?.toLowerCase().includes(q);
        const matchInstansi = visit.instansi?.toLowerCase().includes(q);
        const matchId = visit.idKunjungan?.toLowerCase().includes(q);
        const matchKeterangan = visit.keterangan?.toLowerCase().includes(q);
        if (!matchName && !matchInstansi && !matchId && !matchKeterangan) return false;
      }

      if (statusFilter !== 'ALL') {
        const statusNorm = (visit.status || '').toUpperCase();
        if (statusFilter === 'SEDANG BERKUNJUNG') {
          if (statusNorm !== 'SEDANG BERKUNJUNG' && statusNorm !== 'CHECK-IN') return false;
        } else if (statusFilter === 'SELESAI') {
          if (statusNorm !== 'SELESAI') return false;
        }
      }

      return true;
    });
  }, [visits, searchQuery, statusFilter]);

  const handleExportExcel = () => {
    if (!exportMonth) {
      showToast('Pilih bulan untuk export rekapan', 'warning');
      return;
    }
    const [y, m] = exportMonth.split('-').map(Number);
    const monthData = visits.filter(v => {
      if (!v.jamKunjungan) return false;
      const d = new Date(v.jamKunjungan);
      return d.getFullYear() === y && d.getMonth() + 1 === m;
    });
    if (monthData.length === 0) {
      showToast(`Tidak ada data kunjungan di bulan ${exportMonth}`, 'warning');
      return;
    }

    const headers = ['ID Kunjungan', 'Nama Tamu', 'Instansi/Perusahaan', 'Jam Kunjungan', 'Jam Keluar', 'Durasi', 'Status', 'Keterangan'];
    const data = monthData.map(v => [
      v.idKunjungan || '',
      v.nama || '',
      v.instansi || '',
      v.jamKunjungan ? new Date(v.jamKunjungan).toLocaleString('id-ID') : '',
      v.jamKeluar ? new Date(v.jamKeluar).toLocaleString('id-ID') : '-',
      v.durasi || '-',
      v.status || '',
      v.keterangan || '',
    ]);

    // Rekapan baris ringkasan di bawah data
    const totalSelesai = monthData.filter(v => (v.status || '').toUpperCase() === 'SELESAI').length;
    const totalAktif = monthData.length - totalSelesai;
    const summaryRows = [
      [],
      ['REKAPAN BULAN', exportMonth],
      ['Total Kunjungan', monthData.length],
      ['Selesai', totalSelesai],
      ['Sedang Berkunjung', totalAktif],
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data, ...summaryRows]);
    ws['!cols'] = [
      { wch: 16 }, { wch: 22 }, { wch: 24 },
      { wch: 20 }, { wch: 20 }, { wch: 14 }, { wch: 18 }, { wch: 30 },
    ];
    // Header style
    headers.forEach((_, colIdx) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
      if (!ws[cellRef]) return;
      ws[cellRef].s = {
        fill: { patternType: 'solid', fgColor: { rgb: '073B5C' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: '0E689B' } },
          bottom: { style: 'thin', color: { rgb: '0E689B' } },
          left: { style: 'thin', color: { rgb: '0E689B' } },
          right: { style: 'thin', color: { rgb: '0E689B' } },
        },
      };
    });
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }) };

    const monthLabel = new Date(y, m - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).replace(/ /g, '_');
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Rekapan ${exportMonth}`);
    XLSX.writeFile(wb, `rekapan_buku_tamu_${exportMonth}_${monthLabel}.xlsx`);
    showToast(`Rekapan ${monthLabel} berhasil diunduh (${monthData.length} data)`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3" style={{ color: 'var(--text-heading)' }}>
            <History className="w-8 h-8 text-[#073B5C] dark:text-sky-400" />
            <span>Riwayat Kunjungan Tamu</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Arsip lengkap seluruh log kunjungan tamu
          </p>
        </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)' }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input
                type="month"
                value={exportMonth}
                onChange={(e) => setExportMonth(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Pilih bulan rekapan"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={refreshVisits}
            >
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportExcel}
            >
              Unduh Excel
            </Button>
          </div>
        </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
      >
        <div className="flex-1 w-full">
          <Input
            placeholder="Cari Riwayat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium border"
            style={{ backgroundColor: 'var(--bg-card-deep)', color: 'var(--text-primary)', borderColor: 'var(--border-primary)' }}
          >
            <option value="ALL">Semua Status</option>
            <option value="SEDANG BERKUNJUNG">Sedang Berkunjung</option>
            <option value="SELESAI">Selesai</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loading text="Memuat riwayat kunjungan..." />
      ) : (
        <GuestTable
          visits={filteredVisits}
          onSelectVisit={(visit) => {
            setSelectedVisit(visit);
            setIsDetailOpen(true);
          }}
          onQuickCheckout={(visit) => onNavigate('checkout', { idKunjungan: visit.idKunjungan })}
        />
      )}

      {/* Modal Detail */}
      <DetailKunjunganPage
        visit={selectedVisit}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onQuickCheckout={(visit) => onNavigate('checkout', { idKunjungan: visit.idKunjungan })}
      />
    </div>
  );
}
