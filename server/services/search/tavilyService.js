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
 * TODO: V2 — Add Brave Search as a fallback provider.
 * TODO: V2 — Cache search results in Redis (TTL: 24h) to save API costs.
 * TODO: V2 — Add retry logic with exponential backoff.
 * TODO: V2 — Support multiple search queries for richer competitor data.
 */

const axios = require('axios');
const { env } = require('../../config/env');
const { parseCompetitors } = require('./competitorParser');
const { COMPETITOR_SEARCH } = require('../../constants');
const logger = require('../../utils/logger');

/**
 * Search for competitors related to a startup idea.
 * @param {object} startup - StartupIdea document
 * @returns {Promise<Array>} Parsed competitor list
 */
const searchCompetitors = async (startup) => {
  try {
    const query = buildSearchQuery(startup);
    logger.info(`[TavilyService] Searching competitors for: "${startup.title}"`);
    logger.debug(`[TavilyService] Query: "${query}"`);

    const response = await axios.post(
      `${env.tavilyBaseUrl}/search`,
      {
        query,
        search_depth: COMPETITOR_SEARCH.DEFAULT_SEARCH_DEPTH,
        max_results: COMPETITOR_SEARCH.MAX_RESULTS,
        include_domains: [],
        exclude_domains: [],
        include_answer: false,
        include_raw_content: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.tavilyApiKey}`,
        },
        timeout: 15000, // 15 second timeout
      }
    );

    const rawResults = response.data?.results || [];
    logger.info(`[TavilyService] Found ${rawResults.length} raw results.`);

    const competitors = parseCompetitors(rawResults, startup._id.toString());
    logger.info(`[TavilyService] Parsed ${competitors.length} competitors.`);

    return competitors;
  } catch (error) {
    // Don't throw — competitor search failure shouldn't block the whole validation
    if (error.response) {
      logger.error(
        `[TavilyService] API error: ${error.response.status} — ${JSON.stringify(error.response.data)}`
      );
    } else {
      logger.error(`[TavilyService] Request failed: ${error.message}`);
    }

    // Return empty array so scoring can still proceed with 0 competitors
    return [];
  }
};

/**
 * Build a targeted competitor search query from startup data.
 * @param {object} startup
 * @returns {string}
 */
const buildSearchQuery = (startup) => {
  const industryPart = startup.industry ? ` ${startup.industry}` : '';
  return `${startup.title}${industryPart} startup competitors alternatives companies`;
};

module.exports = { searchCompetitors };
