import React, { useState, useEffect } from 'react';
import { useGuestStore } from './hooks/useGuestStore';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import WelcomePage from './pages/WelcomePage';
import CheckInPage from './pages/CheckInPage';
import CheckInSuccessPage from './pages/CheckInSuccessPage';
import CheckOutPage from './pages/CheckOutPage';
import CheckOutSuccessPage from './pages/CheckOutSuccessPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  const {
    visits,
    loading,
    adminUser,
    toast,
    showToast,
    hideToast,
    refreshVisits,
    loginAdmin,
    logoutAdmin
  } = useGuestStore();

  // Navigation State
  const [currentPage, setCurrentPage] = useState('welcome');
  const [pageParams, setPageParams] = useState({});

  // Detect QR scan via URL hash #checkin / #checkout → navigate accordingly
  useEffect(() => {
    if (window.location.hash === '#checkin') {
      setCurrentPage('checkin');
      setPageParams({ isQrScan: true });
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } else if (window.location.hash === '#checkout') {
      setCurrentPage('checkout');
      setPageParams({ isQrScan: true });
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const handleNavigate = (page, params = {}) => {
    // Protected admin routes check
    if ((page === 'admin-dashboard' || page === 'history') && !adminUser) {
      setCurrentPage('admin-login');
      setPageParams(params);
      showToast('Silakan login terlebih dahulu untuk mengakses area Admin.', 'warning');
      return;
    }

    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    handleNavigate('welcome');
  };

  // Determine layout context
  const isAdminView = (currentPage === 'admin-dashboard' || currentPage === 'history') && adminUser;

  if (isAdminView) {
    return (
      <AdminLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleAdminLogout}
        toast={toast}
        onCloseToast={hideToast}
      >
        {currentPage === 'admin-dashboard' && (
          <AdminDashboardPage
            visits={visits}
            loading={loading}
            refreshVisits={refreshVisits}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            visits={visits}
            loading={loading}
            refreshVisits={refreshVisits}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        )}
      </AdminLayout>
    );
  }

  return (
    <MainLayout
      toast={toast}
      onCloseToast={hideToast}
      onNavigateAdmin={() => handleNavigate(adminUser ? 'admin-dashboard' : 'admin-login')}
    >
      {currentPage === 'welcome' && (
        <WelcomePage
          onNavigate={handleNavigate}
          showToast={showToast}
        />
      )}

      {currentPage === 'checkin' && (
        <CheckInPage
          onNavigate={handleNavigate}
          showToast={showToast}
          refreshVisits={refreshVisits}
          isReadOnly={!!pageParams.isQrScan}
        />
      )}

      {currentPage === 'checkin-success' && (
        <CheckInSuccessPage
          visit={pageParams.visit}
          onNavigate={handleNavigate}
          showToast={showToast}
        />
      )}

      {currentPage === 'checkout' && (
        <CheckOutPage
          initialId={pageParams.idKunjungan || ''}
          onNavigate={handleNavigate}
          showToast={showToast}
          refreshVisits={refreshVisits}
          isQrScan={!!pageParams.isQrScan}
        />
      )}

      {currentPage === 'checkout-success' && (
        <CheckOutSuccessPage
          visit={pageParams.visit}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === 'admin-login' && (
        <AdminLoginPage
          onLogin={loginAdmin}
          onNavigate={handleNavigate}
          showToast={showToast}
        />
      )}
    </MainLayout>
  );
}
