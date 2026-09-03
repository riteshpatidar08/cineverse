import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';

export default function ValueProposition() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'IMAX 4K Dual-Laser Projection',
      description: 'Crystal-clear visuals with expanded aspect ratios, uncompressed colors, and custom curved screens for ultimate immersion.',
      badge: 'Visual Technology',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 0112.728 0" />
        </svg>
      ),
      title: 'Dolby Atmos Spatial Audio',
      description: 'Multi-dimensional acoustic soundscapes that surround you from every direction, placing you inside the movie scene.',
      badge: '3D Audio',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '3-Tap Instant E-Pass Booking',
      description: 'No long queues or paper tickets. Instant QR entry directly to your seat with optional Apple Wallet & Google Pay integration.',
      badge: 'Zero Waiting',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Zero Convenience Fee Guarantee',
      description: 'Say goodbye to hidden markup fees. What you see is what you pay, with automatic points earned on every booking.',
      badge: 'Fair Pricing',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
      title: 'Gourmet In-Seat Food Service',
      description: 'Order hot artisanal snacks, handcrafted drinks, and fresh popcorn right from your smartphone app without missing a scene.',
      badge: 'Luxury Dining',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Cross-Device Streaming Hub',
      description: 'Seamlessly switch from big screen cinema experience to home 4K HDR digital rentals on web, smart TVs, and mobile.',
      badge: 'Everywhere Access',
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            Why Choose CineVerse
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-h m-0">
            Engineered for the Modern Movie Enthusiast
          </h2>
          <p className="text-text/75 text-base md:text-lg mt-4 leading-relaxed">
            We combined high-speed ticketing, state-of-the-art cinema technology, and premium hospitality into one seamless platform.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <Card
              key={idx}
              className="glass p-6 rounded-2xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  {item.icon}
                </div>
                <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wider">
                  {item.badge}
                </Badge>
              </div>

              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl font-bold text-text-h">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardDescription className="text-sm text-text/75 leading-relaxed">
                {item.description}
              </CardDescription>
            </Card>
          ))}
        </div>

        {/* Interactive Experience Showcase Banner */}
        <div className="mt-16 glass rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <Badge variant="secondary" className="px-3 py-1 font-bold text-xs uppercase tracking-wider">
                🍿 CineVerse Recliner VIP Lounge
              </Badge>
              <h3 className="text-2xl md:text-3xl font-extrabold text-text-h m-0">
                Upgrade to Ultra-Luxury Heated Motorized Seats
              </h3>
              <p className="text-text/80 text-sm md:text-base max-w-2xl leading-relaxed">
                Enjoy 180° full-recline plush leather seats with wireless phone charging, individual swivel tables, and private service call buttons in select premium screens.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <div className="glass px-6 py-4 rounded-2xl border border-white/20 text-center w-full lg:w-auto">
                <div className="text-3xl font-extrabold text-secondary">100%</div>
                <div className="text-xs font-bold text-text-h uppercase tracking-wider mt-1">Satisfaction Guaranteed</div>
                <div className="text-[10px] text-text/60 mt-0.5">Free seat cancellation up to 2h before show</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
