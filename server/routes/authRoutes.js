/**
 * routes/authRoutes.js
 * Authentication API routes.
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/register
router.post('/register', authLimiter, registerValidation, validate, register);

// POST /api/auth/login
router.post('/login', authLimiter, loginValidation, validate, login);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

// TODO: V2 — Add routes for:
//   POST /api/auth/forgot-password
//   POST /api/auth/reset-password/:token
//   GET  /api/auth/verify-email/:token
//   PATCH /api/auth/update-profile
//   PATCH /api/auth/change-password
//   DELETE /api/auth/delete-account

module.exports = router;
