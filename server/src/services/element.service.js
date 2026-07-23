import Board from '../models/Board.model.js';
import Element from '../models/Element.model.js';

export const elementService = {
  // Get all elements for a board
  getElements: async (boardId, userId) => {
    // Verify board ownership
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      throw new Error('Board not found');
    }
    
    return board.elements;
  },
  
  // Get element by ID
  getElement: async (boardId, elementId, userId) => {
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      throw new Error('Board not found');
    }
    
    const element = board.elements.find(el => el.id === elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    return element;
  },
  
  // Create element
  createElement: async (boardId, userId, elementData) => {
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      throw new Error('Board not found');
    }
    
    const element = {
      id: new Board()._id.toString(), // Simple ID generation
      ...elementData,
      position: elementData.position || { x: 0, y: 0 },
      size: elementData.size || { width: 200, height: 150 },
      rotation: elementData.rotation || 0,
      opacity: elementData.opacity ?? 1,
      zIndex: elementData.zIndex || board.elements.length,
      frameId: elementData.frameId || null,
      data: elementData.data || {},
    };
    
    board.elements.push(element);
    await board.save();
    
    return element;
  },
  
  // Update element
  updateElement: async (boardId, elementId, userId, updates) => {
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      throw new Error('Board not found');
    }
    
    const elementIndex = board.elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) {
      throw new Error('Element not found');
    }
    
    const element = board.elements[elementIndex];
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'boardId') {
        element[key] = updates[key];
      }
    });
    
    await board.save();
    return element;
  },
  
  // Bulk update elements
  bulkUpdateElements: async (boardId, userId, elementIds, updates) => {
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      throw new Error('Board not found');
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
    return updatedCount;
  },
  
  // Delete element
  deleteElement: async (boardId, elementId, userId) => {
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      throw new Error('Board not found');
    }
    
    const elementIndex = board.elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) {
      throw new Error('Element not found');
    }
    
    board.elements.splice(elementIndex, 1);
    await board.save();
    
    return true;
  },
  
  // Delete all elements in a frame
  deleteElementsInFrame: async (boardId, frameId, userId) => {
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      throw new Error('Board not found');
    }
    
    board.elements = board.elements.filter(el => el.frameId !== frameId);
    await board.save();
    
    return board.elements.length;
  },
  
  // Reorder elements (change zIndex)
  reorderElements: async (boardId, userId, elementOrder) => {
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      throw new Error('Board not found');
    }
    
    elementOrder.forEach((elementId, index) => {
      const element = board.elements.find(el => el.id === elementId);
      if (element) {
        element.zIndex = index;
      }
    });
    
    await board.save();
    return board.elements;
  },
};