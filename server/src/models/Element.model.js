import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
    index: true,
  },
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
  opacity: { type: Number, default: 1, min: 0, max: 1 },
  zIndex: { type: Number, default: 0 },
  frameId: { type: String, default: null },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
elementSchema.index({ boardId: 1, zIndex: 1 });
elementSchema.index({ boardId: 1, frameId: 1 });

// Static methods
elementSchema.statics.findByBoard = function(boardId) {
  return this.find({ boardId }).sort({ zIndex: 1 });
};

elementSchema.statics.findByFrame = function(boardId, frameId) {
  return this.find({ boardId, frameId }).sort({ zIndex: 1 });
};

// Instance methods
elementSchema.methods.updateData = function(updates) {
  Object.keys(updates).forEach(key => {
    if (key !== 'id' && key !== 'boardId' && key !== '_id') {
      this[key] = updates[key];
    }
  });
  return this;
};

// Virtual for element type display name
elementSchema.virtual('typeDisplayName').get(function() {
  const names = {
    note: 'Note',
    image: 'Image',
    color: 'Color Swatch',
    shape: 'Shape',
    link: 'Link',
  };
  return names[this.type] || this.type;
});

const Element = mongoose.model('Element', elementSchema);
export default Element;