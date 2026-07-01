/**
 * config/env.js
 * Centralized environment variable access and validation.
 * Fail fast if critical variables are missing.
 */

require('dotenv').config();

const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY', 'TAVILY_API_KEY'];

/**
 * Validate that all required environment variables are set.
 * Called once at startup.
 */
const validateEnv = () => {
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[ENV ERROR] Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please copy server/.env.example to server/.env and fill in all values.');
    process.exit(1);
  }
};

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Database
  mongoUri: process.env.MONGODB_URI,

  // Auth
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // AI
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',

  // Search
  tavilyApiKey: process.env.TAVILY_API_KEY,
  tavilyBaseUrl: process.env.TAVILY_BASE_URL || 'https://api.tavily.com',

  // CORS
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // TODO: V2 — Add Stripe, SendGrid, Redis, Cloudinary configs here
};

module.exports = { env, validateEnv };
