/**
 * services/scoring/UrgencyScore.js
 * Calculates the Market Urgency Score (0–100).
 *
 * Measures how urgent and time-sensitive the problem is.
 * High urgency = users need a solution NOW, not eventually.
 *
 * Scoring factors:
 *   - Urgency indicators in problem statement
 *   - Target user specificity and immediacy
 *   - Trending/emerging market signals in keywords
 *   - AI analysis signals (strengths/weaknesses sentiment)
 *
 * TODO: V2 — Integrate Google Trends data for real-time market urgency.
 * TODO: V2 — Use news search to validate current market activity.
 */

const URGENCY_SIGNALS = [
  'urgent', 'immediate', 'critical', 'daily', 'every day', 'constantly',
  'right now', 'desperately', 'need', 'must', 'essential', 'vital',
  'cannot', "can't", 'without', 'rely', 'depend', 'always', 'repeatedly',
];

const TREND_SIGNALS = [
  'ai', 'machine learning', 'blockchain', 'remote', 'digital', 'automation',
  'sustainability', 'climate', 'health', 'wellness', 'mental health',
  'fintech', 'edtech', 'saas', 'platform', 'marketplace', 'gig economy',
  'no-code', 'low-code', 'cloud', 'mobile', 'app',
];

/**
 * Calculate the Market Urgency Score.
 * @param {object} startup     - StartupIdea document
 * @param {object} aiAnalysis  - AI analysis result { strengths, weaknesses, suggestions }
 * @returns {number} Score between 0 and 100
 */
const calculateUrgencyScore = (startup, aiAnalysis) => {
  let score = 0;

  const problemText = (startup.problemStatement || '').toLowerCase();
  const targetText = (startup.targetUsers || '').toLowerCase();
  const allText = `${problemText} ${targetText}`;

  // ─── Factor 1: Urgency signal keywords (0–35 pts) ────────────────────────
  const urgencyFound = URGENCY_SIGNALS.filter((s) => allText.includes(s));
  score += Math.min(urgencyFound.length * 5, 35);

  // ─── Factor 2: Trending market/tech keywords (0–25 pts) ──────────────────
  const trendFound = TREND_SIGNALS.filter((s) => allText.includes(s));
  score += Math.min(trendFound.length * 5, 25);

  // ─── Factor 3: AI analysis signals (0–25 pts) ────────────────────────────
  // If AI found few weaknesses and many strengths, the idea has market fit
  if (aiAnalysis) {
    const strengthCount = (aiAnalysis.strengths || []).length;
    const weaknessCount = (aiAnalysis.weaknesses || []).length;

    if (strengthCount > 0 && weaknessCount > 0) {
      const ratio = strengthCount / (strengthCount + weaknessCount);
      score += Math.round(ratio * 25);
    } else if (strengthCount > 0) {
      score += 18;
    }
  } else {
    score += 10; // Default when no AI analysis available
  }

  // ─── Factor 4: Problem statement has quantifiable pain (0–15 pts) ────────
  // Numbers in problem statement suggest quantified, real pain
  const hasNumbers = /\d+/.test(startup.problemStatement || '');
  const hasPercentages = /%|percent/.test(problemText);
  if (hasNumbers) score += 8;
  if (hasPercentages) score += 7;

  return Math.min(Math.round(score), 100);
};

module.exports = { calculateUrgencyScore };
