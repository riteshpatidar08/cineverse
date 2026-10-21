import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { logout } from '../../redux/slices/authSlice';
import { ShieldAlert, ArrowLeft, LogOut, Home } from 'lucide-react';

export default function RoleRoute({ allowedRoles = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((s) => s.auth);

  const isAuthenticated =
    authState.isAuthenticated || Cookies.get('isAuthenticated');
  const role = authState.role || Cookies.get('role') || 'customer';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = allowedRoles.length === 0 || allowedRoles.includes(role);

  if (!isAllowed) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0b0f19 0%, #17112b 100%)',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: 36,
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <ShieldAlert size={32} />
          </div>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: 10,
            }}
          >
            Access Restricted
          </h2>

          <p
            style={{
              fontSize: 14,
              color: '#94a3b8',
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Your current account role is{' '}
            <span
              style={{
                color: '#ec4899',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'rgba(236, 72, 153, 0.15)',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              {role}
            </span>
            . This administrative portal requires privileges for:{' '}
            <span style={{ color: '#a855f7', fontWeight: 600 }}>
              {allowedRoles.join(' or ')}
            </span>
            .
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px',
                borderRadius: 10,
                background: '#471b8e',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(71,27,142,0.4)',
              }}
            >
              <Home size={16} /> Return to CineVerse Home
            </Link>

            <button
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} /> Sign In with Different Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
