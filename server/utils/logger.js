/**
 * utils/logger.js
 * Lightweight logger with log levels.
 * TODO: V2 — Replace with Winston or Pino for structured logging, log rotation,
 *             and log shipping to services like Datadog or CloudWatch.
 */

const { env } = require('../config/env');

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const COLORS = {
  error: '\x1b[31m',  // Red
  warn: '\x1b[33m',   // Yellow
  info: '\x1b[36m',   // Cyan
  debug: '\x1b[90m',  // Gray
  reset: '\x1b[0m',
};

const currentLevel = env.isProduction ? LEVELS.info : LEVELS.debug;

const log = (level, ...args) => {
  if (LEVELS[level] > currentLevel) return;

  const timestamp = new Date().toISOString();
  const color = COLORS[level] || '';
  const reset = COLORS.reset;
  const prefix = `${color}[${timestamp}] [${level.toUpperCase()}]${reset}`;

  if (level === 'error') {
    console.error(prefix, ...args);
  } else {
    console.log(prefix, ...args);
  }
};

const logger = {
  error: (...args) => log('error', ...args),
  warn: (...args) => log('warn', ...args),
  info: (...args) => log('info', ...args),
  debug: (...args) => log('debug', ...args),
};

module.exports = logger;
