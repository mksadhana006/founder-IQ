/**
 * services/scoring/ProblemScore.js
 * Calculates the Problem Solvability Score (0–100).
 *
 * Measures how well-defined, specific, and compelling the problem is.
 * Score is based purely on the startup data — NO AI required.
 *
 * Scoring factors:
 *   - Length and depth of problem statement (signals thoroughness)
 *   - Presence of urgency/pain keywords
 *   - Clarity of target user definition
 *
 * TODO: V2 — Incorporate market size data from search results.
 * TODO: V2 — Use NLP sentiment analysis for deeper problem assessment.
 */

const URGENCY_KEYWORDS = [
  'pain', 'struggle', 'difficult', 'frustrat', 'expensive', 'waste',
  'inefficient', 'broken', 'lack', 'missing', 'fail', 'problem',
  'challenge', 'barrier', 'obstacle', 'ineffective', 'manual', 'tedious',
  'complex', 'confus', 'slow', 'costly', 'risk', 'unsafe',
];

/**
 * Calculate the Problem Solvability Score.
 * @param {object} startup - StartupIdea document
 * @returns {number} Score between 0 and 100
 */
const calculateProblemScore = (startup) => {
  let score = 0;

  const problem = (startup.problemStatement || '').toLowerCase();
  const targetUsers = (startup.targetUsers || '').toLowerCase();

  // ─── Factor 1: Problem statement length (0–30 pts) ───────────────────────
  // Longer, more detailed statements indicate a better-understood problem
  const wordCount = problem.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 80) score += 30;
  else if (wordCount >= 50) score += 22;
  else if (wordCount >= 30) score += 15;
  else if (wordCount >= 15) score += 8;
  else score += 3;

  // ─── Factor 2: Urgency/pain keywords (0–35 pts) ──────────────────────────
  const foundKeywords = URGENCY_KEYWORDS.filter((kw) => problem.includes(kw));
  const keywordScore = Math.min(foundKeywords.length * 7, 35);
  score += keywordScore;

  // ─── Factor 3: Target user specificity (0–20 pts) ────────────────────────
  const targetWordCount = targetUsers.split(/\s+/).filter(Boolean).length;
  if (targetWordCount >= 20) score += 20;
  else if (targetWordCount >= 10) score += 14;
  else if (targetWordCount >= 5) score += 8;
  else score += 3;

  // ─── Factor 4: Has industry defined (0–15 pts) ───────────────────────────
  if (startup.industry && startup.industry.trim().length > 0) score += 15;

  return Math.min(Math.round(score), 100);
};

module.exports = { calculateProblemScore };
