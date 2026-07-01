/**
 * middleware/validate.js
 * Express-validator error aggregation middleware.
 * Place after validation rules in a route definition.
 * Returns standardized 400 response if any input is invalid.
 */

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHelper');
const { HTTP } = require('../constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return sendError(res, {
      message: 'Input validation failed. Please correct the highlighted fields.',
      errors: errorMessages,
      status: HTTP.BAD_REQUEST,
    });
  }

  next();
};

module.exports = validate;
