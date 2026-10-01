import React, { useState } from 'react';
import { Landmark, Copy, Check, Tag } from 'lucide-react';

export default function OffersSection() {
  const [copiedCode, setCopiedCode] = useState(null);

  const offers = [
    {
      id: 1,
      bank: 'HDFC BANK',
      logoBg: '#004c8f',
      logoColor: '#ffffff',
      title: 'Buy 1 Get 1 Free on Movie Tickets',
      code: 'HDFCBOGO',
      validTill: '31 Oct 2026',
      desc: 'Valid on HDFC Bank Regalia & Infinia Credit Cards on weekends.',
    },
    {
      id: 2,
      bank: 'ICICI BANK',
      logoBg: '#f37021',
      logoColor: '#ffffff',
      title: '25% Instant Discount up to ₹150',
      code: 'ICICICINE',
      validTill: '15 Nov 2026',
      desc: 'Applicable on min booking of 2 tickets via ICICI NetBanking & Cards.',
    },
    {
      id: 3,
      bank: 'CINE PASS',
      logoBg: 'var(--primary)',
      logoColor: '#ffffff',
      title: 'Flat ₹100 Off on First Booking',
      code: 'FIRSTSHOW',
      validTill: '31 Dec 2026',
      desc: 'For all new CineVerse users booking movie tickets online.',
    },
  ];

  const handleCopy = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section
      id="offers-section"
      style={{
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 16px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-h)', margin: 0 }}>
              Bank &amp; Payment Offers
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
              Save on your movie ticket bookings with partner bank credit &amp; debit card offers
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {offers.map((offer) => (
            <div
              key={offer.id}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: 16,
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                {/* Bank Header Logo Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: offer.logoBg,
                      color: offer.logoColor,
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Landmark size={14} />
                    <span>{offer.bank}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Valid: {offer.validTill}</span>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-h)', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                  {offer.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{offer.desc}</p>
              </div>

              {/* Promo Code Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  paddingTop: 12,
                  borderTop: '1px dashed var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Tag size={14} color="var(--primary)" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>CODE:</span>
                  <code
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: 'var(--primary)',
                      background: 'var(--bg-3)',
                      padding: '4px 10px',
                      borderRadius: 6,
                      letterSpacing: '1px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {offer.code}
                  </code>
                </div>

                <button
                  onClick={() => handleCopy(offer.code)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: copiedCode === offer.code ? '#16a34a' : 'var(--text-h)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check size={14} color="#16a34a" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
