/**
 * controllers/validationController.js
 * Orchestrates the full startup validation pipeline:
 *   1. Fetch startup idea
 *   2. Run AI analysis (Gemini)
 *   3. Search for competitors (Tavily)
 *   4. Save competitors to DB
 *   5. Calculate all scores
 *   6. Save and return the validation report
 */

const mongoose = require('mongoose');
const StartupIdea = require('../models/StartupIdea');
const ValidationReport = require('../models/ValidationReport');
const Competitor = require('../models/Competitor');
const { analyzeStartup } = require('../services/ai/geminiService');
const { searchCompetitors } = require('../services/search/tavilyService');
const { calculateAllScores } = require('../services/scoring/OverallScore');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { HTTP, ERROR_MESSAGES, VALIDATION_STATUS, STARTUP_STATUS } = require('../constants');
const logger = require('../utils/logger');

// ─── POST /api/validation/:startupId ─────────────────────────────────────────
const runValidation = async (req, res, next) => {
  const { startupId } = req.params;
  let report = null;

  // Validate ObjectId format before DB query
  if (!mongoose.Types.ObjectId.isValid(startupId)) {
    return sendError(res, { message: 'Invalid startup ID format.', status: HTTP.BAD_REQUEST });
  }

  try {
    // 1. Fetch and authorize startup
    const startup = await StartupIdea.findById(startupId);
    if (!startup) {
      return sendError(res, { message: ERROR_MESSAGES.STARTUP.NOT_FOUND, status: HTTP.NOT_FOUND });
    }
    if (startup.userId.toString() !== req.user._id.toString()) {
      return sendError(res, { message: ERROR_MESSAGES.STARTUP.NOT_OWNER, status: HTTP.FORBIDDEN });
    }

    // 2. Create a pending report immediately (so client can poll if needed)
    report = await ValidationReport.create({
      startupId: startup._id,
      userId: req.user._id,
      status: VALIDATION_STATUS.IN_PROGRESS,
    });

    logger.info(`[ValidationController] Starting validation pipeline for startup: "${startup.title}"`);

    // 3. Run AI analysis and competitor search in PARALLEL for speed
    const [aiAnalysis, rawCompetitors] = await Promise.allSettled([
      analyzeStartup(startup),
      searchCompetitors(startup),
    ]);

    // Extract results gracefully — don't fail if one service fails
    const analysis = aiAnalysis.status === 'fulfilled' ? aiAnalysis.value : {
      summary: 'AI analysis temporarily unavailable.',
      strengths: [],
      weaknesses: [],
      suggestions: [],
      pitch: '',
      swotAnalysis: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      marketOpportunity: '',
      riskAnalysis: [],
      revenueModels: [],
      goToMarketStrategy: [],
    };

    const competitors = rawCompetitors.status === 'fulfilled' ? rawCompetitors.value : [];

    if (aiAnalysis.status === 'rejected') {
      logger.error(`[ValidationController] AI analysis failed: ${aiAnalysis.reason?.message}`);
    }
    if (rawCompetitors.status === 'rejected') {
      logger.error(`[ValidationController] Search failed: ${rawCompetitors.reason?.message}`);
    }

    // 4. Save competitors to DB
    let savedCompetitors = [];
    if (competitors.length > 0) {
      savedCompetitors = await Competitor.insertMany(competitors, { ordered: false });
      logger.info(`[ValidationController] Saved ${savedCompetitors.length} competitors.`);
    }

    // 5. Calculate all scores (pure JS — no AI involvement)
    const scores = calculateAllScores(startup, competitors, analysis);
    logger.info(`[ValidationController] Scores calculated: ${JSON.stringify(scores)}`);

    // 6. Update the report with full results
    report = await ValidationReport.findByIdAndUpdate(
      report._id,
      {
        status: VALIDATION_STATUS.COMPLETED,
        aiAnalysis: analysis,
        scores,
        competitors: savedCompetitors.map((c) => c._id),
        errorMessage: null,
      },
      { new: true }
    ).populate('competitors');

    // 7. Update startup status
    await StartupIdea.findByIdAndUpdate(startupId, { status: STARTUP_STATUS.VALIDATED });

    logger.info(`[ValidationController] Validation COMPLETED for startup: "${startup.title}"`);

    return sendSuccess(res, {
      message: 'Startup validation completed successfully.',
      data: { report },
      status: HTTP.CREATED,
    });
  } catch (error) {
    logger.error(`[ValidationController] Validation pipeline error: ${error.message}`);

    // Mark report as failed if it was created
    if (report?._id) {
      await ValidationReport.findByIdAndUpdate(report._id, {
        status: VALIDATION_STATUS.FAILED,
        errorMessage: error.message,
      }).catch(() => {}); // Swallow update error
    }

    next(error);
  }
};

// ─── GET /api/validation/:startupId ──────────────────────────────────────────
const getValidation = async (req, res, next) => {
  try {
    const { startupId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(startupId)) {
      return sendError(res, { message: 'Invalid startup ID format.', status: HTTP.BAD_REQUEST });
    }
    // Verify startup ownership
    const startup = await StartupIdea.findById(startupId).lean();
    if (!startup) {
      return sendError(res, { message: ERROR_MESSAGES.STARTUP.NOT_FOUND, status: HTTP.NOT_FOUND });
    }
    if (startup.userId.toString() !== req.user._id.toString()) {
      return sendError(res, { message: ERROR_MESSAGES.STARTUP.NOT_OWNER, status: HTTP.FORBIDDEN });
    }

    // Get most recent completed report for this startup
    const report = await ValidationReport.findOne({
      startupId,
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate('competitors')
      .lean();

    if (!report) {
      return sendError(res, {
        message: ERROR_MESSAGES.VALIDATION.NOT_FOUND,
        status: HTTP.NOT_FOUND,
      });
    }

    return sendSuccess(res, {
      message: 'Validation report retrieved.',
      data: { report },
    });
  } catch (error) {
    next(error);
  }
};

// TODO: V2 — Add:
//   - deleteValidation (DELETE /api/validation/:id)
//   - exportValidationPDF (GET /api/validation/:id/export)
//   - shareValidation (POST /api/validation/:id/share)
//   - compareValidations (GET /api/validation/compare)

module.exports = { runValidation, getValidation };
