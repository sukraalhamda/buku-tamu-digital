import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Printer, ArrowRight, Building2, User, Clock, FileText, ShieldAlert, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { formatDateTime } from '../utils/formatters';

export default function CheckInSuccessPage({ visit, onNavigate, showToast }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect unavailable', e);
    }
  }, []);

  if (!visit) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-400">Tidak ada data check-in aktif.</p>
        <Button onClick={() => onNavigate('welcome')}>Kembali ke Beranda</Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-2">
      {/* Top Banner */}
      <div className="text-center space-y-2 no-print">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#073B5C] border border-[#0E689B] text-sky-300 shadow-xl shadow-[#073B5C]/40 mb-2">
          <CheckCircle2 className="w-9 h-9 animate-pulse text-emerald-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
          Registrasi Kunjungan Berhasil!
        </h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          Tunjukkan bukti digital ini kepada petugas security sebelum memasuki area perusahaan.
        </p>
      </div>

      {/* Printable Visitor Registration Proof Card (PRD Section 9) */}
      <div className="printable-badge rounded-3xl bg-gradient-to-b from-[#0A527E] via-[#073B5C] to-[#042338] border-2 border-[#0E689B] p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-sky-400 to-[#0E689B]" />
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* MANDATORY BANNER - MOVED TO TOP */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white text-center font-black text-sm sm:text-base tracking-wider uppercase shadow-xl border-2 border-sky-300 animate-pulse">
          TUNJUKKAN HALAMAN INI KEPADA SECURITY
        </div>

        {/* Card Header Title */}
        <div className="text-center space-y-1 pb-4 border-b border-sky-400/30">
          <span className="text-[11px] font-bold text-sky-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            BUKU TAMU DIGITAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">
            KUNJUNGAN BERHASIL
          </h2>
        </div>

        {/* Data Details List (PRD Specification) */}
        <div className="space-y-4 text-left px-2 sm:px-6">
          <div className="p-3.5 rounded-2xl bg-[#042338]/90 border border-sky-500/30 flex items-start gap-3">
            <User className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider block">Nama:</span>
              <span className="text-lg font-black text-white">{visit.nama}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#042338]/90 border border-sky-500/30 flex items-start gap-3">
            <Building2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider block">Instansi:</span>
              <span className="text-base font-bold text-slate-200">{visit.instansi}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#042338]/90 border border-sky-500/30 flex items-start gap-3">
            <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider block">Jam Kunjungan:</span>
              <span className="text-sm font-bold font-mono text-slate-200">{formatDateTime(visit.jamKunjungan)}</span>
            </div>
          </div>
        </div>

        {/* Signature Thumbnail */}
        {visit.tandaTangan && (
          <div className="pt-3 border-t border-sky-400/30 flex items-center justify-between text-xs px-2">
            <span className="text-sky-300 text-[10px] uppercase font-semibold">Tanda Tangan Pengunjung:</span>
            <div className="bg-[#042338] p-1 rounded-lg border border-sky-500/40">
              <img src={visit.tandaTangan} alt="Tanda Tangan" className="h-9 object-contain max-w-[130px]" />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 no-print">
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:flex-1 font-bold shadow-xl shadow-[#073B5C]/40"
          onClick={handlePrint}
          icon={Printer}
        >
          Cetak / Simpan Bukti Kunjungan
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="w-full sm:flex-1"
          onClick={() => onNavigate('welcome')}
          icon={ArrowRight}
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
