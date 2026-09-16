import React from 'react';
import { User, Building2, Clock, FileText, Printer, LogOut, CheckCircle, Shield } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { formatDateTime } from '../utils/formatters';

export default function DetailKunjunganPage({
  visit,
  isOpen,
  onClose,
  onQuickCheckout
}) {
  if (!visit) return null;

  const isCompleted = visit.status === 'SELESAI';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail Kunjungan: ${visit.idKunjungan}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 printable-badge">
        
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div>
            <span className="text-[10px] font-mono text-[#073B5C] dark:text-sky-400 font-bold block uppercase tracking-widest">
              SISTEM BUKU TAMU DIGITAL
            </span>
            <h3 className="text-xl font-black" style={{ color: 'var(--text-heading)' }}>{visit.nama}</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{visit.instansi}</p>
          </div>
          <StatusBadge status={visit.status} size="lg" />
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)' }}>
            <span className="text-[10px] font-semibold block uppercase" style={{ color: 'var(--text-muted)' }}>Waktu Masuk</span>
            <p className="font-mono text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{formatDateTime(visit.jamKunjungan)}</p>
          </div>

          <div className="p-4 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)' }}>
            <span className="text-[10px] font-semibold block uppercase" style={{ color: 'var(--text-muted)' }}>Waktu Keluar</span>
            <p className={`font-mono text-xs font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 italic'}`}>
              {isCompleted ? formatDateTime(visit.jamKeluar) : 'Belum Keluar'}
            </p>
          </div>

          <div className="p-4 rounded-2xl border space-y-1" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)' }}>
            <span className="text-[10px] font-semibold block uppercase" style={{ color: 'var(--text-muted)' }}>Durasi Kunjungan</span>
            <p className="font-mono text-xs font-bold text-[#073B5C] dark:text-sky-400">{visit.durasi || '-'}</p>
          </div>
        </div>

        {/* Detailed Info Section */}
        <div className="space-y-3 p-5 rounded-2xl border text-xs" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)' }}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <span className="text-[10px] block uppercase font-medium" style={{ color: 'var(--text-muted)' }}>Tanggal Dibuat</span>
              <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatDateTime(visit.createdAt)}</span>
            </div>
          </div>

          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-[10px] block uppercase font-medium" style={{ color: 'var(--text-muted)' }}>Keterangan / Keperluan Kunjungan</span>
            <p className="mt-1 leading-relaxed p-3 rounded-xl border font-medium" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}>
              {visit.keterangan || '-'}
            </p>
          </div>
        </div>

        {/* Dual Signature Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Tanda Tangan Masuk */}
          <div className="p-4 rounded-2xl border space-y-2 text-center" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)' }}>
            <span className="text-xs font-semibold block" style={{ color: 'var(--text-secondary)' }}>
              ✍️ Tanda Tangan Saat Check-In
            </span>
            <div className="h-32 rounded-xl border p-2 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              {visit.tandaTangan ? (
                <img src={visit.tandaTangan} alt="Tanda Tangan Check-In" className="max-h-full object-contain" />
              ) : (
                <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>Tidak ada gambar</span>
              )}
            </div>
          </div>

          {/* Tanda Tangan Keluar */}
          <div className="p-4 rounded-2xl border space-y-2 text-center" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)' }}>
            <span className="text-xs font-semibold block" style={{ color: 'var(--text-secondary)' }}>
              ✍️ Tanda Tangan Saat Check-Out
            </span>
            <div className="h-32 rounded-xl border p-2 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              {visit.tandaTanganKeluar ? (
                <img src={visit.tandaTanganKeluar} alt="Tanda Tangan Check-Out" className="max-h-full object-contain" />
              ) : (
                <span className="text-xs italic flex items-center gap-1 justify-center h-full" style={{ color: 'var(--text-muted)' }}>
                  Belum melakukan check-out
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800 no-print">
          <Button
            variant="outline"
            size="md"
            icon={Printer}
            onClick={() => window.print()}
          >
            Cetak Rekap Kunjungan
          </Button>

          <div className="flex items-center gap-2">
            {!isCompleted && onQuickCheckout && (
              <Button
                variant="danger"
                size="md"
                icon={LogOut}
                onClick={() => {
                  onClose();
                  onQuickCheckout(visit);
                }}
              >
                Check-Out Sekarang
              </Button>
            )}

            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              Tutup
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
}
