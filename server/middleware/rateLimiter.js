/**
 * middleware/rateLimiter.js
 * API Rate Limiting middleware using express-rate-limit.
 *
 * TODO: V2 — Implement per-user rate limiting using Redis for distributed
 *             environments. Current implementation uses in-memory store
 *             which resets on server restart and doesn't work across
 *             multiple server instances.
 *
 * TODO: V2 — Add different limits for:
 *   - /api/auth routes (stricter — prevent brute force)
 *   - /api/validation routes (expensive — AI/Search API calls)
 *   - General API routes (standard)
 *   - Premium subscribers (higher limits)
 */

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter — applied to all /api routes.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again in 15 minutes.',
    errors: [],
  },
});

/**
 * Auth rate limiter — stricter limits for login/register.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    errors: [],
  },
});

/**
 * Validation rate limiter — expensive AI/Search calls.
 */
const validationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,                   // 10 validations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Validation limit reached. You can run up to 10 validations per hour.',
    errors: [],
  },
});

module.exports = { generalLimiter, authLimiter, validationLimiter };
