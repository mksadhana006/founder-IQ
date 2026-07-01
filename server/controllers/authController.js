/**
 * controllers/authController.js
 * Handles user registration, login, and profile retrieval.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { HTTP, ERROR_MESSAGES } = require('../constants');
const logger = require('../utils/logger');

/**
 * Generate a signed JWT token for a user.
 * @param {string} userId
 * @returns {string} Signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, {
        message: ERROR_MESSAGES.AUTH.EMAIL_IN_USE,
        status: HTTP.CONFLICT,
      });
    }

    // Create user (password hashing handled by User model pre-save hook)
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    logger.info(`[AuthController] New user registered: ${email}`);

    return sendSuccess(res, {
      message: 'Account created successfully. Welcome!',
      data: { token, user },
      status: HTTP.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user WITH password (select: false by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, {
        message: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        status: HTTP.UNAUTHORIZED,
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, {
        message: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        status: HTTP.UNAUTHORIZED,
      });
    }

    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toJSON();

    logger.info(`[AuthController] User logged in: ${email}`);

    return sendSuccess(res, {
      message: 'Login successful.',
      data: { token, user: userResponse },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    return sendSuccess(res, {
      message: 'User profile retrieved.',
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};

// TODO: V2 — Add controllers for:
//   - forgotPassword
//   - resetPassword
//   - verifyEmail
//   - updateProfile
//   - changePassword
//   - deleteAccount

module.exports = { register, login, getMe };
