import Board from '../models/Board.model.js';
import Element from '../models/Element.model.js';
import { DEFAULT_SETTINGS } from '../utils/constants.js';

export const boardService = {
  // Get all boards for user
  getAllBoards: async (userId) => {
    return await Board.find({ userId })
      .sort({ updatedAt: -1 })
      .select('_id title userId createdAt updatedAt settings frames');
  },
  
  // Get single board with elements
  getBoard: async (boardId, userId) => {
    const board = await Board.findOne({
      _id: boardId,
      userId,
    });
    
    if (!board) {
      throw new Error('Board not found');
    }
    
    return board;
  },
  
  // Create board
  createBoard: async (userId, data) => {
    const board = new Board({
      userId,
      title: data.title || 'Untitled Board',
      settings: data.settings || DEFAULT_SETTINGS,
      frames: data.frames || [],
    });
    
    await board.save();
    return board;
  },
  
  // Update board
  updateBoard: async (boardId, userId, updates) => {
    const board = await Board.findOneAndUpdate(
      { _id: boardId, userId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!board) {
      throw new Error('Board not found');
    }
    
    return board;
  },
  
  // Delete board and all elements
  deleteBoard: async (boardId, userId) => {
    const board = await Board.findOneAndDelete({
      _id: boardId,
      userId,
    });
    
    if (!board) {
      throw new Error('Board not found');
    }
    
    // Delete all associated elements
    await Element.deleteMany({ boardId });
    
    return board;
  },
  
  // Duplicate board
  duplicateBoard: async (boardId, userId) => {
    const original = await Board.findOne({
      _id: boardId,
      userId,
    });
    
    if (!original) {
      throw new Error('Board not found');
    }
    
    // Create new board with duplicate data
    const newBoard = new Board({
      userId,
      title: `${original.title} (Copy)`,
      settings: original.settings,
      frames: original.frames,
      elements: original.elements.map(el => ({
        ...el,
        id: undefined, // Let MongoDB generate new IDs
      })),
    });
    
    await newBoard.save();
    return newBoard;
  },
};