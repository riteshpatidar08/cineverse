import React from 'react';

export default function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: 'Rohan Sharma',
      role: 'Movie Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      comment: 'CineVerse made seat selection effortless! Picked IMAX seats in seconds and got ₹100 cashback via my HDFC card.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Verified Moviegoer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      comment: 'The instant QR ticket functionality is a lifesaver. Walked straight into PVR without waiting in long box office lines.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Aarav Mehta',
      role: 'Weekend Cinema Fan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment: 'Zero convenience fees and simple ticket cancellations make CineVerse my go-to movie booking app every weekend.',
      rating: 5,
    },
  ];

  return (
    <section
      style={{
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
        padding: '48px 16px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--primary)',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              padding: '3px 10px',
              borderRadius: 20,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-block',
              marginBottom: 10,
            }}
          >
            Loved By Moviegoers
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-h)', margin: 0 }}>
            What Our Community Says
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 2, color: '#f59e0b', fontSize: 14 }}>
                  {'★'.repeat(rev.rating)}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid var(--border)',
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-h)' }}>{rev.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
