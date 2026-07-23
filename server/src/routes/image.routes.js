import express from 'express';
import multer from 'multer';
import { imageController } from '../controllers/image.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

// All image routes require authentication
router.use(authenticate);

router.post('/', upload.single('image'), imageController.uploadSingle);
router.post('/batch', upload.array('images', 10), imageController.uploadMultiple);
router.delete('/:publicId', imageController.delete);

export default router;