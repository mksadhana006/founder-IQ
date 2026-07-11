/**
 * constants/index.js
 * Application-wide constants.
 * Centralizing constants avoids magic numbers and hardcoded strings.
 */

// ─── Scoring Weights ────────────────────────────────────────────────────────
// Each score contributes to the overall validation score with these weights.
// Must sum to 1.0
const SCORE_WEIGHTS = {
  problem: 0.30,      // Problem solvability — most critical
  competitor: 0.20,   // Competitive differentiation
  urgency: 0.25,      // Market urgency
  mvp: 0.25,          // MVP readiness
};

// ─── Score Thresholds ────────────────────────────────────────────────────────
const SCORE_LABELS = {
  EXCELLENT: { min: 80, label: 'Excellent', color: '#22c55e' },
  GOOD: { min: 60, label: 'Good', color: '#84cc16' },
  AVERAGE: { min: 40, label: 'Average', color: '#f59e0b' },
  POOR: { min: 0, label: 'Needs Work', color: '#ef4444' },
};

// ─── Validation Status ───────────────────────────────────────────────────────
const VALIDATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// ─── Startup Idea Status ─────────────────────────────────────────────────────
const STARTUP_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  VALIDATED: 'validated',
};

// ─── User Roles ───────────────────────────────────────────────────────────────
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  // TODO: V2 — Add INVESTOR, MENTOR roles
};

// ─── Competitor Search ───────────────────────────────────────────────────────
const COMPETITOR_SEARCH = {
  MAX_RESULTS: 8,
  DEFAULT_SEARCH_DEPTH: 'advanced',
  CACHE_TTL_MS: 24 * 60 * 60 * 1000, // 24 hours
  MAX_RETRIES: 3,
  RETRY_BASE_DELAY_MS: 1000,
};

// ─── HTTP Status Codes ───────────────────────────────────────────────────────
const HTTP = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

// ─── Error Messages ───────────────────────────────────────────────────────────
const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_IN_USE: 'An account with this email already exists.',
    NOT_AUTHENTICATED: 'You must be logged in to access this resource.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action.',
  },
  STARTUP: {
    NOT_FOUND: 'Startup idea not found.',
    NOT_OWNER: 'You do not own this startup idea.',
  },
  VALIDATION: {
    NOT_FOUND: 'Validation report not found.',
    AI_FAILED: 'AI analysis failed. Please try again.',
    SEARCH_FAILED: 'Competitor search failed. Results may be incomplete.',
  },
  GENERAL: {
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    VALIDATION_ERROR: 'Input validation failed.',
  },
};

// TODO: V2 — Add constants for:
//   - Notification types
//   - Subscription plan limits
//   - PDF export templates
//   - Email template IDs

module.exports = {
  SCORE_WEIGHTS,
  SCORE_LABELS,
  VALIDATION_STATUS,
  STARTUP_STATUS,
  USER_ROLES,
  COMPETITOR_SEARCH,
  HTTP,
  ERROR_MESSAGES,
};
