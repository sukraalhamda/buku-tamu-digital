import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
      title={isDark ? 'Mode Terang' : 'Mode Gelap'}
      className={`
        relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold
        transition-all duration-300 cursor-pointer active:scale-95 select-none
        ${isDark
          ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-amber-300 hover:text-amber-200'
          : 'bg-white/90 hover:bg-amber-50 border-amber-200 text-amber-600 hover:text-amber-700 shadow-sm'
        }
        ${className}
      `}
    >
      <span className="relative w-5 h-5">
        {/* Sun icon (visible in dark mode = switch to light) */}
        <Sun
          className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90 scale-50'
          }`}
        />
        {/* Moon icon (visible in light mode = switch to dark) */}
        <Moon
          className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
            isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0'
          }`}
        />
      </span>
      <span className="hidden sm:block">
        {isDark ? 'Terang' : 'Gelap'}
      </span>
    </button>
  );
}
