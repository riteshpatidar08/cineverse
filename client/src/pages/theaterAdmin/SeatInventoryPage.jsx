mport React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getShows,
  getShowInventory,
  blockSeats,
  unblockSeats,
} from '../../services/theaterAdmin.api.js';
import {
  Armchair,
  CheckCircle,
  Clock,
  Lock,
  Wrench,
  AlertTriangle,
  RefreshCw,
  X,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export default function SeatInventoryPage() {
  const [searchParams] = useSearchParams();
  const initialShowId = searchParams.get('showId');

  const [shows, setShows] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState(initialShowId || '');
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Seat interaction state
  const [selectedSeats, setSelectedSeats] = useState([]); // array of seatIds
  const [inspectSeat, setInspectSeat] = useState(null); // single seat details
  const [blockReason, setBlockReason] = useState('Broken Armrest - Awaiting Maintenance');
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch available shows
  useEffect(() => {
    getShows()
      .then((res) => {
        if (res.data?.success) {
          setShows(res.data.data);
          if (!selectedShowId && res.data.data.length > 0) {
            setSelectedShowId(res.data.data[0]._id);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // 2. Fetch inventory for selected show
  const fetchInventory = async () => {
    if (!selectedShowId) return;
    try {
      setLoading(true);
      const res = await getShowInventory(selectedShowId);
      if (res.data?.success) {
        setInventory(res.data.data);
        setSelectedSeats([]);
        setInspectSeat(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedShowId]);

  const toggleSelectSeat = (seat) => {
    if (seat.status === 'booked') {
      setInspectSeat(seat);
      return;
    }

    setInspectSeat(seat);
    if (selectedSeats.includes(seat.seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.seatId));
    } else {
      setSelectedSeats([...selectedSeats, seat.seatId]);
    }
  };

  const handleBlockSeats = async (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) return;
    setIsSubmitting(true);
    try {
      await blockSeats(selectedShowId, selectedSeats, blockReason);
      setIsBlockModalOpen(false);
      fetchInventory();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to block seats');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnblockSeats = async () => {
    if (selectedSeats.length === 0) return;
    if (window.confirm(`Unblock ${selectedSeats.length} seat(s) back to available pool?`)) {
      try {
        setIsSubmitting(true);
        await unblockSeats(selectedShowId, selectedSeats);
        fetchInventory();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to unblock seats');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Build seat lookup map
  const seatMap = new Map();
  if (inventory?.seats) {
    inventory.seats.forEach((s) => {
      seatMap.set(s.seatId, s);
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Show Selector */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
            Real-Time Seat Inventory &amp; Maintenance Locker
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Inspect booked customer seats, lock broken armrests for maintenance, and release holds.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={selectedShowId}
            onChange={(e) => setSelectedShowId(e.target.value)}
            style={{
              background: '#131929',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 8,
              padding: '10px 16px',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              outline: 'none',
              minWidth: 260,
            }}
          >
            {shows.map((s) => (
              <option key={s._id} value={s._id}>
                {s.movie?.title} ({s.screenName} - {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </option>
            ))}
          </select>

          <button
            onClick={fetchInventory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary Chips & Legend */}
      {inventory && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(14, 19, 32, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '14px 20px',
            gap: 16,
          }}
        >
          {/* Seat Status Counters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: '#22c55e' }} />
              <span style={{ color: '#94a3b8' }}>Available:</span>
              <strong style={{ color: '#fff' }}>{inventory.summary.available}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: '#eab308' }} />
              <span style={{ color: '#94a3b8' }}>Locked:</span>
              <strong style={{ color: '#fff' }}>{inventory.summary.locked}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: '#ef4444' }} />
              <span style={{ color: '#94a3b8' }}>Booked:</span>
              <strong style={{ color: '#fff' }}>{inventory.summary.booked}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: '#f97316' }} />
              <span style={{ color: '#94a3b8' }}>Blocked (Maint/VIP):</span>
              <strong style={{ color: '#fff' }}>{inventory.summary.blocked}</strong>
            </div>
          </div>

          {/* Action buttons if seats selected */}
          {selectedSeats.length > 0 && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#34d399', fontWeight: 700 }}>
                {selectedSeats.length} seat(s) selected:
              </span>

              <button
                onClick={() => setIsBlockModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 6,
                  background: '#f97316',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Wrench size={13} /> Block for Maintenance
              </button>

              <button
                onClick={handleUnblockSeats}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 6,
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <CheckCircle size={13} /> Unblock to Available
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Grid & Inspector Area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: inspectSeat ? '1fr 300px' : '1fr',
          gap: 20,
        }}
      >
        {/* Interactive Auditorium Map */}
        <div
          style={{
            background: 'rgba(14, 19, 32, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 30,
            overflowX: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Cinema Screen Curve */}
          <div
            style={{
              width: '75%',
              maxWidth: 500,
              height: 6,
              background: 'linear-gradient(90deg, transparent, #34d399, transparent)',
              borderRadius: 3,
              marginBottom: 24,
              boxShadow: '0 0 16px rgba(52, 211, 153, 0.4)',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '2px',
                color: '#64748b',
                textTransform: 'uppercase',
                display: 'block',
                marginTop: 10,
              }}
            >
              Auditorium Screen
            </span>
          </div>

          {/* Seating Grid */}
          {loading ? (
            <div style={{ padding: '60px', color: '#94a3b8' }}>Loading seat layout...</div>
          ) : !inventory || !inventory.rowsLayout || inventory.rowsLayout.length === 0 ? (
            <div style={{ padding: '40px', color: '#64748b' }}>
              No screen layout found for this screening.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
              {inventory.rowsLayout.map((row, rIdx) => {
                const seats = row.seats || [];
                const spaceIndex = row.spaceAfter || Math.floor(seats.length / 2);

                return (
                  <div
                    key={rIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      justifyContent: 'center',
                    }}
                  >
                    {/* Row Label */}
                    <span
                      style={{
                        width: 24,
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#94a3b8',
                        textAlign: 'right',
                      }}
                    >
                      {row.label}
                    </span>

                    {/* Left block */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {seats.slice(0, spaceIndex).map((seat) => {
                        const seatId = `${row.label}${seat.number}`;
                        const seatInfo = seatMap.get(seatId) || {
                          seatId,
                          status: 'available',
                          price: 200,
                        };
                        const isSelected = selectedSeats.includes(seatId);

                        let bgColor = 'rgba(34, 197, 94, 0.15)';
                        let borderColor = 'rgba(34, 197, 94, 0.35)';
                        let textColor = '#4ade80';

                        if (seatInfo.status === 'booked') {
                          bgColor = 'rgba(239, 68, 68, 0.25)';
                          borderColor = 'rgba(239, 68, 68, 0.5)';
                          textColor = '#f87171';
                        } else if (seatInfo.status === 'blocked') {
                          bgColor = 'rgba(249, 115, 22, 0.25)';
                          borderColor = 'rgba(249, 115, 22, 0.5)';
                          textColor = '#fb923c';
                        } else if (seatInfo.status === 'locked') {
                          bgColor = 'rgba(234, 179, 8, 0.25)';
                          borderColor = 'rgba(234, 179, 8, 0.5)';
                          textColor = '#facc15';
                        }

                        if (isSelected) {
                          borderColor = '#ffffff';
                          bgColor = '#6366f1';
                          textColor = '#ffffff';
                        }

                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSelectSeat(seatInfo)}
                            title={`${seatId} (${seatInfo.status})`}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 6,
                              background: bgColor,
                              border: `1px solid ${borderColor}`,
                              color: textColor,
                              fontSize: 10,
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'transform 0.1s',
                            }}
                          >
                            {seatInfo.status === 'blocked' ? (
                              <Wrench size={12} />
                            ) : seatInfo.status === 'booked' ? (
                              <Armchair size={12} />
                            ) : (
                              seat.number
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Aisle space */}
                    <div style={{ width: 24 }} />

                    {/* Right block */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {seats.slice(spaceIndex).map((seat) => {
                        const seatId = `${row.label}${seat.number}`;
                        const seatInfo = seatMap.get(seatId) || {
                          seatId,
                          status: 'available',
                          price: 200,
                        };
                        const isSelected = selectedSeats.includes(seatId);

                        let bgColor = 'rgba(34, 197, 94, 0.15)';
                        let borderColor = 'rgba(34, 197, 94, 0.35)';
                        let textColor = '#4ade80';

                        if (seatInfo.status === 'booked') {
                          bgColor = 'rgba(239, 68, 68, 0.25)';
                          borderColor = 'rgba(239, 68, 68, 0.5)';
                          textColor = '#f87171';
                        } else if (seatInfo.status === 'blocked') {
                          bgColor = 'rgba(249, 115, 22, 0.25)';
                          borderColor = 'rgba(249, 115, 22, 0.5)';
                          textColor = '#fb923c';
                        } else if (seatInfo.status === 'locked') {
                          bgColor = 'rgba(234, 179, 8, 0.25)';
                          borderColor = 'rgba(234, 179, 8, 0.5)';
                          textColor = '#facc15';
                        }

                        if (isSelected) {
                          borderColor = '#ffffff';
                          bgColor = '#6366f1';
                          textColor = '#ffffff';
                        }

                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSelectSeat(seatInfo)}
                            title={`${seatId} (${seatInfo.status})`}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 6,
                              background: bgColor,
                              border: `1px solid ${borderColor}`,
                              color: textColor,
                              fontSize: 10,
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {seatInfo.status === 'blocked' ? (
                              <Wrench size={12} />
                            ) : seatInfo.status === 'booked' ? (
                              <Armchair size={12} />
                            ) : (
                              seat.number
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, width: 60 }}>
                      {row.category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Seat Details Inspector Sidebar */}
        {inspectSeat && (
          <div
            style={{
              background: 'rgba(14, 19, 32, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                Seat Inspector
              </h3>
              <button
                onClick={() => setInspectSeat(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#ffffff' }}>
                {inspectSeat.seatId}
              </div>
              <div style={{ marginTop: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    background:
                      inspectSeat.status === 'available'
                        ? 'rgba(34, 197, 94, 0.15)'
                        : inspectSeat.status === 'booked'
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(249, 115, 22, 0.15)',
                    color:
                      inspectSeat.status === 'available'
                        ? '#4ade80'
                        : inspectSeat.status === 'booked'
                        ? '#f87171'
                        : '#fb923c',
                  }}
                >
                  {inspectSeat.status}
                </span>
              </div>

              <div style={{ marginTop: 14, fontSize: 13, color: '#cbd5e1' }}>
                Ticket Price: <strong>₹{inspectSeat.price || 200}</strong>
              </div>

              {inspectSeat.customerName && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
                  Patron: <strong style={{ color: '#fff' }}>{inspectSeat.customerName}</strong>
                </div>
              )}

              {inspectSeat.blockReason && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#fb923c' }}>
                  Block Reason: {inspectSeat.blockReason}
                </div>
              )}
            </div>

            {inspectSeat.status === 'blocked' ? (
              <button
                onClick={async () => {
                  await unblockSeats(selectedShowId, [inspectSeat.seatId]);
                  fetchInventory();
                }}
                style={{
                  padding: '10px',
                  borderRadius: 8,
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Unblock This Seat
              </button>
            ) : inspectSeat.status === 'available' ? (
              <button
                onClick={() => {
                  setSelectedSeats([inspectSeat.seatId]);
                  setIsBlockModalOpen(true);
                }}
                style={{
                  padding: '10px',
                  borderRadius: 8,
                  background: '#f97316',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Block for Maintenance
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Block Seats Reason Modal */}
      {isBlockModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            style={{
              background: '#0e1320',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 16,
              width: '100%',
              maxWidth: 420,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                Block Seats for Maintenance / VIP
              </h3>
              <button
                onClick={() => setIsBlockModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14 }}>
              Selected Seats: <strong style={{ color: '#fff' }}>{selectedSeats.join(', ')}</strong>
            </p>

            <form onSubmit={handleBlockSeats} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Maintenance Reason / Hold Note *
                </label>
                <input
                  required
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g. Broken Armrest - Awaiting Spare"
                  style={{
                    width: '100%',
                    background: '#131929',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#e2e8f0',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    background: '#f97316',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'Blocking...' : 'Confirm Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
