import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/auth.api.js';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { Tooltip } from '../components/ui/Tooltip';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-bg text-text overflow-x-hidden font-sans transition-colors duration-500">
      
      {/* Left Panel: Cinematic Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-5/12 relative flex-col justify-between p-12 border-r border-border bg-white/[0.01] dark:bg-black/20 overflow-hidden select-none">
        
        {/* Glow Effects */}
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary/15 blur-3xl animate-float-medium pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-3.5 z-10 group decoration-none">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-primary/30 opacity-60 blur-md group-hover:opacity-85 transition duration-500" />
            <Avatar className="h-10 w-10 ring-2 ring-white/10 relative">
              <AvatarImage src="/logo.jpg" alt="cineVerse logo" className="object-cover" />
              <AvatarFallback className="font-bold bg-primary/20 text-primary text-xs">CV</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-xl font-bold tracking-wider text-text-h">
            cineVerse
          </span>
        </Link>

        {/* Feature Copy */}
        <div className="my-auto z-10 max-w-sm space-y-6 text-left">
          <Badge variant="primary" className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
            🎬 Join The Universe
          </Badge>
          
          <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight m-0 text-text-h">
            Discover the Magic <br />
            of the{' '}
            <span className="text-primary">
              Silver Screen
            </span>
          </h1>

          <p className="text-xs xl:text-sm text-text/80 leading-relaxed m-0">
            Create an account to browse thousands of movies, track your watchlist, share full-length reviews, and book showtimes directly at your favorite local screens.
          </p>

          {/* Glassmorphic director quote card */}
          <div className="glass border-border p-4 rounded-xl relative overflow-hidden shadow-xl hover:border-primary/20 transition-all duration-300">
            <p className="text-[11px] italic text-text-h/95 leading-relaxed m-0 mb-2">
              "Film is like a battleground. Love, hate, action, violence, death... In one word: emotion."
            </p>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold text-white">
                JG
              </div>
              <div>
                <p className="text-[9px] font-bold text-text-h m-0">Jean-Luc Godard</p>
                <p className="text-[8px] text-text/50 m-0">Director & Screenwriter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info inside split pane */}
        <div className="flex items-center justify-between pt-6 z-10 text-[10px] text-text/50 font-medium">
          <span>© {new Date().getFullYear()} cineVerse</span>
          <div className="flex gap-3">
            <Link to="/privacy" className="hover:text-text-h transition-colors duration-300 decoration-none">Privacy</Link>
            <Link to="/terms" className="hover:text-text-h transition-colors duration-300 decoration-none">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right Panel: Signup Form */}
      <div className="w-full lg:w-7/12 xl:w-7/12 flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-bg min-h-screen">
        
        {/* Glow Effects (Mobile or decorative) */}
        <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none lg:opacity-75" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none lg:opacity-75" />

        <div className="w-full max-w-lg z-10 space-y-6">
          
          {/* Mobile Header Logo */}
          <div className="flex flex-col items-center lg:hidden space-y-2">
            <Link to="/" className="flex flex-col items-center decoration-none">
              <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                <AvatarImage src="/logo.jpg" alt="cineVerse logo" className="object-cover" />
                <AvatarFallback className="font-bold bg-primary/20 text-primary text-xs">CV</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-2 text-text-h">cineVerse</h2>
            </Link>
            <p className="text-xs text-text/60">Create your account to start exploring</p>
          </div>

          {/* Form Card */}
          <Card className="w-full relative shadow-2xl p-6 md:p-8 border-border/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl">
            <div className="text-left mb-6">
              <h2 className="text-2xl font-bold text-text-h mb-1.5">Get Started</h2>
              <p className="text-xs text-text/75">Fill in your details below to set up your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="glass border-red-500/20 bg-red-500/10 text-red-400 p-3 rounded-lg text-xs font-semibold animate-shake">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="glass border-emerald-500/25 bg-emerald-500/10 text-emerald-400 p-3 rounded-lg text-xs font-semibold">
                  {successMessage}
                </div>
              )}

              {/* Full Name */}
              <div className="text-left space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text/60 block">Full Name</label>
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text/60 block">Email Address</label>
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text/60 block">Mobile Number</label>
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/60 block">Password</label>
                    <Tooltip content="Minimum 6 characters" position="top">
                      <span className="text-[9px] text-primary font-bold hover:underline cursor-help">Info</span>
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text/60 block">Confirm Password</label>
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
                <label htmlFor="agree-terms" className="text-xs text-text/85 cursor-pointer select-none">
                  I agree to the <Link to="/terms" className="text-primary hover:underline font-semibold decoration-none">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline font-semibold decoration-none">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 shadow-xl font-bold uppercase tracking-wider text-xs mt-6 h-10 animate-fade-in"
                loading={isSubmitting}
              >
                Sign Up Now
              </Button>
            </form>

            <CardFooter className="flex-col gap-3 p-0 mt-6 pt-6 border-t border-border">
              <div className="text-center text-xs text-text/70">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline decoration-none">
                  Log In
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
    </div>
  );
}

export default Signup;
