import React, { useState, useEffect } from 'react';
import {
  getTheaterBookings,
  getOccupancyReport,
  getPayoutReport,
} from '../../services/theaterAdmin.api.js';
import {
  BarChart3,
  TrendingUp,
  CircleDollarSign,
  Ticket,
  Clock,
  Layers,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export default function TheaterReportsPage() {
  const [activeTab, setActiveTab] = useState('occupancy'); // 'occupancy' | 'bookings' | 'payouts'

  // Occupancy State
  const [occupancy, setOccupancy] = useState(null);

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [search, setSearch] = useState('');

  // Payout State
  const [payoutData, setPayoutData] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [occRes, bookRes, payRes] = await Promise.all([
        getOccupancyReport(),
        getTheaterBookings({ search }),
        getPayoutReport(),
      ]);

      if (occRes.data?.success) setOccupancy(occRes.data.data);
      if (bookRes.data?.success) {
        setBookings(bookRes.data.data);
        setTotalBookings(bookRes.data.total);
      }
      if (payRes.data?.success) setPayoutData(payRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [search]);

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
            Occupancy, Bookings &amp; Settlement Statement
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Auditorium utilization metrics, ticket sales log, and partner payout disbursements.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => setActiveTab('occupancy')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'occupancy' ? '#10b981' : 'transparent',
              color: activeTab === 'occupancy' ? '#fff' : '#94a3b8',
            }}
          >
            Occupancy Analytics
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'bookings' ? '#6366f1' : 'transparent',
              color: activeTab === 'bookings' ? '#fff' : '#94a3b8',
            }}
          >
            Bookings Ledger
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'payouts' ? '#a855f7' : 'transparent',
              color: activeTab === 'payouts' ? '#fff' : '#94a3b8',
            }}
          >
            Partner Payout Statement
          </button>
        </div>
      </div>

      {activeTab === 'occupancy' ? (
        /* ======================== TAB 1: OCCUPANCY ======================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(14, 19, 32, 0.8)', padding: 22, borderRadius: 14, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6ee7b7' }}>
                Overall Occupancy
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#ffffff', margin: '10px 0 4px' }}>
                {occupancy?.overallOccupancy || 0}%
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Across all auditorium screenings</div>
            </div>

            <div style={{ background: 'rgba(14, 19, 32, 0.8)', padding: 22, borderRadius: 14, border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc' }}>
                Peak Operational Slot
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: '10px 0 4px' }}>
                {occupancy?.peakHourSlot || '18:00 - 21:00'}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Highest ticket throughput period</div>
            </div>
          </div>

          {/* Screen breakdown cards */}
          <div style={{ background: 'rgba(14, 19, 32, 0.8)', borderRadius: 16, padding: 24, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 16 }}>
              Auditorium Utilization Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(occupancy?.screensBreakdown || []).map((scr, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: 16,
                    borderRadius: 10,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 15 }}>{scr.screenName}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>
                      {scr.averageOccupancy}% Avg Occupancy
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${scr.averageOccupancy}%`,
                        height: '100%',
                        background: '#10b981',
                        borderRadius: 3,
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
                    <span>Total Screenings: {scr.totalShows}</span>
                    <span>&bull;</span>
                    <span>Configured Capacity: {scr.totalSeatsConfigured} seats</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'bookings' ? (
        /* ======================== TAB 2: BOOKINGS ======================== */
        <div style={{ background: 'rgba(14, 19, 32, 0.8)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, fontSize: 11 }}>Booking ID</th>
                  <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, fontSize: 11 }}>Movie Title</th>
                  <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, fontSize: 11 }}>Screen</th>
                  <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, fontSize: 11 }}>Seats</th>
                  <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, fontSize: 11 }}>Patron</th>
                  <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, fontSize: 11 }}>Seats Total</th>
                  <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, fontSize: 11 }}>Gate Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                      No booking records found for this theater.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                        {b.bookingId}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#fff', fontWeight: 600 }}>
                        {b.movie?.title || 'Pushpa 2'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                        {b.screenName || 'Screen 1'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#34d399', fontWeight: 700 }}>
                        {(b.seats || []).map((s) => s.seatId).join(', ')}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                        {b.user?.name || 'Walk-in Guest'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#fff', fontWeight: 700 }}>
                        {formatINR(b.pricing?.seatsTotal)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: b.isCheckedIn ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                            color: b.isCheckedIn ? '#4ade80' : '#facc15',
                          }}
                        >
                          {b.isCheckedIn ? 'Admitted' : 'Pending Entry'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ======================== TAB 3: PAYOUT STATEMENT ======================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(14, 19, 32, 0.8)', padding: 22, borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                Gross Ticket Collection
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', margin: '10px 0 4px' }}>
                {formatINR(payoutData?.grossTicketCollection)}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Period: {payoutData?.currentPeriod}</div>
            </div>

            <div style={{ background: 'rgba(14, 19, 32, 0.8)', padding: 22, borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#f472b6' }}>
                CineVerse Platform Fee (16%)
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f472b6', margin: '10px 0 4px' }}>
                -{formatINR(payoutData?.platformFeeWithheld)}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Withheld for hosting, tech &amp; gateway</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(14, 19, 32, 0.9) 100%)', padding: 22, borderRadius: 14, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6ee7b7' }}>
                Net Partner Payout (84%)
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#34d399', margin: '10px 0 4px' }}>
                {formatINR(payoutData?.netPartnerDisbursement)}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Disbursed bi-weekly via bank NEFT</div>
            </div>
          </div>

          {/* Past Disbursements Table */}
          <div style={{ background: 'rgba(14, 19, 32, 0.8)', borderRadius: 16, padding: 24, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 16 }}>
              Disbursements &amp; Remittance History
            </h3>

            {payoutData?.disbursementsHistory && payoutData.disbursementsHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {payoutData.disbursementsHistory.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 14,
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 8,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{d.cycle}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Ref: {d.paymentReference || 'Direct NEFT'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#34d399', fontSize: 15 }}>
                        {formatINR(d.netPayableToTheater)}
                      </div>
                      <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700, textTransform: 'uppercase' }}>
                        Settled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: 13 }}>
                No prior cycle disbursements recorded yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
