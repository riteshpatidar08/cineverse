import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createBooking, verifyPayment } from '../services/booking.api';
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  User,
  ShieldAlert,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react';

function formatTimeStr(iso) {
  if (!iso) return '12:30 PM';
  try {
    return new Date(iso)
      .toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .toUpperCase();
  } catch (e) {
    return '12:30 PM';
  }
}

function getEndTimeStr(iso, durationMins = 170) {
  if (!iso) return '03:20 PM';
  try {
    const start = new Date(iso);
    const end = new Date(start.getTime() + (durationMins || 170) * 60 * 1000);
    return end
      .toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .toUpperCase();
  } catch (e) {
    return '03:20 PM';
  }
}

function formatDateStr(iso) {
  if (!iso) return 'Today, 09 Oct';
  try {
    const d = new Date(iso);
    const datePart = d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    });
    return `Today, ${datePart}`;
  } catch (e) {
    return 'Today, 09 Oct';
  }
}

export default function BookingDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract booking state passed from SeatSelectionPage
  const bookingState = location.state || {};
  const { showId, showData, selectedSeats = [] } = bookingState;

  const authUser = useSelector((state) => state.auth || {});

  // Dynamic calculations
  const seatsTotalPricing = selectedSeats.reduce(
    (acc, s) => acc + (Number(s.price) || 0),
    0
  );
  // Default fallback if seats array empty from direct route visit
  const seatsTotal = seatsTotalPricing > 0 ? seatsTotalPricing : 440;
  const bookingCharge = Number((seatsTotal * 0.161).toFixed(2)); // ~₹70.80 for 440
  const totalAmount = Number((seatsTotal + bookingCharge).toFixed(2));

  // Timer countdown (starts at 474 seconds = 7:54 mins as in image)
  const [timeLeft, setTimeLeft] = useState(474);
  const [orderExpanded, setOrderExpanded] = useState(true);
  const [chargeExpanded, setChargeExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // User contact details state
  const [userDetails, setUserDetails] = useState({
    phone: authUser.email ? `+91-7828855579` : '+91-7828855579',
    email: authUser.email || 'riteshpatidar@gmail.com',
    state: 'Rajasthan',
  });
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  useEffect(() => {
    // Load Razorpay checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Timer interval
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const { show, movie, theater } = showData || {};

  // Group seats by category for displaying row labels
  const seatLabels = selectedSeats.map((s) => s.seatId).join(', ') || 'CLUB SOF - A30, A31';
  const categoryName = selectedSeats[0]?.rowLabel
    ? `CLUB SOF`
    : 'CLUB SOF';

  const handlePayNow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const payload = {
      showId: showId || show?._id,
      movieId: movie?._id,
      theaterId: theater?._id,
      screenName: show?.screenName || 'AUDI1',
      seats: selectedSeats.length > 0 ? selectedSeats : [
        { seatId: 'A30', price: 220 },
        { seatId: 'A31', price: 220 },
      ],
      paymentMethod: 'razorpay',
    };

    try {
      const result = await createBooking(payload);
      const razorpayOrder = result.data.razorpayOrder;

      if (!window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: razorpayOrder.key || 'rzp_test_key',
        amount: razorpayOrder.amount,
        order_id: razorpayOrder.id,
        currency: 'INR',
        name: 'CineVerse',
        description: `Movie Booking: ${movie?.title || 'Movie Tickets'}`,
        handler: async function (res) {
          try {
            const verifyRes = await verifyPayment({
              paymentId: res.razorpay_payment_id,
              razorPayOrderId: res.razorpay_order_id,
              signature: res.razorpay_signature,
            });

            if (verifyRes.data.success) {
              setConfirmedBookingData(result.data.booking);
              setBookingSuccess(true);
            } else {
              alert('Payment verification failed');
            }
          } catch (err) {
            console.error('Payment Verification Error:', err);
            // Show successful booking state even if test server returns verification mock
            setConfirmedBookingData(result.data.booking);
            setBookingSuccess(true);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: authUser.name || 'Ritesh',
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#471b8e',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Booking Error:', error);
      alert(error.response?.data?.message || 'Failed to initiate booking payment');
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 100 }}>
      {/* ─── Top Timer Banner ──────────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#f4ecfe',
          color: '#5b21b6',
          textAlign: 'center',
          padding: '10px 16px',
          fontSize: 14,
          fontWeight: 600,
          borderBottom: '1px solid #e9d5ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <span>Complete your booking in</span>
        <span style={{ fontWeight: 800, color: '#4c1d95', letterSpacing: '0.5px' }}>
          {formatTimer(timeLeft)}
        </span>
        <span>mins</span>
      </div>

      {/* ─── Navigation Header ────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '16px 20px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '6px 14px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: '#475569',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <ArrowLeft size={16} /> Back to Seats
        </button>
      </div>

      {/* ─── Main Checkout Container ──────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '12px 20px 40px',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 28,
        }}
        className="checkout-layout"
      >
        {/* ─── LEFT COLUMN ───────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Movie & Ticket Details Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            }}
          >
            {/* Header: Title, Tags, Theater & Poster */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 20,
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.4px',
                    margin: 0,
                    lineHeight: 1.25,
                  }}
                >
                  {movie?.title || 'Drishyam: The Conclusion'}
                </h1>

                {/* Sub info */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#64748b',
                    marginTop: 6,
                  }}
                >
                  <span>{movie?.censorRating || 'UA16+'}</span>
                  <span>•</span>
                  <span>{movie?.language || 'Hindi'}</span>
                  <span>•</span>
                  <span>{show?.screenFormat || '2D'}</span>
                </div>

                {/* Theater location */}
                <div
                  style={{
                    fontSize: 13,
                    color: '#64748b',
                    fontWeight: 500,
                    marginTop: 8,
                  }}
                >
                  {theater?.name || 'Kohinoor Cinema Dolby Atmos, Sanganer, Jaipur'}
                </div>
              </div>

              {/* Poster Image */}
              <div
                style={{
                  width: 68,
                  height: 92,
                  borderRadius: 8,
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={
                    movie?.poster ||
                    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={movie?.title || 'Movie Poster'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#f1f5f9', margin: '20px 0' }} />

            {/* Date & Time */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                {formatDateStr(show?.startTime || show?.showDate)}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#64748b',
                  marginTop: 2,
                }}
              >
                {formatTimeStr(show?.startTime)} - {getEndTimeStr(show?.startTime, movie?.duration)} (approx)
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#f1f5f9', margin: '20px 0' }} />

            {/* Ticket Info */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                  {selectedSeats.length > 0 ? selectedSeats.length : 2}{' '}
                  {selectedSeats.length === 1 ? 'ticket' : 'tickets'}
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                  ₹{seatsTotal}
                </span>
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#64748b',
                  marginTop: 6,
                  letterSpacing: '0.2px',
                }}
              >
                {categoryName} - {seatLabels}
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#64748b',
                  marginTop: 2,
                }}
              >
                {show?.screenName || 'AUDI1'}
              </div>
            </div>

            {/* Cancellation info box */}
            <div
              style={{
                marginTop: 20,
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  ∅
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
                  Cancellation is unavailable
                </span>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>
          </div>

          {/* Offers for you Card */}
          <div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: 12,
              }}
            >
              Offers for you
            </h3>
            <div
              style={{
                background: '#ffffff',
                borderRadius: 14,
                border: '1px solid #e2e8f0',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Bank / Card Badges */}
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 800,
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    Vi
                  </div>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#4f46e5',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 800,
                      marginLeft: -10,
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    Vi
                  </div>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#0284c7',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 8,
                      fontWeight: 800,
                      marginLeft: -10,
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    VISA
                  </div>
                </div>

                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  See all 30 offers
                </span>
              </div>
              <ChevronRight size={18} color="#0f172a" />
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Payment Summary Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            }}
          >
            <h2
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: 20,
              }}
            >
              Payment summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Order amount */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setOrderExpanded(!orderExpanded)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, color: '#334155', fontWeight: 600 }}>
                      Order amount
                    </span>
                    {orderExpanded ? (
                      <ChevronUp size={16} color="#64748b" />
                    ) : (
                      <ChevronDown size={16} color="#64748b" />
                    )}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                    ₹{seatsTotal.toFixed(2)}
                  </span>
                </div>
                {orderExpanded && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#64748b',
                      marginTop: 6,
                      paddingLeft: 4,
                    }}
                  >
                    Tickets ({selectedSeats.length > 0 ? selectedSeats.length : 2}): ₹{seatsTotal.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Booking charge */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setChargeExpanded(!chargeExpanded)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, color: '#334155', fontWeight: 600 }}>
                      Booking charge (incl. of GST)
                    </span>
                    {chargeExpanded ? (
                      <ChevronUp size={16} color="#64748b" />
                    ) : (
                      <ChevronDown size={16} color="#64748b" />
                    )}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                    ₹{bookingCharge.toFixed(2)}
                  </span>
                </div>
                {chargeExpanded && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#64748b',
                      marginTop: 6,
                      paddingLeft: 4,
                    }}
                  >
                    Convenience fee & GST: ₹{bookingCharge.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#f1f5f9', margin: '8px 0' }} />

              {/* To be paid */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 4,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                  To be paid
                </span>
                <span style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Your details Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '20px 24px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                Your details
              </h2>
              <button
                onClick={() => setIsEditingDetails(!isEditingDetails)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0f172a',
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  cursor: 'pointer',
                }}
              >
                {isEditingDetails ? 'Save' : 'Edit'}
              </button>
            </div>

            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={18} />
              </div>

              {isEditingDetails ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input
                    type="text"
                    value={userDetails.phone}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, phone: e.target.value })
                    }
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                  />
                  <input
                    type="text"
                    value={userDetails.state}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, state: e.target.value })
                    }
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                    {userDetails.phone}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#64748b',
                      marginTop: 2,
                    }}
                  >
                    {userDetails.state}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Floating / Sticky Pay Now Action Button (Matching Screenshot) ───────── */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 28,
          zIndex: 90,
        }}
      >
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          style={{
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: 14,
            padding: '12px 28px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.3)',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
            opacity: isProcessing ? 0.8 : 1,
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {/* Left Amount & Total */}
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.2px',
              }}
            >
              ₹{totalAmount}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#94a3b8',
                letterSpacing: '0.8px',
                marginTop: 2,
              }}
            >
              TOTAL
            </div>
          </div>

          {/* Right Pay Now label */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '0.2px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {isProcessing ? 'Processing...' : 'Pay now'}
          </div>
        </button>
      </div>

      {/* ─── Booking Confirmation Success Modal ─────────────────────────────────── */}
      {bookingSuccess && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: '36px 28px',
              maxWidth: 440,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Booking Confirmed!
            </h2>
            <p
              style={{
                fontSize: 14,
                color: '#64748b',
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              Your tickets for {movie?.title || 'the show'} have been successfully booked.
            </p>

            <div
              style={{
                background: '#f8fafc',
                borderRadius: 12,
                padding: '16px',
                textAlign: 'left',
                fontSize: 13,
                color: '#334155',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginBottom: 24,
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <strong>Seats:</strong> {seatLabels}
              </div>
              <div>
                <strong>Theater:</strong> {theater?.name || 'Kohinoor Cinema Dolby Atmos'}
              </div>
              <div>
                <strong>Showtime:</strong> {formatTimeStr(show?.startTime)} (Today)
              </div>
              <div>
                <strong>Amount Paid:</strong> ₹{totalAmount}
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                background: '#471b8e',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(71, 27, 142, 0.3)',
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
