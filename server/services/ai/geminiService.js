/**
 * services/ai/geminiService.js
 * Google Gemini AI integration service.
 *
 * Responsibility: ONLY analyze startup ideas and return:
 *   - Summary
 *   - Strengths
 *   - Weaknesses
 *   - Suggestions
 *   - Startup Pitch
 *
 * IMPORTANT: This service MUST NOT calculate any numerical scores.
 * All scoring is handled by the dedicated scoring services.
 *
 * TODO: V2 — Add retry logic with exponential backoff for API failures.
 * TODO: V2 — Add response caching (Redis) to reduce API costs.
 * TODO: V2 — Support streaming responses for real-time UI updates.
 * TODO: V3 — Add SWOT analysis prompt.
 * TODO: V3 — Add investor readiness assessment prompt.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { env } = require('../../config/env');
const { buildAnalysisPrompt } = require('./promptBuilder');
const logger = require('../../utils/logger');

// Initialize Gemini client (singleton)
const genAI = new GoogleGenerativeAI(env.geminiApiKey);

/**
 * Analyze a startup idea using Gemini AI.
 * @param {object} startup - StartupIdea document
 * @returns {Promise<object>} AI analysis: { summary, strengths, weaknesses, suggestions, pitch }
 */
const analyzeStartup = async (startup) => {
  try {
    logger.info(`[GeminiService] Starting analysis for startup: "${startup.title}"`);

    const model = genAI.getGenerativeModel({ model: env.geminiModel });
    const prompt = buildAnalysisPrompt(startup);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    logger.debug(`[GeminiService] Raw response received (${rawText.length} chars)`);

    // Parse the JSON response from Gemini
    const analysis = parseGeminiResponse(rawText);

    logger.info(`[GeminiService] Analysis completed successfully for: "${startup.title}"`);
    return analysis;
  } catch (error) {
    logger.error(`[GeminiService] Analysis failed: ${error.message}`);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

/**
 * Parse and sanitize Gemini's JSON response.
 * Handles cases where Gemini wraps JSON in markdown code blocks.
 * @param {string} rawText - Raw text from Gemini response
 * @returns {object} Parsed analysis object
 */
const parseGeminiResponse = (rawText) => {
  try {
    // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Validate required fields and apply defaults
    return {
      summary: parsed.summary || 'Summary not available.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      pitch: parsed.pitch || 'Pitch not available.',
    };
  } catch (parseError) {
    logger.error(`[GeminiService] Failed to parse JSON response: ${parseError.message}`);
    logger.debug(`[GeminiService] Raw text was: ${rawText}`);

    // Graceful fallback — return partial data so the validation doesn't fail entirely
    return {
      summary: 'AI analysis could not be fully parsed. Please try again.',
      strengths: [],
      weaknesses: [],
      suggestions: [],
      pitch: '',
    };
  }
};

module.exports = { analyzeStartup };
