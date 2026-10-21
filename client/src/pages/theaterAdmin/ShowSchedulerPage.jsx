import React, { useState, useEffect } from 'react';
import {
  getShows,
  createShow,
  deleteShow,
  updateCategoryPricing,
  getScreens,
} from '../../services/theaterAdmin.api.js';
import { getAdminMovies } from '../../services/admin.api.js';
import {
  CalendarDays,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Trash2,
  Edit,
  Tag,
  Film,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function ShowSchedulerPage() {
  const [shows, setShows] = useState([]);
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('');

  // Schedule Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    movieId: '',
    screenName: '',
    showDate: new Date().toISOString().split('T')[0],
    startTime: `${new Date().toISOString().split('T')[0]}T14:30`,
    regularPrice: 200,
    premiumPrice: 320,
    reclinerPrice: 450,
  });

  // Dynamic Pricing Modal
  const [pricingModalShow, setPricingModalShow] = useState(null);
  const [updatedPrices, setUpdatedPrices] = useState({
    REGULAR: 200,
    PREMIUM: 320,
    RECLINER: 450,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, scrRes, mRes] = await Promise.all([
        getShows({ date: selectedDate, screenName: selectedScreen }),
        getScreens(),
        getAdminMovies({ limit: 50 }),
      ]);

      if (sRes.data?.success) setShows(sRes.data.data);
      if (scrRes.data?.success) {
        setScreens(scrRes.data.data);
        if (scrRes.data.data.length > 0 && !formData.screenName) {
          setFormData((p) => ({ ...p, screenName: scrRes.data.data[0].name }));
        }
      }
      if (mRes.data?.success) {
        setMovies(mRes.data.data.filter((m) => m.isActive));
        if (mRes.data.data.length > 0 && !formData.movieId) {
          setFormData((p) => ({ ...p, movieId: mRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedScreen]);

  const handleCreateShow = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        movieId: formData.movieId,
        screenName: formData.screenName,
        showDate: new Date(formData.showDate).toISOString(),
        startTime: new Date(formData.startTime).toISOString(),
        categoryPricing: [
          { category: 'REGULAR', price: Number(formData.regularPrice) },
          { category: 'PREMIUM', price: Number(formData.premiumPrice) },
          { category: 'RECLINER', price: Number(formData.reclinerPrice) },
        ],
      };

      const res = await createShow(payload);
      setSuccessMessage(
        `Show scheduled! Automatically initialized ${res.data?.data?.totalSeatsGenerated || 'all'} seat tickets.`
      );
      setTimeout(() => {
        setIsModalOpen(false);
        fetchData();
      }, 1200);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Show schedule collision or validation error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePricing = async (e) => {
    e.preventDefault();
    if (!pricingModalShow) return;
    setIsSubmitting(true);
    try {
      const categoryPricing = [
        { category: 'REGULAR', price: Number(updatedPrices.REGULAR) },
        { category: 'PREMIUM', price: Number(updatedPrices.PREMIUM) },
        { category: 'RECLINER', price: Number(updatedPrices.RECLINER) },
      ];
      await updateCategoryPricing(pricingModalShow._id, categoryPricing);
      setPricingModalShow(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update pricing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteShow = async (showId, movieTitle) => {
    if (window.confirm(`Cancel screening of "${movieTitle}"?`)) {
      try {
        await deleteShow(showId);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel show');
      }
    }
  };

  // Duration calculation for visual collision indicator
  const selectedMovieObj = movies.find((m) => m._id === formData.movieId);
  const durMinutes = selectedMovieObj?.duration || 120;
  const startObj = formData.startTime ? new Date(formData.startTime) : new Date();
  const endObj = new Date(startObj.getTime() + (durMinutes + 20) * 60 * 1000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
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
            Showtime Scheduling &amp; Conflict Prevention Engine
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Link movies to auditoriums, verify slot collision windows (including 20 min interval cleaning), and set dynamic tier pricing.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMessage('');
            setSuccessMessage('');
            setIsModalOpen(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
          }}
        >
          <Plus size={16} /> Schedule New Showtime
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            background: '#131929',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8,
            padding: '8px 14px',
            color: '#ffffff',
            fontSize: 13,
            outline: 'none',
          }}
        />

        <select
          value={selectedScreen}
          onChange={(e) => setSelectedScreen(e.target.value)}
          style={{
            background: '#131929',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8,
            padding: '8px 14px',
            color: '#ffffff',
            fontSize: 13,
            outline: 'none',
          }}
        >
          <option value="">All Screens</option>
          {screens.map((scr) => (
            <option key={scr._id} value={scr.name}>
              {scr.name}
            </option>
          ))}
        </select>

        {(selectedDate || selectedScreen) && (
          <button
            onClick={() => {
              setSelectedDate('');
              setSelectedScreen('');
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Shows List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          Loading scheduled shows...
        </div>
      ) : shows.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(14, 19, 32, 0.5)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
          }}
        >
          <CalendarDays size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>No Shows Scheduled</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Click "Schedule New Showtime" to add a movie screening.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
          {shows.map((show) => (
            <div
              key={show._id}
              style={{
                background: 'rgba(14, 19, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <img
                  src={show.movie?.poster || 'https://via.placeholder.com/50x70'}
                  alt={show.movie?.title}
                  style={{ width: 50, height: 70, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {show.movie?.title}
                  </h3>
                  <div style={{ fontSize: 13, color: '#34d399', fontWeight: 600, marginTop: 2 }}>
                    {show.screenName}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Clock size={13} />
                    <span>
                      {show.startTime ? new Date(show.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Pricing Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(show.categoryPricing || []).map((cp, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#e2e8f0',
                    }}
                  >
                    {cp.category}: <strong style={{ color: '#34d399' }}>₹{cp.price}</strong>
                  </span>
                ))}
              </div>

              {/* Bookings & Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  Booked: <strong style={{ color: '#fff' }}>{show.bookedSeatsCount || 0}</strong> / {show.totalSeats || 0} seats
                </span>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      setPricingModalShow(show);
                      const initialP = { REGULAR: 200, PREMIUM: 320, RECLINER: 450 };
                      (show.categoryPricing || []).forEach((c) => {
                        initialP[c.category] = c.price;
                      });
                      setUpdatedPrices(initialP);
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#818cf8',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Tag size={12} /> Pricing
                  </button>

                  <button
                    onClick={() => handleDeleteShow(show._id, show.movie?.title)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#f87171',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Trash2 size={12} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Showtime Modal */}
      {isModalOpen && (
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
              maxWidth: 560,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 28,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                Schedule Movie Screening
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: 13, marginBottom: 16 }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', fontSize: 13, marginBottom: 16 }}>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleCreateShow} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Select Master Movie *
                </label>
                <select
                  required
                  value={formData.movieId}
                  onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#131929',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.duration} mins) [{m.censorRating}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Select Auditorium Screen *
                </label>
                <select
                  required
                  value={formData.screenName}
                  onChange={(e) => setFormData({ ...formData, screenName: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#131929',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {screens.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name} ({s.totalSeats} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Show Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.showDate}
                    onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
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

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Show Start Time *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
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
              </div>

              {/* Collision Window Indicator Callout */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 12,
                  color: '#93c5fd',
                }}
              >
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Clock size={14} /> Collision Detection Window:
                </div>
                <span>
                  This screening will occupy {formData.screenName} from{' '}
                  <strong>{startObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> until{' '}
                  <strong>{endObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> (including 20 min interval cleaning).
                </span>
              </div>

              {/* Tier Pricing Inputs */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Category Ticket Pricing (₹)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>REGULAR</span>
                    <input
                      required
                      type="number"
                      value={formData.regularPrice}
                      onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 6,
                        padding: '8px 10px',
                        color: '#ffffff',
                        fontSize: 13,
                        outline: 'none',
                        marginTop: 4,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: '#a855f7', fontWeight: 700 }}>PREMIUM</span>
                    <input
                      required
                      type="number"
                      value={formData.premiumPrice}
                      onChange={(e) => setFormData({ ...formData, premiumPrice: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 6,
                        padding: '8px 10px',
                        color: '#ffffff',
                        fontSize: 13,
                        outline: 'none',
                        marginTop: 4,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: '#ec4899', fontWeight: 700 }}>RECLINER</span>
                    <input
                      required
                      type="number"
                      value={formData.reclinerPrice}
                      onChange={(e) => setFormData({ ...formData, reclinerPrice: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 6,
                        padding: '8px 10px',
                        color: '#ffffff',
                        fontSize: 13,
                        outline: 'none',
                        marginTop: 4,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 18px',
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
                    padding: '10px 22px',
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'Scheduling...' : 'Instantiate Showtime'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Pricing Editor Modal */}
      {pricingModalShow && (
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
                Update Category Pricing
              </h3>
              <button
                onClick={() => setPricingModalShow(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
              Adjust pricing for <strong>{pricingModalShow.movie?.title}</strong> ({pricingModalShow.screenName}):
            </p>

            <form onSubmit={handleUpdatePricing} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>REGULAR (₹)</label>
                <input
                  type="number"
                  value={updatedPrices.REGULAR}
                  onChange={(e) => setUpdatedPrices({ ...updatedPrices, REGULAR: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#131929',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    marginTop: 4,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#a855f7' }}>PREMIUM (₹)</label>
                <input
                  type="number"
                  value={updatedPrices.PREMIUM}
                  onChange={(e) => setUpdatedPrices({ ...updatedPrices, PREMIUM: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#131929',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    marginTop: 4,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#ec4899' }}>RECLINER (₹)</label>
                <input
                  type="number"
                  value={updatedPrices.RECLINER}
                  onChange={(e) => setUpdatedPrices({ ...updatedPrices, RECLINER: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#131929',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    marginTop: 4,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setPricingModalShow(null)}
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
                    background: '#6366f1',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
