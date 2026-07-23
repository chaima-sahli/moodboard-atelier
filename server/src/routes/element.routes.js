import express from 'express';
import { elementController } from '../controllers/element.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router({ mergeParams: true });

// All element routes require authentication
router.use(authenticate);

router.get('/', elementController.getAll);
router.post('/', elementController.create);
router.put('/:elementId', elementController.update);
router.patch('/bulk', elementController.bulkUpdate);
router.delete('/:elementId', elementController.delete);

export default router;