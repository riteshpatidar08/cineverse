import React, { useState, useEffect } from 'react';
import {
  getAdminTheaters,
  createTheater,
  assignTheaterAdmin,
  toggleTheaterStatus,
  deleteTheater,
  getAdminCities,
  getAdminUsers,
} from '../../services/admin.api.js';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  UserCheck,
  CheckCircle,
  XCircle,
  X,
  Phone,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AdminTheatersPage() {
  const [theaters, setTheaters] = useState([]);
  const [cities, setCities] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [search, setSearch] = useState('');

  // Onboard Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: 'Jaipur',
    adminId: '',
    longitude: 75.8055,
    latitude: 26.8532,
    address: '',
    contactPhone: '',
    facilities: ['Dolby Atmos', '4K Projection', 'Parking', 'Food Court', 'Recliner'],
  });

  // Reassign Modal
  const [reassignModal, setReassignModal] = useState(null); // theater object
  const [newAdminId, setNewAdminId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, cRes, uRes] = await Promise.all([
        getAdminTheaters({ city: selectedCity, search }),
        getAdminCities(),
        getAdminUsers({ limit: 100 }),
      ]);

      if (tRes.data?.success) setTheaters(tRes.data.data);
      if (cRes.data?.success) setCities(cRes.data.data);
      if (uRes.data?.success) setManagers(uRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCity, search]);

  const handleCreateTheater = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        name: formData.name,
        city: formData.city,
        adminId: formData.adminId || null,
        location: {
          type: 'Point',
          coordinates: [Number(formData.longitude), Number(formData.latitude)],
        },
        address: formData.address,
        contactPhone: formData.contactPhone,
        facilities: formData.facilities,
      };

      await createTheater(payload);
      setSuccessMessage('Cinema property onboarded successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        fetchData();
      }, 1000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to onboard theater'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReassignManager = async (e) => {
    e.preventDefault();
    if (!newAdminId) return;
    setIsSubmitting(true);
    try {
      await assignTheaterAdmin(reassignModal._id, newAdminId);
      setReassignModal(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reassign manager');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleTheaterStatus(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
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
            Cinema Partner Theaters
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Onboard theater properties, assign managers, and configure amenities.
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
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
          }}
        >
          <Plus size={16} /> Onboard Cinema Property
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(14, 19, 32, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 10,
            padding: '8px 14px',
            gap: 10,
            minWidth: 260,
          }}
        >
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search by theater name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: 13,
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            background: '#131929',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 10,
            padding: '8px 14px',
            color: '#ffffff',
            fontSize: 13,
            outline: 'none',
          }}
        >
          <option value="">All Operational Cities</option>
          {cities.map((c) => (
            <option key={c._id} value={c.cityName}>
              {c.cityName}
            </option>
          ))}
        </select>
      </div>

      {/* Theaters Table / Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          Loading theaters...
        </div>
      ) : theaters.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(14, 19, 32, 0.5)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
          }}
        >
          <Building2 size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>No Theaters Found</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Click "Onboard Cinema Property" to register a theater.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 18,
          }}
        >
          {theaters.map((theater) => (
            <div
              key={theater._id}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>{theater.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12, color: '#94a3b8' }}>
                    <MapPin size={13} color="#60a5fa" />
                    <span>{theater.city}</span>
                    {theater.location?.coordinates && (
                      <span style={{ fontSize: 11, color: '#64748b' }}>
                        [{theater.location.coordinates[0]?.toFixed(2)}, {theater.location.coordinates[1]?.toFixed(2)}]
                      </span>
                    )}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 20,
                    background: theater.isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: theater.isActive ? '#4ade80' : '#f87171',
                    border: theater.isActive ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    textTransform: 'uppercase',
                  }}
                >
                  {theater.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Screens Badge & Contact */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(99, 102, 241, 0.12)',
                    color: '#818cf8',
                    fontSize: 12,
                    fontWeight: 700,
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                  }}
                >
                  <Layers size={13} /> {theater.screensCount || 1} Screen{theater.screensCount !== 1 ? 's' : ''} Configured
                </span>

                {theater.contactPhone && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
                    <Phone size={12} /> {theater.contactPhone}
                  </span>
                )}
              </div>

              {/* Assigned Manager Chip */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                    Assigned Theater Admin
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginTop: 2 }}>
                    {theater.admin ? theater.admin.name : 'No Manager Assigned'}
                  </div>
                  {theater.admin && (
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{theater.admin.email}</div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setReassignModal(theater);
                    setNewAdminId(theater.admin?._id || '');
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#c084fc',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Change
                </button>
              </div>

              {/* Facilities tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(theater.facilities || []).slice(0, 4).map((f, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.04)',
                      color: '#94a3b8',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Footer Toggle */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => handleToggleStatus(theater._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theater.isActive ? '#f87171' : '#34d399',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {theater.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                  {theater.isActive ? 'Deactivate Property' : 'Activate Property'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onboard Cinema Modal */}
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
              maxWidth: 540,
              padding: 28,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                Onboard Cinema Property
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

            <form onSubmit={handleCreateTheater} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Cinema Property Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Cinepolis World Trade Park"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Operational City *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Jaipur"
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

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Assign Theater Manager
                  </label>
                  <select
                    value={formData.adminId}
                    onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
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
                    <option value="">Select Account</option>
                    {managers.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.email}) [{m.role}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Longitude (e.g. 75.80)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
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

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Latitude (e.g. 26.85)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
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
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Physical Address
                </label>
                <input
                  type="text"
                  placeholder="Street / Mall / Landmark address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 141 2728900"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
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
                    fontWeight: 600,
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
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'Onboarding...' : 'Onboard Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Manager Modal */}
      {reassignModal && (
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
              maxWidth: 440,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                Reassign Theater Manager
              </h3>
              <button
                onClick={() => setReassignModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
              Select a manager account for <strong>{reassignModal.name}</strong>:
            </p>

            <form onSubmit={handleReassignManager} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <select
                required
                value={newAdminId}
                onChange={(e) => setNewAdminId(e.target.value)}
                style={{
                  width: '100%',
                  background: '#131929',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  color: '#ffffff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select Manager</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email}) [{m.role}]
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setReassignModal(null)}
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
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
