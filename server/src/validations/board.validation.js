import Joi from 'joi';

export const boardValidation = {
  create: Joi.object({
    title: Joi.string()
      .min(1)
      .max(100)
      .default('Untitled Board')
      .messages({
        'string.min': 'Title must be at least 1 character',
        'string.max': 'Title cannot exceed 100 characters',
      }),
    settings: Joi.object({
      backgroundColor: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/),
      gridSize: Joi.number().min(5).max(100),
      snapToGrid: Joi.boolean(),
    }),
    frames: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        x: Joi.number(),
        y: Joi.number(),
        width: Joi.number(),
        height: Joi.number(),
      })
    ),
  }),
  
  update: Joi.object({
    title: Joi.string()
      .min(1)
      .max(100)
      .messages({
        'string.min': 'Title must be at least 1 character',
        'string.max': 'Title cannot exceed 100 characters',
      }),
    settings: Joi.object({
      backgroundColor: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/),
      gridSize: Joi.number().min(5).max(100),
      snapToGrid: Joi.boolean(),
    }),
    frames: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        x: Joi.number(),
        y: Joi.number(),
        width: Joi.number(),
        height: Joi.number(),
      })
    ),
  }),
};