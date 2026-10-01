import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, getShows } from '../../redux/slices/moviesSlice';

/* ─── helpers ─────────────────────────────────────────── */
function formatDuration(mins) {
  if (!mins) return null;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function formatTime(iso) {
  return new Date(iso)
    .toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    .toUpperCase();
}

function getUniqueDates(theaters) {
  const set = new Set();
  theaters?.forEach(({ shows }) =>
    shows?.forEach(({ startTime }) => {
      if (startTime) set.add(startTime.slice(0, 10));
    })
  );
  return Array.from(set).sort();
}

function showsForDate(shows, dateStr) {
  return shows.filter((s) => s.startTime?.slice(0, 10) === dateStr);
}

/* ─── movie header ─────────────────────────────────────── */
function MovieHeader({ movie }) {
  if (!movie) return null;
  const { title, poster, censorRating, duration, genres = [], releaseDate } = movie;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <div
      style={{
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 56,
        zIndex: 30,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {poster && (
          <div
            style={{
              width: 44,
              height: 62,
              borderRadius: 6,
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid var(--border)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <img src={poster} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: 'var(--text-h)',
                letterSpacing: '-0.3px',
                margin: 0,
              }}
            >
              {title}
            </h1>
            {year && (
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({year})</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {censorRating && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: 'var(--primary)',
                  color: '#fff',
                }}
              >
                {censorRating}
              </span>
            )}
            {duration && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {formatDuration(duration)}</span>
            )}
            {genres.length > 0 && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{genres.join(' · ')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── date strip ──────────────────────────────────────── */
function DateStrip({ dates, selected, onSelect }) {
  if (!dates.length) return null;

  const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '16px 16px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto',
      }}
    >
      {dates.map((d) => {
        const dt = new Date(d);
        const active = d === selected;
        return (
          <button
            key={d}
            onClick={() => onSelect(d)}
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 16px',
              borderRadius: 8,
              border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: active ? 'var(--primary)' : 'var(--bg-2)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              gap: 2,
              minWidth: 60,
              boxShadow: active ? '0 4px 12px rgba(71,27,142,0.2)' : 'none',
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: active ? '#fff' : 'var(--text-h)',
                lineHeight: 1,
              }}
            >
              {dt.getDate()}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: active ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {DAY[dt.getDay()]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── legend ───────────────────────────────────────────── */
function LegendBar() {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '12px 16px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      {[
        { dot: '#22c55e', label: 'Available' },
        { dot: '#f59e0b', label: 'Filling fast' },
        { dot: '#ff4757', label: 'Almost full' },
      ].map(({ dot, label }) => (
        <span
          key={label}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}
        >
          <span
            style={{ width: 8, height: 8, borderRadius: '50%', background: dot, display: 'inline-block' }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}

/* ─── show time button ─────────────────────────────────── */
function ShowTimeButton({ shows }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  const firstShow = shows[0];
  const time = formatTime(firstShow.startTime);

  const allCategories = [...new Set(shows.flatMap((s) => s.categoryPricing?.map((cp) => cp.category) || []))];

  const handleClick = () => {
    if (shows.length === 1) {
      navigate(`/seat-select/${shows[0]._id}`);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: `1px solid ${hovered ? 'var(--primary)' : 'var(--border)'}`,
            background: hovered ? 'rgba(71,27,142,0.06)' : 'var(--bg)',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontSize: 13,
            fontWeight: 700,
            color: hovered ? 'var(--primary)' : 'var(--text-h)',
            whiteSpace: 'nowrap',
          }}
        >
          {time}
        </button>

        {/* Tooltip */}
        {hovered && allCategories.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--text-h)',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 600,
              color: '#fff',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 20,
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }}
          >
            {allCategories.join(' · ')}
          </div>
        )}
      </div>

      {/* Screen selector modal */}
      {showModal && shows.length > 1 && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 24,
              width: '100%',
              maxWidth: 420,
              margin: '0 16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 18,
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-h)' }}>
                  Select Screen Format
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  Showtime: <strong>{time}</strong>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: 14,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {shows.map((show) => {
                const cats = show.categoryPricing?.map((c) => `${c.category}: ₹${c.price}`).join(' · ') || '';
                return (
                  <button
                    key={show._id}
                    onClick={() => navigate(`/seat-select/${show._id}`)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'var(--bg-2)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.background = 'rgba(71,27,142,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg-2)';
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-h)' }}>
                      {show.screenName}
                    </div>
                    {cats && (
                      <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>
                        {cats}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── theater card ─────────────────────────────────────── */
function TheaterCard({ theaterData, selectedDate }) {
  const { theater, shows } = theaterData;
  const filtered = showsForDate(shows, selectedDate);
  if (!filtered.length) return null;

  // Group by time
  const groupedByTime = {};
  filtered.forEach((show) => {
    const t = formatTime(show.startTime);
    if (!groupedByTime[t]) groupedByTime[t] = [];
    groupedByTime[t].push(show);
  });

  const sortedTimes = Object.keys(groupedByTime).sort((a, b) => {
    const tA = filtered.find((s) => formatTime(s.startTime) === a)?.startTime;
    const tB = filtered.find((s) => formatTime(s.startTime) === b)?.startTime;
    return new Date(tA) - new Date(tB);
  });

  return (
    <div
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      }}
    >
      {/* Theater initials */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: 'var(--primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {theater.name?.substring(0, 2).toUpperCase()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-h)', margin: 0 }}>
              {theater.name}
            </h3>
            {theater.city && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, margin: '2px 0 0 0' }}>
                📍 {theater.city}
              </p>
            )}
          </div>
        </div>

        {/* Show times */}
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {sortedTimes.map((t) => (
            <ShowTimeButton key={t} shows={groupedByTime[t]} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── main page ────────────────────────────────────────── */
export default function BookingPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singleMovie: movie, shows, loading } = useSelector((s) => s.movies);
  const { latitude, longitude } = useSelector((s) => s.location);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!movie || movie._id !== id) dispatch(fetchMovieById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      const lat = latitude || 28.6139;
      const lon = longitude || 77.209;
      dispatch(getShows({ id, longitude: lon, latitude: lat }));
    }
  }, [id, latitude, longitude, dispatch]);

  const theaters = shows?.result || [];
  const uniqueDates = getUniqueDates(theaters);

  useEffect(() => {
    if (uniqueDates.length && !selectedDate) setSelectedDate(uniqueDates[0]);
  }, [shows, uniqueDates, selectedDate]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
          color: 'var(--text-muted)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 60" />
        </svg>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Loading available showtimes...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Sticky movie header */}
      <MovieHeader movie={movie} />

      {/* Date + legend */}
      <DateStrip dates={uniqueDates} selected={selectedDate} onSelect={setSelectedDate} />
      <LegendBar />

      {/* Theater list */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '20px 16px 56px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {!theaters.length ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 16px',
              color: 'var(--text-muted)',
              background: 'var(--bg-2)',
              borderRadius: 12,
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎬</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-h)', marginBottom: 4 }}>
              No shows available for this date
            </div>
            <div style={{ fontSize: 13 }}>Please select another date above or check back soon.</div>
          </div>
        ) : (
          theaters.map((t, i) => (
            <TheaterCard
              key={t.theater?._id || i}
              theaterData={t}
              selectedDate={selectedDate}
            />
          ))
        )}
      </div>
    </div>
  );
}
