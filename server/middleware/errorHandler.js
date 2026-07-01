/**
 * middleware/errorHandler.js
 * Global Express error handler.
 * Catches all errors passed via next(err) and formats them
 * into the standard API response format.
 */

const logger = require('../utils/logger');
const { HTTP } = require('../constants');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP.INTERNAL_ERROR;
  let message = err.message || 'An unexpected error occurred';

  logger.error(`[${req.method}] ${req.path} → ${statusCode}: ${message}`, err.stack);

  // ─── Mongoose: Validation Error ───────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = HTTP.BAD_REQUEST;
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(statusCode).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // ─── Mongoose: Duplicate Key Error ────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = HTTP.CONFLICT;
    const field = Object.keys(err.keyValue)[0];
    message = `A record with this ${field} already exists.`;
  }

  // ─── Mongoose: Cast Error (invalid ObjectId) ──────────────────────────────
  if (err.name === 'CastError') {
    statusCode = HTTP.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ─── JWT Errors ───────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP.UNAUTHORIZED;
    message = 'Invalid authentication token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP.UNAUTHORIZED;
    message = 'Authentication token has expired. Please log in again.';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: [],
  });
};

module.exports = errorHandler;
