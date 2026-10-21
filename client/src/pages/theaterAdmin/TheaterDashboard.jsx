import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getTheaterSummary,
  getTodaySchedule,
} from '../../services/theaterAdmin.api.js';
import {
  Armchair,
  Calendar,
  CircleDollarSign,
  Ticket,
  Clock,
  Layers,
  Sparkles,
  QrCode,
  RefreshCw,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function TheaterDashboard() {
  const [summary, setSummary] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, tRes] = await Promise.all([
        getTheaterSummary(),
        getTodaySchedule(),
      ]);

      if (sRes.data?.success) setSummary(sRes.data.data);
      if (tRes.data?.success) setTodaySchedule(tRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px', display: 'flex', alignItems: 'center', gap: 10 }}>
            {summary?.theaterName || 'Theater Operations Dashboard'} <Sparkles size={20} color="#34d399" />
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Real-time auditorium capacity, today's schedule, gate check-ins, and box office ticket metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={fetchData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 14px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>

          <Link
            to="/theater-admin/scanner"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 16px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            <QrCode size={16} /> Gate QR Scanner &amp; POS
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {/* Today Gross Box Office Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(14, 19, 32, 0.8) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6ee7b7', letterSpacing: '0.5px' }}>
              Today's Gross Box Office
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <CircleDollarSign size={17} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: '12px 0 4px', letterSpacing: '-0.5px' }}>
            {formatINR(summary?.todayGrossRevenue)}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            {summary?.todayBookingsCount || 0} completed orders today
          </div>
        </div>

        {/* Live Occupancy Rate Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(14, 19, 32, 0.8) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.5px' }}>
              Today's Occupancy Rate
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <TrendingUp size={17} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: '12px 0 4px', letterSpacing: '-0.5px' }}>
            {summary?.currentOccupancyRate || 0}%
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            Live across today's screenings
          </div>
        </div>

        {/* Tickets Sold Today Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(14, 19, 32, 0.8) 100%)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#fde047', letterSpacing: '0.5px' }}>
              Today's Tickets Sold
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
              <Ticket size={17} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: '12px 0 4px', letterSpacing: '-0.5px' }}>
            {summary?.todayTicketsSold || 0}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            Patrons checked-in &amp; admitted
          </div>
        </div>

        {/* Scheduled Screenings Count Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(14, 19, 32, 0.8) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#d8b4fe', letterSpacing: '0.5px' }}>
              Today's Screenings
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <Calendar size={17} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: '12px 0 4px', letterSpacing: '-0.5px' }}>
            {summary?.todayShowsCount || 0}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            Across {summary?.activeScreensCount || 1} screens
          </div>
        </div>
      </div>

      {/* Today's Schedule with Live Capacity Meters */}
      <div
        style={{
          background: 'rgba(14, 19, 32, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
              Today's Screenings &amp; Real-Time Capacity
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              Inspect seat inventory, occupied seats, and live check-in progress
            </p>
          </div>

          <Link
            to="/theater-admin/shows"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#34d399',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Show Scheduler <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            Loading today's schedule...
          </div>
        ) : todaySchedule.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 12,
              border: '1px dashed rgba(255,255,255,0.08)',
            }}
          >
            <Calendar size={32} color="#64748b" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>No Shows Scheduled For Today</h4>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Head over to Show Scheduler to book showtimes for today.
            </p>
            <Link
              to="/theater-admin/shows"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 14,
                padding: '8px 16px',
                borderRadius: 8,
                background: '#10b981',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Plus size={14} /> Schedule Show
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {todaySchedule.map((show) => {
              const occupancy = show.occupancyPercentage || 0;
              const meterColor =
                occupancy > 80 ? '#22c55e' : occupancy > 40 ? '#3b82f6' : '#eab308';

              return (
                <div
                  key={show.showId}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 12,
                    padding: 18,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  {/* Left: Movie & Screen */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 240 }}>
                    <img
                      src={show.moviePoster || 'https://via.placeholder.com/45'}
                      alt={show.movieTitle}
                      style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>
                        {show.movieTitle}
                      </h4>
                      <div style={{ fontSize: 12, color: '#34d399', fontWeight: 600, marginTop: 2 }}>
                        {show.screenName}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} />
                        {show.startTime ? new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </div>
                    </div>
                  </div>

                  {/* Center: Capacity Meter */}
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: '#94a3b8' }}>
                        Booked: <strong>{show.bookedSeats}</strong> / {show.totalSeats} seats
                      </span>
                      <span style={{ color: meterColor, fontWeight: 800 }}>
                        {occupancy}% Occupied
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: 8,
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${occupancy}%`,
                          height: '100%',
                          background: meterColor,
                          borderRadius: 4,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>

                    {/* Seat breakdown labels */}
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b', marginTop: 8 }}>
                      <span>Available: {show.availableSeats}</span>
                      <span>Locked: {show.lockedSeats}</span>
                      <span>Blocked (VIP/Maint): {show.blockedSeats}</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Link
                      to={`/theater-admin/inventory?showId=${show.showId}`}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#818cf8',
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Armchair size={14} /> Live Seat Map
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
