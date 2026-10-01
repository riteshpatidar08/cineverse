import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById } from '../../../redux/slices/moviesSlice';

function formatDuration(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function MovieDetails() {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleMovie: movie, loading } = useSelector((s) => s.movies);

  useEffect(() => {
    dispatch(fetchMovieById(id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, dispatch]);

  const handleTicketBook = () => {
    navigate(`/booking/${name}/${id}`);
  };

  if (loading || !movie) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '48px 16px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ width: 220, aspectRatio: '2/3', borderRadius: 12, background: 'var(--bg-3)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280 }}>
            <div style={{ height: 32, width: 320, borderRadius: 6, background: 'var(--bg-3)' }} />
            <div style={{ height: 18, width: 200, borderRadius: 6, background: 'var(--bg-3)' }} />
            <div style={{ height: 80, borderRadius: 8, background: 'var(--bg-3)' }} />
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    );
  }

  const {
    title,
    poster,
    duration,
    description,
    genres = [],
    censorRating,
    releaseDate,
    language,
    cast = [],
    crew = [],
    trailerUrl,
  } = movie;

  const allCrew = [...cast, ...crew];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Header Hero Banner with Blurred Backdrop Effect */}
      <section
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, var(--bg-2) 0%, var(--bg-3) 100%)',
          padding: '40px 16px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'row', gap: 32, flexWrap: 'wrap' }}>
          
          {/* Poster */}
          <div style={{ width: 220, flexShrink: 0, margin: '0 auto' }}>
            <img
              src={poster}
              alt={title}
              style={{
                width: '100%',
                aspectRatio: '2/3',
                objectFit: 'cover',
                borderRadius: 12,
                border: '1px solid var(--border)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                background: 'var(--bg-3)',
              }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </div>

          {/* Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 280, justifyContent: 'center' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
              <Link to="/movies" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Movies</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-h)', fontWeight: 600 }}>{title}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-h)', margin: 0, letterSpacing: '-0.5px' }}>
              {title}
            </h1>

            {/* Badges & Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 13 }}>
              {censorRating && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: 'var(--primary)',
                    color: '#fff',
                  }}
                >
                  {censorRating}
                </span>
              )}
              {language && (
                <span style={{ fontWeight: 600, color: 'var(--text-h)', background: 'var(--bg)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>
                  {language}
                </span>
              )}
              {duration && <span style={{ color: 'var(--text-muted)' }}>⏱ {formatDuration(duration)}</span>}
              {releaseDate && <span style={{ color: 'var(--text-muted)' }}>📅 {formatDate(releaseDate)}</span>}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {genres.map((g) => (
                  <span
                    key={g}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 20,
                      background: 'var(--bg)',
                      color: 'var(--text-h)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {description && (
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, margin: '6px 0 0 0', maxWidth: 640 }}>
                {description}
              </p>
            )}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleTicketBook}
                style={{
                  padding: '12px 32px',
                  borderRadius: 8,
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(71,27,142,0.25)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}
              >
                Book Tickets Now
              </button>
              {trailerUrl && (
                <a
                  href={trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '12px 22px',
                    borderRadius: 8,
                    background: 'var(--bg)',
                    color: 'var(--text-h)',
                    border: '1px solid var(--border)',
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </a>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Cast & Crew Section */}
      {allCrew.length > 0 && (
        <section style={{ maxWidth: 1080, margin: '36px auto 0', padding: '0 16px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-h)', marginBottom: 16 }}>Cast &amp; Crew</h2>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
            {allCrew.map((person, i) => (
              <div
                key={i}
                style={{
                  width: 100,
                  flexShrink: 0,
                  textAlign: 'center',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'var(--bg-3)',
                    margin: '0 auto 8px auto',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                  }}
                >
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
                  )}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-h)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {person.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                  {person.role || 'Cast'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
