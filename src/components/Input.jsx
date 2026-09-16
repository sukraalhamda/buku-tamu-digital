import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon: Icon,
  rows,
  disabled = false,
  className = '',
  ...props
}) {
  const isTextArea = type === 'textarea';
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseInputStyle = {
    backgroundColor: 'var(--input-bg)',
    color: 'var(--input-text)',
    borderColor: error ? undefined : 'var(--input-border)',
  };

  const sharedClasses = `w-full py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 border`;
  const errorClasses = error
    ? 'border-rose-500/80 focus:ring-rose-500/30 focus:border-rose-500'
    : 'focus:ring-sky-500/25 focus:border-[#073B5C]';

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
          <span>
            {label}
            {required && <span className="text-rose-400 ml-1">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && !isTextArea && (
          <div className="absolute left-3.5 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {isTextArea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows || 3}
            disabled={disabled}
            style={baseInputStyle}
            className={`${sharedClasses} ${errorClasses} px-4 resize-y`}
            {...props}
          />
        ) : (
          <>
            <input
              id={name}
              name={name}
              type={effectiveType}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              style={baseInputStyle}
              className={`${sharedClasses} ${errorClasses} ${Icon ? 'pl-11' : 'px-4'} ${isPassword ? 'pr-11' : 'pr-4'}`}
              {...props}
            />
            {isPassword && (
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 p-1 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center justify-center"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </>
        )}
      </div>

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="helper-text text-xs" style={{ color: 'var(--text-muted)' }}>{helperText}</p>}
    </div>
  );
}
