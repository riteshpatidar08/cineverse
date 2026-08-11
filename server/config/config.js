const dotenv = require('dotenv');

dotenv.config();

const config = {
  app: { port: process.env.PORT },
  db: { mongodbURI: process.env.MONGODB_URI },
  token: {
    jwtSecretString: process.env.JWT_SECRET_STRING,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
};
module.exports = config ;
