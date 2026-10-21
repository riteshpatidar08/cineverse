const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel.js');
const Theater = require('../models/theaterModel.js');
const Movie = require('../models/movieModel.js');
const User = require('../models/userModel.js');
const City = require('../models/cityModel.js');
const Screen = require('../models/ScreenModel.js');
const Coupon = require('../models/couponModel.js');
const Settlement = require('../models/settlementModel.js');
const cloudinary = require('../config/cloudinary.js');

// ==========================================
// 4.1 PLATFORM ANALYTICS & DASHBOARD METRICS
// ==========================================

// @desc    Get high-level platform health & KPI metrics
// @route   GET /api/v1/admin/dashboard/metrics
exports.getDashboardMetrics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  // Calculate gross booking revenue and platform convenience fees
  const bookingAgg = await Booking.aggregate([
    { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalGrossRevenue: { $sum: '$pricing.totalAmount' },
        totalConvenienceFees: { $sum: '$pricing.convenienceFee' },
        totalSeatsRevenue: { $sum: '$pricing.seatsTotal' },
        totalTicketsSold: { $sum: '$pricing.totalSeats' },
        totalBookings: { $sum: 1 },
      },
    },
  ]);

  const bookingStats = bookingAgg[0] || {
    totalGrossRevenue: 0,
    totalConvenienceFees: 0,
    totalSeatsRevenue: 0,
    totalTicketsSold: 0,
    totalBookings: 0,
  };

  // Today's boundaries
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayAgg = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfToday },
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: null,
        todayBookingsCount: { $sum: 1 },
        todayRevenue: { $sum: '$pricing.totalAmount' },
        todayTicketsSold: { $sum: '$pricing.totalSeats' },
      },
    },
  ]);

  const todayStats = todayAgg[0] || {
    todayBookingsCount: 0,
    todayRevenue: 0,
    todayTicketsSold: 0,
  };

  const [totalTheaters, activeTheaters, totalMoviesPlaying, totalRegisteredUsers] =
    await Promise.all([
      Theater.countDocuments(),
      Theater.countDocuments({ isActive: true }),
      Movie.countDocuments({ isActive: true }),
      User.countDocuments(),
    ]);

  res.status(200).json({
    success: true,
    data: {
      totalGrossRevenue: bookingStats.totalGrossRevenue,
      totalPlatformConvenienceFees: bookingStats.totalConvenienceFees,
      totalSeatsRevenue: bookingStats.totalSeatsRevenue,
      totalTicketsSold: bookingStats.totalTicketsSold,
      totalBookings: bookingStats.totalBookings,
      totalTheaters,
      activeTheaters,
      totalMoviesPlaying,
      totalRegisteredUsers,
      todayBookingsCount: todayStats.todayBookingsCount,
      todayRevenue: todayStats.todayRevenue,
      todayTicketsSold: todayStats.todayTicketsSold,
    },
  });
});

// @desc    Revenue and bookings time-series for charts
// @route   GET /api/v1/admin/dashboard/revenue-analytics
exports.getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { limit = 30 } = req.query;

  const data = await Booking.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        grossRevenue: { $sum: '$pricing.totalAmount' },
        platformFee: { $sum: '$pricing.convenienceFee' },
        seatsRevenue: { $sum: '$pricing.seatsTotal' },
        ticketsCount: { $sum: '$pricing.totalSeats' },
        bookingCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: Number(limit) },
    {
      $project: {
        _id: 0,
        date: '$_id',
        grossRevenue: 1,
        platformFee: 1,
        seatsRevenue: 1,
        ticketsCount: 1,
        bookingCount: 1,
      },
    },
  ]);

  // If DB has few or no entries, provide smooth baseline points for UI charts
  let responseData = data;
  if (!responseData || responseData.length === 0) {
    const today = new Date();
    responseData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr,
        grossRevenue: 0,
        platformFee: 0,
        seatsRevenue: 0,
        ticketsCount: 0,
        bookingCount: 0,
      };
    });
  }

  res.status(200).json({
    success: true,
    data: responseData,
  });
});

// @desc    Top performing movies, theaters, and cities
// @route   GET /api/v1/admin/dashboard/top-performing
exports.getTopPerforming = asyncHandler(async (req, res) => {
  // Top movies
  const topMovies = await Booking.aggregate([
    { $match: { status: { $ne: 'cancelled' }, movie: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: '$movie',
        ticketsSold: { $sum: '$pricing.totalSeats' },
        revenue: { $sum: '$pricing.totalAmount' },
        bookingCount: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: '_id',
        as: 'movieDetails',
      },
    },
    { $unwind: '$movieDetails' },
    {
      $project: {
        movieId: '$_id',
        title: '$movieDetails.title',
        poster: '$movieDetails.poster',
        duration: '$movieDetails.duration',
        ticketsSold: 1,
        revenue: 1,
        bookingCount: 1,
      },
    },
  ]);

  // Top theaters
  const topTheaters = await Booking.aggregate([
    { $match: { status: { $ne: 'cancelled' }, theater: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: '$theater',
        revenue: { $sum: '$pricing.totalAmount' },
        ticketsSold: { $sum: '$pricing.totalSeats' },
        bookingCount: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'theaters',
        localField: '_id',
        foreignField: '_id',
        as: 'theaterDetails',
      },
    },
    { $unwind: '$theaterDetails' },
    {
      $project: {
        theaterId: '$_id',
        name: '$theaterDetails.name',
        city: '$theaterDetails.city',
        revenue: 1,
        ticketsSold: 1,
        bookingCount: 1,
      },
    },
  ]);

  // Top cities
  const topCities = await Booking.aggregate([
    { $match: { status: { $ne: 'cancelled' }, theater: { $exists: true, $ne: null } } },
    {
      $lookup: {
        from: 'theaters',
        localField: 'theater',
        foreignField: '_id',
        as: 'theaterDetails',
      },
    },
    { $unwind: '$theaterDetails' },
    {
      $group: {
        _id: '$theaterDetails.city',
        revenue: { $sum: '$pricing.totalAmount' },
        tickets: { $sum: '$pricing.totalSeats' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    {
      $project: {
        city: '$_id',
        revenue: 1,
        tickets: 1,
        bookings: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      topMovies,
      topTheaters,
      topCities,
    },
  });
});

// ==========================================
// 4.2 USER & IDENTITY GOVERNANCE
// ==========================================

// @desc    Get paginated users with search & role filter
// @route   GET /api/v1/admin/users
exports.getUsers = asyncHandler(async (req, res) => {
  const { search, role, isActive, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined && isActive !== '') {
    filter.isActive = isActive === 'true';
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { mobileNo: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -otp2FA -otpExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    page: Number(page),
    data: users,
  });
});

// @desc    Promote / Demote user role
// @route   PATCH /api/v1/admin/users/:userId/role
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const validRoles = ['customer', 'theatreAdmin', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Allowed roles: ${validRoles.join(', ')}`,
    });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: `User role updated successfully to ${role}`,
    data: user,
  });
});

// @desc    Suspend or activate user account
// @route   PATCH /api/v1/admin/users/:userId/status
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive, reason } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: Boolean(isActive) },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: `User account has been ${user.isActive ? 'activated' : 'suspended'}`,
    data: user,
  });
});

// ==========================================
// 4.3 GLOBAL MOVIE CATALOG MANAGEMENT
// ==========================================

// @desc    Add a movie to platform catalog
// @route   POST /api/v1/admin/movies
exports.createMovie = asyncHandler(async (req, res) => {
  const {
    title,
    duration,
    genres,
    censorRating,
    releaseDate,
    description,
    poster: posterUrlFromBody,
  } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Movie title is required',
    });
  }

  let posterUrl = posterUrlFromBody;

  // Cloudinary upload if file provided
  if (req.file) {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'cineverse/movies' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
          .end(req.file.buffer);
      });
      posterUrl = uploadResult.secure_url;
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Poster image upload failed: ' + uploadError.message,
      });
    }
  }

  // Parse genres if array or string
  let parsedGenres = [];
  if (Array.isArray(genres)) {
    parsedGenres = genres;
  } else if (typeof genres === 'string') {
    try {
      parsedGenres = JSON.parse(genres);
    } catch {
      parsedGenres = genres.split(',').map((g) => g.trim());
    }
  }

  const movie = await Movie.create({
    title,
    duration: Number(duration) || 120,
    genres: parsedGenres,
    censorRating: censorRating || 'UA',
    releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
    description,
    poster:
      posterUrl ||
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'Movie successfully published to master catalog',
    data: movie,
  });
});

// @desc    Update movie details
// @route   PUT /api/v1/admin/movies/:id
exports.updateMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  if (req.file) {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'cineverse/movies' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
          .end(req.file.buffer);
      });
      updateData.poster = uploadResult.secure_url;
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: 'Poster upload failed: ' + uploadError.message,
      });
    }
  }

  if (updateData.genres && typeof updateData.genres === 'string') {
    try {
      updateData.genres = JSON.parse(updateData.genres);
    } catch {
      updateData.genres = updateData.genres.split(',').map((g) => g.trim());
    }
  }

  const movie = await Movie.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Movie updated successfully',
    data: movie,
  });
});

// @desc    Toggle movie active status
// @route   PATCH /api/v1/admin/movies/:id/toggle-status
exports.toggleMovieStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findById(id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found',
    });
  }

  movie.isActive = !movie.isActive;
  await movie.save();

  res.status(200).json({
    success: true,
    message: `Movie status set to ${movie.isActive ? 'Active' : 'Inactive'}`,
    isActive: movie.isActive,
    data: movie,
  });
});

// @desc    Get all movies for admin (including inactive)
// @route   GET /api/v1/admin/movies
exports.getAdminMovies = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [movies, total] = await Promise.all([
    Movie.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Movie.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: movies.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    page: Number(page),
    data: movies,
  });
});

// @desc    Delete movie
// @route   DELETE /api/v1/admin/movies/:id
exports.deleteMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findByIdAndDelete(id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Movie deleted successfully from catalog',
  });
});

// ==========================================
// 4.4 THEATER PARTNER ONBOARDING & GOVERNANCE
// ==========================================

// @desc    Onboard a new theater and assign a theater administrator
// @route   POST /api/v1/admin/theaters
exports.createTheater = asyncHandler(async (req, res) => {
  const {
    name,
    city,
    adminId,
    location,
    address,
    contactPhone,
    facilities,
  } = req.body;

  if (!name || !city || !location || !location.coordinates) {
    return res.status(400).json({
      success: false,
      message: 'Theater name, city, and GPS coordinates are required',
    });
  }

  // Validate admin user if provided
  let adminUser = null;
  if (adminId) {
    adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Assigned administrator user not found',
      });
    }

    // Automatically ensure assigned user has theatreAdmin role
    if (adminUser.role === 'customer') {
      adminUser.role = 'theatreAdmin';
      await adminUser.save();
    }
  }

  const theater = await Theater.create({
    name,
    city,
    admin: adminId || null,
    location: {
      type: 'Point',
      coordinates: [
        Number(location.coordinates[0]),
        Number(location.coordinates[1]),
      ],
    },
    address: address || `${name}, ${city}`,
    contactPhone: contactPhone || '',
    facilities: facilities || [
      'Dolby Atmos',
      '4K Projection',
      'Parking',
      'Food Court',
    ],
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'Theater property onboarded successfully',
    data: theater,
  });
});

// @desc    List all theaters with assigned managers and screen counts
// @route   GET /api/v1/admin/theaters
exports.getAdminTheaters = asyncHandler(async (req, res) => {
  const { city, status, search } = req.query;

  const filter = {};
  if (city) filter.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const theaters = await Theater.find(filter)
    .populate('admin', 'name email mobileNo role')
    .sort({ createdAt: -1 })
    .lean();

  // Attach screen count to each theater
  const theaterIds = theaters.map((t) => t._id);
  const screensAgg = await Screen.aggregate([
    { $match: { theater: { $in: theaterIds } } },
    { $group: { _id: '$theater', count: { $sum: 1 } } },
  ]);

  const screenCountMap = new Map();
  screensAgg.forEach((s) => {
    screenCountMap.set(s._id.toString(), s.count);
  });

  const enrichedTheaters = theaters.map((t) => ({
    ...t,
    screensCount: screenCountMap.get(t._id.toString()) || 0,
  }));

  res.status(200).json({
    success: true,
    count: enrichedTheaters.length,
    data: enrichedTheaters,
  });
});

// @desc    Reassign theater management rights to another admin
// @route   PATCH /api/v1/admin/theaters/:id/assign-admin
exports.assignTheaterAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newAdminId } = req.body;

  const newAdmin = await User.findById(newAdminId);
  if (!newAdmin) {
    return res.status(404).json({
      success: false,
      message: 'New administrator user not found',
    });
  }

  // Promote to theatreAdmin if still customer
  if (newAdmin.role === 'customer') {
    newAdmin.role = 'theatreAdmin';
    await newAdmin.save();
  }

  const theater = await Theater.findByIdAndUpdate(
    id,
    { admin: newAdminId },
    { new: true }
  ).populate('admin', 'name email mobileNo role');

  if (!theater) {
    return res.status(404).json({
      success: false,
      message: 'Theater not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Theater administrator successfully updated',
    data: theater,
  });
});

// @desc    Toggle theater active status
// @route   PATCH /api/v1/admin/theaters/:id/toggle-status
exports.toggleTheaterStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const theater = await Theater.findById(id);

  if (!theater) {
    return res.status(404).json({
      success: false,
      message: 'Theater not found',
    });
  }

  theater.isActive = !theater.isActive;
  await theater.save();

  res.status(200).json({
    success: true,
    message: `Theater property ${theater.isActive ? 'activated' : 'deactivated'}`,
    data: theater,
  });
});

// @desc    Delete / decommission theater
// @route   DELETE /api/v1/admin/theaters/:id
exports.deleteTheater = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const theater = await Theater.findByIdAndDelete(id);

  if (!theater) {
    return res.status(404).json({
      success: false,
      message: 'Theater not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Theater property successfully removed',
  });
});

// ==========================================
// 4.5 OPERATIONAL CITIES & GEOFENCING
// ==========================================

// @desc    Add an authorized operational city
// @route   POST /api/v1/admin/cities
exports.createCity = asyncHandler(async (req, res) => {
  const { name, state, coordinates } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'City name is required',
    });
  }

  const existing = await City.findOne({
    cityName: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'City already exists in operational database',
    });
  }

  const city = await City.create({
    cityName: name.trim(),
    state: state || '',
    coordinates: coordinates || [0, 0],
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'City added to operational zones',
    data: city,
  });
});

// @desc    Get operational cities with theater metrics
// @route   GET /api/v1/admin/cities
exports.getAdminCities = asyncHandler(async (req, res) => {
  const cities = await City.find().sort({ cityName: 1 }).lean();

  // Count theaters in each city
  const theaterCounts = await Theater.aggregate([
    { $group: { _id: { $toLower: '$city' }, count: { $sum: 1 } } },
  ]);

  const countMap = new Map();
  theaterCounts.forEach((c) => {
    countMap.set(c._id, c.count);
  });

  const enrichedCities = cities.map((c) => ({
    ...c,
    theatersCount: countMap.get(c.cityName.toLowerCase()) || 0,
  }));

  res.status(200).json({
    success: true,
    count: enrichedCities.length,
    data: enrichedCities,
  });
});

// @desc    Toggle city active status
// @route   PATCH /api/v1/admin/cities/:id/toggle-status
exports.toggleCityStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const city = await City.findById(id);

  if (!city) {
    return res.status(404).json({
      success: false,
      message: 'City not found',
    });
  }

  city.isActive = !city.isActive;
  await city.save();

  res.status(200).json({
    success: true,
    message: `City ${city.isActive ? 'activated' : 'deactivated'}`,
    data: city,
  });
});

// ==========================================
// 4.6 PLATFORM FINANCE & REVENUE SETTLEMENT
// ==========================================

// @desc    Master ledger of all bookings & Razorpay payments
// @route   GET /api/v1/admin/finance/transactions
exports.getFinanceTransactions = asyncHandler(async (req, res) => {
  const { status, theaterId, startDate, endDate, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter['paymentsDetails.status'] = status;
  if (theaterId) filter.theater = theaterId;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('user', 'name email mobileNo')
      .populate('theater', 'name city')
      .populate('movie', 'title poster')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Booking.countDocuments(filter),
  ]);

  const transactions = bookings.map((b) => ({
    _id: b._id,
    bookingId: b.bookingId,
    user: b.user || { name: 'Guest Patron', email: 'guest@cineverse.com' },
    theater: b.theater || { name: 'Cinema Hall' },
    movie: b.movie || { title: 'Feature Film' },
    ticketsCount: b.pricing?.totalSeats || (b.seats ? b.seats.length : 1),
    seatsTotal: b.pricing?.seatsTotal || 0,
    convenienceFee: b.pricing?.convenienceFee || 0,
    totalAmount: b.pricing?.totalAmount || 0,
    paymentMethod: b.paymentsDetails?.paymentMethod || 'Razorpay',
    razorPayPaymentId: b.paymentsDetails?.razorPayPaymentId || b.bookingId,
    paymentStatus: b.paymentsDetails?.status || 'success',
    bookingStatus: b.status || 'confirmed',
    isCheckedIn: b.isCheckedIn || false,
    createdAt: b.createdAt,
  }));

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    page: Number(page),
    data: transactions,
  });
});

// @desc    Calculate partner theater payout ledger & platform commission
// @route   GET /api/v1/admin/finance/settlements
exports.getFinanceSettlements = asyncHandler(async (req, res) => {
  // Aggregate sales by theater
  const theaterSales = await Booking.aggregate([
    { $match: { status: { $ne: 'cancelled' }, theater: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: '$theater',
        totalGrossSales: { $sum: '$pricing.seatsTotal' },
        totalPlatformFees: { $sum: '$pricing.convenienceFee' },
        totalTicketsSold: { $sum: '$pricing.totalSeats' },
        totalBookings: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'theaters',
        localField: '_id',
        foreignField: '_id',
        as: 'theaterDetails',
      },
    },
    { $unwind: '$theaterDetails' },
  ]);

  // Fetch existing settlement records
  const existingSettlements = await Settlement.find().lean();
  const settlementMap = new Map();
  existingSettlements.forEach((s) => {
    settlementMap.set(s.theater.toString(), s);
  });

  const settlements = theaterSales.map((ts) => {
    const existing = settlementMap.get(ts._id.toString());
    const gross = ts.totalGrossSales || 0;
    // Platform fee is 16% withholding fee
    const commission = Math.round(gross * 0.16);
    const netPayable = gross - commission;

    return {
      theaterId: ts._id,
      theaterName: ts.theaterDetails.name,
      city: ts.theaterDetails.city,
      totalGrossSales: gross,
      platformCommission: commission,
      netPayableToTheater: netPayable,
      ticketsSold: ts.totalTicketsSold,
      bookingsCount: ts.totalBookings,
      settlementStatus: existing ? existing.settlementStatus : 'pending',
      paymentReference: existing ? existing.paymentReference : null,
      paidAt: existing ? existing.paidAt : null,
      cycle: existing ? existing.cycle : 'Current Cycle',
    };
  });

  res.status(200).json({
    success: true,
    count: settlements.length,
    data: settlements,
  });
});

// @desc    Mark partner theater settlement as disbursed / paid
// @route   POST /api/v1/admin/finance/settlements/:theaterId/mark-paid
exports.markSettlementPaid = asyncHandler(async (req, res) => {
  const { theaterId } = req.params;
  const { settlementCycle, amountPaid, paymentReference, notes } = req.body;

  const theater = await Theater.findById(theaterId);
  if (!theater) {
    return res.status(404).json({
      success: false,
      message: 'Theater not found',
    });
  }

  const settlement = await Settlement.findOneAndUpdate(
    { theater: theaterId, cycle: settlementCycle || 'Current Cycle' },
    {
      theater: theaterId,
      cycle: settlementCycle || 'Current Cycle',
      netPayableToTheater: amountPaid || 0,
      settlementStatus: 'settled',
      paymentReference: paymentReference || `NEFT_${Date.now()}`,
      paidAt: new Date(),
      notes,
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    message: `Settlement payment marked as disbursed for ${theater.name}`,
    data: settlement,
  });
});

// ==========================================
// 4.7 COUPON & DISCOUNT CODE MANAGEMENT
// ==========================================

// @desc    Create promotional coupon
// @route   POST /api/v1/admin/coupons
exports.createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    maxDiscountAmount,
    minimumOrderAmount,
    validUntil,
    usageLimit,
  } = req.body;

  if (!code || !discountValue || !validUntil) {
    return res.status(400).json({
      success: false,
      message: 'Coupon code, discount value, and valid until date are required',
    });
  }

  const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'Coupon with this code already exists',
    });
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase().trim(),
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    maxDiscountAmount: Number(maxDiscountAmount) || 150,
    minimumOrderAmount: Number(minimumOrderAmount) || 0,
    validUntil: new Date(validUntil),
    usageLimit: Number(usageLimit) || 1000,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'Coupon code created successfully',
    data: coupon,
  });
});

// @desc    Get all coupons
// @route   GET /api/v1/admin/coupons
exports.getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  res.status(200).json({
    success: true,
    count: coupons.length,
    data: coupons,
  });
});

// @desc    Toggle coupon active status
// @route   PATCH /api/v1/admin/coupons/:id/toggle
exports.toggleCouponStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Coupon not found',
    });
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} is now ${coupon.isActive ? 'active' : 'inactive'}`,
    data: coupon,
  });
});
