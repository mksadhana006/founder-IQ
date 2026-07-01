/**
 * services/ai/promptBuilder.js
 * Builds structured prompts for the Gemini API.
 * Separating prompt construction from API calls keeps each unit testable.
 *
 * IMPORTANT: Prompts must NEVER ask Gemini to calculate scores.
 * Score calculation is handled exclusively by the scoring services.
 */

/**
 * Build the analysis prompt from a startup idea object.
 * @param {object} startup - StartupIdea document
 * @returns {string} Formatted prompt string
 */
const buildAnalysisPrompt = (startup) => {
  const featuresText = startup.keyFeatures
    .map((f, i) => `  ${i + 1}. ${f}`)
    .join('\n');

  return `
You are a startup advisor and business analyst. Analyze the following startup idea and provide a detailed, honest, and actionable assessment.

STARTUP IDEA:
- Title: ${startup.title}
- Industry: ${startup.industry || 'Not specified'}
- Problem Statement: ${startup.problemStatement}
- Target Users: ${startup.targetUsers}
- Key Features:
${featuresText}

Please respond ONLY with a valid JSON object in the following exact structure (no markdown, no code blocks, just raw JSON):

{
  "summary": "A concise 2-3 sentence executive summary of this startup idea",
  "strengths": [
    "Strength point 1",
    "Strength point 2",
    "Strength point 3"
  ],
  "weaknesses": [
    "Weakness point 1",
    "Weakness point 2",
    "Weakness point 3"
  ],
  "suggestions": [
    "Actionable improvement suggestion 1",
    "Actionable improvement suggestion 2",
    "Actionable improvement suggestion 3"
  ],
  "pitch": "A compelling 3-4 sentence investor pitch for this startup idea"
}

Rules:
- Be honest and constructive, not overly positive
- Keep each point concise (1-2 sentences max)
- Provide exactly 3-5 items for each array
- Do NOT include any score numbers or ratings
- Do NOT wrap the JSON in markdown code blocks
`.trim();
};

module.exports = { buildAnalysisPrompt };
