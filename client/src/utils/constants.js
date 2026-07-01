/**
 * utils/constants.js
 * Frontend-side constants. Keep in sync with server/constants/index.js.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SCORE_LABELS = {
  80: { label: 'Excellent', color: '#22c55e', bg: 'score-excellent' },
  60: { label: 'Good', color: '#84cc16', bg: 'score-good' },
  40: { label: 'Average', color: '#f59e0b', bg: 'score-average' },
  0:  { label: 'Needs Work', color: '#ef4444', bg: 'score-poor' },
};

export const SCORE_COLORS = {
  problemScore: '#6366f1',      // indigo
  competitorScore: '#8b5cf6',   // violet
  urgencyScore: '#f59e0b',      // amber
  mvpScore: '#10b981',          // emerald
  overallScore: '#06b6d4',      // cyan
};

export const SCORE_LABELS_MAP = {
  problemScore: 'Problem Solvability',
  competitorScore: 'Competitor Differentiation',
  urgencyScore: 'Market Urgency',
  mvpScore: 'MVP Readiness',
  overallScore: 'Overall Score',
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'sv_auth_token',
  USER: 'sv_user',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SUBMIT: '/submit',
  VALIDATION: '/validation/:startupId',
  HISTORY: '/history',
  // TODO: V2 — Add routes for team, investor, settings pages
};
