import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export default function HeroSection() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('New York');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedDate, setSelectedDate] = useState('Today');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/movies?city=${encodeURIComponent(selectedCity)}&genre=${encodeURIComponent(selectedGenre)}`);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/20 via-accent/15 to-secondary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/15 blur-[100px] rounded-full pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/15 blur-[100px] rounded-full pointer-events-none -z-10 animate-float-medium" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copywriting & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <Badge variant="primary" className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              <span>Next-Gen Cinematic Ecosystem</span>
            </Badge>

            <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-text-h leading-[1.1] m-0">
              Where Cinema Magic Meets <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Smart Booking</span>
            </h1>

            <p className="text-md font-medium md:text-xl text-text/80 leading-relaxed max-w-2xl ">
              cineVerse empowers moviegoers and theater operators with instant seat selection, immersive IMAX 4K reservations, and exclusive streaming access—all backed by zero convenience fees.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/movies">
                <Button variant="primary" size="lg" className="shadow-xl shadow-primary/25 hover:scale-[1.02] transition-transform">
                  <span>Explore All Movies</span>
                  <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </Link>
              
              <a href="#partner-section">
                <Button variant="glass" size="lg" className="hover:scale-[1.02] transition-transform">
                  <svg className="w-5 h-5 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
                  </svg>
                  <span>Cinema Partner Hub</span>
                </Button>
              </a>
            </div>

        

            {/* KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/50">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-primary">2.5M+</div>
                <div className="text-xs text-text/70 font-medium">Tickets Booked</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-secondary">480+</div>
                <div className="text-xs text-text/70 font-medium">Partner Screens</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-accent">4.9 ★</div>
                <div className="text-xs text-text/70 font-medium">User Rating</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-text-h">100%</div>
                <div className="text-xs text-text/70 font-medium">Instant E-Pass</div>
              </div>
            </div>

          </div>

          {/* Right Column: Sleek Visual Hero Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent opacity-30 blur-xl animate-float-slow pointer-events-none" />

              {/* Main Card Container */}
              <div className="relative p-3.5 rounded-3xl bg-white/80 dark:bg-neutral-dark/90 border border-white/40 dark:border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
                
                {/* Inner Poster Image Wrapper */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=900"
                    alt="Featured Movie Premiere"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* High Contrast Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <span className="bg-secondary text-neutral-dark font-extrabold text-[11px] px-3 py-1 rounded-full shadow-lg tracking-wider uppercase">
                      🔥 Top Premiere
                    </span>
                    <span className="bg-black/60 text-white font-bold text-[11px] px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                      IMAX 3D
                    </span>
                  </div>

                  {/* Bottom Movie Detail Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 p-4 rounded-xl bg-neutral-dark/95 border border-white/20 backdrop-blur-xl text-white shadow-2xl z-10">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-secondary font-extrabold uppercase tracking-widest">Now Playing</div>
                        <h3 className="text-base font-extrabold text-white m-0 tracking-tight leading-tight">Oppenheimer: Directors Cut</h3>
                        <p className="text-[11px] text-purple-200/90 mt-0.5 font-medium">Dolby Atmos • 3h 00m • Sci-Fi / Drama</p>
                      </div>
                      <Link to="/movies">
                        <Button variant="primary" size="sm" className="h-9 px-3.5 text-xs font-bold shrink-0 shadow-md">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
