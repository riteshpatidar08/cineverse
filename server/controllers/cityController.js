const asyncHandler = require('express-async-handler');
const City = require('../models/cityModel');
const geoip = require('geoip-lite');

// @desc    Get all cities
// @route   GET /api/v1/cities
exports.getCities = asyncHandler(async (req, res) => {
  const { s } = req.query;
  const filter = {};
  if (s) {
    filter.cityName = { $regex: s, $opptions: 'i' };
  }
  const cities = await City.find(filter).sort({ cityName: 1 }).lean();
  res.status(200).json({
    success: true,
    count: cities.length,
    data: cities,
  });
});

exports.getLocation = async (req, res) => {
  try {
    const { s } = req.query;
    const cities = await City.find({ cityName: { $regex: s || '', $options: 'i' } }).lean();
    const geo = geoip.lookup('207.97.227.239');
    res.status(200).json({
      success: true,
      cities,
      geo,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
