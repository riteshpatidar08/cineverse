import React, { useState, useEffect } from 'react';
import {
  verifyTicket,
  admitTicket,
  bookBoxOffice,
  getShows,
  getShowInventory,
} from '../../services/theaterAdmin.api.js';
import {
  QrCode,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Ticket,
  CreditCard,
  Banknote,
  Search,
  Scan,
  User,
  Film,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function TicketScannerPage() {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'boxoffice'

  // Scanner State
  const [scannedCode, setScannedCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [scannerError, setScannerError] = useState('');
  const [admitSuccess, setAdmitSuccess] = useState(false);

  // Box Office POS State
  const [shows, setShows] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState('');
  const [showInventory, setShowInventory] = useState(null);
  const [posSelectedSeats, setPosSelectedSeats] = useState([]);
  const [posCustomerName, setPosCustomerName] = useState('Walk-in Guest');
  const [posCustomerMobile, setPosCustomerMobile] = useState('');
  const [posPaymentMethod, setPosPaymentMethod] = useState('CASH');
  const [posReceipt, setPosReceipt] = useState(null);
  const [posSubmitting, setPosSubmitting] = useState(false);
  const [posError, setPosError] = useState('');

  // Fetch shows for Box Office
  useEffect(() => {
    getShows().then((res) => {
      if (res.data?.success && res.data.data.length > 0) {
        setShows(res.data.data);
        if (!selectedShowId) {
          setSelectedShowId(res.data.data[0]._id);
        }
      }
    });
  }, []);

  // Fetch seat inventory when show changes in POS
  useEffect(() => {
    if (selectedShowId) {
      getShowInventory(selectedShowId).then((res) => {
        if (res.data?.success) {
          setShowInventory(res.data.data);
          setPosSelectedSeats([]);
          setPosReceipt(null);
        }
      });
    }
  }, [selectedShowId]);

  // ====================== SCANNER HANDLERS ======================
  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!scannedCode.trim()) return;
    setIsVerifying(true);
    setScannerError('');
    setVerificationResult(null);
    setAdmitSuccess(false);

    try {
      const res = await verifyTicket(scannedCode.trim());
      if (res.data?.success) {
        setVerificationResult(res.data.data);
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.alreadyCheckedIn) {
        setVerificationResult({ ...data.data, alreadyCheckedIn: true, checkedInAt: data.checkedInAt });
      } else {
        setScannerError(data?.message || 'Invalid or unrecognized ticket code');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAdmit = async () => {
    if (!verificationResult?.bookingId) return;
    try {
      await admitTicket(verificationResult.bookingId);
      setAdmitSuccess(true);
      setVerificationResult((prev) => ({ ...prev, isCheckedIn: true }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to admit patron');
    }
  };

  // ====================== BOX OFFICE HANDLERS ======================
  const togglePosSeat = (seat) => {
    if (seat.status !== 'available') return;
    if (posSelectedSeats.find((s) => s.seatId === seat.seatId)) {
      setPosSelectedSeats(posSelectedSeats.filter((s) => s.seatId !== seat.seatId));
    } else {
      setPosSelectedSeats([...posSelectedSeats, seat]);
    }
  };

  const handleBookPos = async (e) => {
    e.preventDefault();
    if (posSelectedSeats.length === 0) {
      setPosError('Please select at least one seat to issue');
      return;
    }
    setPosSubmitting(true);
    setPosError('');

    try {
      const res = await bookBoxOffice({
        showId: selectedShowId,
        seats: posSelectedSeats.map((s) => ({
          seatId: s.seatId,
          price: s.price || 200,
        })),
        customerName: posCustomerName,
        customerMobile: posCustomerMobile,
        paymentMethod: posPaymentMethod,
      });

      if (res.data?.success) {
        setPosReceipt(res.data.receipt);
        // Refresh inventory
        const invRes = await getShowInventory(selectedShowId);
        if (invRes.data?.success) setShowInventory(invRes.data.data);
        setPosSelectedSeats([]);
      }
    } catch (err) {
      setPosError(err.response?.data?.message || 'Failed to complete POS booking');
    } finally {
      setPosSubmitting(false);
    }
  };

  const posTotalAmount = posSelectedSeats.reduce(
    (sum, s) => sum + (Number(s.price) || 200),
    0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
            Gate Check-in Scanner &amp; Box Office Counter
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Instant QR ticket validation for ushers and walk-in counter ticket POS for box office staff.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => setActiveTab('scanner')}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'scanner' ? '#10b981' : 'transparent',
              color: activeTab === 'scanner' ? '#fff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Scan size={15} /> Gate QR Scanner
          </button>

          <button
            onClick={() => setActiveTab('boxoffice')}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'boxoffice' ? '#6366f1' : 'transparent',
              color: activeTab === 'boxoffice' ? '#fff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Ticket size={15} /> Walk-in Box Office POS
          </button>
        </div>
      </div>

      {activeTab === 'scanner' ? (
        /* ======================== TAB 1: GATE QR SCANNER ======================== */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
          {/* Scanner Input Card */}
          <div
            style={{
              background: 'rgba(14, 19, 32, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCode size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                  Scan or Enter Ticket Code
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>
                  Supports 2D QR camera scans or manual Booking reference
                </p>
              </div>
            </div>

            {/* Quick Demo Scan Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Quick Test:</span>
              <button
                type="button"
                onClick={() => setScannedCode('order_Rz992Test')}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.04)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                }}
              >
                order_Rz992Test
              </button>
            </div>

            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ position: 'relative' }}>
                <input
                  required
                  type="text"
                  placeholder="Enter Booking ID (e.g. order_PZ892hjkL3 or BOX_XYZ)"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    padding: '14px 16px',
                    color: '#ffffff',
                    fontSize: 14,
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                style={{
                  padding: '12px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                }}
              >
                {isVerifying ? 'Verifying Ticket...' : 'Verify Ticket & Check Eligibility'}
              </button>
            </form>

            {scannerError && (
              <div
                style={{
                  padding: '14px',
                  borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 13,
                }}
              >
                <XCircle size={18} /> {scannerError}
              </div>
            )}
          </div>

          {/* Verification Result Card */}
          <div
            style={{
              background: 'rgba(14, 19, 32, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {!verificationResult ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <Scan size={44} color="#64748b" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>Awaiting Ticket Scan</h4>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  Scan a digital pass QR code or input the booking ID to reveal patron entitlement.
                </p>
              </div>
            ) : verificationResult.alreadyCheckedIn ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(234, 179, 8, 0.15)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    color: '#facc15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}
                >
                  <AlertTriangle size={28} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#facc15' }}>
                  ALREADY CHECKED IN!
                </h3>
                <p style={{ fontSize: 13, color: '#cbd5e1' }}>
                  This ticket has already been used for gate entry at{' '}
                  <strong>{new Date(verificationResult.checkedInAt).toLocaleTimeString()}</strong>.
                </p>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  Patron: {verificationResult.customerName} &bull; Booking: {verificationResult.bookingId}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#4ade80', textTransform: 'uppercase' }}>
                      Valid Ticket Verified
                    </span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                      {verificationResult.movieTitle}
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Screen:</span>
                    <strong style={{ color: '#34d399' }}>{verificationResult.screenName}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Showtime:</span>
                    <strong style={{ color: '#ffffff' }}>
                      {verificationResult.showTime ? new Date(verificationResult.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Patron Name:</span>
                    <strong style={{ color: '#ffffff' }}>{verificationResult.customerName}</strong>
                  </div>

                  {/* Allocated Seats Pills */}
                  <div style={{ marginTop: 4, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                      Admitted Seats ({verificationResult.totalSeats}):
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(verificationResult.seats || []).map((s, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: '#10b981',
                            color: '#ffffff',
                          }}
                        >
                          {s.seatId || s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {admitSuccess ? (
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: 10,
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    ✓ Patron Admitted Successfully into Cinema Hall!
                  </div>
                ) : (
                  <button
                    onClick={handleAdmit}
                    style={{
                      padding: '14px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: 15,
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    Admit Patron &amp; Check-in
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ======================== TAB 2: WALK-IN BOX OFFICE POS ======================== */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
          {/* POS Seat Selector */}
          <div
            style={{
              background: 'rgba(14, 19, 32, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                Select Screening Session
              </label>
              <select
                value={selectedShowId}
                onChange={(e) => setSelectedShowId(e.target.value)}
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
              >
                {shows.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.movie?.title} ({s.screenName} - {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Seat Click Grid */}
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Click Available Seats to Add to Walk-in Order:
              </span>

              {showInventory ? (
                <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, padding: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 10 }}>
                  {showInventory.seats?.map((seat) => {
                    const isSelected = posSelectedSeats.some((s) => s.seatId === seat.seatId);
                    const isAvailable = seat.status === 'available';

                    return (
                      <button
                        key={seat.seatId}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => togglePosSeat(seat)}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 6,
                          background: isSelected
                            ? '#6366f1'
                            : isAvailable
                            ? 'rgba(34, 197, 94, 0.15)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: isSelected
                            ? '2px solid #ffffff'
                            : isAvailable
                            ? '1px solid rgba(34, 197, 94, 0.3)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          color: isSelected ? '#fff' : isAvailable ? '#4ade80' : '#64748b',
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span>{seat.seatId}</span>
                        <span style={{ fontSize: 8, opacity: 0.8 }}>₹{seat.price || 200}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ color: '#64748b', fontSize: 13, padding: 20 }}>Loading seats...</div>
              )}
            </div>
          </div>

          {/* POS Checkout & Receipt Card */}
          <div
            style={{
              background: 'rgba(14, 19, 32, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {posReceipt ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ textAlign: 'center', padding: '16px 0', borderBottom: '1px dashed rgba(255,255,255,0.15)' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                    Walk-in Ticket Issued
                  </span>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 4 }}>
                    {posReceipt.movieTitle}
                  </h3>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    {posReceipt.screenName} &bull; Booking: {posReceipt.bookingId}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Guest:</span>
                    <strong style={{ color: '#fff' }}>{posReceipt.customerName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Seats:</span>
                    <strong style={{ color: '#34d399' }}>{posReceipt.seats.join(', ')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Payment Method:</span>
                    <strong style={{ color: '#a855f7' }}>{posReceipt.paymentMethod}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, marginTop: 4, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#fff' }}>Paid Total:</span>
                    <span style={{ color: '#34d399' }}>₹{posReceipt.totalAmount}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '10px',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Printer size={15} /> Print Slip
                  </button>

                  <button
                    onClick={() => setPosReceipt(null)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 8,
                      background: '#10b981',
                      border: 'none',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Next Customer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookPos} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                  Walk-in Order Details
                </h3>

                {posError && (
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: 12 }}>
                    {posError}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
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

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Mobile Number (SMS e-ticket)
                  </label>
                  <input
                    type="text"
                    placeholder="9829012345"
                    value={posCustomerMobile}
                    onChange={(e) => setPosCustomerMobile(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
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

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Payment Tender Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {['CASH', 'POS_CARD', 'UPI_OFFLINE'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPosPaymentMethod(m)}
                        style={{
                          padding: '10px 6px',
                          borderRadius: 8,
                          border: posPaymentMethod === m ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                          background: posPaymentMethod === m ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)',
                          color: posPaymentMethod === m ? '#fff' : '#94a3b8',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Seats summary */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8' }}>
                    <span>Selected Seats:</span>
                    <strong style={{ color: '#fff' }}>
                      {posSelectedSeats.map((s) => s.seatId).join(', ') || 'None selected'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8' }}>
                    <span>Convenience Fee:</span>
                    <strong style={{ color: '#34d399' }}>₹0 (Walk-in Counter)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: '#ffffff', paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Total Tender:</span>
                    <span style={{ color: '#34d399' }}>₹{posTotalAmount}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={posSubmitting || posSelectedSeats.length === 0}
                  style={{
                    padding: '12px',
                    borderRadius: 10,
                    background: posSelectedSeats.length > 0 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: posSelectedSeats.length > 0 ? 'pointer' : 'not-allowed',
                    boxShadow: posSelectedSeats.length > 0 ? '0 4px 14px rgba(99, 102, 241, 0.4)' : 'none',
                  }}
                >
                  {posSubmitting ? 'Issuing Ticket...' : `Collect ₹${posTotalAmount} & Issue Ticket`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
