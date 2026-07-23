import Joi from 'joi';

// Common validation patterns
export const patterns = {
  hexColor: /^#[0-9a-fA-F]{6}$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

// Common validation schemas
export const commonValidators = {
  id: Joi.string().required(),
  userId: Joi.string().required(),
  title: Joi.string().min(1).max(100),
  position: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
  }),
  size: Joi.object({
    width: Joi.number().min(1).required(),
    height: Joi.number().min(1).required(),
  }),
  hexColor: Joi.string().pattern(patterns.hexColor),
  email: Joi.string().pattern(patterns.email),
  url: Joi.string().pattern(patterns.url),
};

// Validate MongoDB ObjectId
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Sanitize input
export const sanitize = {
  string: (str) => {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
  },
  email: (email) => {
    if (!email) return '';
    return email.toLowerCase().trim();
  },
  html: (str) => {
    if (!str) return '';
    // Basic HTML sanitization
    return str.replace(/<[^>]*>/g, '');
  },
};

// Validate required fields
export const validateRequired = (data, requiredFields) => {
  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  return true;
};