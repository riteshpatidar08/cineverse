import React, { useState } from 'react';

export default function CtaNewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, rgba(71,27,142,0.08) 0%, rgba(225,29,72,0.05) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '56px 16px',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
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
            marginBottom: 12,
          }}
        >
          Never Miss A Release
        </span>
        <h2
          style={{
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 800,
            color: 'var(--text-h)',
            lineHeight: 1.25,
            letterSpacing: '-0.5px',
            marginBottom: 10,
          }}
        >
          Get Movie Updates &amp; Special Ticket Discounts
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: 520,
            margin: '0 auto 28px',
          }}
        >
          Subscribe to CineVerse weekly digest to receive secret promo codes, weekend movie recommendations, and early ticket access.
        </p>

        {subscribed ? (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: 10,
              background: '#22c55e15',
              border: '1px solid #22c55e40',
              color: '#16a34a',
              fontSize: 14,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Thank you for subscribing! Check your inbox for your welcome discount code.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: 8,
              maxWidth: 460,
              margin: '0 auto',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: '1 1 240px',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text-h)',
                fontSize: 14,
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}
            >
              Subscribe Now
            </button>
          </form>
        )}

        <div
          style={{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            fontSize: 12,
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
          }}
        >
          <span>✓ No spam ever</span>
          <span>✓ Unsubscribe anytime</span>
          <span>✓ 100% Free</span>
        </div>
      </div>
    </section>
  );
}
