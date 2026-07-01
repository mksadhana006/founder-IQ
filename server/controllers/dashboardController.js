/**
 * controllers/dashboardController.js
 * Provides aggregated data for the user dashboard and history views.
 */

const StartupIdea = require('../models/StartupIdea');
const ValidationReport = require('../models/ValidationReport');
const { sendSuccess } = require('../utils/responseHelper');
const logger = require('../utils/logger');

// ─── GET /api/dashboard ───────────────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Run queries in parallel for performance
    const [startups, reports] = await Promise.all([
      StartupIdea.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
      ValidationReport.find({ userId, status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('startupId', 'title industry')
        .lean(),
    ]);

    // Aggregate stats
    const totalStartups = await StartupIdea.countDocuments({ userId });
    const totalValidations = await ValidationReport.countDocuments({ userId, status: 'completed' });

    // Calculate average overall score from recent reports
    const avgScore =
      reports.length > 0
        ? Math.round(
            reports.reduce((sum, r) => sum + (r.scores?.overallScore || 0), 0) / reports.length
          )
        : 0;

    // Find best performing startup
    const bestReport = reports.reduce(
      (best, r) => ((r.scores?.overallScore || 0) > (best?.scores?.overallScore || 0) ? r : best),
      null
    );

    logger.info(`[DashboardController] Dashboard fetched for user: ${userId}`);

    return sendSuccess(res, {
      message: 'Dashboard data retrieved.',
      data: {
        stats: {
          totalStartups,
          totalValidations,
          avgScore,
          bestScore: bestReport?.scores?.overallScore || 0,
          bestStartup: bestReport?.startupId?.title || null,
        },
        recentStartups: startups,
        recentReports: reports,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/history ─────────────────────────────────────────────────────────
const getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // TODO: V2 — Add pagination support (page, limit query params)
    // TODO: V2 — Add filtering by date range, score range, status
    const reports = await ValidationReport.find({ userId })
      .sort({ createdAt: -1 })
      .populate('startupId', 'title industry problemStatement')
      .lean();

    return sendSuccess(res, {
      message: 'Validation history retrieved.',
      data: { reports, count: reports.length },
    });
  } catch (error) {
    next(error);
  }
};

// TODO: V2 — Add:
//   - getAnalyticsDashboard (aggregated charts data)
//   - getBookmarkedIdeas
//   - exportHistory (CSV/PDF)

module.exports = { getDashboard, getHistory };
