import express from 'express';
import { Element } from '../models/Element.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all elements for a board
router.get('/:boardId', verifyAuth, async (req, res, next) => {
  try {
    const elements = await Element.getAll(req.params.boardId, req.userId);
    res.json(elements);
  } catch (error) {
    next(error);
  }
});

// Create element
router.post('/:boardId', verifyAuth, async (req, res, next) => {
  try {
    const element = await Element.create(
      req.params.boardId,
      req.userId,
      req.body
    );
    res.status(201).json(element);
  } catch (error) {
    next(error);
  }
});

// Update element
router.put('/:boardId/:elementId', verifyAuth, async (req, res, next) => {
  try {
    const element = await Element.update(
      req.params.boardId,
      req.params.elementId,
      req.userId,
      req.body
    );
    res.json(element);
  } catch (error) {
    next(error);
  }
});

// Bulk update elements
router.patch('/:boardId/bulk', verifyAuth, async (req, res, next) => {
  try {
    const { elementIds, updates } = req.body;
    if (!elementIds || !Array.isArray(elementIds) || elementIds.length === 0) {
      return res.status(400).json({ error: 'elementIds array required' });
    }

    const result = await Element.bulkUpdate(
      req.params.boardId,
      req.userId,
      elementIds,
      updates
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Delete element
router.delete('/:boardId/:elementId', verifyAuth, async (req, res, next) => {
  try {
    await Element.delete(
      req.params.boardId,
      req.params.elementId,
      req.userId
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;