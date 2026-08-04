import  { useState, useEffect, useImperativeHandle  } from 'react';
import ImageCard from './ImageCard';
import StickyNote from './StickyNote';
import './Board.css';

function Board({}, ref) {
  const [items, setItems] = useState([]);

  // Load items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('moodboardItems');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Save items to localStorage
  useEffect(() => {
    localStorage.setItem('moodboardItems', JSON.stringify(items));
  }, [items]);

  useImperativeHandle(ref, () => ({
    addImage: (imageData) => {
      const newItem = {
        id: Date.now() + Math.random(),
        type: 'image',
        url: imageData,
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
        rotation: (Math.random() - 0.5) * 4,
        width: 200,
        height: 200,
      };
      setItems([...items, newItem]);
    },
    addNote: () => {
      const colors = ['#fce4c8', '#f8d5d5', '#d5e8d5', '#d5d5f0', '#f0e6d5', '#e8d5f0'];
      const newItem = {
        id: Date.now() + Math.random(),
        type: 'note',
        text: 'Double-click to edit ✏️',
        color: colors[Math.floor(Math.random() * colors.length)],
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
        rotation: (Math.random() - 0.5) * 6,
        width: 180,
        height: 160,
      };
      setItems([...items, newItem]);
    }
  }));


  const addImage = (imageData) => {
    const newItem = {
      id: Date.now() + Math.random(),
      type: 'image',
      url: imageData,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      rotation: (Math.random() - 0.5) * 4,
      width: 200,
      height: 200,
    };
    setItems([...items, newItem]);
  };

  const addNote = () => {
    const colors = ['#fce4c8', '#f8d5d5', '#d5e8d5', '#d5d5f0', '#f0e6d5', '#e8d5f0'];
    const newItem = {
      id: Date.now() + Math.random(),
      type: 'note',
      text: 'Write something...',
      color: colors[Math.floor(Math.random() * colors.length)],
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      rotation: (Math.random() - 0.5) * 6,
      width: 180,
      height: 160,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id, updates) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="board">
      <div className="board-content">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🖼️</div>
            <h2>Your creative space awaits</h2>
            <p>Add images or sticky notes to start your moodboard</p>
          </div>
        ) : (
          items.map((item) => {
            if (item.type === 'image') {
              return (
                <ImageCard
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                />
              );
            } else if (item.type === 'note') {
              return (
                <StickyNote
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                />
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
}

export default Board;