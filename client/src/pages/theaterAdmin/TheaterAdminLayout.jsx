import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { getTheaterProfile } from '../../services/theaterAdmin.api.js';
import {
  LayoutDashboard,
  Grid,
  CalendarDays,
  Armchair,
  QrCode,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Building2,
  ArrowUpRight,
  Sparkles,
  MapPin,
} from 'lucide-react';

export default function TheaterAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theaterInfo, setTheaterInfo] = useState(null);
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getTheaterProfile()
      .then((res) => {
        if (res.data?.success) setTheaterInfo(res.data.data);
      })
      .catch((err) => console.log('Profile fetch error:', err));
  }, []);

  const navItems = [
    { name: 'Live Operations', path: '/theater-admin/dashboard', icon: LayoutDashboard },
    { name: 'Auditorium Screens', path: '/theater-admin/screens', icon: Grid },
    { name: 'Show Scheduler', path: '/theater-admin/shows', icon: CalendarDays },
    { name: 'Live Seat Inventory', path: '/theater-admin/inventory', icon: Armchair },
    { name: 'Gate Scanner & POS', path: '/theater-admin/scanner', icon: QrCode },
    { name: 'Occupancy & Payouts', path: '/theater-admin/reports', icon: BarChart3 },
    { name: 'Theater Profile', path: '/theater-admin/profile', icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0a0d14',
        color: '#e2e8f0',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 40,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 280,
          background: 'linear-gradient(180deg, #0e1320 0%, #0a0d14 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          transition: 'transform 0.25s ease-in-out',
        }}
        className={`theater-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand & Cinema Partner Badge */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link
              to="/theater-admin/dashboard"
              style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 16,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
                  {theaterInfo?.name || 'Partner Cinema'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#34d399',
                      background: 'rgba(52, 211, 153, 0.15)',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {theaterInfo?.city || 'Jaipur'}
                  </span>
                </div>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md-hidden"
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'none' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ flex: 1, padding: '18px 12px', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#64748b',
              letterSpacing: '0.8px',
              padding: '0 12px 10px',
            }}
          >
            Auditorium Operations
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 14px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon
                    size={18}
                    color={isActive ? '#34d399' : '#64748b'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {isActive && <ChevronRight size={14} color="#34d399" />}
                </NavLink>
              );
            })}
          </div>

          {/* Super Admin Backlink (if user has admin role) */}
          {auth.role === 'admin' && (
            <div style={{ marginTop: 24, padding: '0 4px' }}>
              <Link
                to="/admin/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>Back to Super Admin</span>
                <ArrowUpRight size={14} color="#a855f7" />
              </Link>
            </div>
          )}
        </div>

        {/* User Card */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 13,
                color: '#fff',
              }}
            >
              {auth.name ? auth.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {auth.name || 'Theatre Manager'}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {auth.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '9px 12px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LogOut size={14} /> Sign Out Partner
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header
          style={{
            height: 64,
            background: 'rgba(14, 19, 32, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 4, display: 'none' }}
              className="md-visible"
            >
              <Menu size={22} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Cinema Operations</span>
              <ChevronRight size={14} color="#64748b" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                {navItems.find((i) => i.path === location.pathname)?.name || 'Console'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Customer App <ArrowUpRight size={13} />
            </Link>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              Box Office Live
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '28px', maxWidth: 1400, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .theater-sidebar {
            position: fixed !important;
            transform: translateX(-100%);
          }
          .theater-sidebar.mobile-open {
            transform: translateX(0);
          }
          .md-hidden { display: block !important; }
          .md-visible { display: block !important; }
        }
      `}</style>
    </div>
  );
}
