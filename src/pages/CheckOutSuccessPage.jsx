import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck, Building2, User, FileText } from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { formatDateTime } from '../utils/formatters';

export default function CheckOutSuccessPage({ visit, onNavigate }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  }, []);

  if (!visit) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-400">Tidak ada data check-out.</p>
        <Button onClick={() => onNavigate('welcome')}>Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Top Success Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-xl shadow-emerald-950/50 mb-2">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Check-Out Berhasil & Kunjungan Selesai!
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Terima kasih atas kunjungan Anda. Hati-hati di jalan!
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header Summary */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-sky-400 font-bold block uppercase tracking-wider">
              {visit.idKunjungan}
            </span>
            <h3 className="text-lg font-bold text-white">Ringkasan Kunjungan</h3>
          </div>
          <StatusBadge status="SELESAI" />
        </div>

        {/* Duration Highlights Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 border border-emerald-500/30 text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Total Durasi Kunjungan
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
            ⏱ {visit.durasi || '-'}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block uppercase font-medium">Nama Tamu</span>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-400" />
              <span>{visit.nama}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block uppercase font-medium">Instansi / Perusahaan</span>
            <p className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>{visit.instansi}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block uppercase font-medium">Jam Kunjungan Masuk</span>
            <p className="font-mono text-slate-300">{formatDateTime(visit.jamKunjungan)}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block uppercase font-medium">Jam Kunjungan Keluar</span>
            <p className="font-mono text-emerald-400 font-semibold">{formatDateTime(visit.jamKeluar)}</p>
          </div>
        </div>

        {/* Dual Signature Showcase */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block">Tanda Tangan Masuk</span>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 h-20 flex items-center justify-center">
              {visit.tandaTangan ? (
                <img src={visit.tandaTangan} alt="Tanda Tangan Masuk" className="h-full object-contain" />
              ) : (
                <span className="text-xs text-slate-600 italic">Tidak ada</span>
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block">Tanda Tangan Keluar</span>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 h-20 flex items-center justify-center">
              {visit.tandaTanganKeluar ? (
                <img src={visit.tandaTanganKeluar} alt="Tanda Tangan Keluar" className="h-full object-contain" />
              ) : (
                <span className="text-xs text-slate-600 italic">Tidak ada</span>
              )}
            </div>
          </div>
        </div>

      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full font-bold shadow-xl shadow-sky-500/25"
        onClick={() => onNavigate('welcome')}
        icon={ArrowRight}
      >
        Selesai & Kembali ke Beranda
      </Button>
    </div>
  );
}
