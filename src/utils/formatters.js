/**
 * Utility helper functions for Buku Tamu Digital
 */

/**
 * Generate Uniq Visit ID with format TAMU-YYYYMMDD-XXXX
 * Contoh: TAMU-20260831-4821
 */
export const generateVisitId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Random 4 digit number
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  
  return `TAMU-${year}${month}${day}-${randomDigits}`;
};

/**
 * Get current ISO timestamp or standard formatted string
 */
export const getCurrentISO = () => {
  return new Date().toISOString();
};

/**
 * Format timestamp into Indonesian locale string (e.g. "31 Ags 2026, 14:30 WIB")
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;

  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WIB';
};

/**
 * Format date only (e.g. "31 Ags 2026")
 */
export const formatDateOnly = (dateInput) => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format time only (e.g. "14:30 WIB")
 */
export const formatTimeOnly = (dateInput) => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }) + ' WIB';
};

/**
 * Calculate human-readable duration between Check-In time and Check-Out time
 * e.g. "1 Jam 45 Menit" or "30 Menit"
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '-';
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
  
  let diffMs = end - start;
  if (diffMs < 0) diffMs = 0;
  
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours} Jam ${minutes} Menit`;
  }
  return `${minutes} Menit`;
};

/**
 * Get current HTML datetime-local string
 */
export const getCurrentDatetimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};
