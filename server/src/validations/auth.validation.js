import Joi from 'joi';

export const authValidation = {
  register: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
      }),
    name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required',
      }),
  }),
  
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required',
      }),
  }),
  
  changePassword: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required',
      }),
    newPassword: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'New password must be at least 6 characters',
        'any.required': 'New password is required',
      }),
  }),
  
  updateProfile: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 50 characters',
      }),
    preferences: Joi.object({
      theme: Joi.string().valid('light', 'dark'),
      defaultBoardSettings: Joi.object({
        backgroundColor: Joi.string(),
        gridSize: Joi.number(),
        snapToGrid: Joi.boolean(),
      }),
    }),
  }),
};