/**
 * models/ValidationReport.js
 * Mongoose schema for full validation reports generated per startup idea.
 * Contains AI analysis, scoring results, and competitor references.
 */

const mongoose = require('mongoose');
const { VALIDATION_STATUS } = require('../constants');

// ─── Sub-schema: AI Analysis ──────────────────────────────────────────────────
const aiAnalysisSchema = new mongoose.Schema(
  {
    summary: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    pitch: { type: String, default: '' },
    // Enriched AI analysis fields
    swotAnalysis: {
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      opportunities: { type: [String], default: [] },
      threats: { type: [String], default: [] },
    },
    marketOpportunity: { type: String, default: '' },
    riskAnalysis: { type: [String], default: [] },
    revenueModels: { type: [String], default: [] },
    goToMarketStrategy: { type: [String], default: [] },
  },
  { _id: false }
);

// ─── Sub-schema: Scores ───────────────────────────────────────────────────────
const scoresSchema = new mongoose.Schema(
  {
    problemScore: { type: Number, min: 0, max: 100, default: 0 },
    competitorScore: { type: Number, min: 0, max: 100, default: 0 },
    urgencyScore: { type: Number, min: 0, max: 100, default: 0 },
    mvpScore: { type: Number, min: 0, max: 100, default: 0 },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────────────────────
const validationReportSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StartupIdea',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(VALIDATION_STATUS),
      default: VALIDATION_STATUS.PENDING,
    },
    aiAnalysis: {
      type: aiAnalysisSchema,
      default: () => ({}),
    },
    scores: {
      type: scoresSchema,
      default: () => ({}),
    },
    competitors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competitor',
      },
    ],
    errorMessage: {
      type: String, // Stores error if validation failed
    },
    // TODO: V2 — Add fields for:
    //   - investorReadinessScore
    //   - financialProjections
    //   - pdfReportUrl (for PDF Export feature)
    //   - isShared (for public sharing)
    //   - shareToken (for link-based sharing)
    //   - version (for tracking re-validations)
  },
  {
    timestamps: true,
  }
);

// Composite index for user history queries
validationReportSchema.index({ userId: 1, createdAt: -1 });

validationReportSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const ValidationReport = mongoose.model('ValidationReport', validationReportSchema);
module.exports = ValidationReport;
