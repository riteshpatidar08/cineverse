import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createMovieSlug from '../../lib/movieSlug';
import { Ticket } from 'lucide-react';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const slug = createMovieSlug(movie.title);

  function handleClick() {
    navigate(`/movies/${slug}/${movie._id}`);
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Poster Container */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '2/3',
          borderRadius: 10,
          overflow: 'hidden',
          background: 'var(--bg-3)',
          border: `1px solid ${hovered ? 'var(--primary)' : 'var(--border)'}`,
          boxShadow: hovered ? '0 8px 24px rgba(71,27,142,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.25s ease',
        }}
      >
        <img
          src={movie.poster}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.35s ease',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800';
          }}
        />

        {/* Censor rating badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: 4,
            padding: '2px 7px',
            fontSize: 10,
            fontWeight: 700,
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {movie.censorRating || 'U'}
        </div>

        {/* Language pill */}
        {movie.language && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(71,27,142,0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: 4,
              padding: '2px 7px',
              fontSize: 10,
              fontWeight: 600,
              color: '#fff',
            }}
          >
            {movie.language}
          </div>
        )}

        {/* Hover overlay CTA button */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: 12,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <button
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            <Ticket size={14} />
            Book Tickets
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: hovered ? 'var(--primary)' : 'var(--text-h)',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: 0,
            transition: 'color 0.15s',
          }}
        >
          {movie.title}
        </h3>
        {movie.genres?.length > 0 && (
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              marginTop: 3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: '3px 0 0 0',
            }}
          >
            {movie.genres.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}
