import Joi from 'joi';
import { ELEMENT_TYPES, SHAPE_TYPES } from '../utils/constants.js';

export const elementValidation = {
  create: Joi.object({
    type: Joi.string()
      .valid(...Object.values(ELEMENT_TYPES))
      .required()
      .messages({
        'any.required': 'Element type is required',
        'any.only': 'Invalid element type',
      }),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required(),
    }),
    size: Joi.object({
      width: Joi.number().min(1).required(),
      height: Joi.number().min(1).required(),
    }),
    rotation: Joi.number().min(-360).max(360),
    opacity: Joi.number().min(0).max(1),
    zIndex: Joi.number().min(0),
    frameId: Joi.string().allow(null),
    data: Joi.object({
      // Note-specific
      text: Joi.string().when('type', {
        is: ELEMENT_TYPES.NOTE,
        then: Joi.string().required(),
      }),
      fontSize: Joi.number().when('type', {
        is: ELEMENT_TYPES.NOTE,
        then: Joi.number().min(8).max(72),
      }),
      color: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/),
      backgroundColor: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/),
      
      // Color-specific
      hex: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/).when('type', {
        is: ELEMENT_TYPES.COLOR,
        then: Joi.string().required(),
      }),
      
      // Shape-specific
      shapeType: Joi.string().valid(...Object.values(SHAPE_TYPES)).when('type', {
        is: ELEMENT_TYPES.SHAPE,
        then: Joi.string().required(),
      }),
      fill: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/),
      stroke: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/),
      strokeWidth: Joi.number().min(0).max(20),
      
      // Link-specific
      url: Joi.string().uri().when('type', {
        is: ELEMENT_TYPES.LINK,
        then: Joi.string().uri().required(),
      }),
      title: Joi.string(),
      previewImage: Joi.string().uri(),
      
      // Image-specific
      cloudinaryUrl: Joi.string().uri().when('type', {
        is: ELEMENT_TYPES.IMAGE,
        then: Joi.string().uri().required(),
      }),
      crop: Joi.object({
        x: Joi.number(),
        y: Joi.number(),
        width: Joi.number(),
        height: Joi.number(),
      }),
    }).required(),
  }),
  
  update: Joi.object({
    position: Joi.object({
      x: Joi.number(),
      y: Joi.number(),
    }),
    size: Joi.object({
      width: Joi.number().min(1),
      height: Joi.number().min(1),
    }),
    rotation: Joi.number().min(-360).max(360),
    opacity: Joi.number().min(0).max(1),
    zIndex: Joi.number().min(0),
    frameId: Joi.string().allow(null),
    data: Joi.object(),
  }),
  
  bulkUpdate: Joi.object({
    elementIds: Joi.array()
      .items(Joi.string())
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one element ID is required',
        'any.required': 'elementIds array is required',
      }),
    updates: Joi.object({
      position: Joi.object({
        x: Joi.number(),
        y: Joi.number(),
      }),
      size: Joi.object({
        width: Joi.number().min(1),
        height: Joi.number().min(1),
      }),
      rotation: Joi.number().min(-360).max(360),
      opacity: Joi.number().min(0).max(1),
      zIndex: Joi.number().min(0),
      frameId: Joi.string().allow(null),
    }).required(),
  }),
};