//getScreenByTheater  /api/screen/theater/:thearterId
const Screen = require('../models/ScreenModel.js');
const asyncHandler = require('express-async-handler');

exports.getScreenByTheater = asyncHandler(async (req, res) => {
  const { theaterId } = req.params;
  const screens = await Screen.find({ theater: theaterId });
  res.status(200).json({
    success: true,
    data: screens,
  });
});
//updateScreen
//createScreen
//getScreenById
//deactivateScreen
