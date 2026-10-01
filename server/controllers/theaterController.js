const asyncHandler = require('express-async-handler');
const Theater = require('../models/theaterModel.js');

// @desc    Get theaters by city or coordinates
// @route   GET /api/v1/theaters
exports.getTheaters = asyncHandler(async (req, res) => {
  const { city, lat, lon } = req.query;
  let query = {};

  if (city) {
    query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
  } else if (lat && lon) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(lon), Number(lat)],
        },
        $maxDistance: 50000,
      },
    };
  }

  let theaters = await Theater.find(query).lean();

  if (theaters.length === 0 && city) {
    // Fallback: search partial match
    theaters = await Theater.find({ city: { $regex: city.trim(), $options: 'i' } }).lean();
    if (theaters.length === 0) {
      theaters = await Theater.find().limit(10).lean();
    }
  }

  res.status(200).json({
    success: true,
    count: theaters.length,
    data: theaters,
  });
});
