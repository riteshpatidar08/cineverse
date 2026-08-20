import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';

export default function Navbar() {
  const location = useLocation();

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
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

  const navLinks = [
    { name: 'Browse', path: '/browse' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-x-0 border-t-0 border-b border-white/10 dark:border-white/5 py-3 px-4 md:px-8 flex justify-between items-center transition-all duration-300">
      
      {/* Brand Logo & Name */}
      <Link to="/" className="flex items-center gap-2 group decoration-none">
        <Avatar className="h-9 w-9 ring-1 ring-primary/30 group-hover:ring-primary/60 transition-all duration-300">
          <AvatarImage src="/logo.jpg" alt="cineVerse logo" className="object-cover" />
          <AvatarFallback className="font-bold bg-primary/20 text-primary text-xs">CV</AvatarFallback>
        </Avatar>
        <span className="text-lg font-bold tracking-wider text-text-h">
          cineVerse
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 decoration-none ${
                isActive
                  ? 'text-primary dark:text-accent'
                  : 'text-text/70 hover:text-text-h'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="h-8 w-8 rounded-full border border-white/10 dark:border-white/5 flex items-center justify-center text-text hover:text-text-h"
          title="Toggle Theme"
        >
          {isDark ? (
            // Sun Icon
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            // Moon Icon
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </Button>

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
      </div>

    </nav>
  );
}
