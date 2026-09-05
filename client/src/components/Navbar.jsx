import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { useSelector, useDispatch } from 'react-redux';
import { authenticated } from '../../redux/slices/authSlice';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Navbar() {
  const [currentLoc, setCurrentLoc] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, name, email, role } = useSelector((state) => state.auth);

  async function getDistrict(lat, lon) {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const city = res.data?.address?.state_district;
    const state = res.data?.address?.state;
    return { city, state };
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getDistrict(latitude, longitude).then(({ city, state }) => {
        setCurrentLoc(city);
        setCurrentState(state);
      });
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isDark, setIsDark] = useState(() => {
    return (
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark'
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  function handleLogout() {
    Cookies.remove('id');
    Cookies.remove('email');
    Cookies.remove('role');
    Cookies.remove('isAuthenticated');
    dispatch(
      authenticated({ id: '', name: '', email: '', role: '', isAuthenticated: null })
    );
    setDropdownOpen(false);
    navigate('/');
  }

  const navLinks = [
    { name: 'Browse', path: '/browse' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'Pricing', path: '/pricing' },
  ];

  // Initials fallback for avatar
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <nav className="sticky top-0 z-50 w-full glass border-x-0 border-t-0 border-b border-white/10 dark:border-white/5 py-3 px-4 md:px-8 flex justify-between items-center transition-all duration-300">

      {/* Brand Logo & Name + Location */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group decoration-none">
          <Avatar className="h-9 w-9 ring-1 ring-primary/30 group-hover:ring-primary/60 transition-all duration-300">
            <AvatarImage src="/logo.jpg" alt="cineVerse logo" className="object-cover" />
            <AvatarFallback className="font-bold bg-primary/20 text-primary text-xs">CV</AvatarFallback>
          </Avatar>
          <span className="text-lg font-bold tracking-wider text-text-h">Cineverse</span>
        </Link>

        {/* Divider + Location */}
        {currentLoc && (
          <>
            <div className="h-8 w-px bg-white/20 dark:bg-white/10" />
            <div className="hidden md:flex items-center gap-1.5">
              <svg className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-text-h">{currentLoc}</span>
                {currentState && (
                  <span className="text-xs text-primary/80">{currentLoc}, {currentState}</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 decoration-none ${
                isActive ? 'text-primary dark:text-accent' : 'text-text/70 hover:text-text-h'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="h-8 w-8 rounded-full border border-white/10 dark:border-white/5 flex items-center justify-center text-text hover:text-text-h"
          title="Toggle Theme"
        >
          {isDark ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </Button>

        {/* Auth: Avatar Dropdown or Login/Signup */}
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/40 hover:ring-primary transition-all duration-300">
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <svg
                className={`h-3.5 w-3.5 text-text/60 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Panel */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl glass border border-white/10 dark:border-white/5 shadow-xl py-1 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/10 dark:border-white/5">
                  <p className="text-sm font-semibold text-text-h truncate">{name}</p>
                  <p className="text-xs text-text/60 truncate mt-0.5">{email}</p>
                 
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-text/80 hover:text-text-h hover:bg-white/5 transition-colors decoration-none"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  <Link
                    to="/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-text/80 hover:text-text-h hover:bg-white/5 transition-colors decoration-none"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    My Bookings
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-white/10 dark:border-white/5 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wider">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm" className="font-bold text-xs uppercase tracking-wider h-8">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}
