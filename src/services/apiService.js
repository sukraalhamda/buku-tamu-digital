/**
 * API Service for Buku Tamu Digital
 * Handles communication with n8n Webhooks & Google Sheets automation middleware.
 * If VITE_N8N_BASE_URL environment variable is not defined or request fails, 
 * it automatically falls back to local storage mock mode.
 */

import { addVisitMock, checkoutVisitMock, getStoredVisits, getVisitByIdMock, searchVisitsMock } from './mockStorage';
import { generateVisitId } from '../utils/formatters';

const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL?.trim();

/**
 * Check-In Guest Service
 * Sends POST request to n8n Webhook /webhook/tamu-checkin
 */
export const checkInGuest = async (formData) => {
  const generatedId = generateVisitId();
  const payload = {
    idKunjungan: generatedId,
    nama: formData.nama,
    instansi: formData.instansi,
    jamKunjungan: formData.jamKunjungan || new Date().toISOString(),
    tandaTangan: formData.tandaTangan,
    keterangan: formData.keterangan
  };

  // If n8n Webhook Base URL is configured, try sending to n8n first
  if (N8N_BASE_URL) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/tamu-checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error from n8n: ${response.status} ${response.statusText}`);
      }

      const resData = await response.json();
      
      // Save locally as well for immediate UI sync
      const savedData = addVisitMock(resData?.data || payload);
      return {
        success: true,
        data: savedData,
        viaN8n: true,
        message: 'Check-In berhasil tercatat via n8n & Google Sheets!'
      };
    } catch (err) {
      console.warn('n8n Webhook connection error, falling back to local mode:', err.message);
      // Fall back to local mock storage
      const savedData = addVisitMock(payload);
      return {
        success: true,
        data: savedData,
        viaN8n: false,
        message: 'Check-In berhasil tercatat (Mode Offline/Local Backup)'
      };
    }
  }

  // Pure Mock local mode
  const savedData = addVisitMock(payload);
  return {
    success: true,
    data: savedData,
    viaN8n: false,
    message: 'Check-In berhasil tercatat secara lokal.'
  };
};

/**
 * Check-Out Guest Service
 * Sends POST request to n8n Webhook /webhook/tamu-checkout
 */
export const checkOutGuest = async (checkoutData) => {
  const payload = {
    idKunjungan: checkoutData.idKunjungan,
    jamKeluar: checkoutData.jamKeluar || new Date().toISOString(),
    tandaTanganKeluar: checkoutData.tandaTanganKeluar
  };

  if (N8N_BASE_URL) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/tamu-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error from n8n: ${response.status} ${response.statusText}`);
      }

      const resData = await response.json();
      const updatedData = checkoutVisitMock(resData?.data || payload);
      return {
        success: true,
        data: updatedData,
        viaN8n: true,
        message: 'Check-Out berhasil diproses via n8n!'
      };
    } catch (err) {
      console.warn('n8n Webhook checkout error, falling back to local mode:', err.message);
      const updatedData = checkoutVisitMock(payload);
      return {
        success: true,
        data: updatedData,
        viaN8n: false,
        message: 'Check-Out berhasil diproses (Mode Offline/Local Backup)'
      };
    }
  }

  // Pure Mock local mode
  const updatedData = checkoutVisitMock(payload);
  return {
    success: true,
    data: updatedData,
    viaN8n: false,
    message: 'Check-Out berhasil diproses.'
  };
};

/**
 * Fetch List of All Guest Visits
 */
export const fetchGuestVisits = async () => {
  if (N8N_BASE_URL) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/tamu-list`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const resData = await response.json();
        if (Array.isArray(resData)) return resData;
        if (resData.data && Array.isArray(resData.data)) return resData.data;
      }
    } catch (err) {
      console.warn('Could not fetch from n8n webhook list, returning local stored visits:', err.message);
    }
  }
  return getStoredVisits();
};

/**
 * Get Visit Detail by ID Kunjungan
 */
export const fetchVisitById = async (idKunjungan) => {
  return getVisitByIdMock(idKunjungan);
};

/**
 * Search Visits by Name, Instansi, or ID
 */
export const searchVisits = async (query) => {
  return searchVisitsMock(query);
};

/**
 * Search Active Visits (guests currently visiting - not checked out)
 */
export const searchActiveVisits = async (query) => {
  // Import the new function
  const { searchActiveVisitsMock } = await import('./mockStorage');
  return searchActiveVisitsMock(query);
};

