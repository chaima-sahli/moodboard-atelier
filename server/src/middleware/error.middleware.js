import { apiResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return apiResponse.badRequest(res, 'Validation error', errors);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return apiResponse.badRequest(res, `Duplicate value for ${field}`, {
      field,
      value: err.keyValue[field],
    });
  }
  
  // Custom errors
  if (err.message === 'Board not found') {
    return apiResponse.notFound(res, 'Board not found');
  }
  
  if (err.message === 'Element not found') {
    return apiResponse.notFound(res, 'Element not found');
  }
  
  // Default error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';
    
  return apiResponse.error(res, message, statusCode);
};

// 404 handler for routes that don't exist
export const notFoundHandler = (req, res) => {
  apiResponse.notFound(res, `Route ${req.method} ${req.url} not found`);
};