/**
 * services/search/competitorParser.js
 * Normalizes raw Tavily API search results into a clean competitor list.
 * Keeping parsing separate from the HTTP call makes each unit testable.
 */

/**
 * Parse and normalize raw search results from Tavily into competitor objects.
 * @param {Array} results - Raw results from Tavily API
 * @param {string} startupId - The startup ID these competitors belong to
 * @returns {Array<object>} Normalized competitor list
 */
const parseCompetitors = (results, startupId) => {
  if (!Array.isArray(results) || results.length === 0) return [];

  return results
    .filter((result) => result.url && result.title) // Must have URL and name
    .map((result) => ({
      startupId,
      name: extractCompanyName(result.title, result.url),
      website: cleanUrl(result.url),
      description: truncate(result.content || result.snippet || '', 400),
      source: result.url,
    }));
};

/**
 * Extract a clean company name from a search result title.
 * Removes common suffixes like "- Home", "| Official Site", etc.
 * @param {string} title - Raw page title
 * @param {string} url   - Page URL (fallback for name extraction)
 * @returns {string}
 */
const extractCompanyName = (title, url) => {
  if (!title) {
    // Fallback: extract hostname from URL
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      return hostname.split('.')[0];
    } catch {
      return 'Unknown';
    }
  }

  // Strip common separator patterns from titles: "Company | Description" → "Company"
  const cleaned = title
    .split(/\s*[\|·\-–—]\s*/)[0]
    .trim();

  return cleaned.length > 1 ? cleaned : title;
};

/**
 * Clean and normalize a URL string.
 * @param {string} url - Raw URL
 * @returns {string}
 */
const cleanUrl = (url) => {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return url;
  }
};

/**
 * Truncate a string to a max length, appending ellipsis if needed.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
const truncate = (str, maxLength) => {
  if (!str) return '';
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

module.exports = { parseCompetitors };
