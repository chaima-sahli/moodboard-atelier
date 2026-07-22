import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

// Upload single image
router.post('/', verifyAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary
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

      // Convert buffer to stream
      const bufferStream = require('stream').Readable.from(req.file.buffer);
      bufferStream.pipe(uploadStream);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    next(error);
  }
});

// Upload multiple images
router.post('/batch', verifyAuth, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
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
    res.json({
      success: true,
      images: results,
    });
  } catch (error) {
    next(error);
  }
});

// Delete image from Cloudinary
router.delete('/:publicId', verifyAuth, async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ success: true, result });
  } catch (error) {
    next(error);
  }
});

export default router;