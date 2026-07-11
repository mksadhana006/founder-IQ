/**
 * config/db.js
 * MongoDB connection using Mongoose with retry logic.
 * Server stays running even if MongoDB is temporarily unavailable.
 */

const mongoose = require('mongoose');
const { env } = require('./env');
const logger = require('../utils/logger');

const MAX_RETRIES = 10;
const RETRY_INTERVAL_MS = 5000;
let retryCount = 0;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5s timeout per attempt
    });

    retryCount = 0;
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully.');
    });
  } catch (error) {
    retryCount++;
    logger.error(`MongoDB connection failed (attempt ${retryCount}/${MAX_RETRIES}): ${error.message}`);

    if (retryCount >= MAX_RETRIES) {
      logger.error('Max MongoDB connection retries reached. API routes requiring DB will not work.');
      logger.error('Please start MongoDB: Run mongod.exe or start the MongoDB service with admin privileges.');
      return; // Don't exit — let other routes still work
    }

    logger.info(`Retrying MongoDB connection in ${RETRY_INTERVAL_MS / 1000}s...`);
    setTimeout(connectDB, RETRY_INTERVAL_MS);
  }
};

module.exports = connectDB;
