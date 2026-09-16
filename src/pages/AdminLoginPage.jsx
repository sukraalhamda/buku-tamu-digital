import React, { useState } from 'react';
import { Lock, User, KeyRound, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

export default function AdminLoginPage({ onLogin, onNavigate, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Masukkan Email dan Password Admin', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const success = await onLogin(email, password);
      if (success) onNavigate('admin-dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-8 animate-fade-in">
      <button
        onClick={() => onNavigate('welcome')}
        className="inline-flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Mode Pengunjung</span>
      </button>

      {/* Main Login Card */}
      <div
        className="login-card rounded-3xl p-8 shadow-2xl space-y-6 backdrop-blur-md transition-all duration-300"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#073B5C] border border-[#0E689B] flex items-center justify-center text-sky-300 mx-auto shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>
            Admin Security Login
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Dashboard Monitoring Kunjungan Tamu
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email Admin" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@bms.co.id" icon={User} required />
          <Input label="Password Admin" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" icon={KeyRound} required />
          <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-lg shadow-[#073B5C]/40 mt-2" isLoading={isLoading} icon={Lock}>
            Masuk ke Dashboard Admin
          </Button>
        </form>
      </div>
    </div>
  );
}
