import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import createMovieSlug from '../../lib/movieSlug';
import { Sparkles, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MovieHeroCarousel({ movies = [] }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayMovies = movies.length > 0 ? movies.slice(0, 6) : [];

  useEffect(() => {
    if (!displayMovies.length || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayMovies.length, isPaused]);

  if (!displayMovies.length) return null;

  const active = displayMovies[currentSlide] || displayMovies[0];
  const slug = createMovieSlug(active.title);

  const handleBookNow = () => {
    navigate(`/movies/${slug}/${active._id}`);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + displayMovies.length) % displayMovies.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % displayMovies.length);
  };

  return (
    <section
      style={{
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--primary)',
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                padding: '4px 12px',
                borderRadius: 20,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 6,
              }}
            >
              <Sparkles size={13} color="var(--primary)" />
              Trending Blockbusters
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-h)', margin: 0 }}>
              Featured &amp; Latest Releases
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handlePrev}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-h)',
              }}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-h)',
              }}
              aria-label="Next Slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Card */}
        <div
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            flexWrap: 'wrap',
          }}
        >
          {/* Left Details */}
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'var(--primary)',
                  color: '#fff',
                }}
              >
                {active.censorRating || 'U'}
              </span>
              {active.language && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-h)',
                    background: 'var(--bg-3)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: '1px solid var(--border)',
                  }}
                >
                  {active.language}
                </span>
              )}
            </div>

            <h3
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 800,
                color: 'var(--text-h)',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.5px',
              }}
            >
              {active.title}
            </h3>

            {active.genres?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {active.genres.map((g) => (
                  <span
                    key={g}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'var(--bg-2)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {active.description && (
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {active.description}
              </p>
            )}

            <div style={{ marginTop: 6 }}>
              <button
                onClick={handleBookNow}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 28px',
                  borderRadius: 8,
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(71,27,142,0.25)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}
              >
                <Ticket size={16} />
                Book Tickets Now
              </button>
            </div>
          </div>

          {/* Right Poster */}
          <div
            onClick={handleBookNow}
            style={{
              width: 200,
              aspectRatio: '2/3',
              borderRadius: 12,
              overflow: 'hidden',
              flexShrink: 0,
              cursor: 'pointer',
              border: '1px solid var(--border)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
              margin: '0 auto',
            }}
          >
            <img
              src={active.poster}
              alt={active.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </div>
        </div>

        {/* Slide Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
          {displayMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                height: 6,
                width: currentSlide === idx ? 24 : 6,
                borderRadius: 3,
                background: currentSlide === idx ? 'var(--primary)' : 'var(--border-light)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
