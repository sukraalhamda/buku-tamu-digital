/**
 * Local Storage Mock Storage Service for Buku Tamu Digital
 * Handles fallback data persistence when n8n Webhook is not configured or offline.
 */

import { generateVisitId, calculateDuration } from '../utils/formatters';

const STORAGE_KEY = 'besmindo_buku_tamu_data';

// Dummy signature SVG path encoded as base64 png sample data
const DUMMY_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><path d="M 10,40 Q 30,10 50,40 T 90,40 T 130,40 T 170,40" stroke="%2338bdf8" stroke-width="3" fill="none"/></svg>';

const INITIAL_VISITS = [
  {
    idKunjungan: 'TAMU-20260831-1001',
    nama: 'Budi Santoso',
    instansi: 'PT Pertamina Hulu Rokan',
    jamKunjungan: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    jamKeluar: null,
    keterangan: 'Meeting koordinasi pengadaan alat berat drill rig',
    tandaTangan: DUMMY_SIGNATURE,
    tandaTanganKeluar: null,
    status: 'SEDANG BERKUNJUNG',
    durasi: '-',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    idKunjungan: 'TAMU-20260831-1002',
    nama: 'Dewi Rahmawati',
    instansi: 'PT Schlumberger Indonesia',
    jamKunjungan: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    jamKeluar: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    keterangan: 'Inspeksi kualitas suku cadang pipa baja',
    tandaTangan: DUMMY_SIGNATURE,
    tandaTanganKeluar: DUMMY_SIGNATURE,
    status: 'SELESAI',
    durasi: '3 Jam 0 Menit',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    idKunjungan: 'TAMU-20260831-1003',
    nama: 'Hendra Gunawan',
    instansi: 'PT Halliburton Indonesia',
    jamKunjungan: new Date(Date.now() - 3600000 * 1.5).toISOString(), // 1.5 hours ago
    jamKeluar: null,
    keterangan: 'Audit K3 (HSE) area workshop & gudang',
    tandaTangan: DUMMY_SIGNATURE,
    tandaTanganKeluar: null,
    status: 'SEDANG BERKUNJUNG',
    durasi: '-',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    idKunjungan: 'TAMU-20260830-9081',
    nama: 'Ahmad Fauzi',
    instansi: 'Kementerian ESDM',
    jamKunjungan: new Date(Date.now() - 86400000 - 3600000 * 4).toISOString(),
    jamKeluar: new Date(Date.now() - 86400000 - 3600000 * 2).toISOString(),
    keterangan: 'Verifikasi sertifikasi kelayakan peralatan tambang',
    tandaTangan: DUMMY_SIGNATURE,
    tandaTanganKeluar: DUMMY_SIGNATURE,
    status: 'SELESAI',
    durasi: '2 Jam 0 Menit',
    createdAt: new Date(Date.now() - 86400000 - 3600000 * 4).toISOString()
  },
  {
    idKunjungan: 'TAMU-20260831-1004',
    nama: 'Siti Nurhaliza',
    instansi: 'PT Chevron Pacific Indonesia',
    jamKunjungan: new Date(Date.now() - 3600000 * 4).toISOString(),
    jamKeluar: null,
    keterangan: 'Koordinasi proyek pengembangan infrastruktur',
    tandaTangan: DUMMY_SIGNATURE,
    tandaTanganKeluar: null,
    status: 'SEDANG BERKUNJUNG',
    durasi: '-',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    idKunjungan: 'TAMU-20260831-1005',
    nama: 'Fajar Sadikin',
    instansi: 'SMK 2 Pekanbaru',
    jamKunjungan: new Date(Date.now() - 3600000 * 2).toISOString(),
    jamKeluar: null,
    keterangan: 'Kunjungan industri siswa SMK jurusan teknik mesin',
    tandaTangan: DUMMY_SIGNATURE,
    tandaTanganKeluar: null,
    status: 'SEDANG BERKUNJUNG',
    durasi: '-',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    idKunjungan: 'TAMU-20260831-1006',
    nama: 'Rudi Hartono',
    instansi: 'PT Baker Hughes Indonesia',
    jamKunjungan: new Date(Date.now() - 3600000 * 6).toISOString(),
    jamKeluar: null,
    keterangan: 'Maintenance dan service peralatan drilling',
    tandaTangan: DUMMY_SIGNATURE,
    tandaTanganKeluar: null,
    status: 'SEDANG BERKUNJUNG',
    durasi: '-',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    idKunjungan: 'TAMU-20260831-1007',
    nama: 'Linda Wijaya',
    instansi: 'PT Weatherford Indonesia',
    jamKunjungan: new Date(Date.now() - 3600000 * 1).toISOString(),
    jamKeluar: null,
    keterangan: 'Presentasi produk wellhead equipment terbaru',
    tandaTangan: DUMMY_SIGNATURE,
    tandaTanganKeluar: null,
    status: 'SEDANG BERKUNJUNG',
    durasi: '-',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    idKunjungan: 'TAMU-20260831-1008',
    nama: 'Fajar Ramadhan',
    instansi: 'PT Medco Energi Internasional',
    jamKunjungan: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    jamKeluar: null,
    keterangan: 'Survey lokasi untuk pemasangan peralatan monitoring',
    tandaTangan: DUMMY_SIGNATURE,
    tandaTanganKeluar: null,
    status: 'SEDANG BERKUNJUNG',
    durasi: '-',
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString()
  }
];

export const getStoredVisits = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VISITS));
    return INITIAL_VISITS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing stored visits:', e);
    return INITIAL_VISITS;
  }
};

export const saveVisits = (visits) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
};

export const addVisitMock = (visitData) => {
  const visits = getStoredVisits();
  
  const idKunjungan = visitData.idKunjungan || generateVisitId();
  const jamKunjungan = visitData.jamKunjungan || new Date().toISOString();
  
  const newVisit = {
    idKunjungan,
    nama: visitData.nama || '',
    instansi: visitData.instansi || '',
    jamKunjungan,
    jamKeluar: null,
    keterangan: visitData.keterangan || '',
    tandaTangan: visitData.tandaTangan || null,
    tandaTanganKeluar: null,
    status: 'SEDANG BERKUNJUNG', // Status per spesifikasi: SEDANG BERKUNJUNG atau CHECK-IN
    durasi: '-',
    createdAt: new Date().toISOString()
  };

  const updated = [newVisit, ...visits];
  saveVisits(updated);
  return newVisit;
};

export const checkoutVisitMock = (checkoutData) => {
  const visits = getStoredVisits();
  const index = visits.findIndex(v => v.idKunjungan.trim().toUpperCase() === checkoutData.idKunjungan.trim().toUpperCase());
  
  if (index === -1) {
    throw new Error(`Data kunjungan dengan ID "${checkoutData.idKunjungan}" tidak ditemukan.`);
  }

  const existing = visits[index];
  if (existing.status === 'SELESAI') {
    throw new Error(`Tamu dengan ID "${checkoutData.idKunjungan}" sudah melakukan check-out sebelumnya.`);
  }

  const jamKeluar = checkoutData.jamKeluar || new Date().toISOString();
  const durasi = calculateDuration(existing.jamKunjungan, jamKeluar);

  const updatedVisit = {
    ...existing,
    jamKeluar,
    tandaTanganKeluar: checkoutData.tandaTanganKeluar || null,
    status: 'SELESAI',
    durasi
  };

  visits[index] = updatedVisit;
  saveVisits(visits);
  return updatedVisit;
};

export const getVisitByIdMock = (idKunjungan) => {
  const visits = getStoredVisits();
  if (!idKunjungan) return null;
  const q = idKunjungan.trim().toUpperCase();
  return visits.find(v => v.idKunjungan.trim().toUpperCase() === q);
};

export const searchVisitsMock = (query) => {
  const visits = getStoredVisits();
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return visits.filter(v => 
    (v.idKunjungan && v.idKunjungan.toLowerCase().includes(q)) ||
    (v.nama && v.nama.toLowerCase().includes(q)) ||
    (v.instansi && v.instansi.toLowerCase().includes(q))
  );
};

/**
 * Search active visits (only guests currently visiting)
 * Status: SEDANG BERKUNJUNG (not SELESAI)
 */
export const searchActiveVisitsMock = (query) => {
  const visits = getStoredVisits();
  // Filter only active visitors (not checked out yet)
  const activeVisits = visits.filter(v => v.status !== 'SELESAI');
  
  if (!query || !query.trim()) return activeVisits;
  
  const q = query.trim().toLowerCase();
  return activeVisits.filter(v => 
    (v.nama && v.nama.toLowerCase().includes(q)) ||
    (v.instansi && v.instansi.toLowerCase().includes(q))
  );
};
