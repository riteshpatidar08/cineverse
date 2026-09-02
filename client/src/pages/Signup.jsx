import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/auth.api.js';
import { Card, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { Tooltip } from '../components/ui/Tooltip';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';

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
  const [agreeTerms, setAgreeTerms] = useState(true);

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

    if (!agreeTerms) {
      setErrorMessage('You must agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await register(formData);
      console.log(res);
      setSuccessMessage('Registration successful! Welcome to cineVerse.');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-white text-[#4a3e56] font-sans">
      <div className="w-full max-w-lg space-y-6">
        
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
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-[#230d56] mb-1">Get Started</h2>
            <p className="text-xs text-[#4a3e56]/75">Fill in your details below to set up your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Full Name */}
            <div className="text-left space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#230d56]/70 block">Full Name</label>
              <Input
                required
                onChange={handleChange}
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
              />
            </div>

            {/* Email & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-left space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#230d56]/70 block">Email Address</label>
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
              <div className="text-left space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#230d56]/70 block">Mobile Number</label>
                <Input
                  required
                  onChange={handleChange}
                  type="tel"
                  id="mobile"
                  name="mobileNo"
                  placeholder="10-digit number"
                  value={formData.mobileNo}
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-left space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#230d56]/70 block">Password</label>
                  <Tooltip content="Minimum 6 characters" position="top">
                    <span className="text-[9px] text-[#471b8e] font-bold hover:underline cursor-help">Info</span>
                  </Tooltip>
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
              <div className="text-left space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#230d56]/70 block">Confirm Password</label>
                <Input
                  required
                  onChange={handleChange}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                />
              </div>
            </div>

            {/* Terms Switch */}
            <div className="flex items-center gap-3 pt-1 text-left">
              <Switch checked={agreeTerms} onCheckedChange={setAgreeTerms} id="agree-terms" />
              <label htmlFor="agree-terms" className="text-xs text-[#230d56] cursor-pointer select-none font-medium">
                I agree to the <Link to="/terms" className="text-[#471b8e] hover:underline font-bold decoration-none">Terms of Service</Link> and <Link to="/privacy" className="text-[#471b8e] hover:underline font-bold decoration-none">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-2.5 bg-[#230d56] hover:bg-[#351371] text-white shadow-md font-bold uppercase tracking-wider text-xs mt-6 h-11 rounded-xl cursor-pointer"
              loading={isSubmitting}
            >
              Sign Up Now
            </Button>
          </form>

          <CardFooter className="flex-col gap-3 p-0 mt-6 pt-6 border-t border-[#e5e0f2]">
            <div className="text-center text-xs text-[#4a3e56]/70 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#471b8e] font-bold hover:underline decoration-none">
                Log In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Signup;
