import React, { useState, useEffect, useCallback } from 'react';
import { QrCode, UserPlus, LogOut, ArrowRight, Sparkles, CheckCircle2, Copy, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Button from '../components/Button';
import AutocompleteInput from '../components/AutocompleteInput';
import Modal from '../components/Modal';
import SignaturePad from '../components/SignaturePad';
import LiveClockDisplay from '../components/LiveClockDisplay';
import useLiveClock from '../hooks/useLiveClock';
import { searchActiveVisits, checkOutGuest } from '../services/apiService';
import { formatDateTime } from '../utils/formatters';

export default function WelcomePage({ onNavigate, showToast, refreshVisits }) {
  const clock = useLiveClock();
  const [quickCheckoutName, setQuickCheckoutName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [checkoutSuccessData, setCheckoutSuccessData] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [tandaTanganKeluar, setTandaTanganKeluar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentAppUrl = window.location.href;
  const checkInDirectUrl = `${window.location.origin}${window.location.pathname}#checkin`;
  const n8nBaseUrl = import.meta.env.VITE_N8N_BASE_URL;

  // Debounced search for active visitors
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (quickCheckoutName.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await searchActiveVisits(quickCheckoutName);
          setSuggestions(results);
        } catch (err) {
          console.error('Error searching active visits:', err);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [quickCheckoutName]);

  const handleQuickCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!quickCheckoutName.trim()) {
      showToast('Masukkan Nama Anda', 'warning');
      return;
    }
    // Search and show checkout modal instead of navigating
    handleSearchAndCheckout(quickCheckoutName.trim());
  };

  const handleSearchAndCheckout = async (name) => {
    setIsSearching(true);
    try {
      const results = await searchActiveVisits(name);
      if (results && results.length > 0) {
        if (results.length === 1) {
          // Directly select if only 1 result
          setSelectedVisit(results[0]);
          setShowCheckoutModal(true);
          showToast(`Data kunjungan ${results[0].nama} ditemukan!`, 'success');
        } else {
          // Show dropdown to select
          showToast(`Ditemukan ${results.length} pengunjung. Pilih dari dropdown.`, 'info');
        }
      } else {
        showToast(`Pengunjung "${name}" tidak ditemukan atau sudah check-out.`, 'error');
      }
    } catch (err) {
      showToast('Gagal mencari data: ' + err.message, 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuickCheckoutName(suggestion.nama);
    setSuggestions([]);
    // Show checkout modal instead of navigating
    setSelectedVisit(suggestion);
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async () => {
    if (!selectedVisit) return;
    
    if (selectedVisit.status === 'SELESAI') {
      showToast('Kunjungan ini sudah SELESAI.', 'warning');
      return;
    }
    if (!tandaTanganKeluar || !tandaTanganKeluar.trim()) {
      showToast('Tanda tangan saat keluar wajib diisi.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await checkOutGuest({
        idKunjungan: selectedVisit.idKunjungan,
        jamKeluar: clock.isoValue,
        tandaTanganKeluar: tandaTanganKeluar
      });

      if (result.success) {
        showToast(result.message, result.viaN8n ? 'success' : 'info');
        if (refreshVisits) await refreshVisits();
        
        // Close modal and show success view
        setShowCheckoutModal(false);
        setCheckoutSuccessData(result.data);
        setShowCheckoutSuccess(true);
        
        // Reset form
        setSelectedVisit(null);
        setQuickCheckoutName('');
        setTandaTanganKeluar('');
      } else {
        showToast(result.message || 'Gagal memproses check-out', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat check-out: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    showToast('Tautan web berhasil disalin ke clipboard!', 'success');
  };

  return (
    <div className="space-y-10 py-4 animate-fade-in">

      {/* Hero Section — BMS Navy gradient (constant across themes) */}
      <div className="welcome-hero-card relative overflow-hidden rounded-3xl border border-[#0E689B]/50 p-8 sm:p-12 shadow-2xl" style={{ background: 'linear-gradient(135deg, #073B5C 0%, #042338 60%, #031c30 100%)' }}>
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-[#073B5C]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#073B5C] border border-[#0E689B]/60 text-sky-200 text-xs font-bold tracking-wide uppercase shadow-md">
            <span>Selamat Datang Non-Karyawan & Tamu Industri</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Buku Tamu Digital
          </h1>

          <p className="text-sky-100/80 text-sm sm:text-base leading-relaxed">
            Sistem pencatatan kunjungan mandiri untuk keamanan, transparansi, dan efisiensi operasional.
            Silakan lakukan registrasi Check-In saat tiba dan Check-Out saat selesai berkunjung.
          </p>

          {/* n8n Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#031522]/90 border border-[#0E689B]/40 text-xs font-mono">
            <span className={`w-2.5 h-2.5 rounded-full ${n8nBaseUrl ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className="text-slate-400">Status Middleware n8n:</span>
            <span className={n8nBaseUrl ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {n8nBaseUrl ? 'Terkoneksi (n8n Webhook Live)' : 'Standby / Local Storage Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1: Check-In */}
        <div
          className="action-card group relative overflow-hidden rounded-3xl p-8 shadow-xl transition-all duration-300 flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#073B5C]/15 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#073B5C] border border-[#0E689B] flex items-center justify-center text-sky-300 shadow-lg group-hover:bg-[#0A527E] transition-colors duration-300">
              <UserPlus className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold transition-colors" style={{ color: 'var(--text-heading)' }}>
                Check-In Tamu Baru
              </h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Pengunjung baru yang tiba di lokasi wajib mengisi form kunjungan &amp; tanda tangan digital.
              </p>
            </div>

            <ul className="space-y-2 pt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {['Isi Nama, Instansi/Perusahaan, & Tujuan', 'Sertakan Tanda Tangan Canvas Smartphone'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <Button variant="primary" size="lg" className="w-full text-base font-bold" onClick={() => onNavigate('checkin')} icon={ArrowRight}>
              Mulai Check-In Tamu
            </Button>
          </div>
        </div>

        {/* Card 2: Check-Out */}
        <div
          className="action-card group relative overflow-hidden rounded-3xl p-8 shadow-xl transition-all duration-300 flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
              <LogOut className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold transition-colors" style={{ color: 'var(--text-heading)' }}>
                Check-Out Tamu
              </h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Tamu yang akan meninggalkan lokasi wajib melakukan check-out untuk pencatatan jam keluar & durasi kunjungan.
              </p>
            </div>

            <form onSubmit={handleQuickCheckoutSubmit} className="space-y-3 pt-2">
              <AutocompleteInput
                label="Masukkan Nama Anda"
                name="quickCheckoutName"
                placeholder="Cari Nama Anda"
                value={quickCheckoutName}
                onChange={(e) => setQuickCheckoutName(e.target.value)}
                suggestions={suggestions}
                onSelect={handleSelectSuggestion}
                isLoading={isSearching}
                required={false}
              />
              <Button type="submit" variant="danger" size="lg" className="w-full text-base font-bold" icon={LogOut}>
                Proses Check-Out
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div
        className="qr-section-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl transition-all duration-300"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#073B5C] border border-[#0E689B] flex items-center justify-center text-sky-300 shrink-0 shadow-md">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold" style={{ color: 'var(--text-heading)' }}>QR Code Pos Security Desk</h4>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Tampilkan atau cetak QR Code ini di meja pos keamanan agar pengunjung dapat memindai langsung dari smartphone.
            </p>
          </div>
        </div>
        <Button variant="outline" size="md" icon={QrCode} onClick={() => setShowQrModal(true)} className="shrink-0">
          Tampilkan QR Code Pos
        </Button>
      </div>

      {/* QR Modal */}
      <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="QR Code Pos Keamanan Security" maxWidth="max-w-md">
        <div className="flex flex-col items-center text-center space-y-6 py-2">
          <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-[#073B5C]">
            <QRCodeSVG value={checkInDirectUrl} size={220} level="H" includeMargin />
          </div>
          <div>
            <h4 className="font-bold text-lg" style={{ color: 'var(--text-heading)' }}>SCAN UNTUK CHECK-IN LANGSUNG</h4>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Scan QR ini untuk langsung ke form check-in tamu
            </p>
          </div>
          <div className="w-full p-3 rounded-xl border text-xs font-mono flex items-center justify-between gap-2" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
            <span className="truncate">{checkInDirectUrl}</span>
            <button onClick={() => {
              navigator.clipboard.writeText(checkInDirectUrl);
              showToast('Link check-in berhasil disalin!', 'success');
            }} className="p-1.5 rounded-lg text-sky-400 transition-colors shrink-0 hover:bg-[#073B5C]/20 cursor-pointer">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => window.print()}>
            Cetak QR Code Stand
          </Button>
        </div>
      </Modal>

      {/* Checkout Success View */}
      {showCheckoutSuccess && checkoutSuccessData && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="min-h-screen w-full max-w-lg p-4 py-8">
            {/* Success Card */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#0A527E] via-[#073B5C] to-[#042338] border-2 border-[#0E689B] p-6 shadow-2xl space-y-6">
              
              {/* Decorative Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-sky-400 to-[#0E689B] rounded-t-3xl" />

              {/* MANDATORY BANNER - LARGER FOR MOBILE */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white text-center font-black text-base sm:text-lg tracking-wider uppercase shadow-xl border-2 border-sky-300 animate-pulse">
                ⚠️ TUNJUKKAN HALAMAN INI KEPADA SECURITY
              </div>

              {/* Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-4 border-emerald-400 text-emerald-400 shadow-2xl mb-3">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    BUKU TAMU DIGITAL
                  </span>
                  <h2 className="text-3xl font-black text-white tracking-wider uppercase leading-tight">
                    CHECK-OUT<br/>BERHASIL
                  </h2>
                  <p className="text-sky-200 text-base pt-2 px-4">
                    Terima kasih atas kunjungan Anda.<br/>Sampai jumpa kembali! 👋
                  </p>
                </div>
              </div>

              {/* Data Details - LARGER FOR MOBILE */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#042338]/90 border-2 border-sky-500/40">
                  <span className="text-xs text-sky-300 font-bold uppercase tracking-wider block mb-2">Nama Pengunjung:</span>
                  <span className="text-2xl font-black text-white block leading-tight">{checkoutSuccessData.nama}</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#042338]/90 border-2 border-sky-500/40 space-y-4">
                  <div>
                    <span className="text-xs text-sky-300 font-bold uppercase tracking-wider block mb-1">⏰ Jam Masuk:</span>
                    <span className="text-lg font-bold font-mono text-white block">{formatDateTime(checkoutSuccessData.jamKunjungan)}</span>
                  </div>
                  <div className="pt-3 border-t border-sky-500/30">
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">✅ Jam Keluar:</span>
                    <span className="text-lg font-bold font-mono text-emerald-300 block">{formatDateTime(checkoutSuccessData.jamKeluar)}</span>
                  </div>
                </div>

                {checkoutSuccessData.durasi && (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600/30 to-emerald-500/30 border-2 border-emerald-400 text-center shadow-xl">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block mb-2">⏱️ Durasi Kunjungan:</span>
                    <div className="text-4xl font-black text-emerald-300">
                      {checkoutSuccessData.durasi}
                    </div>
                  </div>
                )}

                {/* Signature - LARGER */}
                {checkoutSuccessData.tandaTanganKeluar && (
                  <div className="pt-4 border-t border-sky-400/30 text-center space-y-3">
                    <span className="text-xs text-sky-300 uppercase font-bold block">✍️ Tanda Tangan Check-Out:</span>
                    <div className="bg-white/95 p-4 rounded-xl border-2 border-sky-400 shadow-lg">
                      <img src={checkoutSuccessData.tandaTanganKeluar} alt="Tanda Tangan" className="h-20 mx-auto object-contain" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info Footer */}
              <div className="pt-4 text-center">
                <p className="text-xs text-sky-200/80 italic">
                  Silakan tunjukkan halaman ini kepada petugas security untuk verifikasi kepulangan
                </p>
              </div>
            </div>

            {/* Close Button - LARGER */}
            <div className="mt-6 flex justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="w-full max-w-sm py-4 text-lg font-bold shadow-2xl"
                onClick={() => {
                  setShowCheckoutSuccess(false);
                  setCheckoutSuccessData(null);
                }}
                icon={ArrowRight}
              >
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <Modal 
        isOpen={showCheckoutModal} 
        onClose={() => {
          setShowCheckoutModal(false);
          setSelectedVisit(null);
          setTandaTanganKeluar('');
        }} 
        title="Konfirmasi Check-Out" 
        maxWidth="max-w-2xl"
      >
        {selectedVisit && (
          <div className="space-y-6">
            {/* Visit Summary */}
            <div className="p-5 rounded-2xl space-y-4 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(7,59,92,0.3), rgba(4,35,56,0.5))', border: '2px solid var(--bms-navy-light)' }}>
              <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(14,104,155,0.3)' }}>
                <div>
                  <span className="text-base font-bold uppercase tracking-wider text-sky-300">Data Kunjungan</span>
                </div>
                <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedVisit.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-semibold text-sky-400 uppercase block">Nama</span>
                  <p className="text-base font-bold mt-0.5" style={{ color: 'var(--text-heading)' }}>{selectedVisit.nama}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-semibold text-sky-400 uppercase block">Instansi</span>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{selectedVisit.instansi}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-semibold text-sky-400 uppercase block">Jam Masuk</span>
                  <p className="font-mono mt-0.5" style={{ color: 'var(--text-secondary)' }}>{formatDateTime(selectedVisit.jamKunjungan)}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-semibold text-sky-400 uppercase block">Keperluan</span>
                  <p className="truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{selectedVisit.keterangan || '-'}</p>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="space-y-5">
              <LiveClockDisplay
                label="Jam Keluar"
                name="jamKeluar"
                displayDate={clock.displayDate}
                displayTime={clock.displayTime}
                isoValue={clock.isoValue}
                helperText="Waktu keluar dicatat otomatis oleh sistem — tidak dapat diubah."
              />
              
              <SignaturePad 
                label="Tanda Tangan Saat Keluar" 
                value={tandaTanganKeluar} 
                onChange={(val) => setTandaTanganKeluar(val)} 
                required={true} 
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                size="lg" 
                className="flex-1"
                onClick={() => {
                  setShowCheckoutModal(false);
                  setSelectedVisit(null);
                  setTandaTanganKeluar('');
                }}
              >
                Batal
              </Button>
              <Button 
                variant="danger" 
                size="lg" 
                className="flex-1 font-bold"
                onClick={handleCheckoutSubmit}
                isLoading={isSubmitting}
                icon={LogOut}
              >
                Konfirmasi Check-Out
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
