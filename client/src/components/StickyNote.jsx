import  { useState } from 'react';
import './StickyNote.css';

function StickyNote({ item, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);

  const handleDoubleClick = () => {
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

  return (
    <div 
      className="sticky-note"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
        backgroundColor: item.color,
      }}
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
          autoFocus
          style={{ 
            backgroundColor: item.color,
            fontFamily: "'Caveat', cursive"
          }}
        />
      ) : (
        <p 
          className="note-text" 
          onDoubleClick={handleDoubleClick}
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          {item.text}
        </p>
      )}

      <button 
        className="delete-btn"
        onClick={() => onDelete(item.id)}
      >
        ×
      </button>
    </div>
  );
}

export default StickyNote;