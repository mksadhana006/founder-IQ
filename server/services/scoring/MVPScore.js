/**
 * services/scoring/MVPScore.js
 * Calculates the MVP Readiness Score (0–100).
 *
 * Measures how ready this idea is to build a Minimum Viable Product.
 * A good MVP has: clear core features, defined users, and manageable scope.
 *
 * Scoring factors:
 *   - Number and quality of key features listed
 *   - Feature clarity and specificity
 *   - User persona clarity
 *   - Scope appropriateness (not too broad, not too narrow)
 *
 * TODO: V2 — Ask user to define tech stack and team size for better assessment.
 * TODO: V2 — Add a timeline estimation based on feature complexity.
 * TODO: V3 — Generate a preliminary MVP roadmap using AI.
 */

const COMPLEXITY_INDICATORS = [
  'integrate', 'blockchain', 'real-time', 'machine learning', 'ai',
  'multi-platform', 'enterprise', 'scale', 'global', 'multi-language',
  'payment', 'marketplace', 'social network', 'recommendation engine',
];

const MVP_POSITIVE_SIGNALS = [
  'simple', 'basic', 'core', 'essential', 'minimum', 'focused',
  'single', 'one', 'primary', 'main', 'key', 'central',
];

/**
 * Calculate the MVP Readiness Score.
 * @param {object} startup - StartupIdea document
 * @returns {number} Score between 0 and 100
 */
const calculateMVPScore = (startup) => {
  let score = 0;

  const features = startup.keyFeatures || [];
  const problemText = (startup.problemStatement || '').toLowerCase();
  const targetText = (startup.targetUsers || '').toLowerCase();
  const allFeaturesText = features.map((f) => f.toLowerCase()).join(' ');

  // ─── Factor 1: Optimal feature count (0–30 pts) ──────────────────────────
  // MVP sweet spot: 3–6 features. Too few = vague, too many = scope creep.
  if (features.length >= 3 && features.length <= 6) {
    score += 30; // Perfect MVP scope
  } else if (features.length === 7 || features.length === 2) {
    score += 20;
  } else if (features.length >= 8) {
    score += 12; // Possible scope creep
  } else if (features.length === 1) {
    score += 10; // Too narrow
  }

  // ─── Factor 2: Feature description quality (0–25 pts) ────────────────────
  // Longer, more descriptive features = better MVP planning
  const avgFeatureLength =
    features.reduce((sum, f) => sum + f.split(/\s+/).length, 0) / (features.length || 1);

  if (avgFeatureLength >= 5) score += 25;
  else if (avgFeatureLength >= 3) score += 18;
  else if (avgFeatureLength >= 2) score += 10;
  else score += 5;

  // ─── Factor 3: Complexity penalty (0 to -15 pts adjustment) ──────────────
  const complexityFound = COMPLEXITY_INDICATORS.filter((c) => allFeaturesText.includes(c));
  const complexityPenalty = Math.min(complexityFound.length * 5, 15);
  score -= complexityPenalty;

  // ─── Factor 4: MVP-focused language signals (0–20 pts) ───────────────────
  const positiveFound = MVP_POSITIVE_SIGNALS.filter(
    (s) => allFeaturesText.includes(s) || problemText.includes(s)
  );
  score += Math.min(positiveFound.length * 5, 20);

  // ─── Factor 5: Clear target user definition (0–20 pts) ───────────────────
  const targetWordCount = targetText.split(/\s+/).filter(Boolean).length;
  if (targetWordCount >= 15) score += 20;
  else if (targetWordCount >= 8) score += 14;
  else if (targetWordCount >= 4) score += 8;
  else score += 3;

  return Math.max(0, Math.min(Math.round(score), 100));
};

module.exports = { calculateMVPScore };
