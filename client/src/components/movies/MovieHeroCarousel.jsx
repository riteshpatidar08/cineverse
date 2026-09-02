import React from 'react';

export default function MovieHeroCarousel({
  featuredMovies = [],
  currentSlide = 0,
  onPrevSlide,
  onNextSlide,
  onSelectSlide,
  onPause,
  onResume,
}) {
  if (!featuredMovies || featuredMovies.length === 0) return null;

  const activeFeatured = featuredMovies[currentSlide] || featuredMovies[0];

  return (
    <section
      className="relative w-full overflow-hidden py-10 md:py-16 border-b border-[#e5e0f2] transition-all duration-700 bg-white"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
    >
      {/* Ambient Blurred Poster Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10">
        <img
          key={activeFeatured._id || activeFeatured.poster}
          src={activeFeatured.poster}
          alt=""
          className="w-full h-full object-cover filter blur-[90px] scale-150 opacity-20 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white" />
      </div>

      <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 min-h-[380px] px-8 md:px-24">
        {/* Left Column: Movie Info & Typography */}
        <div className="w-full md:w-1/2 flex flex-col items-start z-10 text-left space-y-4">
          
          {/* Main Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#230d56] tracking-tight leading-[1.15] m-0">
            {activeFeatured.title}
          </h1>

          {/* Censor Rating & Genres Tagline */}
          <div className="flex items-center flex-wrap gap-2.5 text-sm md:text-base font-semibold">
            <span className="bg-[#471b8e]/10 text-[#471b8e] px-2.5 py-0.5 rounded-md text-xs font-bold border border-[#471b8e]/20 inline-flex items-center justify-center">
              {activeFeatured.censorRating || 'U'}
            </span>
            <span className="text-[#8e7fc4]/50 font-normal">|</span>
            <span className="text-[#471b8e] font-semibold">
              {activeFeatured.genres && activeFeatured.genres.length > 0
                ? activeFeatured.genres.slice(0, 2).join(', ') +
                  (activeFeatured.genres.length > 2 ? ` +${activeFeatured.genres.length - 2} more` : '')
                : 'Action, Drama'}
            </span>
          </div>

          {/* Synopsis Description */}
          <p className="text-sm md:text-base text-[#4a3e56] leading-relaxed max-w-xl line-clamp-3 font-normal">
            {activeFeatured.description ||
              'An epic cinematic masterpiece following an emotional journey of courage, faith, and redemption.'}
          </p>

          {/* Book Now Button */}
          <div className="pt-2">
            <button className="bg-[#230d56] hover:bg-[#351371] text-white px-8 py-3 rounded-full font-bold text-sm md:text-base tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer active:scale-95">
              Book now
            </button>
          </div>
        </div>

        {/* Right Column: Hero Poster Preview */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end z-10">
          <div className="relative group">
            <div className="w-64 md:w-80 aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/80 glass transform transition-transform duration-500 group-hover:scale-102">
              <img
                src={activeFeatured.poster}
                alt={activeFeatured.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800';
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Arrows (Positioned cleanly outside the text area) */}
        <button
          onClick={onPrevSlide}
          aria-label="Previous Movie"
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-md border border-[#e5e0f2] text-[#230d56] hover:bg-white hover:scale-110 transition-all cursor-pointer hidden md:flex items-center justify-center shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onNextSlide}
          aria-label="Next Movie"
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-md border border-[#e5e0f2] text-[#230d56] hover:bg-white hover:scale-110 transition-all cursor-pointer hidden md:flex items-center justify-center shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Carousel Indicator Dots */}
      <div className="flex justify-center items-center gap-2 mt-6 relative z-10">
        {featuredMovies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === idx ? 'w-8 bg-[#230d56]' : 'w-2 bg-[#8e7fc4]/40 hover:bg-[#8e7fc4]'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
