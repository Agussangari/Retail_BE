const { ZodError } = require('zod');
const { ValidationError } = require('../utils/errors');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      next(new ValidationError('Validation failed', details));
    } else {
      next(error);
    }
  }
};

module.exports = validate;
