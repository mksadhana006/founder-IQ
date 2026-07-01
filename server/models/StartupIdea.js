/**
 * models/StartupIdea.js
 * Mongoose schema for Startup Ideas submitted by users.
 */

const mongoose = require('mongoose');
const { STARTUP_STATUS } = require('../constants');

const startupIdeaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Startup title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
      trim: true,
      minlength: [20, 'Problem statement must be at least 20 characters'],
      maxlength: [1000, 'Problem statement cannot exceed 1000 characters'],
    },
    targetUsers: {
      type: String,
      required: [true, 'Target users description is required'],
      trim: true,
      minlength: [10, 'Target users must be at least 10 characters'],
      maxlength: [500, 'Target users cannot exceed 500 characters'],
    },
    keyFeatures: {
      type: [String],
      required: [true, 'At least one key feature is required'],
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 10,
        message: 'Provide between 1 and 10 key features',
      },
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [50, 'Industry cannot exceed 50 characters'],
      // TODO: V2 — Make this an enum from a predefined industry list
    },
    status: {
      type: String,
      enum: Object.values(STARTUP_STATUS),
      default: STARTUP_STATUS.SUBMITTED,
    },
    // TODO: V2 — Add fields for:
    //   - teamMembers (for Team Collaboration module)
    //   - isPublic (for Startup Sharing feature)
    //   - bookmarks (array of userIds who bookmarked)
    //   - pitchDeckUrl (for Pitch Deck Generator)
    //   - swotAnalysis (for SWOT module)
    //   - financialForecast (for Financial Forecast module)
    //   - tags (for filtering/search)
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by user
startupIdeaSchema.index({ userId: 1, createdAt: -1 });

startupIdeaSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const StartupIdea = mongoose.model('StartupIdea', startupIdeaSchema);
module.exports = StartupIdea;
