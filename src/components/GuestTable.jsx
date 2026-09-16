import React from 'react';
import { Eye, LogOut, FileText, Calendar, Building2, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { formatDateTime } from '../utils/formatters';

export default function GuestTable({
  visits = [],
  onSelectVisit,
  onQuickCheckout,
  showCheckoutBtn = true
}) {
  if (!visits || visits.length === 0) {
    return (
      <div
        className="guest-table-wrap flex flex-col items-center justify-center py-16 px-4 rounded-2xl border text-center"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
      >
        <FileText className="w-12 h-12 mb-3" style={{ color: 'var(--text-muted)' }} />
        <h4 className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>Belum Ada Data Kunjungan</h4>
        <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Tidak ditemukan catatan kunjungan tamu yang sesuai dengan pencarian atau filter Anda.
        </p>
      </div>
    );
  }

  return (
    <div
      className="guest-table-wrap w-full overflow-x-auto rounded-2xl border shadow-xl"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
    >
      <table className="w-full text-left text-sm border-collapse">
        <thead style={{ backgroundColor: 'var(--bg-card-deep)', borderBottom: '1px solid var(--border-primary)' }}>
          <tr>
            <th className="py-4 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>ID Kunjungan</th>
            <th className="py-4 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Nama Tamu</th>
            <th className="py-4 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Instansi / Perusahaan</th>
            <th className="py-4 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Waktu Masuk</th>
            <th className="py-4 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Waktu Keluar / Durasi</th>
            <th className="py-4 px-4 text-xs font-semibold uppercase tracking-wider text-center" style={{ color: 'var(--text-secondary)' }}>Status</th>
            <th className="py-4 px-4 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--text-secondary)' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => {
            const isCompleted = visit.status === 'SELESAI';

            return (
              <tr
                key={visit.idKunjungan}
                className="guest-table-row transition-colors duration-150"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                {/* ID Kunjungan */}
                <td className="py-4 px-4 font-mono font-bold whitespace-nowrap" style={{ color: 'var(--id-kunjungan)' }}>
                  {visit.idKunjungan}
                </td>

                {/* Nama Tamu */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--text-heading)' }}>
                    <User className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <span>{visit.nama}</span>
                  </div>
                  {visit.telepon && (
                    <span className="text-[11px] pl-6 block font-mono font-medium" style={{ color: 'var(--text-muted)' }}>
                      {visit.telepon}
                    </span>
                  )}
                </td>

                {/* Instansi */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <Building2 className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <span>{visit.instansi}</span>
                  </div>
                </td>

                {/* Jam Kunjungan */}
                <td className="py-4 px-4 whitespace-nowrap text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <span>{formatDateTime(visit.jamKunjungan)}</span>
                  </div>
                </td>

                {/* Jam Keluar & Durasi */}
                <td className="py-4 px-4 whitespace-nowrap text-xs">
                  {isCompleted ? (
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {formatDateTime(visit.jamKeluar)}
                      </div>
                      <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--emerald-durasi)' }}>
                        ⏱ {visit.durasi}
                      </span>
                    </div>
                  ) : (
                    <span className="italic font-medium" style={{ color: 'var(--text-muted)' }}>Masih berkunjung...</span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <StatusBadge status={visit.status} size="sm" />
                </td>

                {/* Action buttons */}
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => onSelectVisit && onSelectVisit(visit)}
                    >
                      Detail
                    </Button>

                    {showCheckoutBtn && !isCompleted && onQuickCheckout && (
                      <Button
                        variant="danger"
                        size="sm"
                        icon={LogOut}
                        onClick={() => onQuickCheckout(visit)}
                      >
                        Check-Out
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
