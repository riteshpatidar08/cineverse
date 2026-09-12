import React , {useEffect} from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedSpotlight from '../components/home/FeaturedSpotlight';
import ValueProposition from '../components/home/ValueProposition';
import PricingSection from '../components/home/PricingSection';
import PartnerSection from '../components/home/PartnerSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FaqSection from '../components/home/FaqSection';
import CtaNewsletterSection from '../components/home/CtaNewsletterSection';
import { nearByMovies } from '../../redux/slices/moviesSlice';
import {useDispatch , useSelector } from 'react-redux'
export default function Home() {
  const dispatch = useDispatch() ;
  const {latitude , longitude } = useSelector((state)=>state.location);
  useEffect(()=>{
dispatch(nearByMovies({latitude, longitude}))
  })
  return (
    <div className="min-h-screen bg-[var(--bg)] text-text transition-colors duration-300 overflow-hidden">
      {/* 1. Hero & Ticket Search Section */}
      <HeroSection />

      {/* 2. Featured Movie Showcase & Category Spotlight */}
      <FeaturedSpotlight />

      {/* 3. Core Value Proposition & Technology Highlights */}
      <ValueProposition />

      {/* 4. CinePass Membership Tiers & Pricing */}
      {/* <PricingSection /> */}

      {/* 5. Cinema & Business Partner Solutions (B2B POS & Listing Hub) */}
      {/* <PartnerSection /> */}

      {/* 6. Testimonials, Reviews & Industry Press Quotes */}
      <TestimonialsSection />

      {/* 7. Frequently Asked Questions (FAQ Accordion) */}
      <FaqSection />

      {/* 8. Call to Action & VIP Newsletter Subscription */}
      <CtaNewsletterSection />
    </div>
  );
}
