import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'var(--bg-2)',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '40px 16px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 32,
          }}
        >
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              to="/"
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: 'var(--text-h)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/logo.jpg"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt="CV"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span style="color:#fff;font-weight:800;font-size:12px">CV</span>';
                  }}
                />
              </div>
              cineVerse
            </Link>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 240 }}>
              The ultimate destination for seamless movie ticket booking, seat choices, and cinema deals across top theaters.
            </p>
          </div>

          {/* Links Columns */}
          {[
            {
              title: 'Explore',
              links: [
                { label: 'Home', path: '/' },
                { label: 'Now Showing Movies', path: '/movies' },
              ],
            },
            {
              title: 'Account',
              links: [
                { label: 'Log In', path: '/login' },
                { label: 'Create Account', path: '/signup' },
              ],
            },
            {
              title: 'Experience',
              links: [
                { label: 'IMAX 3D Screens', path: '/movies' },
                { label: '4DX & Dolby Atmos', path: '/movies' },
              ],
            },
          ].map((section) => (
            <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-h)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                {section.title}
              </span>
              {section.links.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 20,
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            © {year} CineVerse Inc. All rights reserved. Crafted for cinema lovers.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
            <span>•</span>
            <span>v1.0 Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
