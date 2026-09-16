import React, { useState } from 'react';
import { Lock, User, KeyRound, Shield, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

export default function AdminLoginPage({ onLogin, onNavigate, showToast }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Masukkan Username dan Password Admin', 'warning');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const success = onLogin(username, password);
      setIsLoading(false);
      if (success) onNavigate('admin-dashboard');
    }, 400);
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

        {/* Credential Info */}
        <div className="p-3.5 rounded-xl border text-xs space-y-1" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)' }}>
          <p className="font-semibold flex items-center gap-1 text-sky-400">
            <Shield className="w-3.5 h-3.5" /> Kredensial Demo Security:
          </p>
          <div className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            Username: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>admin</span> | Password: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>besmindo123</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username Admin" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" icon={User} required />
          <Input label="Password Admin" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" icon={KeyRound} required />
          <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-lg shadow-[#073B5C]/40 mt-2" isLoading={isLoading} icon={Lock}>
            Masuk ke Dashboard Admin
          </Button>
        </form>
      </div>
    </div>
  );
}
