import React, { useState, useEffect } from 'react';
import {
  getScreens,
  createScreen,
  deleteScreen,
} from '../../services/theaterAdmin.api.js';
import {
  Grid,
  Plus,
  Trash2,
  X,
  Layers,
  Armchair,
  CheckCircle,
  AlertCircle,
  Eye,
  Sliders,
} from 'lucide-react';

export default function ScreenManagerPage() {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Screen Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [screenName, setScreenName] = useState('Screen 2 - Dolby 7.1');
  const [rowsConfig, setRowsConfig] = useState([
    { label: 'A', category: 'RECLINER', seatsCount: 8, spaceAfter: 4 },
    { label: 'B', category: 'PREMIUM', seatsCount: 12, spaceAfter: 6 },
    { label: 'C', category: 'REGULAR', seatsCount: 14, spaceAfter: 7 },
    { label: 'D', category: 'REGULAR', seatsCount: 14, spaceAfter: 7 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchScreens = async () => {
    try {
      setLoading(true);
      const res = await getScreens();
      if (res.data?.success) setScreens(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  const handleAddRow = () => {
    const nextLabel = String.fromCharCode(65 + rowsConfig.length);
    setRowsConfig([
      ...rowsConfig,
      { label: nextLabel, category: 'REGULAR', seatsCount: 14, spaceAfter: 7 },
    ]);
  };

  const handleRemoveRow = (index) => {
    if (rowsConfig.length <= 1) return;
    setRowsConfig(rowsConfig.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index, field, value) => {
    const updated = [...rowsConfig];
    updated[index][field] = value;
    setRowsConfig(updated);
  };

  const handleCreateScreen = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Map to server schema with generated seats array
      const mappedRows = rowsConfig.map((r) => {
        const count = Number(r.seatsCount) || 12;
        const seats = Array.from({ length: count }, (_, i) => ({ number: i + 1 }));

        // Generate layout string e.g. LLLLL_RRRRR
        const leftCount = r.spaceAfter || Math.floor(count / 2);
        const rightCount = count - leftCount;
        const layout = `${'L'.repeat(leftCount)}_${'R'.repeat(rightCount)}`;

        return {
          label: r.label,
          category: r.category,
          layout,
          start: 1,
          spaceAfter: leftCount,
          seats,
        };
      });

      await createScreen({
        name: screenName.trim(),
        rows: mappedRows,
      });

      setSuccessMessage('Screen configuration saved successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        fetchScreens();
      }, 1000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to create screen configuration'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteScreen = async (screenId, name) => {
    if (window.confirm(`Decommission auditorium "${name}"?`)) {
      try {
        await deleteScreen(screenId);
        fetchScreens();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete screen');
      }
    }
  };

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
            Auditorium Screen Matrix Builder
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Design seating tiers, configure rows (Recliner, Premium, Regular), and space aisles.
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
          <Plus size={16} /> Build New Screen
        </button>
      </div>

      {/* Screen Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          Loading auditorium layouts...
        </div>
      ) : screens.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(14, 19, 32, 0.5)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
          }}
        >
          <Grid size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>No Screens Configured</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Click "Build New Screen" to design your theater's first auditorium.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {screens.map((screen) => (
            <div
              key={screen._id}
              style={{
                background: 'rgba(14, 19, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                    {screen.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 12, color: '#94a3b8' }}>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>
                      {screen.totalSeats} Total Seats
                    </span>
                    <span>&bull;</span>
                    <span>{screen.rowsCount || (screen.rows ? screen.rows.length : 0)} Seating Rows</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteScreen(screen._id, screen.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    borderRadius: 8,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={13} /> Decommission
                </button>
              </div>

              {/* Seating Row Visualizer */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                {/* Cinema Screen Bar */}
                <div
                  style={{
                    width: '70%',
                    height: 4,
                    background: 'linear-gradient(90deg, transparent, #34d399, transparent)',
                    borderRadius: 2,
                    marginBottom: 16,
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#64748b',
                      letterSpacing: '1px',
                    }}
                  >
                    Cinema Screen This Way
                  </span>
                </div>

                {/* Rows Display */}
                {(screen.rows || []).map((row, idx) => {
                  const catColor =
                    row.category === 'RECLINER'
                      ? '#ec4899'
                      : row.category === 'PREMIUM'
                      ? '#a855f7'
                      : '#38bdf8';

                  const seats = row.seats || [];
                  const spaceIndex = row.spaceAfter || Math.floor(seats.length / 2);

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Row Label Pill */}
                      <span
                        style={{
                          width: 24,
                          fontSize: 11,
                          fontWeight: 800,
                          color: '#ffffff',
                          textAlign: 'right',
                        }}
                      >
                        {row.label}
                      </span>

                      {/* Left Block */}
                      <div style={{ display: 'flex', gap: 5 }}>
                        {seats.slice(0, spaceIndex).map((s, i) => (
                          <div
                            key={i}
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 4,
                              background: `${catColor}20`,
                              border: `1px solid ${catColor}40`,
                              color: catColor,
                              fontSize: 10,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {s.number}
                          </div>
                        ))}
                      </div>

                      {/* Aisle Space Gap */}
                      <div style={{ width: 18 }} />

                      {/* Right Block */}
                      <div style={{ display: 'flex', gap: 5 }}>
                        {seats.slice(spaceIndex).map((s, i) => (
                          <div
                            key={i}
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 4,
                              background: `${catColor}20`,
                              border: `1px solid ${catColor}40`,
                              color: catColor,
                              fontSize: 10,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {s.number}
                          </div>
                        ))}
                      </div>

                      {/* Category Chip */}
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: `${catColor}15`,
                          color: catColor,
                          border: `1px solid ${catColor}30`,
                          marginLeft: 8,
                        }}
                      >
                        {row.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Build New Screen Modal */}
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
              maxWidth: 680,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 28,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                Interactive Auditorium Screen Builder
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

            <form onSubmit={handleCreateScreen} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Screen / Audi Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Audi 2 - Dolby Atmos Laser"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Rows Builder */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                    Auditorium Row Tier Breakdown
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} /> Add Row Tier
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {rowsConfig.map((row, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '70px 1fr 100px 90px 40px',
                        gap: 10,
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div>
                        <input
                          type="text"
                          value={row.label}
                          onChange={(e) => handleUpdateRow(idx, 'label', e.target.value.toUpperCase())}
                          style={{
                            width: '100%',
                            background: '#131929',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: 6,
                            padding: '6px 8px',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontWeight: 800,
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <select
                          value={row.category}
                          onChange={(e) => handleUpdateRow(idx, 'category', e.target.value)}
                          style={{
                            width: '100%',
                            background: '#131929',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: 6,
                            padding: '6px 8px',
                            color: '#ffffff',
                            fontSize: 12,
                            outline: 'none',
                          }}
                        >
                          <option value="REGULAR">REGULAR</option>
                          <option value="PREMIUM">PREMIUM</option>
                          <option value="RECLINER">RECLINER</option>
                        </select>
                      </div>

                      <div>
                        <input
                          type="number"
                          placeholder="Seats"
                          value={row.seatsCount}
                          onChange={(e) => handleUpdateRow(idx, 'seatsCount', e.target.value)}
                          style={{
                            width: '100%',
                            background: '#131929',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: 6,
                            padding: '6px 8px',
                            color: '#ffffff',
                            fontSize: 12,
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          placeholder="Aisle gap"
                          value={row.spaceAfter}
                          onChange={(e) => handleUpdateRow(idx, 'spaceAfter', e.target.value)}
                          style={{
                            width: '100%',
                            background: '#131929',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: 6,
                            padding: '6px 8px',
                            color: '#ffffff',
                            fontSize: 12,
                            outline: 'none',
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Seats Calculation Notice */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: '#34d399',
                }}
              >
                <span>Calculated Auditorium Capacity:</span>
                <span style={{ fontWeight: 800, fontSize: 16 }}>
                  {rowsConfig.reduce((acc, r) => acc + (Number(r.seatsCount) || 0), 0)} Seats
                </span>
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
                  {isSubmitting ? 'Saving Screen...' : 'Save Auditorium Layout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
