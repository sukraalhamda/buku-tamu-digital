import { useState, useEffect, useCallback } from 'react';
import { fetchGuestVisits } from '../services/apiService';
import { supabase } from '../lib/supabase';

export function useGuestStore() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info'
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
      showToast('Gagal memuat data kunjungan: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  // Hanya Supabase Auth — tidak ada kredensial hardcoded
  const loginAdmin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      showToast(error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message, 'error');
      return false;
    }
    if (data.user) {
      setAdminUser(data.user);
      showToast('Login berhasil! Selamat datang Admin.', 'success');
      return true;
    }
    return false;
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
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
