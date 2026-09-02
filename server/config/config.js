const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  app: { port: process.env.PORT || 8000 },
  db: { mongodbURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cineverse' },
  token: {
    jwtSecretString: process.env.JWT_SECRET_STRING || 'secret',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
};

module.exports = config;

