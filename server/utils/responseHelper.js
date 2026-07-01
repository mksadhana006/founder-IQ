/**
 * utils/responseHelper.js
 * Standardized API response helpers.
 * Enforces the project's standard response format across all controllers.
 *
 * Success: { success: true, message, data }
 * Error:   { success: false, message, errors }
 */

const { HTTP } = require('../constants');

/**
 * Send a standardized success response.
 * @param {object} res - Express response object
 * @param {object} options
 * @param {string} options.message - Human-readable success message
 * @param {any}    options.data    - Response payload
 * @param {number} options.status  - HTTP status code (default: 200)
 */
const sendSuccess = (res, { message = 'Operation successful', data = null, status = HTTP.OK } = {}) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a standardized error response.
 * @param {object} res - Express response object
 * @param {object} options
 * @param {string}   options.message - Human-readable error message
 * @param {Array}    options.errors  - Array of validation/specific errors
 * @param {number}   options.status  - HTTP status code (default: 500)
 */
const sendError = (res, { message = 'An error occurred', errors = [], status = HTTP.INTERNAL_ERROR } = {}) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};

module.exports = { sendSuccess, sendError };
