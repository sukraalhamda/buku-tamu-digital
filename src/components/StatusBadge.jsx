import React from 'react';
import { UserCheck, Clock, CheckCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const normStatus = (status || '').toUpperCase().trim();

  let config = {
    label: 'CHECK-IN',
    bg: 'var(--badge-checkin-bg)',
    border: 'var(--badge-checkin-border)',
    color: 'var(--badge-checkin-text)',
    icon: Clock
  };

  if (normStatus === 'SEDANG BERKUNJUNG' || normStatus === 'CHECK-IN') {
    config = {
      label: 'SEDANG BERKUNJUNG',
      bg: 'var(--badge-sedang-bg)',
      border: 'var(--badge-sedang-border)',
      color: 'var(--badge-sedang-text)',
      icon: UserCheck
    };
  } else if (normStatus === 'SELESAI') {
    config = {
      label: 'SELESAI',
      bg: 'var(--badge-selesai-bg)',
      border: 'var(--badge-selesai-border)',
      color: 'var(--badge-selesai-text)',
      icon: CheckCircle
    };
  }

  const Icon = config.icon;
  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-0.5 text-[11px] font-semibold gap-1' 
    : 'px-3 py-1 text-xs font-semibold gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${sizeClasses}`}
      style={{ backgroundColor: config.bg, borderColor: config.border, color: config.color }}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}
