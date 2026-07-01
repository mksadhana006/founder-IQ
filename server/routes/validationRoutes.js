/**
 * routes/validationRoutes.js
 * Validation API routes (all protected, rate-limited).
 */

const express = require('express');
const router = express.Router();
const { runValidation, getValidation } = require('../controllers/validationController');
const { protect } = require('../middleware/auth');
const { validationLimiter } = require('../middleware/rateLimiter');

// All validation routes require authentication
router.use(protect);

// POST /api/validation/:startupId  — Run full validation pipeline
router.post('/:startupId', validationLimiter, runValidation);

// GET /api/validation/:startupId  — Get latest validation report
router.get('/:startupId', getValidation);

// TODO: V2 — Add routes for:
//   DELETE /api/validation/:id
//   GET    /api/validation/:id/export  (PDF export)
//   POST   /api/validation/:id/share
//   GET    /api/validation/compare     (compare two reports)

module.exports = router;
