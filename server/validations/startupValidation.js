/**
 * validations/startupValidation.js
 * Input validation rules for startup submission routes.
 */

const { body } = require('express-validator');

const createStartupValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Startup title is required.')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),

  body('problemStatement')
    .trim()
    .notEmpty().withMessage('Problem statement is required.')
    .isLength({ min: 20, max: 1000 })
    .withMessage('Problem statement must be between 20 and 1000 characters.'),

  body('targetUsers')
    .trim()
    .notEmpty().withMessage('Target users description is required.')
    .isLength({ min: 10, max: 500 })
    .withMessage('Target users must be between 10 and 500 characters.'),

  body('keyFeatures')
    .isArray({ min: 1, max: 10 })
    .withMessage('Provide between 1 and 10 key features.')
    .custom((arr) => arr.every((f) => typeof f === 'string' && f.trim().length > 0))
    .withMessage('Each key feature must be a non-empty string.'),

  body('industry')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Industry cannot exceed 50 characters.'),
];

module.exports = { createStartupValidation };
