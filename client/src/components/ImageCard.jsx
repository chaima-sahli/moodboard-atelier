import { useDrag } from '../hooks/useDrag';
import './ImageCard.css';

function ImageCard({ item, onUpdate, onDelete }) {
  const { elementRef, handleMouseDown, isDragging, position, style } = useDrag(item, onUpdate);

  return (
    <div 
      ref={elementRef}
      className={`image-card ${isDragging ? 'dragging' : ''}`}
      style={{
        ...style,
        left: position.x,
        top: position.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
    >
      <img src={item.url} alt="Moodboard item" />
      
      {/* Pushpin */}
      <div className="pushpin">
        <svg viewBox="0 0 24 24" fill="#c0392b">
          <circle cx="12" cy="5" r="4" />
          <rect x="11" y="9" width="2" height="14" />
          <circle cx="12" cy="22" r="2" fill="#e74c3c" />
        </svg>
      </div>
      
      {/* Delete button */}
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

export default ImageCard;