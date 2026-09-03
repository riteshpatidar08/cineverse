import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Switch } from '../ui/Switch';

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: 'Guest Pass',
      priceMonthly: '$0',
      priceYearly: '$0',
      period: 'forever',
      description: 'Ideal for occasional moviegoers who want quick seat reservations.',
      badge: 'Free Tier',
      popular: false,
      features: [
        'Standard Seat Booking',
        'Instant E-Pass QR Tickets',
        'Standard Customer Support',
        'In-App Booking History',
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline',
    },
    {
      name: 'CinePass VIP',
      priceMonthly: '$19.99',
      priceYearly: '$15.99',
      period: '/ month',
      description: 'Our most popular plan for regular cinema lovers looking for maximum perks.',
      badge: 'Most Popular',
      popular: true,
      features: [
        '2 Free IMAX / 4K Tickets per Month',
        'Zero Convenience Fees Forever',
        'Free Jumbo Popcorn & Soda Upgrades',
        '48-Hour Early Access to Premieres',
        '10% Discount on In-Seat Dining',
        'Free Instant Seat Exchange',
      ],
      buttonText: 'Start 14-Day Free Trial',
      buttonVariant: 'primary',
    },
    {
      name: 'CinePass Executive',
      priceMonthly: '$39.99',
      priceYearly: '$31.99',
      period: '/ month',
      description: 'Ultimate VIP luxury tier for families, cinephiles, and frequent film buffs.',
      badge: 'Ultimate VIP',
      popular: false,
      features: [
        '5 Free Any-Format Tickets per Month',
        'Unlimited Complimentary Seat Upgrades',
        '20% Discount on All Food & Beverage',
        'Bring a Guest Free (1 Ticket / mo)',
        'VIP Lounge Access at Partner Theaters',
        'Dedicated 24/7 Concierge Support',
      ],
      buttonText: 'Join Executive Club',
      buttonVariant: 'secondary',
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-white/40 dark:bg-black/20">
      
      {/* Background Accent Lines */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="secondary" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            Membership Plans
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-h m-0">
            Choose Your CinePass Tier
          </h2>
          <p className="text-text/75 text-base md:text-lg mt-4 leading-relaxed">
            Unlock free tickets, zero convenience fees, and VIP lounge perks with our transparent membership options.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="mt-8 inline-flex items-center gap-4 glass px-5 py-2.5 rounded-full border border-white/20 shadow-lg">
            <span className={`text-xs font-bold ${!isYearly ? 'text-text-h' : 'text-text/60'}`}>
              Monthly Billing
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isYearly ? 'text-text-h' : 'text-text/60'}`}>
              Yearly Billing
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 text-[10px] font-extrabold uppercase">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            return (
              <Card
                key={index}
                className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 ${
                  plan.popular
                    ? 'glass border-2 border-primary shadow-2xl shadow-primary/15 scale-105 z-10 bg-gradient-to-b from-primary/10 via-white/80 to-white/90 dark:via-neutral-dark/80 dark:to-neutral-dark/90'
                    : 'glass border border-white/20 dark:border-white/10 hover:border-primary/30 shadow-lg'
                }`}
              >
                {/* Popular Badge Floating Header */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" className="px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider shadow-lg bg-primary text-white">
                      👑 {plan.badge}
                    </Badge>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-text-h">{plan.name}</h3>
                    {!plan.popular && (
                      <Badge variant="default" className="text-[10px] font-bold">
                        {plan.badge}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-text/70 min-h-[36px]">{plan.description}</p>

                  {/* Price */}
                  <div className="my-6 flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-extrabold text-text-h">{price}</span>
                    <span className="text-sm font-semibold text-text/70">{plan.period}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="text-xs font-bold uppercase tracking-wider text-text/60">Included Features:</div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-sm text-text/80">
                        <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Button */}
                <CardFooter className="p-0 pt-8 border-none mt-auto">
                  <Link to="/signup" className="w-full">
                    <Button
                      variant={plan.buttonVariant}
                      size="lg"
                      className="w-full font-bold uppercase tracking-wider text-xs shadow-md"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
