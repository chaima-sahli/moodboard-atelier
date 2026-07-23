import mongoose from 'mongoose';
import { DEFAULT_SETTINGS } from '../utils/constants.js';

// Element schema
const elementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  type: {
    type: String,
    enum: ['note', 'image', 'color', 'shape', 'link'],
    required: true,
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  size: {
    width: { type: Number, default: 200 },
    height: { type: Number, default: 150 },
  },
  rotation: { type: Number, default: 0 },
  opacity: { type: Number, default: 1 },
  zIndex: { type: Number, default: 0 },
  frameId: { type: String, default: null },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, { _id: false });

// Frame schema
const frameSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  name: { type: String, default: 'Untitled Frame' },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  width: { type: Number, default: 1920 },
  height: { type: Number, default: 1080 },
}, { _id: false });

// Board schema
const boardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: 'Untitled Board',
    trim: true,
  },
  settings: {
    backgroundColor: { type: String, default: DEFAULT_SETTINGS.backgroundColor },
    gridSize: { type: Number, default: DEFAULT_SETTINGS.gridSize },
    snapToGrid: { type: Boolean, default: DEFAULT_SETTINGS.snapToGrid },
  },
  frames: [frameSchema],
  elements: [elementSchema],
}, {
  timestamps: true,
});

// Indexes
boardSchema.index({ userId: 1, updatedAt: -1 });

// Virtual for element count
boardSchema.virtual('elementCount').get(function() {
  return this.elements.length;
});

// Methods
boardSchema.methods.addElement = function(elementData) {
  const element = {
    id: new mongoose.Types.ObjectId().toString(),
    ...elementData,
  };
  this.elements.push(element);
  return element;
};

boardSchema.methods.removeElement = function(elementId) {
  const index = this.elements.findIndex(el => el.id === elementId);
  if (index === -1) return null;
  return this.elements.splice(index, 1)[0];
};

boardSchema.methods.updateElement = function(elementId, updates) {
  const element = this.elements.find(el => el.id === elementId);
  if (!element) return null;
  
  Object.keys(updates).forEach(key => {
    if (key !== 'id' && key !== 'boardId') {
      element[key] = updates[key];
    }
  });
  
  return element;
};

const Board = mongoose.model('Board', boardSchema);
export default Board;