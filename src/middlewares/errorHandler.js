const { BaseError } = require('../utils/errors');
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, details: err.details });

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  // Handle pg unique violation
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'UNIQUE_VIOLATION',
        message: 'A record with this information already exists',
        details: err.detail
      }
    });
  }

  // Handle pg foreign key violation
  if (err.code === '23503') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'FOREIGN_KEY_VIOLATION',
        message: 'This record is referenced by other records',
        details: err.detail
      }
    });
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: null
    }
  });
};

module.exports = errorHandler;
