/**
 * services/scoring/CompetitorScore.js
 * Calculates the Competitor Differentiation Score (0–100).
 *
 * Measures how differentiated this startup is from known competitors.
 * Paradox: having some competitors is healthy (validates market), but
 * too many dominant players makes differentiation harder.
 *
 * Scoring factors:
 *   - Number of competitors found (market validation vs. saturation)
 *   - Uniqueness of key features vs. competitor descriptions
 *
 * TODO: V2 — Use AI to compare feature lists with competitor descriptions.
 * TODO: V2 — Factor in competitor funding/size for weighted differentiation.
 */

/**
 * Calculate the Competitor Differentiation Score.
 * @param {object} startup     - StartupIdea document
 * @param {Array}  competitors - Array of parsed competitor objects
 * @returns {number} Score between 0 and 100
 */
const calculateCompetitorScore = (startup, competitors) => {
  let score = 0;

  const competitorCount = competitors.length;

  // ─── Factor 1: Market validation via competitor count (0–40 pts) ─────────
  // 0 competitors → unproven market OR very novel idea (moderate score)
  // 1–3 competitors → healthy validation (high score)
  // 4–6 competitors → competitive but viable (medium score)
  // 7+ competitors → highly saturated (low score)
  if (competitorCount === 0) {
    score += 25; // Uncertain: could be blue ocean or no market
  } else if (competitorCount <= 3) {
    score += 40; // Sweet spot — validated but not saturated
  } else if (competitorCount <= 6) {
    score += 28;
  } else {
    score += 15; // Many competitors — differentiation is critical
  }

  // ─── Factor 2: Feature uniqueness check (0–40 pts) ───────────────────────
  // Check if startup features appear to be unique vs. competitor descriptions
  const competitorDescriptions = competitors
    .map((c) => (c.description || '').toLowerCase())
    .join(' ');

  const features = startup.keyFeatures || [];
  let uniqueFeatureCount = 0;

  features.forEach((feature) => {
    const featureLower = feature.toLowerCase();
    const featureWords = featureLower.split(/\s+/).filter((w) => w.length > 3);
    const isUnique = featureWords.some((word) => !competitorDescriptions.includes(word));
    if (isUnique) uniqueFeatureCount++;
  });

  const uniquenessRatio = features.length > 0 ? uniqueFeatureCount / features.length : 0.5;
  score += Math.round(uniquenessRatio * 40);

  // ─── Factor 3: Feature count richness (0–20 pts) ─────────────────────────
  // More features = better differentiation potential
  if (features.length >= 7) score += 20;
  else if (features.length >= 4) score += 14;
  else if (features.length >= 2) score += 8;
  else score += 4;

  return Math.min(Math.round(score), 100);
};

module.exports = { calculateCompetitorScore };
