import express from 'express';
import { boardController } from '../controllers/board.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All board routes require authentication
router.use(authenticate);

router.get('/', boardController.getAll);
router.get('/:boardId', boardController.getOne);
router.post('/', boardController.create);
router.put('/:boardId', boardController.update);
router.delete('/:boardId', boardController.delete);

export default router;