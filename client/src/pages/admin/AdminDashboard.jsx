import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getAdminMetrics,
  getRevenueAnalytics,
  getTopPerforming,
} from '../../services/admin.api.js';
import {
  TrendingUp,
  CircleDollarSign,
  Ticket,
  Building2,
  Film,
  Users,
  Calendar,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [topPerforming, setTopPerforming] = useState({
    topMovies: [],
    topTheaters: [],
    topCities: [],
  });
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState('grossRevenue'); // 'grossRevenue' | 'ticketsCount'

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, aRes, tRes] = await Promise.all([
        getAdminMetrics(),
        getRevenueAnalytics({ limit: 14 }),
        getTopPerforming(),
      ]);

      if (mRes.data?.success) setMetrics(mRes.data.data);
      if (aRes.data?.success) setAnalytics(aRes.data.data);
      if (tRes.data?.success) setTopPerforming(tRes.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format currency in Indian Rupees
  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  // SVG Chart computation
  const chartData = analytics || [];
  const maxVal = Math.max(
    ...chartData.map((d) => d[chartMetric] || 0),
    chartMetric === 'grossRevenue' ? 10000 : 50
  );

  const chartHeight = 160;
  const chartWidth = 600;
  const points = chartData.map((d, i) => {
    const x = (i / (Math.max(chartData.length - 1, 1))) * chartWidth;
    const y = chartHeight - ((d[chartMetric] || 0) / maxVal) * (chartHeight - 20) - 10;
    return { x, y, ...d };
  });

  const svgPath =
    points.length > 0
      ? `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`
      : '';
  const areaPath =
    points.length > 0
      ? `${svgPath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`
      : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Page Header */}
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
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            Platform Performance Pulse <Sparkles size={22} color="#c084fc" />
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
            Consolidated commercial health, transaction ledger, and cinema partner analytics.
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
            to="/admin/movies"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 16px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Plus size={16} /> Add Master Movie
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 18,
        }}
      >
        {/* Gross Revenue Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(14, 19, 32, 0.8) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 14,
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.5px' }}>
              Gross Platform GMV
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <CircleDollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: '14px 0 6px', letterSpacing: '-0.5px' }}>
            {formatINR(metrics?.totalGrossRevenue)}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#34d399', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
              <TrendingUp size={13} style={{ marginRight: 2 }} /> 100%
            </span>{' '}
            settled via Razorpay
          </div>
        </div>

        {/* Platform Fees (16% Commission) Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(14, 19, 32, 0.8) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 14,
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#d8b4fe', letterSpacing: '0.5px' }}>
              Platform Convenience Fee
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: '14px 0 6px', letterSpacing: '-0.5px' }}>
            {formatINR(metrics?.totalPlatformConvenienceFees)}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            16% Net Platform Withholding
          </div>
        </div>

        {/* Total Tickets Sold Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(14, 19, 32, 0.8) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: 14,
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#f472b6', letterSpacing: '0.5px' }}>
              Tickets Issued
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6' }}>
              <Ticket size={18} />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: '14px 0 6px', letterSpacing: '-0.5px' }}>
            {metrics?.totalTicketsSold?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            Across {metrics?.totalBookings || 0} completed bookings
          </div>
        </div>

        {/* Cinema Theaters Count Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 19, 32, 0.8) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 14,
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#93c5fd', letterSpacing: '0.5px' }}>
              Active Theaters
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: '14px 0 6px', letterSpacing: '-0.5px' }}>
            {metrics?.totalTheaters || 0}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            {metrics?.activeTheaters || 0} Live &bull; {metrics?.totalMoviesPlaying || 0} Active Movies
          </div>
        </div>
      </div>

      {/* Main Analytics Row: Interactive SVG Chart & Quick Today Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 20,
        }}
      >
        {/* Revenue Analytics Chart */}
        <div
          style={{
            background: 'rgba(14, 19, 32, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 24,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                Transaction &amp; Ticket Velocity
              </h3>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Recent 14 days commercial performance
              </p>
            </div>

            <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.3)', padding: 3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setChartMetric('grossRevenue')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: chartMetric === 'grossRevenue' ? '#6366f1' : 'transparent',
                  color: chartMetric === 'grossRevenue' ? '#fff' : '#94a3b8',
                }}
              >
                Revenue (₹)
              </button>
              <button
                onClick={() => setChartMetric('ticketsCount')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: chartMetric === 'ticketsCount' ? '#a855f7' : 'transparent',
                  color: chartMetric === 'ticketsCount' ? '#fff' : '#94a3b8',
                }}
              >
                Tickets Sold
              </button>
            </div>
          </div>

          {/* SVG Vector Chart */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: 180, overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = chartHeight - pct * (chartHeight - 20) - 10;
                return (
                  <line
                    key={idx}
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Gradient Area */}
              {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

              {/* Stroke Line */}
              {svgPath && (
                <path
                  d={svgPath}
                  fill="none"
                  stroke={chartMetric === 'grossRevenue' ? '#818cf8' : '#c084fc'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Data Dots */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#6366f1"
                    strokeWidth="2"
                  />
                </g>
              ))}
            </svg>

            {/* Date Labels below */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                color: '#64748b',
                marginTop: 8,
              }}
            >
              {chartData.length > 0 && (
                <>
                  <span>{chartData[0].date}</span>
                  {chartData.length > 1 && (
                    <span>{chartData[Math.floor(chartData.length / 2)].date}</span>
                  )}
                  <span>{chartData[chartData.length - 1].date}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Today's Live Counter & Quick Links */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Today Live Stats */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(14, 19, 32, 0.9) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 22,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Today's Live Counters
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>TODAY'S ORDERS</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                  {metrics?.todayBookingsCount || 0}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>TODAY'S REVENUE</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#34d399', marginTop: 4 }}>
                  {formatINR(metrics?.todayRevenue || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div
            style={{
              background: 'rgba(14, 19, 32, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 22,
              flex: 1,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 14 }}>
              Quick Platform Controls
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Link
                to="/admin/theaters"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Building2 size={16} color="#60a5fa" />
                <span>Onboard Cinema</span>
              </Link>

              <Link
                to="/admin/users"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Users size={16} color="#a855f7" />
                <span>Manage Users</span>
              </Link>

              <Link
                to="/admin/finance"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <CircleDollarSign size={16} color="#34d399" />
                <span>Finance &amp; Payouts</span>
              </Link>

              <Link
                to="/admin/coupons"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Ticket size={16} color="#f472b6" />
                <span>Issue Coupons</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Sections: Top Movies & Top Theaters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20,
        }}
      >
        {/* Top Movies Card */}
        <div
          style={{
            background: 'rgba(14, 19, 32, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Top Performing Movies</h3>
            <Link to="/admin/movies" style={{ fontSize: 12, color: '#a855f7', fontWeight: 600, textDecoration: 'none' }}>
              View Catalog &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topPerforming.topMovies && topPerforming.topMovies.length > 0 ? (
              topPerforming.topMovies.map((movie, idx) => (
                <div
                  key={movie.movieId || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : '#b45309',
                      color: '#0f172a',
                      fontWeight: 800,
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {idx + 1}
                  </span>

                  <img
                    src={movie.poster || 'https://via.placeholder.com/40'}
                    alt={movie.title}
                    style={{
                      width: 36,
                      height: 48,
                      borderRadius: 6,
                      objectFit: 'cover',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {movie.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      {movie.ticketsSold || 0} tickets &bull; {movie.bookingCount || 0} bookings
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>
                      {formatINR(movie.revenue)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 24, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                No movie revenue activity recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Top Partner Theaters Card */}
        <div
          style={{
            background: 'rgba(14, 19, 32, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Top Cinema Properties</h3>
            <Link to="/admin/theaters" style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>
              View All Theaters &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topPerforming.topTheaters && topPerforming.topTheaters.length > 0 ? (
              topPerforming.topTheaters.map((theater, idx) => (
                <div
                  key={theater.theaterId || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 14,
                    }}
                  >
                    <Building2 size={18} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {theater.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      {theater.city} &bull; {theater.ticketsSold || 0} tickets sold
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>
                      {formatINR(theater.revenue)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 24, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                No cinema partner collection figures yet.
              </div>
            )}
          </div>
        </div>
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
