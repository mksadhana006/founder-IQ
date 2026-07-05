/**
 * services/search/competitorParser.js
 * Normalizes raw Tavily API search results into a clean competitor list.
 * Keeping parsing separate from the HTTP call makes each unit testable.
 *
 * Enhanced to:
 *   - Deduplicate results by domain
 *   - Extract pricing, target audience, strengths, weaknesses from content
 *   - Improve company name extraction
 */

// ─── Pricing Patterns ────────────────────────────────────────────────────────
const PRICING_PATTERNS = [
  /\$[\d,]+(?:\.\d{2})?(?:\s*\/\s*(?:mo|month|yr|year|user|seat))?/gi,
  /(?:free(?:\s+plan|\s+tier)?|freemium|open[\s-]?source)/gi,
  /(?:starts?\s+(?:at|from)\s+\$[\d,]+)/gi,
  /(?:pricing|plans?)\s*(?:start|from|at)\s+\$[\d,]+/gi,
];

// ─── Target Audience Patterns ────────────────────────────────────────────────
const AUDIENCE_KEYWORDS = [
  'small business', 'enterprise', 'startup', 'developer', 'freelancer',
  'team', 'individual', 'professional', 'agency', 'consumer', 'b2b', 'b2c',
  'smb', 'mid-market', 'creator', 'marketer', 'designer', 'student',
];

/**
 * Parse and normalize raw search results from Tavily into competitor objects.
 * @param {Array} results - Raw results from Tavily API
 * @param {string} startupId - The startup ID these competitors belong to
 * @returns {Array<object>} Normalized, deduplicated competitor list
 */
const parseCompetitors = (results, startupId) => {
  if (!Array.isArray(results) || results.length === 0) return [];

  const seenDomains = new Set();

  return results
    .filter((result) => result.url && result.title)
    .map((result) => {
      const domain = extractDomain(result.url);

      // Skip if we've already seen this domain (deduplication)
      if (seenDomains.has(domain)) return null;
      seenDomains.add(domain);

      const content = result.content || result.snippet || '';

      return {
        startupId,
        name: extractCompanyName(result.title, result.url),
        website: cleanUrl(result.url),
        description: truncate(content, 400),
        source: result.url,
        pricing: extractPricing(content),
        targetAudience: extractTargetAudience(content),
        strengths: extractStrengthsFromContent(content),
        weaknesses: extractWeaknessesFromContent(content),
      };
    })
    .filter(Boolean); // Remove nulls from dedup
};

/**
 * Extract domain from a URL for deduplication.
 * @param {string} url
 * @returns {string}
 */
const extractDomain = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '').toLowerCase();
  } catch {
    return url;
  }
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
    .split(/\s*[|·\-–—:]\s*/)[0]
    .replace(/\s*(home|official|site|website|platform|app|pricing|review|alternative)\s*/gi, '')
    .trim();

  return cleaned.length > 1 ? cleaned : title.split(/\s*[|·\-–—:]\s*/)[0].trim() || title;
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
 * Extract pricing information from content text.
 * @param {string} content
 * @returns {string} Extracted pricing info or empty string
 */
const extractPricing = (content) => {
  if (!content) return '';
  const lower = content.toLowerCase();

  for (const pattern of PRICING_PATTERNS) {
    const match = lower.match(pattern);
    if (match) {
      return match.slice(0, 3).join(', ');
    }
  }

  return '';
};

/**
 * Extract target audience signals from content.
 * @param {string} content
 * @returns {string} Comma-separated audience keywords found
 */
const extractTargetAudience = (content) => {
  if (!content) return '';
  const lower = content.toLowerCase();

  const found = AUDIENCE_KEYWORDS.filter((kw) => lower.includes(kw));
  return found.slice(0, 3).join(', ');
};

/**
 * Extract strength signals from content.
 * @param {string} content
 * @returns {string[]} Array of strength strings (max 3)
 */
const extractStrengthsFromContent = (content) => {
  if (!content) return [];
  const lower = content.toLowerCase();
  const strengths = [];

  const strengthSignals = [
    { keyword: 'easy to use', text: 'User-friendly interface' },
    { keyword: 'affordable', text: 'Competitive pricing' },
    { keyword: 'scalable', text: 'Scalable solution' },
    { keyword: 'free plan', text: 'Offers free tier' },
    { keyword: 'open source', text: 'Open source' },
    { keyword: 'market leader', text: 'Established market leader' },
    { keyword: 'integration', text: 'Rich integrations ecosystem' },
    { keyword: 'api', text: 'API access available' },
    { keyword: 'enterprise', text: 'Enterprise-grade' },
    { keyword: 'mobile app', text: 'Mobile app available' },
  ];

  for (const signal of strengthSignals) {
    if (lower.includes(signal.keyword)) {
      strengths.push(signal.text);
      if (strengths.length >= 3) break;
    }
  }

  return strengths;
};

/**
 * Extract weakness signals from content.
 * @param {string} content
 * @returns {string[]} Array of weakness strings (max 3)
 */
const extractWeaknessesFromContent = (content) => {
  if (!content) return [];
  const lower = content.toLowerCase();
  const weaknesses = [];

  const weaknessSignals = [
    { keyword: 'expensive', text: 'High pricing' },
    { keyword: 'steep learning curve', text: 'Steep learning curve' },
    { keyword: 'limited', text: 'Limited features in lower tiers' },
    { keyword: 'no free', text: 'No free plan available' },
    { keyword: 'complex', text: 'Complex setup' },
    { keyword: 'slow', text: 'Performance concerns' },
    { keyword: 'outdated', text: 'Dated interface' },
  ];

  for (const signal of weaknessSignals) {
    if (lower.includes(signal.keyword)) {
      weaknesses.push(signal.text);
      if (weaknesses.length >= 3) break;
    }
  }

  return weaknesses;
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
