const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

const verifyToken = (req, res, next) => {
  console.log(req.cookies)
  if (req.cookies) {

    console.log(req.cookies);
    const token = req.cookies.token;
    try {
      const decoded = jwt.verify(token, config.token.jwtSecretString);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status().json({
        message: error.message,
      });
    }
  } else {
    return res.status(404).json({
      message: 'No token found',
    });
  }
};



module.exports = verifyToken;


