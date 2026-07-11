/**
 * services/ai/promptBuilder.js
 * Builds structured prompts for the Gemini API.
 * Separating prompt construction from API calls keeps each unit testable.
 *
 * IMPORTANT: Prompts must NEVER ask Gemini to calculate scores.
 * Score calculation is handled exclusively by the scoring services.
 */

/**
 * Build the full analysis prompt from a startup idea object.
 * Returns a prompt that requests comprehensive business analysis:
 *   - Executive summary
 *   - Strengths, weaknesses, suggestions
 *   - SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)
 *   - Market opportunity assessment
 *   - Risk analysis
 *   - Revenue model suggestions
 *   - Go-to-market strategy
 *   - Investor pitch
 *
 * @param {object} startup - StartupIdea document
 * @returns {string} Formatted prompt string
 */
const buildAnalysisPrompt = (startup) => {
  const featuresText = startup.keyFeatures
    .map((f, i) => `  ${i + 1}. ${f}`)
    .join('\n');

  return `
You are a senior startup advisor, venture analyst, and business strategist. Analyze the following startup idea and provide a thorough, honest, and actionable assessment.

STARTUP IDEA:
- Title: ${startup.title}
- Industry: ${startup.industry || 'Not specified'}
- Problem Statement: ${startup.problemStatement}
- Target Users: ${startup.targetUsers}
- Key Features:
${featuresText}

Please respond ONLY with a valid JSON object in the following exact structure (no markdown, no code blocks, just raw JSON):

{
  "summary": "A concise 2-3 sentence executive summary of this startup idea — its core value proposition and market positioning.",
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
  "pitch": "A compelling 3-4 sentence investor pitch for this startup idea.",
  "swotAnalysis": {
    "strengths": [
      "Internal strength 1 (team, tech, product)",
      "Internal strength 2"
    ],
    "weaknesses": [
      "Internal weakness 1 (resources, gaps)",
      "Internal weakness 2"
    ],
    "opportunities": [
      "External opportunity 1 (market trends, gaps)",
      "External opportunity 2"
    ],
    "threats": [
      "External threat 1 (competitors, regulations)",
      "External threat 2"
    ]
  },
  "marketOpportunity": "A 2-3 sentence assessment of the total addressable market, growth potential, and timing.",
  "riskAnalysis": [
    "Key risk 1 with brief mitigation strategy",
    "Key risk 2 with brief mitigation strategy",
    "Key risk 3 with brief mitigation strategy"
  ],
  "revenueModels": [
    "Revenue model suggestion 1 (e.g., SaaS subscription) — why it fits this idea",
    "Revenue model suggestion 2 — why it fits",
    "Revenue model suggestion 3 — why it fits"
  ],
  "goToMarketStrategy": [
    "Go-to-market step 1 (e.g., target early adopters in X niche)",
    "Go-to-market step 2 (e.g., content marketing / partnerships)",
    "Go-to-market step 3 (e.g., scale through Y channel)"
  ]
}

Rules:
- Be honest and constructive, not overly positive
- Keep each point concise (1-2 sentences max)
- Provide exactly 3-5 items for each array
- Provide exactly 2-4 items for each SWOT category
- Do NOT include any score numbers or ratings
- Do NOT wrap the JSON in markdown code blocks
`.trim();
};

module.exports = { buildAnalysisPrompt };
