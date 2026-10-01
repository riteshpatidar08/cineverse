import React from 'react';
import MovieCard from './MovieCard';
import { useSelector } from 'react-redux';

export default function MovieGrid({ loading = false, movies: propsMovies }) {
  const reduxMovies = useSelector((state) => state.movies.movies);
  const displayMovies = propsMovies !== undefined ? propsMovies : reduxMovies;

  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 20,
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                aspectRatio: '2/3',
                borderRadius: 10,
                background: 'var(--bg-3)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div style={{ height: 14, borderRadius: 4, background: 'var(--bg-3)', width: '85%' }} />
            <div style={{ height: 11, borderRadius: 4, background: 'var(--bg-3)', width: '55%' }} />
          </div>
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    );
  }

  if (!displayMovies?.length) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 16px',
          color: 'var(--text-muted)',
          background: 'var(--bg-2)',
          borderRadius: 12,
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>🎬</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-h)', marginBottom: 4 }}>
          No movies match your filters
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Try clearing your search query or selecting different category filters.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 20,
      }}
    >
      {displayMovies.map((movie) => (
        <MovieCard key={movie._id || movie.title} movie={movie} />
      ))}
    </div>
  );
}
