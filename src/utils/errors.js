class BaseError extends Error {
  constructor(message, statusCode, code, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class NotFoundError extends BaseError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
  }
}

class ValidationError extends BaseError {
  constructor(message, details) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class BusinessError extends BaseError {
  constructor(message, code = 'BUSINESS_ERROR') {
    super(message, 400, code);
  }
}

module.exports = {
  BaseError,
  NotFoundError,
  ValidationError,
  BusinessError
};
