import { useState, useEffect, useCallback } from 'react';
import { fetchGuestVisits } from '../services/apiService';

export function useGuestStore() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(() => {
    return localStorage.getItem('besmindo_admin_logged') === 'true';
  });

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info' // 'success' | 'error' | 'info' | 'warning'
  });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const loadVisits = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGuestVisits();
      setVisits(data || []);
    } catch (err) {
      console.error('Error loading visits:', err);
      showToast('Gagal memuat data kunjungan', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const loginAdmin = (username, password) => {
    // Simple authentication logic for admin demo
    if (username === 'admin' && (password === 'admin123' || password === 'besmindo123')) {
      localStorage.setItem('besmindo_admin_logged', 'true');
      setAdminUser(true);
      showToast('Login berhasil! Selamat datang Admin PT Besmindo.', 'success');
      return true;
    } else {
      showToast('Username atau Password salah! (Default: admin / besmindo123)', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('besmindo_admin_logged');
    setAdminUser(false);
    showToast('Anda telah keluar dari akun Admin.', 'info');
  };

  return {
    visits,
    loading,
    adminUser,
    toast,
    showToast,
    hideToast,
    refreshVisits: loadVisits,
    loginAdmin,
    logoutAdmin
  };
}
