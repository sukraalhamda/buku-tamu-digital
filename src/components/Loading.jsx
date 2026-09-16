import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ text = 'Memuat data...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-300 animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className="w-8 h-8 text-sky-400 animate-spin mb-2" />
      <p className="text-xs text-slate-400 font-medium">{text}</p>
    </div>
  );
}
