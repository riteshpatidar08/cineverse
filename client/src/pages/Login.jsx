import React, { useState , useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { login, verifyOtp, resendOtp, verify } from '../services/auth.api.js';
import { Card, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';
import { authenticated } from '../../redux/slices/authSlice.js';
import { useDispatch } from 'react-redux';
import {useSelector} from 'react-redux'
function Login() {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state)=>state.auth)
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
const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(()=>{

if(isAuthenticated){
  navigate('/')
}
  },[isAuthenticated])

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await login(formData);
      const results = await verify();
      let response = { ...res.data, ...results.data };
      console.log(response);
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
      const res = await verifyOtp({ otp, id: userId });
      console.log('Verify OTP Response:', res.data);
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

  const handleResendOtp = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setResendLoading(true);

    try {
      await resendOtp({ email: formData.email });
      setSuccessMessage('Verification code resent successfully.');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to resend code. Please wait before retrying.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-white text-[#4a3e56] font-sans">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-2">
          <Link to="/" className="flex flex-col items-center decoration-none group">
            <Avatar className="h-12 w-12 border border-[#e5e0f2] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <AvatarImage src="/logo.jpg" alt="cineVerse logo" className="object-cover" />
              <AvatarFallback className="font-bold bg-[#471b8e]/10 text-[#471b8e] text-xs">CV</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-extrabold mt-2 text-[#230d56] tracking-tight">cineVerse</h2>
          </Link>
        </div>

        {/* Minimalist Centered Form Card */}
        <Card className="w-full shadow-lg p-6 md:p-8 border border-[#e5e0f2] bg-white rounded-3xl">
          {!otpRequired ? (
            <>
              <div className="text-left mb-6">
                <h2 className="text-2xl font-bold text-[#230d56] mb-1">
                  Sign In
                </h2>
                <p className="text-xs text-[#4a3e56]/75">
                  Welcome back! Please enter your details below
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="border border-red-200 bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold text-left">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="border border-emerald-200 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold text-left">
                    {successMessage}
                  </div>
                )}

                {/* Email Address */}
                <div className="text-left space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#230d56]/70 block">
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#230d56]/70 block">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[10px] text-[#471b8e] font-bold hover:underline decoration-none"
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
                    className="text-xs text-[#230d56] cursor-pointer select-none font-medium"
                  >
                    Remember this browser session
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-2.5 bg-[#230d56] hover:bg-[#351371] text-white shadow-md font-bold uppercase tracking-wider text-xs mt-6 h-11 rounded-xl cursor-pointer"
                  loading={isSubmitting}
                >
                  Log In Now
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-left mb-6">
                <h2 className="text-2xl font-bold text-[#230d56] mb-1">
                  Security Verification
                </h2>
                <p className="text-xs text-[#4a3e56]/75">
                  Enter the 6-digit OTP code sent to your registered email
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="border border-red-200 bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold text-left">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="border border-emerald-200 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold text-left">
                    {successMessage}
                  </div>
                )}

                {/* OTP Code */}
                <div className="text-left space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#230d56]/70 block">
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
                  className="w-full py-2.5 bg-[#230d56] hover:bg-[#351371] text-white shadow-md font-bold uppercase tracking-wider text-xs mt-6 h-11 rounded-xl cursor-pointer"
                  loading={isSubmitting}
                >
                  Verify & Continue
                </Button>

                {/* Resend OTP Links */}
                <div className="flex justify-between items-center text-xs text-[#8e7fc4] pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpRequired(false)}
                    className="text-[#4a3e56] hover:text-[#230d56] font-medium bg-transparent border-0 cursor-pointer p-0"
                  >
                    ← Back to Login
                  </button>
                  <button
                    type="button"
                    disabled={resendLoading}
                    onClick={handleResendOtp}
                    className="text-[#471b8e] hover:underline font-bold bg-transparent border-0 cursor-pointer p-0 disabled:opacity-40"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>
              </form>
            </>
          )}

          <CardFooter className="flex-col gap-3 p-0 mt-6 pt-6 border-t border-[#e5e0f2]">
            <div className="text-center text-xs text-[#4a3e56]/70 font-medium">
              Don't have an account yet?{' '}
              <Link
                to="/signup"
                className="text-[#471b8e] font-bold hover:underline decoration-none"
              >
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Login;
