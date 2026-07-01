/**
 * routes/startupRoutes.js
 * Startup Idea API routes (all protected).
 */

const express = require('express');
const router = express.Router();
const { createStartup, getStartups, getStartupById } = require('../controllers/startupController');
const { createStartupValidation } = require('../validations/startupValidation');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// All startup routes require authentication
router.use(protect);

// POST /api/startups
router.post('/', createStartupValidation, validate, createStartup);

// GET /api/startups
router.get('/', getStartups);

// GET /api/startups/:id
router.get('/:id', getStartupById);

// TODO: V2 — Add routes for:
//   PATCH  /api/startups/:id         (update startup)
//   DELETE /api/startups/:id         (delete startup)
//   POST   /api/startups/:id/bookmark
//   POST   /api/startups/:id/share
//   GET    /api/startups/public      (public sharing feed)

module.exports = router;
