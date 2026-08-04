import { useState } from 'react';
import { useDrag } from '../hooks/useDrag';
import './StickyNote.css';

function StickyNote({ item, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);
  const { elementRef, handleMouseDown, isDragging, position, style } = useDrag(item, onUpdate);

  const handleDoubleClick = (e) => {
    // Prevent drag from triggering on double click
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text.trim() !== item.text) {
      onUpdate(item.id, { text: text.trim() || 'Write something...' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText(item.text);
    }
  };

  // Prevent drag when clicking on textarea
  const handleTextMouseDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      ref={elementRef}
      className={`sticky-note ${isDragging ? 'dragging' : ''}`}
      style={{
        ...style,
        left: position.x,
        top: position.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
        backgroundColor: item.color,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Tape corner decorations */}
      <div className="tape tape-top-left"></div>
      <div className="tape tape-top-right"></div>
      <div className="tape tape-bottom-left"></div>
      <div className="tape tape-bottom-right"></div>

      {isEditing ? (
        <textarea
          className="note-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onMouseDown={handleTextMouseDown}
          autoFocus
          style={{ 
            backgroundColor: item.color,
          }}
        />
      ) : (
        <p 
          className="note-text" 
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleTextMouseDown}
        >
          {item.text}
        </p>
      )}

      <button 
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
      >
        ×
      </button>
    </div>
  );
}

export default StickyNote;