import React, { useState, useMemo } from 'react';
import { Users, UserCheck, CheckCircle2, Calendar, Search, Filter, RefreshCw, Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import GuestTable from '../components/GuestTable';
import Input from '../components/Input';
import Button from '../components/Button';
import DetailKunjunganPage from './DetailKunjunganPage';
import Loading from '../components/Loading';

export default function AdminDashboardPage({
  visits = [],
  loading = false,
  refreshVisits,
  onNavigate,
  showToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'SEDANG BERKUNJUNG' | 'SELESAI'
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL' | 'TODAY' | 'WEEK' | 'MONTH'

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Compute Statistics
  const stats = useMemo(() => {
    const total = visits.length;
    
    const active = visits.filter(v => 
      (v.status || '').toUpperCase() === 'SEDANG BERKUNJUNG' || 
      (v.status || '').toUpperCase() === 'CHECK-IN'
    ).length;

    const completed = visits.filter(v => 
      (v.status || '').toUpperCase() === 'SELESAI'
    ).length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayCount = visits.filter(v => {
      if (!v.jamKunjungan) return false;
      const vDate = new Date(v.jamKunjungan).toISOString().slice(0, 10);
      return vDate === todayStr;
    }).length;

    return { total, active, completed, todayCount };
  }, [visits]);

  // Filtered visits
  const filteredVisits = useMemo(() => {
    return visits.filter(visit => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = visit.nama?.toLowerCase().includes(q);
        const matchInstansi = visit.instansi?.toLowerCase().includes(q);
        const matchId = visit.idKunjungan?.toLowerCase().includes(q);
        const matchKeterangan = visit.keterangan?.toLowerCase().includes(q);
        if (!matchName && !matchInstansi && !matchId && !matchKeterangan) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        const statusNorm = (visit.status || '').toUpperCase();
        if (statusFilter === 'SEDANG BERKUNJUNG') {
          if (statusNorm !== 'SEDANG BERKUNJUNG' && statusNorm !== 'CHECK-IN') return false;
        } else if (statusFilter === 'SELESAI') {
          if (statusNorm !== 'SELESAI') return false;
        }
      }

      // 3. Date Filter
      if (dateFilter !== 'ALL' && visit.jamKunjungan) {
        const visitDate = new Date(visit.jamKunjungan);
        const now = new Date();

        if (dateFilter === 'TODAY') {
          if (visitDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === 'WEEK') {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (visitDate < oneWeekAgo) return false;
        } else if (dateFilter === 'MONTH') {
          if (visitDate.getMonth() !== now.getMonth() || visitDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      return true;
    });
  }, [visits, searchQuery, statusFilter, dateFilter]);

  const handleOpenDetail = (visit) => {
    setSelectedVisit(visit);
    setIsDetailOpen(true);
  };

  const handleQuickCheckout = (visit) => {
    onNavigate('checkout', { idKunjungan: visit.idKunjungan });
  };



  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-heading)' }}>
            Dashboard Monitoring Tamu
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Ringkasan &amp; Kontrol Aktivitas Kunjungan Tamu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={refreshVisits}
          >
            Refresh Data
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => onNavigate('checkin')}
          >
            Check-In Tamu Baru
          </Button>
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Kunjungan"
          value={stats.total}
          icon={Users}
          color="indigo"
          subtitle="Semua catatan kunjungan"
        />

        <StatCard
          title="Sedang Berkunjung"
          value={stats.active}
          icon={UserCheck}
          color="sky"
          subtitle="Tamu masih di lokasi"
        />

        <StatCard
          title="Kunjungan Selesai"
          value={stats.completed}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Tamu sudah check-out"
        />

        <StatCard
          title="Kunjungan Hari Ini"
          value={stats.todayCount}
          icon={Calendar}
          color="amber"
          subtitle={`Tanggal ${new Date().toLocaleDateString('id-ID')}`}
        />
      </div>

      {/* Search & Filter Control Bar */}
      <div
        className="p-5 rounded-2xl shadow-lg space-y-4 border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="w-full lg:w-96">
            <Input
              name="searchQuery"
              placeholder="Cari Nama, Instansi, atau ID Kunjungan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="w-full lg:w-auto flex flex-wrap items-center gap-3">
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium border"
                style={{ backgroundColor: 'var(--bg-card-deep)', color: 'var(--text-primary)', borderColor: 'var(--border-primary)' }}
              >
                <option value="ALL">Semua Status</option>
                <option value="SEDANG BERKUNJUNG">Sedang Berkunjung</option>
                <option value="SELESAI">Selesai</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Waktu:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium border"
                style={{ backgroundColor: 'var(--bg-card-deep)', color: 'var(--text-primary)', borderColor: 'var(--border-primary)' }}
              >
                <option value="ALL">Semua Tanggal</option>
                <option value="TODAY">Hari Ini</option>
                <option value="WEEK">7 Hari Terakhir</option>
                <option value="MONTH">Bulan Ini</option>
              </select>
            </div>

            {(searchQuery || statusFilter !== 'ALL' || dateFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setDateFilter('ALL');
                }}
                className="text-xs text-rose-400 hover:underline font-medium px-2 py-1"
              >
                Reset Filter
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <Loading text="Memuat daftar kunjungan..." />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <span>Tabel Kunjungan Terbaru</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border text-sky-500" style={{ backgroundColor: 'var(--bg-card-deep)', borderColor: 'var(--border-primary)' }}>
                {filteredVisits.length} Data
              </span>
            </h3>
          </div>

          <GuestTable
            visits={filteredVisits}
            onSelectVisit={handleOpenDetail}
            onQuickCheckout={handleQuickCheckout}
          />
        </div>
      )}

      {/* Detail Modal */}
      <DetailKunjunganPage
        visit={selectedVisit}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onQuickCheckout={handleQuickCheckout}
      />
    </div>
  );
}
