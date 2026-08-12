const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode;
  let message = err.message;

  //NOTE how to handle errors with different names
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = `Validate failed : ${err.message}`;

  } else if (err.name === 'CastError') {
    statusCode = 400;
    message: `${err.path} ${err.value}`;
  } else if (err.name === 'TokenExpiryError') {
    statusCode = 401;
    message: 'Your session has expired , Please login again';
  }

  //NOTE how to handle the errors with their code mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message: 'Record already exists';
  }

  res.status(err.status).json({
    success: false,
    error: message,
    statusCode: statusCode,
  });
};

module.exports = errorHandler;
