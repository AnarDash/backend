const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
  const errors = err.errors || undefined;

  res.status(statusCode).json({
    message: message,
    errors: errors,
  });
};

module.exports = errorHandler;