import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import createMovieSlug from '../../lib/movieSlug';
import { Calendar, ChevronRight } from 'lucide-react';

export default function UpcomingSection() {
  const { movies } = useSelector((s) => s.movies);

  // Filter or take upcoming releases from real DB movies
  const upcomingMovies = movies && movies.length > 0 ? movies.slice(4, 8) : [];

  if (upcomingMovies.length === 0) return null;

  return (
    <section
      style={{
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
        padding: '32px 16px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>
              Coming Soon &amp; High Anticipation
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Get notified when tickets open for upcoming blockbuster releases
            </p>
          </div>
          <Link
            to="/movies"
            style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}
          >
            Explore all <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {upcomingMovies.map((movie) => {
            const slug = createMovieSlug(movie.title);
            const releaseStr = movie.releaseDate
              ? new Date(movie.releaseDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Coming Soon';

            return (
              <Link
                key={movie._id}
                to={`/movies/${slug}/${movie._id}`}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  textDecoration: 'none',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
              >
                <div
                  style={{
                    aspectRatio: '16/9',
                    borderRadius: 6,
                    overflow: 'hidden',
                    background: 'var(--bg-3)',
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>

                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-h)', margin: 0, lineHeight: 1.3 }}>
                    {movie.title}
                  </h3>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {movie.genres?.join(' · ') || 'Action'}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} />
                    Releasing {releaseStr}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
