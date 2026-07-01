/**
 * server.js
 * Main Express application entry point.
 * Configures middleware, mounts routes, and starts the HTTP server.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { validateEnv, env } = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/authRoutes');
const startupRoutes = require('./routes/startupRoutes');
const validationRoutes = require('./routes/validationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// TODO: V2 — Import future module routes here:
//   const teamRoutes = require('./modules/teamCollaboration/routes');
//   const investorRoutes = require('./modules/investorReadiness/routes');
//   const notificationRoutes = require('./modules/notifications/routes');
//   const adminRoutes = require('./modules/adminDashboard/routes');

// ─── Validate Environment Variables ──────────────────────────────────────────
validateEnv();

// ─── Connect to Database ──────────────────────────────────────────────────────
connectDB();

// ─── Initialize Express App ───────────────────────────────────────────────────
const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────

// CORS — allow requests from the React client
app.use(cors({
  origin: env.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// HTTP request logger (dev mode only)
if (!env.isProduction) {
  app.use(morgan('dev'));
}

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all API routes
app.use('/api', generalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Startup Validator API is running.',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// TODO: V2 — Mount future module routes here:
//   app.use('/api/team', teamRoutes);
//   app.use('/api/investor', investorRoutes);
//   app.use('/api/notifications', notificationRoutes);
//   app.use('/api/admin', adminRoutes);
//   app.use('/api/payments', paymentRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: [${req.method}] ${req.originalUrl}`,
    errors: [],
  });
});

// ─── Global Error Handler (must be LAST) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(env.port, () => {
  logger.info(`🚀 Startup Validator API running on http://localhost:${env.port}`);
  logger.info(`📡 Environment: ${env.nodeEnv}`);
  logger.info(`🌐 CORS allowed origin: ${env.clientUrl}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Promise Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
