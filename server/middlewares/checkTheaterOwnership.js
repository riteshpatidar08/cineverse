const Theater = require('../models/theaterModel.js');

/**
 * Middleware ensuring a 'theatreAdmin' only manages their assigned theater property.
 * Platform Admin ('admin') automatically bypasses ownership verification.
 */
const checkTheaterOwnership = async (req, res, next) => {
  try {
    // Platform Super Admin bypasses theater ownership check, attach theater context if available
    if (req.user && req.user.role === 'admin') {
      const theaterId =
        req.params?.theaterId || req.body?.theaterId || req.query?.theaterId;
      if (theaterId) {
        req.theater = await Theater.findById(theaterId);
        req.managedTheaterId = req.theater?._id;
      } else {
        const defaultTheater = await Theater.findOne();
        if (defaultTheater) {
          req.theater = defaultTheater;
          req.managedTheaterId = defaultTheater._id;
        }
      }
      return next();
    }

    const theaterId =
      req.params?.theaterId || req.body?.theaterId || req.query?.theaterId;

    if (!theaterId) {
      // If no theaterId passed in query/param, lookup theater by admin field
      const managedTheater = await Theater.findOne({ admin: req.user.id });
      if (!managedTheater) {
        return res.status(403).json({
          success: false,
          message:
            'No theater properties are assigned to your administrator account',
        });
      }
      req.managedTheaterId = managedTheater._id;
      req.theater = managedTheater;
      return next();
    }

    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({
        success: false,
        message: 'Theater property not found',
      });
    }

    if (!theater.admin || theater.admin.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message:
          'Access forbidden: You do not have permission to manage this theater',
      });
    }

    req.theater = theater;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = checkTheaterOwnership;
