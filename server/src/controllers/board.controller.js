import Board from '../models/Board.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import { DEFAULT_SETTINGS } from '../utils/constants.js';

export const boardController = {
  // Get all boards for user
  getAll: async (req, res, next) => {
    try {
      const boards = await Board.find({ userId: req.userId })
        .sort({ updatedAt: -1 })
        .select('_id title userId createdAt updatedAt settings frames');
      
      return apiResponse.success(res, boards, 'Boards fetched successfully');
    } catch (error) {
      next(error);
    }
  },
  
  // Get single board with elements
  getOne: async (req, res, next) => {
    try {
      const board = await Board.findOne({
        _id: req.params.boardId,
        userId: req.userId,
      });
      
      if (!board) {
        return apiResponse.notFound(res, 'Board not found');
      }
      
      return apiResponse.success(res, board, 'Board fetched successfully');
    } catch (error) {
      next(error);
    }
  },
  
  // Create new board
  create: async (req, res, next) => {
    try {
      const board = new Board({
        userId: req.userId,
        title: req.body.title || 'Untitled Board',
        settings: req.body.settings || DEFAULT_SETTINGS,
        frames: req.body.frames || [],
      });
      
      await board.save();
      return apiResponse.created(res, board, 'Board created successfully');
    } catch (error) {
      next(error);
    }
  },
  
  // Update board
  update: async (req, res, next) => {
    try {
      const board = await Board.findOneAndUpdate(
        { _id: req.params.boardId, userId: req.userId },
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!board) {
        return apiResponse.notFound(res, 'Board not found');
      }
      
      return apiResponse.success(res, board, 'Board updated successfully');
    } catch (error) {
      next(error);
    }
  },
  
  // Delete board
  delete: async (req, res, next) => {
    try {
      const board = await Board.findOneAndDelete({
        _id: req.params.boardId,
        userId: req.userId,
      });
      
      if (!board) {
        return apiResponse.notFound(res, 'Board not found');
      }
      
      return apiResponse.success(res, null, 'Board deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  },
};