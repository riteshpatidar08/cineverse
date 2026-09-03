import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';

export default function CtaNewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Rich Deep Purple & Dark Gradient Banner (No glass class background override) */}
        <div className="rounded-3xl p-8 md:p-16 border border-primary/30 shadow-2xl relative overflow-hidden text-center bg-gradient-to-br from-primary via-[#351371] to-neutral-dark text-white">
          
          {/* Background Ambient Glow Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/40 blur-[130px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <Badge variant="secondary" className="px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white bg-secondary inline-block shadow-md">
              🎬 Ready for the Ultimate Cinema Experience?
            </Badge>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white m-0 leading-tight">
              Join CineVerse Today & Claim Your Free First Ticket
            </h2>

            <p className="text-purple-100/90 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
              Subscribe to our VIP Insider Club for weekly premiere alerts, secret screenings, and an instant $15 ticket credit voucher.
            </p>

            {/* Email Subscription Form */}
            <div className="max-w-md mx-auto pt-4">
              {subscribed ? (
                <div className="p-4 rounded-2xl border border-emerald-400/50 bg-emerald-950/60 backdrop-blur-md text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
                  <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Welcome to the VIP Club! Check your inbox for your $15 ticket code.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/10 text-white placeholder:text-purple-200/60 border-white/20 rounded-xl focus:ring-2 focus:ring-secondary focus:bg-white/20 transition-all"
                  />
                  <Button type="submit" variant="secondary" size="lg" className="h-12 px-6 font-bold uppercase tracking-wider text-xs shrink-0 shadow-lg hover:scale-105 transition-transform">
                    Get Free Ticket
                  </Button>
                </form>
              )}
            </div>

            {/* Action Links */}
            <div className="pt-6 flex flex-wrap justify-center gap-4 text-xs font-semibold text-purple-200/80">
              <Link to="/signup" className="hover:text-white transition-colors underline decoration-purple-400/50 underline-offset-4">Create Account</Link>
              <span>•</span>
              <Link to="/movies" className="hover:text-white transition-colors underline decoration-purple-400/50 underline-offset-4">Browse Showing Movies</Link>
              <span>•</span>
              <a href="#partner-section" className="hover:text-white transition-colors underline decoration-purple-400/50 underline-offset-4">Partner Portal</a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
