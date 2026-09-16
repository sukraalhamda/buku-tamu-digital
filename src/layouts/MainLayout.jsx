import React from 'react';
import { Shield, Lock, PhoneCall, Building2 } from 'lucide-react';
import Toast from '../components/Toast';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function MainLayout({ children, toast, onCloseToast, onNavigateAdmin }) {
  const { isDark } = useTheme();

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      {/* Background Decorative Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#073B5C]/35 via-[#042338]/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-[#073B5C]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header — always BMS Navy background */}
      <header className="page-header sticky top-0 z-40 backdrop-blur-xl shadow-xl" style={{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid rgba(14,104,155,0.45)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#073B5C] to-[#0E689B] border border-sky-400/30 flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-sky-400/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#073B5C] border border-sky-400/40 text-sky-200 font-bold uppercase tracking-wider shadow-sm">
                  Buku Tamu Digital
                </span>
              </div>

            </div>
          </a>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-sky-100 bg-[#042338]/90 px-3.5 py-1.5 rounded-full border border-[#0E689B]/40 shadow-inner">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Security Post 1</span>
            </div>

            {/* Dark / Light Toggle */}
            <ThemeToggle />

            <button
              onClick={() => onNavigateAdmin && onNavigateAdmin()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#042338] hover:bg-[#0A527E] border border-[#0E689B]/50 text-xs font-semibold text-white transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:block">Admin Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <Toast toast={toast} onClose={onCloseToast} />

      {/* Footer */}
      <footer className="page-footer border-t py-6 mt-12 text-xs" style={{ backgroundColor: isDark ? 'rgba(4,35,56,0.90)' : '#073B5C', borderTopColor: 'rgba(14,104,155,0.3)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sky-100/80">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>© {new Date().getFullYear()} Buku Tamu Digital. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-sky-100/70">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-sky-400" /> Security Hotline: (021) 8899-7700
            </span>
            <span>|</span>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
