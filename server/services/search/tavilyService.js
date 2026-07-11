/**
 * services/search/tavilyService.js
 * Tavily Search API integration for competitor discovery.
 *
 * Responsibility: ONLY find and return competitor information:
 *   - Company name
 *   - Website
 *   - Description
 *   - Market information
 *
 * IMPORTANT: This service MUST NOT calculate scores.
 *
 * Features:
 *   - Multi-query parallel search for richer competitor data
 *   - In-memory result caching (24h TTL) to reduce API costs
 *   - Retry logic with exponential backoff
 *   - Graceful error handling — never blocks the validation pipeline
 */

const axios = require('axios');
const { env } = require('../../config/env');
const { parseCompetitors } = require('./competitorParser');
const { COMPETITOR_SEARCH } = require('../../constants');
const logger = require('../../utils/logger');

// ─── In-Memory Search Cache ──────────────────────────────────────────────────
// Key: startupId, Value: { data: competitor[], timestamp: number }
const searchCache = new Map();

/**
 * Check if a cached result is still valid.
 * @param {string} cacheKey
 * @returns {Array|null} Cached competitors or null if expired/missing
 */
const getCachedResult = (cacheKey) => {
  const entry = searchCache.get(cacheKey);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > COMPETITOR_SEARCH.CACHE_TTL_MS) {
    searchCache.delete(cacheKey);
    return null;
  }

  logger.info(`[TavilyService] Cache HIT for key: ${cacheKey} (age: ${Math.round(age / 1000)}s)`);
  return entry.data;
};

/**
 * Store results in cache.
 * @param {string} cacheKey
 * @param {Array} data
 */
const setCachedResult = (cacheKey, data) => {
  searchCache.set(cacheKey, { data, timestamp: Date.now() });
};

/**
 * Execute a single Tavily search request with retry logic.
 * @param {string} query - Search query string
 * @param {number} maxResults - Max results to return
 * @returns {Promise<Array>} Raw search results
 */
const executeTavilySearch = async (query, maxResults = COMPETITOR_SEARCH.MAX_RESULTS) => {
  let lastError = null;

  for (let attempt = 1; attempt <= COMPETITOR_SEARCH.MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        `${env.tavilyBaseUrl}/search`,
        {
          api_key: env.tavilyApiKey,
          query,
          search_depth: COMPETITOR_SEARCH.DEFAULT_SEARCH_DEPTH,
          max_results: maxResults,
          include_domains: [],
          exclude_domains: [],
          include_answer: true,
          include_raw_content: false,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        }
      );

      return response.data?.results || [];
    } catch (error) {
      lastError = error;

      if (error.response?.status === 401 || error.response?.status === 403) {
        logger.error(`[TavilyService] Auth failed (${error.response.status}). Check TAVILY_API_KEY.`);
        break; // Don't retry auth errors
      }

      if (attempt < COMPETITOR_SEARCH.MAX_RETRIES) {
        const delay = COMPETITOR_SEARCH.RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
        logger.warn(`[TavilyService] Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Log final failure
  if (lastError?.response) {
    logger.error(
      `[TavilyService] API error after ${COMPETITOR_SEARCH.MAX_RETRIES} attempts: ` +
      `${lastError.response.status} — ${JSON.stringify(lastError.response.data)}`
    );
  } else {
    logger.error(
      `[TavilyService] Request failed after ${COMPETITOR_SEARCH.MAX_RETRIES} attempts: ${lastError?.message}`
    );
  }

  return [];
};

/**
 * Build multiple targeted search queries from startup data.
 * Running multiple queries produces richer, more diverse competitor data.
 * @param {object} startup
 * @returns {string[]} Array of query strings
 */
const buildSearchQueries = (startup) => {
  const industryPart = startup.industry ? ` ${startup.industry}` : '';
  const title = startup.title || '';

  return [
    // Query 1: Direct competitors
    `${title}${industryPart} startup competitors alternatives companies`,
    // Query 2: Similar products and pricing
    `${title}${industryPart} similar products pricing comparison`,
    // Query 3: Market landscape
    `${industryPart} market trends startups ${(startup.problemStatement || '').substring(0, 80)}`,
  ];
};

/**
 * Search for competitors related to a startup idea.
 * Uses multi-query parallel search, caching, and retry logic.
 * @param {object} startup - StartupIdea document
 * @returns {Promise<Array>} Parsed competitor list
 */
const searchCompetitors = async (startup) => {
  try {
    const cacheKey = startup._id.toString();

    // Check cache first
    const cached = getCachedResult(cacheKey);
    if (cached) {
      return cached;
    }

    const queries = buildSearchQueries(startup);
    logger.info(`[TavilyService] Searching competitors for: "${startup.title}" (${queries.length} queries)`);

    // Run all queries in parallel for speed
    const resultsPerQuery = Math.ceil(COMPETITOR_SEARCH.MAX_RESULTS / queries.length);
    const searchPromises = queries.map((query, idx) => {
      logger.debug(`[TavilyService] Query ${idx + 1}: "${query}"`);
      return executeTavilySearch(query, resultsPerQuery + 2); // Fetch a few extra for dedup buffer
    });

    const allResults = await Promise.allSettled(searchPromises);

    // Merge results from all queries
    const mergedResults = [];
    allResults.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        logger.info(`[TavilyService] Query ${idx + 1} returned ${result.value.length} results.`);
        mergedResults.push(...result.value);
      } else {
        logger.warn(`[TavilyService] Query ${idx + 1} failed: ${result.reason?.message}`);
      }
    });

    logger.info(`[TavilyService] Total raw results: ${mergedResults.length}`);

    const competitors = parseCompetitors(mergedResults, cacheKey);
    logger.info(`[TavilyService] Parsed ${competitors.length} unique competitors.`);

    // Cache the parsed results
    if (competitors.length > 0) {
      setCachedResult(cacheKey, competitors);
    }

    return competitors;
  } catch (error) {
    logger.error(`[TavilyService] Competitor search failed: ${error.message}`);
    return [];
  }
};

module.exports = { searchCompetitors };
