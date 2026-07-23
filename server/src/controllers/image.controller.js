import cloudinary from '../config/cloudinary.js';
import { apiResponse } from '../utils/apiResponse.js';

export const imageController = {
  // Upload single image
  uploadSingle: async (req, res, next) => {
    try {
      if (!req.file) {
        return apiResponse.badRequest(res, 'No image file provided');
      }
      
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'moodboard-app',
            resource_type: 'auto',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        const bufferStream = require('stream').Readable.from(req.file.buffer);
        bufferStream.pipe(uploadStream);
      });
      
      return apiResponse.success(res, {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      }, 'Image uploaded successfully');
      
    } catch (error) {
      next(error);
    }
  },
  
  // Upload multiple images
  uploadMultiple: async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return apiResponse.badRequest(res, 'No image files provided');
      }
      
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'moodboard-app',
              resource_type: 'auto',
              transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
              });
            }
          );
          
          const bufferStream = require('stream').Readable.from(file.buffer);
          bufferStream.pipe(uploadStream);
        });
      });
      
      const results = await Promise.all(uploadPromises);
      return apiResponse.success(res, { images: results }, `${results.length} images uploaded successfully`);
      
    } catch (error) {
      next(error);
    }
  },
  
  // Delete image
  delete: async (req, res, next) => {
    try {
      const result = await cloudinary.uploader.destroy(req.params.publicId);
      return apiResponse.success(res, result, 'Image deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};