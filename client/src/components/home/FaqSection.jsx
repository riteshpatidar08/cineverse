import React, { useState } from 'react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I receive my movie ticket after booking?',
      a: 'Once your payment is complete, your M-Ticket with a scannable QR code is sent instantly via SMS and Email. You can also view it anytime under "My Bookings" in your account.',
    },
    {
      q: 'Are there any convenience fees charged on ticket bookings?',
      a: 'CineVerse offers 0% booking convenience fee on selected theaters and promotional partner bookings. Any nominal fee charged is clearly itemized before payment.',
    },
    {
      q: 'Can I cancel or reschedule my movie ticket?',
      a: 'Yes! Tickets can be cancelled up to 2 hours before showtime for participating cinemas (PVR, INOX, Cinepolis). The refund amount is credited back to your original payment method or CineWallet within 24 hours.',
    },
    {
      q: 'How do bank offers and promo codes work?',
      a: 'Select your preferred showtime and seats, proceed to checkout, and enter your bank card details or promo code in the payment step to enjoy instant discounts or Buy-1-Get-1 offers.',
    },
    {
      q: 'Do I need to print a physical paper ticket at the theater?',
      a: 'No paper ticket is required! Simply present the M-Ticket QR code on your mobile screen at the cinema entry gate.',
    },
  ];

  return (
    <section
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '48px 16px',
      }}
    >
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-h)', margin: 0 }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Got questions? We've got answers to help you book smoothly.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  background: isOpen ? 'var(--bg-2)' : 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px 20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-h)' }}>
                    {faq.q}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 20px 16px 20px',
                      fontSize: 13,
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border)',
                      paddingTop: 12,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
