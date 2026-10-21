import api from '../lib/api.js';

// ==========================================
// Theater Admin APIs (/api/v1/theater-admin)
// ==========================================

// Dashboard & Live Schedule
export const getTheaterSummary = (theaterId) =>
  api.get('/theater-admin/dashboard/summary', {
    params: theaterId ? { theaterId } : {},
  });

export const getTodaySchedule = (theaterId) =>
  api.get('/theater-admin/dashboard/today-schedule', {
    params: theaterId ? { theaterId } : {},
  });

// Profile & Amenities
export const getTheaterProfile = (theaterId) =>
  api.get('/theater-admin/profile', {
    params: theaterId ? { theaterId } : {},
  });

export const updateTheaterProfile = (payload, theaterId) =>
  api.put('/theater-admin/profile', payload, {
    params: theaterId ? { theaterId } : {},
  });

// Screens Layout Matrix Builder
export const getScreens = (theaterId) =>
  api.get('/theater-admin/screens', {
    params: theaterId ? { theaterId } : {},
  });

export const createScreen = (payload) =>
  api.post('/theater-admin/screens', payload);

export const updateScreen = (screenId, payload) =>
  api.put(`/theater-admin/screens/${screenId}`, payload);

export const deleteScreen = (screenId) =>
  api.delete(`/theater-admin/screens/${screenId}`);

// Shows & Conflict Prevention Scheduling
export const getShows = (params) =>
  api.get('/theater-admin/shows', { params });

export const createShow = (payload) =>
  api.post('/theater-admin/shows', payload);

export const deleteShow = (showId) =>
  api.delete(`/theater-admin/shows/${showId}`);

export const updateCategoryPricing = (showId, categoryPricing) =>
  api.patch(`/theater-admin/shows/${showId}/pricing`, { categoryPricing });

// Real-Time Seat Inventory & Maintenance Blocking
export const getShowInventory = (showId) =>
  api.get(`/theater-admin/shows/${showId}/inventory`);

export const blockSeats = (showId, seatIds, reason) =>
  api.post(`/theater-admin/shows/${showId}/seats/block`, { seatIds, reason });

export const unblockSeats = (showId, seatIds) =>
  api.post(`/theater-admin/shows/${showId}/seats/unblock`, { seatIds });

// QR Gate Scanner Check-in & Box Office POS
export const verifyTicket = (bookingId) =>
  api.post('/theater-admin/check-in/verify', { bookingId });

export const admitTicket = (bookingId) =>
  api.post('/theater-admin/check-in/admit', { bookingId });

export const bookBoxOffice = (payload) =>
  api.post('/theater-admin/box-office/book', payload);

// Bookings & Occupancy Reports
export const getTheaterBookings = (params) =>
  api.get('/theater-admin/bookings', { params });

export const getOccupancyReport = (params) =>
  api.get('/theater-admin/reports/occupancy', { params });

export const getPayoutReport = () =>
  api.get('/theater-admin/reports/payouts');
