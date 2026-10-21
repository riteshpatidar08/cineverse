const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js');
const checkRole = require('../middlewares/checkRole.js');
const checkTheaterOwnership = require('../middlewares/checkTheaterOwnership.js');

const {
  getTheaterSummary,
  getTodaySchedule,
  getTheaterProfile,
  updateTheaterProfile,
  getScreens,
  createScreen,
  updateScreen,
  deleteScreen,
  getShows,
  createShow,
  deleteShow,
  updateCategoryPricing,
  getShowInventory,
  blockSeats,
  unblockSeats,
  verifyTicket,
  admitTicket,
  bookBoxOffice,
  getTheaterBookings,
  getOccupancyReport,
  getPayoutReport,
} = require('../controllers/theaterAdminController.js');

// Protect all theater admin routes with verifyToken, checkRole and checkTheaterOwnership
router.use(
  verifyToken,
  checkRole(['theatreAdmin', 'admin']),
  checkTheaterOwnership
);

// 5.1 Dashboard
router.get('/dashboard/summary', getTheaterSummary);
router.get('/dashboard/today-schedule', getTodaySchedule);

// 5.2 Theater Profile
router.get('/profile', getTheaterProfile);
router.put('/profile', updateTheaterProfile);

// 5.3 Screens
router.get('/screens', getScreens);
router.post('/screens', createScreen);
router.put('/screens/:screenId', updateScreen);
router.delete('/screens/:screenId', deleteScreen);

// 5.4 Shows & Scheduling
router.get('/shows', getShows);
router.post('/shows', createShow);
router.delete('/shows/:showId', deleteShow);

// 5.5 Dynamic Pricing
router.patch('/shows/:showId/pricing', updateCategoryPricing);

// 5.6 Real-Time Seat Inventory & Maintenance Locker
router.get('/shows/:showId/inventory', getShowInventory);
router.post('/shows/:showId/seats/block', blockSeats);
router.post('/shows/:showId/seats/unblock', unblockSeats);

// 5.7 Gate QR Ticket Scanner & Box Office POS
router.post('/check-in/verify', verifyTicket);
router.post('/check-in/admit', admitTicket);
router.post('/box-office/book', bookBoxOffice);

// 5.8 Bookings & Reports
router.get('/bookings', getTheaterBookings);
router.get('/reports/occupancy', getOccupancyReport);
router.get('/reports/payouts', getPayoutReport);

module.exports = router;
