import React, { useState, useEffect } from 'react';
import {
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
} from '../../services/admin.api.js';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Filter,
  X,
  Edit,
  Mail,
  Phone,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Role Edit Modal
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Suspend Modal
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers({
        search,
        role: roleFilter,
        page,
        limit: 15,
      });
      if (res.data?.success) {
        setUsers(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  const handleRoleUpdate = async (e) => {
    e.preventDefault();
    if (!roleModalUser || !newRole) return;
    try {
      await updateUserRole(roleModalUser._id, newRole);
      setRoleModalUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = !user.isActive;
    const confirmMsg = nextStatus
      ? `Re-activate account for ${user.name}?`
      : `Suspend account for ${user.name}?`;

    if (window.confirm(confirmMsg)) {
      try {
        await updateUserStatus(user._id, nextStatus, 'Admin moderation action');
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update user status');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
          User &amp; Identity Governance
        </h1>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
          Moderate platform users, promote theater partners, and audit accounts.
        </p>
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
            minWidth: 280,
          }}
        >
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
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
          <option value="">All Platform Roles</option>
          <option value="customer">Customer</option>
          <option value="theatreAdmin">Theater Admin (theatreAdmin)</option>
          <option value="admin">Platform Admin (admin)</option>
        </select>
      </div>

      {/* Users Table */}
      <div
        style={{
          background: 'rgba(14, 19, 32, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>User</th>
                <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Contact</th>
                <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Platform Role</th>
                <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Status</th>
                <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Created</th>
                <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    Loading users list...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const roleColor =
                    u.role === 'admin'
                      ? '#ec4899'
                      : u.role === 'theatreAdmin'
                      ? '#a855f7'
                      : '#38bdf8';

                  return (
                    <tr
                      key={u._id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #334155, #1e293b)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#ffffff' }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>ID: {u._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ color: '#cbd5e1' }}>{u.email}</div>
                        {u.mobileNo && (
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            {u.mobileNo}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: `${roleColor}18`,
                            color: roleColor,
                            border: `1px solid ${roleColor}35`,
                            textTransform: 'uppercase',
                          }}
                        >
                          {u.role || 'customer'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 20,
                            background: u.isActive !== false ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: u.isActive !== false ? '#4ade80' : '#f87171',
                          }}
                        >
                          {u.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: 12 }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </td>

                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          <button
                            onClick={() => {
                              setRoleModalUser(u);
                              setNewRole(u.role || 'customer');
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: 6,
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#cbd5e1',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Edit Role
                          </button>

                          <button
                            onClick={() => handleToggleStatus(u)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: 6,
                              background: u.isActive !== false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                              border: u.isActive !== false ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)',
                              color: u.isActive !== false ? '#f87171' : '#4ade80',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {u.isActive !== false ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Edit Modal */}
      {roleModalUser && (
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
                Promote / Change Role
              </h3>
              <button
                onClick={() => setRoleModalUser(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
              Update access privileges for <strong>{roleModalUser.name}</strong> ({roleModalUser.email}):
            </p>

            <form onSubmit={handleRoleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{
                  width: '100%',
                  background: '#131929',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  color: '#ffffff',
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                <option value="customer">Customer (End User)</option>
                <option value="theatreAdmin">Theater Admin (Cinema Partner)</option>
                <option value="admin">Platform Admin (Super Admin)</option>
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
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
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
