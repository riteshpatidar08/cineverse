const colors = require('colors');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const dbConnect = require('./config/db.js');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes.js');
const movieRoutes = require('./routes/movieRoutes.js')
const errorHandler = require('./middlewares/errorHandler.js');
const cors = require('cors')
//NOTE sync the .env files variables in process.env
app.use(cors(
  {origin : "http://localhost:5173" , 
    credentials : true
  }
));
dotenv.config();

if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('tiny'));
}

//NOTE connection with database
dbConnect();

app.get('/', (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Server is healthy💯💯',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server is down👎👎👎',
    });
  }
});

app.use('/api/v1/auth' , authRoutes)
app.use('/api/v1' , movieRoutes)
//Handler for the route which is not found
app.use((req, res) => {
  res.status(404).json({
    message: 'The route you hit is not found',
  });
});

//GLOBAL ERROR HANDLER
app.use(errorHandler);

module.exports = app;
