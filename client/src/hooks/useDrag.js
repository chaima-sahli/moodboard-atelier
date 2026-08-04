import { useState, useRef, useEffect } from 'react';

export function useDrag(item, onUpdate) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: item.x, y: item.y });
  const elementRef = useRef(null);

  // Update position when item prop changes (e.g., from localStorage load)
  useEffect(() => {
    setPosition({ x: item.x, y: item.y });
  }, [item.x, item.y]);

  const handleMouseDown = (e) => {
    // Only drag with left mouse button
    if (e.button !== 0) return;
    
    // Don't drag if clicking on delete button or textarea
    if (e.target.closest('.delete-btn') || e.target.closest('textarea')) return;

    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Add a slight delay to prevent accidental drag on click
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      // Get the board's bounding rect for boundaries
      const board = elementRef.current?.closest('.board-content');
      const boardRect = board?.getBoundingClientRect();
      
      if (!boardRect) return;

      // Calculate new position relative to board
      let newX = e.clientX - boardRect.left - dragOffset.x;
      let newY = e.clientY - boardRect.top - dragOffset.y;

      // Keep within board bounds (with padding)
      const padding = 20;
      const elementWidth = elementRef.current?.offsetWidth || 200;
      const elementHeight = elementRef.current?.offsetHeight || 200;

      newX = Math.max(padding, Math.min(newX, boardRect.width - elementWidth - padding));
      newY = Math.max(padding, Math.min(newY, boardRect.height - elementHeight - padding));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Save the final position
      onUpdate(item.id, { x: position.x, y: position.y });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, item.id, onUpdate, position]);

  return {
    elementRef,
    handleMouseDown,
    isDragging,
    position,
    style: {
      left: position.x,
      top: position.y,
      cursor: isDragging ? 'grabbing' : 'grab',
      zIndex: isDragging ? 100 : 'auto',
      transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
      userSelect: isDragging ? 'none' : 'auto'
    }
  };
}