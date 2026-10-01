import React from 'react';

export default function ValueProposition() {
  const features = [
    {
      icon: '🎟️',
      title: 'Instant M-Tickets',
      desc: 'No queues. Receive your scannable QR ticket directly on phone.',
    },
    {
      icon: '💸',
      title: 'Zero Convenience Fee',
      desc: 'Enjoy special discount waivers on bank partner credit cards.',
    },
    {
      icon: '🍿',
      title: 'F&B Combos Included',
      desc: 'Pre-book your favorite popcorn and soft drinks at discounted rates.',
    },
    {
      icon: '🔄',
      title: 'Hassle-Free Cancellation',
      desc: 'Cancel up to 2 hours prior to showtime for instant full refunds.',
    },
  ];

  return (
    <section
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '36px 16px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {features.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 8,
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: 26, lineHeight: 1 }}>{item.icon}</span>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-h)', margin: 0 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
