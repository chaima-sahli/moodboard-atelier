import './Header.css';

function Header({ onAddImage, onAddNote }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1>
          <span>✦</span> Moodboard Studio <span>✦</span>
        </h1>
      </div>
      <div className="header-actions">
        <button className="header-btn header-btn-primary" onClick={onAddImage}>
          📎 Add Image
        </button>
        <button className="header-btn header-btn-note" onClick={onAddNote}>
          📝 Add Note
        </button>
        <input 
          type="file" 
          id="fileInput" 
          accept="image/*" 
          multiple 
          style={{ display: 'none' }} 
        />
      </div>
    </header>
  );
}

export default Header;