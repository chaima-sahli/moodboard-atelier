import express from 'express';
import { Board } from '../models/Board.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all boards for user
router.get('/', verifyAuth, async (req, res, next) => {
  try {
    const boards = await Board.getAll(req.userId);
    res.json(boards);
  } catch (error) {
    next(error);
  }
});

// Create new board
router.post('/', verifyAuth, async (req, res, next) => {
  try {
    const board = await Board.create(req.userId, req.body);
    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
});

// Get single board with elements
router.get('/:id', verifyAuth, async (req, res, next) => {
  try {
    const board = await Board.getById(req.params.id, req.userId);
    res.json(board);
  } catch (error) {
    next(error);
  }
});

// Update board
router.put('/:id', verifyAuth, async (req, res, next) => {
  try {
    const board = await Board.update(req.params.id, req.userId, req.body);
    res.json(board);
  } catch (error) {
    next(error);
  }
});

// Delete board
router.delete('/:id', verifyAuth, async (req, res, next) => {
  try {
    await Board.delete(req.params.id, req.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;