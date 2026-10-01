import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, verifyOtp, resendOtp, verify } from '../services/auth.api.js';
import { authenticated } from '../../redux/slices/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';

function Login() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await login(formData);
      const results = await verify();
      let response = { ...res.data, ...results.data };
      dispatch(authenticated(response));
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await verifyOtp({ otp, id: userId });
      setSuccessMessage('Verification successful! Logging in...');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || 'OTP verification failed. Please try again.'
      );
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
          justifyContent: 'space-between',
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
                Exclusive Cinema Pass
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-h)', lineHeight: 1.2, margin: '0 0 16px 0', letterSpacing: '-0.8px' }}>
            Book Movie Tickets &amp; Unlock Special Perks
          </h1>

          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 36px 0', maxWidth: 460 }}>
            Sign in to access exclusive bank discounts, zero booking convenience fee, and instant seat choices across top cinemas.
          </p>

          {/* Offers list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, lineHeight: 1, background: 'var(--bg)', padding: 10, borderRadius: 10, border: '1px solid var(--border)' }}>🎟️</span>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>Buy 1 Get 1 Free Weekend Offers</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Applicable on HDFC, ICICI &amp; SBI Credit Cards</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, lineHeight: 1, background: 'var(--bg)', padding: 10, borderRadius: 10, border: '1px solid var(--border)' }}>🍿</span>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>Free Food &amp; Beverage Upgrades</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Complimentary Large Popcorn on orders above ₹499</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, lineHeight: 1, background: 'var(--bg)', padding: 10, borderRadius: 10, border: '1px solid var(--border)' }}>⚡</span>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>Instant Refunds &amp; Easy Cancellations</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Cancel up to 2 hours before showtime with zero penalty</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 40 }}>
          Protected by CineVerse 256-bit secure checkout
        </div>
      </div>

      {/* Right Form Section */}
      <div
        style={{
          flex: '1 1 400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 32px',
          minHeight: '100vh',
          boxSizing: 'border-box',
          background: 'var(--bg)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {!otpRequired ? (
            <>
              <div style={{ marginBottom: 28, textAlign: 'left' }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-h)', margin: 0 }}>Sign In to CineVerse</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Enter your email and password to proceed</p>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Email Address
                  </label>
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
                        transition: 'border-color 0.15s',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <svg
                      width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                      style={{ position: 'absolute', left: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      required
                      onChange={handleChange}
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      style={{
                        width: '100%',
                        background: 'var(--bg-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '12px 42px 12px 42px',
                        color: 'var(--text-h)',
                        fontSize: 14,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontSize: 12,
                        padding: 4,
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
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
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 28, textAlign: 'left' }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-h)', margin: 0 }}>Security Verification</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Enter 6-digit verification code</p>
              </div>

              <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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

                <input
                  required
                  onChange={(e) => setOtp(e.target.value)}
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  style={{
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '14px',
                    color: 'var(--text-h)',
                    fontSize: 20,
                    textAlign: 'center',
                    letterSpacing: 8,
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontWeight: 800,
                  }}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '14px',
                    borderRadius: 8,
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            </>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;
