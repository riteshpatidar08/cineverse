import api from '../lib/api.js';

// ==========================================
// Platform Admin APIs (/api/v1/admin)
// ==========================================

// Dashboard Metrics & Charts
export const getAdminMetrics = (params) =>
  api.get('/admin/dashboard/metrics', { params });

export const getRevenueAnalytics = (params) =>
  api.get('/admin/dashboard/revenue-analytics', { params });

export const getTopPerforming = () =>
  api.get('/admin/dashboard/top-performing');

// User Governance
export const getAdminUsers = (params) =>
  api.get('/admin/users', { params });

export const updateUserRole = (userId, role) =>
  api.patch(`/admin/users/${userId}/role`, { role });

export const updateUserStatus = (userId, isActive, reason) =>
  api.patch(`/admin/users/${userId}/status`, { isActive, reason });

// Master Movies Catalog
export const getAdminMovies = (params) =>
  api.get('/admin/movies', { params });

export const createMovie = (formData) =>
  api.post('/admin/movies', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateMovie = (id, formData) =>
  api.put(`/admin/movies/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const toggleMovieStatus = (id) =>
  api.patch(`/admin/movies/${id}/toggle-status`);

export const deleteMovie = (id) =>
  api.delete(`/admin/movies/${id}`);

// Theater Partners Governance
export const getAdminTheaters = (params) =>
  api.get('/admin/theaters', { params });

export const createTheater = (theaterPayload) =>
  api.post('/admin/theaters', theaterPayload);

export const assignTheaterAdmin = (id, newAdminId) =>
  api.patch(`/admin/theaters/${id}/assign-admin`, { newAdminId });

export const toggleTheaterStatus = (id) =>
  api.patch(`/admin/theaters/${id}/toggle-status`);

export const deleteTheater = (id) =>
  api.delete(`/admin/theaters/${id}`);

// Operational Cities
export const getAdminCities = () =>
  api.get('/admin/cities');

export const createCity = (payload) =>
  api.post('/admin/cities', payload);

export const toggleCityStatus = (id) =>
  api.patch(`/admin/cities/${id}/toggle-status`);

// Finance & Settlements
export const getFinanceTransactions = (params) =>
  api.get('/admin/finance/transactions', { params });

export const getFinanceSettlements = () =>
  api.get('/admin/finance/settlements');

export const markSettlementPaid = (theaterId, payload) =>
  api.post(`/admin/finance/settlements/${theaterId}/mark-paid`, payload);

// Coupons
export const getAdminCoupons = () =>
  api.get('/admin/coupons');

export const createCoupon = (payload) =>
  api.post('/admin/coupons', payload);

export const toggleCouponStatus = (id) =>
  api.patch(`/admin/coupons/${id}/toggle`);
