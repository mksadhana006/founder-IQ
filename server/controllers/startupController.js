/**
 * controllers/startupController.js
 * Handles CRUD operations for Startup Ideas.
 */

const StartupIdea = require('../models/StartupIdea');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { HTTP, ERROR_MESSAGES, STARTUP_STATUS } = require('../constants');
const logger = require('../utils/logger');

// ─── POST /api/startups ───────────────────────────────────────────────────────
const createStartup = async (req, res, next) => {
  try {
    const { title, problemStatement, targetUsers, keyFeatures, industry } = req.body;

    const startup = await StartupIdea.create({
      userId: req.user._id,
      title,
      problemStatement,
      targetUsers,
      keyFeatures,
      industry,
    });

    logger.info(`[StartupController] Startup created: "${title}" by user ${req.user._id}`);

    return sendSuccess(res, {
      message: 'Startup idea submitted successfully.',
      data: { startup },
      status: HTTP.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/startups ────────────────────────────────────────────────────────
const getStartups = async (req, res, next) => {
  try {
    // TODO: V2 — Add pagination, filtering, and sorting
    const startups = await StartupIdea.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, {
      message: 'Startup ideas retrieved.',
      data: { startups, count: startups.length },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/startups/:id ────────────────────────────────────────────────────
const getStartupById = async (req, res, next) => {
  try {
    const startup = await StartupIdea.findById(req.params.id).lean();

    if (!startup) {
      return sendError(res, {
        message: ERROR_MESSAGES.STARTUP.NOT_FOUND,
        status: HTTP.NOT_FOUND,
      });
    }

    // Ensure user owns this startup
    if (startup.userId.toString() !== req.user._id.toString()) {
      return sendError(res, {
        message: ERROR_MESSAGES.STARTUP.NOT_OWNER,
        status: HTTP.FORBIDDEN,
      });
    }

    return sendSuccess(res, {
      message: 'Startup idea retrieved.',
      data: { startup },
    });
  } catch (error) {
    next(error);
  }
};

// TODO: V2 — Add controllers for:
//   - updateStartup (PATCH /api/startups/:id)
//   - deleteStartup (DELETE /api/startups/:id)
//   - bookmarkStartup (POST /api/startups/:id/bookmark)
//   - shareStartup (POST /api/startups/:id/share)
//   - getPublicStartups (GET /api/startups/public) for Startup Sharing feature

module.exports = { createStartup, getStartups, getStartupById };
