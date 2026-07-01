/**
 * routes/dashboardRoutes.js
 * Dashboard and history API routes (all protected).
 */

const express = require('express');
const router = express.Router();
const { getDashboard, getHistory } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(protect);

// GET /api/dashboard
router.get('/', getDashboard);

// GET /api/history
router.get('/history', getHistory);

// TODO: V2 — Add routes for:
//   GET /api/dashboard/analytics  (chart data, trends)
//   GET /api/dashboard/bookmarks  (bookmarked ideas)
//   GET /api/dashboard/export     (export history)

module.exports = router;
