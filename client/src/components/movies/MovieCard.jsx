import React from 'react';

export default function MovieCard({ movie }) {
  // Subtitle text helper matching screenshot e.g. "A | Hindi and 1 more"
  const getSubTitleText = () => {
    const censor = movie.censorRating || 'UA';
    const langs = movie.languages || ['Hindi'];

    if (langs.length === 1) {
      return `${censor} | ${langs[0]}`;
    } else if (langs.length > 1) {
      return `${censor} | ${langs[0]} and ${langs.length - 1} more`;
    }
    return `${censor} | Hindi`;
  };

  return (
    <div className="group flex flex-col transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-white border border-[#e5e0f2] shadow-sm group-hover:shadow-xl transition-all duration-300">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800';
          }}
        />

        {/* Top Censor Tag Pill (Light Theme Deep Purple Glass Badge) */}
        <div className="absolute top-2 left-2">
          <span className="bg-[#230d56]/85 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 shadow-sm">
            {movie.censorRating || 'U'}
          </span>
        </div>
      </div>

      {/* Movie Details below poster */}
      <div className="mt-2.5 text-left">
        <h3 className="text-sm font-bold text-[#230d56] leading-snug line-clamp-2 group-hover:text-[#471b8e] transition-colors">
          {movie.title}
        </h3>
        <p className="text-[11px] font-semibold text-[#8e7fc4] mt-0.5">
          {getSubTitleText()}
        </p>
      </div>
    </div>
  );
}
