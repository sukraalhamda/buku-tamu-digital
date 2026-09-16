  import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, PenTool, CheckCircle2 } from 'lucide-react';
import Button from './Button';

export default function SignaturePad({
  value,
  onChange,
  label = 'Tanda Tangan digital',
  required = true,
  error = null
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set display resolution vs internal resolution for crisp rendering
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = '#0284c7'; // Vibrant signature line for dark & light mode
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If initial value exists, render image onto canvas
    if (value && value.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setIsEmpty(false);
      };
      img.src = value;
    }
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setIsEmpty(false);
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    if (e) e.preventDefault();
    setIsDrawing(false);

    // Save as base64 png image
    const canvas = canvasRef.current;
    if (canvas && !isEmpty) {
      const dataUrl = canvas.toDataURL('image/png');
      onChange(dataUrl);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setIsEmpty(true);
    onChange('');
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
          <PenTool className="w-3.5 h-3.5 text-[#073B5C] dark:text-sky-400" />
          <span>{label}</span>
          {required && <span className="text-rose-400">*</span>}
        </label>
        {!isEmpty && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tersimpan
          </span>
        )}
      </div>

      <div
        className={`relative w-full h-44 rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-crosshair ${
          error
            ? 'border-rose-500/80 shadow-lg shadow-rose-950/40'
            : isDrawing
            ? 'border-sky-400 ring-2 ring-sky-500/20'
            : ''
        }`}
        style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: error ? undefined : 'var(--border-primary)' }}
      >
        {/* Placeholder Watermark */}
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none space-y-1" style={{ color: 'var(--text-muted)' }}>
            <PenTool className="w-8 h-8 opacity-40 animate-pulse" />
            <p className="text-xs font-medium tracking-wide">Goreskan tanda tangan Anda di sini</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Dapat menggunakan Mouse atau Layar Sentuh Smartphone</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full touch-none"
        />

        {/* Clear Button Overlay */}
        {!isEmpty && (
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 shadow-md cursor-pointer bg-red-50 hover:bg-red-100 text-red-700 border-red-300 dark:bg-red-950/90 dark:hover:bg-red-900 dark:text-red-300 dark:border-red-800/80 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>Ulangi</span>
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
