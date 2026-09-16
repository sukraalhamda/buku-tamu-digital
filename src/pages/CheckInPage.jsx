import React, { useState } from 'react';
import { UserPlus, Building2, User, ArrowLeft, Send, Info, ShieldAlert } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import SignaturePad from '../components/SignaturePad';
import LiveClockDisplay from '../components/LiveClockDisplay';
import useLiveClock from '../hooks/useLiveClock';
import { checkInGuest } from '../services/apiService';

export default function CheckInPage({ onNavigate, showToast, refreshVisits, isReadOnly = false }) {
  const clock = useLiveClock();

  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    keterangan: '',
    tandaTangan: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSignatureChange = (base64) => {
    setFormData(prev => ({ ...prev, tandaTangan: base64 }));
    if (errors.tandaTangan) setErrors(prev => ({ ...prev, tandaTangan: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama lengkap wajib diisi.';
    if (!formData.instansi.trim()) newErrors.instansi = 'Nama instansi/perusahaan wajib diisi.';
    if (!formData.keterangan.trim()) newErrors.keterangan = 'Keterangan/tujuan kunjungan wajib diisi.';
    if (!formData.tandaTangan) newErrors.tandaTangan = 'Tanda tangan digital wajib digoreskan.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Lengkapi semua kolom form & tanda tangan wajib diisi', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      // Inject live clock value at submit time
      const payload = { ...formData, jamKunjungan: clock.isoValue };
      const result = await checkInGuest(payload);
      if (result.success) {
        showToast(result.message, result.viaN8n ? 'success' : 'info');
        await refreshVisits();
        onNavigate('checkin-success', { visit: result.data });
      } else {
        showToast(result.message || 'Gagal menyimpan data check-in', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan sistem saat check-in: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('welcome')}
          className="inline-flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer breadcrumb-text"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
        <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          Form Check-In Tamu
        </div>
      </div>

      {/* Main Card */}
      <div
        className="checkin-card rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md transition-all duration-300"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
      >
        <div className="flex items-center gap-3.5 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <div className="w-12 h-12 rounded-2xl bg-[#073B5C] border border-[#0E689B] flex items-center justify-center text-sky-300 shrink-0 shadow-lg">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>
              Formulir Check-In Pengunjung
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Mohon isi data diri dengan jelas dan lengkap.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="1. Nama Lengkap Tamu" name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama Lengkap" required icon={User} error={errors.nama} />
          <Input label="2. Instansi / Perusahaan" name="instansi" value={formData.instansi} onChange={handleChange} placeholder="Nama Instansi / Perusahaan" required icon={Building2} error={errors.instansi} />
          <LiveClockDisplay
            label="3. Jam & Tanggal Masuk"
            name="jamKunjungan"
            displayDate={clock.displayDate}
            displayTime={clock.displayTime}
            isoValue={clock.isoValue}
            helperText="Waktu dicatat otomatis oleh sistem — tidak dapat diubah."
          />
          <Input label="4. Keterangan / Keperluan Kunjungan" name="keterangan" type="textarea" rows={3} value={formData.keterangan} onChange={handleChange} placeholder="Tuliskan keperluan kunjungan Anda..." required error={errors.keterangan} />
          <SignaturePad label="5. Tanda Tangan Pengunjung" value={formData.tandaTangan} onChange={handleSignatureChange} required error={errors.tandaTangan} />

          <div className="pt-4">
            <Button type="submit" variant="primary" size="lg" className="w-full text-base font-bold shadow-xl shadow-[#073B5C]/40" isLoading={isSubmitting} icon={Send}>
              Simpan & Dapatkan ID Kunjungan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
