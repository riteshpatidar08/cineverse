import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/auth.api.js';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData);
      setSuccessMessage('Registration successful! You can now log in.');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', width: '100%', display: 'flex', flexWrap: 'wrap', color: 'var(--text)' }}>
      
      {/* Left Full-Viewport Offer Section */}
      <div
        style={{
          flex: '1 1 450px',
          background: 'linear-gradient(135deg, var(--bg-2) 0%, rgba(71,27,142,0.06) 100%)',
          borderRight: '1px solid var(--border)',
          padding: '60px 48px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <div>
          {/* Brand Header */}
          <div style={{ marginBottom: 32 }}>
            <Link to="/" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-h)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 800 }}>
                CV
              </div>
              cineVerse
            </Link>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: 'var(--primary)', color: '#fff', padding: '4px 12px', borderRadius: 20, letterSpacing: '0.6px', display: 'inline-block' }}>
                Welcome Pass Voucher
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-h)', lineHeight: 1.2, margin: '0 0 16px 0', letterSpacing: '-0.8px' }}>
            Join CineVerse &amp; Get ₹100 Off Your First Ticket
          </h1>

          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 36px 0', maxWidth: 460 }}>
            Create your free account in 30 seconds to unlock priority premiere seat booking, food &amp; beverage combos, and loyalty cashbacks.
          </p>

          {/* Offers list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, lineHeight: 1, background: 'var(--bg)', padding: 10, borderRadius: 10, border: '1px solid var(--border)' }}>🎬</span>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>Flat ₹100 Discount Voucher</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Instant welcome code applied at checkout</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, lineHeight: 1, background: 'var(--bg)', padding: 10, borderRadius: 10, border: '1px solid var(--border)' }}>💳</span>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>Partner Bank Cashback Perks</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Save extra with HDFC, ICICI, SBI &amp; Paytm UPI</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, lineHeight: 1, background: 'var(--bg)', padding: 10, borderRadius: 10, border: '1px solid var(--border)' }}>🛡️</span>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>Zero Booking Fee &amp; Instant Refunds</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Hassle-free ticket changes &amp; seat swaps</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 40 }}>
          Join 2,000,000+ movie lovers booking with CineVerse
        </div>
      </div>

      {/* Right Form Section */}
      <div
        style={{
          flex: '1 1 400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          padding: '60px 32px',
          minHeight: '100vh',
          boxSizing: 'border-box',
          background: 'var(--bg)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 28, textAlign: 'left' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-h)', margin: 0 }}>Create Free Account</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Enter details below to set up your profile</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {errorMessage && (
              <div style={{ fontSize: 13, color: 'var(--accent)', background: '#ff475712', padding: '12px 16px', borderRadius: 8, border: '1px solid #ff475730' }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div style={{ fontSize: 13, color: '#22c55e', background: '#22c55e12', padding: '12px 16px', borderRadius: 8, border: '1px solid #22c55e30' }}>
                {successMessage}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg
                  width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  style={{ position: 'absolute', left: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  required
                  onChange={handleChange}
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  style={{
                    width: '100%',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '12px 14px 12px 42px',
                    color: 'var(--text-h)',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg
                  width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  style={{ position: 'absolute', left: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  required
                  onChange={handleChange}
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  style={{
                    width: '100%',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '12px 14px 12px 42px',
                    color: 'var(--text-h)',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Mobile Number</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg
                  width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  style={{ position: 'absolute', left: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <input
                  required
                  onChange={handleChange}
                  type="tel"
                  name="mobileNo"
                  placeholder="10-digit mobile number"
                  value={formData.mobileNo}
                  style={{
                    width: '100%',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '12px 14px 12px 42px',
                    color: 'var(--text-h)',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Password</label>
                <input
                  required
                  onChange={handleChange}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  style={{
                    width: '100%',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '12px',
                    color: 'var(--text-h)',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Confirm</label>
                <input
                  required
                  onChange={handleChange}
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  style={{
                    width: '100%',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '12px',
                    color: 'var(--text-h)',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: 8,
                padding: '14px',
                borderRadius: 8,
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 14px rgba(71,27,142,0.25)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Log In
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Signup;
