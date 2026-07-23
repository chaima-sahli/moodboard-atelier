import { apiResponse } from '../utils/apiResponse.js';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));
        return apiResponse.badRequest(res, 'Validation failed', errors);
      }
      
      // Replace req.body with validated value
      req.body = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};