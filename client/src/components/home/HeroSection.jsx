import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Ticket } from 'lucide-react';

const CITY_HERITAGE_MAP = {
  jaipur: {
    name: 'Hawa Mahal',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1800',
  },
  mumbai: {
    name: 'Gateway of India',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=1800',
  },
  delhi: {
    name: 'India Gate',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1800',
  },
  hyderabad: {
    name: 'Charminar',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1800',
  },
  kolkata: {
    name: 'Victoria Memorial',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=1800',
  },
  bengaluru: {
    name: 'Vidhana Soudha',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=1800',
  },
  bangalore: {
    name: 'Vidhana Soudha',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=1800',
  },
  chennai: {
    name: 'Kapaleeshwarar Temple',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1800',
  },
  agra: {
    name: 'Taj Mahal',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1800',
  },
  varanasi: {
    name: 'Kashi Vishwanath Ghats',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1800',
  },
  amritsar: {
    name: 'Golden Temple',
    image: 'https://images.unsplash.com/photo-1609946782912-6738806a8361?auto=format&fit=crop&q=80&w=1800',
  },
  udaipur: {
    name: 'Lake Palace',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&q=80&w=1800',
  },
  default: {
    name: 'Cinemas',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1800',
  },
};

function getHeritageForCity(city) {
  if (!city) return CITY_HERITAGE_MAP.default;
  const normalized = city.toLowerCase().trim();
  for (const key in CITY_HERITAGE_MAP) {
    if (normalized.includes(key)) {
      return CITY_HERITAGE_MAP[key];
    }
  }
  return CITY_HERITAGE_MAP.default;
}

export default function HeroSection() {
  const { currentCity } = useSelector((s) => s.location);
  const heritage = getHeritageForCity(currentCity);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '340px',
        display: 'flex',
        alignItems: 'center',
        background: '#090d16',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Background Image - City Heritage Photo */}
      <img
        src={heritage.image}
        alt={heritage.name}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          opacity: 0.85,
          filter: 'brightness(0.95)',
        }}
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1800';
        }}
      />

      {/* Gradient Overlay for Left Text Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(9,13,22,0.92) 0%, rgba(9,13,22,0.72) 48%, rgba(9,13,22,0.15) 100%)',
        }}
      />

      {/* Content Container */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '48px 20px',
          width: '100%',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.8px',
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            Movies in {currentCity || 'Your City'}
          </h1>

          <p
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.5,
              margin: 0,
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            Check out now showing movies, compare showtimes across local theaters, and book tickets instantly.
          </p>

          <div style={{ marginTop: 6 }}>
            <Link
              to="/movies"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 24px',
                borderRadius: 8,
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}
            >
              <Ticket size={16} />
              Browse Movies
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
