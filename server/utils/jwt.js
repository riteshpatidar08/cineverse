const jwt = require('jsonwebtoken');

const config = require('../config/config.js');

function generateToken(payload, expiresIn) {
  return jwt.sign(payload, config.token.jwtSecretString, {
    expiresIn: expiresIn,
  });
}

module.exports = generateToken;
