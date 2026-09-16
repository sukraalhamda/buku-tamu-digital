import React from 'react';
import { Clock } from 'lucide-react';

/**
 * LiveClockDisplay
 *
 * Renders a read-only, non-editable clock display for use in forms.
 * Shows the current date (fixed) and live time (ticking every second).
 * A hidden <input> carries the ISO value for form submission.
 *
 * Props:
 *  - label        : string  — field label text
 *  - name         : string  — name attribute for the hidden input
 *  - displayDate  : string  — formatted date string (fixed, from useLiveClock)
 *  - displayTime  : string  — HH:MM:SS (live, from useLiveClock)
 *  - isoValue     : string  — ISO datetime for form submission
 *  - helperText   : string  — optional helper/note below the field
 */
export default function LiveClockDisplay({
  label,
  name,
  displayDate,
  displayTime,
  isoValue,
  helperText,
}) {
  // Split seconds from HH:MM so we can style them differently
  const [hhmm, ss] = displayTime ? displayTime.split(/(?=:\d\d$)/) : ['--:--', ':--'];

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(14,104,155,0.15)', color: '#38bdf8' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            LIVE
          </span>
        </label>
      )}

      {/* Display panel — looks like a digital clock, not an editable input */}
      <div
        className="relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200"
        style={{
          backgroundColor: 'var(--input-bg)',
          borderColor: 'var(--input-border)',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {/* Clock icon */}
        <Clock
          className="w-5 h-5 shrink-0"
          style={{ color: 'var(--text-muted)' }}
        />

        {/* Date (fixed) */}
        <span
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          {displayDate}
        </span>

        {/* Divider */}
        <span style={{ color: 'var(--border-primary)' }}>|</span>

        {/* Time (live) — monospace so digits don't shift */}
        <span className="font-mono font-bold text-base tracking-wider" style={{ color: 'var(--text-heading)' }}>
          {hhmm}
          <span
            className="font-mono text-sm"
            style={{ color: '#38bdf8', opacity: 0.85 }}
          >
            {ss}
          </span>
        </span>

        {/* WIB badge */}
        <span
          className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0"
          style={{ background: 'rgba(7,59,92,0.4)', color: '#7dd3fc', border: '1px solid rgba(14,104,155,0.4)' }}
        >
          WIB
        </span>

        {/* Lock icon to reinforce non-editable */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: 'var(--text-muted)', opacity: 0.5 }}
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Hidden input carries value for form submission */}
      <input type="hidden" name={name} value={isoValue} readOnly />

      {helperText && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
