import React, { useState, useEffect } from 'react';
import { LogOut, Search, User, ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import SignaturePad from '../components/SignaturePad';
import StatusBadge from '../components/StatusBadge';
import LiveClockDisplay from '../components/LiveClockDisplay';
import useLiveClock from '../hooks/useLiveClock';
import { formatDateTime } from '../utils/formatters';
import { searchVisits, checkOutGuest } from '../services/apiService';

export default function CheckOutPage({ initialId = '', onNavigate, showToast, refreshVisits }) {
  const clock = useLiveClock();
  const [searchQuery, setSearchQuery] = useState(initialId);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [tandaTanganKeluar, setTandaTanganKeluar] = useState('');
  const [errorSig, setErrorSig] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialId) handleSearch(initialId);
  }, [initialId]);

  const handleSearch = async (queryToSearch) => {
    const query = queryToSearch !== undefined ? queryToSearch : searchQuery;
    if (!query.trim()) { showToast('Masukkan Nama Pengunjung', 'warning'); return; }
    setIsSearching(true); setSearchAttempted(true); setSelectedVisit(null); setSearchResults([]);
    try {
      const results = await searchVisits(query.trim());
      if (results && results.length > 0) {
        setSearchResults(results);
        if (results.length === 1) { setSelectedVisit(results[0]); showToast(`Data kunjungan ${results[0].nama} ditemukan!`, 'success'); }
        else showToast(`Ditemukan ${results.length} data kunjungan. Pilih tamu yang sesuai.`, 'info');
      } else {
        showToast(`Pengunjung dengan nama "${query}" tidak ditemukan.`, 'error');
      }
    } catch (err) { showToast('Gagal mencari data: ' + err.message, 'error'); }
    finally { setIsSearching(false); }
  };

  const handleSubmitCheckout = async (e) => {
    if (e) e.preventDefault();
    if (!selectedVisit) { showToast('Pilih data pengunjung terlebih dahulu', 'warning'); return; }
    if (selectedVisit.status === 'SELESAI') { showToast('Kunjungan ini sudah SELESAI.', 'warning'); return; }
    const finalSignature = tandaTanganKeluar || selectedVisit.tandaTangan || '';
    setIsSubmitting(true);
    try {
      // Use live clock ISO value at the moment submit is pressed
      const result = await checkOutGuest({ idKunjungan: selectedVisit.idKunjungan, jamKeluar: clock.isoValue, tandaTanganKeluar: finalSignature });
      if (result.success) {
        showToast(result.message, result.viaN8n ? 'success' : 'info');
        await refreshVisits();
        onNavigate('checkout-success', { visit: result.data });
      } else showToast(result.message || 'Gagal memproses check-out', 'error');
    } catch (err) { showToast('Terjadi kesalahan saat check-out: ' + err.message, 'error'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => onNavigate('welcome')} className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer transition-colors" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft className="w-4 h-4" /><span>Kembali ke Beranda</span>
        </button>
        <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Security Check-Out Desk</div>
      </div>

      {/* Main Card */}
      <div className="checkout-card rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 transition-all duration-300" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>

        {/* Card Header */}
        <div className="flex items-center gap-3.5 pb-6" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-lg">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>Check-Out Tamu</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Cari Nama Pengunjung untuk Proses Kepulangan</p>
          </div>
        </div>

        {/* Search Box */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="search-box-area space-y-4 p-5 rounded-2xl transition-all duration-300" style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}>
          <label className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>
            Cari Nama Pengunjung
          </label>
          <div className="flex gap-2">
            <Input name="searchQuery" placeholder="Masukkan nama pengunjung..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" icon={User} />
            <Button type="submit" variant="primary" isLoading={isSearching} icon={Search} className="shrink-0 font-bold px-6">CARI</Button>
          </div>
        </form>

        {/* Multiple Results */}
        {searchResults.length > 1 && !selectedVisit && (
          <div className="space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">Pilih Tamu yang Sesuai ({searchResults.length} Ditemukan):</h4>
            <div className="grid grid-cols-1 gap-3">
              {searchResults.map((visit) => (
                <div key={visit.idKunjungan} onClick={() => { setSelectedVisit(visit); }}
                  className="p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group hover:border-sky-400"
                  style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold group-hover:text-sky-400 transition-colors" style={{ color: 'var(--text-heading)' }}>{visit.nama}</span>
                      <span className="text-xs font-mono text-sky-400">({visit.idKunjungan})</span>
                    </div>
                    <p className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                      <span>{visit.instansi}</span><span>•</span><span>{formatDateTime(visit.jamKunjungan)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={visit.status} size="sm" />
                    <Button variant="secondary" size="sm">Pilih</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Visit + Checkout Form */}
        {selectedVisit ? (
          <form onSubmit={handleSubmitCheckout} className="space-y-6 animate-fade-in pt-2">
            {/* Visit Summary */}
            <div className="visit-summary-card p-6 rounded-2xl space-y-4 shadow-xl transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(7,59,92,0.3), rgba(4,35,56,0.5))', border: '2px solid var(--bms-navy-light)' }}>
              <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(14,104,155,0.3)' }}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 block">ID KUNJUNGAN</span>
                  <span className="text-lg font-black font-mono text-sky-300 tracking-wider">{selectedVisit.idKunjungan}</span>
                </div>
                <StatusBadge status={selectedVisit.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="visit-detail-row p-3 rounded-xl transition-colors" style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-semibold text-sky-400 uppercase block">Nama</span>
                  <p className="text-base font-bold mt-0.5" style={{ color: 'var(--text-heading)' }}>{selectedVisit.nama}</p>
                </div>
                <div className="visit-detail-row p-3 rounded-xl transition-colors" style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-semibold text-sky-400 uppercase block">Instansi</span>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{selectedVisit.instansi}</p>
                </div>
                <div className="visit-detail-row p-3 rounded-xl transition-colors" style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-semibold text-sky-400 uppercase block">Jam Masuk</span>
                  <p className="font-mono mt-0.5" style={{ color: 'var(--text-secondary)' }}>{formatDateTime(selectedVisit.jamKunjungan)}</p>
                </div>
                <div className="visit-detail-row p-3 rounded-xl transition-colors" style={{ backgroundColor: 'var(--bg-card-deep)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-semibold text-sky-400 uppercase block">Keperluan</span>
                  <p className="truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{selectedVisit.keterangan || '-'}</p>
                </div>
              </div>
            </div>

            {selectedVisit.status !== 'SELESAI' ? (
              <div className="space-y-5">
                <LiveClockDisplay
                  label="Jam Keluar"
                  name="jamKeluar"
                  displayDate={clock.displayDate}
                  displayTime={clock.displayTime}
                  isoValue={clock.isoValue}
                  helperText="Waktu keluar dicatat otomatis oleh sistem — tidak dapat diubah."
                />
                <SignaturePad label="Tanda Tangan Saat Keluar (Opsional)" value={tandaTanganKeluar} onChange={(val) => { setTandaTanganKeluar(val); setErrorSig(null); }} required={false} error={errorSig} />
                <Button type="submit" variant="danger" size="lg" className="w-full text-lg font-black tracking-wide shadow-2xl shadow-rose-500/30" isLoading={isSubmitting} icon={LogOut}>
                  CHECK-OUT
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 shrink-0" /><span>Kunjungan tamu ini sudah SELESAI sebelumnya.</span></div>
                <Button variant="secondary" size="sm" onClick={() => setSelectedVisit(null)}>Cari Tamu Lain</Button>
              </div>
            )}
          </form>
        ) : (
          searchAttempted && !isSearching && searchResults.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: 'var(--text-muted)' }}>
              Pengunjung tidak ditemukan. Periksa kembali ejaan nama pengunjung.
            </div>
          )
        )}
      </div>
    </div>
  );
}
