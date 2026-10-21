const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js');
const checkRole = require('../middlewares/checkRole.js');
const upload = require('../middlewares/upload.js');

const {
  getDashboardMetrics,
  getRevenueAnalytics,
  getTopPerforming,
  getUsers,
  updateUserRole,
  updateUserStatus,
  createMovie,
  updateMovie,
  toggleMovieStatus,
  getAdminMovies,
  deleteMovie,
  createTheater,
  getAdminTheaters,
  assignTheaterAdmin,
  toggleTheaterStatus,
  deleteTheater,
  createCity,
  getAdminCities,
  toggleCityStatus,
  getFinanceTransactions,
  getFinanceSettlements,
  markSettlementPaid,
  createCoupon,
  getCoupons,
  toggleCouponStatus,
} = require('../controllers/adminController.js');

// Protect all admin routes with verifyToken and checkRole(['admin'])
router.use(verifyToken, checkRole(['admin']));

// 4.1 Dashboard Analytics
router.get('/dashboard/metrics', getDashboardMetrics);
router.get('/dashboard/revenue-analytics', getRevenueAnalytics);
router.get('/dashboard/top-performing', getTopPerforming);

// 4.2 User & Identity Governance
router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);
router.patch('/users/:userId/status', updateUserStatus);

// 4.3 Global Movie Catalog Management
router.post('/movies', upload.single('poster'), createMovie);
router.put('/movies/:id', upload.single('poster'), updateMovie);
router.patch('/movies/:id/toggle-status', toggleMovieStatus);
router.get('/movies', getAdminMovies);
router.delete('/movies/:id', deleteMovie);

// 4.4 Theater Partner Onboarding & Governance
router.post('/theaters', createTheater);
router.get('/theaters', getAdminTheaters);
router.patch('/theaters/:id/assign-admin', assignTheaterAdmin);
router.patch('/theaters/:id/toggle-status', toggleTheaterStatus);
router.delete('/theaters/:id', deleteTheater);

// 4.5 Operational Cities
router.post('/cities', createCity);
router.get('/cities', getAdminCities);
router.patch('/cities/:id/toggle-status', toggleCityStatus);

// 4.6 Finance & Settlements
router.get('/finance/transactions', getFinanceTransactions);
router.get('/finance/settlements', getFinanceSettlements);
router.post('/finance/settlements/:theaterId/mark-paid', markSettlementPaid);

// 4.7 Coupons
router.post('/coupons', createCoupon);
router.get('/coupons', getCoupons);
router.patch('/coupons/:id/toggle', toggleCouponStatus);

module.exports = router;
