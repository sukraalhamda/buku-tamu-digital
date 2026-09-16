import React from 'react';
import { LayoutDashboard, History, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import Toast from '../components/Toast';
import ThemeToggle from '../components/ThemeToggle';

export default function AdminLayout({
  children,
  currentPage = 'dashboard',
  onNavigate,
  onLogout,
  toast,
  onCloseToast
}) {
  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      {/* Admin Header — always BMS Navy */}
      <header className="sticky top-0 z-40 backdrop-blur-xl shadow-2xl" style={{ backgroundColor: 'rgba(7,59,92,0.95)', borderBottom: '1px solid rgba(14,104,155,0.50)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#073B5C] to-[#0E689B] border border-sky-400/30 flex items-center justify-center text-white font-bold shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">ADMIN DASHBOARD</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold">ONLINE</span>
              </div>

            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2 bg-[#042338]/90 p-1.5 rounded-2xl border border-[#0E689B]/40 shadow-inner admin-nav-area">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 'admin-dashboard' || currentPage === 'dashboard'
                  ? 'bg-gradient-to-r from-[#073B5C] to-[#0E689B] text-white shadow-lg border border-sky-400/30'
                  : 'admin-nav-inactive text-sky-100/70 hover:text-white hover:bg-[#073B5C]/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 'history'
                  ? 'bg-gradient-to-r from-[#073B5C] to-[#0E689B] text-white shadow-lg border border-sky-400/30'
                  : 'admin-nav-inactive text-sky-100/70 hover:text-white hover:bg-[#073B5C]/40'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat Kunjungan</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('welcome')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#042338] hover:bg-[#0A527E] border border-[#0E689B]/40 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Mode Tamu</span>
            </button>

            {/* Dark / Light Toggle */}
            <ThemeToggle />

            <div className="flex items-center gap-2 pl-2 border-l border-[#0E689B]/40">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-white">Security Lead</p>
                <p className="text-[10px] text-sky-200/70 font-mono">admin@besmindo.co.id</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all active:scale-95 cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden flex items-center justify-around border-t border-[#0E689B]/40 bg-[#042338] px-2 py-2">
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentPage === 'admin-dashboard' || currentPage === 'dashboard' ? 'bg-[#073B5C] text-white border border-sky-400/30' : 'text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentPage === 'history' ? 'bg-[#073B5C] text-white border border-sky-400/30' : 'text-slate-300'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat</span>
          </button>
          <button
            onClick={() => onNavigate('welcome')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Portal Tamu</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <Toast toast={toast} onClose={onCloseToast} />
    </div>
  );
}
