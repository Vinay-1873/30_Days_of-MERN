export const errorHandler = (err, req, res, next) => {
  // Log to console for the developer
  console.error(`Error: ${err.message}`.red || err.stack);

  // Determine the status code (default to 500 Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
    // Only show the full stack trace if we are in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error down to the errorHandler
};