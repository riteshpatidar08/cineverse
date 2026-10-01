import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authenticated } from '../../redux/slices/authSlice';
import { getCityAndState } from '../../redux/slices/locationSlice';
import Cookies from 'js-cookie';
import axios from 'axios';
import { MapPin, ChevronDown, LogOut, Menu, X, Film } from 'lucide-react';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, name, email, role } = useSelector((s) => s.auth);
  const { currentCity } = useSelector((s) => s.location);

  async function getDistrict(lat, lon) {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      return {
        city: res.data?.address?.state_district || res.data?.address?.city || res.data?.address?.town,
        state: res.data?.address?.state,
      };
    } catch {
      return { city: null, state: null };
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        getDistrict(latitude, longitude).then(({ city, state }) => {
          if (city) {
            dispatch(getCityAndState({ city, state, latitude, longitude }));
          }
        });
      });
    }
  }, [dispatch]);

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function handleLogout() {
    Cookies.remove('id');
    Cookies.remove('email');
    Cookies.remove('role');
    
    Cookies.remove('isAuthenticated');
    dispatch(authenticated({ id: '', name: '', email: '', role: '', isAuthenticated: '' }));
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  }

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
  ];

  return (
    <nav
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 16px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          justifyContent: 'space-between',
        }}
      >
        {/* Left Side: Logo + Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                overflow: 'hidden',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(71,27,142,0.2)',
              }}
            >
              <img
                src="/logo.jpg"
                alt="CV"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span style="color:#fff;font-weight:800;font-size:14px">CV</span>';
                }}
              />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-h)', letterSpacing: '-0.4px' }}>
              cineVerse
            </span>
          </Link>

          {/* Location Badge */}
          {currentCity && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '3px 10px',
                fontSize: 12,
                color: 'var(--text-h)',
                fontWeight: 600,
              }}
            >
              <MapPin size={13} color="var(--primary)" />
              <span>{currentCity}</span>
            </div>
          )}
        </div>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--primary)' : 'var(--text)',
                  background: active ? 'rgba(71,27,142,0.08)' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Auth / Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  padding: '4px 12px 4px 4px',
                  cursor: 'pointer',
                  color: 'var(--text-h)',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {initials}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{name?.split(' ')[0]}</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s',
                    color: 'var(--text-muted)',
                  }}
                />
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: 220,
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-h)' }}>{name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{email}</div>
                    {role && (
                      <span
                        style={{
                          marginTop: 6,
                          display: 'inline-block',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'var(--bg-3)',
                          color: 'var(--primary)',
                          border: '1px solid var(--border)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {role}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '4px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        fontSize: 13,
                        color: 'var(--accent)',
                        fontWeight: 600,
                        background: 'none',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-3)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link
                to="/login"
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-h)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  transition: 'all 0.15s',
                }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'var(--primary)',
                  border: 'none',
                  transition: 'all 0.15s',
                  boxShadow: '0 2px 8px rgba(71,27,142,0.2)',
                }}
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              color: 'var(--text-h)',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg)',
            borderTop: '1px solid var(--border)',
            padding: '12px 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-h)',
                background: location.pathname === link.path ? 'var(--bg-3)' : 'transparent',
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
