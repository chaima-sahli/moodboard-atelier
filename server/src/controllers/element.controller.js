import Board from '../models/Board.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import { ELEMENT_TYPES, DEFAULT_ELEMENT_SIZE } from '../utils/constants.js';
import mongoose from 'mongoose';

export const elementController = {
  // Get all elements for a board
  getAll: async (req, res, next) => {
    try {
      const board = await Board.findOne({
        _id: req.params.boardId,
        userId: req.userId,
      });
      
      if (!board) {
        return apiResponse.notFound(res, 'Board not found');
      }
      
      return apiResponse.success(res, board.elements, 'Elements fetched successfully');
    } catch (error) {
      next(error);
    }
  },
  
  // Create element
  create: async (req, res, next) => {
    try {
      const board = await Board.findOne({
        _id: req.params.boardId,
        userId: req.userId,
      });
      
      if (!board) {
        return apiResponse.notFound(res, 'Board not found');
      }
      
      const elementData = {
        type: req.body.type,
        position: req.body.position || { x: 0, y: 0 },
        size: req.body.size || DEFAULT_ELEMENT_SIZE,
        rotation: req.body.rotation || 0,
        opacity: req.body.opacity ?? 1,
        zIndex: req.body.zIndex || board.elements.length,
        frameId: req.body.frameId || null,
        data: req.body.data || {},
      };
      
      const newElement = board.addElement(elementData);
      await board.save();
      
      return apiResponse.created(res, newElement, 'Element created successfully');
    } catch (error) {
      next(error);
    }
  },
  
  // Update element
  update: async (req, res, next) => {
    try {
      const board = await Board.findOne({
        _id: req.params.boardId,
        userId: req.userId,
      });
      
      if (!board) {
        return apiResponse.notFound(res, 'Board not found');
      }
      
      const updatedElement = board.updateElement(
        req.params.elementId,
        req.body
      );
      
      if (!updatedElement) {
        return apiResponse.notFound(res, 'Element not found');
      }
      
      await board.save();
      return apiResponse.success(res, updatedElement, 'Element updated successfully');
    } catch (error) {
      next(error);
    }
  },
  
  // Bulk update elements
  bulkUpdate: async (req, res, next) => {
    try {
      const { elementIds, updates } = req.body;
      
      if (!elementIds || !Array.isArray(elementIds) || elementIds.length === 0) {
        return apiResponse.badRequest(res, 'elementIds array required');
      }
      
      const board = await Board.findOne({
        _id: req.params.boardId,
        userId: req.userId,
      });
      
      if (!board) {
        return apiResponse.notFound(res, 'Board not found');
      }
      
      let updatedCount = 0;
      board.elements.forEach(element => {
        if (elementIds.includes(element.id)) {
          Object.keys(updates).forEach(key => {
            element[key] = updates[key];
          });
          updatedCount++;
        }
      });
      
      await board.save();
      return apiResponse.success(res, { updatedCount }, `${updatedCount} elements updated`);
    } catch (error) {
      next(error);
    }
  },
  
  // Delete element
  delete: async (req, res, next) => {
    try {
      const board = await Board.findOne({
        _id: req.params.boardId,
        userId: req.userId,
      });
      
      if (!board) {
        return apiResponse.notFound(res, 'Board not found');
      }
      
      const removedElement = board.removeElement(req.params.elementId);
      
      if (!removedElement) {
        return apiResponse.notFound(res, 'Element not found');
      }
      
      await board.save();
      return apiResponse.success(res, null, 'Element deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  },
};