import React, { useState } from 'react';
import { register } from '../services/auth.api.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
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
  const [themeDark, setThemeDark] = useState(true);

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

  const toggleDarkMode = () => {
    setThemeDark(!themeDark);
    if (!themeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen w-full relative flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-500 ${themeDark ? 'dark bg-black text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Background Radial Glow Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-primary/20 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-secondary/15 blur-3xl animate-float-medium pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />


      <div className="absolute top-6 right-6 z-20 flex items-center gap-2 glass px-3 py-1.5 rounded-xl border-white/20 dark:border-white/10 shadow-md">
        {/* <span className="text-xs font-semibold text-text/80">Dark Theme</span>
        <Switch checked={themeDark} onCheckedChange={toggleDarkMode} /> */}
      </div>

      {/* Centered Signup Container */}
      <div className="z-10 w-full max-w-lg my-4 animate-fadeIn">
        <Card className="w-full relative shadow-2xl p-5">
          
          {/* Logo Badge Header */}
          <div className="flex flex-col items-center pt-1 pb-4">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-60 blur-md group-hover:opacity-85 transition duration-1000" />
              <Avatar className="h-14 w-14 ring-2 ring-white/10 relative">
                <AvatarImage src="/logo.jpg" alt="cineVerse logo" className="object-cover" />
                <AvatarFallback className="text-base font-bold bg-primary/20 text-primary">CV</AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-lg font-bold mt-2.5 tracking-wide text-text-h m-0">cineVerse</h2>
            <p className="text-[11px] text-text/70 m-0 mt-0.5">Create your account to join the universe of cinema</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-2">
            <CardContent className="space-y-3 p-0">
              {errorMessage && (
                <div className="glass border-red-500/20 bg-red-500/10 text-red-400 p-2.5 rounded-lg text-xs font-medium animate-shake">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="glass border-emerald-500/25 bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg text-xs font-medium">
                  {successMessage}
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-text-h/60 block">Full Name</label>
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

              {/* Email & Mobile (Side-by-side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-text-h/60 block">Email Address</label>
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
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-text-h/60 block">Mobile Number</label>
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

              {/* Password & Confirm Password (Side-by-side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-text-h/60 block">Password</label>
                    <Tooltip content="Minimum 6 characters" position="top">
                      <span className="text-[9px] text-primary dark:text-accent font-medium hover:underline cursor-help">Info</span>
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
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-text-h/60 block">Confirm Password</label>
                  <Input
                    required
                    onChange={handleChange}
                    type="password"
                    id="ConfirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                  />
                </div>
              </div>

              {/* Agree Terms Switch */}
              <div className="flex items-center gap-2.5 pt-1.5">
                <Switch checked={agreeTerms} onCheckedChange={setAgreeTerms} />
                <span className="text-xs text-text/80">
                  I agree to the terms and privacy policy
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3 p-0 mt-4 pt-4 border-t border-white/5">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2 shadow-xl font-bold uppercase tracking-wider text-[11px] h-9"
                loading={isSubmitting}
              >
                Sign Up Now
              </Button>

              <div className="text-center text-xs text-text/70 mt-1">
                Already have an account?{' '}
                <a href="/login" className="text-primary dark:text-accent font-semibold hover:underline">
                  Log In
                </a>
              </div>
            </CardFooter>
          </form>

        </Card>
      </div>

    </div>
  );
}

export default Signup;
