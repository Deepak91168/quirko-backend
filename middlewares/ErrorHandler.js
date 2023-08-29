const errorResponseHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};
const invalidPathHandler = (req, res, next) => {
  const error = new Error(`Invalid path - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorResponseHandler, invalidPathHandler };
