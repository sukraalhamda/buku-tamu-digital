import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'navy', subtitle }) {
  const colorSchemes = {
    navy: {
      bgIcon: 'bg-[#073B5C]/10 dark:bg-[#073B5C]/35 text-[#073B5C] dark:text-sky-300 border-[#073B5C]/20 dark:border-[#0E689B]/50',
      gradient: 'from-[#073B5C]/10 dark:from-[#073B5C]/30 to-transparent',
      border: 'border-slate-200 dark:border-[#0E689B]/40',
    },
    sky: {
      bgIcon: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-400/40 dark:border-sky-500/30',
      gradient: 'from-sky-500/10 dark:from-sky-500/15 to-transparent',
      border: 'border-slate-200 dark:border-[#0E689B]/40',
    },
    emerald: {
      bgIcon: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-400/40 dark:border-emerald-500/30',
      gradient: 'from-emerald-500/10 dark:from-emerald-500/15 to-transparent',
      border: 'border-slate-200 dark:border-emerald-500/30',
    },
    amber: {
      bgIcon: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-400/40 dark:border-amber-500/30',
      gradient: 'from-amber-500/10 dark:from-amber-500/15 to-transparent',
      border: 'border-slate-200 dark:border-amber-500/30',
    },
    indigo: {
      bgIcon: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-400/40 dark:border-indigo-400/30',
      gradient: 'from-indigo-500/10 dark:from-[#073B5C]/40 to-transparent',
      border: 'border-slate-200 dark:border-[#0E689B]/50',
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.navy;

  return (
    <div
      className={`stat-card relative overflow-hidden rounded-2xl border ${scheme.border} p-5 shadow-lg backdrop-blur-md transition-all duration-300 group`}
      style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
    >
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${scheme.gradient} blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{title}</p>
          <h3 className="text-3xl font-extrabold mt-2 tracking-tight" style={{ color: 'var(--text-heading)' }}>{value}</h3>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>

        {/* Icon Container */}
        <div className={`p-3.5 rounded-2xl border ${scheme.bgIcon} shadow-md`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}
