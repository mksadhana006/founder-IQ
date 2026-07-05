/**
 * models/Competitor.js
 * Mongoose schema for Competitors discovered during validation.
 */

const mongoose = require('mongoose');

const competitorSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StartupIdea',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    source: {
      type: String,
      trim: true, // The search query/source that found this competitor
    },
    pricing: {
      type: String,
      trim: true,
      default: '',
    },
    targetAudience: {
      type: String,
      trim: true,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    // TODO: V2 — Add fields for:
    //   - fundingAmount
    //   - foundedYear
    //   - employeeCount
    //   - marketShare (estimated)
    //   - socialLinks
    //   - techStack
  },
  {
    timestamps: true,
  }
);

competitorSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Competitor = mongoose.model('Competitor', competitorSchema);
module.exports = Competitor;
