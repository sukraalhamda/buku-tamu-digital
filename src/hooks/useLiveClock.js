import { useState, useEffect, useRef } from 'react';

/**
 * useLiveClock
 *
 * Returns a live-updating clock where:
 *  - `displayDate`  → "Rabu, 02 September 2026"  (fixed at mount, not live)
 *  - `displayTime`  → "10:45:32"                  (live, updates every second)
 *  - `isoValue`     → "2026-09-02T10:45:32"       (live, used for form submit)
 *
 * The date portion is intentionally FIXED at the moment the hook mounts so
 * that midnight rollovers do not silently alter the recorded visit date.
 */
export default function useLiveClock() {
  const mountedAt = useRef(new Date());

  const buildState = () => {
    const now = new Date();
    const fixedDate = mountedAt.current;

    // ── Display date (fixed) ─────────────────────────────────────────────────
    const displayDate = fixedDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // ── Display time (live) ──────────────────────────────────────────────────
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const displayTime = `${hh}:${mm}:${ss}`;

    // ── ISO value for form submission (uses fixed date + live time) ──────────
    const yyyy = fixedDate.getFullYear();
    const mo   = String(fixedDate.getMonth() + 1).padStart(2, '0');
    const dd   = String(fixedDate.getDate()).padStart(2, '0');
    const isoValue = `${yyyy}-${mo}-${dd}T${hh}:${mm}:${ss}`;

    return { displayDate, displayTime, isoValue };
  };

  const [clock, setClock] = useState(buildState);

  useEffect(() => {
    // Align the first tick to the start of the next second for accuracy
    const msUntilNextSecond = 1000 - (Date.now() % 1000);
    let intervalId;

    const timeoutId = setTimeout(() => {
      setClock(buildState());
      intervalId = setInterval(() => setClock(buildState()), 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return clock;
}
