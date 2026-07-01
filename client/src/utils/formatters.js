/**
 * utils/formatters.js
 * Utility functions for formatting data for display.
 */

import { SCORE_LABELS } from './constants';

/**
 * Format a date string to a human-readable format.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
};

/**
 * Format a date as relative time (e.g., "2 days ago").
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return formatDate(date);
};

/**
 * Get score label and color based on score value.
 * @param {number} score
 * @returns {{ label: string, color: string, bg: string }}
 */
export const getScoreInfo = (score) => {
  const thresholds = [80, 60, 40, 0];
  for (const threshold of thresholds) {
    if (score >= threshold) return SCORE_LABELS[threshold];
  }
  return SCORE_LABELS[0];
};

/**
 * Truncate a string to a max length.
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export const truncate = (str, length = 100) => {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format a score as a display string with label.
 * @param {number} score
 * @returns {string}
 */
export const formatScore = (score) => `${Math.round(score)}/100`;
