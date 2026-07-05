/**
 * services/ai/geminiService.js
 * Google Gemini AI integration service.
 *
 * Responsibility: ONLY analyze startup ideas and return:
 *   - Summary, Strengths, Weaknesses, Suggestions, Pitch
 *   - SWOT Analysis
 *   - Market Opportunity
 *   - Risk Analysis
 *   - Revenue Model Suggestions
 *   - Go-to-Market Strategy
 *
 * IMPORTANT: This service MUST NOT calculate any numerical scores.
 * All scoring is handled by the dedicated scoring services.
 *
 * Features:
 *   - Retry logic with exponential backoff (max 3 attempts)
 *   - Robust JSON parsing with markdown stripping
 *   - Field validation with safe defaults
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { env } = require('../../config/env');
const { buildAnalysisPrompt } = require('./promptBuilder');
const logger = require('../../utils/logger');

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;

// Initialize Gemini client (singleton)
const genAI = new GoogleGenerativeAI(env.geminiApiKey);

/**
 * Analyze a startup idea using Gemini AI with retry logic.
 * @param {object} startup - StartupIdea document
 * @returns {Promise<object>} AI analysis with all fields
 */
const analyzeStartup = async (startup) => {
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.info(`[GeminiService] Analysis attempt ${attempt}/${MAX_RETRIES} for: "${startup.title}"`);

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
      lastError = error;
      logger.error(`[GeminiService] Attempt ${attempt} failed: ${error.message}`);

      // Don't retry on auth errors
      if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
        break;
      }

      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
        logger.warn(`[GeminiService] Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  logger.error(`[GeminiService] All ${MAX_RETRIES} attempts failed for: "${startup.title}"`);
  throw new Error(`AI analysis failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
};

/**
 * Parse and sanitize Gemini's JSON response.
 * Handles cases where Gemini wraps JSON in markdown code blocks.
 * Validates all fields and applies safe defaults.
 * @param {string} rawText - Raw text from Gemini response
 * @returns {object} Parsed and validated analysis object
 */
const parseGeminiResponse = (rawText) => {
  try {
    // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Validate and apply defaults for all fields
    return validateAnalysis(parsed);
  } catch (parseError) {
    logger.error(`[GeminiService] Failed to parse JSON response: ${parseError.message}`);
    logger.debug(`[GeminiService] Raw text was: ${rawText.substring(0, 500)}...`);

    // Attempt to extract partial data from malformed response
    return extractPartialData(rawText);
  }
};

/**
 * Validate all analysis fields and apply safe defaults.
 * @param {object} parsed - Parsed JSON object
 * @returns {object} Validated analysis
 */
const validateAnalysis = (parsed) => {
  const ensureArray = (val) => (Array.isArray(val) ? val : []);
  const ensureString = (val) => (typeof val === 'string' ? val : '');

  // Validate SWOT sub-object
  const rawSwot = parsed.swotAnalysis || {};
  const swotAnalysis = {
    strengths: ensureArray(rawSwot.strengths),
    weaknesses: ensureArray(rawSwot.weaknesses),
    opportunities: ensureArray(rawSwot.opportunities),
    threats: ensureArray(rawSwot.threats),
  };

  return {
    // Original fields
    summary: ensureString(parsed.summary) || 'Summary not available.',
    strengths: ensureArray(parsed.strengths),
    weaknesses: ensureArray(parsed.weaknesses),
    suggestions: ensureArray(parsed.suggestions),
    pitch: ensureString(parsed.pitch) || 'Pitch not available.',

    // New enriched fields
    swotAnalysis,
    marketOpportunity: ensureString(parsed.marketOpportunity),
    riskAnalysis: ensureArray(parsed.riskAnalysis),
    revenueModels: ensureArray(parsed.revenueModels),
    goToMarketStrategy: ensureArray(parsed.goToMarketStrategy),
  };
};

/**
 * Extract whatever data we can from a malformed response.
 * @param {string} rawText
 * @returns {object} Partial analysis with defaults
 */
const extractPartialData = (rawText) => {
  logger.warn('[GeminiService] Attempting partial data extraction from malformed response.');

  const result = {
    summary: 'AI analysis could not be fully parsed. Please try again.',
    strengths: [],
    weaknesses: [],
    suggestions: [],
    pitch: '',
    swotAnalysis: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
    marketOpportunity: '',
    riskAnalysis: [],
    revenueModels: [],
    goToMarketStrategy: [],
  };

  // Try to find and extract JSON from within the text
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return validateAnalysis(parsed);
    } catch {
      // Fall through to return defaults
    }
  }

  // If the raw text is at least somewhat useful, use it as the summary
  if (rawText && rawText.length > 50) {
    result.summary = rawText.substring(0, 500).replace(/[{}[\]"]/g, '').trim();
  }

  return result;
};

module.exports = { analyzeStartup };
