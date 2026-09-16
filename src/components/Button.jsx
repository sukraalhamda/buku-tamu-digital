import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-to-r from-[#073B5C] via-[#094a73] to-[#0E689B] hover:from-[#094a73] hover:to-[#127fbf] text-white border border-[#1479b8]/40 focus:ring-[#073B5C] shadow-[#073B5C]/30',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 dark:bg-[#073B5C]/60 dark:hover:bg-[#073B5C] dark:text-sky-100 dark:border-[#0E689B]/50 focus:ring-[#073B5C]',
    outline: 'border-2 hover:bg-[#073B5C]/20 focus:ring-[#073B5C]',
    danger: 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white focus:ring-red-500 shadow-red-600/30',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white focus:ring-emerald-500 shadow-emerald-600/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const dynamicStyle = variant === 'outline' ? {
    color: 'var(--btn-outline-text)',
    borderColor: 'var(--btn-outline-border)',
    ...props.style
  } : props.style;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      style={dynamicStyle}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />}
          {children}
        </>
      )}
    </button>
  );
}
