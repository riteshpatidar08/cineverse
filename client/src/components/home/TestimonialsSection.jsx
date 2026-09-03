import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Marcus Vance',
      role: 'Film Critic & Cinephile',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      comment: 'CineVerse has completely changed how I experience premieres. The 3-tap QR check-in and zero convenience fees make it the smoothest cinema booking app in existence.',
      rating: 5,
      tag: 'CinePass VIP Member',
    },
    {
      name: 'Elena Rostova',
      role: 'Operations Director, Imperial Cinemas',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      comment: 'Integrating CineVerse Cloud POS boosted our weekday seat occupancy by 32%. The F&B in-seat ordering feature is loved by our audience.',
      rating: 5,
      tag: 'Theater Partner',
    },
    {
      name: 'David Chen',
      role: 'Frequent Moviegoer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment: 'The seat recline preview and IMAX sound info before booking is fantastic. Plus, getting free popcorn refills with CinePass VIP paid for itself in two visits!',
      rating: 5,
      tag: 'CinePass Executive',
    },
  ];

  const press = [
    { name: 'VARIETY', quote: '"The future of theater ticketing and cinematic software."' },
    { name: 'THE HOLLYWOOD REPORTER', quote: '"Bridging digital streaming convenience with IMAX theatrical magic."' },
    { name: 'TECHCRUNCH', quote: '"CineVerse transforms the 100-year-old moviegoing workflow."' },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-white/30 dark:bg-black/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            Social Proof & Reviews
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-h m-0">
            Loved by Moviegoers & Cinema Partners
          </h2>
          <p className="text-text/75 text-base md:text-lg mt-4 leading-relaxed">
            See why millions of users trust CineVerse for their weekend blockbusters and private screening events.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <Card
              key={idx}
              className="glass p-8 rounded-3xl border border-white/20 dark:border-white/10 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-text/80 text-sm leading-relaxed italic mb-6">
                  "{item.comment}"
                </p>
              </div>

              {/* User Avatar Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-bold text-text-h">{item.name}</div>
                  <div className="text-xs text-text/60">{item.role}</div>
                  <Badge variant="secondary" className="text-[9px] font-bold py-0 px-1.5 mt-1">
                    {item.tag}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Press Quotes Ticker */}
        <div className="mt-16 pt-12 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {press.map((p, pIdx) => (
            <div key={pIdx} className="space-y-1">
              <div className="text-xs font-black tracking-widest text-text-h opacity-70">{p.name}</div>
              <div className="text-xs text-text/70 italic">{p.quote}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
