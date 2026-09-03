import React, { useState } from 'react';
import { Badge } from '../ui/Badge';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does CineVerse eliminate convenience fees on movie tickets?',
      a: 'We partner directly with theater chains and multiplexes through our unified cloud API. This direct integration removes third-party payment middleman surcharges for all registered CinePass members.',
    },
    {
      q: 'Can I exchange or cancel my movie ticket if plans change?',
      a: 'Yes! All tickets booked via CineVerse can be canceled or rescheduled up to 2 hours before showtime with zero penalty fee. Refunds are instantly credited to your CineWallet or original payment method.',
    },
    {
      q: 'What perks come with a CinePass VIP Membership?',
      a: 'CinePass VIP includes 2 free IMAX/4K tickets monthly, zero convenience fees on all bookings, complimentary popcorn refills, 48-hour early ticket access to blockbuster premieres, and in-seat dining discounts.',
    },
    {
      q: 'How do I order food and beverage directly to my theater seat?',
      a: 'Once inside a partner auditorium, open your active ticket in the CineVerse app, tap "Order Food", pick your snacks, and select your seat row & number. Our staff delivers it directly to your recliner.',
    },
    {
      q: 'How can a theater operator list their screens on CineVerse?',
      a: 'Theater operators can submit a request via our Cinema Partner Hub section. Our team provides free hardware, Cloud POS software integration, and full onboarding within 48 hours.',
    },
  ];

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <Badge variant="primary" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            Got Questions?
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-h m-0">
            Frequently Asked Questions
          </h2>
          <p className="text-text/75 text-base md:text-lg mt-4">
            Everything you need to know about booking tickets, CinePass membership, and theater partnerships.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass rounded-2xl border border-white/20 dark:border-white/10 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-text-h text-base md:text-lg hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-extrabold transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-primary text-white' : ''}`}>
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-text/80 text-sm md:text-base leading-relaxed border-t border-border/40 pt-4">
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
