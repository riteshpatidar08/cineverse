import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTheaters } from '../../services/movie.api';
import { MapPin, Clock, ChevronRight, Film } from 'lucide-react';

export default function NearbyTheatersSection() {
  const { currentCity } = useSelector((s) => s.location);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchTheaters({ city: currentCity || 'Jaipur' })
      .then((res) => {
        if (isMounted) {
          const list = res.data?.data || [];
          setTheaters(list);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching theaters:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentCity]);

  // Helper to derive badges from theater name
  const getFormats = (name) => {
    if (name.includes('IMAX') || name.includes('PVR')) return ['IMAX 3D', '4DX', 'Dolby Atmos'];
    if (name.includes('INOX')) return ['Insignia Lounge', 'MX4D', 'Dolby Atmos'];
    if (name.includes('Cinepolis')) return ['VIP Recliners', 'RealD 3D', 'Dolby 7.1'];
    if (name.includes('Rajmandir')) return ['Heritage Legend', 'Dolby Atmos', 'Royal Stall'];
    return ['Dolby 7.1', '4K Laser', 'Recliner Seats'];
  };

  return (
    <section
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 16px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-h)', margin: 0 }}>
              Top Cinemas {currentCity ? `in ${currentCity}` : 'Near You'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
              Book tickets at District &amp; CineVerse partner cinemas with premium screen formats
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  height: 140,
                  opacity: 0.5,
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : theaters.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No cinemas found for {currentCity}.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {theaters.slice(0, 8).map((t) => {
              const formats = getFormats(t.name);
              return (
                <div
                  key={t._id}
                  style={{
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-h)', margin: 0, lineHeight: 1.3 }}>
                        {t.name}
                      </h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} color="var(--primary)" />
                        {t.city || currentCity || 'Jaipur'}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {formats.map((fmt) => (
                      <span
                        key={fmt}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: 'var(--primary)',
                          background: 'var(--bg-3)',
                          border: '1px solid var(--border)',
                          padding: '3px 8px',
                          borderRadius: 4,
                        }}
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 4,
                      paddingTop: 12,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      Next show: <strong style={{ color: 'var(--text-h)' }}>12:30 PM</strong>
                    </span>
                    <Link
                      to="/movies"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      View Showtimes <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
