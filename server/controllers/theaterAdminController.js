const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Theater = require('../models/theaterModel.js');
const Show = require('../models/showModel.js');
const Screen = require('../models/ScreenModel.js');
const ShowSeat = require('../models/showSeatModel.js');
const Booking = require('../models/bookingModel.js');
const Movie = require('../models/movieModel.js');
const Settlement = require('../models/settlementModel.js');

// Helper to resolve theater ID from request
const resolveTheaterId = async (req) => {
  if (req.theater && req.theater._id) {
    return req.theater._id;
  }
  if (req.managedTheaterId) {
    return req.managedTheaterId;
  }
  const theaterId =
    req.params?.theaterId || req.body?.theaterId || req.query?.theaterId;
  if (theaterId) {
    return theaterId;
  }
  // Lookup assigned theater for the user
  if (req.user?.id) {
    const found = await Theater.findOne({ admin: req.user.id });
    if (found) return found._id;
  }
  if (req.user?.role === 'admin') {
    const first = await Theater.findOne();
    if (first) return first._id;
  }
  return null;
};

// ==========================================
// 5.1 THEATER DASHBOARD & LIVE OPERATIONS
// ==========================================

// @desc    Live operations summary for assigned theater
// @route   GET /api/v1/theater-admin/dashboard/summary
exports.getTheaterSummary = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);

  if (!theaterId) {
    return res.status(404).json({
      success: false,
      message: 'No theater property found for your account',
    });
  }

  const theater = await Theater.findById(theaterId).lean();
  if (!theater) {
    return res.status(404).json({
      success: false,
      message: 'Theater not found',
    });
  }

  // Today range
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Today's shows
  const todayShows = await Show.find({
    theater: theaterId,
    $or: [
      { showDate: { $gte: startOfToday, $lte: endOfToday } },
      { startTime: { $gte: startOfToday, $lte: endOfToday } },
    ],
  }).lean();

  const showIds = todayShows.map((s) => s._id);

  // Today's bookings for this theater
  const todayBookingsAgg = await Booking.aggregate([
    {
      $match: {
        theater: new mongoose.Types.ObjectId(theaterId.toString()),
        createdAt: { $gte: startOfToday, $lte: endOfToday },
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: null,
        todayBookingsCount: { $sum: 1 },
        todayTicketsSold: { $sum: '$pricing.totalSeats' },
        todayGrossRevenue: { $sum: '$pricing.seatsTotal' },
      },
    },
  ]);

  const bookingStats = todayBookingsAgg[0] || {
    todayBookingsCount: 0,
    todayTicketsSold: 0,
    todayGrossRevenue: 0,
  };

  // Calculate live occupancy rate across today's shows
  let totalSeatsInTodayShows = 0;
  let totalBookedSeatsInTodayShows = 0;

  if (showIds.length > 0) {
    const seatStats = await ShowSeat.aggregate([
      { $match: { show: { $in: showIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    seatStats.forEach((s) => {
      totalSeatsInTodayShows += s.count;
      if (s._id === 'booked') {
        totalBookedSeatsInTodayShows += s.count;
      }
    });
  }

  const currentOccupancyRate =
    totalSeatsInTodayShows > 0
      ? Number(
          ((totalBookedSeatsInTodayShows / totalSeatsInTodayShows) * 100).toFixed(
            1
          )
        )
      : 0;

  const activeScreensCount = await Screen.countDocuments({ theater: theaterId });

  res.status(200).json({
    success: true,
    data: {
      theaterId: theater._id,
      theaterName: theater.name,
      city: theater.city,
      todayShowsCount: todayShows.length,
      todayBookingsCount: bookingStats.todayBookingsCount,
      todayTicketsSold: bookingStats.todayTicketsSold,
      todayGrossRevenue: bookingStats.todayGrossRevenue,
      currentOccupancyRate,
      activeScreensCount,
    },
  });
});

// @desc    Today's shows schedule with capacity breakdown
// @route   GET /api/v1/theater-admin/dashboard/today-schedule
exports.getTodaySchedule = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const shows = await Show.find({
    theater: theaterId,
    $or: [
      { showDate: { $gte: startOfToday, $lte: endOfToday } },
      { startTime: { $gte: startOfToday, $lte: endOfToday } },
    ],
  })
    .populate('movie', 'title poster duration')
    .sort({ startTime: 1 })
    .lean();

  const enrichedShows = await Promise.all(
    shows.map(async (show) => {
      const seats = await ShowSeat.find({ show: show._id }).lean();
      let available = 0;
      let locked = 0;
      let booked = 0;
      let blocked = 0;

      const now = new Date();
      seats.forEach((s) => {
        if (s.status === 'booked') {
          booked++;
        } else if (s.status === 'blocked') {
          blocked++;
        } else if (
          s.status === 'locked' &&
          s.lockedExpiresAt &&
          new Date(s.lockedExpiresAt) > now
        ) {
          locked++;
        } else {
          available++;
        }
      });

      const totalSeats = seats.length;
      const occupancyPercentage =
        totalSeats > 0 ? Number(((booked / totalSeats) * 100).toFixed(1)) : 0;

      return {
        showId: show._id,
        movieId: show.movie?._id,
        movieTitle: show.movie?.title || 'Untitled',
        moviePoster: show.movie?.poster,
        screenName: show.screenName,
        startTime: show.startTime,
        showDate: show.showDate,
        categoryPricing: show.categoryPricing,
        totalSeats,
        bookedSeats: booked,
        lockedSeats: locked,
        availableSeats: available,
        blockedSeats: blocked,
        occupancyPercentage,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: enrichedShows.length,
    data: enrichedShows,
  });
});

// ==========================================
// 5.2 THEATER PROFILE & AMENITIES SETUP
// ==========================================

// @desc    Get theater profile & amenities
// @route   GET /api/v1/theater-admin/profile
exports.getTheaterProfile = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);

  const theater = await Theater.findById(theaterId)
    .populate('admin', 'name email mobileNo')
    .lean();

  if (!theater) {
    return res.status(404).json({
      success: false,
      message: 'Theater not found',
    });
  }

  res.status(200).json({
    success: true,
    data: theater,
  });
});

// @desc    Update theater amenities, phone & address
// @route   PUT /api/v1/theater-admin/profile
exports.updateTheaterProfile = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);
  const { contactPhone, facilities, address } = req.body;

  const updateData = {};
  if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
  if (facilities !== undefined) updateData.facilities = facilities;
  if (address !== undefined) updateData.address = address;

  const theater = await Theater.findByIdAndUpdate(theaterId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!theater) {
    return res.status(404).json({
      success: false,
      message: 'Theater not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Theater amenities and contact details updated',
    data: theater,
  });
});

// ==========================================
// 5.3 SCREEN LAYOUT MATRIX & CATEGORY BUILDER
// ==========================================

// @desc    Create a new screen configuration with seat layout
// @route   POST /api/v1/theater-admin/screens
exports.createScreen = asyncHandler(async (req, res) => {
  const theaterId = (await resolveTheaterId(req)) || req.body.theaterId;
  const { name, rows } = req.body;

  if (!theaterId || !name || !rows || rows.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Theater ID, screen name, and rows configuration are required',
    });
  }

  // Check if screen name already exists in this theater
  const existing = await Screen.findOne({ theater: theaterId, name });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: `A screen named "${name}" already exists in this theater`,
    });
  }

  // Enrich rows and generate seats array if only counts provided
  const processedRows = rows.map((r, rowIndex) => {
    let seats = r.seats || [];
    if (!seats || seats.length === 0) {
      // Auto-generate seats based on layout string or default count (e.g. 14 seats)
      let count = 14;
      if (r.layout) {
        // e.g. "LLLLLL_RRRRRR" -> 12 seats
        count = r.layout.replace(/[^A-Za-z0-9]/g, '').length || 14;
      }
      seats = Array.from({ length: count }, (_, i) => ({
        number: (r.start || 1) + i,
      }));
    }

    return {
      label: r.label || String.fromCharCode(65 + rowIndex),
      category: r.category ? r.category.toUpperCase() : 'REGULAR',
      layout: r.layout || 'LLLLLLL_RRRRRRR',
      start: r.start || 1,
      spaceAfter: r.spaceAfter !== undefined ? r.spaceAfter : 7,
      seats,
    };
  });

  const totalSeats = processedRows.reduce(
    (sum, row) => sum + row.seats.length,
    0
  );

  const screen = await Screen.create({
    theater: theaterId,
    name,
    rows: processedRows,
  });

  res.status(201).json({
    success: true,
    message: 'Screen configuration created successfully',
    data: {
      _id: screen._id,
      name: screen.name,
      theater: screen.theater,
      rowsCount: screen.rows.length,
      totalSeats,
      rows: screen.rows,
    },
  });
});

// @desc    List all screens in the theater
// @route   GET /api/v1/theater-admin/screens
exports.getScreens = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);

  const screens = await Screen.find({ theater: theaterId }).lean();

  const formattedScreens = screens.map((s) => {
    const totalSeats = (s.rows || []).reduce(
      (sum, row) => sum + (row.seats ? row.seats.length : 0),
      0
    );
    return {
      _id: s._id,
      name: s.name,
      theater: s.theater,
      rowsCount: s.rows ? s.rows.length : 0,
      totalSeats,
      rows: s.rows,
    };
  });

  res.status(200).json({
    success: true,
    count: formattedScreens.length,
    data: formattedScreens,
  });
});

// @desc    Update screen layout
// @route   PUT /api/v1/theater-admin/screens/:screenId
exports.updateScreen = asyncHandler(async (req, res) => {
  const { screenId } = req.params;
  const { name, rows } = req.body;

  const screen = await Screen.findById(screenId);
  if (!screen) {
    return res.status(404).json({
      success: false,
      message: 'Screen not found',
    });
  }

  // Optional: Check if active shows in future have booked seats
  const upcomingShows = await Show.find({
    theater: screen.theater,
    screenName: screen.name,
    startTime: { $gte: new Date() },
  });

  if (upcomingShows.length > 0) {
    const upcomingShowIds = upcomingShows.map((s) => s._id);
    const bookedCount = await ShowSeat.countDocuments({
      show: { $in: upcomingShowIds },
      status: 'booked',
    });
    if (bookedCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot modify screen layout: Upcoming shows have confirmed customer bookings',
      });
    }
  }

  if (name) screen.name = name;
  if (rows && rows.length > 0) {
    screen.rows = rows.map((r, idx) => ({
      label: r.label || String.fromCharCode(65 + idx),
      category: r.category ? r.category.toUpperCase() : 'REGULAR',
      layout: r.layout || 'LLLLLLL_RRRRRRR',
      start: r.start || 1,
      spaceAfter: r.spaceAfter !== undefined ? r.spaceAfter : 7,
      seats:
        r.seats && r.seats.length > 0
          ? r.seats
          : Array.from({ length: 14 }, (_, i) => ({ number: i + 1 })),
    }));
  }

  await screen.save();

  res.status(200).json({
    success: true,
    message: 'Screen layout updated successfully',
    data: screen,
  });
});

// @desc    Decommission / delete screen
// @route   DELETE /api/v1/theater-admin/screens/:screenId
exports.deleteScreen = asyncHandler(async (req, res) => {
  const { screenId } = req.params;
  const screen = await Screen.findByIdAndDelete(screenId);

  if (!screen) {
    return res.status(404).json({
      success: false,
      message: 'Screen not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Screen successfully decommissioned',
  });
});

// ==========================================
// 5.4 SHOWTIME SCHEDULING & CONFLICT PREVENTION ENGINE
// ==========================================

// @desc    Schedule a new show with collision detection and auto seat inventory generation
// @route   POST /api/v1/theater-admin/shows
exports.createShow = asyncHandler(async (req, res) => {
  const theaterId = (await resolveTheaterId(req)) || req.body.theaterId;
  const {
    movieId,
    screenName,
    showDate,
    startTime,
    categoryPricing,
  } = req.body;

  if (!movieId || !screenName || !startTime || !categoryPricing) {
    return res.status(400).json({
      success: false,
      message:
        'Movie ID, screen name, start time, and category pricing are required',
    });
  }

  // 1. Fetch movie details for duration
  const movie = await Movie.findById(movieId);
  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found in catalog',
    });
  }

  const movieDuration = movie.duration || 120; // in minutes
  const cleaningBuffer = 20; // 20 minutes buffer
  const totalOccupiedMinutes = movieDuration + cleaningBuffer;

  const start = new Date(startTime);
  const endWithBuffer = new Date(start.getTime() + totalOccupiedMinutes * 60 * 1000);

  // 2. Collision Detection: Find existing shows in the same auditorium
  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(start);
  dayEnd.setHours(23, 59, 59, 999);

  const existingShows = await Show.find({
    theater: theaterId,
    screenName,
    startTime: { $gte: dayStart, $lte: dayEnd },
  }).populate('movie', 'duration title');

  // Check overlap: [start, endWithBuffer] overlaps with [existingStart, existingEndWithBuffer]
  for (const existing of existingShows) {
    const existingDuration = existing.movie?.duration || 120;
    const existingStart = new Date(existing.startTime);
    const existingEnd = new Date(
      existingStart.getTime() + (existingDuration + cleaningBuffer) * 60 * 1000
    );

    // Overlap condition: start < existingEnd AND endWithBuffer > existingStart
    if (start < existingEnd && endWithBuffer > existingStart) {
      return res.status(409).json({
        success: false,
        message: `Auditorium collision: Overlaps with screening of "${
          existing.movie?.title || 'Another Movie'
        }" (${existingStart.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })} - ${existingEnd.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}) including 20 min interval buffer`,
        conflict: {
          movieTitle: existing.movie?.title,
          startTime: existingStart,
          endTimeWithBuffer: existingEnd,
        },
      });
    }
  }

  // 3. Query Screen layout to instantiate seat inventory
  const screen = await Screen.findOne({ theater: theaterId, name: screenName });
  if (!screen || !screen.rows || screen.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: `Screen layout configuration for "${screenName}" not found in this theater`,
    });
  }

  // Build category price lookup
  const priceMap = new Map();
  categoryPricing.forEach((cp) => {
    priceMap.set(cp.category.toUpperCase(), Number(cp.price));
  });

  const defaultPrice =
    categoryPricing.length > 0 ? Number(categoryPricing[0].price) : 200;

  // 4. Create Show document
  const show = await Show.create({
    movie: movieId,
    theater: theaterId,
    screenName,
    showDate: showDate ? new Date(showDate) : start,
    startTime: start,
    categoryPricing,
  });

  // 5. Auto-generate ShowSeat documents for all seats in screen
  const seatDocs = [];
  screen.rows.forEach((row) => {
    const rowCategory = (row.category || 'REGULAR').toUpperCase();
    const seatPrice = priceMap.get(rowCategory) || defaultPrice;

    (row.seats || []).forEach((seat) => {
      const seatId = `${row.label}${seat.number}`;
      seatDocs.push({
        show: show._id,
        seatId,
        status: 'available',
        price: seatPrice,
      });
    });
  });

  if (seatDocs.length > 0) {
    await ShowSeat.insertMany(seatDocs);
  }

  res.status(201).json({
    success: true,
    message: 'Show scheduled and seat inventory successfully generated',
    data: {
      showId: show._id,
      movieTitle: movie.title,
      screenName: show.screenName,
      startTime: show.startTime,
      endTimeWithBuffer: endWithBuffer,
      totalSeatsGenerated: seatDocs.length,
      categoryPricing: show.categoryPricing,
    },
  });
});

// @desc    List shows scheduled in theater with filters
// @route   GET /api/v1/theater-admin/shows
exports.getShows = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);
  const { date, screenName, movieId } = req.query;

  const filter = { theater: theaterId };
  if (screenName) filter.screenName = screenName;
  if (movieId) filter.movie = movieId;

  if (date) {
    const dStart = new Date(date);
    dStart.setHours(0, 0, 0, 0);
    const dEnd = new Date(date);
    dEnd.setHours(23, 59, 59, 999);
    filter.startTime = { $gte: dStart, $lte: dEnd };
  }

  const shows = await Show.find(filter)
    .populate('movie', 'title poster duration censorRating')
    .sort({ startTime: 1 })
    .lean();

  // Attach booked seats count for each show
  const enriched = await Promise.all(
    shows.map(async (s) => {
      const [total, booked] = await Promise.all([
        ShowSeat.countDocuments({ show: s._id }),
        ShowSeat.countDocuments({ show: s._id, status: 'booked' }),
      ]);
      return {
        ...s,
        totalSeats: total,
        bookedSeatsCount: booked,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: enriched.length,
    data: enriched,
  });
});

// @desc    Cancel an upcoming show
// @route   DELETE /api/v1/theater-admin/shows/:showId
exports.deleteShow = asyncHandler(async (req, res) => {
  const { showId } = req.params;

  const show = await Show.findById(showId);
  if (!show) {
    return res.status(404).json({
      success: false,
      message: 'Show not found',
    });
  }

  // Remove associated ShowSeats
  await ShowSeat.deleteMany({ show: showId });
  await Show.findByIdAndDelete(showId);

  res.status(200).json({
    success: true,
    message: 'Show screening and seat inventory successfully cancelled',
  });
});

// ==========================================
// 5.5 CATEGORY PRICING & DYNAMIC PRICING
// ==========================================

// @desc    Update ticket category prices for a show
// @route   PATCH /api/v1/theater-admin/shows/:showId/pricing
exports.updateCategoryPricing = asyncHandler(async (req, res) => {
  const { showId } = req.params;
  const { categoryPricing } = req.body;

  if (!categoryPricing || !Array.isArray(categoryPricing)) {
    return res.status(400).json({
      success: false,
      message: 'categoryPricing array is required',
    });
  }

  const show = await Show.findById(showId);
  if (!show) {
    return res.status(404).json({
      success: false,
      message: 'Show not found',
    });
  }

  show.categoryPricing = categoryPricing;
  await show.save();

  // Find screen layout to map row categories to seats
  const screen = await Screen.findOne({
    theater: show.theater,
    name: show.screenName,
  });

  if (screen && screen.rows) {
    const priceMap = new Map();
    categoryPricing.forEach((cp) => {
      priceMap.set(cp.category.toUpperCase(), Number(cp.price));
    });

    const bulkOps = [];
    screen.rows.forEach((row) => {
      const cat = (row.category || 'REGULAR').toUpperCase();
      const newPrice = priceMap.get(cat);
      if (newPrice !== undefined) {
        (row.seats || []).forEach((seat) => {
          const seatId = `${row.label}${seat.number}`;
          bulkOps.push({
            updateMany: {
              filter: {
                show: show._id,
                seatId,
                status: { $in: ['available', 'blocked'] },
              },
              update: { $set: { price: newPrice } },
            },
          });
        });
      }
    });

    if (bulkOps.length > 0) {
      await ShowSeat.bulkWrite(bulkOps);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Show category pricing updated successfully',
    data: show,
  });
});

// ==========================================
// 5.6 REAL-TIME SEAT INVENTORY & MAINTENANCE BLOCKING
// ==========================================

// @desc    Inspect real-time seat status grid for theater manager
// @route   GET /api/v1/theater-admin/shows/:showId/inventory
exports.getShowInventory = asyncHandler(async (req, res) => {
  const { showId } = req.params;

  const show = await Show.findById(showId)
    .populate('movie', 'title poster duration')
    .populate('theater', 'name city')
    .lean();

  if (!show) {
    return res.status(404).json({
      success: false,
      message: 'Show not found',
    });
  }

  const screen = await Screen.findOne({
    theater: show.theater._id,
    name: show.screenName,
  }).lean();

  const seats = await ShowSeat.find({ show: showId }).lean();

  // Fetch bookings for this show to enrich booked customer names
  const bookings = await Booking.find({ show: showId, status: 'confirmed' })
    .populate('user', 'name mobileNo email')
    .lean();

  const customerMap = new Map();
  bookings.forEach((b) => {
    const custName = b.user?.name || 'Customer';
    (b.seats || []).forEach((s) => {
      customerMap.set(s.seatId, custName);
    });
  });

  const now = new Date();
  let available = 0;
  let locked = 0;
  let booked = 0;
  let blocked = 0;

  const enrichedSeats = seats.map((s) => {
    let effectiveStatus = s.status;
    if (
      s.status === 'locked' &&
      s.lockedExpiresAt &&
      new Date(s.lockedExpiresAt) < now
    ) {
      effectiveStatus = 'available';
    }

    if (effectiveStatus === 'available') available++;
    else if (effectiveStatus === 'locked') locked++;
    else if (effectiveStatus === 'booked') booked++;
    else if (effectiveStatus === 'blocked') blocked++;

    return {
      seatId: s.seatId,
      status: effectiveStatus,
      price: s.price,
      blockReason: s.blockReason || null,
      customerName: customerMap.get(s.seatId) || null,
    };
  });

  res.status(200).json({
    success: true,
    data: {
      showId: show._id,
      movieTitle: show.movie?.title,
      screenName: show.screenName,
      startTime: show.startTime,
      summary: {
        total: seats.length,
        available,
        locked,
        booked,
        blocked,
      },
      rowsLayout: screen ? screen.rows : [],
      seats: enrichedSeats,
    },
  });
});

// @desc    Block maintenance / VIP seats from customer discovery pool
// @route   POST /api/v1/theater-admin/shows/:showId/seats/block
exports.blockSeats = asyncHandler(async (req, res) => {
  const { showId } = req.params;
  const { seatIds, reason } = req.body;

  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'seatIds array is required',
    });
  }

  // Check if any seat is already booked
  const bookedSeats = await ShowSeat.find({
    show: showId,
    seatId: { $in: seatIds },
    status: 'booked',
  });

  if (bookedSeats.length > 0) {
    return res.status(409).json({
      success: false,
      message: `Cannot block seats that are already booked: ${bookedSeats
        .map((s) => s.seatId)
        .join(', ')}`,
    });
  }

  await ShowSeat.updateMany(
    { show: showId, seatId: { $in: seatIds } },
    {
      $set: {
        status: 'blocked',
        blockReason: reason || 'Maintenance Hold',
        lockedBy: null,
        lockedExpiresAt: null,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: 'Seats successfully blocked from customer discovery',
    blockedSeats: seatIds,
  });
});

// @desc    Restore blocked seats back to 'available'
// @route   POST /api/v1/theater-admin/shows/:showId/seats/unblock
exports.unblockSeats = asyncHandler(async (req, res) => {
  const { showId } = req.params;
  const { seatIds } = req.body;

  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'seatIds array is required',
    });
  }

  await ShowSeat.updateMany(
    { show: showId, seatId: { $in: seatIds }, status: 'blocked' },
    {
      $set: {
        status: 'available',
        blockReason: null,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: 'Seats restored to available pool',
    unblockedSeats: seatIds,
  });
});

// ==========================================
// 5.7 BOX OFFICE & QR TICKET VERIFICATION SCANNER
// ==========================================

// @desc    Verify QR code or Booking ID for gate admission
// @route   POST /api/v1/theater-admin/check-in/verify
exports.verifyTicket = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID is required',
    });
  }

  // Search by bookingId (Razorpay order ID, custom code, or MongoDB _id)
  let query = { bookingId: bookingId.trim() };
  if (mongoose.Types.ObjectId.isValid(bookingId.trim())) {
    query = {
      $or: [{ bookingId: bookingId.trim() }, { _id: bookingId.trim() }],
    };
  }

  const booking = await Booking.findOne(query)
    .populate('movie', 'title poster duration')
    .populate('theater', 'name city')
    .populate('show', 'startTime showDate screenName')
    .populate('user', 'name mobileNo email');

  if (!booking) {
    return res.status(404).json({
      success: false,
      valid: false,
      message: 'Invalid ticket QR code / Booking reference not found',
    });
  }

  // Verify theater scoping (unless super admin)
  if (
    req.user.role !== 'admin' &&
    theaterId &&
    booking.theater &&
    booking.theater._id.toString() !== theaterId.toString()
  ) {
    return res.status(403).json({
      success: false,
      valid: false,
      message: `Ticket belongs to a different theater (${booking.theater.name}, ${booking.theater.city})!`,
    });
  }

  // Check if already checked in
  if (booking.isCheckedIn) {
    return res.status(409).json({
      success: false,
      valid: false,
      alreadyCheckedIn: true,
      message: 'ALREADY CHECKED IN! Ticket has already been used.',
      checkedInAt: booking.checkedInAt,
      data: {
        bookingId: booking.bookingId,
        movieTitle: booking.movie?.title,
        customerName: booking.user?.name || 'Customer',
        seats: booking.seats,
      },
    });
  }

  res.status(200).json({
    success: true,
    valid: true,
    data: {
      bookingId: booking.bookingId,
      movieTitle: booking.movie?.title || 'Pushpa 2',
      moviePoster: booking.movie?.poster,
      screenName: booking.screenName || booking.show?.screenName || 'Screen 1',
      showDate: booking.showDate || booking.show?.showDate,
      showTime: booking.show?.startTime,
      seats: booking.seats || [],
      totalSeats: booking.pricing?.totalSeats || (booking.seats ? booking.seats.length : 0),
      customerName: booking.user?.name || 'Walk-in Guest',
      customerMobile: booking.user?.mobileNo,
      paymentStatus: booking.paymentsDetails?.status || 'success',
      isCheckedIn: false,
    },
  });
});

// @desc    Mark ticket as admitted at gate
// @route   POST /api/v1/theater-admin/check-in/admit
exports.admitTicket = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  let query = { bookingId: bookingId.trim() };
  if (mongoose.Types.ObjectId.isValid(bookingId.trim())) {
    query = {
      $or: [{ bookingId: bookingId.trim() }, { _id: bookingId.trim() }],
    };
  }

  const booking = await Booking.findOne(query);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  if (booking.isCheckedIn) {
    return res.status(409).json({
      success: false,
      message: 'Patron is already admitted!',
      checkedInAt: booking.checkedInAt,
    });
  }

  booking.isCheckedIn = true;
  booking.checkedInAt = new Date();
  booking.checkedInBy = req.user ? req.user.id : null;
  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Patron successfully admitted',
    bookingId: booking.bookingId,
    admittedSeats: (booking.seats || []).map((s) => s.seatId),
    checkedInAt: booking.checkedInAt,
  });
});

// @desc    Direct Box Office offline booking (CASH / CARD / UPI)
// @route   POST /api/v1/theater-admin/box-office/book
exports.bookBoxOffice = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);
  const {
    showId,
    seats, // [{ seatId, price, category, row, number }]
    customerName,
    customerMobile,
    paymentMethod = 'CASH',
  } = req.body;

  if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Show ID and seats array are required',
    });
  }

  const show = await Show.findById(showId)
    .populate('movie')
    .populate('theater');

  if (!show) {
    return res.status(404).json({
      success: false,
      message: 'Show not found',
    });
  }

  const seatIds = seats.map((s) => s.seatId);

  // Verify none are booked
  const unavailableSeats = await ShowSeat.find({
    show: showId,
    seatId: { $in: seatIds },
    status: { $in: ['booked', 'blocked'] },
  });

  if (unavailableSeats.length > 0) {
    return res.status(409).json({
      success: false,
      message: `Selected seats are unavailable: ${unavailableSeats
        .map((s) => s.seatId)
        .join(', ')}`,
    });
  }

  const seatsTotal = seats.reduce((sum, s) => sum + Number(s.price || 200), 0);
  const boxOfficeBookingId = `BOX_${Date.now().toString(36).toUpperCase()}`;

  // Create booking with zero convenience fee
  const booking = await Booking.create({
    bookingId: boxOfficeBookingId,
    user: null, // offline guest
    movie: show.movie._id,
    theater: show.theater._id,
    show: show._id,
    screenName: show.screenName,
    showDate: show.showDate,
    showTime: show.startTime,
    seats: seats.map((s) => ({
      seatId: s.seatId,
      row: s.row || s.seatId.charAt(0),
      number: s.number || s.seatId.slice(1),
      category: s.category || 'REGULAR',
      price: Number(s.price || 200),
    })),
    pricing: {
      seatsTotal,
      convenienceFee: 0,
      totalAmount: seatsTotal,
      totalSeats: seats.length,
    },
    paymentsDetails: {
      paymentMethod,
      status: 'success',
      razorPayPaymentId: `OFFLINE_${paymentMethod}_${Date.now()}`,
    },
    status: 'confirmed',
    isCheckedIn: true, // Auto check-in for walk-in counter tickets
    checkedInAt: new Date(),
    checkedInBy: req.user ? req.user.id : null,
  });

  // Mark ShowSeats as booked
  await ShowSeat.updateMany(
    { show: showId, seatId: { $in: seatIds } },
    {
      $set: {
        status: 'booked',
        lockedBy: null,
        lockedExpiresAt: null,
      },
    }
  );

  res.status(201).json({
    success: true,
    message: 'Box office tickets booked successfully',
    bookingId: booking.bookingId,
    receipt: {
      bookingId: booking.bookingId,
      movieTitle: show.movie.title,
      screenName: show.screenName,
      showTime: show.startTime,
      seats: seatIds,
      totalAmount: seatsTotal,
      convenienceFee: 0,
      paymentMethod,
      customerName: customerName || 'Walk-in Guest',
      customerMobile: customerMobile || '',
      issuedAt: new Date(),
    },
  });
});

// ==========================================
// 5.8 THEATER SALES, OCCUPANCY & SETTLEMENT LEDGER
// ==========================================

// @desc    Get filterable bookings for this theater
// @route   GET /api/v1/theater-admin/bookings
exports.getTheaterBookings = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);
  const { showId, movieId, date, search, page = 1, limit = 20 } = req.query;

  const filter = { theater: theaterId };
  if (showId) filter.show = showId;
  if (movieId) filter.movie = movieId;
  if (date) {
    const dStart = new Date(date);
    dStart.setHours(0, 0, 0, 0);
    const dEnd = new Date(date);
    dEnd.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: dStart, $lte: dEnd };
  }
  if (search) {
    filter.bookingId = { $regex: search, $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('movie', 'title poster')
      .populate('user', 'name mobileNo email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Booking.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: bookings.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    page: Number(page),
    data: bookings,
  });
});

// @desc    Occupancy report for auditoriums
// @route   GET /api/v1/theater-admin/reports/occupancy
exports.getOccupancyReport = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);

  if (!theaterId) {
    return res.status(200).json({
      success: true,
      data: {
        overallOccupancy: 0,
        screensBreakdown: [],
        peakHourSlot: 'N/A',
      },
    });
  }

  const screens = await Screen.find({ theater: theaterId }).lean();
  const shows = await Show.find({ theater: theaterId }).lean();

  const screenMetrics = await Promise.all(
    screens.map(async (screen) => {
      const screenShows = shows.filter((s) => s.screenName === screen.name);
      const showIds = screenShows.map((s) => s._id);

      let totalSeats = 0;
      let bookedSeats = 0;

      if (showIds.length > 0) {
        const stats = await ShowSeat.aggregate([
          { $match: { show: { $in: showIds } } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        stats.forEach((st) => {
          totalSeats += st.count;
          if (st._id === 'booked') bookedSeats += st.count;
        });
      }

      const averageOccupancy =
        totalSeats > 0 ? Number(((bookedSeats / totalSeats) * 100).toFixed(1)) : 0;

      return {
        screenName: screen.name,
        totalShows: screenShows.length,
        totalSeatsConfigured: screen.rows
          ? screen.rows.reduce(
              (acc, r) => acc + (r.seats ? r.seats.length : 0),
              0
            )
          : 0,
        averageOccupancy,
      };
    })
  );

  const overallAvg =
    screenMetrics.length > 0
      ? Number(
          (
            screenMetrics.reduce((sum, s) => sum + s.averageOccupancy, 0) /
            screenMetrics.length
          ).toFixed(1)
        )
      : 0;

  res.status(200).json({
    success: true,
    data: {
      overallOccupancy: overallAvg,
      screensBreakdown: screenMetrics,
      peakHourSlot: '18:00 - 21:00',
    },
  });
});

// @desc    Partner settlement report
// @route   GET /api/v1/theater-admin/reports/payouts
exports.getPayoutReport = asyncHandler(async (req, res) => {
  const theaterId = await resolveTheaterId(req);

  if (!theaterId) {
    return res.status(200).json({
      success: true,
      data: {
        currentPeriod: new Date().toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
        grossTicketCollection: 0,
        platformFeeWithheld: 0,
        netPartnerDisbursement: 0,
        disbursementsHistory: [],
      },
    });
  }

  // Total gross ticket collection
  const bookingAgg = await Booking.aggregate([
    {
      $match: {
        theater: new mongoose.Types.ObjectId(theaterId.toString()),
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: null,
        grossTicketCollection: { $sum: '$pricing.seatsTotal' },
        platformFeeWithheld: { $sum: '$pricing.convenienceFee' },
      },
    },
  ]);

  const gross = bookingAgg[0]?.grossTicketCollection || 0;
  const platformFee = Math.round(gross * 0.16); // 16% withholding
  const netPartnerDisbursement = gross - platformFee;

  const settlements = await Settlement.find({ theater: theaterId })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: {
      currentPeriod: new Date().toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      grossTicketCollection: gross,
      platformFeeWithheld: platformFee,
      netPartnerDisbursement,
      disbursementsHistory: settlements,
    },
  });
});
