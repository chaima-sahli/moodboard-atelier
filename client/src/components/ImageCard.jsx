import './ImageCard.css';

function ImageCard({ item, onUpdate, onDelete }) {
  const handleMouseDown = (e) => {
    // We'll implement drag later
  };

  return (
    <div 
      className="image-card"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
      }}
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
        onClick={() => onDelete(item.id)}
      >
        ×
      </button>
    </div>
  );
}

export default ImageCard;