import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Home() {
  const [activeTab, setActiveTab] = useState('theatre');

  const featuredMovies = [
    {
      title: "Dune: Part Two",
      genres: ["Sci-Fi", "Adventure", "Action"],
      censorRating: "UA",
      duration: 166,
      releaseDate: "2024-03-01",
      poster: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Interstellar",
      genres: ["Sci-Fi", "Drama", "Adventure"],
      censorRating: "U",
      duration: 169,
      releaseDate: "2014-11-07",
      poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "La La Land",
      genres: ["Romance", "Musical", "Drama"],
      censorRating: "UA",
      duration: 128,
      releaseDate: "2016-12-09",
      poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    }
  ];

  return (
    // <div className="w-full bg-bg text-text min-h-screen relative overflow-hidden flex flex-col transition-colors duration-500">
      
    //   {/* Background Radial Glow Orbs */}
    //   <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float-slow pointer-events-none" />
    //   <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-float-medium pointer-events-none" />
    //   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

    //   {/* Hero Section */}
    //   <section className="relative z-10 max-w-6xl w-full mx-auto px-4 md:px-8 pt-20 pb-24 flex flex-col lg:flex-row items-center gap-16">
    //     {/* Left Content */}
    //     <div className="flex-1 text-left space-y-6">
    //       <Badge variant="primary" className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] bg-primary/10 border border-primary/20 text-primary">
    //         ✨ The Next-Gen Cinema Platform
    //       </Badge>
          
    //       <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight m-0 text-text-h">
    //         Connecting <br />
    //         <span className="text-primary">
    //           Cinephiles & Cinemas
    //         </span>
    //       </h1>

    //       <p className="text-sm md:text-base text-text/85 leading-relaxed max-w-lg m-0">
    //         cineVerse is the ultimate movie business suite. For users, a beautiful database and ticketing experience. For theatre operators, a state-of-the-art dashboard to manage bookings, seats, and operations.
    //       </p>

    //       <div className="flex flex-wrap items-center gap-4 pt-2">
    //         <Link to="/signup" className="decoration-none">
    //           <Button variant="primary" size="lg" className="font-bold uppercase tracking-wider text-xs border-primary/30 text-text-h">
    //             Get Started Free
    //           </Button>
    //         </Link>
    //         <Link to="/login" className="decoration-none">
    //           <Button variant="glass" size="lg" className="font-bold uppercase tracking-wider text-xs border-border hover:bg-white/5 dark:hover:bg-white/10">
    //             Log In
    //           </Button>
    //         </Link>
    //       </div>
    //     </div>

    //     {/* Right Dashboard Mockup */}
    //     <div className="flex-1 w-full relative group">
    //       <div className="absolute -inset-1 rounded-2xl bg-primary/20 opacity-75 blur-lg group-hover:opacity-100 transition duration-1000" />
          
    //       <div className="glass border-border rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col">
    //         {/* Mock Dashboard Topbar */}
    //         <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white/5 dark:bg-black/40">
    //           <div className="flex items-center gap-1.5">
    //             <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
    //             <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
    //             <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
    //             <span className="text-[10px] text-text/50 font-mono ml-2">theatre-admin-v1.0.0</span>
    //           </div>
    //           <Badge variant="outline" className="text-[9px] px-2 py-0.5 border-primary/20 text-primary bg-primary/5">Live Data</Badge>
    //         </div>

    //         {/* Mock Dashboard Content */}
    //         <div className="p-5 space-y-4 bg-white/[0.02] dark:bg-black/20 text-left">
    //           {/* Stats Row */}
    //           <div className="grid grid-cols-3 gap-3">
    //             <div className="glass p-3 rounded-lg border-border">
    //               <p className="text-[9px] uppercase tracking-wider text-text/50 m-0">Daily Sales</p>
    //               <p className="text-sm font-bold text-emerald-500 dark:text-emerald-400 m-0 mt-0.5">$4,280.50</p>
    //             </div>
    //             <div className="glass p-3 rounded-lg border-border">
    //               <p className="text-[9px] uppercase tracking-wider text-text/50 m-0">Occupancy</p>
    //               <p className="text-sm font-bold text-primary m-0 mt-0.5">84.2%</p>
    //             </div>
    //             <div className="glass p-3 rounded-lg border-border">
    //               <p className="text-[9px] uppercase tracking-wider text-text/50 m-0">Active Screens</p>
    //               <p className="text-sm font-bold text-secondary m-0 mt-0.5">4 / 4</p>
    //             </div>
    //           </div>

    //           {/* Showtimes & Seat Layout Simulation */}
    //           <div className="glass p-4 rounded-xl border-border space-y-3">
    //             <div className="flex justify-between items-center">
    //               <span className="text-[10px] font-bold text-text-h uppercase tracking-wider">Screen 1 Showtime Schedule</span>
    //               <span className="text-[9px] text-text/60">Dune: Part Two</span>
    //             </div>
    //             <div className="flex gap-2">
    //               <span className="text-[9px] px-2 py-1 rounded bg-primary/20 border border-primary/30 text-text-h font-medium">12:30 PM</span>
    //               <span className="text-[9px] px-2 py-1 rounded bg-secondary/10 border border-secondary/20 text-secondary font-medium">04:15 PM</span>
    //               <span className="text-[9px] px-2 py-1 rounded bg-white/5 border border-border text-text/75">08:00 PM</span>
    //             </div>

    //             {/* Seat Map Preview */}
    //             <div className="pt-2">
    //               <p className="text-[8px] uppercase tracking-wider text-text/40 mb-1.5">Interactive Seating Layout</p>
    //               <div className="grid grid-cols-8 gap-1 max-w-[200px]">
    //                 {[...Array(24)].map((_, i) => {
    //                   const isBooked = i % 3 === 0;
    //                   const isSelected = i === 11 || i === 12;
    //                   return (
    //                     <div
    //                       key={i}
    //                       className={`h-2.5 rounded-sm transition-all duration-300 ${
    //                         isBooked
    //                           ? 'bg-red-500/20 border border-red-500/30'
    //                           : isSelected
    //                           ? 'bg-primary border border-primary/50 shadow-sm shadow-primary/30'
    //                           : 'bg-text/10 hover:bg-text/20 border border-border/40 cursor-pointer'
    //                       }`}
    //                     />
    //                   );
    //                 })}
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Stats Ribbon */}
    //   <section className="relative z-10 border-y border-border bg-white/[0.01] dark:bg-black/[0.02] backdrop-blur-md py-8">
    //     <div className="max-w-6xl w-full mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
    //       <div>
    //         <h3 className="text-2xl md:text-3xl font-extrabold text-text-h m-0">1.2M+</h3>
    //         <p className="text-[10px] md:text-xs text-text/60 uppercase tracking-wider m-0 mt-1">Monthly Active Users</p>
    //       </div>
    //       <div>
    //         <h3 className="text-2xl md:text-3xl font-extrabold text-primary m-0">450+</h3>
    //         <p className="text-[10px] md:text-xs text-text/60 uppercase tracking-wider m-0 mt-1">Partner Cinemas</p>
    //       </div>
    //       <div>
    //         <h3 className="text-2xl md:text-3xl font-extrabold text-secondary m-0">85K+</h3>
    //         <p className="text-[10px] md:text-xs text-text/60 uppercase tracking-wider m-0 mt-1">Tickets Sold Daily</p>
    //       </div>
    //       <div>
    //         <h3 className="text-2xl md:text-3xl font-extrabold text-accent m-0">4.9★</h3>
    //         <p className="text-[10px] md:text-xs text-text/60 uppercase tracking-wider m-0 mt-1">Operator Rating</p>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Value Proposition / Features Section */}
    //   <section className="relative z-10 max-w-6xl w-full mx-auto px-4 md:px-8 py-20 text-center">
    //     <Badge variant="secondary" className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] mb-4 bg-secondary/10 border border-secondary/20 text-secondary">
    //       Features
    //     </Badge>
    //     <h2 className="text-3xl md:text-4xl font-extrabold text-text-h mb-3">Designed for the Entire Ecosystem</h2>
    //     <p className="text-sm text-text/70 max-w-2xl mx-auto mb-12">
    //       Whether you are a movie lover looking for your next cinema experience or a cinema owner managing multiple screens, we have you covered.
    //     </p>

    //     {/* Feature Tabs Toggle */}
    //     <div className="flex justify-center items-center gap-2 mb-12">
    //       <Button
    //         variant={activeTab === 'theatre' ? 'primary' : 'glass'}
    //         size="sm"
    //         onClick={() => setActiveTab('theatre')}
    //         className="font-semibold text-xs uppercase tracking-wider rounded-full px-5 py-1"
    //       >
    //         For Cinema Operators
    //       </Button>
    //       <Button
    //         variant={activeTab === 'user' ? 'primary' : 'glass'}
    //         size="sm"
    //         onClick={() => setActiveTab('user')}
    //         className="font-semibold text-xs uppercase tracking-wider rounded-full px-5 py-1"
    //       >
    //         For Movie Fans
    //       </Button>
    //     </div>

    //     {/* Features Content Grid */}
    //     {activeTab === 'theatre' ? (
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
    //         <Card className="glass border-border p-6 space-y-4 hover:border-primary/45 transition-all duration-300 flex flex-col justify-between">
    //           <div className="space-y-4">
    //             <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
    //               <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    //               </svg>
    //             </div>
    //             <h3 className="text-base font-bold text-text-h m-0">Theater & Screen Setup</h3>
    //             <p className="text-xs text-text/70 leading-relaxed m-0">
    //               Define theater properties (name, city, geo-coordinates) and configure multiple screens with customizable seating layouts.
    //             </p>
    //           </div>
    //         </Card>

    //         <Card className="glass border-border p-6 space-y-4 hover:border-secondary/45 transition-all duration-300 flex flex-col justify-between">
    //           <div className="space-y-4">
    //             <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30">
    //               <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-6V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v8a2 2 0 002 2h2a2 2 0 002-2z" />
    //               </svg>
    //             </div>
    //             <h3 className="text-base font-bold text-text-h m-0">Dynamic Show Scheduling</h3>
    //             <p className="text-xs text-text/70 leading-relaxed m-0">
    //               Map movies to specific screens and show times. Setup price categories by seat class (Premium, Standard, etc.) and manage dates.
    //             </p>
    //           </div>
    //         </Card>

    //         <Card className="glass border-border p-6 space-y-4 hover:border-accent/45 transition-all duration-300 flex flex-col justify-between">
    //           <div className="space-y-4">
    //             <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
    //               <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    //               </svg>
    //             </div>
    //             <h3 className="text-base font-bold text-text-h m-0">Seat Inventory Tracking</h3>
    //             <p className="text-xs text-text/70 leading-relaxed m-0">
    //               Automatically track available counts and block seats in real-time as users book, avoiding double bookings.
    //             </p>
    //           </div>
    //         </Card>
    //       </div>
    //     ) : (
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
    //         <Card className="glass border-border p-6 space-y-4 hover:border-secondary/45 transition-all duration-300 flex flex-col justify-between">
    //           <div className="space-y-4">
    //             <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30">
    //               <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    //               </svg>
    //             </div>
    //             <h3 className="text-base font-bold text-text-h m-0">Browse Movies & Genres</h3>
    //             <p className="text-xs text-text/70 leading-relaxed m-0">
    //               Search through movies with information on duration, genre tags, censor ratings (U, UA, A), and release dates.
    //             </p>
    //           </div>
    //         </Card>

    //         <Card className="glass border-border p-6 space-y-4 hover:border-primary/45 transition-all duration-300 flex flex-col justify-between">
    //           <div className="space-y-4">
    //             <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
    //               <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    //               </svg>
    //             </div>
    //             <h3 className="text-base font-bold text-text-h m-0">Interactive Seat Selection</h3>
    //             <p className="text-xs text-text/70 leading-relaxed m-0">
    //               View real-time layout configurations for screens and select your exact seat visually before booking.
    //             </p>
    //           </div>
    //         </Card>

    //         <Card className="glass border-border p-6 space-y-4 hover:border-accent/45 transition-all duration-300 flex flex-col justify-between">
    //           <div className="space-y-4">
    //             <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
    //               <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    //               </svg>
    //             </div>
    //             <h3 className="text-base font-bold text-text-h m-0">Secure Booking with 2FA</h3>
    //             <p className="text-xs text-text/70 leading-relaxed m-0">
    //               Book show tickets securely. Protect your transactions and user account with OTP-based two-factor authentication.
    //             </p>
    //           </div>
    //         </Card>
    //       </div>
    //     )}
    //   </section>

    //   {/* Solid Divider */}
    //   <div className="max-w-6xl w-full mx-auto px-4 md:px-8">
    //     <div className="w-full h-[1px] bg-border my-4" />
    //   </div>

    //   {/* Featured Releases Showcase */}
    //   <section className="relative z-10 max-w-6xl w-full mx-auto px-4 md:px-8 py-16 text-center">
    //     <h2 className="text-2xl md:text-3xl font-extrabold text-text-h mb-2">Featured Releases</h2>
    //     <p className="text-xs text-text/60 mb-10">Trending movies playing now in our partner cinemas</p>
        
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
    //       {featuredMovies.map((movie, index) => (
    //         <div key={index} className="glass border-border rounded-2xl overflow-hidden group hover:border-primary/45 transition-all duration-300 shadow-xl flex flex-col h-full">
    //           <div className="relative h-56 overflow-hidden bg-black/10 dark:bg-black/30">
    //             <img
    //               src={movie.poster}
    //               alt={movie.title}
    //               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    //             />
    //             <Badge variant="primary" className="absolute top-3 right-3 z-20 font-bold bg-primary/95 border border-primary/30 text-white shadow-md">
    //               {movie.censorRating}
    //             </Badge>
    //           </div>
    //           <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
    //             <div className="space-y-2">
    //               <span className="text-[10px] font-semibold text-accent tracking-wide uppercase">{movie.genres.join(' / ')}</span>
    //               <h3 className="text-base font-bold text-text-h m-0 leading-snug">{movie.title}</h3>
    //             </div>
    //             <div className="flex justify-between items-center pt-3 border-t border-border/40">
    //               <span className="text-[10px] text-text/50">{movie.duration} min</span>
    //               <Link to="/signup" className="decoration-none">
    //                 <Button variant="glass" size="sm" className="h-7 text-[10px] font-bold tracking-wider uppercase border-border hover:bg-primary/20 hover:border-primary/30">
    //                   Book Seat
    //                 </Button>
    //               </Link>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </section>

    //   {/* Solid Divider */}
    //   <div className="max-w-6xl w-full mx-auto px-4 md:px-8">
    //     <div className="w-full h-[1px] bg-border my-4" />
    //   </div>

    //   {/* Call to Action Banner */}
    //   <section className="relative z-10 max-w-5xl w-full mx-auto px-4 md:px-8 py-20 text-center">
    //     <div className="relative group">
    //       <div className="absolute -inset-1 rounded-3xl bg-primary/20 opacity-75 blur-xl group-hover:opacity-90 transition duration-1000" />
          
    //       <div className="glass border-border rounded-3xl p-8 md:p-12 relative z-10 space-y-6 overflow-hidden bg-white/[0.02]">
    //         <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
    //         <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/15 blur-3xl rounded-full pointer-events-none" />

    //         <h2 className="text-3xl md:text-5xl font-extrabold text-text-h leading-tight m-0">
    //           Transform Your <br />
    //           <span className="text-primary">
    //             Cinema Experience Today
    //           </span>
    //         </h2>
    //         <p className="text-xs md:text-sm text-text/80 max-w-lg mx-auto leading-relaxed m-0">
    //           Join cineVerse to get access to custom dashboards, interactive maps, secure bookings, and a cinema community. Sign up today and get your first week of box office controls free.
    //         </p>
    //         <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
    //           <Link to="/signup" className="decoration-none">
    //             <Button variant="primary" size="lg" className="font-bold uppercase tracking-wider text-xs px-8 border-primary/30 text-text-h">
    //               Get Started
    //             </Button>
    //           </Link>
    //           <Link to="/login" className="decoration-none">
    //             <Button variant="glass" size="lg" className="font-bold uppercase tracking-wider text-xs border-border px-8">
    //               Sign In
    //             </Button>
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
      
    // </div>
    <div></div>
  )
}
