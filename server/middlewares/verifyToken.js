const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

const verifyToken = (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required: No token provided',
      });
    }

    const decoded = jwt.verify(token, config.token.jwtSecretString);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token',
      error: error.message,
    });
  }
};

module.exports = verifyToken;



