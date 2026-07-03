/**
 * config/env.js
 * Centralized environment variable access and validation.
 * Fail fast if critical variables are missing.
 */

require('dotenv').config();

const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY', 'TAVILY_API_KEY'];

/**
 * Validate that all required environment variables are set.
 * Called once at startup. Warns about placeholders but doesn't exit —
 * this allows the app to run in demo mode without real API keys.
 */
const validateEnv = () => {
  const placeholderPatterns = ['your_', '_here', 'change_this', 'placeholder'];
  const missing = requiredVars.filter((key) => !process.env[key]);
  const placeholders = requiredVars.filter((key) => {
    const val = process.env[key] || '';
    return val && placeholderPatterns.some((p) => val.toLowerCase().includes(p));
  });

  if (missing.length > 0) {
    console.error(`[ENV ERROR] Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please copy server/.env.example to server/.env and fill in all values.');
    process.exit(1);
  }

  if (placeholders.length > 0) {
    console.warn(`\n⚠️  [ENV WARNING] The following variables still contain placeholder values:`);
    placeholders.forEach((key) => console.warn(`   - ${key}`));
    console.warn('   AI analysis and competitor search will return fallback data until real keys are provided.\n');
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
