import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login, verifyOtp, resendOtp } from '../services/auth.api.js';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [userId, setUserId] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await login(formData);
      console.log('Login Response:', res.data);

      if (res.data?.otpRequired) {
        setOtpRequired(true);
        setUserId(res.data.userId);
        setSuccessMessage('Two-factor authentication code sent to your email.');
      } else {
        setSuccessMessage('Logged in successfully! Welcome back.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
          'Login failed. Please check your credentials.'
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
      const res = await verifyOtp({ otp, id: userId });
      console.log('Verify OTP Response:', res.data);
      setSuccessMessage('Verification successful! Logging in...');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
          'OTP verification failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setResendLoading(true);

    try {
      const res = await resendOtp({ email: formData.email });
      setSuccessMessage('Verification code resent successfully.');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
          'Failed to resend code. Please wait before retrying.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-bg text-text overflow-x-hidden font-sans transition-colors duration-500">
      {/* Left Panel: Cinematic Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-5/12 relative flex-col justify-between p-12 border-r border-border bg-white/[0.01] dark:bg-black/20 overflow-hidden select-none">
        {/* Glow Effects */}
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary/15 blur-3xl animate-float-medium pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <Link
          to="/"
          className="flex items-center gap-3.5 z-10 group decoration-none"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-primary/30 opacity-60 blur-md group-hover:opacity-85 transition duration-500" />
            <Avatar className="h-10 w-10 ring-2 ring-white/10 relative">
              <AvatarImage
                src="/logo.jpg"
                alt="cineVerse logo"
                className="object-cover"
              />
              <AvatarFallback className="font-bold bg-primary/20 text-primary text-xs">
                CV
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="text-xl font-bold tracking-wider text-text-h">
            cineVerse
          </span>
        </Link>

        {/* Feature Copy */}
        <div className="my-auto z-10 max-w-sm space-y-6 text-left">
          <Badge
            variant="primary"
            className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px]"
          >
            ⚡ Welcome Back
          </Badge>

          <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight m-0 text-text-h">
            Resume Your <br />
            <span className="text-primary">Cinematic Quest</span>
          </h1>

          <p className="text-xs xl:text-sm text-text/80 leading-relaxed m-0">
            Log in to manage your watchlists, access your booking tickets,
            review recently watched shows, and get personalized cinema
            suggestions.
          </p>

          {/* Glassmorphic director quote card */}
          <div className="glass border-border p-4 rounded-xl relative overflow-hidden shadow-xl hover:border-primary/20 transition-all duration-300">
            <p className="text-[11px] italic text-text-h/95 leading-relaxed m-0 mb-2">
              "The cinema has no boundary; it is a ribbon of dream."
            </p>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold text-white">
                OW
              </div>
              <div>
                <p className="text-[9px] font-bold text-text-h m-0">
                  Orson Welles
                </p>
                <p className="text-[8px] text-text/50 m-0">
                  Actor, Director & Writer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info inside split pane */}
        <div className="flex items-center justify-between pt-6 z-10 text-[10px] text-text/50 font-medium">
          <span>© {new Date().getFullYear()} cineVerse</span>
          <div className="flex gap-3">
            <Link
              to="/privacy"
              className="hover:text-text-h transition-colors duration-300 decoration-none"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-text-h transition-colors duration-300 decoration-none"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-7/12 xl:w-7/12 flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-bg min-h-screen">
        {/* Glow Effects (Mobile or decorative) */}
        <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none lg:opacity-75" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none lg:opacity-75" />

        <div className="w-full max-w-lg z-10 space-y-6">
          {/* Mobile Header Logo */}
          <div className="flex flex-col items-center lg:hidden space-y-2">
            <Link to="/" className="flex flex-col items-center decoration-none">
              <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                <AvatarImage
                  src="/logo.jpg"
                  alt="cineVerse logo"
                  className="object-cover"
                />
                <AvatarFallback className="font-bold bg-primary/20 text-primary text-xs">
                  CV
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-2 text-text-h">cineVerse</h2>
            </Link>
            <p className="text-xs text-text/60">
              Log in to enter the universe of cinema
            </p>
          </div>

          {/* Form Card */}
          <Card className="w-full relative shadow-2xl p-6 md:p-8 border-border/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl">
            {!otpRequired ? (
              <>
                <div className="text-left mb-6">
                  <h2 className="text-2xl font-bold text-text-h mb-1.5">
                    Sign In
                  </h2>
                  <p className="text-xs text-text/75">
                    Welcome back! Please enter your details below
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="glass border-red-500/20 bg-red-500/10 text-red-400 p-3 rounded-lg text-xs font-semibold animate-shake text-left">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="glass border-emerald-500/25 bg-emerald-500/10 text-emerald-400 p-3 rounded-lg text-xs font-semibold text-left">
                      {successMessage}
                    </div>
                  )}

                  {/* Email Address */}
                  <div className="text-left space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/60 block">
                      Email Address
                    </label>
                    <Input
                      required
                      onChange={handleChange}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="name@domain.com"
                      value={formData.email}
                    />
                  </div>

                  {/* Password */}
                  <div className="text-left space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text/60 block">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[9px] text-primary font-bold hover:underline decoration-none"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <Input
                      required
                      onChange={handleChange}
                      type="password"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                    />
                  </div>

                  {/* Remember Me Toggle */}
                  <div className="flex items-center gap-3 pt-1 text-left">
                    <Switch
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      id="remember-me"
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-xs text-text-h/85 cursor-pointer select-none"
                    >
                      Remember this browser session
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-2.5 shadow-xl font-bold uppercase tracking-wider text-xs mt-6 h-10"
                    loading={isSubmitting}
                  >
                    Log In Now
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="text-left mb-6">
                  <h2 className="text-2xl font-bold text-text-h mb-1.5">
                    Security Verification
                  </h2>
                  <p className="text-xs text-text/75">
                    Enter the 6-digit OTP code sent to your registered email
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="glass border-red-500/20 bg-red-500/10 text-red-400 p-3 rounded-lg text-xs font-semibold animate-shake text-left">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="glass border-emerald-500/25 bg-emerald-500/10 text-emerald-400 p-3 rounded-lg text-xs font-semibold text-left">
                      {successMessage}
                    </div>
                  )}

                  {/* OTP Code */}
                  <div className="text-left space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/60 block">
                      Verification Code
                    </label>
                    <Input
                      required
                      onChange={(e) => setOtp(e.target.value)}
                      type="text"
                      maxLength={6}
                      pattern="\d{6}"
                      placeholder="000000"
                      className="text-center tracking-[0.75em] text-lg font-bold"
                      value={otp}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-2.5 shadow-xl font-bold uppercase tracking-wider text-xs mt-6 h-10"
                    loading={isSubmitting}
                  >
                    Verify & Continue
                  </Button>

                  {/* Resend OTP Links */}
                  <div className="flex justify-between items-center text-xs text-text/70 pt-2">
                    <button
                      type="button"
                      onClick={() => setOtpRequired(false)}
                      className="text-text/60 hover:text-text-h font-medium bg-transparent border-0 cursor-pointer p-0"
                    >
                      ← Back to Login
                    </button>
                    <button
                      type="button"
                      disabled={resendLoading}
                      onClick={handleResendOtp}
                      className="text-primary hover:underline font-bold bg-transparent border-0 cursor-pointer p-0 disabled:opacity-40"
                    >
                      {resendLoading ? 'Sending...' : 'Resend Code'}
                    </button>
                  </div>
                </form>
              </>
            )}

            <CardFooter className="flex-col gap-3 p-0 mt-6 pt-6 border-t border-border">
              <div className="text-center text-xs text-text/70">
                Don't have an account yet?{' '}
                <Link
                  to="/signup"
                  className="text-primary font-bold hover:underline decoration-none"
                >
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
