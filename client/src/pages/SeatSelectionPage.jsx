import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShowSeats } from '../services/movie.api';
import { createBooking, verifyPayment } from '../services/booking.api';

/* ─── Helpers ─────────────────────────────────────────── */
function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso)
    .toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function SeatSelectionPage() {
  console.log(useParams());
  const { showId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showData, setShowData] = useState(null); //transform this login into redux toolkit
  const [selectedSeats, setSelectedSeats] = useState([]); // [{ seatId, price, rowLabel, seatNum }]
  const maxSeats = 10;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    document.body.appendChild(script);
  }, []);

  // console.log(movie)
  console.log(showId);
  console.log(loading);
  useEffect(() => {
    if (!showId) return;
    setLoading(true);
    getShowSeats(showId)
      .then((res) => {
        if (res.data && res.data.success && res.data.data) {
          console.log(res.data.data);
          setShowData(res.data.data);
        } else {
          console.log(res.data.message);
          setError(res.data?.message || 'Failed to load show seats');
        }
      })
      .catch((err) => {
        console.error('Error fetching show seats:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Error fetching show seats'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showId]);

  const handleSeatClick = (seat, rowLabel, rowPrice) => {
    if (seat.status === 'booked' || seat.status === 'locked') return;

    const exists = selectedSeats.some((s) => s.seatId === seat.seatId);
    if (exists) {
      setSelectedSeats((prev) => prev.filter((s) => s.seatId !== seat.seatId));
    } else {
      if (selectedSeats.length >= maxSeats) {
        alert(`You can select a maximum of ${maxSeats} seats.`);
        return;
      }
      setSelectedSeats((prev) => [
        ...prev,
        {
          seatId: seat.seatId,
          price: seat.rowPrice || rowPrice || 200,
          rowLabel,
          number: seat.number,
        },
      ]);
    }
  };

  const { show, movie, theater } = showData || {};

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  }, [selectedSeats]);

  // Group rows by category, ordered so Premium is at back (top) and Regular is at front (bottom near screen)
  const groupedRows = useMemo(() => {
    if (!showData?.rows) return [];
    const groupsMap = new Map();

    showData.rows.forEach((row) => {
      const cat = (row.category || 'REGULAR').toUpperCase();
      if (!groupsMap.has(cat)) {
        groupsMap.set(cat, {
          category: cat,
          price: row.price || 0,
          rows: [],
        });
      }
      groupsMap.get(cat).rows.push(row);
    });
    console.log(groupsMap);
    const categoryRank = (cat) => {
      const c = cat.toUpperCase();
      if (c.includes('LUXE') || c.includes('INSIGNIA') || c.includes('VIP'))
        return 50;
      if (
        c.includes('PLATINUM') ||
        c.includes('GOLD') ||
        c.includes('ROYAL') ||
        c.includes('BALCONY')
      )
        return 40;
      if (
        c.includes('PREMIUM') ||
        c.includes('PRIME') ||
        c.includes('EXECUTIVE') ||
        c.includes('DRESS')
      )
        return 30;
      if (c.includes('SILVER') || c.includes('CLASSIC') || c.includes('NORMAL'))
        return 20;
      if (c.includes('REGULAR') || c.includes('STALL')) return 10;
      return 0;
    };

    const groups = Array.from(groupsMap.values());

    // Sort descending: highest price/tier at top (back of theater), lowest (REGULAR) at bottom (front near screen)
    groups.sort(
      (a, b) =>
        b.price - a.price || categoryRank(b.category) - categoryRank(a.category)
    );

    return groups;
  }, [showData]);

  const handleProceed = () => {
    if (!showData || selectedSeats.length === 0) return;
    navigate('/checkout', {
      state: {
        showId,
        showData,
        selectedSeats,
        totalPrice,
      },
    });
  };
  if (loading) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p
            style={{
              color: 'var(--text-muted, #6b7280)',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Loading Seat Layout...
          </p>
        </div>
      </div>
    );
  }

  if (error || !showData) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 8,
              color: 'var(--text-h, #111827)',
            }}
          >
            Unable to Load Show Seats
          </h2>
          <p
            style={{
              color: 'var(--text-muted, #6b7280)',
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            {error || 'Show details not found.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              background: '#6366f1',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 120 }}
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 16,
                color: '#475569',
              }}
              title="Go Back"
            >
              ←
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#0f172a',
                    margin: 0,
                  }}
                >
                  {movie?.title || 'Movie Title'}
                </h1>
                {movie?.censorRating && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: '#e2e8f0',
                      color: '#475569',
                    }}
                  >
                    {movie.censorRating}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                <strong>{theater?.name}</strong> •{' '}
                {show?.screenName || 'Screen'} | {formatDate(show?.showDate)},{' '}
                <span style={{ color: '#4f46e5', fontWeight: 700 }}>
                  {formatTime(show?.startTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Seat Canvas ─────────────────────────────────────────── */}
      <main style={{ maxWidth: 1200, margin: '24px auto', padding: '0 16px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            padding: '32px 24px 48px',
            overflowX: 'auto',
          }}
        >
          {/* Seat Rows by Category */}
          <div
            style={{
              minWidth: 680,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 28,
            }}
          >
            {groupedRows.map((group, groupIdx) => (
              <div
                key={groupIdx}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Category Header Label */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    width: '100%',
                    maxWidth: 720,
                    margin: '12px 0 20px',
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '1px',
                      color: '#475569',
                      textTransform: 'uppercase',
                      background: '#f8fafc',
                      padding: '4px 14px',
                      borderRadius: 20,
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    {group.category} : ₹{group.price}
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                </div>

                {/* Rows in this group */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  {group.rows.map((row) => {
                    const layoutChars = row.layout
                      ? row.layout.split('')
                      : null;
                    let seatIndex = 0;

                    return (
                      <div
                        key={row.label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        {/* Row Label */}
                        <div
                          style={{
                            width: 24,
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#64748b',
                            textAlign: 'right',
                            userSelect: 'none',
                          }}
                        >
                          {row.label}
                        </div>

                        {/* Seat Items according to layout */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          {layoutChars
                            ? layoutChars.map((char, charIdx) => {
                                if (char === '_' || char === ' ') {
                                  return (
                                    <div key={charIdx} style={{ width: 20 }} />
                                  );
                                }

                                const seat = row.seats[seatIndex++];
                                if (!seat) {
                                  return (
                                    <div
                                      key={charIdx}
                                      style={{ width: 32, height: 32 }}
                                    />
                                  );
                                }

                                const isSelected = selectedSeats.some(
                                  (s) => s.seatId === seat.seatId
                                );
                                const isOccupied =
                                  seat.status === 'booked' ||
                                  seat.status === 'locked';

                                return (
                                  <button
                                    key={seat.seatId || charIdx}
                                    onClick={() =>
                                      handleSeatClick(
                                        seat,
                                        row.label,
                                        row.price
                                      )
                                    }
                                    disabled={isOccupied}
                                    style={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: 8,
                                      border: isSelected
                                        ? '1px solid #4f46e5'
                                        : isOccupied
                                        ? '1px solid #e2e8f0'
                                        : '1px solid #cbd5e1',
                                      background: isSelected
                                        ? '#6366f1'
                                        : isOccupied
                                        ? '#f1f5f9'
                                        : '#ffffff',
                                      color: isSelected
                                        ? '#ffffff'
                                        : isOccupied
                                        ? '#94a3b8'
                                        : '#1e293b',
                                      fontSize: 11,
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: isOccupied
                                        ? 'not-allowed'
                                        : 'pointer',
                                      transition: 'all 0.15s ease-in-out',
                                      boxShadow: isSelected
                                        ? '0 2px 8px rgba(99,102,241,0.4)'
                                        : 'none',
                                      transform: isSelected
                                        ? 'scale(1.05)'
                                        : 'none',
                                    }}
                                    title={`${seat.seatId} - ₹${row.price}`}
                                  >
                                    {isOccupied ? '×' : seat.number}
                                  </button>
                                );
                              })
                            : /* Fallback if no layout string */
                              row.seats.map((seat) => {
                                const isSelected = selectedSeats.some(
                                  (s) => s.seatId === seat.seatId
                                );
                                const isOccupied =
                                  seat.status === 'booked' ||
                                  seat.status === 'locked';

                                return (
                                  <button
                                    key={seat.seatId}
                                    onClick={() =>
                                      handleSeatClick(
                                        seat,
                                        row.label,
                                        row.price
                                      )
                                    }
                                    disabled={isOccupied}
                                    style={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: 8,
                                      border: isSelected
                                        ? '1px solid #4f46e5'
                                        : isOccupied
                                        ? '1px solid #e2e8f0'
                                        : '1px solid #cbd5e1',
                                      background: isSelected
                                        ? '#6366f1'
                                        : isOccupied
                                        ? '#f1f5f9'
                                        : '#ffffff',
                                      color: isSelected
                                        ? '#ffffff'
                                        : isOccupied
                                        ? '#94a3b8'
                                        : '#1e293b',
                                      fontSize: 11,
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: isOccupied
                                        ? 'not-allowed'
                                        : 'pointer',
                                      transition: 'all 0.15s ease-in-out',
                                      boxShadow: isSelected
                                        ? '0 2px 8px rgba(99,102,241,0.4)'
                                        : 'none',
                                    }}
                                  >
                                    {isOccupied ? '×' : seat.number}
                                  </button>
                                );
                              })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* ─── Screen Perspective Visual ─────────────────────────────────────────── */}
            <div
              style={{
                marginTop: 40,
                textAlign: 'center',
                width: '100%',
                maxWidth: 640,
              }}
            >
              <div
                style={{
                  height: 36,
                  width: '100%',
                  background:
                    'linear-gradient(180deg, rgba(129, 140, 248, 0.4) 0%, rgba(99, 102, 241, 0.05) 100%)',
                  borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                  borderTop: '3px solid #818cf8',
                  boxShadow: '0 -8px 24px rgba(99,102,241,0.25)',
                  transform: 'perspective(300px) rotateX(-20deg)',
                  margin: '0 auto 12px',
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '2px',
                  color: '#6366f1',
                  textTransform: 'uppercase',
                }}
              >
                SCREEN THIS WAY
              </span>
            </div>

            {/* ─── Legend Bar ─────────────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
                marginTop: 20,
                padding: '12px 24px',
                borderRadius: 30,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              {[
                {
                  label: 'Available',
                  color: '#ffffff',
                  border: '#cbd5e1',
                  text: '',
                },
                {
                  label: 'Occupied',
                  color: '#f1f5f9',
                  border: '#e2e8f0',
                  text: '×',
                },
                {
                  label: 'Selected',
                  color: '#6366f1',
                  border: '#4f46e5',
                  text: '',
                },
              ].map(({ label, color, border, text }) => (
                <div
                  key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: color,
                      border: `1px solid ${border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#94a3b8',
                    }}
                  >
                    {text}
                  </div>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ─── Floating Bottom Checkout Bar ─────────────────────────────────────────── */}
      {selectedSeats.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            padding: '16px 24px',
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                {selectedSeats.length}{' '}
                {selectedSeats.length === 1 ? 'Seat' : 'Seats'} Selected
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#0f172a',
                  marginTop: 2,
                }}
              >
                {selectedSeats.map((s) => s.seatId).join(', ')}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}
                >
                  Total Price
                </div>
                <div
                  style={{ fontSize: 20, fontWeight: 900, color: '#4f46e5' }}
                >
                  ₹{totalPrice}
                </div>
              </div>

              <button
                onClick={handleProceed}
                style={{
                  padding: '12px 36px',
                  borderRadius: 10,
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 15,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                  transition: 'transform 0.1s ease',
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = 'scale(0.97)')
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
