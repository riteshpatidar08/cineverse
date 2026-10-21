import React, { useState, useEffect } from 'react';
import {
  getTheaterProfile,
  updateTheaterProfile,
} from '../../services/theaterAdmin.api.js';
import {
  Building2,
  Phone,
  MapPin,
  Check,
  CheckCircle,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

export default function TheaterProfilePage() {
  const [profile, setProfile] = useState(null);
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [newFacilityTag, setNewFacilityTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const standardAmenities = [
    'Dolby Atmos',
    '4K Laser Projection',
    'Recliner Seating',
    'Gourmet Food Court',
    'Valet Parking',
    'Wheelchair Accessible',
    'IMAX Experience',
    'Air Conditioned Lobby',
  ];

  useEffect(() => {
    getTheaterProfile()
      .then((res) => {
        if (res.data?.success) {
          const d = res.data.data;
          setProfile(d);
          setContactPhone(d.contactPhone || '');
          setAddress(d.address || '');
          setFacilities(d.facilities || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleAmenity = (amenity) => {
    if (facilities.includes(amenity)) {
      setFacilities(facilities.filter((f) => f !== amenity));
    } else {
      setFacilities([...facilities, amenity]);
    }
  };

  const handleAddCustomAmenity = (e) => {
    e.preventDefault();
    if (!newFacilityTag.trim()) return;
    if (!facilities.includes(newFacilityTag.trim())) {
      setFacilities([...facilities, newFacilityTag.trim()]);
    }
    setNewFacilityTag('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      await updateTheaterProfile({
        contactPhone,
        address,
        facilities,
      });
      setSuccessMessage('Theater facilities & profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading profile...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
          Cinema Profile &amp; Amenities Configuration
        </h1>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
          Configure amenities displayed on customer movie booking page and customer support phone.
        </p>
      </div>

      {successMessage && (
        <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={16} /> {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Basic Property Details */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Cinema Property
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
                {profile?.name}
              </h2>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 20,
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                textTransform: 'uppercase',
              }}
            >
              {profile?.city} Zone
            </span>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
              Cinema Physical Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 4th Floor, GT Central Mall, Malviya Nagar, Jaipur"
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
              Customer Care Hotline / Phone
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 141 4001234"
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

        {/* Facilities & Amenities Selection */}
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
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
              Theater Facilities &amp; Experience Tags
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Select amenities supported in this cinema complex to display on discovery cards.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {standardAmenities.map((amenity) => {
              const active = facilities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: active ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: active ? '#34d399' : '#94a3b8',
                  }}
                >
                  {active && <Check size={14} />} {amenity}
                </button>
              );
            })}
          </div>

          {/* Custom tag input */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <input
              type="text"
              placeholder="Add custom facility tag..."
              value={newFacilityTag}
              onChange={(e) => setNewFacilityTag(e.target.value)}
              style={{
                flex: 1,
                background: '#131929',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8,
                padding: '8px 14px',
                color: '#ffffff',
                fontSize: 12,
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomAmenity}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Add Tag
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            alignSelf: 'flex-start',
            padding: '12px 28px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Theater Settings'}
        </button>
      </form>
    </div>
  );
}
