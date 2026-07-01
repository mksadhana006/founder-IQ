/**
 * middleware/auth.js
 * JWT Authentication middleware.
 * Protects routes by verifying Bearer tokens and attaching req.user.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');
const { sendError } = require('../utils/responseHelper');
const { HTTP, ERROR_MESSAGES } = require('../constants');

/**
 * protect — Middleware to verify JWT and authenticate the user.
 * Attach the authenticated user to req.user for downstream use.
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, {
        message: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED,
        status: HTTP.UNAUTHORIZED,
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? ERROR_MESSAGES.AUTH.TOKEN_EXPIRED
          : ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED;
      return sendError(res, { message, status: HTTP.UNAUTHORIZED });
    }

    // 3. Find user in DB (ensures token is still valid even if user was deleted)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendError(res, {
        message: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED,
        status: HTTP.UNAUTHORIZED,
      });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, {
      message: ERROR_MESSAGES.GENERAL.SERVER_ERROR,
      status: HTTP.INTERNAL_ERROR,
    });
  }
};

/**
 * restrictTo — Role-based access control middleware.
 * TODO: V2 — Expand with more granular permission checks.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, {
        message: ERROR_MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS,
        status: HTTP.FORBIDDEN,
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
