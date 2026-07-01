/**
 * services/scoring/OverallScore.js
 * Combines all individual scores into a final Overall Startup Validation Score.
 *
 * This is the ONLY place where individual scores are combined.
 * Weights are defined in constants/index.js for easy adjustment.
 *
 * TODO: V2 — Add investor readiness score component.
 * TODO: V2 — Add financial viability score component.
 * TODO: V2 — Support custom weight configurations per user plan.
 */

const { SCORE_WEIGHTS, SCORE_LABELS } = require('../../constants');
const { calculateProblemScore } = require('./ProblemScore');
const { calculateCompetitorScore } = require('./CompetitorScore');
const { calculateUrgencyScore } = require('./UrgencyScore');
const { calculateMVPScore } = require('./MVPScore');

/**
 * Calculate all scores and combine into the overall validation score.
 * @param {object} startup     - StartupIdea document
 * @param {Array}  competitors - Parsed competitor objects
 * @param {object} aiAnalysis  - AI analysis result
 * @returns {object} All scores: { problemScore, competitorScore, urgencyScore, mvpScore, overallScore }
 */
const calculateAllScores = (startup, competitors, aiAnalysis) => {
  const problemScore = calculateProblemScore(startup);
  const competitorScore = calculateCompetitorScore(startup, competitors);
  const urgencyScore = calculateUrgencyScore(startup, aiAnalysis);
  const mvpScore = calculateMVPScore(startup);

  // Weighted overall score
  const overallScore = Math.round(
    problemScore * SCORE_WEIGHTS.problem +
    competitorScore * SCORE_WEIGHTS.competitor +
    urgencyScore * SCORE_WEIGHTS.urgency +
    mvpScore * SCORE_WEIGHTS.mvp
  );

  return {
    problemScore,
    competitorScore,
    urgencyScore,
    mvpScore,
    overallScore: Math.min(overallScore, 100),
  };
};

/**
 * Get a human-readable label for a score value.
 * @param {number} score - Score between 0 and 100
 * @returns {object} { label, color }
 */
const getScoreLabel = (score) => {
  if (score >= SCORE_LABELS.EXCELLENT.min) return SCORE_LABELS.EXCELLENT;
  if (score >= SCORE_LABELS.GOOD.min) return SCORE_LABELS.GOOD;
  if (score >= SCORE_LABELS.AVERAGE.min) return SCORE_LABELS.AVERAGE;
  return SCORE_LABELS.POOR;
};

module.exports = { calculateAllScores, getScoreLabel };
