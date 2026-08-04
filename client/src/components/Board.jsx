import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import ImageCard from './ImageCard';
import StickyNote from './StickyNote';
import './Board.css';

const Board = forwardRef(function Board(props, ref) {
  // Lazy initializer: runs once on mount, no effect needed
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('moodboardItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
      // Functional update avoids stale closure over `items`
      setItems((prev) => [...prev, newItem]);
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
      setItems((prev) => [...prev, newItem]);
    }
  }), []); // empty deps is fine here since we use functional updates

  const updateItem = (id, updates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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
});

export default Board;