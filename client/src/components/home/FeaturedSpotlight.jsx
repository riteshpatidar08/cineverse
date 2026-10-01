import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import createMovieSlug from '../../lib/movieSlug';

export default function FeaturedSpotlight() {
  const { moviesByCity, loading } = useSelector((s) => s.movies);
  const movies = moviesByCity || [];

  if (loading) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 16,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  aspectRatio: '2/3',
                  borderRadius: 8,
                  background: 'var(--bg-3)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div style={{ height: 12, borderRadius: 4, background: 'var(--bg-3)', width: '75%' }} />
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    );
  }

  if (!movies.length) return null;

  return (
    <section
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '32px 16px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 20,
            gap: 12,
          }}
        >
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>
              Now showing near you
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              {movies.length} movies available
            </p>
          </div>
          <Link
            to="/movies"
            style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-h)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            See all →
          </Link>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 16,
          }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MovieCard({ movie }) {
  const [hovered, setHovered] = React.useState(false);
  const slug = createMovieSlug(movie.title);

  return (
    <Link
      to={`/movies/${slug}/${movie._id}`}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '2/3',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'var(--bg-3)',
            border: `1px solid ${hovered ? 'var(--border-light)' : 'var(--border)'}`,
            transition: 'border-color 0.15s',
          }}
        >
          <img
            src={movie.poster}
            alt={movie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800';
            }}
          />
          {movie.censorRating && (
            <span
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {movie.censorRating}
            </span>
          )}
        </div>

        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: hovered ? 'var(--text-h)' : 'var(--text)',
              lineHeight: 1.35,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              transition: 'color 0.15s',
            }}
          >
            {movie.title}
          </div>
          {movie.genres?.length > 0 && (
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {movie.genres.slice(0, 2).join(' · ')}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
